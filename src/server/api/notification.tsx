import { createApiConfig } from "../utils/api-config";

const pushNotification = createApiConfig("push-notification", "Notification");

export const useGetNotification = pushNotification.useGetAll;
export const useDeleteNotification = pushNotification.useDeleteById;
export const useUpdateNotification = pushNotification.useUpdate;
