// import React from "react";
// import {
//   Tabs,
//   TabsList,
//   TabsTrigger,
//   TabsContent,
// } from "../../../../components/shared/tab.tsx";

// import { CategoryDiscountForm } from "./CategoryDiscountForm.tsx";
// import { IndividualDiscountForm } from "./IndividualDiscountForm.tsx";

// interface DiscountFormProps {
//   closeModal: () => void;
// }

// export const DiscountForm = ({ closeModal }: DiscountFormProps) => {
//   return (
//     <div className="p-10 flex flex-col gap-6">
//       <p className="text-lg font-bold text-black text-center">Add Discount</p>

//       <Tabs defaultValue="category" className="w-full">
//         <TabsList className="w-full justify-center gap-4">
//           <TabsTrigger
//             value="category"
//             className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
//           >
//             Category
//           </TabsTrigger>
//           <TabsTrigger
//             value="individual"
//             className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
//           >
//             Individual
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="category">
//           <CategoryDiscountForm closeModal={closeModal} />
//         </TabsContent>

//         <TabsContent value="individual">
//           <IndividualDiscountForm closeModal={closeModal} />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../../components/shared/tab.tsx";

import { CategoryDiscountForm } from "./CategoryDiscountForm.tsx";
import { IndividualDiscountForm } from "./IndividualDiscountForm.tsx";

interface DiscountFormProps {
  closeModal: () => void;
  mode?: "create" | "edit";
  initialValues?: {
    type: "category" | "individual";
    data: any[];
  };
}

export const DiscountForm = ({
  closeModal,
  initialValues,
  mode = "create",
}: DiscountFormProps) => {
  return (
    <div className="p-10 flex flex-col gap-6">
      <p className="text-lg font-bold text-black text-center">
        {mode === "edit" ? "Edit Discount" : "Add Discount"}
      </p>

      <Tabs defaultValue={initialValues?.type ?? "category"} className="w-full">
        <TabsList className="w-full justify-center gap-4">
          <TabsTrigger
            value="category"
            className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
          >
            Category
          </TabsTrigger>
          <TabsTrigger
            value="individual"
            className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
          >
            Individual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="category">
          <CategoryDiscountForm
            closeModal={closeModal}
            initialValues={
              initialValues?.type === "category"
                ? initialValues.data
                : undefined
            }
            mode={mode}
          />
        </TabsContent>

        <TabsContent value="individual">
          <IndividualDiscountForm
            closeModal={closeModal}
            initialValues={
              initialValues?.type === "individual"
                ? initialValues.data
                : undefined
            }
            mode={mode}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
