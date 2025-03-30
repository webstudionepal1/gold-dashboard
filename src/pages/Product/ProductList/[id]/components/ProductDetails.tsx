import { Product } from "../../../../../types/Products.interface"
import { DropdownSection } from "./DropDownSection"
import { Inventory } from "./Inventory"

export const ProductDetails: React.FC<{
    product: Product
    isSpecsOpen: boolean
    isNaturalOpen: boolean
    toggleSpecs: () => void
    toggleNatural: () => void
}> = ({ product, isSpecsOpen, isNaturalOpen, toggleSpecs, toggleNatural }) => (
    <div className="space-y-4 rounded-md bg-white p-4">
        <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
                <span className="rounded bg-amber-500 px-2 py-1 text-xs text-white">{product.status}</span>
            </div>
            <p className="text-sm font-semibold text-amber-500">{product.category}</p>
        </div>
        <p className="text-xs text-gray-600">{product.description}</p>
        <div className="flex gap-2">
            {product.tags?.map((tag, index) => (
                <span key={index} className="text-xs text-gray-500">
                    #{tag.replace(/\s+/g, "")}
                </span>
            ))}
        </div>
        <div className="flex items-center gap-3 py-4">
            <span className="text-md font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && <span className="text-xs text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>}
        </div>
        <Inventory inventory={product.inventory} />
        <DropdownSection title="Specifications" isOpen={isSpecsOpen} toggle={toggleSpecs} data={product.specifications} />
        <DropdownSection title="Natural Gold Information" isOpen={isNaturalOpen} toggle={toggleNatural} data={product.natural} />
    </div>
)