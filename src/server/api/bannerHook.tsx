import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";
import { toast } from "react-toastify";
export interface IParams {
  [key: string]: string;
}

export interface IFetchBanner {
  _id: string;
  title?: string;
  description?: string;
  image?: string[];
  video?: string;
  category?: string;
  subCategory?: string;
  priority?: number;
  locations?: string[];
  type?: string;
}

//Products routes
export const useGetAllBannerQuery = (params: IParams = {}) => {
  return useQuery({
    queryKey: ["banner", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchBanner[] }>("banner", {
        params,
      });
      return res?.data?.data;
    },
  });
};

export const useCreateBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["banner"],
    mutationFn: async (body: FormData) => {
      const res = await apiClient.post("banner", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Banner created successfully");
      queryClient.invalidateQueries({ queryKey: ["banner"] });
    },
    onError(err: string) {
      toast.error(err || "Error creating banner");
    },
  });
};
export const useUpdateBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["banner"],
    mutationFn: async ({
      id,
      body,
    }: {
      id: string | undefined;
      body: FormData;
    }) => {
      const res = await apiClient.patch(`banner/${id}`, body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Banner updated successfully");
      queryClient.invalidateQueries({ queryKey: ["banner"] });
    },
    onError(err: string) {
      toast.error(err || "Error creating banners");
    },
  });
};

export const useDeleteBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["banner"],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`banner/${id}`);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Banner deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["banner"] });
    },
    onError(err: string) {
      toast.error(err || "Error deleting banner");
    },
  });
};
