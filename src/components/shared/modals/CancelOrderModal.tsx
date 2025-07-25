import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { InputField } from "../form_components/InputField";
import { TextareaField } from "../form_components/TextArea";

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
  orderNumber?: string;
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  orderNumber = "",
}) => {
  const [reason, setReason] = useState("");
  const [selectedReason, setSelectedReason] = useState("");

  const predefinedReasons = [
    "Customer requested cancellation",
    "Payment issues",
    "Product out of stock",
    "Delivery address issues",
    "Customer changed mind",
    "Technical issues",
    "Other",
  ];

  const handleConfirm = () => {
    const finalReason = selectedReason === "Other" ? reason : selectedReason;
    if (finalReason.trim()) {
      onConfirm(finalReason);
      setReason("");
      setSelectedReason("");
    }
  };

  const handleClose = () => {
    setReason("");
    setSelectedReason("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Icon icon="mdi:cancel" className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Cancel Order
              </h3>
              {orderNumber && (
                <p className="text-sm text-gray-500">Order #{orderNumber}</p>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <Icon icon="mdi:close" className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600">
            Please select a reason for cancelling this order. This information
            helps us improve our service.
          </p>

          {/* Predefined Reasons */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Cancellation Reason
            </label>
            <div className="space-y-2">
              {predefinedReasons.map((reasonOption) => (
                <label
                  key={reasonOption}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="cancellationReason"
                    value={reasonOption}
                    checked={selectedReason === reasonOption}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">{reasonOption}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Reason Input */}
          {selectedReason === "Other" && (
            <div className="mt-4">
              <TextareaField
                label="Please specify the reason"
                placeholder="Enter the specific reason for cancellation..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                required
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 text-white bg-[#de8d29] rounded-xl font-medium hover:bg-[#c97d24]   transition-colors disabled:opacity-50"
          >
            Keep Order
          </button>
          <button
            onClick={handleConfirm}
            disabled={
              isLoading ||
              !selectedReason ||
              (selectedReason === "Other" && !reason.trim())
            }
            className="px-4 py-2 bg-[#de8d29]  text-white rounded-xl font-medium hover:bg-[#c97d24]   transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && (
              <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
            )}
            {isLoading ? "Cancelling..." : "Cancel Order"}
          </button>
        </div>
      </div>
    </div>
  );
};
