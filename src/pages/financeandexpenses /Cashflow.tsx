import type React from "react";
import { useState } from "react";
import { ColumnConfig, Table, TableData } from "../../components/shared/Table";
import { SearchFilterSort } from "../../components/global/SearchFilterSort";

interface Customer {
  _id: string;
  date: string;
  categories: string;
  inflow: string;
  outflow: string;
  balance: string;
}

const Cashflow: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [customers, setCustomers] = useState<Customer[]>([
    {
      _id: "1",
      date: "2021-09-01",
      categories: "opening balance",
      inflow: "Rs 120",
      outflow: "Rs 120",
      balance: "Rs 120",
    },
    {
      _id: "2",
      date: "2021-09-01",
      categories: "opening balance",
      inflow: "Rs 120",
      outflow: "Rs 120",
      balance: "Rs 120",
    },
    {
      _id: "3",
      date: "2021-09-01",
      categories: "opening balance",
      inflow: "Rs 120",
      outflow: "Rs 120",
      balance: "Rs 120",
    },
  ]);

  const handleDeleteCustomer = (row: TableData<Customer>) => {
    setCustomers((prev) => prev.filter((o) => o._id !== row._id));
  };

  const filterOptions = [
    { value: "", label: "All Customers" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const sortOptions = [
    { value: "", label: "Default" },
    // These are just placeholders — doesn't apply to your current data
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "orders-high", label: "Orders (High)" },
    { value: "orders-low", label: "Orders (Low)" },
  ];

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.categories
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sortedCustomers = [...filteredCustomers]; // Keeping as-is unless real sort fields are added

  const columns: ColumnConfig<Customer>[] = [
    { header: "Date", key: "date" },
    { header: "Categories", key: "categories" },
    { header: "In Flow (Rs)", key: "inflow" },
    { header: "Out Flow (Rs)", key: "outflow" },
    { header: "Balance", key: "balance" },
  ];

  const handleRowSelect = (selectedIds: string[]) => {
    console.log("Selected rows:", selectedIds);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilter = (filter: string) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handleSort = (sort: string) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cash Flow</h1>
      </div>

      <div className="bg-white p-4">
        <SearchFilterSort
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSort={handleSort}
          filterOptions={filterOptions}
          sortOptions={sortOptions}
          placeholder="Search here..."
        />

        <div className="bg-white rounded-lg shadow">
          <Table
            columns={columns}
            data={sortedCustomers}
            showSelectAll={true}
            onRowSelect={handleRowSelect}
            // onToggle={handleToggleStatus} // ❌ Removed since it doesn't exist now
            deleteRow={handleDeleteCustomer}
            showPagination={true}
            paginationDetails={{
              currentPage,
              limit: itemsPerPage,
              totalCount: filteredCustomers.length,
            }}
            onItemsPerPageChange={handleItemsPerPageChange}
            onPageChange={handlePageChange}
            showBg={true}
            showAction={true}
            showEdit={true}
            showDelete={true}
            showView={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Cashflow;
