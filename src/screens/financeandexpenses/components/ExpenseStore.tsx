import { Store } from "@tanstack/react-store";
import { IFetchBanner } from "../../../server/api/bannerHook";
import { IFetchExpenses } from "../../../server/api/expensesHook";

export const ExpenseStore = new Store<IFetchExpenses>({} as IFetchExpenses);

export const updateExpenseState = (newState: IFetchExpenses) => {
  ExpenseStore.setState(() => newState);
};
