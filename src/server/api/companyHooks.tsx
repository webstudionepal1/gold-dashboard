import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";
import { toast } from "react-toastify";

export interface IFetchCompany {
  _id: string;
  name: string;
  ownerNo: string;
  address: string;
  email: string;
  phone: string;
  logo: [string];
  description: string;
  registrationNo: string;
  city: string;
  zipCode: string;
  openDay: string;
  openTime: string;
  closeTime: string;
  paymentMode: string;
  bankName: string;
  accountNo: string;
  accountHolder: string;
  branch: string;
  qr: [string];
}
export interface ICompany {
  name?: string;
  ownerNo?: string;
  address?: string;
  email?: string;
  phone?: string;
  logo?: [string];
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
  qr?: [string];
}

interface IUpdateProps {
  id: string;
  body: ICompany;
}
export const useGetCompanyDetailsQuery = () => {
  return useQuery({
    queryKey: ["company"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchCompany }>("company");
      return res?.data?.data;
    },
  });
};

export const useUpdateCompanyDetailsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["company"],
    mutationFn: async ({ id, body }: IUpdateProps) => {
      const res = await apiClient.patch(`company/${id}`, body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Successfully updated details");
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
    onError(err: string) {
      toast.success(err || "Error Updating Details");
    },
  });
};