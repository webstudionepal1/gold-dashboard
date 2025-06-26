import { Store } from "@tanstack/react-store";
import { IFetchSupplier } from "../server/api/supplierHooks";

export const supplierStore = new Store<IFetchSupplier>({} as IFetchSupplier);

export const updateSuplierState = (newState: IFetchSupplier) => {
  supplierStore.setState(() => newState);
};
