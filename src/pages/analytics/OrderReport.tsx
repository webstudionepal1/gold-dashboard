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
import { useOutsideClick } from "../../hooks/UseOutsideClick";

interface Order_Report {
  _id: string;
  status?: string;
  totalOrder?: number;
  percentage: string;
  product?: string;
  category?: string;
}
const OrderReport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSort, setSelectedSort] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useOutsideClick(() => setIsModalOpen(false));

  // Sample inventory data for different tabs
  const [StatusSummary] = useState<Order_Report[]>([
    {
      _id: "1",
      status: "assigned",
      totalOrder: 120,
      percentage: "12%",
    },
    {
      _id: "2",
      status: "assigned",
      totalOrder: 120,
      percentage: "12%",
    },
    {
      _id: "3",
      status: "assigned",
      totalOrder: 120,
      percentage: "12%",
    },
    {
      _id: "4",
      status: "assigned",
      totalOrder: 120,
      percentage: "12%",
    },
    {
      _id: "5",
      status: "assigned",
      totalOrder: 120,
      percentage: "12%",
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

  const [TopOrderedProducts] = useState<Order_Report[]>([
    {
      _id: "1",
      product: "anklets",
      category: "gold",
      percentage: "12%",
    },
    {
      _id: "2",
      product: "anklets",
      category: "gold",
      percentage: "12%",
    },
    {
      _id: "3",
      product: "anklets",
      category: "gold",
      percentage: "12%",
    },
    {
      _id: "4",
      product: "anklets",
      category: "gold",
      percentage: "12%",
    },
  ]);

  const filterItems = (items: Order_Report[]) => {
    return items.filter((item) =>
      item?.percentage.includes(searchQuery.toLowerCase())
    );
  };

  const handleViewItem = (item: TableData<Order_Report>) => {
    console.log("View item:", item);
  };

  const handleEditItem = (item: TableData<Order_Report>) => {
    console.log("Edit item:", item);
  };

  const handleDeleteItem = (item: TableData<Order_Report>) => {
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

  const columns1: ColumnConfig<Order_Report>[] = [
    {
      header: "Status",
      key: "status",
    },
    {
      header: "Total Order",
      key: "totalOrder",
    },
    {
      header: "Percentage",
      key: "percentage",
    },
  ];
  const columns2: ColumnConfig<Order_Report>[] = [
    {
      header: "Product",
      key: "product",
    },
    {
      header: "Category",
      key: "category",
    },
    {
      header: "Percentage",
      key: "percentage",
    },
  ];

  const [columns, setColumns] =
    useState<ColumnConfig<Order_Report>[]>(columns1);

  const renderInventoryTable = (items: Order_Report[]) => {
    const filteredItems = filterItems(items);

    return (
      <Table
        columns={columns}
        data={filteredItems}
        showEdit={false}
        showDelete={false}
        showView={true}
        showAction={false}
        showSelectAll={true}
        // viewRow={handleViewItem}
        // editRow={handleEditItem}
        // deleteRow={handleDeleteItem}
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Report</h1>
      <div className="bg-white rounded-lg shadow">
        <Tabs defaultValue="statusSummary" className="w-full">
          {/* Container for both TabsList and SearchFilterSort */}
          <div className="flex items-center justify-between border-b">
            <TabsList className="bg-transparent p-0 h-auto">
              <TabsTrigger
                value="statusSummary"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
                onClick={() => setColumns(columns1)}
              >
                Status Summary
              </TabsTrigger>
              <TabsTrigger
                value="topOrders"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
                onClick={() => setColumns(columns2)}
              >
                Top Ordered Products
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
            value="statusSummary"
            className="px-4 pb-4 "
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            {renderInventoryTable(StatusSummary)}
          </TabsContent>
          <TabsContent value="topOrders" className="px-4 pb-4">
            {renderInventoryTable(TopOrderedProducts)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrderReport;
