import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";

export interface IUserClient {
  [key: string]: any;
}

export interface IFetchReview {
  product: string;
  user: IUserClient;
  rating: number;
  reviewText?: string;
  isVerified: boolean;
  images: string[];
}
export const useGetAllReviews = (params = {}) => {
  return useQuery({
    queryKey: ["review", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchReview[] }>("review", {
        params,
      });
      return res?.data?.data;
    },
  });
};
