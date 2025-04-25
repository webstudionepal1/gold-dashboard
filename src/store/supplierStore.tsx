import { Store } from "@tanstack/react-store";
import { IFetchProduct } from "../server/api/productHooks";

export const supplierStore = new Store<IFetchProduct>({} as IFetchProduct);

export const updateProductState = (newState: IFetchProduct) => {
  supplierStore.setState(() => newState);
};
