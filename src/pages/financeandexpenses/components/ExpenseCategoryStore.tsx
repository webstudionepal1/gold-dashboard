import { Store } from "@tanstack/react-store";

import { IFetchExpensesCategory } from "../../../server/api/expensesHook";

export const ExpenseCategoryStore = new Store<IFetchExpensesCategory>(
  {} as IFetchExpensesCategory
);

export const updateExpenseCategoryState = (
  newState: IFetchExpensesCategory
) => {
  ExpenseCategoryStore.setState(() => newState);
};
