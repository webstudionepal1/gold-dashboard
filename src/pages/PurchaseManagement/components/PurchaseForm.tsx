import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../components/shared/tab";
import RawMaterialForm from "./RawMaterialForm";
import NewProductForm from "./NewProductForm";

interface PurchaseProps {
  onClose: () => void;
}

const PurchaseForm = ({ onClose }: PurchaseProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center justify-center">
        Purchase Form
      </h2>

      <Tabs defaultValue="raw-material" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger
            value="raw-material"
            className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
          >
            Raw Material
          </TabsTrigger>
          <TabsTrigger
            value="new-product"
            className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
          >
            New Product
          </TabsTrigger>
        </TabsList>

        <TabsContent value="raw-material">
          <RawMaterialForm onClose={onClose} />
        </TabsContent>

        <TabsContent value="new-product">
          <NewProductForm onClose={onClose} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PurchaseForm;
