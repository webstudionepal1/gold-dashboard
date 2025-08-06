// import { Icon } from "@iconify/react/dist/iconify.js";
// import { useCallback, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import MasterTable from "../../components/shared/MasterTable";
// import { ScrollableModal } from "../../components/shared/ScrollableModal";
// import Header from "../../components/shared/table_heading/Header";
// import { DynamicTab } from "./components/DynamicTab";
// import { PurchaseDetailsCard } from "./components/PurchaseDetailsCard";
// import PurchaseForm from "./components/PurchaseForm";
// import PurchaseReturnForm from "./components/PurchaseReturnForm";
// import {
//   buttonObj,
//   ITable,
//   purchaseColumns,
//   purchaseReturnColumns,
//   purchaseTabOption,
//   supplierColumns,
// } from "./purchaseObj";
// import {
//   IFetchPurchaseReturn,
//   useDeletePurchaseMutation,
//   useGetPurchaseReturnQuery,
//   useGetPurchasesQuery,
// } from "../../server/api/purchaseHooks";
// import { get, map } from "lodash";
// import {
//   IFetchSupplier,
//   useDeleteSupplierMutation,
//   useGetSupplierQuery,
// } from "../../server/api/supplierHooks";
// import { updateSuplierState } from "../../store/supplierStore";
// import { IFetchProduct } from "../../server/api/productHooks";
// import dayjs from "dayjs";
// import { Constants } from "../../utils/constants";

// interface IModalState {
//   of: string;
//   edit: boolean;
//   data: any;
// }

// const PurchaseIndex = () => {
//   const [modal, setModal] = useState<IModalState>({
//     of: "",
//     edit: false,
//     data: null,
//   });
//   const navigate = useNavigate();
//   const [selectedTab, setSelectedTab] = useState("purchase");
//   const {
//     data: purchaseList,
//     isSuccess: purchaseSuccess,
//     isLoading: purchaseLoading,
//   } = useGetPurchasesQuery();
//   const { mutate: deletePurchase } = useDeletePurchaseMutation();
//   const { data: supplierList, isSuccess: supplierSuccess } =
//     useGetSupplierQuery();
//   const { data: returnList, isSuccess: returnSuccess } =
//     useGetPurchaseReturnQuery();
//   const { mutate: deleteSupplier } = useDeleteSupplierMutation();

//   const purchaseTableData = useMemo(
//     () => ({
//       columns: purchaseColumns,
//       rows: map(purchaseList || [], (item) => {
//         const totalCost =
//           item?.items?.length > 0
//             ? item.items.reduce((acc, curr) => acc + (curr.price || 0), 0)
//             : item?.products?.length > 0
//             ? item.products.reduce((acc, curr) => acc + (curr.price || 0), 0)
//             : 0;

//         return {
//           ...item,
//           date: item?.createdAt
//             ? dayjs(item.createdAt).format("MMM-DD-YYYY")
//             : "-",
//           supplier: get(item, "supplier.name", "-"),
//           billNo: get(item, "billNo", "-"),
//           totalCost: `${Constants.currency} ${totalCost}`,
//         };
//       }),
//       viewAction(row: IFetchProduct) {
//         setModal({
//           of: "purchase-view",
//           edit: false,
//           data: row,
//         });
//       },
//       editAction(row: IFetchProduct) {
//         setModal({
//           of: "purchase",
//           edit: true,
//           data: row,
//         });
//       },
//       onDelete(id: string) {
//         deletePurchase(id);
//       },
//       returnAction(row: IFetchProduct) {
//         setModal({
//           of: "purchase-return-form",
//           edit: false,
//           data: row,
//         });
//       },
//     }),
//     [purchaseList, purchaseSuccess]
//   );

//   const supplierTableData = useMemo(
//     () => ({
//       columns: supplierColumns,
//       rows: map(supplierList || [], (item) => ({
//         ...item,
//         contactPerson: item?.contactPerson?.name || "-",
//         contactNo: get(item, "contactPerson.phone", "-"),
//         leadTime: item?.updatedAt
//           ? dayjs().diff(dayjs(item.updatedAt), "days")
//           : "-",
//       })),
//       viewAction(row: IFetchSupplier) {
//         navigate(`/inventory/supplier/${row._id}`);
//       },
//       editAction(row: IFetchSupplier) {
//         updateSuplierState(row);
//         navigate("/inventory/suppliers/edit");
//       },
//       onDelete(id: string) {
//         deleteSupplier(id);
//       },
//     }),
//     [supplierList, supplierSuccess]
//   );

//   const returnTableData = useMemo(
//     () => ({
//       columns: purchaseReturnColumns,
//       rows: map(returnList || [], (item) => ({
//         ...item,
//         reason: get(item, "reason", "-"),
//         date: item?.createdAt
//           ? dayjs(item.createdAt).format("MMM-DD-YYYY")
//           : "-",
//         totalAmount: get(item, "totalReturnAmount", 0),
//         refundAmount: get(item, "refundAmount", 0),
//       })),
//       viewAction(row: IFetchPurchaseReturn) {
//         setModal({ of: "purchase-return", data: row, edit: false });
//       },
//     }),
//     [returnList, returnSuccess]
//   );

//   const tableDataObj: ITable = {
//     purchase: purchaseTableData,
//     supplier: supplierTableData,
//     "purchase-return": returnTableData,
//   };

//   const closeModal = useCallback(
//     () => setModal({ of: "", edit: false, data: null }),
//     []
//   );

//   if (purchaseLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <Header text="Purchase Management">
//         {buttonObj[selectedTab]?.show && (
//           <button
//             onClick={() => {
//               if (selectedTab === "purchase") {
//                 setModal((prev) => ({ ...prev, of: "purchase" }));
//               } else {
//                 navigate("/inventory/suppliers/add");
//               }
//             }}
//             className="px-3 py-2 flex items-center text-white bg-[#d49327] rounded-lg"
//           >
//             <Icon
//               icon="material-symbols-light:add-rounded"
//               width="24"
//               height="24"
//               className="fill-white"
//             />
//             {buttonObj[selectedTab].text}
//           </button>
//         )}
//       </Header>
//       <div className="p-4 bg-white border-2 rounded-lg">
//         <MasterTable
//           showAction
//           tabsOptions={
//             <DynamicTab
//               selectedTab={selectedTab}
//               setSelectedTab={setSelectedTab}
//               tabOptions={purchaseTabOption}
//             />
//           }
//           {...tableDataObj[selectedTab]}
//           rows={tableDataObj[selectedTab].rows}
//           columns={tableDataObj[selectedTab].columns}
//         />
//       </div>
//       {modal.of === "purchase" && (
//         <ScrollableModal classname="w-full max-w-xl" onClose={closeModal}>
//           <PurchaseForm
//             onClose={closeModal}
//             edit={modal.edit}
//             data={modal.data}
//           />
//         </ScrollableModal>
//       )}
//       {modal.of === "purchase-view" && modal.data && (
//         <ScrollableModal classname="w-full max-w-2xl" onClose={closeModal}>
//           <PurchaseDetailsCard data={modal.data} />
//         </ScrollableModal>
//       )}
//       {modal.of === "purchase-return" && modal.data && (
//         <ScrollableModal classname="w-full max-w-2xl" onClose={closeModal}>
//           <PurchaseDetailsCard summary="refund" data={modal.data} />
//         </ScrollableModal>
//       )}
//       {modal.of === "purchase-return-form" && (
//         <ScrollableModal classname="w-full max-w-2xl" onClose={closeModal}>
//           <PurchaseReturnForm data={modal.data} onClose={closeModal} />
//         </ScrollableModal>
//       )}
//     </div>
//   );
// };

// export default PurchaseIndex;

// Second

import { Icon } from "@iconify/react/dist/iconify.js";
import { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  useDeleteSupplierMutation,
  useGetSupplierQuery,
} from "../../server/api/supplierHooks";
// import { IFetchSupplier } from "../../server/api/supplierHooks";
import { updateSuplierState } from "../../store/supplierStore";
import { IFetchProduct } from "../../server/api/productHooks";
import dayjs from "dayjs";
import { Constants } from "../../utils/constants";

interface IModalState {
  of: string;
  edit: boolean;
  data: any;
}

export interface IFetchSupplier {
  name: string;
  description?: string;
  email: string;
  phone: string;
  businessType: string;
  contactPerson: {
    name: string;
    phone: string;
    email: string;
  };
  address: string;
  addresses: {
    district: string;
    address: string;
    province: string;
  };
  businessInfo: {
    company: string;
    PAN: string;
  };
  bankDetails: string;
  products: IFetchProduct[];
  logo: string[];
  _id: string;
  updatedAt?: string;
}

const PurchaseIndex = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const validTabs = ["purchase", "supplier", "purchase-return"];
  const initialTab = validTabs.includes(searchParams.get("tab") || "")
    ? searchParams.get("tab")!
    : "purchase";
  const [modal, setModal] = useState<IModalState>({
    of: "",
    edit: false,
    data: null,
  });
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const {
    data: purchaseList,
    isSuccess: purchaseSuccess,
    isLoading: purchaseLoading,
  } = useGetPurchasesQuery();
  const { mutate: deletePurchase } = useDeletePurchaseMutation();
  const { data: supplierList, isSuccess: supplierSuccess } =
    useGetSupplierQuery();
  const { data: returnList, isSuccess: returnSuccess } =
    useGetPurchaseReturnQuery();
  const { mutate: deleteSupplier } = useDeleteSupplierMutation();

  const purchaseTableData = useMemo(
    () => ({
      columns: purchaseColumns,
      rows: map(purchaseList, (item) => {
        // Calculate total quantity
        const totalQuantity =
          item?.items && item.items.length > 0
            ? item.items.reduce((acc, item) => acc + (item.quantity || 0), 0)
            : item?.products && item.products.length > 0
            ? item.products.reduce((acc, item) => acc + (item.quantity || 0), 0)
            : 0;

        // Calculate total cost
        const totalCost =
          item?.items && item.items.length > 0
            ? item.items.reduce((acc, item) => acc + (item.price || 0), 0)
            : item?.products && item.products.length > 0
            ? item.products.reduce((acc, item) => acc + (item.price || 0), 0)
            : 0;

        return {
          ...item,
          date: dayjs(item.createdAt).format("MMM-DD-YYYY"),
          supplier: get(item, "supplier.name", "-"),
          billNo: get(item, "billNo", "-"),
          totalQuantity: totalQuantity,
          totalCost: `${Constants.currency} ${totalCost}`,
        };
      }),
      viewAction(row: IFetchProduct) {
        setModal({
          of: "purchase-view",
          edit: false,
          data: row,
        });
      },
      editAction(row: IFetchProduct) {
        setModal({
          of: "purchase",
          edit: true,
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
      rows: map(supplierList || [], (item) => ({
        ...item,
        contactPerson: item?.contactPerson?.name || "-",
        contactNo: get(item, "contactPerson.phone", "-"),
        leadTime: item?.updatedAt
          ? dayjs().diff(dayjs(item.updatedAt), "days")
          : "-",
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
      rows: map(returnList || [], (item) => ({
        ...item,
        reason: get(item, "reason", "-"),
        date: item?.createdAt
          ? dayjs(item.createdAt).format("MMM-DD-YYYY")
          : "-",
        totalAmount: get(item, "totalReturnAmount", 0),
        refundAmount: get(item, "refundAmount", 0),
        totalQuantityPurchased: get(item, "totalQuantityPurchased", 0),
        totalQuantityReturned: get(item, "totalQuantityReturned", 0),
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

  const handleTabChange = useCallback(
    (tab: string) => {
      setSelectedTab(tab);
      setSearchParams({ tab });
    },
    [setSearchParams]
  );

  const closeModal = useCallback(
    () => setModal({ of: "", edit: false, data: null }),
    []
  );

  if (purchaseLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header text="Purchase Management">
        {buttonObj[selectedTab]?.show && (
          <button
            onClick={() => {
              if (selectedTab === "purchase") {
                setModal((prev) => ({ ...prev, of: "purchase" }));
              } else {
                navigate("/inventory/suppliers/add");
              }
            }}
            className="px-3 py-2 flex items-center text-white bg-[#d49327] rounded-lg">
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
      <div className="p-4 bg-white border-2 rounded-lg">
        <MasterTable
          showAction
          tabsOptions={
            <DynamicTab
              selectedTab={selectedTab}
              setSelectedTab={handleTabChange}
              tabOptions={purchaseTabOption}
            />
          }
          {...tableDataObj[selectedTab]}
          rows={tableDataObj[selectedTab].rows}
          columns={tableDataObj[selectedTab].columns}
        />
      </div>
      {modal.of === "purchase" && (
        <ScrollableModal classname="w-full max-w-xl" onClose={closeModal}>
          <PurchaseForm
            onClose={closeModal}
            edit={modal.edit}
            data={modal.data}
          />
        </ScrollableModal>
      )}
      {modal.of === "purchase-view" && modal.data && (
        <ScrollableModal classname="w-full max-w-2xl" onClose={closeModal}>
          <PurchaseDetailsCard data={modal.data} />
        </ScrollableModal>
      )}
      {modal.of === "purchase-return" && modal.data && (
        <ScrollableModal classname="w-full max-w-2xl" onClose={closeModal}>
          <PurchaseDetailsCard summary="refund" data={modal.data} />
        </ScrollableModal>
      )}
      {modal.of === "purchase-return-form" && (
        <ScrollableModal classname="w-full max-w-2xl" onClose={closeModal}>
          <PurchaseReturnForm data={modal.data} onClose={closeModal} />
        </ScrollableModal>
      )}
    </div>
  );
};

export default PurchaseIndex;
