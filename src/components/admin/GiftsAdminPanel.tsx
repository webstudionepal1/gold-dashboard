import React, { useState, useMemo } from "react";
import { Gift, Package, Plus, Edit, Trash2, Eye, Search, Filter, ToggleLeft, ToggleRight } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import {
  useGetAllGiftsQuery,
  useDeleteGiftMutation,
  useToggleGiftStatusMutation,
  IFetchGift,
  IParams,
} from "../../server/api/giftHooks";
import { useGetAllProductsForGiftsQuery } from "../../server/api/productHooks";
import { ScrollableModal } from "../shared/ScrollableModal";
import GiftForm from "./components/GiftForm";
import GiftDetailsModal from "./components/GiftDetailsModal";
import MasterTable from "../shared/MasterTable";
import { giftColumns, GiftTableRow } from "./giftObj";

const GiftsAdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"gifts" | "packages">("gifts");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "gift" | "package">("all");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("all");
  const [selectedSetType, setSelectedSetType] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<IFetchGift | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Build query parameters
  const queryParams: IParams = useMemo(() => {
    const params: IParams = {
      page: currentPage,
      limit: itemsPerPage,
    };

    if (searchTerm) params.search = searchTerm;
    if (selectedType !== "all") params.type = selectedType as "gift" | "package";
    if (selectedOccasion !== "all") params.occasion = selectedOccasion;
    if (selectedSetType !== "all") {
      params.setType = selectedSetType as "necklace_set" | "bridal_set" | "earring_set" | "bracelet_set" | "ring_set" | "custom";
    }

    return params;
  }, [currentPage, itemsPerPage, searchTerm, selectedType, selectedOccasion, selectedSetType]);

  const { data: giftsData, isLoading, error } = useGetAllGiftsQuery(queryParams);
  const { data: productsData } = useGetAllProductsForGiftsQuery();
  const deleteGiftMutation = useDeleteGiftMutation();
  const toggleStatusMutation = useToggleGiftStatusMutation();

  const gifts = Array.isArray(giftsData?.data) ? giftsData.data : giftsData?.data?.gifts || [];
  const pagination = Array.isArray(giftsData?.data) ? undefined : giftsData?.data?.pagination;

  const handleCreateGift = () => {
    setSelectedGift(null);
    setIsCreateModalOpen(true);
  };

  const handleEditGift = (gift: IFetchGift) => {
    setSelectedGift(gift);
    setIsEditModalOpen(true);
  };

  const handleViewGift = (gift: IFetchGift) => {
    setSelectedGift(gift);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteGift = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this gift?")) {
      try {
        await deleteGiftMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting gift:", error);
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleStatusMutation.mutateAsync({ id, isActive: !currentStatus });
    } catch (error) {
      console.error("Error toggling gift status:", error);
    }
  };

  const renderFilters = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search gifts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as "all" | "gift" | "package")}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="gift">Gifts</option>
          <option value="package">Packages</option>
        </select>

        {/* Occasion Filter */}
        <select
          value={selectedOccasion}
          onChange={(e) => setSelectedOccasion(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Occasions</option>
          <option value="Wedding">Wedding</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Birthday">Birthday</option>
                <option value="Festival">Festival</option>
                <option value="Engagement">Engagement</option>
        </select>

        {/* Set Type Filter */}
        <select
          value={selectedSetType}
          onChange={(e) => setSelectedSetType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Set Types</option>
          <option value="necklace_set">Necklace Set</option>
          <option value="bridal_set">Bridal Set</option>
          <option value="earring_set">Earring Set</option>
          <option value="bracelet_set">Bracelet Set</option>
          <option value="ring_set">Ring Set</option>
          <option value="custom">Custom</option>
        </select>
      </div>
    </div>
  );

  const formatGiftTableData = (): GiftTableRow[] => {
    return gifts.map((gift, index) => ({
      id: gift._id,
      sn: index + 1,
      typeCategory: (
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            {gift.type === "gift" ? (
              <Gift className="w-4 h-4 text-purple-500" />
            ) : (
              <Package className="w-4 h-4 text-blue-500" />
            )}
            <span className="text-sm font-medium capitalize text-gray-900">{gift.type}</span>
          </div>
          {gift.setType && (
            <span className="text-xs text-gray-500 capitalize">
              {gift.setType.replace('_', ' ')}
            </span>
          )}
          {gift.category && (
            <span className="text-xs text-blue-600 font-medium">{gift.category}</span>
          )}
        </div>
      ),
      name: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{gift.name}</span>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-gray-500 capitalize">{gift.type}</span>
            {gift.occasion && (
              <span className="text-xs text-gray-500 capitalize">• {gift.occasion}</span>
            )}
            {gift.products && gift.products.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                {gift.products.length} items
              </span>
            )}
          </div>
        </div>
      ),
      pricing: (
        <div className="text-right">
          <div className="font-semibold text-gray-900">
            ₹{(gift.finalPrice || gift.totalPrice || 0).toLocaleString()}
          </div>
          {gift.discountPercentage && gift.discountPercentage > 0 && (
            <div className="text-sm text-green-600">
              {gift.discountPercentage}% off
            </div>
          )}
        </div>
      ),
      status: (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleToggleStatus(gift._id, gift.isActive)}
            className={`p-1 rounded transition-colors ${
              gift.isActive
                ? "text-green-600 hover:bg-green-50"
                : "text-gray-400 hover:bg-gray-50"
            }`}
          >
            {gift.isActive ? (
              <ToggleRight className="w-5 h-5" />
            ) : (
              <ToggleLeft className="w-5 h-5" />
            )}
          </button>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              gift.isActive
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {gift.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      ),
      _originalData: gift,
    }));
  };

  const handleTableAction = (action: string, data: GiftTableRow | IFetchGift) => {
    const gift = '_originalData' in data ? data._originalData : data;
    switch (action) {
      case "view":
        handleViewGift(gift);
        break;
      case "edit":
        handleEditGift(gift);
        break;
      case "delete":
        handleDeleteGift(gift._id);
        break;
    }
  };

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{" "}
          {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
          {pagination.totalItems} results
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 bg-blue-500 text-white rounded-md">
            {currentPage}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
            disabled={currentPage === pagination.totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">Error loading gifts. Please try again later.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gifts & Packages Management</h1>
            <p className="text-gray-600">Manage gift sets and jewelry packages</p>
          </div>
          <button
            onClick={handleCreateGift}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Gift</span>
          </button>
        </div>
      </div>

      {renderFilters()}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <MasterTable
            columns={giftColumns}
            rows={formatGiftTableData()}
            showAction={true}
            viewAction={(row) => handleTableAction("view", row)}
            editAction={(row) => handleTableAction("edit", row)}
            onDelete={(id) => {
               const gift = gifts.find(g => g._id === id);
               if (gift) handleTableAction("delete", gift);
             }}
            canSearch={false}
            apiPagination={true}
            totalItems={pagination?.totalItems || gifts.length}
            onPageChange={(page) => setCurrentPage(page)}
          />
          {gifts.length === 0 && (
            <div className="text-center py-12">
              <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No gifts found</h3>
              <p className="text-gray-600">Try adjusting your filters or create a new gift.</p>
            </div>
          )}
        </>
      )}

      {/* Create Gift Modal */}
      <ScrollableModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Gift"
        size="lg"
      >
        <GiftForm
          onSuccess={() => {
            setIsCreateModalOpen(false);
            toast.success("Gift created successfully!");
          }}
          onCancel={() => setIsCreateModalOpen(false)}
          products={productsData || []}
        />
      </ScrollableModal>

      {/* Edit Gift Modal */}
      <ScrollableModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Gift"
        size="lg"
      >
        {selectedGift && (
          <GiftForm
            gift={selectedGift}
            onSuccess={() => {
              setIsEditModalOpen(false);
              toast.success("Gift updated successfully!");
            }}
            onCancel={() => setIsEditModalOpen(false)}
            products={productsData || []}
          />
        )}
      </ScrollableModal>

      {/* Gift Details Modal */}
      <ScrollableModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Gift Details"
        size="lg"
      >
        {selectedGift && (
          <GiftDetailsModal
            gift={selectedGift}
            onEdit={() => {
              setIsDetailsModalOpen(false);
              handleEditGift(selectedGift);
            }}
            onClose={() => setIsDetailsModalOpen(false)}
          />
        )}
      </ScrollableModal>
    </div>
  );
};

export default GiftsAdminPanel;