import type React from "react";
import { useState } from "react";
import {
  ColumnConfig,
  Table,
  TableData,
} from "../../../components/shared/Table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/shared/tab";
import { SearchFilterSort } from "../../../components/global/SearchFilterSort";
import { useOutsideClick } from "../../../hooks/UseOutsideClick";

interface PurchaseItem {
  _id: string;
  purchaseId?: string;
  returnId?: string;
  supplierName: string;
  costPrice?: number;
  paid?: number;
  due?: number;
  qty?: number | string;
  itemName?: string;
  pricePerQty?: number;
  refundAmt?: number;
  reason?: string;
  contactPerson?: string;
  itemCategory?: string;
  contact?: string;
  leadTime?: string;
}

const StoreReport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSort, setSelectedSort] = useState("");

  // Sample inventory data for different tabs
  const [purchaseItems] = useState<PurchaseItem[]>([
    {
      _id: "1",
      purchaseId: "P-0001",
      supplierName: "Gold supplier pvt ltd",
      costPrice: 45.45,
      paid: 25.45,
      due: 20.0,
      qty: 50,
    },
    {
      _id: "2",
      purchaseId: "P-0002",
      supplierName: "Gold supplier pvt ltd",
      costPrice: 45.45,
      paid: 25.45,
      due: 20.0,
      qty: 50,
    },
    {
      _id: "3",
      purchaseId: "P-0003",
      supplierName: "Gold supplier pvt ltd",
      costPrice: 45.45,
      paid: 25.45,
      due: 20.0,
      qty: 50,
    },
    {
      _id: "4",
      purchaseId: "P-0004",
      supplierName: "Gold supplier pvt ltd",
      costPrice: 45.45,
      paid: 25.45,
      due: 20.0,
      qty: 50,
    },
    {
      _id: "5",
      purchaseId: "P-0005",
      supplierName: "Gold supplier pvt ltd",
      costPrice: 45.45,
      paid: 25.45,
      due: 20.0,
      qty: 50,
    },
    {
      _id: "6",
      purchaseId: "P-0006",
      supplierName: "Gold supplier pvt ltd",
      costPrice: 45.45,
      paid: 25.45,
      due: 20.0,
      qty: 50,
    },
    {
      _id: "7",
      purchaseId: "P-0007",
      supplierName: "Gold supplier pvt ltd",
      costPrice: 45.45,
      paid: 25.45,
      due: 20.0,
      qty: 50,
    },
    {
      _id: "8",
      purchaseId: "P-0008",
      supplierName: "Gold supplier pvt ltd",
      costPrice: 45.45,
      paid: 25.45,
      due: 20.0,
      qty: 50,
    },
    {
      _id: "9",
      purchaseId: "P-0009",
      supplierName: "Gold supplier pvt ltd",
      costPrice: 45.45,
      paid: 25.45,
      due: 20.0,
      qty: 50,
    },
  ]);
  const [purchaseReturn] = useState<PurchaseItem[]>([
    {
      _id: "1",
      returnId: "P-0001",
      supplierName: "Gold supplier pvt ltd",
      itemName: "gold",
      qty: "1 tola",
      pricePerQty: 175000,
      refundAmt: 175000,
      reason: "Reason for return",
    },
    {
      _id: "2",
      returnId: "P-0002",
      supplierName: "Gold supplier pvt ltd",
      itemName: "gold",
      qty: "1 tola",
      pricePerQty: 175000,
      refundAmt: 175000,
      reason: "Reason for return",
    },
    {
      _id: "3",
      returnId: "P-0003",
      supplierName: "Gold supplier pvt ltd",
      itemName: "gold",
      qty: "1 tola",
      pricePerQty: 175000,
      refundAmt: 175000,
      reason: "Reason for return",
    },
    {
      _id: "4",
      returnId: "P-0004",
      supplierName: "Gold supplier pvt ltd",
      itemName: "gold",
      qty: "1 tola",
      pricePerQty: 175000,
      refundAmt: 175000,
      reason: "Reason for return",
    },
    {
      _id: "5",
      returnId: "P-0005",
      supplierName: "Gold supplier pvt ltd",
      itemName: "gold",
      qty: "1 tola",
      pricePerQty: 175000,
      refundAmt: 175000,
      reason: "Reason for return",
    },
  ]);
  const [suppliers] = useState<PurchaseItem[]>([
    {
      _id: "1",
      supplierName: "Gold supplier pvt ltd",
      contactPerson: "Tara Nair",
      itemCategory: "Gemstones",
      contact: "+977-9900887766",
      leadTime: " 2- 3 days",
      reason: "Reason for return",
    },
    {
      _id: "2",
      supplierName: "Gold supplier pvt ltd",
      contactPerson: "Tara Nair",
      itemCategory: "Gemstones",
      contact: "+977-9900887766",
      leadTime: " 2- 3 days",
      reason: "Reason for return",
    },
    {
      _id: "3",
      supplierName: "Gold supplier pvt ltd",
      contactPerson: "Tara Nair",
      itemCategory: "Gemstones",
      contact: "+977-9900887766",
      leadTime: " 2- 3 days",
      reason: "Reason for return",
    },
    {
      _id: "4",
      supplierName: "Gold supplier pvt ltd",
      contactPerson: "Tara Nair",
      itemCategory: "Gemstones",
      contact: "+977-9900887766",
      leadTime: " 2- 3 days",
      reason: "Reason for return",
    },
    {
      _id: "5",
      supplierName: "Gold supplier pvt ltd",
      contactPerson: "Tara Nair",
      itemCategory: "Gemstones",
      contact: "+977-9900887766",
      leadTime: " 2- 3 days",
      reason: "Reason for return",
    },
    {
      _id: "6",
      supplierName: "Gold supplier pvt ltd",
      contactPerson: "Tara Nair",
      itemCategory: "Gemstones",
      contact: "+977-9900887766",
      leadTime: " 2- 3 days",
      reason: "Reason for return",
    },
    {
      _id: "7",
      supplierName: "Gold supplier pvt ltd",
      contactPerson: "Tara Nair",
      itemCategory: "Gemstones",
      contact: "+977-9900887766",
      leadTime: " 2- 3 days",
      reason: "Reason for return",
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

  const columns1: ColumnConfig<PurchaseItem>[] = [
    {
      header: "Purchase ID",
      key: "purchaseId",
    },
    {
      header: "Supplier Name",
      key: "supplierName",
    },
    {
      header: "Cost Price",
      key: "costPrice",
      render: (_, row) =>
        row.costPrice ? `$${row.costPrice.toFixed(2)}` : "-",
    },
    {
      header: "Paid",
      key: "paid",
      render: (_, row) => (row.paid ? `$${row.paid.toFixed(2)}` : "-"),
    },
    {
      header: "Due",
      key: "due",
      render: (_, row) => (row.due ? `$${row.due.toFixed(2)}` : "-"),
    },
    {
      header: "QTY",
      key: "qty",
    },
  ];

  const columns2: ColumnConfig<PurchaseItem>[] = [
    {
      header: "RID",
      key: "returnId",
    },
    {
      header: "Supplier Name",
      key: "supplierName",
    },
    {
      header: "Item name",
      key: "itemName",
    },
    {
      header: "Qty",
      key: "qty",
    },
    {
      header: "Price per Qty",
      key: "pricePerQty",
      render: (_, row) =>
        row.pricePerQty ? `$${row.pricePerQty.toFixed(2)}` : "-",
    },
    {
      header: "Refund Amt",
      key: "refundAmt",
      render: (_, row) =>
        row.refundAmt ? `$${row.refundAmt.toFixed(2)}` : "-",
    },
    {
      header: "Reason",
      key: "reason",
    },
  ];

  const columns3: ColumnConfig<PurchaseItem>[] = [
    {
      header: "Supplier Name",
      key: "supplierName",
    },
    {
      header: "Contact Person",
      key: "contactPerson",
    },
    {
      header: "Item Category",
      key: "itemCategory",
    },
    {
      header: "Contact No",
      key: "contact",
    },
    {
      header: "Lead Time",
      key: "leadTime",
    },
  ];

  const [columns, setColumns] =
    useState<ColumnConfig<PurchaseItem>[]>(columns1);
  const [activeTab, setActiveTab] = useState("purchaseItems");

  const filterItems = (items: PurchaseItem[]) => {
    let filtered = items.filter((item) =>
      Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    // Apply filter if selected
    if (selectedFilter) {
      // Add your filter logic here
    }

    // Apply sort if selected
    if (selectedSort) {
      // Add your sort logic here
    }

    return filtered;
  };

  const getCurrentItems = (items: PurchaseItem[]) => {
    const filteredItems = filterItems(items);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return {
      items: filteredItems.slice(indexOfFirstItem, indexOfLastItem),
      totalCount: filteredItems.length,
    };
  };

  const renderInventoryTable = (items: PurchaseItem[]) => {
    const { items: currentItems, totalCount } = getCurrentItems(items);

    return (
      <Table
        columns={columns}
        data={currentItems}
        showEdit={false}
        showDelete={false}
        showView={true}
        showAction={false}
        showSelectAll={true}
        showPagination={true}
        paginationDetails={{
          currentPage,
          limit: itemsPerPage,
          totalCount,
        }}
        onItemsPerPageChange={setItemsPerPage}
        onPageChange={setCurrentPage}
        showBg={true}
      />
    );
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
    switch (value) {
      case "purchaseItems":
        setColumns(columns1);
        break;
      case "purchaseReturn":
        setColumns(columns2);
        break;
      case "suppliers":
        setColumns(columns3);
        break;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Store Report</h1>
      <div className="bg-white rounded-lg shadow">
        <Tabs
          defaultValue="purchaseItems"
          className="w-full"
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <div className="flex items-center justify-between border-b">
            <TabsList className="bg-transparent p-0 h-auto">
              <TabsTrigger
                value="purchaseItems"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                Purchase
              </TabsTrigger>
              <TabsTrigger
                value="purchaseReturn"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                Purchase Return
              </TabsTrigger>
              <TabsTrigger
                value="suppliers"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                Suppliers
              </TabsTrigger>
            </TabsList>

            <div className="p-4">
              <SearchFilterSort
                onSearch={setSearchQuery}
                onFilter={setSelectedFilter}
                onSort={setSelectedSort}
                filterOptions={filterOptions}
                sortOptions={sortOptions}
                placeholder="Search here..."
              />
            </div>
          </div>

          <TabsContent value="purchaseItems" className="px-4 pb-4">
            {renderInventoryTable(purchaseItems)}
          </TabsContent>
          <TabsContent value="purchaseReturn" className="px-4 pb-4">
            {renderInventoryTable(purchaseReturn)}
          </TabsContent>
          <TabsContent value="suppliers" className="px-4 pb-4">
            {renderInventoryTable(suppliers)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StoreReport;
