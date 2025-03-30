import type React from "react"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Table, type TableData, type ColumnConfig } from "../../../../components/shared/Table"

interface PurchaseProduct {
  _id: string
  itemName: string
  unit: string
  costPerUnit: number
  qty: number
}

interface PurchaseDetails {
  billNo: string
  date: string
  supplierName: string
  products: PurchaseProduct[]
}

interface ViewPurchaseDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  purchaseDetails: PurchaseDetails | null
  onProductAction?: (productId: string) => void
}

const ViewPurchaseDetailsModal: React.FC<ViewPurchaseDetailsModalProps> = ({
  isOpen,
  onClose,
  purchaseDetails,
  onProductAction,
}) => {
  if (!isOpen || !purchaseDetails) return null

  const columns: ColumnConfig<PurchaseProduct>[] = [
    {
      header: "Item Name",
      key: "itemName",
    },
    {
      header: "Unit",
      key: "unit",
    },
    {
      header: "Cost per unit",
      key: "costPerUnit",
      render: (_, row) => `Rs.${row.costPerUnit}`,
    },
    {
      header: "QTY",
      key: "qty",
    },
  ]
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose()
      }
    }
  const handleProductAction = (row: TableData<PurchaseProduct>) => {
    onProductAction && onProductAction(row._id)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6">

          <h2 className="text-xl font-semibold mb-8 text-center">Purchase Details</h2>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="flex items-start">
              <div className="w-28 text-gray-500 font-medium">Bill No.</div>
              <div className="font-medium">{purchaseDetails.billNo}</div>
            </div>
            <div className="flex items-start justify-end">
              <div className="text-gray-500 font-medium mr-4">Date:</div>
              <div className="font-medium">{purchaseDetails.date}</div>
            </div>
            <div className="flex items-start">
              <div className="w-28 text-gray-500 font-medium">Suppliers</div>
              <div className="font-medium">{purchaseDetails.supplierName}</div>
            </div>
          </div>

          <Table
            columns={columns}
            data={purchaseDetails.products}
            showAction={true}
            showSelectAll={false}
            showEdit={false}
            showDelete={false}
            showView={false}
            showBg={false}
            showButton={true}
            buttonTitle=""
            onButtonClick={handleProductAction}
            viewRow={(row) => (
              <button
                className="bg-[#DF8D28] text-white p-2 rounded-md hover:bg-[#DF8D28]/90"
                onClick={() => handleProductAction(row)}
              >
                <Icon icon="mdi:arrow-right" width={20} height={20} />
              </button>
            )}
          />
        </div>
      </div>
    </div>
  )
}

export default ViewPurchaseDetailsModal

