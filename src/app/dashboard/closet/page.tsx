"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  FaPlus,
  FaSearch,
  FaTshirt,
  FaShoePrints,
  FaHatCowboy,
  FaSocks,
  FaHeart,
  FaTimes,
  FaCamera,
  FaUpload,
} from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
//import { useAuth } from "@/context/AuthContext";

// Types
type ClothingCategory =
  | "All"
  | "Tops"
  | "Bottoms"
  | "Shoes"
  | "Accessories"
  | "Outerwear";

interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  tags: string[];
  imageUrl: string;
  favorite: boolean;
  lastWorn?: Date;
}

interface AddItemModalProps {
  onClose: () => void;
  onAddItem: (item: ClothingItem) => void;
  categories: { label: ClothingCategory; icon: React.ReactNode }[];
}

const AddItemModal = ({
  onClose,
  onAddItem,
  categories,
}: AddItemModalProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ClothingCategory>("Tops");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [favorite, setFavorite] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const availableTags = [
    "Casual",
    "Formal",
    "Party",
    "Office",
    "Summer",
    "Winter",
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageLoading(true);
      try {
        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          throw new Error(
            "File size too large. Please choose an image under 5MB."
          );
        }
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
          setImageLoading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert(error instanceof Error ? error.message : "Error uploading image");
        setImageLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !name) {
      alert("Please select an image and provide a name");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("name", name);
      formData.append("category", category);
      formData.append("favorite", favorite.toString());

      // Add all selected tags to the form data
      selectedTags.forEach((tag) => {
        formData.append("tags", tag);
      });

      const response = await fetch("/api/clothing", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const { data } = await response.json();
      onAddItem(data);
      onClose();
    } catch (error) {
      console.error("Error:", error);
      let errorMessage = "Failed to add item. Please try again.";
      if (error instanceof Error) {
        errorMessage += ` (${error.message})`;
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex max-h-dvh items-center justify-center overflow-y-auto bg-sw-ink/50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-2xl border border-sw-border bg-sw-surface shadow-xl"
      >
        <form
          onSubmit={handleSubmit}
          className="p-4 md:p-6 space-y-4 md:space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-sw-ink md:text-xl">
              Add piece
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-sw-ink-muted transition hover:bg-sw-surface-muted hover:text-sw-ink"
            >
              <FaTimes />
            </button>
          </div>

          {/* Image Upload */}
          <div>
            <label className="mb-2 block text-sm font-medium text-sw-ink-muted">
              Image
            </label>
            <div className="relative flex justify-center rounded-xl border-2 border-dashed border-sw-border-strong bg-sw-surface-muted/50 p-4">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-sw-surface/60">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-sw-border border-t-sw-accent" />
                </div>
              )}
              {preview ? (
                <div className="relative">
                  <Image
                    src={preview}
                    alt="Preview"
                    width={160}
                    height={160}
                    className="h-40 w-40 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setPreview("");
                    }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                  <label className="flex cursor-pointer items-center justify-center space-x-2 rounded-xl border border-sw-border bg-sw-surface px-4 py-2.5 text-sm font-medium text-sw-ink transition hover:border-sw-accent-ring hover:bg-sw-accent-soft/40">
                    <FaCamera className="text-sw-ink-muted" />
                    <span>Take photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <label className="flex cursor-pointer items-center justify-center space-x-2 rounded-xl border border-sw-border bg-sw-surface px-4 py-2.5 text-sm font-medium text-sw-ink transition hover:border-sw-accent-ring hover:bg-sw-accent-soft/40">
                    <FaUpload className="text-sw-ink-muted" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-sw-ink-muted">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-sw-border bg-sw-surface px-4 py-2.5 text-sw-ink outline-none ring-sw-accent-ring transition focus:border-sw-accent focus:ring-2 focus:ring-sw-accent-ring/50"
              required
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-sw-ink-muted">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ClothingCategory)}
              className="w-full rounded-xl border border-sw-border bg-sw-surface px-4 py-2.5 text-sw-ink outline-none focus:border-sw-accent focus:ring-2 focus:ring-sw-accent-ring/50"
            >
              {categories.map((cat) => (
                <option key={cat.label} value={cat.label}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-sw-ink-muted">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    selectedTags.includes(tag)
                      ? "bg-sw-accent text-white shadow-sm"
                      : "border border-sw-border bg-sw-surface-muted text-sw-ink-muted hover:border-sw-accent-ring hover:text-sw-ink"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Favorite Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="favorite"
              checked={favorite}
              onChange={(e) => setFavorite(e.target.checked)}
              className="mr-2 h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
            />
            <label
              htmlFor="favorite"
              className="text-sm font-medium text-gray-700"
            >
              Mark as favorite
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !image || !name}
            className={`w-full py-3 rounded-lg font-medium transition-colors
              ${
                loading || !image || !name
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
          >
            {loading ? "Adding..." : "Add Item"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default function ClosetPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ClothingCategory>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/auth/signin");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchClothingItems = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/clothing");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch clothing items"
          );
        }

        const { data } = await response.json();
        const transformedData = data.map((item: ClothingItem) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          tags: item.tags || [],
          imageUrl: item.imageUrl,
          favorite: item.favorite,
          lastWorn: item.lastWorn ? new Date(item.lastWorn) : undefined,
        }));

        setClothingItems(transformedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching clothing items:", err);
        setError("Failed to load your closet items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClothingItems();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const categories: { label: ClothingCategory; icon: React.ReactNode }[] = [
    { label: "All", icon: <FaTshirt /> },
    { label: "Tops", icon: <FaTshirt /> },
    { label: "Bottoms", icon: <FaSocks /> },
    { label: "Shoes", icon: <FaShoePrints /> },
    { label: "Accessories", icon: <FaHatCowboy /> },
    { label: "Outerwear", icon: <FaShoePrints /> },
  ];

  const handleAddItem = (newItem: ClothingItem) => {
    setClothingItems((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);
  };

  const filteredItems = clothingItems.filter((item) => {
    if (selectedCategory !== "All" && item.category !== selectedCategory)
      return false;
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col bg-white">
      {/* Sticky Header Section */}
      <div className="sticky top-0 left-0 right-0 z-10 bg-white pt-[max(3.5rem,env(safe-area-inset-top,0px))] md:pt-0">
        {/* Header */}
        <header className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Smart Closet</h1>
          
        </header>

        {/* Search Bar */}
        <div className="px-4 py-2 border-b border-gray-100 w-full">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search your closet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="border-b border-gray-100 w-full">
          <div className="px-4 py-2 flex space-x-2 overflow-x-auto no-scrollbar">
            {categories.map((category) => (
              <button
                key={category.label}
                onClick={() => setSelectedCategory(category.label)}
                className={`flex-none px-4 py-2 rounded-full whitespace-nowrap text-sm
                  ${
                    selectedCategory === category.label
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="w-full pb-20">
        <div className="p-4">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg my-4">
              {error}
            </div>
          )}

          {/* Clothing Grid */}
          {!loading && !error && filteredItems.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
                >
                  <div className="aspect-square relative">
                    <Image
                      src={item.imageUrl}
                      width={500}
                      height={500}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-image.jpg";
                      }}
                    />

                    {item.favorite && (
                      <div className="absolute top-2 right-2 text-red-500">
                        <FaHeart />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <h3 className="text-sm font-medium text-gray-800 truncate">
                      {item.name}
                    </h3>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-1.5 py-0.5 bg-gray-100 rounded-full text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{item.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">
                <FaTshirt className="mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                Your closet is empty
              </h3>
              <p className="text-gray-500 mb-6">
                Add your first clothing item to get started
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Add New Item
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg"
        >
          <FaPlus className="w-6 h-6" />
        </button>
      </div>

      {/* Add Item Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddItemModal
            onClose={() => setIsAddModalOpen(false)}
            onAddItem={handleAddItem}
            categories={categories}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
