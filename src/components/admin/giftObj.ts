import { IFetchGift } from "../../server/api/giftHooks";

export const giftColumns = [
  { key: "sn", title: "S.N" },
  { key: "typeCategory", title: "Type & Category" },
  { key: "name", title: "Gift Name" },
  { key: "pricing", title: "Pricing" },
  { key: "status", title: "Status" },
];

export interface GiftTableRow {
  id: string;
  sn: number;
  typeCategory: React.ReactNode;
  name: React.ReactNode;
  pricing: React.ReactNode;
  status: React.ReactNode;
  _originalData: IFetchGift;
}