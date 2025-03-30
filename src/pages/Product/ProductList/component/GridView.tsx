import { Icon } from "@iconify/react/dist/iconify.js"
import ArrowIcon from "./ArrowIcon"

interface propTypes{
    filteredData: any
    handleCardClick: (product: any) => void
}

export const ProductGridView = ({filteredData,handleCardClick}:propTypes) => {
   return <div className='grid grid-cols-4 w-auto gap-3'>
                       {filteredData.map((product:any) => (
                           <div
                               key={product.id}
                               className="bg-white rounded-sm overflow-hidden h-80 flex flex-col cursor-pointer hover:shadow-md transition-shadow"
                               onClick={() => handleCardClick(product)}
                           >
                               <div className='flex justify-between my-4'>
                                   <div className="flex flex-col gap-6">
                                       <ArrowIcon />
                                   </div>
                                   <span className="text-xs text-white font-medium rounded-sm bg-lightbrown py-1 px-2">Sale</span>
                               </div>
                               <img
                                   src={product.image || "/placeholder.svg"}
                                   alt={product.title}
                                   className="object-contain w-auto h-auto"
                               />
                               <span className="text-sm font-medium text-brown bg-brown bg-opacity-'status bg-opacity-40 flex justify-center">
                                   {product.category}
                               </span>
                               <div className="flex justify-between px-2 items-center mb-2">
                                   <h3 className="text-md font-medium text-black">{product.title}</h3>
                                   <div className="flex">
                                       {[...Array(5)].map((_, i) => (
                                           <Icon
                                               key={i}
                                               icon={i < product.rating ? "mdi:star" : "mdi:star-outline"}
                                               className={`w-4 h-4 ${i < product.rating ? "text-yellow" : "text-gray-300"}`}
                                           />
                                       ))}
                                   </div>
                               </div>
                               <div className="flex items-center gap-x-2">
                                   <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                                   {product.onSale && (
                                       <span className="text-[#C2BDBA] line-through text-sm">
                                           ${product.originalPrice.toFixed(2)}
                                       </span>
                                   )}
                               </div>
                           </div>
                       ))}
                   </div>
}