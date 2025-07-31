import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { TextareaField } from "../form_components/TextArea";

interface CompleteOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes?: string) => void;
  isLoading?: boolean;
  orderNumber?: string;
  customerName?: string;
  totalAmount?: number;
}

export const CompleteOrderModal: React.FC<CompleteOrderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  orderNumber = "",
  customerName = "",
  totalAmount = 0,
}) => {
  const [notes, setNotes] = useState("");

  const handleConfirm = () => {
    onConfirm(notes.trim() || undefined);
    setNotes("");
  };

  const handleClose = () => {
    setNotes("");
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
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Icon
                icon="mdi:check-circle"
                className="w-5 h-5 text-green-600"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Complete Order
              </h3>
              {orderNumber && (
                <p className="text-sm text-gray-500">Order #{orderNumber}</p>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <Icon icon="mdi:close" className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:information" className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Order Summary</span>
            </div>
            <div className="space-y-1 text-sm text-green-700">
              {customerName && (
                <p>
                  <span className="font-medium">Customer:</span> {customerName}
                </p>
              )}
              {totalAmount > 0 && (
                <p>
                  <span className="font-medium">Total Amount:</span> RS{" "}
                  {totalAmount.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          <p className="text-gray-600">
            Are you sure you want to mark this order as completed? This action
            will:
          </p>

          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <Icon icon="mdi:check" className="w-4 h-4 text-green-500" />
              Update the order status to "Delivered"
            </li>
            <li className="flex items-center gap-2">
              <Icon icon="mdi:check" className="w-4 h-4 text-green-500" />
              Record the delivery completion time
            </li>
            <li className="flex items-center gap-2">
              <Icon icon="mdi:check" className="w-4 h-4 text-green-500" />
              Award loyalty points to the customer
            </li>
            <li className="flex items-center gap-2">
              <Icon icon="mdi:check" className="w-4 h-4 text-green-500" />
              Update the order in the management system
            </li>
          </ul>

          {/* Optional Notes */}
          <div className="mt-4">
            <TextareaField
              label="Delivery Notes (Optional)"
              placeholder="Add any notes about the delivery or customer feedback..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 text-white bg-[#de8d29] hover:bg-[#c97d24]  rounded-xl font-medium  transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-[#de8d29] text-white rounded-xl font-medium hover:bg-[#c97d24]  transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            {isLoading && (
              <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
            )}
            {isLoading ? "Completing..." : "Complete Order"}
          </button>
        </div>
      </div>
    </div>
  );
};
