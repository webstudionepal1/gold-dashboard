import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../utils/ApiGateway';
import { toast } from 'react-toastify';

export interface IContact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: {
    _id: string;
    name: string;
    email: string;
  };
  responseMessage: string;
  respondedAt: string;
  respondedBy: {
    _id: string;
    name: string;
    email: string;
  };
  attachments: string[];
}

export interface IParams {
  [key: string]: string | number | boolean | undefined;
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}

export const useGetAllContactUsQuery = (params: IParams = {}) => {
  return useQuery({
    queryKey: ['contact', params],
    queryFn: async () => {
      const res = await apiClient.get<{
        data: IContact[];

        pagination?: {
          currentPage: number;
          totalPages: number;
          totalCount: number;
          limit: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
          nextPage: number | null;
          prevPage: number | null;
        };
        searchQuery?: string;
        appliedFilters?: Record<string, unknown>;
      }>('contact', {
        params: {
          ...params,
        },
      });
      return res?.data?.data;
    },
  });
};

export const useDeleteContactUsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['contact'],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`contact/${id}`);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success('Contact Us deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['contact'] });
    },
    onError(err: string) {
      // toast.error(err || "Error deleting products");
      toast.error('Error deleting products');
    },
  });
};
