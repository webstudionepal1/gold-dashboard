import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react/dist/iconify.js";
import GiftForm from "@/components/admin/components/GiftForm";
import Header from "@/components/shared/table_heading/Header";
import { FrontendRoutes } from "@/routes/routes";
import { useGetGiftByIdQuery } from "@/server/api/giftHooks";
import { useGetAllProductsForGiftsQuery } from "@/server/api/productHooks";

function LoadingSpinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DF8D28] mx-auto mb-4" />
      <p className="text-gray-600">{label}</p>
    </div>
  );
}

const GiftFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const {
    data: gift,
    isLoading: isLoadingGift,
    isError: isGiftError,
  } = useGetGiftByIdQuery(id || "");
  const { data: products = [], isLoading: isLoadingProducts } =
    useGetAllProductsForGiftsQuery();

  const handleBack = () => navigate(FrontendRoutes.GIFTS);

  const handleSuccess = () => {
    navigate(FrontendRoutes.GIFTS);
  };

  if (isEdit && isLoadingGift) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <LoadingSpinner label="Loading gift..." />
      </div>
    );
  }

  if (isEdit && (isGiftError || !gift)) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Could not load gift.</p>
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 bg-[#DF8D28] text-white rounded-lg"
          >
            Back to gifts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <Header text={isEdit ? "Edit Gift" : "Create Gift"}>
        <button
          type="button"
          onClick={handleBack}
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200"
        >
          <Icon icon="mdi:arrow-left" fontSize={18} />
          Back to gifts
        </button>
      </Header>

      <div className="p-6 bg-white border-2 rounded-lg mx-3">
        {isLoadingProducts ? (
          <div className="min-h-[30vh] flex items-center justify-center">
            <LoadingSpinner label="Loading products..." />
          </div>
        ) : (
          <GiftForm
            key={isEdit ? `edit-${id}` : "create"}
            gift={gift}
            products={products}
            onSuccess={handleSuccess}
            onCancel={handleBack}
          />
        )}
      </div>
    </div>
  );
};

export default GiftFormPage;
