import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiClient } from "../utils/ApiGateway";

/**
 * Creates a set of API hooks for a specific entity
 * @param entityName - The name of the entity (used in API paths and query keys)
 * @param entityNameFormatted - The formatted name for toast messages
 * @param additionalQueriesToInvalidate - Additional query keys to invalidate on mutations
 * @returns Object containing all the CRUD operation hooks for the entity
 */
export function createApiConfig<T>(
  entityName: string,
  entityNameFormatted: string,
  additionalQueriesToInvalidate: string[] = []
) {
  /**
   * Helper function to invalidate both the entity query and any additional queries
   */
  const invalidateQueries = (queryClient: QueryClient) => {
    // Always invalidate the primary entity
    queryClient.invalidateQueries({ queryKey: [entityName] });

    // Invalidate each additional query key if provided
    if (additionalQueriesToInvalidate.length > 0) {
      additionalQueriesToInvalidate.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      });
    }
  };

  // GET all entities
  const useGetAll = (
    queryParams?: Record<string, any>,
    options?: Partial<UseQueryOptions<T[], Error>>
  ) => {
    // Create a stable query key by stringifying the params
    const stableQueryKey = queryParams ? JSON.stringify(queryParams) : "all";

    return useQuery({
      queryKey: [entityName, stableQueryKey],
      queryFn: async () => {
        const response = await apiClient.get(`/${entityName}`, {
          params: queryParams,
        });

        return response.data;
      },
      ...options,
    });
  };

  // GET entity by ID
  const useGetById = (id: string) => {
    return useQuery({
      queryKey: [entityName, id],
      queryFn: async () => {
        const { data } = await apiClient.get(`/${entityName}/${id}`);
        return data?.data;
      },
      enabled: !!id,
    });
  };

  // CREATE entity
  const useCreate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (entityData: T) => {
        return apiClient.post(`${entityName}`, entityData);
      },
      onSuccess: () => {
        invalidateQueries(queryClient);
        toast.success(`${entityNameFormatted} Created Successfully`);
      },
      onError: (error: any) => {
        const errorMessage = `Error Creating ${entityNameFormatted}: ${
          error?.error || error?.message
        }`;
        toast.error(errorMessage);
      },
      retry: false,
      onMutate: () => {
        toast.dismiss();
      },
    });
  };

  // UPDATE entity
  const useUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({
        entityData,
        _id,
      }: {
        entityData: T;
        _id: string;
      }) => {
        try {
          const response = await apiClient.patch(
            `${entityName}/${_id}`,
            entityData
          );
          return response.data;
        } catch (err) {
          // Directly throw the raw error to preserve its structure
          console.log("Original error in mutationFn:", err);
          throw err;
        }
      },
      onSuccess: () => {
        invalidateQueries(queryClient);
        toast.success(`${entityNameFormatted} Updated Successfully`);
      },
      onError: (error: any) => {
        console.log("Error type:", typeof error);
        console.log("Full error:", error);

        console.log(error?.error, "errorsssss");

        // Handle string error
        if (typeof error === "string") {
          toast.error(error);
          return;
        }

        // Handle axios error
        if (error.response?.data) {
          const errorData = error.response.data;
          console.log("Error response data:", errorData);

          // Try to get the duplicate entry message
          if (
            errorData.error &&
            Array.isArray(errorData.error) &&
            errorData.error.length > 0
          ) {
            toast.error(errorData.error[0].message);
            return;
          }

          // Fallback to general message
          if (errorData.message) {
            toast.error(errorData.message);
            return;
          }
        }

        // Direct access attempt if the error might be the response itself
        if (
          error.error &&
          Array.isArray(error.error) &&
          error.error.length > 0
        ) {
          toast.error(error.error[0].message);
          return;
        }

        // Last resort
        toast.error(`Error Updating ${entityNameFormatted}`);
      },
      retry: false,
      onMutate: () => {
        toast.dismiss();
      },
    });
  };

  // DELETE entity
  const useDeleteById = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (id: string) => {
        await apiClient.delete(`${entityName}/${id}`);
      },
      onSuccess: () => {
        invalidateQueries(queryClient);
        toast.success(`${entityNameFormatted} Deleted Successfully`);
      },
      onError: () => {
        toast.error(`Error Deleting ${entityNameFormatted}`);
      },
    });
  };

  const useDeleteWithQuery = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (queryParams?: Record<string, any>) => {
        await apiClient.delete(`${entityName}`, {
          params: queryParams,
        });
      },
      onSuccess: () => {
        invalidateQueries(queryClient);
        toast.success(`${entityNameFormatted} Deleted Successfully`);
      },
      onError: () => {
        toast.error(`Error Deleting ${entityNameFormatted}`);
      },
    });
  };

  return {
    useGetAll,
    useDeleteWithQuery,
    useGetById,
    useCreate,
    useUpdate,
    useDeleteById,
  };
}
