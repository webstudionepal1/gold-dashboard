import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";
import { toast } from "react-toastify";
export interface IPushNotification {
  token: string;
  title: string;
  body: any;
  type: string;
  notificationStatus: string;
  isRead?: boolean;
  user: string;
}

export const useCreateSendPushNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationData: IPushNotification) => {
      const res = await apiClient.post("push-notification", notificationData);
      return res;
    },

    onError: (error: any) => {
      if (error === "FCM Token not found") {
        setTimeout(() => {
          toast.info(`User hasn't registered properly`);
        }, 1900);
        return;
      } else {
        toast.info("Something went wrong");
        return;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["push-notification"] });
      toast.success("Notification send Succesfully");
    },
  });
};

export const useUpdatePushNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      notificationData,
      id,
    }: {
      notificationData: IPushNotification;
      id: string;
    }) => {
      const res = await apiClient.patch(
        `push-notification/${id}`,
        notificationData
      );
      return res;
    },

    onError: (error: any) => {
      toast.error("Something went wrong");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["push-notification"] });
    },
  });
};

export const useCreateSendBulkPushNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationData: IPushNotification) =>
      apiClient.post("push-notification", notificationData),
    onError: (error: any) => {
      toast.error("Something went wrong");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["push-notification"] });
      toast.success("Notification send Succesfully");
    },
  });
};

export const useGetNotifications = (
  userId?: string,
  limit?: number,
  page?: number
) => {
  return useQuery({
    queryKey: ["push-notification", userId], // Cache key includes userId to refetch specific user data
    queryFn: async () => {
      const { data } = await apiClient.get(
        `push-notification?user=${userId}&limit=${limit}&page=${page}`
      );
      return data;
    },
    enabled: !!userId,
  });
};
