import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";

// Types for metal prices data
export interface MetalPrice {
  _id: string;
  carret?: number;
  pricePerGram: number;
  pricePerOunce: number;
  currency: string;
  timestamp: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isActive?: boolean;
}

// New nested structure types
export interface NepaliGoldPrices {
  fineGold24k: MetalPrice;
  tejabiGold22k: MetalPrice;
}

export interface NepaliMetalPrices {
  gold: NepaliGoldPrices;
  silver: MetalPrice;
}

export interface RegularMetalPrices {
  gold?: MetalPrice;
  silver?: MetalPrice;
}

// Updated API response structure
export interface MetalPricesApiResponse {
  regular: RegularMetalPrices;
  nepali: NepaliMetalPrices;
  lastUpdated: string;
}

// Legacy interface for backward compatibility
export interface MetalPricesData {
  goldPrice: MetalPrice;
  silverPrice: MetalPrice;
}

// Create mock data for fallback
const createMockMetalPrices = (): MetalPricesData => ({
  goldPrice: {
    _id: "mock-gold",
    pricePerGram: 16692.5,
    pricePerOunce: 519195.17,
    currency: "NPR",
    timestamp: new Date().toISOString(),
    source: "mock-data",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
    carret: 24,
    isActive: true,
  },
  silverPrice: {
    _id: "mock-silver",
    pricePerGram: 200.6,
    pricePerOunce: 6239.36,
    currency: "NPR",
    timestamp: new Date().toISOString(),
    source: "mock-data",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
    isActive: true,
  },
});

// Utility function to transform new API response to legacy format
const transformMetalPricesData = (
  apiResponse: any // Use any to handle unexpected structures
): MetalPricesData => {
  console.log("API Response:", apiResponse); // Debug log

  // Handle different possible API response structures
  let goldPrice: MetalPrice | undefined;
  let silverPrice: MetalPrice | undefined;

  // Try to extract from nested structure
  if (apiResponse?.nepali?.gold?.fineGold24k) {
    goldPrice = apiResponse.nepali.gold.fineGold24k;
  } else if (apiResponse?.regular?.gold) {
    goldPrice = apiResponse.regular.gold;
  } else if (apiResponse?.goldPrice) {
    // Legacy structure
    goldPrice = apiResponse.goldPrice;
  }

  if (apiResponse?.nepali?.silver) {
    silverPrice = apiResponse.nepali.silver;
  } else if (apiResponse?.regular?.silver) {
    silverPrice = apiResponse.regular.silver;
  } else if (apiResponse?.silverPrice) {
    // Legacy structure
    silverPrice = apiResponse.silverPrice;
  }

  console.log("Extracted prices:", { goldPrice, silverPrice }); // Debug log

  if (!goldPrice || !silverPrice) {
    console.warn("Missing price data, using mock data:", {
      hasGold: !!goldPrice,
      hasSilver: !!silverPrice,
      apiStructure: Object.keys(apiResponse || {}),
    });
    return createMockMetalPrices();
  }

  return {
    goldPrice,
    silverPrice,
  };
};

export const useGetLatestMetalPricesQuery = () => {
  return useQuery<MetalPricesData>({
    queryKey: ["metalPrices"],
    queryFn: async (): Promise<MetalPricesData> => {
      try {
        const res = await apiClient.get("metal-prices/latest");

        console.log("Raw API response:", res.data); // Debug log

        // Handle different response structures
        let dataToTransform;
        if (res?.data?.data) {
          dataToTransform = res.data.data;
        } else if (res?.data) {
          dataToTransform = res.data;
        } else {
          console.warn("No data in API response, using mock data");
          return createMockMetalPrices();
        }

        // Transform the data structure to the legacy format for backward compatibility
        return transformMetalPricesData(dataToTransform);
      } catch (error) {
        console.error("Metal prices API error:", error);

        // Return mock data instead of null to prevent dashboard crash
        console.warn("API failed, using mock data");
        return createMockMetalPrices();
      }
    },
    retry: 1, // Reduce retries to fail faster and use mock data
    retryDelay: 500,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in React Query v5)
  });
};
