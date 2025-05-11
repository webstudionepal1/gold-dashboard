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
  date,
  period,
}: {
  date: string;
  period: string;
}) => {
  return useQuery<productWiseResponse>({
    queryKey: ["orderProduct", date, period],
    queryFn: async () => {
      const res = await apiClient.get("/orderProduct", {
        params: { date, period },
      });
      return res.data?.data;
    },
    enabled: !!date && !!period, // don’t fetch until both dates are available
  });
};

interface categoryWiseData {
  category: string;
  unitsSold: number;
  totalOrders: number;
  totalRevenue: number;
  percentageShare: number;
}

export const useGetCategoryWiseDataQuery = ({
  date,
  period,
}: {
  date: string;
  period: string;
}) => {
  return useQuery({
    queryKey: ["orderCategory", date, period],
    queryFn: async () => {
      const res = await apiClient.get<{ data: categoryWiseData[] }>(
        "orderCategory",
        {
          params: { date, period },
        }
      );
      return res?.data?.data;
    },
    enabled: !!date && !!period,
  });
};

// orderSubCategory;

export const useGetSubCategoryWiseDataQuery = ({
  date,
  period,
}: {
  date: string;
  period: string;
}) => {
  return useQuery({
    queryKey: ["orderSubCategory", date, period],
    queryFn: async () => {
      const res = await apiClient.get<{ data: subCategoryWiseData[] }>(
        "orderSubCategory",
        {
          params: { date, period },
        }
      );
      return res?.data?.data;
    },
    enabled: !!date && !!period,
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
