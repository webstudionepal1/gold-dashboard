import { useState } from "react";
import Header from "../../components/shared/table_heading/Header";
import { Link, useNavigate } from "react-router-dom";
import { FrontendRoutes } from "../../routes/routes";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SearchFilterSort } from "../../components/global/SearchFilterSort";
import {
  type ColumnConfig,
  Table,
  type TableData,
} from "../../components/shared/Table";

interface CustomerItem {
  _id: string;
  item: string;
  qty: number;
  unit: string;
  reorder_point: number;
  status: "On Stock" | "Low Stock" | "Out of Stock";
}

const InventoryIndex = () => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  // const [selectedTab, setSelectedTab] = useState("home_page");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setisViewModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CustomerItem | null>(null);

  console.log(
    isModalOpen,
    selectedFilter,
    selectedSort,
    isViewModalOpen,
    editingItem
  );
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

  const filterItems = (items: CustomerItem[]) => {
    return items.filter(
      (item) =>
        item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item._id?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleViewItem = (item: TableData<CustomerItem>) => {
    navigate(`${FrontendRoutes.CUSTOMERDETAILS}`);
  };

  const handleEditItem = (item: TableData<CustomerItem>) => {
    // // Check which tab is selected and set the editing item accordingly
    // if (selectedTab === "home_page") {
    //   setEditingItem(item); // Set the item for the Home Page Banner
    // } else if (selectedTab === "other_page") {
    //   setEditingItem(item); // Set the item for the Other Page Banner
    // }
    setIsModalOpen(true); // Open the modal for either banner
    console.log(item);
  };

  const handleDeleteItem = (item: TableData<CustomerItem>) => {
    console.log("Delete item:", item);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
  };

  const filterOptions = [
    { value: "", label: "All Customers" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const sortOptions = [
    { value: "", label: "Default" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "orders-high", label: "Orders (High)" },
    { value: "orders-low", label: "Orders (Low)" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Stock":
        return "bg-[#e9fbef] text-[#1dc45e] px-8";
      case "Low Stock":
        return "bg-[#fffae6] text-[#ffcc01] px-8";
      case "Out of Stock":
        return "bg-[#ffeceb] text-[#ff3a2f] px-7";

      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const [inventoryItems] = useState<CustomerItem[]>([
    {
      _id: "1",
      item: "Gold",
      qty: 45,
      unit: "Tola",
      reorder_point: 45,
      status: "On Stock",
    },
    {
      _id: "2",
      item: "Gold",
      qty: 45,
      unit: "Tola",
      reorder_point: 45,
      status: "On Stock",
    },
    {
      _id: "3",
      item: "Gold",
      qty: 45,
      unit: "Tola",
      reorder_point: 45,
      status: "On Stock",
    },
    {
      _id: "4",
      item: "Silver",
      qty: 45,
      unit: "Tola",
      reorder_point: 45,
      status: "Low Stock",
    },
    {
      _id: "5",
      item: "Silver",
      qty: 45,
      unit: "Tola",
      reorder_point: 45,
      status: "Low Stock",
    },
    {
      _id: "6",
      item: "Silver",
      qty: 45,
      unit: "Tola",
      reorder_point: 45,
      status: "Low Stock",
    },
    {
      _id: "7",
      item: "Diamond",
      qty: 45,
      unit: "Tola",
      reorder_point: 45,
      status: "Out of Stock",
    },
    {
      _id: "8",
      item: "Diamond",
      qty: 45,
      unit: "Tola",
      reorder_point: 45,
      status: "Out of Stock",
    },
    {
      _id: "9",
      item: "Diamond",
      qty: 45,
      unit: "Tola",
      reorder_point: 45,
      status: "Out of Stock",
    },
    {
      _id: "10",
      item: "Diamond",
      qty: 45,
      unit: "Tola",
      reorder_point: 45,
      status: "Out of Stock",
    },
  ]);

  const columns: ColumnConfig<CustomerItem>[] = [
    {
      key: "item",
      header: "Items",
      render: (_: any, row: any) => (
        <div className="flex items-center">
          <img
            src={
              "https://imgs.search.brave.com/N7iiPmgTwP6DQJtXQfwaAm-6xOmlKftSIdIkAcau0yk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE5/ODI1MjY3Mi9waG90/by9lbmdhZ2VtZW50/LWRpYW1vbmQtcmlu/Zy1qZXdlbHJ5LWlz/b2xhdGVkLW9uLXdo/aXQlRDElODMtYmFj/a2dyb3VuZC5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9cDFu/Q2o0SDBkWnFURlBs/YTVxT0hMSnRDQUZJ/Y0F6NW5zeGU2UDJs/cWdXMD0"
            }
            alt={row.product}
            className="w-10 h-10 rounded-md mr-3 object-cover"
          />
          <div>
            <h1 className="font-medium text-gray-900">{row.item}</h1>
            <p className=" text-[#8795a8]">ID:P987654</p>
          </div>
        </div>
      ),
    },
    { header: "Qty", key: "qty" },
    { header: "Unit", key: "unit" },
    { header: "Reorder Point", key: "reorder_point" },
    {
      header: "Status",
      key: "status",
      render: (value, row) => (
        <span
          className={`px-5 py-1 rounded-full text-xs ${getStatusColor(
            row.status
          )}`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const renderCustomerTable = (items: CustomerItem[]) => {
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
    <>
      <div className="container mx-auto px-4 py-3">
        <Header text="Inventory">
          <button className="px-3 py-2  flex items-center  text-white bg-[#d49327] transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg">
            <Link className="flex items-center" to={FrontendRoutes.ADDCUSTOMER}>
              <Icon
                icon="material-symbols-light:add-rounded"
                width="24"
                height="24"
                className="fill-white"
              />{" "}
              New Product
            </Link>
          </button>
        </Header>

        <div className="bg-[#ffffff] border-[#dcdddf] pb-[1rem] border rounded-xl">
          <div className="p-4">
            <SearchFilterSort
              onFilter={handleFilter}
              onSort={handleSort}
              filterOptions={filterOptions}
              sortOptions={sortOptions}
              placeholder="Search here..."
            />
          </div>
          <div className="mx-2">{renderCustomerTable(inventoryItems)}</div>
        </div>
      </div>
    </>
  );
};

export default InventoryIndex;
