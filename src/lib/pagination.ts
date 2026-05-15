export function getPagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
  );
  const skip = (page - 1) * limit;
  const search = searchParams.get("search") || searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "createdAt";
  const sortOrder =
    searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

  return { page, limit, skip, search, sort, sortOrder };
}

export function buildPaginationMeta(
  totalCount: number,
  page: number,
  limit: number
) {
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  return {
    currentPage: page,
    totalPages,
    totalCount,
    limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  };
}
