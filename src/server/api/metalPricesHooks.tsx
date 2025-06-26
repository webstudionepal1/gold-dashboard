import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";

// Types for metal prices data
export interface MetalPrice {
  _id: string;
  pricePerGram: number;
  pricePerOunce: number;
  currency: string;
  timestamp: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface MetalPricesData {
  goldPrice: MetalPrice;
  silverPrice: MetalPrice;

}

export const useGetLatestMetalPricesQuery = () => {
  return useQuery({
    queryKey: ["metalPrices"],
    queryFn: async () => {
      const res = await apiClient.get<{ 
        success: boolean;
        message: string;
        data: MetalPricesData;
      }>("metal-prices/latest");
      return res?.data?.data;
    },
  });
};
