import React, { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from "react-toastify";
import {
  useGetAllGiftsQuery,
  useDeleteGiftMutation,
  IFetchGift,
  IParams,
} from "../../server/api/giftHooks";
import { useGetAllProductsForGiftsQuery } from "../../server/api/productHooks";
import { ScrollableModal } from "../shared/ScrollableModal";
import GiftForm, { occassion } from "./components/GiftForm";
import GiftDetailsModal from "./components/GiftDetailsModal";
import MasterTable from "../shared/MasterTable";
import Header from "../shared/table_heading/Header";

import { giftColumns, GiftTableRow } from "./giftObj";

const GiftsAdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"gifts" | "packages">("gifts");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "gift" | "package">(
    "all"
  );
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
    if (selectedType !== "all")
      params.type = selectedType as "gift" | "package";
    if (selectedOccasion !== "all") params.occasion = selectedOccasion;
    if (selectedSetType !== "all") {
      params.setType = selectedSetType as
        | "necklace_set"
        | "bridal_set"
        | "earring_set"
        | "bracelet_set"
        | "ring_set"
        | "custom";
    }

    return params;
  }, [
    currentPage,
    itemsPerPage,
    searchTerm,
    selectedType,
    selectedOccasion,
    selectedSetType,
  ]);

  const {
    data: giftsData,
    isLoading,
    error,
  } = useGetAllGiftsQuery(queryParams);
  const { data: productsData } = useGetAllProductsForGiftsQuery();
  const deleteGiftMutation = useDeleteGiftMutation();

  const gifts = Array.isArray(giftsData?.data)
    ? giftsData.data
    : giftsData?.data?.gifts || [];
  const pagination = Array.isArray(giftsData?.data)
    ? undefined
    : giftsData?.data?.pagination;

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

  const formatGiftTableData = (): GiftTableRow[] => {
    return gifts.map((gift, index) => ({
      id: gift._id,
      sn: index + 1,
      type: <div className="capitalize font-medium">{gift.type}</div>,
      category: gift.setType
        ? gift.setType.replace("_", " ")
        : gift.category || "-",
      name: gift.name,
      occasion: gift.occasion || "-",
      itemsNo: (
        <div className="text-center">
          {gift.products && gift.products.length > 0 ? (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
              {gift.products.length} items
            </span>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
      pricing: (
        <div>
          <div className="font-medium">
            NRS {(gift.finalPrice || gift.totalPrice || 0).toLocaleString()}
          </div>
          {gift.discountPercentage && gift.discountPercentage > 0 && (
            <div className="text-sm text-green-600">
              {gift.discountPercentage}% off
            </div>
          )}
        </div>
      ),
      _originalData: gift,
    }));
  };

  const handleTableAction = (
    action: string,
    data: GiftTableRow | IFetchGift
  ) => {
    const gift = "_originalData" in data ? data._originalData : data;
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

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">
            Error loading gifts. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <Header text="Gifts & Packages Management">
        <button
          onClick={handleCreateGift}
          className="bg-[#DF8D28] hover:bg-[#DF8D28]/90 text-sm text-white px-4 py-2 flex rounded-lg transition-colors duration-200"
        >
          <Icon icon="ic:outline-add" fontSize={18} />
          Create Gift
        </button>
      </Header>

      <div className="p-3 bg-white border-2 rounded-lg">
        <MasterTable
          columns={giftColumns}
          rows={formatGiftTableData()}
          showAction={true}
          viewAction={(row) => handleTableAction("view", row)}
          editAction={(row) => handleTableAction("edit", row)}
          onDelete={(id) => {
            const gift = gifts.find((g) => g._id === id);
            if (gift) handleTableAction("delete", gift);
          }}
          canSearch={false}
          apiPagination={true}
          totalItems={pagination?.totalItems || gifts.length}
          onPageChange={(page) => setCurrentPage(page)}
          loading={isLoading}
          filterSection={
            <div className="flex flex-col md:flex-row gap-4 items-end">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search gifts by name, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Filter Row */}
              <div className="flex gap-3">
                {/* Type Filter */}
                <div className="relative">
                  <label
                    htmlFor="type-filter"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Type
                  </label>
                  <select
                    id="type-filter"
                    value={selectedType}
                    onChange={(e) =>
                      setSelectedType(
                        e.target.value as "all" | "gift" | "package"
                      )
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-[120px]"
                  >
                    <option value="all">All Types</option>
                    <option value="gift">Gifts</option>
                    <option value="package">Packages</option>
                  </select>
                </div>

                {/* Occasion Filter */}
                <div className="relative">
                  <label
                    htmlFor="occasion-filter"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Occasion
                  </label>
                  <select
                    id="occasion-filter"
                    value={selectedOccasion}
                    onChange={(e) => setSelectedOccasion(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-[120px]"
                  >
                    <option value="all">All Occasions</option>
                    {occassion.map((occasion) => (
                      <option key={occasion} value={occasion}>
                        {occasion}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Set Type Filter */}
                <div className="relative">
                  <label
                    htmlFor="settype-filter"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Set Type
                  </label>
                  <select
                    id="settype-filter"
                    value={selectedSetType}
                    onChange={(e) => setSelectedSetType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-[140px]"
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
            </div>
          }
        />

        {gifts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Icon
              icon="mdi:gift-outline"
              className="w-12 h-12 text-gray-400 mx-auto mb-4"
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No gifts found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or create a new gift.
            </p>
          </div>
        )}
      </div>

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
