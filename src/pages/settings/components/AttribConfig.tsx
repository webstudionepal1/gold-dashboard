import { useMemo, useState } from "react";
import MasterTable from "../../../components/shared/MasterTable";
import { DynamicTab } from "../../PurchaseManagement/components/DynamicTab";
import { attributeObj, claspsColumn, rawColumns } from "../profileObj";
import {
  IFetchClasps,
  useDeleteProductClaspsMutation,
  useGetAllProductClaspsQuery,
} from "../../../server/api/productHooks";
import {
  IFetchItems,
  useDeleteRawMaterial,
  useGetRawMaterialsQuery,
} from "../../../server/api/purchaseHooks";
import { map } from "lodash";
import { ITable } from "../../PurchaseManagement/purchaseObj";
import Header from "../../../components/shared/table_heading/Header";
import ClaspModel from "./ClaspModel";
import RawMaterialModal from "./RawMaterialModal";
import { Icon } from "@iconify/react/dist/iconify.js";

interface IModalProps {
  of: string;
  data: any;
  edit: boolean;
}
interface IButtonObj {
  [key: string]: {
    text?: string;
    handleClick: () => void;
  };
}
const AttribConfig = () => {
  const [tab, setTab] = useState("clasp-type");
  const { data: claspsType, isLoading } = useGetAllProductClaspsQuery();
  const { data: rawmaterial, isLoading: materialLoading } =
    useGetRawMaterialsQuery();
  const { mutate: deleteClasp } = useDeleteProductClaspsMutation();
  const { mutate: deleteRawMaterial } = useDeleteRawMaterial();
  const [modal, setModal] = useState<IModalProps>({
    of: "",
    data: null,
    edit: false,
  });
  console.log(claspsType);
  const buttonObj: IButtonObj = {
    "raw-material": {
      text: "Add Raw Material",
      handleClick: () =>
        setModal({ of: "raw-material", edit: false, data: null }),
    },
    "clasp-type": {
      text: "Add Clasp Type",
      handleClick: () =>
        setModal({ of: "clasp-type", edit: false, data: null }),
    },
  };
  const claspsTableData = useMemo(
    () => ({
      columns: claspsColumn,
      rows: map(claspsType, (item, index: number) => ({
        ...item,
        sn: index + 1,
        id: item._id,
        status: (
          <span
            className={`text-white py-1 px-2 rounded-full ${
              item.isActive ? "bg-green" : "bg-red"
            }`}
          >
            {item.isActive ? "Active" : "Inactive"}
          </span>
        ),
        photo: (
          <div>
            {item.images ? (
              item.images.length > 0 && (
                <img
                  src={`${import.meta.env.VITE_API_IMAGE_BASE_URL}${
                    item.images[0]
                  }`}
                  alt="hello"
                  className="size-8"
                />
              )
            ) : (
              <img
                src={"/public/no-image.png"}
                alt="no-imgage"
                className="size-8"
              />
            )}
          </div>
        ),
      })),
      onDelete(id: string) {
        deleteClasp(id);
      },
      editAction(rows: IFetchClasps) {
        setModal({ of: "clasp-type", edit: true, data: rows });
      },
    }),
    [claspsType]
  );
  const rawTableData = useMemo(
    () => ({
      columns: rawColumns,
      rows: map(rawmaterial, (item, index: number) => ({
        ...item,
        id: item._id,
        sn: index + 1,
      })),
      editAction(rows: IFetchItems) {
        setModal({ of: "raw-material", edit: true, data: rows });
      },
      onDelete(id: string) {
        deleteRawMaterial(id);
      },
    }),

    [rawmaterial]
  );
  const tableDataObj: ITable = {
    "clasp-type": claspsTableData,
    "raw-material": rawTableData,
  };
  return (
    <div>
      <Header text="Attribute Config">
        <button
          onClick={() => buttonObj[tab].handleClick()}
         className="bg-[#DF8D28] hover:bg-[#DF8D28]/90 text-sm text-white px-4 py-2 flex rounded-lg transition-colors duration-200"
        >
          <Icon
            icon="material-symbols-light:add-rounded"
            width="18"
            height="18"
            className="fill-white"
          />
          {buttonObj[tab].text}
        </button>
      </Header>
      <div className="p-4 bg-white border-2 rounded-lg">
        <MasterTable
          loading={isLoading || materialLoading}
          showAction
          {...tableDataObj[tab]}
          tabsOptions={
            <DynamicTab
              selectedTab={tab}
              setSelectedTab={setTab}
              tabOptions={attributeObj}
            />
          }
        />
      </div>
      {modal.of === "clasp-type" && (
        <ClaspModel
          onClose={() => setModal({ of: "", data: null, edit: false })}
          data={modal.data}
          edit={modal.edit}
        />
      )}
      {modal.of === "raw-material" && (
        <RawMaterialModal
          onClose={() => setModal({ of: "", data: null, edit: false })}
          data={modal.data}
          edit={modal.edit}
        />
      )}
    </div>
  );
};

export default AttribConfig;
