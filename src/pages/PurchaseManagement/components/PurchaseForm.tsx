import React from "react";
import NewProductForm from "./NewProductForm";

interface PurchaseProps {
  onClose: () => void;
}

const PurchaseForm = ({ onClose }: PurchaseProps) => {
  return (
    <div className="w-full max-w-2xl p-4 mx-auto bg-white rounded-md shadow-md">
      <h2 className="flex items-center justify-center mb-4 text-xl font-semibold">
        Purchase Form
      </h2>

      <NewProductForm onClose={onClose} />
    </div>
  );
};

export default PurchaseForm;


