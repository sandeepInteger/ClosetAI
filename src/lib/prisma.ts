import { PrismaClient, type Prisma } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

/**
 * Single Prisma client for the whole app (avoids exhausting Neon connections in dev).
 *
 * For `*.neon.tech` hosts we use Prisma's Neon driver adapter (WebSockets / serverless
 * path). That avoids many "can't reach database" cases from cold starts, TCP pooler
 * quirks, and stricter firewalls vs raw TCP :5432.
 *
 * Other Postgres URLs keep the default engine + optional pgbouncer query params.
 */
function isNeonHost(hostname: string): boolean {
  return hostname.endsWith("neon.tech");
}

function normalizeUrl(raw: string, opts: { neonAdapter: boolean }): string {
  const u = new URL(raw);
  if (!u.searchParams.has("sslmode")) {
    u.searchParams.set("sslmode", "require");
  }
  if (isNeonHost(u.hostname)) {
    if (!u.searchParams.has("connect_timeout")) {
      u.searchParams.set("connect_timeout", "25");
    }
    if (opts.neonAdapter) {
      u.searchParams.delete("pgbouncer");
    } else if (u.hostname.includes("pooler") && !u.searchParams.has("pgbouncer")) {
      u.searchParams.set("pgbouncer", "true");
    }
  }
  return u.toString();
}

function createPrismaClient(): PrismaClient {
  const raw = process.env.DATABASE_URL;
  const log: Prisma.LogLevel[] =
    process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];

  if (!raw?.trim()) {
    return new PrismaClient({ log });
  }

  let hostname: string;
  try {
    hostname = new URL(raw).hostname;
  } catch {
    return new PrismaClient({ datasources: { db: { url: raw } }, log });
  }

  if (isNeonHost(hostname)) {
    neonConfig.webSocketConstructor = ws;
    const connectionString = normalizeUrl(raw, { neonAdapter: true });
    const adapter = new PrismaNeon({ connectionString });
    return new PrismaClient({ adapter, log });
  }

  const connectionString = normalizeUrl(raw, { neonAdapter: false });
  return new PrismaClient({
    datasources: { db: { url: connectionString } },
    log,
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/** Reuse one client per runtime (dev HMR + warm serverless) to avoid flaky DB connections on sign-in. */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;
