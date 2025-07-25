import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";
import { toast } from "react-toastify";
import {
  handleMutationError,
  handleMutationSuccess,
} from "../../utils/errorHandler";

export interface IRawMaterial {
  id: string;
  name: string;
  usedStock: number;
  remainingStock: number;
  totalStock: number;
}

export const useGetRawMaterialsQuery = () => {
  return useQuery({
    queryKey: ["rawitem"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IRawMaterial[] }>("rawitem");
      return res?.data?.data;
    },
  });
};
