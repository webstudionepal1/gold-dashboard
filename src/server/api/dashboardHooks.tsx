import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";
import { MetalPricesData } from "./metalPricesHooks";

// Types for dashboard data
export interface DailySales {
  day: string;
  amount: number;
}

export interface CategorySales {
  category: string;
  percentage: number;
}

export interface SalesMetrics {
  dailySales: DailySales[];
  totalSalesByCategory: CategorySales[];
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

export interface OrderDataset {
  label: string;
  data: number[];
}

export interface DailyOrders {
  labels: string[];
  datasets: OrderDataset[];
}

export interface TodayOrder {
  item: string;
  customer: string;
  qty: number;
  status: string;
  orderId: string;
}

export interface OrderMetrics {
  dailyOrders: DailyOrders;
  todaysOrders: TodayOrder[];
}

export interface PriceItem {
  title: string;
  price: number;
  image: string;
}

export interface Transaction {
  _id: string;
  transactionId: string;
  orderId: string;
  orderDate: string;
  totalAmount: number;
}

export interface LowStockItem {
  id: number;
  name: string;
  status: string;
  currentStock: number;
  minStockLevel: number;
}

export interface TopCustomer {
  id: string;
  name: string;
  orderCount: number;
  image: string;
}

export interface DashboardData {
  salesMetrics: SalesMetrics;
  orderMetrics: OrderMetrics;
  priceList: PriceItem[];
  recentTransactions: Transaction[];
  lowStockItems: LowStockItem[];
  topCustomers: TopCustomer[];
  metalPrices?: MetalPricesData;
}

export const useGetDashboardDataQuery = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await apiClient.get<{
        success: boolean;
        message: string;
        data: DashboardData;
      }>("dashboard");
      return res?.data?.data;
    },
  });
};
