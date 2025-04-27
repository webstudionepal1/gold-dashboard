import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";
import { toast } from "react-toastify";
import { IFetchProduct } from "./productHooks";
export interface IParams {
  id?: string;
  body: FormData;
}

export interface IFetchSupplier {
  name: string;
  description?: string;
  // Contact
  email: string;
  phone: string;
  businessType: string;
  contactPerson: {
    name: string;
    phone: string;
    email: string;
  };
  address: string;
  // Address
  addresses: {
    district: string;
    address: string;
    province: string;
  };
  businessInfo: {
    company: string;
    PAN: string;
  };
  bankDetails: string;
  products: IFetchProduct[];
  logo: string[];
  _id: string;
}
export const useGetSupplierQuery = (params = {}) => {
  return useQuery({
    queryKey: ["supplier", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchSupplier[] }>("supplier", {
        params,
      });
      return res?.data?.data;
    },
  });
};
export const useGetSupplierByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["supplier", id],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchSupplier }>(
        `supplier/${id}`
      );
      return res?.data?.data;
    },
    enabled: !!id,
  });
};
export const useCreateSupplierMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["supplier"],
    mutationFn: async (body: FormData) => {
      const res = await apiClient.post("supplier", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Supplier added successfully");
      queryClient.invalidateQueries({ queryKey: ["supplier"] });
    },
    onError(err: string) {
      toast.error(err || "Error adding supplier");
    },
  });
};

export const useUpdateSupplierMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["supplier"],
    mutationFn: async ({ id, body }: IParams) => {
      const res = await apiClient.patch(`supplier/${id}`, body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Supplier updated successfully");
      queryClient.invalidateQueries({ queryKey: ["supplier"] });
    },
    onError(err: string) {
      toast.error(err || "Error updating supplier");
    },
  });
};

export const useDeleteSupplierMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["supplier"],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`supplier/${id}`);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Supplier deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["supplier"] });
    },
    onError(err: string) {
      toast.error(err || "Error deleting supplier");
    },
  });
};
