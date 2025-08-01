import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MasterTable from "../../components/shared/MasterTable";

import Header from "../../components/shared/table_heading/Header";

import { get, map } from "lodash";
import {
  IFetchExpenses,
  IFetchExpensesCategory,
} from "../../server/api/expensesHook";

import { SearchFilterSort } from "../../components/global/SearchFilterSort";

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

  return (
    <div className="container mx-auto ">
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
    </div>
  );
};

export default CustomerIndex;
