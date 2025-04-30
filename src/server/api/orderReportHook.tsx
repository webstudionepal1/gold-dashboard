import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";

interface IParams {
  [key: string]: string;
}

interface IFetchOrderStatus {
  status: string;
  count: number;
  percentage: number;
}

interface IOrderStatusResponse {
  count: number;
  orders: IFetchOrderStatus[];
}

interface topOrderProductsData {
  productName: string;
  productImage: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

interface topOrderProductsResponse {
  products: topOrderProductsData[];
}

export const useGetOrderStatusQuery = (params = {}) => {
  return useQuery({
    queryKey: ["orderStatus", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IOrderStatusResponse }>(
        "orderStatus",
        {
          params,
        }
      );
      return res?.data?.data;
    },
  });
};

export const useGetTopOrderProductsQuery = (params = {}) => {
  return useQuery({
    queryKey: ["top-products", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: topOrderProductsResponse }>(
        "top-products",
        {
          params,
        }
      );
      return res?.data?.data;
    },
  });
};
