import React from 'react';
import NewProductForm from './NewProductForm';
import { IFetchPurchase } from '../../../server/api/purchaseHooks';

interface PurchaseProps {
  onClose: () => void;
  defaultValue?: string;
  data?: IFetchPurchase | null;
  edit?: boolean;
}

const PurchaseForm = ({ onClose, data, edit = false }: PurchaseProps) => {
  return (
    <div className="w-full max-w-2xl p-4 mx-auto bg-white rounded-md shadow-md">
      <h2 className="flex items-center justify-center mb-4 text-xl font-semibold">
        Purchase Form
      </h2>
      <NewProductForm data={data} edit={edit} onClose={onClose} />
    </div>
  );
};

export default PurchaseForm;
