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

interface Sales_Report {
  _id: string;
  category: string;
  totalOrders: number;
  revenue: string;
  percentageShare: string;
}

const SalesReport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSort, setSelectedSort] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useOutsideClick(() => setIsModalOpen(false));

  // Sample inventory data for different tabs
  const [Product] = useState<Sales_Report[]>([
    {
      _id: "1",
      category: "Gold",
      totalOrders: 122,
      revenue: "23.0%",
      percentageShare: "1%",
    },
    {
      _id: "2",
      category: "Silver",
      totalOrders: 122,
      revenue: "23.0%",
      percentageShare: "1%",
    },
    {
      _id: "3",
      category: "Watch",
      totalOrders: 122,
      revenue: "23.0%",
      percentageShare: "1%",
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

  const [Category] = useState<Sales_Report[]>([
    {
      _id: "1",
      category: "Gold",
      totalOrders: 122,
      revenue: "23.0%",
      percentageShare: "1%",
    },
    {
      _id: "2",
      category: "Silver",
      totalOrders: 122,
      revenue: "23.0%",
      percentageShare: "1%",
    },
    {
      _id: "3",
      category: "Watch",
      totalOrders: 122,
      revenue: "23.0%",
      percentageShare: "1%",
    },
  ]);

  const filterItems = (items: Sales_Report[]) => {
    return items.filter(
      (item) =>
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item._id?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleViewItem = (item: TableData<Sales_Report>) => {
    console.log("View item:", item);
  };

  const handleEditItem = (item: TableData<Sales_Report>) => {
    console.log("Edit item:", item);
  };

  const handleDeleteItem = (item: TableData<Sales_Report>) => {
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

  const columns: ColumnConfig<Sales_Report>[] = [
    {
      header: "Category",
      key: "category",
    },
    {
      header: "Total Orders",
      key: "totalOrders",
    },
    {
      header: "Revenue",
      key: "revenue",
    },
    {
      header: "Percentage Share",
      key: "percentageShare",
    },
  ];

  const renderInventoryTable = (items: Sales_Report[]) => {
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Sales Report</h1>
      <div className="bg-white rounded-lg shadow">
        <Tabs defaultValue="product" className="w-full">
          {/* Container for both TabsList and SearchFilterSort */}
          <div className="flex items-center justify-between border-b">
            <TabsList className="bg-transparent p-0 h-auto">
              <TabsTrigger
                value="product"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                Product Wise
              </TabsTrigger>
              <TabsTrigger
                value="category"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                Category Wise
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
            value="product"
            className="px-4 pb-4 "
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            {renderInventoryTable(Product)}
          </TabsContent>
          <TabsContent value="category" className="px-4 pb-4">
            {renderInventoryTable(Category)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SalesReport;
