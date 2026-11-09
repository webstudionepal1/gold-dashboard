import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../utils/ApiGateway';
import { toast } from 'react-toastify';

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
    queryKey: ['company'],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchCompany[] }>('company');
      return res?.data?.data;
    },
  });
};

// Alias for backward compatibility
export const useGetMainCompanyQuery = () => {
  return useQuery({
    queryKey: ['company'],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchCompany[] }>('company');
      return res?.data?.data?.[0]; // Return first company as main company
    },
  });
};

export const useCreateCompanyDetailsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['company'],
    mutationFn: async ({ body }: { body: FormData }) => {
      const res = await apiClient.post(`company`, body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success('Successfully created details');
      queryClient.invalidateQueries({ queryKey: ['company'] });
    },
    onError(err: string) {
      toast.error(err || 'Error Creating Details');
    },
  });
};

export const useUpdateCompanyDetailsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['company'],
    mutationFn: async ({ id, body }: IUpdateProps) => {
      const res = await apiClient.patch(`company/${id}`, body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success('Successfully updated details');
      queryClient.invalidateQueries({ queryKey: ['company'] });
    },
    onError(err: string) {
      toast.error(err || 'Error Updating Details');
    },
  });
};
