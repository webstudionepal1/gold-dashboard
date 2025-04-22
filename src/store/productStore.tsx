import { Store } from "@tanstack/react-store";
import { IFetchProduct } from "../server/api/productHooks";

export const productStore = new Store<IFetchProduct>({} as IFetchProduct);

export const updateProductState = (newState: IFetchProduct) => {
  productStore.setState(() => newState);
};
