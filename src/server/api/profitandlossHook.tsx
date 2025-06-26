import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";

interface Reference {
  id?: string;
  amount: number;
  date: string;
}

export interface RevenueCategory {
  category: string;
  inflow: number;
  outflow: number;
  balance: number;
  references: Reference[];
}

interface Period {
  startDate: string;
  endDate: string;
}

export interface ExpensesData {
  category: string;
  inflow: number;
  outflow: number;
  balance: number;
  references: Reference[];
}

interface FinancialReportData {
  period: Period;
  revenue: RevenueCategory[];
  expenses: ExpensesData[];
}

export interface FinancialReportResponse {
  data: FinancialReportData;
}

// export const useGetFinancialReportQuery = (params = {}) => {
//   return useQuery({
//     queryKey: ["financial-report", params],
//     queryFn: async () => {
//       const res = await apiClient.get<{ data: FinancialReportData }>(
//         "financial-report",
//         {
//           params,
//         }
//       );
//       return res?.data?.data;
//     },
//   });
// };

export const useGetFinancialReportQuery = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  return useQuery({
    queryKey: ["financial-report", startDate, endDate],
    queryFn: async () => {
      const res = await apiClient.get("/financial-report", {
        params: { startDate, endDate },
      });
      return res.data?.data;
    },
    enabled: !!startDate && !!endDate, // don’t fetch until both dates are available
  });
};
