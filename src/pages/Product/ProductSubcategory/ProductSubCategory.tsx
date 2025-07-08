import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useMemo, useState } from "react";
import { Table } from "../../../components/shared/Table";
import { useOutsideClick } from "../../../hooks/UseOutsideClick";
import {
  IFetchSubCategory,
  useDeleteProductSubCategoryMutation,
  useGetAllProductSubCategoriesQuery,
} from "../../../server/api/productHooks";
import { AddProductSubCategory } from "./components/AddProductSubCategory";
import Header from "../../../components/shared/table_heading/Header";
import { subCategoryColumns } from "../productObj";
import MasterTable from "../../../components/shared/MasterTable";
// import { get } from "lodash";

interface IEditModal {
  state: boolean;
  editData?: IFetchSubCategory | null;
}
const Productsubcategory: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<IEditModal>({
    state: false,
    editData: null,
  });
  const modalRef = useOutsideClick(() =>
    setIsModalOpen({ state: false, editData: null })
  );

  const {
    data: subCategories,
    isSuccess,
    isLoading,
  } = useGetAllProductSubCategoriesQuery();

  console.log(subCategories, "ASDFSDFSDF");
  const { mutate: deleteSubCategory } = useDeleteProductSubCategoryMutation();
  const subCategoriesData = useMemo(
    () =>
      isSuccess
        ? subCategories?.map((item, index: number) => ({
            ...item,
            sn: index + 1,
            // category: get(item, "category._id", "-"),
          }))
        : [],
    [isSuccess, subCategories]
  );

  return (
    <div>
      <Header text="Product Subcategories">
        <button
          onClick={() => {
            setIsModalOpen({
              state: true,
              editData: null,
            });
          }}
          className="bg-[#DF8D28] hover:bg-[#DF8D28]/90 text-sm text-white px-4 py-2 flex rounded-lg transition-colors duration-200"
        >
          <Icon icon="ic:outline-add" fontSize={24} />
          New Subcategory
        </button>
      </Header>
      <div className="p-4 bg-white border-2 rounded-lg">
        <MasterTable
          columns={subCategoryColumns}
          rows={subCategoriesData}
          loading={isLoading}
          showAction
          editAction={(row) => setIsModalOpen({ state: true, editData: row })}
          onDelete={(id) => deleteSubCategory(id)}
        />
      </div>
      {isModalOpen.state && (
        <AddProductSubCategory
          modalRef={modalRef}
          closeModal={() => setIsModalOpen({ state: false, editData: null })}
          editData={isModalOpen.editData}
        />
      )}
    </div>
  );
};

export default Productsubcategory;
