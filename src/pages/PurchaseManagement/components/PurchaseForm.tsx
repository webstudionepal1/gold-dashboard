import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../components/shared/tab";
import RawMaterialForm from "./RawMaterialForm";
import NewProductForm from "./NewProductForm";
import { IFetchPurchase } from "../../../server/api/purchaseHooks";

interface PurchaseProps {
  onClose: () => void;
  defaultValue?: string;
  data?: IFetchPurchase | null;
  edit?: boolean;
}

const PurchaseForm = ({ onClose, data, edit = false }: PurchaseProps) => {
  const defaultValue = data
    ? data.items.length > 0
      ? "raw-material"
      : "new-product"
    : "raw-material";
  const tabOptions = [
    {
      label: "Raw Material",
      value: "raw-material",
      content: <RawMaterialForm edit={edit} data={data} onClose={onClose} />,
    },
    {
      label: "New Product",
      value: "new-product",
      content: <NewProductForm data={data} edit={edit} onClose={onClose} />,
    },
    // {
    //   label: "Own Product",
    //   value: "own-product",
    //   content: <NewProductForm onClose={onClose} />,
    // },
  ];
  return (
    <div className="w-full max-w-2xl p-4 mx-auto bg-white rounded-md shadow-md">
      <h2 className="flex items-center justify-center mb-4 text-xl font-semibold">
        Purchase Form
      </h2>

      <Tabs defaultValue={defaultValue} className="w-full">
        <TabsList className="mb-4">
          {tabOptions.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabOptions.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PurchaseForm;
