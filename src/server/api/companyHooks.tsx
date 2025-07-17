import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";
import { toast } from "react-toastify";

export interface IParams {
  [key: string]: string;
}

export interface IShopProfile {
  _id?: string;
  companyName?: string;
  name?: string;
  ownerNo?: string;
  address?: string;
  email?: string;
  phone?: string;
  logo?: string[];
  description?: string;
  registrationNo?: string;
  city?: string;
  zipCode?: string;
  openDay?: string;
  openTime?: string;
  closeTime?: string;
  paymentMode?: string;
  bankName?: string;
  accountNo?: string;
  accountHolder?: string;
  branch?: string;
  qr?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IFetchCompany extends IShopProfile {
  _id: string;
}

// Get all companies
export const useGetAllCompaniesQuery = (params: IParams = {}) => {
  return useQuery({
    queryKey: ["company", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchCompany[] }>("company", {
        params,
      });
      return res?.data?.data;
    },
  });
};

// Get company by ID
export const useGetCompanyByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["company", id],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchCompany }>(`company/${id}`);
      return res?.data?.data;
    },
    enabled: !!id,
  });
};

// Get the first/main company (for app-wide company info)
export const useGetMainCompanyQuery = () => {
  return useQuery({
    queryKey: ["company", "main"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchCompany[] }>("company", {
        params: { limit: 1 },
      });
      return res?.data?.data?.[0] || null;
    },
  });
};

// Create company
export const useCreateCompanyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["company"],
    mutationFn: async (body: FormData) => {
      const res = await apiClient.post("company", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Company created successfully");
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
    onError(err: string) {
      toast.error(err || "Error creating company");
    },
  });
};

// Update company
export const useUpdateCompanyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["company"],
    mutationFn: async ({ id, body }: { id: string; body: FormData }) => {
      const res = await apiClient.patch(`company/${id}`, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Company updated successfully");
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
    onError(err: string) {
      toast.error(err || "Error updating company");
    },
  });
};

// Delete company
export const useDeleteCompanyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["company"],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`company/${id}`);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Company deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
    onError(err: string) {
      toast.error(err || "Error deleting company");
    },
  });
};
