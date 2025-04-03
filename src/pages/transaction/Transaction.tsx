import type React from "react";
import { useState } from "react";
import { ColumnConfig, Table, TableData } from "../../components/shared/Table";
import { SearchFilterSort } from "../../components/global/SearchFilterSort";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/shared/tab";
import TransactionDetails from "./components/TransactionDetails";
import { useOutsideClick } from "../../hooks/UseOutsideClick";

interface Transaction {
  _id: string;
  customername: string;
  phone: string;
  orderId: string;
  orderDate: string;
  totalAmount: number;
  status: "Delivered" | "In Process";
}

const Transaction: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSort, setSelectedSort] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useOutsideClick(() => setIsModalOpen(false));

  // Sample inventory data for different tabs
  const [Cash] = useState<Transaction[]>([
    {
      _id: "1",
      customername: "Ram Prasad",
      phone: "0987654321",
      orderId: "45",
      orderDate: "2 April 2025",
      totalAmount: 1000,
      status: "Delivered",
    },
    {
      _id: "2",
      customername: "Ram Prasad",
      phone: "0987654321",
      orderId: "45",
      orderDate: "2 April 2025",
      totalAmount: 1000,
      status: "Delivered",
    },
    {
      _id: "3",
      customername: "Ram Prasad",
      phone: "0987654321",
      orderId: "45",
      orderDate: "2 April 2025",
      totalAmount: 1000,
      status: "Delivered",
    },
  ]);

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

  const [DigitalPayment] = useState<Transaction[]>([
    {
      _id: "3",
      customername: "Ram Prasad",
      phone: "0987654321",
      orderId: "45",
      orderDate: "2 April 2025",
      totalAmount: 1000,
      status: "Delivered",
    },
    {
      _id: "2",
      customername: "Ram Prasad",
      phone: "0987654321",
      orderId: "45",
      orderDate: "2 April 2025",
      totalAmount: 1000,
      status: "Delivered",
    },
    {
      _id: "1",
      customername: "Ram Prasad",
      phone: "0987654321",
      orderId: "45",
      orderDate: "2 April 2025",
      totalAmount: 1000,
      status: "Delivered",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filterItems = (items: Transaction[]) => {
    return items.filter(
      (item) =>
        item.customername.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item._id?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleViewItem = (item: TableData<Transaction>) => {
    console.log("View item:", item);
  };

  const handleEditItem = (item: TableData<Transaction>) => {
    console.log("Edit item:", item);
  };

  const handleDeleteItem = (item: TableData<Transaction>) => {
    console.log("Delete item:", item);
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

  const columns: ColumnConfig<Transaction>[] = [
    {
      header: "Customer Name",
      key: "customername",
      render: (_, row) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{row.customername}</div>
            {row._id && (
              <div className="text-sm text-gray-500">ID {row._id}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Phone No.",
      key: "phone",
    },
    {
      header: "Order ID",
      key: "orderId ",
    },
    {
      header: "Order date",
      key: "orderDate",
    },
    {
      header: "Total Amount",
      key: "total",
    },
    {
      header: "Status",
      key: "status",
      render: (_, row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            row.status
          )}`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const renderInventoryTable = (items: Transaction[]) => {
    const filteredItems = filterItems(items);

    return (
      <Table
        columns={columns}
        data={filteredItems}
        showEdit={false}
        showDelete={false}
        showView={true}
        showAction={true}
        showSelectAll={true}
        viewRow={handleViewItem}
        editRow={handleEditItem}
        deleteRow={handleDeleteItem}
        showPagination={true}
        paginationDetails={{
          currentPage,
          limit: itemsPerPage,
          totalCount: filteredItems.length,
        }}
        onItemsPerPageChange={handleItemsPerPageChange}
        onPageChange={handlePageChange}
        showBg={true}
      />
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Transaction</h1>
      <div className="bg-white rounded-lg shadow">
        <Tabs defaultValue="cash" className="w-full">
          {/* Container for both TabsList and SearchFilterSort */}
          <div className="flex items-center justify-between border-b">
            <TabsList className="bg-transparent p-0 h-auto">
              <TabsTrigger
                value="cash"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                Cash
              </TabsTrigger>
              <TabsTrigger
                value="digitalPayment"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                Digital Payment
              </TabsTrigger>
            </TabsList>

            {/* SearchFilterSort moved here and aligned to the right */}
            <div className="p-4">
              <SearchFilterSort
                onSearch={handleSearch}
                onFilter={handleFilter}
                onSort={handleSort}
                filterOptions={filterOptions}
                sortOptions={sortOptions}
                placeholder="Search here..."
              />
            </div>
          </div>

          {/* Tab content remains unchanged */}
          <TabsContent
            value="cash"
            className="px-4 pb-4 "
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            {renderInventoryTable(Cash)}
          </TabsContent>
          <TabsContent value="digitalPayment" className="px-4 pb-4">
            {renderInventoryTable(DigitalPayment)}
          </TabsContent>
        </Tabs>
      </div>

      {isModalOpen && (
        <TransactionDetails modalRef={modalRef} setOpenModal={setIsModalOpen} />
      )}
    </div>
  );
};

export default Transaction;
