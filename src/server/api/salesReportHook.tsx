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

// Allow undefined to handle query states
type productWiseResponse = productWiseData[] | undefined;

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
      // Handle different response structures
      if (Array.isArray(res.data)) {
        return res.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
      console.warn("Unexpected ProductWise response structure:", res.data);
      return [];
    },
    enabled: !!date && !!period,
  });
};

interface categoryWiseData {
  category: string;
  unitsSold: number;
  totalOrders: number;
  totalRevenue: number;
  percentageShare: number;
  averagePrice: number;
}

interface categoryWiseResponse {
  data: categoryWiseData[];
}

export const useGetCategoryWiseDataQuery = ({
  date,
  period,
}: {
  date: string;
  period: string;
}) => {
  return useQuery<categoryWiseResponse>({
    queryKey: ["orderCategory", date, period],
    queryFn: async () => {
      const res = await apiClient.get<categoryWiseResponse>("orderCategory", {
        params: { date, period },
      });
      return res?.data;
    },
    enabled: !!date && !!period,
  });
};
