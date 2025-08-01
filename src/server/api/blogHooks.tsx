import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";
import { toast } from "react-toastify";
import {
  IBlog,
  IBlogCreateRequest,
  IBlogUpdateRequest,
  IBlogListResponse,
  IBlogSearchParams,
  IBlogAnalytics,
} from "../../types/blog.types";

export interface IParams {
  [key: string]: any;
}

// Get all blogs with pagination and filters using search endpoint
export const useGetAllBlogsQuery = (params: IBlogSearchParams = {}) => {
  return useQuery({
    queryKey: ["blogs", params],
    queryFn: async () => {
      // Convert frontend params to backend search params
      const searchParams: any = {
        page: params.page || 1,
        limit: params.limit || 12,
        sortBy: params.sortBy || "createdAt",
        sortOrder: params.sortOrder || "desc",
      };

      // Map search query
      if (params.search) {
        searchParams.q = params.search;
      }

      // Map status filter
      if (params.status) {
        searchParams.status = params.status;
      }

      // Map featured filter
      if (params.featured !== undefined) {
        searchParams.featured = params.featured.toString();
      }

      // For admin dashboard, we want to see all statuses, not just published
      // Remove the default status filter for admin users
      if (!searchParams.status) {
        delete searchParams.status;
      }

      const res = await apiClient.get<{ data: IBlogListResponse }>("blog/search", {
        params: searchParams,
      });
      return res?.data?.data;
    },
  });
};

// Get published blogs (public endpoint)
export const useGetPublishedBlogsQuery = (params: IBlogSearchParams = {}) => {
  return useQuery({
    queryKey: ["published-blogs", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IBlogListResponse }>(
        "blog/published",
        {
          params,
        }
      );
      return res?.data?.data;
    },
  });
};

// Get featured blogs
export const useGetFeaturedBlogsQuery = (limit: number = 5) => {
  return useQuery({
    queryKey: ["featured-blogs", limit],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IBlog[] }>("blog/featured", {
        params: { limit },
      });
      return res?.data?.data;
    },
  });
};

// Get blog by ID
export const useGetBlogByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IBlog }>(`blog/${id}`);
      return res?.data?.data;
    },
    enabled: !!id,
  });
};

// Get blog by slug (public endpoint)
export const useGetBlogBySlugQuery = (slug: string) => {
  return useQuery({
    queryKey: ["blog-slug", slug],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IBlog }>(`blog/slug/${slug}`);
      return res?.data?.data;
    },
    enabled: !!slug,
  });
};

// Get my blogs (authenticated user's blogs)
export const useGetMyBlogsQuery = (params: IBlogSearchParams = {}) => {
  return useQuery({
    queryKey: ["my-blogs", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IBlogListResponse }>(
        "blog/my-blogs",
        {
          params,
        }
      );
      return res?.data?.data;
    },
  });
};

// Search blogs with advanced filters
export const useSearchBlogsQuery = (params: IBlogSearchParams) => {
  return useQuery({
    queryKey: ["search-blogs", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IBlogListResponse }>(
        "blog/search",
        {
          params,
        }
      );
      return res?.data?.data;
    },
    enabled: !!(params.q || params.category || params.tag || params.author),
  });
};

// Get blog analytics
export const useGetBlogAnalyticsQuery = () => {
  return useQuery({
    queryKey: ["blog-analytics"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IBlogAnalytics }>(
        "blog/analytics"
      );
      return res?.data?.data;
    },
  });
};

// Create blog mutation
export const useCreateBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-blog"],
    mutationFn: async (blogData: FormData) => {

      const res = await apiClient.post("blog", blogData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });


      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to create blog");
      }

      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Blog created successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog-analytics"] });
    },
    onError: (error: any) => {

      let errorMessage = "Error creating blog";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        // Handle validation errors
        if (Array.isArray(error.response.data.error)) {
          errorMessage = error.response.data.error[0]?.message || errorMessage;
        } else {
          errorMessage = error.response.data.error;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    },
  });
};

// Update blog mutation
export const useUpdateBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-blog"],
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      console.log("🌐 Making API call to update blog...");
      const res = await apiClient.put(`blog/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("✅ Update API response received:", res);
      return res?.data?.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Blog updated successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["blog-analytics"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Error updating blog"
      );
    },
  });
};

// Delete blog mutation
export const useDeleteBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-blog"],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`blog/${id}`);
      return res?.data?.data;
    },
    onSuccess: () => {
      toast.success("Blog deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog-analytics"] });
    },
    onError: (error: string) => {
      toast.error(error || "Error deleting blog");
    },
  });
};

// Like blog mutation
export const useLikeBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["like-blog"],
    mutationFn: async (id: string) => {
      const res = await apiClient.post(`blog/${id}/like`);
      return res?.data?.data;
    },
    onSuccess: (_, blogId) => {
      toast.success("Blog liked successfully");
      queryClient.invalidateQueries({ queryKey: ["blog", blogId] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["published-blogs"] });
    },
    onError: (error: string) => {
      toast.error(error || "Error liking blog");
    },
  });
};

// Toggle featured status mutation
export const useToggleFeaturedMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["toggle-featured"],
    mutationFn: async (id: string) => {
      const res = await apiClient.patch(`blog/${id}/toggle-featured`);
      return res?.data?.data;
    },
    onSuccess: (_, blogId) => {
      toast.success("Blog featured status updated");
      queryClient.invalidateQueries({ queryKey: ["blog", blogId] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["featured-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog-analytics"] });
    },
    onError: (error: string) => {
      toast.error(error || "Error updating featured status");
    },
  });
};

// Bulk update blog status mutation
export const useBulkUpdateStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["bulk-update-status"],
    mutationFn: async (data: { blogIds: string[]; status: string }) => {
      const res = await apiClient.patch("blog/bulk-status", data);
      return res?.data?.data;
    },
    onSuccess: () => {
      toast.success("Blog statuses updated successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog-analytics"] });
    },
    onError: (error: string) => {
      toast.error(error || "Error updating blog statuses");
    },
  });
};
