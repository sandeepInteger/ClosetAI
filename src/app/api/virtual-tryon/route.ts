import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ApiError, fal } from "@fal-ai/client";

/** URLs already on Fal CDN can be passed through to the model. */
function isFalHostedImageUrl(url: string): boolean {
  return /(?:^https?:\/\/)(?:v3\.)?fal\.media\//i.test(url);
}

/**
 * Fal must fetch `human_image_url` and `garment_image_url`. Cloudinary and some hosts
 * return 403 to Fal's fetchers; uploading to Fal storage avoids that.
 */
async function ensureFalAccessibleImageUrl(imageUrl: string): Promise<string> {
  if (!imageUrl || typeof imageUrl !== "string") {
    throw new Error("Missing image URL");
  }
  if (imageUrl.startsWith("data:")) {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return fal.storage.upload(blob);
  }
  if (isFalHostedImageUrl(imageUrl)) {
    return imageUrl;
  }

  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error(
      `Could not download image (${imageResponse.status}). The URL may be private or expired.`,
    );
  }
  const contentType =
    imageResponse.headers.get("content-type") ?? "image/jpeg";
  const arrayBuffer = await imageResponse.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: contentType });
  return fal.storage.upload(blob);
}

function clientMessageFromUnknownError(error: unknown): string {
  if (error instanceof ApiError) {
    console.error("Fal ApiError:", error.status, error.message, error.body);
    if (error.status === 403) {
      return (
        "The AI provider blocked this request (403). Check that FAL_KEY is valid, your Fal account " +
        "has access to “Kling Kolors Virtual Try-On”, and billing/limits are OK on fal.ai."
      );
    }
    return error.message || "Failed to generate try-on image";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Failed to generate try-on image";
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    if (!process.env.FAL_KEY?.trim()) {
      return NextResponse.json(
        { error: "Server is missing FAL_KEY for virtual try-on." },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { humanImage, clothingItems } = body;

    if (
      !humanImage ||
      !clothingItems ||
      !Array.isArray(clothingItems) ||
      clothingItems.length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 },
      );
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          fal.config({ credentials: process.env.FAL_KEY });

          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "progress",
                message: "Preparing images for the AI provider…",
                progress: 0,
                totalItems: clothingItems.length,
              }) + "\n",
            ),
          );

          let currentImage = await ensureFalAccessibleImageUrl(
            humanImage as string,
          );

          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "progress",
                message: "Starting virtual try-on process...",
                progress: 0,
                totalItems: clothingItems.length,
              }) + "\n",
            ),
          );

          for (let i = 0; i < clothingItems.length; i++) {
            const item = clothingItems[i];
            if (!item.imageUrl) continue;

            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  type: "progress",
                  message: `Processing ${item.category}...`,
                  progress: i,
                  totalItems: clothingItems.length,
                  currentItem: item.category,
                }) + "\n",
              ),
            );

            const garmentImageUrl = await ensureFalAccessibleImageUrl(
              item.imageUrl as string,
            );

            const response = await fal.subscribe(
              "fal-ai/kling/v1-5/kolors-virtual-try-on",
              {
                input: {
                  human_image_url: currentImage,
                  garment_image_url: garmentImageUrl,
                },
                logs: true,
                onQueueUpdate: (update) => {
                  if (update.status === "IN_PROGRESS") {
                    const logMessages = (update.logs ?? []).map(
                      (log) => log.message,
                    );
                    controller.enqueue(
                      encoder.encode(
                        JSON.stringify({
                          type: "modelProgress",
                          message: logMessages.join(", "),
                          progress: i,
                          totalItems: clothingItems.length,
                          currentItem: item.category,
                        }) + "\n",
                      ),
                    );
                  }
                },
              },
            );

            if (response?.data?.image?.url) {
              currentImage = response.data.image.url;

              controller.enqueue(
                encoder.encode(
                  JSON.stringify({
                    type: "itemComplete",
                    message: `${item.category} applied successfully!`,
                    progress: i + 1,
                    totalItems: clothingItems.length,
                    currentItem: item.category,
                    intermediateImage: currentImage,
                  }) + "\n",
                ),
              );
            } else {
              console.error(
                "No result image returned from Fal.ai for item:",
                item,
              );
              controller.enqueue(
                encoder.encode(
                  JSON.stringify({
                    type: "error",
                    message: `Failed to apply ${item.category}`,
                    progress: i,
                    totalItems: clothingItems.length,
                    currentItem: item.category,
                  }) + "\n",
                ),
              );
            }
          }

          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "complete",
                message: "Virtual try-on complete!",
                progress: clothingItems.length,
                totalItems: clothingItems.length,
                resultImage: currentImage,
              }) + "\n",
            ),
          );

          controller.close();
        } catch (error) {
          console.error("Error in stream:", error);
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "error",
                message: clientMessageFromUnknownError(error),
              }) + "\n",
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in virtual try-on API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
