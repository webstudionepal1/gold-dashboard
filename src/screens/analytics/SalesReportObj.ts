import { get } from "lodash";
import * as z from "zod";
// interface IButtonObj {
//   [key: string]: {
//     text?: string;
//     onClick: (data?: string) => void;
//     show: boolean;
//   };
// }

// export const buttonObj: IButtonObj = {
//   expenses: {
//     text: "Expenses",
//     onClick(data) {},
//     show: true,
//   },
//   expensesCategory: {
//     text: "Expenses Category",
//     onClick(data) {},
//     show: true,
//   },
// };
export const salesReportTabOption = [
  { label: "Product Wise", value: "productWise" },
  { label: "Category Wise", value: "categoryWise" },
  { label: "Sub-Category Wise", value: "subCategoryWise" },
];

export interface ITable {
  [key: string]: {
    columns: { key: string; title: string }[];
    rows: any;
  };
}
