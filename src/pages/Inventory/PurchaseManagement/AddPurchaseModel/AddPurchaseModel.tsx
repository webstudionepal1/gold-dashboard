
import type React from "react"
import { useState } from "react"
import { Icon } from "@iconify/react/dist/iconify.js"

interface ProductItem {
  id: string
  itemName: string
  units: string
  ratePerUnit: number
  paidPrice: number
  quantity: number
}

interface AddPurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (billNo: string, supplierName: string, products: ProductItem[], description: string) => void
  suppliers: { id: string; name: string }[]
  items: { id: string; name: string }[]
}

const AddPurchaseModal: React.FC<AddPurchaseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  suppliers = [{ id: "1", name: "Gold supplier pvt ltd" }],
  items = [{ id: "1", name: "Gold" }],
}) => {
  const [billNo, setBillNo] = useState("Gold")
  const [supplierName, setSupplierName] = useState(suppliers[0]?.name || "")
  const [description, setDescription] = useState("")
  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: "1",
      itemName: items[0]?.name || "Gold",
      units: "Tola",
      ratePerUnit: 176000,
      paidPrice: 176000,
      quantity: 2,
    },
  ])

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        id: Date.now().toString(),
        itemName: items[0]?.name || "Gold",
        units: "Tola",
        ratePerUnit: 0,
        paidPrice: 0,
        quantity: 1,
      },
    ])
  }

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...products]
    updatedProducts.splice(index, 1)
    setProducts(updatedProducts)
  }

  const handleProductChange = (index: number, field: keyof ProductItem, value: any) => {
    const updatedProducts = [...products]
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
    }

    // Auto-calculate paid price when rate or quantity changes
    if (field === "ratePerUnit" || field === "quantity") {
      updatedProducts[index].paidPrice = updatedProducts[index].ratePerUnit * updatedProducts[index].quantity
    }

    setProducts(updatedProducts)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(billNo, supplierName, products, description)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-auto">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-center">Add Purchase</h2>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Bill No.</label>
              <input
                type="text"
                value={billNo}
                onChange={(e) => setBillNo(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                placeholder="Enter bill number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Suppliers Name</label>
              <div className="relative">
                <select
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none appearance-none"
                >
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.name}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Icon icon="mdi:chevron-down" className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Product Information</h3>
              <button
                type="button"
                onClick={handleAddProduct}
                className="flex items-center text-white bg-[#DF8D28] px-3 py-1 rounded-md"
              >
                <Icon icon="mdi:plus" className="mr-1" /> Product
              </button>
            </div>

            {products.map((product, index) => (
              <div key={product.id} className="mb-6 border border-gray-100 rounded-md p-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Item Name</label>
                    <div className="relative">
                      <select
                        value={product.itemName}
                        onChange={(e) => handleProductChange(index, "itemName", e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none appearance-none"
                      >
                        {items.map((item) => (
                          <option key={item.id} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Icon icon="mdi:chevron-down" className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Units</label>
                    <input
                      type="text"
                      value={product.units}
                      onChange={(e) => handleProductChange(index, "units", e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none"
                      placeholder="Enter units"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Rate per unit</label>
                    <input
                      type="number"
                      value={product.ratePerUnit}
                      onChange={(e) =>
                        handleProductChange(index, "ratePerUnit", Number.parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Paid price (Rs.)</label>
                    <input
                      type="number"
                      value={product.paidPrice}
                      onChange={(e) => handleProductChange(index, "paidPrice", Number.parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(index, "quantity", Number.parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(index)}
                    className="text-[#DF8D28] border border-[#DF8D28] px-3 py-1 rounded-md hover:bg-[#DF8D28]/10"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none min-h-[100px]"
              placeholder="Enter Short Description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 border-t pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-3 bg-[#DF8D28] text-white rounded-md hover:bg-[#DF8D28]/90 font-medium"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddPurchaseModal

