import { Icon } from '@iconify/react/dist/iconify.js';
import { get } from 'lodash';
import React, { useMemo, useState } from 'react';
import MasterTable from '../../components/shared/MasterTable';
import Header from '../../components/shared/table_heading/Header';
import { useOutsideClick } from '../../hooks/UseOutsideClick';
import {
  IFetchStone,
  useDeleteStoneMutation,
  useGetAllStonesQuery,
  useUpdateStoneMutation,
} from '../../server/api/productHooks';
import { stoneColumns } from './stoneObj';
import AddStone from './components/AddStone';

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

  console.log('Stone data', stones);
  const { mutate: deleteStone } = useDeleteStoneMutation();
  const { mutate: updateStone } = useUpdateStoneMutation();

  const handleStatusToggle = async (stoneId: string, newStatus: boolean) => {
    const formData = new FormData();
    formData.append('isActive', newStatus.toString());
    updateStone(
      {
        id: stoneId,
        body: formData,
      },
      {
        onError: (err) => console.error('Update failed:', err),
      }
    );
  };

  const stonesData = useMemo(
    () =>
      isSuccess
        ? stones?.map((item) => ({
            ...item,
            type: <div className="capitalize">{get(item, 'type', '')}</div>,
            color: get(item, 'color', ''),
            carat: get(item, 'carat', 0),
            pricePerCarat: get(item, 'pricePerCarat', 0),
            totalPrice: get(item, 'totalPrice', 0),
            shape: get(item, 'shape', ''),
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
          }))
        : [],
    [isSuccess, stones]
  );

  return (
    // <div className="container px-4 mx-auto">
    <div>
      <Header text="Stones">
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
          New Stone
        </button>
      </Header>
      <div className="p-4 bg-white border-2 rounded-lg">
        <MasterTable
          columns={stoneColumns}
          rows={stonesData}
          onDelete={(id) => deleteStone(id)}
          editAction={(row) => {
            console.log(row, 'row');
            setIsModalOpen({
              state: true,
              editData: {
                ...row,
                type:
                  typeof row.type === 'object'
                    ? row?.type?.props?.children
                    : (row.type as any),
              },
            });
          }}
          showAction
          toggleAction={(row) => {
            console.log(row, 'stone row');
            handleStatusToggle(row._id, !row.isActive);
          }}
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
