import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { IFetchCategory } from "../../../../server/api/productHooks";
import { get } from "lodash";

interface ViewProductCategoryProps {
  isOpen: boolean;
  closeModal: () => void;
  viewData: IFetchCategory | null;
  //   modalRef: React.RefObject<HTMLDivElement>;
  modalRef: React.RefObject<HTMLDivElement | null>;
}

const ViewProductSubCategory: React.FC<ViewProductCategoryProps> = ({
  isOpen,
  closeModal,
  viewData,
  modalRef,
}) => {
  if (!isOpen || !viewData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 overflow-y-scroll">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 transform transition-all duration-300 scale-100"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Sub Category Details
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Icon icon="ic:outline-close" fontSize={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-600">
              Category Name
            </h3>
            <p className="text-lg text-gray-800">
              {get(viewData, "name", "N/A")}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-600">Description</h3>
            <p className="text-gray-700">
              {get(viewData, "rawDescription", "No description available")}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-600">
              Total Products
            </h3>
            <p className="text-lg text-gray-800">
              {get(viewData, "totalProducts", 0)}
            </p>
          </div>

          {/* {viewData.subCategory && viewData.subCategory.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-600">Subcategories</h3>
              <p className="text-gray-700">
                {viewData.subCategory.map((sub) => get(sub, 'name', '')).join(', ')}
              </p>
            </div>
          )} */}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={closeModal}
            className="bg-[#DF8D28] hover:bg-[#DF8D28]/90 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProductSubCategory;
