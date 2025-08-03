import { Icon } from "@iconify/react/dist/iconify.js";
import { get } from "lodash";
import React, { useMemo, useState } from "react";
import MasterTable from "../../../components/shared/MasterTable";
import Header from "../../../components/shared/table_heading/Header";
import { useOutsideClick } from "../../../hooks/UseOutsideClick";
import {
  IFetchOccasion,
  useDeleteProductOccasionMutation,
  useGetAllProductOccasionsQuery,
} from "../../../server/api/productHooks";
import { occasionColumns } from "../productObj";
import AddProductOccasion from "./components/AddProductOccasion";

interface IEditModal {
  state: boolean;
  editData?: IFetchOccasion | null;
}

const ProductOccasion: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<IEditModal>({
    state: false,
    editData: null,
  });
  const modalRef = useOutsideClick(() =>
    setIsModalOpen({ state: false, editData: null })
  );

  const { data: occasions, isSuccess } = useGetAllProductOccasionsQuery();
  const { mutate: deleteOccasion } = useDeleteProductOccasionMutation();

  console.log('occasions', occasions)
  const occasionsData = useMemo(
    () =>
      isSuccess
        ? occasions?.map((item, index) => ({
          ...item,
         sn: (index + 1).toString(),
          description: get(item, "description", ""),
          totalProducts: get(item, "totalProducts", 0),
          image: get(item, "image", "") ? (
            <img
              src={`${import.meta.env.VITE_API_IMAGE_BASE_URL}${item.image.length > 0 ? item.image[0] : '/no-image.png'}`}
              alt={item.name}
              className="w-12 h-12 mx-auto object-cover rounded"
            />
          ) : (
            <span className="text-gray-400">No image</span>
          ),
          video: get(item, "video", "") ? (
            <video
              src={get(item, "video", "")}
              className="w-12 h-12 object-cover rounded"
              controls={false}
            />
          ) : (
            <span className="text-gray-400">No video</span>
          ),
          isActive: get(item, "isActive", false) ? "Active" : "Inactive",
        }))
        : [],
    [isSuccess, occasions]
  );

  return (
    // <div className="container px-4 mx-auto">
    <div>
      <Header text="Product Occasions">
        <button
          onClick={() => {
            setIsModalOpen({
              state: true,
              editData: null,
            });
          }}
          className="bg-[#DF8D28] hover:bg-[#DF8D28]/90 text-white px-4 py-2 flex rounded-lg transition-colors duration-200"
        >
          <Icon icon="ic:outline-add" fontSize={24} />
          New Occasion
        </button>
      </Header>
      <div className="p-4 bg-white border-2 rounded-lg">
        <MasterTable
          columns={occasionColumns}
          rows={occasionsData}
          onDelete={(id) => deleteOccasion(id)}
          editAction={(row) => {
            setIsModalOpen({
              state: true,
              editData: row as IFetchOccasion,
            });
          }}
          showAction
        />
      </div>
      {isModalOpen.state && (
        <AddProductOccasion
          modalRef={modalRef}
          editData={isModalOpen.editData}
          closeModal={() => setIsModalOpen({ state: false, editData: null })}
        />
      )}
    </div>
  );
};

export default ProductOccasion;
