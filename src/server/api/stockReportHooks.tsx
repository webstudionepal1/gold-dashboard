// import { useQuery } from "@tanstack/react-query";
// import { apiClient } from "../utils/ApiGateway";

// interface CategoryWiseData {
//   totalVariants: number;
//   totalStock: number;
//   lowStockCount: number;
//   outOfStockCount: number;
//   inStockCount: number;
//   category: string;
//   totalProducts: number;
//   lowStockPercentage: number;
//   outofStockPercentage: number;
// }

// interface categoryWiseResponse {
//   products: CategoryWiseData[];
// }

// export const useCategoryWiseDataQuery = () => {
//   return useQuery<categoryWiseResponse>({
//     queryKey: ["categoryInv"],
//     queryFn: async () => {
//       const res = await apiClient.get("/categoryInv");
//       return res.data;
//     },
//   });
// };

// interface LowStockWiseData {
//   _id: string;
//   name: string;
//   variant: {
//     price: number;
//     weight: number;
//     unit: string;
//     remainingStock: number;
//     reorderPoint: number;
//     status: string;
//   };
//   category: string;
//   subCategory: string;
//   images: string;
// }

// export const useLowStockWiseDataQuery = () => {
//   return useQuery({
//     queryKey: ["low-stock"],
//     queryFn: async () => {
//       const res = await apiClient.get<{ data: LowStockWiseData[] }>(
//         "low-stock"
//       );
//       return res?.data;
//     },
//   });
// };

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";

interface CategoryWiseData {
  totalVariants: number;
  totalStock: number;
  lowStockCount: number;
  outOfStockCount: number;
  inStockCount: number;
  category: string;
  totalProducts: number;
  lowStockPercentage: number;
  outofStockPercentage: number;
}

// API returns an array directly
export const useCategoryWiseDataQuery = () => {
  return useQuery<CategoryWiseData[]>({
    queryKey: ["categoryInv"],
    queryFn: async () => {
      const res = await apiClient.get("/categoryInv");
      return res.data; // Expecting an array of CategoryWiseData
    },
  });
};

interface LowStockWiseData {
  _id: string;
  name: string;
  variant: {
    price: number;
    weight: number;
    unit: string;
    remainingStock: number;
    reorderPoint: number;
    status: string;
  };
  category: string;
  subCategory: string;
  images: string;
}

// API returns an array directly
export const useLowStockWiseDataQuery = () => {
  return useQuery<LowStockWiseData[]>({
    queryKey: ["low-stock"],
    queryFn: async () => {
      const res = await apiClient.get<LowStockWiseData[]>("low-stock");
      return res.data; // Expecting an array of LowStockWiseData
    },
  });
};
