import { NextResponse } from "next/server";

export function apiSuccess<T>(data: T, message = "Success", status = 200) {
  return NextResponse.json({ success: true, message, data }, { status });
}

export function apiError(message: string, status = 400, error?: unknown) {
  return NextResponse.json(
    {
      success: false,
      message,
      error: error ?? message,
    },
    { status }
  );
}

export function apiPaginated<T>(
  data: T[],
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  },
  extra?: Record<string, unknown>
) {
  return NextResponse.json({
    success: true,
    message: "Success",
    data,
    pagination,
    ...extra,
  });
}
