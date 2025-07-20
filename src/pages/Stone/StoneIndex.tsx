import { Icon } from "@iconify/react/dist/iconify.js";
import { get } from "lodash";
import React, { useMemo, useState } from "react";
import MasterTable from "../../components/shared/MasterTable";
import Header from "../../components/shared/table_heading/Header";
import { useOutsideClick } from "../../hooks/UseOutsideClick";
import {
  IFetchStone,
  useDeleteStoneMutation,
  useGetAllStonesQuery,
} from "../../server/api/productHooks";
import { stoneColumns } from "./stoneObj";
import AddStone from "./components/AddStone";

interface IEditModal {
  state: boolean;
  editData?: IFetchStone | null;
}

const StoneIndex: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<IEditModal>({
    state: false,
    editData: null,
  });
  const modalRef = useOutsideClick(() =>
    setIsModalOpen({ state: false, editData: null })
  );

  const { data: stones, isSuccess } = useGetAllStonesQuery({});
  const { mutate: deleteStone } = useDeleteStoneMutation();

  const stonesData = useMemo(
    () =>
      isSuccess
        ? stones?.map((item) => ({
            ...item,
            type: get(item, "type", ""),
            color: get(item, "color", ""),
            carat: get(item, "carat", 0),
            pricePerCarat: get(item, "pricePerCarat", 0),
            totalPrice: get(item, "totalPrice", 0),
            shape: get(item, "shape", ""),
          }))
        : [],
    [isSuccess, stones]
  );

  return (
    <div className="container px-4 mx-auto">
      <Header text="Stones">
        <button
          onClick={() => {
            setIsModalOpen({
              state: true,
              editData: null,
            });
          }}
          className="bg-[#DF8D28] hover:bg-[#DF8D28]/90 text-white px-4 py-2 flex rounded-lg transition-colors duration-200">
          <Icon icon="ic:outline-add" fontSize={24} />
          New Stone
        </button>
      </Header>
      <div className="p-4 bg-white">
        <MasterTable
          columns={stoneColumns}
          rows={stonesData}
          onDelete={(id) => deleteStone(id)}
          editAction={(row) => setIsModalOpen({ state: true, editData: row })}
          showAction
        />
      </div>
      {isModalOpen.state && (
        <AddStone
          modalRef={modalRef}
          closeModal={() => setIsModalOpen({ state: false, editData: null })}
          editData={isModalOpen.editData}
        />
      )}
    </div>
  );
};

export default StoneIndex;
