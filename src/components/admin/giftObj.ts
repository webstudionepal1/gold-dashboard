import { IFetchGift } from "../../server/api/giftHooks";

export const giftColumns = [
  { title: "S.N", key: "sn" },
  { title: "Type", key: "type" },
  { title: "Category", key: "category" },
  { title: "Gift Name", key: "name" },
  { title: "Occasion", key: "occasion" },
  { title: "Items No", key: "itemsNo" },
  { title: "Pricing", key: "pricing" },
];

export interface GiftTableRow {
  id: string;
  sn: number;
  type: React.ReactNode;
  category: string;
  name: string;
  occasion: string;
  itemsNo: React.ReactNode;
  pricing: React.ReactNode;
  _originalData: IFetchGift;
}