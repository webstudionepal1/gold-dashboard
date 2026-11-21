import { NextRequest } from "next/server";
import { apiRouter } from "@/lib/api/router";
import { apiError } from "@/lib/api-response";

type RouteContext = { params: Promise<{ path?: string[] }> };

async function handler(req: NextRequest, context: RouteContext) {
  try {
    const { path = [] } = await context.params;
    return await apiRouter(req, path);
  } catch (error: any) {
    console.error("API handler uncaught error:", error);
    return apiError(
      error?.message || "Internal server error",
      500,
      error?.message
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
