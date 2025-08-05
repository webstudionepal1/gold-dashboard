import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { get } from "lodash";
import Header from "../../../components/shared/table_heading/Header";
import SupplierCard from "../components/SupplierDetailCard";
import { FrontendRoutes } from "../../../routes/routes";
import { Table } from "../../../components/shared";
import { ColumnConfig, TableData } from "../../../components/shared/Table";
import { useGetSupplierByIdQuery } from "../../../server/api/supplierHooks";
import { useGetSupplierPurchaseHistoryQuery } from "../../../server/api/purchaseHooks";
import dayjs from "dayjs";
import { ScrollableModal } from "../../../components/shared/ScrollableModal";
import { Icon } from "@iconify/react/dist/iconify.js";

interface SupplierHistoryItem {
  _id: string;
  purchase_id: string;
  purchase_date: string;
  total_amount: string;
  paid: string;
  due: string;
  qty: number;
  originalData?: any; // Store original purchase data for modal
}

const SupplierHistory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch supplier data
  const {
    data: supplierData,
    isLoading: isSupplierLoading,
    error: supplierError,
  } = useGetSupplierByIdQuery(id || "");

  // Fetch purchase history for this supplier
  const {
    data: purchaseData,
    isLoading: isPurchaseLoading,
    error: purchaseError,
  } = useGetSupplierPurchaseHistoryQuery(id || "");

  const handleButtonClick = () => {
    navigate(FrontendRoutes.SUPPLIERDETAIL.replace(":id", id || ""));
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] =
    useState<SupplierHistoryItem | null>(null);

  const handleViewItem = (item: TableData<SupplierHistoryItem>) => {
    setSelectedPurchase(item);
    setIsViewModalOpen(true);
  };

  const handleEditItem = (_item: TableData<SupplierHistoryItem>) => {
    // Handle edit item if needed
  };

  const handleDeleteItem = (_item: TableData<SupplierHistoryItem>) => {
    // Handle delete item if needed
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
  };
  const filterItems = (items: SupplierHistoryItem[]) => {
    return items.filter(
      (item) =>
        item.purchase_date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item._id?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const columns: ColumnConfig<SupplierHistoryItem>[] = [
    { header: "Purchase ID", key: "purchase_id" },
    { header: "Purchase Date", key: "purchase_date" },
    { header: "Total Amount", key: "total_amount" },
    { header: "Paid", key: "paid" },
    { header: "Due", key: "due" },
    { header: "QTY", key: "qty" },
  ];

  // Transform purchase data to match the table format
  const supplierHistoryItems: SupplierHistoryItem[] =
    purchaseData?.map((purchase) => {
      // Calculate total amount from products and items
      const totalAmountFromProducts =
        purchase.products?.reduce(
          (sum, product) =>
            sum + (product.price * (product.quantity || 1) || 0),
          0
        ) || 0;

      const totalAmountFromItems =
        purchase.items?.reduce(
          (sum, item) => sum + (item.price * (item.quantity || 1) || 0),
          0
        ) || 0;

      const calculatedTotalAmount =
        totalAmountFromProducts + totalAmountFromItems;

      // Calculate paid amount from products and items
      const paidAmountFromProducts =
        purchase.products?.reduce(
          (sum, product) => sum + (product.paidAmount || 0),
          0
        ) || 0;

      const paidAmountFromItems =
        purchase.items?.reduce(
          (sum, item) => sum + (item.paidAmount || 0),
          0
        ) || 0;

      const calculatedPaidAmount = paidAmountFromProducts + paidAmountFromItems;

      // Calculate due amount
      const calculatedDueAmount = calculatedTotalAmount - calculatedPaidAmount;

      return {
        _id: purchase._id,
        purchase_id:
          purchase.billNo || `PUR-${purchase._id.slice(-6).toUpperCase()}`,
        purchase_date: dayjs(purchase.createdAt).format("YYYY-MM-DD"),
        total_amount: `Rs.${calculatedTotalAmount.toLocaleString()}`,
        paid: `Rs.${calculatedPaidAmount.toLocaleString()}`,
        due: `Rs.${calculatedDueAmount.toLocaleString()}`,
        qty:
          (purchase.items?.reduce(
            (sum, item) => sum + (item.quantity || 0),
            0
          ) || 0) +
          (purchase.products?.reduce(
            (sum, product) => sum + (product.quantity || 0),
            0
          ) || 0),
        // Store original purchase data for modal
        originalData: purchase,
      };
    }) || [];

  // Extract unique products from purchase history
  const itemsSupplied = useMemo(() => {
    if (!purchaseData) return [];

    const uniqueItems = new Set<string>();
    const uniqueProducts = new Set<string>();

    purchaseData.forEach((purchase: any) => {
      // Add items (raw materials) - these are populated objects
      purchase.items?.forEach((item: any) => {
        if (item.item && typeof item.item === "object" && item.item.name) {
          uniqueItems.add(item.item.name);
        }
      });

      // Add products - these are populated objects
      purchase.products?.forEach((product: any) => {
        if (
          product.product &&
          typeof product.product === "object" &&
          product.product.name
        ) {
          uniqueProducts.add(product.product.name);
        }
      });
    });

    // Combine both items and products
    return [...Array.from(uniqueItems), ...Array.from(uniqueProducts)];
  }, [purchaseData]);

  // Debug logs
  console.log("Supplier ID:", id);
  console.log("Purchase Data:", purchaseData);
  console.log("Transformed Items:", supplierHistoryItems);
  console.log("Items Supplied:", itemsSupplied);

  const renderSupplierHistoryTable = (items: SupplierHistoryItem[]) => {
    const filteredItems = filterItems(items);

    if (isPurchaseLoading) {
      return (
        <div className="text-center py-4">
          <p>Loading purchase history...</p>
        </div>
      );
    }

    if (purchaseError) {
      return (
        <div className="text-center py-4">
          <p className="text-red-600">Error loading purchase history</p>
        </div>
      );
    }

    if (filteredItems.length === 0) {
      return (
        <div className="text-center py-4">
          <p>No purchase history available for this supplier.</p>
        </div>
      );
    }

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

  if (isSupplierLoading) {
    return (
      <div className="container mx-auto px-8 py-3">
        <div className="text-center py-4">
          <p>Loading supplier data...</p>
        </div>
      </div>
    );
  }

  if (supplierError) {
    return (
      <div className="container mx-auto px-8 py-3">
        <div className="text-center py-4">
          <p className="text-red-600">Error loading supplier data</p>
        </div>
      </div>
    );
  }

  if (!supplierData) {
    return (
      <div className="container mx-auto px-8 py-3">
        <div className="text-center py-4">
          <p>Supplier not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-8 py-3">
        <div className="mb-4">
          <Header text="Supplier History" />
        </div>

        <div className="mb-8">
          <SupplierCard
            image={
              supplierData && supplierData?.logo?.length > 0
                ? `${import.meta.env.VITE_API_IMAGE_BASE_URL}${
                    supplierData.logo[0]
                  }`
                : "https://via.placeholder.com/150"
            }
            title={get(supplierData, "name", "Supplier")}
            supplierType={get(supplierData, "businessType", "Supplier")}
            location={`${get(supplierData, "addresses.city", "-")}, ${get(
              supplierData,
              "addresses.state",
              "Unknown Location"
            )}`}
            itemsSupplied={itemsSupplied}
            buttonText="Basic Information"
            buttonClick={handleButtonClick}
          />
        </div>

        <div className="bg-white rounded-xl">
          {renderSupplierHistoryTable(supplierHistoryItems)}
        </div>
      </div>

      {/* View Purchase Modal */}
      {isViewModalOpen && (
        <ScrollableModal
          onClose={() => setIsViewModalOpen(false)}
          classname="w-[90%] max-w-4xl p-6">
          {selectedPurchase && (
            <div className="space-y-4">
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Purchase Details
                </h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600">
                  <Icon icon="mdi:close" className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Purchase ID
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPurchase.purchase_id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Purchase Date
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPurchase.purchase_date}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total Amount
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPurchase.total_amount}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Paid Amount
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPurchase.paid}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Due Amount
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPurchase.due}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPurchase.qty}
                  </p>
                </div>
              </div>

              {/* Items Details */}
              {selectedPurchase.originalData && (
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">
                    Items Purchased
                  </h4>

                  {/* Raw Materials */}
                  {selectedPurchase.originalData.items &&
                    selectedPurchase.originalData.items.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-md font-medium text-gray-700 mb-2">
                          Raw Materials
                        </h5>
                        <div className="space-y-2">
                          {selectedPurchase.originalData.items.map(
                            (item: any, index: number) => (
                              <div
                                key={index}
                                className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span>
                                  {item.name ||
                                    item.item?.name ||
                                    "Unknown Item"}
                                </span>
                                <span>Qty: {item.quantity || 0}</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Products */}
                  {selectedPurchase.originalData.products &&
                    selectedPurchase.originalData.products.length > 0 && (
                      <div>
                        <h5 className="text-md font-medium text-gray-700 mb-2">
                          Products
                        </h5>
                        <div className="space-y-2">
                          {selectedPurchase.originalData.products.map(
                            (product: any, index: number) => (
                              <div
                                key={index}
                                className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span>
                                  {product.name ||
                                    product.product?.name ||
                                    "Unknown Product"}
                                </span>
                                <span>Qty: {product.quantity || 0}</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          )}
        </ScrollableModal>
      )}
    </>
  );
};

export default SupplierHistory;
