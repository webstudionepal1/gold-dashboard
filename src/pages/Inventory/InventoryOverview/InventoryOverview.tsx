import type React from "react";
import { useState } from "react";
import { SearchFilterSort } from "../../../components/global/SearchFilterSort";
import { Table, type ColumnConfig, type TableData } from "../../../components/shared/Table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/shared/tab";

interface InventoryItem {
  _id: string;
  name: string;
  image: string;
  ID?: string;
  quantity: number;
  unit: string;
  reorderPoint: number;
  status: "On Stock" | "Low Stock" | "Out of Stock";
}

const InventoryOverview: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedSort, setSelectedSort] = useState('');

  // Sample inventory data for different tabs
  const [mainStockItems] = useState<InventoryItem[]>([
    {
      _id: "1",
      name: "Gold",
      ID: "256753",
      image: "/placeholder.svg?height=40&width=40",
      quantity: 45,
      unit: "Tea",
      reorderPoint: 15,
      status: "On Stock",
    },
    {
      _id: "2",
      name: "Gold",
      ID: "256753",
      image: "/placeholder.svg?height=40&width=40",
      quantity: 30,
      unit: "Tea",
      reorderPoint: 15,
      status: "On Stock",
    },
    {
      _id: "3",
      name: "Gold",
      ID: "256753",
      image: "/placeholder.svg?height=40&width=40",
      quantity: 40,
      unit: "Tea",
      reorderPoint: 15,
      status: "On Stock",
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

  const [stock1Items] = useState<InventoryItem[]>([
    {
      _id: "4",
      name: "Silver",
      ID: "256753",
      image: "/placeholder.svg?height=40&width=40",
      quantity: 20,
      unit: "Tea",
      reorderPoint: 15,
      status: "Low Stock",
    },
    {
      _id: "5",
      name: "Silver",
      ID: "256753",
      image: "/placeholder.svg?height=40&width=40",
      quantity: 18,
      unit: "Tea",
      reorderPoint: 15,
      status: "Low Stock",
    },
  ]);

  const [stock2Items] = useState<InventoryItem[]>([
    {
      _id: "6",
      name: "Diamond",
      ID: "256753",
      image: "/placeholder.svg?height=40&width=40",
      quantity: 0,
      unit: "Tea",
      reorderPoint: 15,
      status: "Out of Stock",
    },
    {
      _id: "7",
      name: "Diamond",
      ID: "256753",
      image: "/placeholder.svg?height=40&width=40",
      quantity: 0,
      unit: "Tea",
      reorderPoint: 15,
      status: "Out of Stock",
    },
    {
      _id: "8",
      name: "Diamond",
      ID: "256753",
      image: "/placeholder.svg?height=40&width=40",
      quantity: 0,
      unit: "Tea",
      reorderPoint: 15,
      status: "Out of Stock",
    },
    {
      _id: "9",
      name: "Diamond",
      ID: "256753",
      image: "/placeholder.svg?height=40&width=40",
      quantity: 0,
      unit: "Tea",
      reorderPoint: 15,
      status: "Out of Stock",
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

  const filterItems = (items: InventoryItem[]) => {
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ID?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  const handleViewItem = (item: TableData<InventoryItem>) => {
    console.log("View item:", item);
  };

  const handleEditItem = (item: TableData<InventoryItem>) => {
    console.log("Edit item:", item);
  };

  const handleDeleteItem = (item: TableData<InventoryItem>) => {
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

  const columns: ColumnConfig<InventoryItem>[] = [
    {
      header: "Items",
      key: "items",
      render: (_, row) => (
        <div className="flex items-center">
          <img
            src={"https://imgs.search.brave.com/N7iiPmgTwP6DQJtXQfwaAm-6xOmlKftSIdIkAcau0yk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE5/ODI1MjY3Mi9waG90/by9lbmdhZ2VtZW50/LWRpYW1vbmQtcmlu/Zy1qZXdlbHJ5LWlz/b2xhdGVkLW9uLXdo/aXQlRDElODMtYmFj/a2dyb3VuZC5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9cDFu/Q2o0SDBkWnFURlBs/YTVxT0hMSnRDQUZJ/Y0F6NW5zeGU2UDJs/cWdXMD0"}
            alt={row.name}
            className="w-10 h-10 rounded-md mr-3 object-cover"
          />
          <div>
            <div className="font-medium text-gray-900">{row.name}</div>
            {row.ID && <div className="text-sm text-gray-500">ID {row.ID}</div>}
          </div>
        </div>
      ),
    },
    {
      header: "Qty",
      key: "quantity",
    },
    {
      header: "Unit",
      key: "unit",
    },
    {
      header: "Reorder Point",
      key: "reorderPoint",
    },
    {
      header: "Status",
      key: "status",
      render: (_, row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      ),
    },
  ];

  const renderInventoryTable = (items: InventoryItem[]) => {
    const filteredItems = filterItems(items);

    return (
      <Table
        columns={columns}
        data={filteredItems}
        showEdit={true}
        showDelete={true}
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Inventory</h1>
      <div className="bg-white rounded-lg shadow">
        <Tabs defaultValue="main-stock" className="w-full">
          {/* Container for both TabsList and SearchFilterSort */}
          <div className="flex items-center justify-between border-b">
            <TabsList className="bg-transparent p-0 h-auto">
              <TabsTrigger
                value="main-stock"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                Main Stock
              </TabsTrigger>
              <TabsTrigger
                value="stock-1"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                Stock 1
              </TabsTrigger>
              <TabsTrigger
                value="stock-2"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                Stock 2
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
          <TabsContent value="main-stock" className="px-4 pb-4 ">
            {renderInventoryTable(mainStockItems)}
          </TabsContent>
          <TabsContent value="stock-1" className="px-4 pb-4">
            {renderInventoryTable(stock1Items)}
          </TabsContent>
          <TabsContent value="stock-2" className="px-4 pb-4">
            {renderInventoryTable(stock2Items)}
          </TabsContent>
        </Tabs>
      </div>



    </div>
  );
};

export default InventoryOverview;