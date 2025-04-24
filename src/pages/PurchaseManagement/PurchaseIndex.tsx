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
import { buttonObj, ITable, purchaseTabOption } from "./purchaseObj";
import {
  useGetPurchaseReturnQuery,
  useGetPurchasesQuery,
} from "../../server/api/purchaseHooks";
import { map } from "lodash";
import { useGetSupplierQuery } from "../../server/api/supplierHooks";

const PurchaseIndex = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("purchase");
  const { data: purchaseList, isSuccess: purchaseSuccess } =
    useGetPurchasesQuery();
  const { data: supplierList, isSuccess: supplierSuccess } =
    useGetSupplierQuery();
  const { data: returnList, isSuccess: returnSuccess } =
    useGetPurchaseReturnQuery();
  const purchaseTableData = useMemo(
    () => ({
      columns: [{ key: "name", title: "Name" }],
      rows: map(purchaseList, (item) => ({
        ...item,
      })),
    }),
    [purchaseList, purchaseSuccess]
  );
  const supplierTableData = useMemo(
    () => ({
      columns: [{ key: "name", title: "Name" }],
      rows: map(supplierList, (item) => ({
        ...item,
      })),
    }),
    [supplierList, supplierSuccess]
  );
  const returnTableData = useMemo(
    () => ({
      columns: [{ key: "name", title: "Name" }],
      rows: map(returnList, (item) => ({
        ...item,
      })),
    }),
    [returnList, returnSuccess]
  );

  const tableDataObj: ITable = {
    purchase: purchaseTableData,
    supplier: supplierTableData,
    "purchase-return": returnTableData,
  };
  const [modal, setModal] = useState({
    of: "",
    edit: false,
    data: null,
  });
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
                navigate("/inventory/suppliers/add-supplier");
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
        tabsOptions={
          <DynamicTab
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            tabOptions={purchaseTabOption}
          />
        }
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
          <PurchaseDetailsCard
            billNo="inv 558855"
            date="2082-02-25"
            purchaseId="P-4565"
            supplier="Gold supplier pvt ltd"
            items={[
              {
                name: "gold",
                unit: "Tola",
                costPerUnit: 45,
                quantity: 50,
                total: 5000,
              },
              {
                name: "silver",
                unit: "Tola",
                costPerUnit: 25,
                quantity: 40,
                total: 3000,
              },
            ]}
            totalCost={8000}
            discount={500}
            netTotal={7500}
            summaryType="purchase"
          />
        </ScrollableModal>
      )}

      {modal.of === "purchase-return" && modal.data && (
        <ScrollableModal classname="w-[35rem]" onClose={closeModal}>
          <PurchaseDetailsCard
            billNo="inv 558855"
            date="2082-02-25"
            purchaseId="P-4565"
            supplier="Gold supplier pvt ltd"
            items={[
              {
                name: "gold",
                unit: "Tola",
                costPerUnit: 45,
                quantity: 50,
                total: 5000,
              },
              {
                name: "silver",
                unit: "Tola",
                costPerUnit: 25,
                quantity: 40,
                total: 3000,
              },
            ]}
            refundAmount={55000}
            summaryType="refund"
          />
        </ScrollableModal>
      )}

      {modal.of === "purchase-return-form" && (
        <ScrollableModal onClose={closeModal}>
          <PurchaseReturnForm />
        </ScrollableModal>
      )}
    </div>
  );
};

export default PurchaseIndex;
