// import { useQuery } from "@tanstack/react-query";
// import { apiClient } from "../utils/ApiGateway";

// interface productWiseData {
//   unitsSold: number;
//   category: string;
//   subCategory: string;
//   product: string;
//   totalRevenue: number;
//   averagePrice: number;
// }

// interface productWiseResponse {
//   products: productWiseData[];
// }

// export const useGetProductWiseDataQuery = ({
//   date,
//   period,
// }: {
//   date: string;
//   period: string;
// }) => {
//   return useQuery<productWiseResponse>({
//     queryKey: ["orderProduct", date, period],
//     queryFn: async () => {
//       const res = await apiClient.get("/orderProduct", {
//         params: { date, period },
//       });
//       return res.data?.data;
//     },
//     enabled: !!date && !!period, // don’t fetch until both dates are available
//   });
// };

// interface categoryWiseData {
//   category: string;
//   unitsSold: number;
//   totalOrders: number;
//   totalRevenue: number;
//   percentageShare: number;
// }

// export const useGetCategoryWiseDataQuery = ({
//   date,
//   period,
// }: {
//   date: string;
//   period: string;
// }) => {
//   return useQuery({
//     queryKey: ["orderCategory", date, period],
//     queryFn: async () => {
//       const res = await apiClient.get<{ data: categoryWiseData[] }>(
//         "orderCategory",
//         {
//           params: { date, period },
//         }
//       );
//       return res?.data?.data;
//     },
//     enabled: !!date && !!period,
//   });
// };

// // orderSubCategory;

// export const useGetSubCategoryWiseDataQuery = ({
//   date,
//   period,
// }: {
//   date: string;
//   period: string;
// }) => {
//   return useQuery({
//     queryKey: ["orderSubCategory", date, period],
//     queryFn: async () => {
//       const res = await apiClient.get<{ data: subCategoryWiseData[] }>(
//         "orderSubCategory",
//         {
//           params: { date, period },
//         }
//       );
//       return res?.data?.data;
//     },
//     enabled: !!date && !!period,
//   });
// };

// interface subCategoryWiseData {
//   subCategory: string;
//   unitsSold: number;
//   totalOrders: number;
//   totalRevenue: number;
//   percentageShare: number;
// }

// interface subCategoryWiseResponse {
//   data: subCategoryWiseData[];
// }

// import { useQuery } from "@tanstack/react-query";
// import { apiClient } from "../utils/ApiGateway";

// interface productWiseData {
//   unitsSold: number;
//   category: string;
//   subCategory: string;
//   product: string;
//   totalRevenue: number;
//   averagePrice: number;
// }

// interface productWiseResponse {
//   products: productWiseData[];
// }

// export const useGetProductWiseDataQuery = ({
//   date,
//   period,
// }: {
//   date: string;
//   period: string;
// }) => {
//   return useQuery<productWiseResponse>({
//     queryKey: ["orderProduct", date, period],
//     queryFn: async () => {
//       const res = await apiClient.get("/orderProduct", {
//         params: { date, period },
//       });
//       return res.data?.data;
//     },
//     enabled: !!date && !!period,
//   });
// };

// interface categoryWiseData {
//   category: string;
//   unitsSold: number;
//   totalOrders: number;
//   totalRevenue: number;
//   percentageShare: number;
//   averagePrice: number; // Added to match backend data
// }

// interface categoryWiseResponse {
//   data: categoryWiseData[];
// }

// export const useGetCategoryWiseDataQuery = ({
//   date,
//   period,
// }: {
//   date: string;
//   period: string;
// }) => {
//   return useQuery<categoryWiseResponse>({
//     queryKey: ["orderCategory", date, period],
//     queryFn: async () => {
//       const res = await apiClient.get<categoryWiseResponse>("orderCategory", {
//         params: { date, period },
//       });
//       return res?.data;
//     },
//     enabled: !!date && !!period,
//   });
// };

// interface subCategoryWiseData {
//   subCategory: string;
//   unitsSold: number;
//   totalOrders: number;
//   totalRevenue: number;
//   percentageShare: number;
//   averagePrice: number; // Added to match backend data
// }

// interface subCategoryWiseResponse {
//   data: subCategoryWiseData[];
// }

// export const useGetSubCategoryWiseDataQuery = ({
//   date,
//   period,
// }: {
//   date: string;
//   period: string;
// }) => {
//   return useQuery<subCategoryWiseResponse>({
//     queryKey: ["orderSubCategory", date, period],
//     queryFn: async () => {
//       const res = await apiClient.get<subCategoryWiseResponse>(
//         "orderSubCategory",
//         {
//           params: { date, period },
//         }
//       );
//       return res?.data;
//     },
//     enabled: !!date && !!period,
//   });
// };

// import { useQuery } from "@tanstack/react-query";
// import { apiClient } from "../utils/ApiGateway";

// interface productWiseData {
//   unitsSold: number;
//   category: string;
//   subCategory: string;
//   product: string;
//   totalRevenue: number;
//   averagePrice: number;
// }

// // Update type to be an array directly
// type productWiseResponse = productWiseData[];

// export const useGetProductWiseDataQuery = ({
//   date,
//   period,
// }: {
//   date: string;
//   period: string;
// }) => {
//   return useQuery<productWiseResponse>({
//     queryKey: ["orderProduct", date, period],
//     queryFn: async () => {
//       const res = await apiClient.get("/orderProduct", {
//         params: { date, period },
//       });
//       // Adjust based on actual API response; assuming res.data is the array
//       return res.data;
//     },
//     enabled: !!date && !!period,
//   });
// };

// interface categoryWiseData {
//   category: string;
//   unitsSold: number;
//   totalOrders: number;
//   totalRevenue: number;
//   percentageShare: number;
//   averagePrice: number;
// }

// interface categoryWiseResponse {
//   data: categoryWiseData[];
// }

// export const useGetCategoryWiseDataQuery = ({
//   date,
//   period,
// }: {
//   date: string;
//   period: string;
// }) => {
//   return useQuery<categoryWiseResponse>({
//     queryKey: ["orderCategory", date, period],
//     queryFn: async () => {
//       const res = await apiClient.get<categoryWiseResponse>("orderCategory", {
//         params: { date, period },
//       });
//       return res?.data;
//     },
//     enabled: !!date && !!period,
//   });
// };

// interface subCategoryWiseData {
//   subCategory: string;
//   unitsSold: number;
//   totalOrders: number;
//   totalRevenue: number;
//   percentageShare: number;
//   averagePrice: number;
// }

// interface subCategoryWiseResponse {
//   data: subCategoryWiseData[];
// }

// export const useGetSubCategoryWiseDataQuery = ({
//   date,
//   period,
// }: {
//   date: string;
//   period: string;
// }) => {
//   return useQuery<subCategoryWiseResponse>({
//     queryKey: ["orderSubCategory", date, period],
//     queryFn: async () => {
//       const res = await apiClient.get<subCategoryWiseResponse>(
//         "orderSubCategory",
//         {
//           params: { date, period },
//         }
//       );
//       return res?.data;
//     },
//     enabled: !!date && !!period,
//   });
// };

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
      console.log("ProductWise API response:", res.data);
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
      console.log("CategoryWise API response:", res.data);
      return res?.data;
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
  averagePrice: number;
}

interface subCategoryWiseResponse {
  data: subCategoryWiseData[];
}

export const useGetSubCategoryWiseDataQuery = ({
  date,
  period,
}: {
  date: string;
  period: string;
}) => {
  return useQuery<subCategoryWiseResponse>({
    queryKey: ["orderSubCategory", date, period],
    queryFn: async () => {
      const res = await apiClient.get<subCategoryWiseResponse>(
        "orderSubCategory",
        {
          params: { date, period },
        }
      );
      console.log("SubCategoryWise API response:", res.data);
      return res?.data;
    },
    enabled: !!date && !!period,
  });
};
