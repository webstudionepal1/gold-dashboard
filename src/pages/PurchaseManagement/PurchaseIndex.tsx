import { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/shared/tab";
import { Table, TableData } from "../../components//shared/Table";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SearchFilterSort } from "../../components/global/SearchFilterSort";
import { Link, useNavigate } from "react-router-dom";
import { FrontendRoutes } from "../../routes/routes";
import Header from "../../components/shared/table_heading/Header";
import { Modal } from "../../components/shared";
import PurchaseForm from "./components/PurchaseForm";
import { ScrollableModal } from "../../components/shared/ScrollableModal";

// Dummy datasets

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-[#e9fbef] text-[#6db289]";
    case "Pending":
      return "bg-[#d1d1d1] text-[#8d8d8d]";
    case "In Progress":
      return "bg-blue-100 text-blue-800";
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "Cancelled":
      return "bg-[#f9ebea] text-[#ce8b8e]";
    case "Not Completed":
      return "bg-[#f9ebea] text-[#ce8b8e]";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const PurchaseData: TableData[] = [
  {
    _id: "1",
    purchase_id: "P-4565",
    supplier_name: "Gold supplier pvt ltd",
    cost_price: "Rs.45",
    paid: "Rs.45",
    due: "Rs.45",

    qty: 55,
  },
  {
    _id: "2",
    purchase_id: "P-4565",
    supplier_name: "Gold supplier pvt ltd",
    cost_price: "Rs.45",
    paid: "Rs.45",
    due: "Rs.45",

    qty: 55,
  },
  {
    _id: "3",
    purchase_id: "P-4565",
    supplier_name: "Gold supplier pvt ltd",
    cost_price: "Rs.45",
    paid: "Rs.45",
    due: "Rs.45",

    qty: 55,
  },
  {
    _id: "4",
    purchase_id: "P-4565",
    supplier_name: "Gold supplier pvt ltd",
    cost_price: "Rs.45",
    paid: "Rs.45",
    due: "Rs.45",

    qty: 55,
  },
];

const PurchaseReturnData: TableData[] = [
  {
    _id: "1",
    rid: "P-4565",
    supplier_name: "Gold Supplier p...",
    item_name: "gold",
    qty: "1 Tola",
    price_per_qty: "Rs.175,000",
    refund_amt: "Rs.175,000",
    reason: "Reason for return",
  },

  {
    _id: "2",
    rid: "P-4565",
    supplier_name: "Gold Supplier p...",
    item_name: "gold",
    qty: "1 Tola",
    price_per_qty: "Rs.175,000",
    refund_amt: "Rs.175,000",
    reason: "Reason for return",
  },

  {
    _id: "3",
    rid: "P-4565",
    supplier_name: "Gold Supplier p...",
    item_name: "gold",
    qty: "1 Tola",
    price_per_qty: "Rs.175,000",
    refund_amt: "Rs.175,000",
    reason: "Reason for return",
  },

  {
    _id: "4",
    rid: "P-4565",
    supplier_name: "Gold Supplier p...",
    item_name: "gold",
    qty: "1 Tola",
    price_per_qty: "Rs.175,000",
    refund_amt: "Rs.175,000",
    reason: "Reason for return",
  },
];

const supplierData: TableData[] = [
  {
    _id: "1",
    supplier_name: "Charming Charms Ltd.",
    contact_person: "Tara Nair",
    item_category: "GemStones",
    contact_no: "+977-9901234567",
    lead_time: "2-3 Days",
  },
  {
    _id: "2",
    supplier_name: "Opulent Jewels House",
    contact_person: "Pooja Reddy",
    item_category: "Anklets",
    contact_no: "+977-9889012345",
    lead_time: "2-3 Days",
  },

  {
    _id: "3",
    supplier_name: "Treasured Trinkets Co.",
    contact_person: "Aditya Verma",
    item_category: "Brooches",
    contact_no: "+977-9878901234",
    lead_time: "2-3 Days",
  },

  {
    _id: "4",
    supplier_name: "Dazzling Diamonds Ltd.",
    contact_person: "Vikram Joshi",
    item_category: "Bracelets",
    contact_no: "+977-9856789012",
    lead_time: "2-3 Days",
  },
];

// Dynamic config per tab
const tabConfig = {
  all: {
    data: PurchaseData,
    columns: [
      { key: "purchase_id", header: "Purchase Id" },
      { key: "supplier_name", header: "Supplier Name" },
      { key: "cost_price", header: "Cost Price" },
      { key: "paid", header: "Paid" },
      { key: "due", header: "Due" },
      { key: "qty", header: "Qty" },
    ],
  },
  purchase_return_data: {
    data: PurchaseReturnData,
    columns: [
      { key: "rid", header: "RID" },
      { key: "supplier_name", header: "Supplier Name" },
      { key: "item_name", header: "Item Name" },
      { key: "qty", header: "Qty" },
      { key: "price_per_qty", header: "Price Per Qty" },
      { key: "refund_amt", header: "Refund Amt" },
      { key: "reason", header: "Reason" },
    ],
  },
  suppliers: {
    data: supplierData,
    columns: [
      { key: "supplier_name", header: "Supplier Name" },

      { key: "contact_person", header: "Contact Person" },
      { key: "item_category", header: "Item Category" },
      { key: "contact_no", header: "Contact No" },
      { key: "lead_time", header: "Lead Time" },

      //   {
      //     header: "Status",
      //     key: "status",
      //     render: (_: any, row: any) => (
      //       <span
      //         className={`px-5 py-1 rounded-full text-xs ${getStatusColor(
      //           row.status
      //         )}`}
      //       >
      //         {row.status}
      //       </span>
      //     ),
      //   },
    ],
  },
};

const PurchaseIndex = () => {
  const [selectedTab, setSelectedTab] = useState<keyof typeof tabConfig>("all");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const ModalClose = () => {
    setIsModalOpen(false);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState("");
  console.log(selectedFilter);
  const [selectedSort, setSelectedSort] = useState("");
  console.log(selectedSort);

  const navigate = useNavigate();

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
  const filterItems = (items: any[]) => {
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item._id?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleViewItem = (item: TableData<TableData>) => {
    navigate(`${FrontendRoutes.SUPPLIERDETAIL}`);
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

  const { data, columns } = tabConfig[selectedTab];

  return (
    <div className="container mx-auto px-4 py-3 ">
      {/* <div className="mt-2 mb-6 flex items-center justify-between">
        <h1 className="font-semibold text-3xl">Orders</h1>
        <Link
          to={FrontendRoutes.ADDORDER}
          className="bg-[#e38b29] flex items-center transition-transform duration-200 ease-in-out hover:scale-105 text-white rounded-lg px-3 py-2"
        >
          <Icon
            icon="material-symbols-light:add-rounded"
            width="24"
            height="24"
            className="fill-white"
          />{" "}
          Add Orders
        </Link>
      </div> */}

      <Header text="Purchase Management">
        {selectedTab === "all" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-2 flex items-center text-white bg-[#d49327] transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg"
          >
            <Icon
              icon="material-symbols-light:add-rounded"
              width="24"
              height="24"
              className="fill-white"
            />{" "}
            New Purchase
          </button>
        )}

        {selectedTab === "suppliers" && (
          <button className="px-3 py-2 flex items-center text-white bg-[#d49327] transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg">
            <Link
              className="flex items-center"
              to={FrontendRoutes.ADDSUPPLIERS}
            >
              <Icon
                icon="material-symbols-light:add-rounded"
                width="24"
                height="24"
                className="fill-white"
              />{" "}
              Add Supplier
            </Link>
          </button>
        )}
      </Header>
      <div className="bg-[#ffffff] border-[#eae9ec] border-2 w-full pb-[2rem] rounded-xl ">
        <Tabs
          value={selectedTab}
          onValueChange={(val) => setSelectedTab(val as keyof typeof tabConfig)}
          className="w-full"
        >
          <div className="flex flex-col md:flex-row items-center justify-between w-full">
            <TabsList>
              <TabsTrigger
                value="all"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                Purchase
              </TabsTrigger>
              <TabsTrigger
                value="purchase_return_data"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                Purchase Return
              </TabsTrigger>
              <TabsTrigger
                value="suppliers"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                Supplier
              </TabsTrigger>
            </TabsList>

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

          <TabsContent className="mx-3 " value={selectedTab}>
            <Table
              data={data}
              columns={columns}
              showView
              showDelete={selectedTab !== "purchase_return_data"}
              showEdit
              showAction
              viewRow={handleViewItem}
              showPagination={true}
              paginationDetails={{
                currentPage,
                limit: itemsPerPage,
                totalCount: filterItems.length,
              }}
              onItemsPerPageChange={handleItemsPerPageChange}
              onPageChange={handlePageChange}
            />
          </TabsContent>
        </Tabs>
      </div>
      {isModalOpen && (
        <ScrollableModal>
          <PurchaseForm onClose={ModalClose} />
        </ScrollableModal>
      )}
    </div>
  );
};

export default PurchaseIndex;
