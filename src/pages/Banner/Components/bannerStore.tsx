import { Store } from "@tanstack/react-store";
import { IFetchBanner } from "../../../server/api/bannerHook";

export const bannerStore = new Store<IFetchBanner>({} as IFetchBanner);

export const updateBannerState = (newState: IFetchBanner) => {
  bannerStore.setState(() => newState);
};
