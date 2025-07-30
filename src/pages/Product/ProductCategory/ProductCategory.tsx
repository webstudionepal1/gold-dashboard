import { Icon } from "@iconify/react/dist/iconify.js";
import { get } from "lodash";
import React, { useMemo, useState } from "react";
import MasterTable from "../../../components/shared/MasterTable";
import Header from "../../../components/shared/table_heading/Header";
import { useOutsideClick } from "../../../hooks/UseOutsideClick";
import {
  IFetchCategory,
  useDeleteProductCategoriesMutation,
  useGetAllProductCategoriesQuery,
  useUpdateProductCategoriesMutation,
} from "../../../server/api/productHooks";
import { categoryColumns } from "../productObj";
import AddProductCategory from "./components/AddProductCategory";
import { StatusSwitch } from "../../../components/shared/StatusSwitch";
// import { AddProductCategory } from "./components/AddProductCategory";

interface IEditModal {
  state: boolean;
  editData?: IFetchCategory | null;
}
const ProductCategory: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<IEditModal>({
    state: false,
    editData: null,
  });
  const modalRef = useOutsideClick(() =>
    setIsModalOpen({ state: false, editData: null })
  );

  const {
    data: categories,
    isSuccess,
    isLoading,
  } = useGetAllProductCategoriesQuery();
  const { mutate: deleteCategory } = useDeleteProductCategoriesMutation();
  const { mutate: updateCategory } = useUpdateProductCategoriesMutation();

  const handleStatusToggle = async (categoryId: string, newStatus: boolean) => {
    const category = categories?.find((cat) => cat._id === categoryId);
    if (category) {
      updateCategory({
        id: categoryId,
        body: {
          ...category,
          isActive: newStatus,
        },
      });
    }
  };

  const categoriesData = useMemo(() => {
    // Ensure we have valid data and it's an array
    if (!isSuccess || !categories || !Array.isArray(categories)) {
      return [];
    }

    return categories.map((item, index) => ({
      ...item,
      // subCategory: get(item, "subCategory", [])
      //   .map((subItem) => get(subItem, "name", ""))
      //   .join(", "),
      sn: index + 1,
      description:
        get(item, "description", "").length > 50
          ? `${get(item, "description", "").slice(0, 50)}...`
          : get(item, "description", ""),
      totalProducts: get(item, "totalProducts", 0),
      status: (
        <StatusSwitch
          isActive={get(item, "isActive", true)}
          onToggle={(newStatus) => handleStatusToggle(item._id, newStatus)}
        />
      ),
    }));
  }, [isSuccess, categories]);

  return (
    <div>
      <Header text="Categories">
        <button
          onClick={() => {
            setIsModalOpen({
              state: true,
              editData: null,
            });
          }}
          className="bg-[#DF8D28] hover:bg-[#DF8D28]/90 text-sm text-white px-4 py-2 flex rounded-lg transition-colors duration-200">
          <Icon icon="ic:outline-add" fontSize={24} />
          New Category
        </button>
      </Header>
      <div className="p-4 bg-white border-2 rounded-lg">
        <MasterTable
          columns={categoryColumns}
          rows={categoriesData}
          loading={isLoading}
          onDelete={(id) => deleteCategory(id)}
          editAction={(row) => setIsModalOpen({ state: true, editData: row })}
          showAction
        />
      </div>
      {isModalOpen.state && (
        <AddProductCategory
          modalRef={modalRef}
          closeModal={() => setIsModalOpen({ state: false, editData: null })}
          editData={isModalOpen.editData}
        />
      )}
    </div>
  );
};

export default ProductCategory;
