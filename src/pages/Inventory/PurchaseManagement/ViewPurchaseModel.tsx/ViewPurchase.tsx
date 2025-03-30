import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Table, type TableData, type ColumnConfig } from "../../../components/shared/Table";
import { SearchFilterSort } from "../../../components/global/SearchFilterSort";
import { FrontendRoutes } from "../../../routes/routes";
import AddPurchaseModal from "./AddPurchaseModal/AddPurchaseModal";

interface PurchaseItem {
  _id: string;
  purchaseId: string;
  supplierName: string;
  costPrice: number;
  paid: number;
  due: number;
  qty: number;
  date?: string;
}

interface ProductItem {
  id: string;
  itemName: string;
  units: string;
  ratePerUnit: number;
  paidPrice: number;
  quantity: number;
}

const PurchaseManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sample data
  const [purchases, setPurchases] = useState<PurchaseItem[]>([
    {
      _id: "1",
      purchaseId: "P-0001",
      supplierName: "Gold Supplier Pvt Ltd",
      costPrice: 175000,
      paid: 175000,
      due: 0,
      qty: 10,
      date: "2023-05-15"
    },
    // Add more sample purchases as needed
  ]);

  const filterOptions = useMemo(() => [
    { value: "", label: "All Purchases" },
    { value: "paid", label: "Fully Paid" },
    { value: "due", label: "Has Due" },
  ], []);

  const sortOptions = useMemo(() => [
    { value: "", label: "Default" },
    { value: "date-desc", label: "Newest First" },
    { value: "date-asc", label: "Oldest First" },
    { value: "amount-high", label: "Amount (High)" },
    { value: "amount-low", label: "Amount (Low)" },
  ], []);

  const filteredItems = useMemo(() => {
    return purchases.filter(item =>
      item.purchaseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [purchases, searchQuery]);

  const handleSavePurchase = (
    billNo: string,
    supplierName: string,
    products: ProductItem[],
    description: string
  ) => {
    const totalQty = products.reduce((sum, p) => sum + p.quantity, 0);
    const totalPaid = products.reduce((sum, p) => sum + p.paidPrice, 0);

    const newPurchase: PurchaseItem = {
      _id: Date.now().toString(),
      purchaseId: billNo || `P-${Math.floor(1000 + Math.random() * 9000)}`,
      supplierName,
      costPrice: totalPaid / totalQty,
      paid: totalPaid,
      due: 0,
      qty: totalQty,
      date: new Date().toISOString().split('T')[0]
    };

    setPurchases([newPurchase, ...purchases]);
    setIsAddModalOpen(false);
  };

  const columns: ColumnConfig<PurchaseItem>[] = useMemo(() => [
    { header: "Purchase ID", key: "purchaseId" },
    { header: "Supplier Name", key: "supplierName" },
    {
      header: "Cost Price",
      key: "costPrice",
      render: (_, row) => `Rs. ${row.costPrice.toFixed(2)}`,
    },
    {
      header: "Paid",
      key: "paid",
      render: (_, row) => `Rs. ${row.paid.toFixed(2)}`,
    },
    {
      header: "Due",
      key: "due",
      render: (_, row) => `Rs. ${row.due.toFixed(2)}`,
    },
    { header: "QTY", key: "qty" },
    { header: "Date", key: "date" }
  ], []);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Purchase Management</h1>
        <button
          className="bg-[#DF8D28] hover:bg-[#DF8D28]/90 text-white px-4 py-2 rounded-lg"
          onClick={() => setIsAddModalOpen(true)}
        >
          + New Purchase
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex">
            <button
              type="button"
              onClick={() => navigate(FrontendRoutes.PURCHASE)}
              className={`px-4 py-3 font-medium text-sm ${
                location.pathname === FrontendRoutes.PURCHASE
                  ? 'text-[#DF8D28] border-b-2 border-[#DF8D28]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Purchase
            </button>
            <button
              type="button"
              onClick={() => navigate(FrontendRoutes.PURCHASERETURN)}
              className={`px-4 py-3 font-medium text-sm ${
                location.pathname === FrontendRoutes.PURCHASERETURN
                  ? 'text-[#DF8D28] border-b-2 border-[#DF8D28]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Purchase Return
            </button>
            <button
              type="button"
              onClick={() => navigate(FrontendRoutes.SUPPLIERS)}
              className={`px-4 py-3 font-medium text-sm ${
                location.pathname === FrontendRoutes.SUPPLIERS
                  ? 'text-[#DF8D28] border-b-2 border-[#DF8D28]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Suppliers
            </button>
          </div>

          <div className="flex-1 max-w-lg">
            <SearchFilterSort
              onSearch={setSearchQuery}
              onFilter={setSelectedFilter}
              onSort={setSelectedSort}
              filterOptions={filterOptions}
              sortOptions={sortOptions}
              placeholder="Search purchases..."
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredItems}
          showEdit={true}
          showDelete={true}
          showView={true}
          showAction={true}
          showSelectAll={true}
          showPagination={true}
          paginationDetails={{
            currentPage,
            limit: itemsPerPage,
            totalCount: filteredItems.length,
          }}
          onItemsPerPageChange={setItemsPerPage}
          onPageChange={setCurrentPage}
          showBg={true}
        />
      </div>

      <AddPurchaseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSavePurchase}
        suppliers={[
          { id: "1", name: "Gold supplier pvt ltd" },
          { id: "2", name: "Silver imports" }
        ]}
        items={[
          { id: "1", name: "Gold" },
          { id: "2", name: "Silver" }
        ]}
      />
    </div>
  );
};

export default PurchaseManagement;