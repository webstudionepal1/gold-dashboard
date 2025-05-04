import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";

interface productWiseData {
  unitsSold: number;
  category: string;
  subCategory: string;
  product: string;
  totalRevenue: number;
  averagePrice: number;
}

interface productWiseResponse {
  products: productWiseData[];
}

export const useGetProductWiseDataQuery = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  return useQuery<productWiseResponse>({
    queryKey: ["orderProduct", startDate, endDate],
    queryFn: async () => {
      const res = await apiClient.get("/orderProduct", {
        params: { startDate, endDate },
      });
      return res.data?.data;
    },
    enabled: !!startDate && !!endDate, // don’t fetch until both dates are available
  });
};

interface categoryWiseData {
  category: string;
  unitsSold: number;
  totalOrders: number;
  totalRevenue: number;
  percentageShare: number;
}

export const useGetCategoryWiseDataQuery = (params = {}) => {
  return useQuery({
    queryKey: ["orderCategory", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: categoryWiseData[] }>(
        "orderCategory",
        {
          params,
        }
      );
      return res?.data?.data;
    },
  });
};

// orderSubCategory;

export const useGetSubCategoryWiseDataQuery = (params = {}) => {
  return useQuery({
    queryKey: ["orderSubCategory", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: subCategoryWiseData[] }>(
        "orderSubCategory",
        {
          params,
        }
      );
      return res?.data?.data;
    },
  });
};

interface subCategoryWiseData {
  subCategory: string;
  unitsSold: number;
  totalOrders: number;
  totalRevenue: number;
  percentageShare: number;
}

interface subCategoryWiseResponse {
  data: subCategoryWiseData[];
}
