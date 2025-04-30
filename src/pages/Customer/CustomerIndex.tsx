// import { useState } from "react";
// import Header from "../../components/shared/table_heading/Header";
// import { Link, useNavigate } from "react-router-dom";
// import { FrontendRoutes } from "../../routes/routes";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import { SearchFilterSort } from "../../components/global/SearchFilterSort";
// import {
//   type ColumnConfig,
//   Table,
//   type TableData,
// } from "../../components/shared/Table";
// import {
//   useDeleteCustomerMutation,
//   useGetCustomerQuery,
// } from "../../server/api/customerHook";

// interface CustomerItem {
//   _id: string;
//   customer_name: string;
//   email: string;
//   address: string;
//   contact_number: string;
//   total_order: string;
// }

// const CustomerIndex = () => {
//   const [selectedFilter, setSelectedFilter] = useState("");
//   const [selectedSort, setSelectedSort] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const {
//     data: customers = [],
//     isLoading,
//     error,
//   } = useGetCustomerQuery({ role: "customer" });

//   const customerTableData: CustomerItem[] = customers.map(
//     (customer, index) => ({
//       _id: customer._id,
//       customer_name: customer.name,
//       email: customer.email,
//       address: customer.address,
//       contact_number: customer.phone,
//       total_order: customer.orders?.length?.toString() ?? "0",
//     })
//   );
//   const { mutate: deleteCustomer } = useDeleteCustomerMutation();

//   const handleDeleteItem = (item: TableData<CustomerItem>) => {
//     deleteCustomer(item._id);
//   };

//   const navigate = useNavigate();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isViewModalOpen, setisViewModalOpen] = useState(false);
//   const [editingItem, setEditingItem] = useState<CustomerItem | null>(null);

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     setCurrentPage(1);
//   };

//   const handleFilter = (filter: string) => {
//     setSelectedFilter(filter);
//     setCurrentPage(1);
//   };

//   const handleSort = (sort: string) => {
//     setSelectedSort(sort);
//     setCurrentPage(1);
//   };

//   const filterItems = (items: CustomerItem[]) => {
//     return items.filter(
//       (item) =>
//         item.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item._id?.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   };

//   const handleViewItem = (item: TableData<CustomerItem>) => {
//     navigate(`/customer/customer-details/${item._id}`);
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleItemsPerPageChange = (limit: number) => {
//     setItemsPerPage(limit);
//     setCurrentPage(1);
//   };

//   const filterOptions = [
//     { value: "", label: "All Customers" },
//     { value: "active", label: "Active" },
//     { value: "inactive", label: "Inactive" },
//   ];

//   const sortOptions = [
//     { value: "", label: "Default" },
//     { value: "name-asc", label: "Name (A-Z)" },
//     { value: "name-desc", label: "Name (Z-A)" },
//     { value: "orders-high", label: "Orders (High)" },
//     { value: "orders-low", label: "Orders (Low)" },
//   ];

//   const columns: ColumnConfig<CustomerItem>[] = [
//     { header: "Customer Name", key: "customer_name" },
//     { header: "Email", key: "email" },
//     { header: "Address", key: "address" },
//     { header: "Contact Number", key: "contact_number" },
//     { header: "Total Order", key: "total_order" },
//   ];

//   const renderCustomerTable = (items: CustomerItem[]) => {
//     const filteredItems = filterItems(items);
//     const paginatedItems = filteredItems.slice(
//       (currentPage - 1) * itemsPerPage,
//       currentPage * itemsPerPage
//     );
//     if (isLoading) return <div>Loading...</div>;
//     if (error) return <div>Something went wrong</div>;
//     return (
//       <Table
//         columns={columns}
//         data={paginatedItems}
//         showEdit={false}
//         showDelete={true}
//         showView={true}
//         showAction={true}
//         showSelectAll={true}
//         viewRow={handleViewItem}
//         deleteRow={handleDeleteItem}
//         showPagination={true}
//         paginationDetails={{
//           currentPage,
//           limit: itemsPerPage,
//           totalCount: filteredItems.length,
//         }}
//         onItemsPerPageChange={handleItemsPerPageChange}
//         onPageChange={handlePageChange}
//         showBg={true}
//       />
//     );
//   };

//   return (
//     <>
//       <div className="container mx-auto px-4 py-3">
//         <Header text="Customer List">
//           {/* <button className="px-3 py-2  flex items-center  text-white bg-[#d49327] transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg">
//             <Link className="flex items-center" to={FrontendRoutes.ADDCUSTOMER}>
//               <Icon
//                 icon="material-symbols-light:add-rounded"
//                 width="24"
//                 height="24"
//                 className="fill-white"
//               />{" "}
//               New Customer
//             </Link>
//           </button> */}
//         </Header>

//         <div className="bg-[#ffffff] border-[#dcdddf] pb-[1rem] border rounded-xl">
//           <div className="p-4">
//             <SearchFilterSort
//               onSearch={handleSearch}
//               onFilter={handleFilter}
//               onSort={handleSort}
//               filterOptions={filterOptions}
//               sortOptions={sortOptions}
//               placeholder="Search here..."
//             />
//           </div>
//           <div className="mx-2">{renderCustomerTable(customerTableData)}</div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CustomerIndex;

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

import { get, map } from "lodash";
import {
  IFetchExpenses,
  IFetchExpensesCategory,
  useDeleteExpenseCategoryMutation,
  useDeleteExpenseMutation,
  useGetExpenseCategoryQuery,
  useGetExpensesQuery,
} from "../../server/api/expensesHook";
import ExpenseForm from "../financeandexpenses/components/ExpenseForm";
import ExpenseCategoryForm from "../financeandexpenses/components/ExpenseCategoryForm";
import { SearchFilterSort } from "../../components/global/SearchFilterSort";

import { updateExpenseState } from "../financeandexpenses/components/ExpenseStore";
import { updateExpenseCategoryState } from "../financeandexpenses/components/ExpenseCategoryStore";
import {
  useDeleteCustomerMutation,
  useGetCustomerQuery,
} from "../../server/api/customerHook";

export const filterOptions = [
  { value: "", label: "All" },
  { value: "name", label: "Name" },
  { value: "Email", label: "Email" },
];
export const sortOptions = [
  { value: "name_asc", label: "Name (A-Z)" },
  { value: "name_desc", label: "Name (Z-A)" },
  { value: "email_asc", label: "Email (A-Z)" },
  { value: "email_desc", label: "Email (Z-A)" },
  { value: "orders_asc", label: "Total Orders (Low-High)" },
  { value: "orders_desc", label: "Total Orders (High-Low)" },
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

const CustomerIndex = () => {
  const navigate = useNavigate();
  const {
    data: customers = [],
    isLoading: customerLoading,
    isSuccess: customerSuccess,
    error: customerError,
  } = useGetCustomerQuery({ role: "customer" });

  const { mutate: deleteCustomer } = useDeleteCustomerMutation();
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: "",
    filterValue: "",
    sortValue: "",
  });

  const customerData = useMemo(
    () => (customerSuccess ? customers : []),
    [customerSuccess, customers]
  );

  const filteredCustomers = useMemo(() => {
    if (!customerData || customerData.length === 0) return [];

    let result = [...customerData];

    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          (item.name && item.name.toLowerCase().includes(query)) ||
          (typeof item.name === "string" &&
            item.name.toLowerCase().includes(query)) ||
          (item.email && item.email.toLowerCase().includes(query))
      );
    }
    if (filterState.filterValue) {
      result = result.filter(
        (item) =>
          (typeof item.name === "string" &&
            item.name === filterState.filterValue) ||
          (item.email && item.email === filterState.filterValue)
      );
    }

    if (filterState.sortValue) {
      switch (filterState.sortValue) {
        case "name_asc":
          result.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
          break;

        case "name_desc":
          result.sort((a, b) => (b.name ?? "").localeCompare(a.name ?? ""));
          break;

        case "email_asc":
          result.sort((a, b) => (a.email ?? "").localeCompare(b.email ?? ""));
          break;

        case "email_desc":
          result.sort((a, b) => (b.email ?? "").localeCompare(a.email ?? ""));
          break;

        case "orders_asc":
          result.sort(
            (a, b) => (a.orders?.length ?? 0) - (b.orders?.length ?? 0)
          );
          break;

        case "orders_desc":
          result.sort(
            (a, b) => (b.orders?.length ?? 0) - (a.orders?.length ?? 0)
          );
          break;
      }
    }

    return result;
  }, [customerData, filterState]);

  const handleSearch = (query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query }));
  };

  const handleFilter = (filter: string) => {
    setFilterState((prev) => ({ ...prev, filterValue: filter }));
  };

  const handleSort = (sort: string) => {
    setFilterState((prev) => ({ ...prev, sortValue: sort }));
  };

  // const customerTableData = useMemo(
  //   () => ({
  //     columns: [
  //       { key: "customer_name", title: "Customer Name" },
  //       { key: "email", title: "Email" },
  //       { key: "address", title: "Address" },
  //       { key: "contact_number", title: "Contact Number" },
  //       { key: "total_order", title: "Total Order" },
  //     ],
  //     rows: map(filteredCustomers, (item) => ({
  //       ...item,
  //     })),
  //     onDelete(id: string) {
  //       deleteCustomer(id);
  //     },
  //     // viewAction(row: IFetchExpenses) {

  //     // },
  //     editAction(row: IFetchExpenses) {
  //       setModal({ of: "expenses", edit: true, data: row });
  //     },
  //   }),
  //   [filteredCustomers, customerSuccess]
  // );

  console.log("FILTERED", filteredCustomers);
  const tableData = filteredCustomers.map((customer) => ({
    ...customer,
    customerName: get(customer, "name", "-"),
    email: get(customer, "email", "-"),
    address: get(customer, "address", "-"),
    contactNumber: get(customer, "phone", "-"),
    // totalOrder: (get(customer, "orders", [])).length(),
    totalOrder: get(customer, "orders", []).length,
    // customer.orders?.length?.toString() ?? "0",
  }));

  const columns = [
    {
      title: "Customer Name",
      key: "customerName",
    },
    {
      title: "Email",
      key: "email",
    },
    {
      title: "Address",
      key: "address",
    },
    {
      title: "Contact Number",
      key: "contactNumber",
    },
    {
      title: "Total Order",
      key: "totalOrder",
    },
  ];

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
    <div className="container px-4 py-3 mx-auto ">
      <Header text="Customer List" />

      <MasterTable
        loading={customerLoading}
        columns={columns}
        onDelete={(id) => deleteCustomer(id)}
        viewAction={(row) => {
          navigate(`/customer/customer-details/${row._id}`);
        }}
        rows={tableData}
        filterSection={
          <SearchFilterSort
            onSearch={handleSearch}
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
    </div>
  );
};

export default CustomerIndex;
