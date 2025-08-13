import { Icon } from '@iconify/react/dist/iconify.js';
import { get } from 'lodash';
import React, { useMemo, useState } from 'react';
import MasterTable from '../../../components/shared/MasterTable';
import Header from '../../../components/shared/table_heading/Header';
import { useOutsideClick } from '../../../hooks/UseOutsideClick';
import {
  IFetchSubCategory,
  useDeleteProductSubCategoryMutation,
  useGetAllProductSubCategoriesQuery,
  useUpdateProductSubCategoryMutation,
} from '../../../server/api/productHooks';
import { subCategoryColumns } from '../productObj';
import { AddProductSubCategory } from './components/AddProductSubCategory';
import ViewProductSubCategory from './components/ViewProductSubCategory';
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
  const [isViewModalOpen, setIsViewModalOpen] = useState<{
    state: boolean;
    viewData: IFetchSubCategory | null;
  }>({
    state: false,
    viewData: null,
  });
  const modalRef = useOutsideClick(() =>
    setIsModalOpen({ state: false, editData: null })
  );

  const {
    data: subCategories,
    isSuccess,
    isLoading,
  } = useGetAllProductSubCategoriesQuery();

  const { mutate: deleteSubCategory } = useDeleteProductSubCategoryMutation();
  const { mutate: updateSubCategory } = useUpdateProductSubCategoryMutation();

  const handleStatusToggle = async (
    subCategoryId: string,
    newStatus: boolean
  ) => {
    updateSubCategory(
      {
        id: subCategoryId,
        body: { isActive: newStatus },
      },
      {
        onError: (err) => console.error('Update failed:', err),
      }
    );
  };
  const subCategoriesData = useMemo(
    () =>
      isSuccess
        ? subCategories?.map((item, index: number) => ({
            ...item,
            sn: index + 1,
            description: (
              <p className="truncate max-w-xl">
                {get(item, 'description', '') !== ''
                  ? get(item, 'description')
                  : '-'}
              </p>
            ),
            rawDescription: get(item, 'description', ''),
            totalProducts: get(item, 'totalProducts', '0'),
            status: (
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  get(item, 'isActive', true)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {get(item, 'isActive', true) ? 'Active' : 'Inactive'}
              </span>
            ),
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
          className="bg-[#DF8D28] hover:bg-[#DF8D28]/90 text-sm text-white px-4 gap-1 py-2 flex rounded-lg transition-colors duration-200"
        >
          <Icon icon="ic:outline-add" fontSize={18} />
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
          viewAction={(row) =>
            setIsViewModalOpen({ state: true, viewData: row })
          }
        />
      </div>
      {isModalOpen.state && (
        <AddProductSubCategory
          modalRef={modalRef}
          closeModal={() => setIsModalOpen({ state: false, editData: null })}
          editData={isModalOpen.editData}
        />
      )}
      {isViewModalOpen.state && (
        <ViewProductSubCategory
          modalRef={modalRef}
          closeModal={() =>
            setIsViewModalOpen({ state: false, viewData: null })
          }
          viewData={isViewModalOpen.viewData}
          isOpen={isViewModalOpen.state}
        />
      )}
    </div>
  );
};

export default Productsubcategory;
