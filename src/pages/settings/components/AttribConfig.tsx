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
  const { data: claspsType } = useGetAllProductClaspsQuery();
  const { data: rawmaterial } = useGetRawMaterialsQuery();
  const { mutate: deleteClasp } = useDeleteProductClaspsMutation();
  const { mutate: deleteRawMaterial } = useDeleteRawMaterial();
  const [modal, setModal] = useState<IModalProps>({
    of: "",
    data: null,
    edit: false,
  });
  const buttonObj:IButtonObj = {
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
      })),
      onDelete(id: string) {
        deleteClasp(id);
      },
      onEdit(rows: IFetchClasps) {
        setModal({ of: "clasp-type", edit: true, data: rows });
      },
    }),
    [claspsType]
  );
  const rawTableData = useMemo(
    () => ({
      columns: rawColumns,
      rows: map(rawmaterial, (item, index:number) => ({
        ...item,
        id: item._id,
        sn:index+1
      })),
      onEdit(rows: IFetchItems) {
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
    <div className="p-4">
      <Header text="Attribute Config">
        <button
          onClick={() => buttonObj[tab].handleClick()}
          className="px-3 py-2 flex items-center text-white bg-[#d49327] transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg"
        >
          <Icon
            icon="material-symbols-light:add-rounded"
            width="24"
            height="24"
            className="fill-white"
          />
          {buttonObj[tab].text}
        </button>
      </Header>
      <MasterTable
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
