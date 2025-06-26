import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnConfig, Table, TableData } from "../../components/shared/Table";
import { SearchFilterSort } from "../../components/global/SearchFilterSort";

interface Customer {
  _id: string;
  customerId: string;
  orderId: number;
  customerName: string;
  totalAmount: number;
  isActive?: boolean;
  status: "Delivery";
}

const VerifyCashPayment: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [customers, setCustomers] = useState<Customer[]>([
    {
      _id: "1",
      customerId: "#12",
      customerName: "Olivia Bennett",
      orderId: 223344,
      status: "Delivery",
      totalAmount: 3456,
      isActive: true,
    },
    {
      _id: "2",
      customerId: "#12",
      customerName: "Olivia Bennett",
      orderId: 223344,
      status: "Delivery",
      totalAmount: 12345,
      isActive: true,
    },
    {
      _id: "3",
      customerId: "#12",
      customerName: "Olivia Bennett",
      orderId: 223344,
      status: "Delivery",
      totalAmount: 4567,
      isActive: true,
    },
  ]);

  const handleToggleStatus = (row: TableData<Customer>) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer._id === row._id
          ? {
              ...customer,
              isActive: !customer.isActive,
            }
          : customer
      )
    );
  };

  const handleDeleteCustomer = (row: TableData<Customer>) => {
    setCustomers((prev) => prev.filter((o) => o._id !== row._id));
  };

  // Filter options for the dropdown
  const filterOptions = [
    { value: "", label: "All Customers" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  // Sort options for the dropdown
  const sortOptions = [
    { value: "", label: "Default" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "orders-high", label: "Orders (High)" },
    { value: "orders-low", label: "Orders (Low)" },
  ];

  // Filter customers based on search query and selected filter
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.customerName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === "active"
        ? customer.isActive
        : selectedFilter === "inactive"
        ? !customer.isActive
        : true;

    return matchesSearch && matchesFilter;
  });

  // Sort filtered customers based on selected sort option
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (selectedSort === "name-asc") {
      return a.customerName.localeCompare(b.customerName);
    } else if (selectedSort === "name-desc") {
      return b.customerName.localeCompare(a.customerName);
    } else if (selectedSort === "orders-high") {
      return b.totalAmount - a.totalAmount;
    }
    return 0;
  });

  const columns: ColumnConfig<Customer>[] = [
    { header: "Customer Name", key: "customerName" },

    { header: "Order Id", key: "orderId" },
    {
      header: "Total Amount",
      key: "totalAmount",
    },
    { header: "Status", key: "status" },
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
        <h1 className="text-2xl font-bold text-gray-800">Transaction</h1>
      </div>

      <div className="bg-white p-4">
        <SearchFilterSort
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
            onToggle={handleToggleStatus}
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

export default VerifyCashPayment;
