import { createApiConfig } from "../utils/api-config";

const priceCalculator = createApiConfig("price-config", "Price Configuration");

export const {
  useGetAll: useGetAllPriceConfigurations,
  useCreate: useCreatePriceConfiguration,
  useUpdate: useUpdatePriceConfiguration,
  useDeleteById: useDeletePriceConfiguration,
} = priceCalculator;
