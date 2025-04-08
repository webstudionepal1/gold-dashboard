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

interface Store_Report {
  _id: string;
  category?: string;
  totalItems?: number;
  totalStock: number;
  lowStockItem?: number;
  outOfStock?: number;
  productName?: string;
  currentStock?: number;
  minimumStock?: number;
  status?: number;
}
const StoreReport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSort, setSelectedSort] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useOutsideClick(() => setIsModalOpen(false));

  // Sample inventory data for different tabs
  const [Category] = useState<Store_Report[]>([
    {
      _id: "1",
      category: "Maintenance",
      totalItems: 10,
      totalStock: 12,
      lowStockItem: 1,
      outOfStock: 2,
    },
    {
      _id: "2",
      category: "Inventory",
      totalItems: 10,
      totalStock: 12,
      lowStockItem: 1,
      outOfStock: 2,
    },
    {
      _id: "3",
      category: "Salaries",
      totalItems: 10,
      totalStock: 12,
      lowStockItem: 1,
      outOfStock: 2,
    },
    {
      _id: "4",
      category: "Utilities",
      totalItems: 10,
      totalStock: 12,
      lowStockItem: 1,
      outOfStock: 2,
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

  const [Low_Stock] = useState<Store_Report[]>([
    {
      _id: "1",
      productName: "Maintenance",
      currentStock: 10,
      minimumStock: 1,
      totalStock: 12,
      status: 2,
    },
    {
      _id: "2",
      productName: "Inventory",
      currentStock: 10,
      minimumStock: 1,
      totalStock: 12,
      status: 2,
    },
    {
      _id: "3",
      productName: "salaries",
      currentStock: 10,
      minimumStock: 1,
      totalStock: 12,
      status: 2,
    },
    {
      _id: "4",
      productName: "utilities",
      currentStock: 10,
      minimumStock: 1,
      totalStock: 12,
      status: 2,
    },
  ]);

  const filterItems = (items: Store_Report[]) => {
    return items.filter((item) =>
      item._id?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleViewItem = (item: TableData<Store_Report>) => {
    console.log("View item:", item);
  };

  const handleEditItem = (item: TableData<Store_Report>) => {
    console.log("Edit item:", item);
  };

  const handleDeleteItem = (item: TableData<Store_Report>) => {
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

  const columns1: ColumnConfig<Store_Report>[] = [
    {
      header: "Category",
      key: "category",
    },
    {
      header: "Total Items",
      key: "totalItems",
    },
    {
      header: "Total Stock",
      key: "totalStock",
    },
    {
      header: "Low Stock Item",
      key: "lowStockItem",
    },
    {
      header: "Out of Stock",
      key: "outOfStock",
    },
  ];
  const columns2: ColumnConfig<Store_Report>[] = [
    {
      header: "Product Name",
      key: "productName",
    },
    {
      header: "Current Stock",
      key: "currentStock",
    },
    {
      header: "Minimum Stock",
      key: "minimumStock",
    },
    {
      header: "Total Stock",
      key: "totalStock",
    },
    {
      header: "Status",
      key: "status",
    },
  ];

  const [columns, setColumns] =
    useState<ColumnConfig<Store_Report>[]>(columns1);

  const renderInventoryTable = (items: Store_Report[]) => {
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Store Report</h1>
      <div className="bg-white rounded-lg shadow">
        <Tabs defaultValue="category" className="w-full">
          {/* Container for both TabsList and SearchFilterSort */}
          <div className="flex items-center justify-between border-b">
            <TabsList className="bg-transparent p-0 h-auto">
              <TabsTrigger
                value="category"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
                onClick={() => setColumns(columns1)}
              >
                Category Wise
              </TabsTrigger>
              <TabsTrigger
                value="lowStock"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
                onClick={() => setColumns(columns2)}
              >
                Low Stock-Wise
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
            value="category"
            className="px-4 pb-4 "
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            {renderInventoryTable(Category)}
          </TabsContent>
          <TabsContent value="lowStock" className="px-4 pb-4">
            {renderInventoryTable(Low_Stock)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StoreReport;
