import { Icon } from "@iconify/react/dist/iconify.js";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MasterTable from "../../components/shared/MasterTable";
import { ScrollableModal } from "../../components/shared/ScrollableModal";
import Header from "../../components/shared/table_heading/Header";
import { DynamicTab } from "../PurchaseManagement/components/DynamicTab";

import {
  buttonObj,
  expenseTabOption,
  ITable,
} from "../financeandexpenses/components/expenseObj";

import { map } from "lodash";
import {
  IFetchExpenses,
  useDeleteExpenseMutation,
  useGetExpenseCategoryQuery,
  useGetExpensesQuery,
} from "../../server/api/expensesHook";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseCategoryForm from "./components/ExpenseCategoryForm";
import { SearchFilterSort } from "../../components/global/SearchFilterSort";
import { filterOptions, sortOptions } from "../../constants/DropDownOptions";

interface IEditModal {
  state: boolean;
  editData?: IFetchExpenses | null;
}

interface FilterState {
  searchQuery: string;
  filterValue: string;
  sortValue: string;
}

const Expenses = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("expenses");
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState<IEditModal>({
    state: false,
    editData: null,
  });

  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: "",
    filterValue: "",
    sortValue: "",
  });

  const { mutate: deleteExpense } = useDeleteExpenseMutation();
  const {
    data: expensesList,
    isLoading: expensesLoading,
    isSuccess: expensesSuccess,
  } = useGetExpensesQuery();

  const {
    data: expenseCategories,
    isLoading: expenseCatLoading,
    isSuccess: expenseCatSuccess,
  } = useGetExpenseCategoryQuery();

  const expenseData = useMemo(
    () => (expensesSuccess ? expensesList : []),
    [expensesSuccess, expensesList]
  );

  const filteredExpenses = useMemo(() => {
    if (!expenseData || expenseData.length === 0) return [];

    let result = [...expenseData];

    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          (item.expenseCategory.name &&
            item.expenseCategory.name.toLowerCase().includes(query)) ||
          (typeof item.expenseCategory.name === "string" &&
            item.expenseCategory.name.toLowerCase().includes(query)) ||
          (item.description && item.description.toLowerCase().includes(query))
      );
    }
    if (filterState.filterValue) {
      result = result.filter(
        (item) =>
          (typeof item.expenseCategory.name === "string" &&
            item.expenseCategory.name === filterState.filterValue) ||
          (item.description && item.description === filterState.filterValue)
      );
    }

    // if (filterState.sortValue) {
    //   switch (filterState.sortValue) {
    //     case "title_asc":
    //       result.sort((a, b) =>
    //         a.name && b.name ? a.name.localeCompare(b.name) : 0
    //       );
    //       break;
    //     case "title_desc":
    //       result.sort((a, b) =>
    //         a.name && b.name ? b.name.localeCompare(a.name) : 0
    //       );
    //       break;
    //     case "price_asc":
    //       result.sort((a, b) => (a.price && b.price ? a.price - b.price : 0));
    //       break;
    //     case "price_desc":
    //       result.sort((a, b) => (a.price && b.price ? b.price - a.price : 0));
    //       break;
    //     case "rating_asc":
    //       result.sort((a, b) =>
    //         a.ratings && b.ratings ? a.ratings - b.ratings : 0
    //       );
    //       break;
    //     case "rating_desc":
    //       result.sort((a, b) =>
    //         a.ratings && b.ratings ? b.ratings - a.ratings : 0
    //       );
    //       break;
    //   }
    // }

    return result;
  }, [expenseData, filterState]);

  const handleSearch = (query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query }));
  };

  const handleFilter = (filter: string) => {
    setFilterState((prev) => ({ ...prev, filterValue: filter }));
  };

  const handleSort = (sort: string) => {
    setFilterState((prev) => ({ ...prev, sortValue: sort }));
  };

  const expenseTableData = useMemo(
    () => ({
      columns: [
        { key: "date", title: "Date" },
        { key: "expenseCategory", title: "Category" },
        { key: "description", title: "Description" },
        { key: "amount", title: "Amount" },
        { key: "invoice", title: "Invoice" },
      ],
      rows: map(expensesList, (item) => ({
        ...item,
        amount: `Rs ${item.amount}`,
        invoice: (
          <div>
            {item.images.map((imag) => (
              <img
                src={`https://gold-api.webstudiomatrix.com/api/v1/en/${imag}`}
                alt="image"
              />
            ))}
          </div>
        ),
      })),
    }),
    [expensesList, expensesSuccess]
  );
  const expenseCategoryTableData = useMemo(
    () => ({
      columns: [
        { key: "sn", title: "S.N." },
        { key: "name", title: "Name" },
        { key: "description", title: "Description" },
      ],
      rows: map(expenseCategories, (item, sn) => ({
        ...item,
        sn: sn + 1,
        description: <h1>DESCRIPTION</h1>,
      })),
    }),
    [expenseCategories, expenseCatSuccess]
  );
  // const returnTableData = useMemo(
  //   () => ({
  //     columns: [{ key: "name", title: "Name" }],
  //     rows: map(returnList, (item) => ({
  //       ...item,
  //     })),
  //   }),
  //   [returnList, returnSuccess]
  // );

  const tableDataObj: ITable = {
    expenses: expenseTableData,
    expensesCategory: expenseCategoryTableData,
  };
  const [modal, setModal] = useState({
    of: "",
    edit: false,
    data: null,
  });
  const closeModal = useCallback(
    () => setModal({ of: "", edit: false, data: null }),
    []
  );
  console.log(selectedTab);
  return (
    <div className="container px-4 py-3 mx-auto ">
      <Header
        text={selectedTab === "expenses" ? "Expenses" : "Expenses Category"}
      >
        {buttonObj[selectedTab]?.show && (
          <button
            onClick={() => {
              if (selectedTab === "expenses") {
                setModal((prev) => ({ ...prev, of: "expenses" }));
              } else {
                setModal((prev) => ({ ...prev, of: "expensesCategory" }));
              }
            }}
            className="px-3 py-2 flex items-center text-white bg-[#d49327] transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg"
          >
            <Icon
              icon="material-symbols-light:add-rounded"
              width="24"
              height="24"
              className="fill-white"
            />
            Add {buttonObj[selectedTab].text}
          </button>
        )}
      </Header>
      <MasterTable
        loading={expensesLoading || expenseCatLoading}
        tabsOptions={
          <DynamicTab
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            tabOptions={expenseTabOption}
          />
        }
        filterSection={
          <SearchFilterSort
            onSearch={handleSearch}
            onFilter={handleFilter}
            onSort={handleSort}
            onViewChange={() => {}}
            showFilter={true}
            showSort={true}
            showView={true}
            filterOptions={filterOptions}
            sortOptions={sortOptions}
            placeholder="Search products..."
          />
        }
        rows={tableDataObj[selectedTab].rows || []}
        columns={tableDataObj[selectedTab].columns}
        showAction={true}
        viewAction={() => console.log("VIEW")}
        editAction={() => console.log("edit")}
        onDelete={(id) => deleteExpense(id)}
      />
      {modal.of === "expenses" && (
        <ScrollableModal onClose={closeModal} classname="w-[35rem]">
          <ExpenseForm closeModal={closeModal} />
        </ScrollableModal>
      )}

      {modal.of === "expensesCategory" && (
        <ScrollableModal classname="w-[35rem]" onClose={closeModal}>
          <ExpenseCategoryForm closeModal={closeModal} />
        </ScrollableModal>
      )}
    </div>
  );
};

export default Expenses;
