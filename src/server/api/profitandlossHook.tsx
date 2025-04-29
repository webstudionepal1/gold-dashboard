import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";

interface Reference {
  id?: string;
  amount: number;
  date: string;
}

interface RevenueCategory {
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

interface FinancialReportData {
  period: Period;
  revenue: RevenueCategory[];
  expenses: any[];
}

interface FinancialReportResponse {
  data: FinancialReportData;
}

export const useGetFinancialReportQuery = (params = {}) => {
  return useQuery({
    queryKey: ["financial-report", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: FinancialReportResponse }>(
        "financial-report",
        {
          params,
        }
      );
      return res?.data?.data;
    },
  });
};
