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
  IFetchExpensesCategory,
  useDeleteExpenseCategoryMutation,
  useDeleteExpenseMutation,
  useGetExpenseCategoryQuery,
  useGetExpensesQuery,
} from "../../server/api/expensesHook";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseCategoryForm from "./components/ExpenseCategoryForm";
import { SearchFilterSort } from "../../components/global/SearchFilterSort";
import { updateExpenseState } from "./components/ExpenseStore";
import { updateExpenseCategoryState } from "./components/ExpenseCategoryStore";

export const expenseFilterOptions = [
  { value: "", label: "All" },
  { value: "Gold", label: "Gold" },
  { value: "Silver", label: "Silver" },
  { value: "Office Supplies", label: "Office Supplies" },
  { value: "Travel", label: "Travel" },
];
export const expenseSortOptions = [
  { value: "category_asc", label: "Category (A-Z)" },
  { value: "category_desc", label: "Category (Z-A)" },
  { value: "description_asc", label: "Description (A-Z)" },
  { value: "description_desc", label: "Description (Z-A)" },
  { value: "amount_asc", label: "Amount (Low-High)" },
  { value: "amount_desc", label: "Amount (High-Low)" },
  { value: "date_asc", label: "Date (Oldest-Newest)" },
  { value: "date_desc", label: "Date (Newest-Oldest)" },
];

const expenseCategoryFilterOptions = [
  { value: "", label: "All" },
  { value: "Office Supplies", label: "Office Supplies" },
  { value: "Travel", label: "Travel" },
];

const expenseCategorySortOptions = [
  { value: "name_asc", label: "Name (A-Z)" },
  { value: "name_desc", label: "Name (Z-A)" },
  { value: "description_asc", label: "Description (A-Z)" },
  { value: "description_desc", label: "Description (Z-A)" },
];

interface IModalState {
  of: string;
  edit: boolean;
  data: IFetchExpenses | IFetchExpensesCategory | null;
}

interface FilterState {
  searchQuery: string;
  filterValue: string;
  sortValue: string;
}

const Expenses = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("expenses");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filterOptions =
    selectedTab === "expenses"
      ? expenseFilterOptions
      : expenseCategoryFilterOptions;
  const sortOptions =
    selectedTab === "expenses"
      ? expenseSortOptions
      : expenseCategorySortOptions;

  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: "",
    filterValue: "",
    sortValue: "",
  });

  const { mutate: deleteExpense } = useDeleteExpenseMutation();
  const { mutate: deleteExpenseCategory } = useDeleteExpenseCategoryMutation();
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

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const handleDownloadImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl, {
        mode: "cors",
        credentials: "same-origin",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const filename = imageUrl.split("/").pop() || "expense-image";
      const extension = filename.split(".").pop() || "jpg";
      link.download = `${
        filename.split(".")[0] || "expense-image"
      }.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      const link = document.createElement("a");
      link.href = imageUrl;
      const filename = imageUrl.split("/").pop() || "expense-image";
      const extension = filename.split(".").pop() || "jpg";
      link.download = `${
        filename.split(".")[0] || "expense-image"
      }.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const filteredExpenses = useMemo(() => {
    if (!expenseData || expenseData.length === 0) return [];

    let result = [...expenseData];

    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          (item.expenseCategory?.name &&
            item.expenseCategory?.name.toLowerCase().includes(query)) ||
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

    if (filterState.sortValue) {
      switch (filterState.sortValue) {
        case "category_asc":
          result.sort((a, b) =>
            (a.expenseCategory?.name ?? "").localeCompare(
              b.expenseCategory?.name ?? ""
            )
          );
          break;

        case "category_desc":
          result.sort((a, b) =>
            (b.expenseCategory?.name ?? "").localeCompare(
              a.expenseCategory?.name ?? ""
            )
          );
          break;

        case "description_asc":
          result.sort((a, b) =>
            (a.description ?? "").localeCompare(b.description ?? "")
          );
          break;

        case "description_desc":
          result.sort((a, b) =>
            (b.description ?? "").localeCompare(a.description ?? "")
          );
          break;

        case "amount_asc":
          result.sort(
            (a, b) => (a.amount ?? Infinity) - (b.amount ?? Infinity)
          );
          break;

        case "amount_desc":
          result.sort(
            (a, b) => (b.amount ?? -Infinity) - (a.amount ?? -Infinity)
          );
          break;

        case "date_asc":
          result.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          break;

        case "date_desc":
          result.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          break;
      }
    }

    return result;
  }, [expenseData, filterState]);

  const filteredExpenseCategories = useMemo(() => {
    if (!expenseCategories || expenseCategories.length === 0) return [];

    let result = [...expenseCategories];

    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    if (filterState.filterValue) {
      result = result.filter(
        (item) =>
          item.name === filterState.filterValue ||
          item.description === filterState.filterValue
      );
    }

    if (filterState.sortValue) {
      switch (filterState.sortValue) {
        case "name_asc":
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name_desc":
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "description_asc":
          result.sort((a, b) => a.description.localeCompare(b.description));
          break;
        case "description_desc":
          result.sort((a, b) => b.description.localeCompare(a.description));
          break;
        default:
          break;
      }
    }

    return result;
  }, [expenseCategories, filterState]);

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
        { key: "category", title: "Category" },
        { key: "description", title: "Description" },
        { key: "totalAmount", title: "Amount" },
        { key: "invoice", title: "Invoice" },
      ],
      rows: map(filteredExpenses, (item) => ({
        ...item,
        category: item.expenseCategory?.name,
        totalAmount: `Rs ${item.amount}`,
        invoice: (
          <div className="flex justify-center items-center gap-2">
            {item.images.map((imag, index) => (
              <img
                key={index}
                src={`https://gold-api.webstudiomatrix.com/${imag}`}
                alt="invoice"
                height={200}
                width={120}
                className="rounded-xl aspect-[16/9] cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() =>
                  handleImageClick(
                    `https://gold-api.webstudiomatrix.com/${imag}`
                  )
                }
              />
            ))}
          </div>
        ),
      })),
      onDelete(id: string) {
        deleteExpense(id);
      },
      editAction(row: IFetchExpenses) {
        updateExpenseState(row);
        setModal({ of: "expenses", edit: true, data: row });
      },
    }),
    [filteredExpenses, expensesSuccess]
  );

  const expenseCategoryTableData = useMemo(
    () => ({
      columns: [
        { key: "sn", title: "S.N." },
        { key: "name", title: "Name" },
        { key: "description", title: "Description" },
      ],
      rows: map(filteredExpenseCategories, (item, sn) => ({
        ...item,
        sn: sn + 1,
      })),
      onDelete(id: string) {
        deleteExpenseCategory(id);
      },
      editAction(row: IFetchExpensesCategory) {
        updateExpenseCategoryState(row);
        setModal({ of: "expensesCategory", edit: true, data: row });
      },
    }),
    [filteredExpenseCategories, expenseCatSuccess]
  );

  const tableDataObj: ITable = {
    expenses: expenseTableData,
    expensesCategory: expenseCategoryTableData,
  };

  const [modal, setModal] = useState<IModalState>({
    of: "",
    edit: false,
    data: null,
  });
  const closeModal = useCallback(
    () => setModal({ of: "", edit: false, data: null }),
    []
  );

  return (
    <div className="container px-4 py-3 mx-auto">
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
            onFilter={handleFilter}
            onSort={handleSort}
            onViewChange={() => {}}
            showFilter={true}
            showSort={true}
            showView={false}
            filterOptions={filterOptions}
            sortOptions={sortOptions}
            placeholder="Search products..."
          />
        }
        {...tableDataObj[selectedTab]}
        showAction
      />
      {modal.of === "expenses" && (
        <ScrollableModal onClose={closeModal} classname="w-[35rem]">
          <ExpenseForm editData={modal.data} closeModal={closeModal} />
        </ScrollableModal>
      )}
      {modal.of === "expensesCategory" && (
        <ScrollableModal classname="w-[35rem]" onClose={closeModal}>
          <ExpenseCategoryForm editData={modal.data} closeModal={closeModal} />
        </ScrollableModal>
      )}
      {isImageModalOpen && selectedImage && (
        <ScrollableModal
          classname="w-[35%] max-w-md"
          onClose={() => setIsImageModalOpen(false)}
        >
          <div className="bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Invoice Image</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownloadImage(selectedImage)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  title="Download"
                >
                  <Icon
                    icon="material-symbols:download"
                    width="24"
                    height="24"
                  />
                </button>
                <button
                  onClick={() => setIsImageModalOpen(false)}
                  className="hover:text-red rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                  title="Close"
                >
                  <Icon icon="material-symbols:close" width="16" height="16" />
                </button>
              </div>
            </div>
            <div className="p-4 flex justify-center">
              <img
                src={selectedImage}
                alt="Preview"
                className="max-w-full max-h-[70vh] rounded-md object-contain shadow-md"
              />
            </div>
          </div>
        </ScrollableModal>
      )}
    </div>
  );
};

export default Expenses;
