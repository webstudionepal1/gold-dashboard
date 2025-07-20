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

export interface IOrderCategoryData {
  category: string;
  unitsSold: number;
  totalOrders: number;
  totalRevenue: number;
  averagePrice: number;
  percentageShare: number;
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

export const useGetTopOrderProductsQuery = ({
  date,
  period,
}: {
  date: string;
  period: string;
}) => {
  return useQuery({
    queryKey: ["top-products", date, period],
    queryFn: async () => {
      const res = await apiClient.get<{ data: topOrderProductsResponse }>(
        "top-products",
        {
          params: { date, period },
        }
      );
      return res?.data?.data;
    },
    enabled: !!date && !!period,
  });
};

export const useGetOrderCategoryQuery = (params = {}) => {
  return useQuery({
    queryKey: ["orderCategory", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IOrderCategoryData[] }>(
        "orderCategory",
        {
          params,
        }
      );
      return res?.data.data;
    },
  });
};
