import { Icon } from "@iconify/react/dist/iconify.js";
import { get } from "lodash";
import { X } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MasterTable from "../../../components/shared/MasterTable";
import Header from "../../../components/shared/table_heading/Header";
import {
  IFetchProduct,
  useDeleteProductsMutation,
  useGetAllProductsQuery,
  useUpdateProductsMutation,
} from "../../../server/api/productHooks";
import { updateProductState } from "../../../store/productStore";
import { productListColumns } from "../productObj";

const ProductList: React.FC = () => {
  const { data: productsList, isSuccess, isLoading } = useGetAllProductsQuery();
  const productsData = useMemo(
    () => (isSuccess && productsList ? productsList : []),
    [isSuccess, productsList]
  );
  const { mutate: deleteProduct } = useDeleteProductsMutation();
  const { mutate: updateProduct } = useUpdateProductsMutation();
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleStatusToggle = async (productId: string, newStatus: boolean) => {
    const formData = new FormData();
    formData.append("isActive", newStatus.toString());
    updateProduct(
      {
        id: productId,
        body: formData,
      },
    );
  };

  const viewAction = useCallback((row: IFetchProduct) => {
    navigate(`/product/details/${row._id}`);
  }, []);
  const onEdit = useCallback((row: IFetchProduct) => {
    updateProductState(row);
    navigate(`/product/edit/${row._id}`);
  }, []);

  const tableData = productsData.map((product, index) => ({
    ...product,
    sn: index + 1,

    image: (
      <div
        onMouseEnter={() =>
          setPreviewImage(
            product.images && product.images.length > 0
              ? `${import.meta.env.VITE_API_IMAGE_BASE_URL}${product.images[0]}`
              : "/no-image.png"
          )
        }
        // onMouseLeave={() => setPreviewImage(null)}
        className="size-6 text-center mx-auto"
      >
        {product.images && product.images.length > 0 ? (
          <img
            src={`${import.meta.env.VITE_API_IMAGE_BASE_URL}${
              product.images[0]
            }`}
            alt={"product image"}
            className="w-full h-full rounded-sm object fite aspect-square"
          />
        ) : (
          <img
            src={"/no-image.png"}
            alt={"product image"}
            className="w-full h-full rounded-sm object fite aspect-square"
          />
        )}
      </div>
    ),
    product: get(product, "name", ""),
    categ: get(product, "category.name", ""),
    subCate: get(product, "subCategory.name", ""),
    price: get(product, "price", 0),
    stock: get(product, "variant[0].remainingStock", 0),
    sold: get(product, "variant[0].usedStock", 0),
    status: (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          get(product, "isActive", true)
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {get(product, "isActive", true) ? "Active" : "Inactive"}
      </span>
    ),
  }));

  return (
    <div className="">
      <Header text="Products">
        <Link to="/product/add">
          <button className="bg-[#DF8D28] hover:bg-[#DF8D28]/90 text-sm text-white px-4 py-2 flex rounded-lg transition-colors duration-200">
            <Icon icon="ic:outline-add" fontSize={18} />
            New Product
          </button>
        </Link>
      </Header>
      <div className="p-4 bg-white border-2 rounded-lg">
        <MasterTable
          columns={productListColumns}
          onDelete={(id) => deleteProduct(id)}
          editAction={onEdit}
          viewAction={viewAction}
          loading={isLoading}
          showAction={true}
          toggleAction={(row) => {
            handleStatusToggle(row._id, !row.isActive);
          }}
          rows={tableData}
        />
        {previewImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn"
            onClick={() => setPreviewImage(null)} 
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewImage(null);
              }}
            >
              <X size={24} />
            </button>

            <img
              src={previewImage}
              alt="preview"
              className="max-w-[80%] max-h-[80%] object-contain rounded-lg shadow-lg transform transition-transform duration-300 ease-out scale-95 hover:scale-100"
              onClick={(e) => e.stopPropagation()} // Don't close when clicking the image
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ProductList);
