import React, { useState } from "react";
import { Icon } from "@iconify/react";

interface PickupOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pickupDetails: {
    pickedUpBy?: string;
    location?: string;
    notes?: string;
  }) => void;
  orderNumber?: string;
  isLoading?: boolean;
}

export const PickupOrderModal: React.FC<PickupOrderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderNumber,
  isLoading = false,
}) => {
  const [pickedUpBy, setPickedUpBy] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      pickedUpBy: pickedUpBy.trim() || undefined,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    // Reset form
    setPickedUpBy("");
    setLocation("");
    setNotes("");
  };

  const handleClose = () => {
    setPickedUpBy("");
    setLocation("");
    setNotes("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Confirm Order Pickup
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors">
            <Icon icon="mdi:close" className="w-6 h-6" />
          </button>
        </div>

        {orderNumber && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Order:</span> {orderNumber}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="pickedUpBy"
              className="block text-sm font-medium text-gray-700 mb-1">
              Picked up by (Optional)
            </label>
            <input
              type="text"
              id="pickedUpBy"
              value={pickedUpBy}
              onChange={(e) => setPickedUpBy(e.target.value)}
              placeholder="Customer name or representative"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1">
              Pickup location (Optional)
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Store, warehouse, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1">
              Pickup notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about the pickup..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <Icon icon="mdi:truck" className="w-4 h-4" />
                  Confirm Pickup
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PickupOrderModal;
