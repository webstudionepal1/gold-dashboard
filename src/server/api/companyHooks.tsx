import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";
import { toast } from "react-toastify";
import {
  handleMutationError,
  handleMutationSuccess,
} from "../../utils/errorHandler";

export interface IFetchCompany {
  _id: string;
  name: string;
  ownerNo: string;
  address: string;
  email: string;
  phone: string;
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
  companyName: string;
  [key: string]: any;
}
export interface ICompany {
  _id?: string;
  name?: string;
  ownerNo?: string;
  address?: string;
  email?: string;
  phone?: string;
  description?: string;
  registrationNo?: string;
  city?: string;
  zipCode?: string;
  openDay?: string;
  openTime?: string;
  closeTime?: string;
  paymentMode?: string;
  companyName?: string;
  bankName?: string;
  accountNo?: string;
  accountHolder?: string;
  branch?: string;
}

interface IUpdateProps {
  id: string;
  body: FormData;
}
export const useGetCompanyDetailsQuery = () => {
  return useQuery({
    queryKey: ["company"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchCompany[] }>("company");
      return res?.data?.data;
    },
  });
};

export const useUpdateCompanyDetailsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["company"],
    mutationFn: async ({ id, body }: IUpdateProps) => {
      const res = await apiClient.patch(`company/${id}`, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res?.data?.data;
    },
    onSuccess() {
      handleMutationSuccess("Successfully updated details");
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
    onError(err: any) {
      handleMutationError(err, "Error Updating Details");
    },
  });
};
