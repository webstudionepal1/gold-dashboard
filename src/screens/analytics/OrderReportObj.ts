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
export const orderReportTabOption = [
  { label: "Status Summary", value: "statusSummary" },
  { label: "Top Order Products", value: "topOrderProducts" },
];

export interface ITable {
  [key: string]: {
    columns: { key: string; title: string }[];
    rows: any;
  };
}
