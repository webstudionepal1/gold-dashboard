import { Product } from "../../../../../types/Products.interface";

export const Inventory: React.FC<{ inventory?: Product["inventory"] }> = ({ inventory }) => (
    <div className="space-y-2">
        <h3 className="text-sm font-semibold">Inventory</h3>
        <div className="grid grid-cols-3 gap-4">
            {["Product SKU", "Stock QTY", "Reorder Level"].map((label, index) => (
                <div key={label}>
                    <p className="text-xs text-gray-500">{label}:</p>
                    <p className="font-medium">{inventory ? [inventory.sku, inventory.stockQty, inventory.reorderLevel][index] : "N/A"}</p>
                </div>
            ))}
        </div>
    </div>
)