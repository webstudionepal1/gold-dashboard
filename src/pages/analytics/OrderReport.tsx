import { Icon } from "@iconify/react/dist/iconify.js";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MasterTable from "../../components/shared/MasterTable";
import { ScrollableModal } from "../../components/shared/ScrollableModal";
import Header from "../../components/shared/table_heading/Header";
import { DynamicTab } from "../PurchaseManagement/components/DynamicTab";

import { orderReportTabOption, ITable } from "../analytics/OrderReportObj";

import { map } from "lodash";
import {
  IFetchExpenses,
  useDeleteExpenseMutation,
  useGetExpenseCategoryQuery,
  useGetExpensesQuery,
} from "../../server/api/expensesHook";

import { SearchFilterSort } from "../../components/global/SearchFilterSort";
import { filterOptions, sortOptions } from "../../constants/DropDownOptions";
import { StatCard } from "./components/iconCard";
import {
  useGetOrderStatusQuery,
  useGetTopOrderProductsQuery,
} from "../../server/api/orderReportHook";

const stats = [
  {
    percentage: 12,
    label: "Gold",
    icon: <img src="/Gold.png" alt="Gold" className="h-6 w-6 object-contain" />,
    imageBgClassName: "bg-[#f7e8c9]",
  },
  {
    percentage: 8,
    label: "Silver",
    icon: (
      <img src="/Silver.png" alt="Silver" className="h-6 w-6 object-contain" />
    ),
    imageBgClassName: "bg-[#edeef2]",
  },
  {
    percentage: 5,
    label: "Watch",
    icon: (
      <img src="/watch.png" alt="Watch" className="h-6 w-6 object-contain" />
    ),
    imageBgClassName: "bg-[#d8efff]",
  },
  {
    percentage: 15,
    label: "Pasni Set",
    icon: (
      <img
        src="/pasniSet.png"
        alt="Pasni Set"
        className="h-6 w-6 object-contain"
      />
    ),
    imageBgClassName: "bg-[#ffe3e9]",
  },
];

interface IEditModal {
  state: boolean;
  editData?: IFetchExpenses | null;
}

interface FilterState {
  searchQuery: string;
  filterValue: string;
  sortValue: string;
}

const OrderReport = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("statusSummary");
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
    data: orderStatusList,
    isLoading: orderStatusLoading,
    isSuccess: orderStatusSuccess,
  } = useGetOrderStatusQuery();

  const {
    data: expenseCategories,
    isLoading: expenseCatLoading,
    isSuccess: expenseCatSuccess,
  } = useGetExpenseCategoryQuery();

  const {
    data: TopOrderList,
    isLoading: topOrderLoading,
    isSuccess: topOrderSuccess,
  } = useGetTopOrderProductsQuery();

  console.log("Top order data", TopOrderList);

  const orderStatusData = useMemo(
    () => (orderStatusSuccess ? orderStatusList : []),
    [orderStatusSuccess, orderStatusList]
  );

  const TopOrderData = useMemo(
    () => (topOrderSuccess ? TopOrderList : []),
    [topOrderSuccess, TopOrderList]
  );

  // const filteredOrderStatus = useMemo(() => {
  //   if (!orderStatusData || orderStatusData.length === 0) return [];

  //   let result = [...orderStatusData];

  //   if (filterState.searchQuery) {
  //     const query = filterState.searchQuery.toLowerCase();
  //     result = result.filter(
  //       (item) =>
  //         (item.status && item.status.toLowerCase().includes(query)) ||
  //         (typeof item.status === "string" &&
  //           item.status.toLowerCase().includes(query))
  //     );
  //   }
  //   if (filterState.filterValue) {
  //     result = result.filter(
  //       (item) =>
  //         (typeof item.status === "string" &&
  //           item.status === filterState.filterValue) ||
  //         (item.status && item.status === filterState.filterValue)
  //     );
  //   }

  //   // if (filterState.sortValue) {
  //   //   switch (filterState.sortValue) {
  //   //     case "title_asc":
  //   //       result.sort((a, b) =>
  //   //         a.name && b.name ? a.name.localeCompare(b.name) : 0
  //   //       );
  //   //       break;
  //   //     case "title_desc":
  //   //       result.sort((a, b) =>
  //   //         a.name && b.name ? b.name.localeCompare(a.name) : 0
  //   //       );
  //   //       break;
  //   //     case "price_asc":
  //   //       result.sort((a, b) => (a.price && b.price ? a.price - b.price : 0));
  //   //       break;
  //   //     case "price_desc":
  //   //       result.sort((a, b) => (a.price && b.price ? b.price - a.price : 0));
  //   //       break;
  //   //     case "rating_asc":
  //   //       result.sort((a, b) =>
  //   //         a.ratings && b.ratings ? a.ratings - b.ratings : 0
  //   //       );
  //   //       break;
  //   //     case "rating_desc":
  //   //       result.sort((a, b) =>
  //   //         a.ratings && b.ratings ? b.ratings - a.ratings : 0
  //   //       );
  //   //       break;
  //   //   }
  //   // }

  //   return result;
  // }, [orderStatusData, filterState]);

  const handleSearch = (query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query }));
  };

  const handleFilter = (filter: string) => {
    setFilterState((prev) => ({ ...prev, filterValue: filter }));
  };

  const handleSort = (sort: string) => {
    setFilterState((prev) => ({ ...prev, sortValue: sort }));
  };

  const orderStatusTableData = useMemo(
    () => ({
      columns: [
        { key: "status", title: "Status" },
        { key: "count", title: "Total Order" },
        { key: "formattedPercentage", title: "Percentage" },
      ],
      rows: map(orderStatusList?.orders || [], (item) => ({
        ...item,
        formattedPercentage: `${item.percentage} %`,
      })),
    }),
    [orderStatusList, orderStatusSuccess]
  );
  const TopOrderProductsTableData = useMemo(
    () => ({
      columns: [
        { key: "productImage", title: "Product Image" },
        { key: "productName", title: "Product Name" },
        { key: "totalQuantitySold", title: "Total Quantity Sold" },
        { key: "totalRevenue", title: "Total Revenue" },
      ],
      rows: map(TopOrderList?.products, (item, sn) => ({
        ...item,
        productImage: "IMAGE",
      })),
    }),
    [TopOrderList, topOrderSuccess]
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
    statusSummary: orderStatusTableData,
    topOrderProducts: TopOrderProductsTableData,
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

  return (
    <div className="container px-4 py-3 mx-auto ">
      <Header text="Order Report" />

      {selectedTab === "topOrderProducts" && (
        <div className="grid grid-cols-1 gap-4 p-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              percentage={stat.percentage}
              label={stat.label}
              icon={stat.icon}
              imageBgClassName={stat.imageBgClassName}
            />
          ))}
        </div>
      )}
      <MasterTable
        loading={orderStatusLoading}
        tabsOptions={
          <DynamicTab
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            tabOptions={orderReportTabOption}
          />
        }
        // filterSection={
        //   <SearchFilterSort
        //     onSearch={handleSearch}
        //     onFilter={handleFilter}
        //     onSort={handleSort}
        //     onViewChange={() => {}}
        //     showFilter={true}
        //     showSort={true}
        //     showView={true}
        //     filterOptions={filterOptions}
        //     sortOptions={sortOptions}
        //     placeholder="Search products..."
        //   />
        // }
        rows={tableDataObj[selectedTab].rows || []}
        columns={tableDataObj[selectedTab].columns}
        canSelect
      />
    </div>
  );
};

export default OrderReport;
