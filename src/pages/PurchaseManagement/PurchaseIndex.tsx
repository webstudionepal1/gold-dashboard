import { Icon } from "@iconify/react/dist/iconify.js";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MasterTable from "../../components/shared/MasterTable";
import { ScrollableModal } from "../../components/shared/ScrollableModal";
import Header from "../../components/shared/table_heading/Header";
import { DynamicTab } from "./components/DynamicTab";
import { PurchaseDetailsCard } from "./components/PurchaseDetailsCard";
import PurchaseForm from "./components/PurchaseForm";
import PurchaseReturnForm from "./components/PurchaseReturnForm";
import {
  buttonObj,
  ITable,
  purchaseColumns,
  purchaseReturnColumns,
  purchaseTabOption,
  supplierColumns,
} from "./purchaseObj";
import {
  IFetchPurchaseReturn,
  useDeletePurchaseMutation,
  useGetPurchaseReturnQuery,
  useGetPurchasesQuery,
} from "../../server/api/purchaseHooks";
import { get, map } from "lodash";
import {
  IFetchSupplier,
  useDeleteSupplierMutation,
  useGetSupplierQuery,
} from "../../server/api/supplierHooks";
import { updateSuplierState } from "../../store/supplierStore";
import { IFetchProduct } from "../../server/api/productHooks";
import dayjs from "dayjs";

interface IModalState {
  of: string;
  edit: boolean;
  data: any;
}
const PurchaseIndex = () => {
  const [modal, setModal] = useState<IModalState>({
    of: "",
    edit: false,
    data: null,
  });
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("purchase");
  const { data: purchaseList, isSuccess: purchaseSuccess } =
    useGetPurchasesQuery();
  const { mutate: deletePurchase } = useDeletePurchaseMutation();
  const { data: supplierList, isSuccess: supplierSuccess } =
    useGetSupplierQuery();
  const { data: returnList, isSuccess: returnSuccess } =
    useGetPurchaseReturnQuery();
  const { mutate: deleteSupplier } = useDeleteSupplierMutation();
  const purchaseTableData = useMemo(
    () => ({
      columns: purchaseColumns,
      rows: map(purchaseList, (item) => ({
        ...item,
        date: dayjs(item.createdAt).format("MMM-DD-YYYY"),
        supplier: get(item, "supplier.name", "-"),
        billNo: get(item, "billNo", "-"),
        totalCost: `$ ${
          item?.items.length > 0
            ? item.items.reduce((acc, item) => acc + item.price, 0)
            : item?.products.reduce((acc, item) => acc + item.price, 0)
        }`,
      })),
      viewAction(row: IFetchProduct) {
        setModal({
          of: "purchase-view",
          edit: false,
          data: row,
        });
      },
      onDelete(id: string) {
        deletePurchase(id);
      },
      returnAction(row: IFetchProduct) {
        setModal({
          of: "purchase-return-form",
          edit: false,
          data: row,
        });
      },
    }),
    [purchaseList, purchaseSuccess]
  );
  const supplierTableData = useMemo(
    () => ({
      columns: supplierColumns,
      rows: map(supplierList, (item) => ({
        ...item,
      })),
      viewAction(row: IFetchSupplier) {
       navigate(`/inventory/supplier/${row._id}`);
      },

      editAction(row: IFetchSupplier) {
        updateSuplierState(row);
        navigate("/inventory/suppliers/edit");
      },
      onDelete(id: string) {
        deleteSupplier(id);
      },
    }),
    [supplierList, supplierSuccess]
  );
  const returnTableData = useMemo(
    () => ({
      columns: purchaseReturnColumns,
      rows: map(returnList, (item) => ({
        ...item,
        return: get(item, "returnNO", "-"),
        reason: get(item, "reason", "-"),
        date: dayjs(get(item, "createdAt", "-")).format("MMM-DD-YYYY"),
        totalAmount: get(item, "totalReturnAmount", 0),
        refundAmount: get(item, "refundAmount", 0),
      })),
      viewAction(row: IFetchPurchaseReturn) {
        setModal({ of: "purchase-return", data: row, edit: false });
      },
    }),
    [returnList, returnSuccess]
  );

  const tableDataObj: ITable = {
    purchase: purchaseTableData,
    supplier: supplierTableData,
    "purchase-return": returnTableData,
  };

  const closeModal = useCallback(
    () => setModal({ of: "", edit: false, data: null }),
    []
  );

  return (
    <div className="container px-4 py-3 mx-auto ">
      <Header text="Purchase Management">
        {buttonObj[selectedTab]?.show && (
          <button
            onClick={() => {
              if (selectedTab === "purchase") {
                setModal((prev) => ({ ...prev, of: "purchase" }));
              } else {
                console.log(buttonObj[selectedTab]);
                navigate("/inventory/suppliers/add");
              }
            }}
            className="px-3 py-2 flex items-center text-white bg-[#d49327] transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg"
          >
            <Icon
              icon="material-symbols-light:add-rounded"
              width="24"
              height="24"
              className="fill-white"
            />
            {buttonObj[selectedTab].text}
          </button>
        )}
      </Header>
      <MasterTable
        showAction
        tabsOptions={
          <DynamicTab
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            tabOptions={purchaseTabOption}
          />
        }
        {...tableDataObj[selectedTab]}
        rows={tableDataObj[selectedTab].rows}
        columns={tableDataObj[selectedTab].columns}
      />
      {modal.of === "purchase" && (
        <ScrollableModal onClose={closeModal}>
          <PurchaseForm onClose={closeModal} />
        </ScrollableModal>
      )}

      {modal.of === "purchase-view" && modal.data && (
        <ScrollableModal onClose={closeModal} classname="w-[35rem]">
          <PurchaseDetailsCard data={modal.data} />
        </ScrollableModal>
      )}

      {modal.of === "purchase-return" && modal.data && (
        <ScrollableModal classname="w-[35rem]" onClose={closeModal}>
          <PurchaseDetailsCard summary="refund" data={modal.data} />
        </ScrollableModal>
      )}

      {modal.of === "purchase-return-form" && (
        <ScrollableModal onClose={closeModal}>
          <PurchaseReturnForm data={modal.data} onClose={closeModal} />
        </ScrollableModal>
      )}
    </div>
  );
};

export default PurchaseIndex;
