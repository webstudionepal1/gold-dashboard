import { Icon } from "@iconify/react/dist/iconify.js";
import { get } from "lodash";
import React, { useCallback, useMemo } from "react";
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
import { StatusSwitch } from "../../../components/shared/StatusSwitch";

const ProductList: React.FC = () => {
  const {
    data: productsList,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useGetAllProductsQuery({ includeAll: true });
  const productsData = useMemo(
    () => (isSuccess && Array.isArray(productsList) ? productsList : []),
    [isSuccess, productsList]
  );
  const { mutate: deleteProduct } = useDeleteProductsMutation();
  const { mutate: updateProduct } = useUpdateProductsMutation();
  const navigate = useNavigate();

  const viewAction = useCallback((row: IFetchProduct) => {
    navigate(`/product/details/${row._id}`);
  }, []);
  const onEdit = useCallback((row: IFetchProduct) => {
    updateProductState(row);
    navigate(`/product/edit`);
  }, []);

  const handleStatusToggle = async (productId: string, newStatus: boolean) => {
    console.log(
      "Toggling status for productId:",
      productId,
      "newStatus:",
      newStatus
    );
    const formData = new FormData();
    formData.append("isActive", newStatus.toString());
    updateProduct(
      {
        id: productId,
        body: formData,
      },
      {
        onError: (err) => console.error("Update failed:", err),
      }
    );
  };

  const tableData = productsData.map((product, index) => ({
    ...product,
    sn: index + 1,
    image: (
      <div className="size-12 text-center group cursor-pointer relative">
        {product.images && product.images.length > 0 ? (
          <>
            <img
              src={`${import.meta.env.VITE_API_IMAGE_BASE_URL}${
                product.images[0]
              }`}
              alt="product image"
              className="w-full h-full rounded-sm object-cover aspect-square transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:rounded-md"
            />
            {/* Large preview on hover */}
            <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <img
                  src={`${import.meta.env.VITE_API_IMAGE_BASE_URL}${
                    product.images[0]
                  }`}
                  alt="product image preview"
                  className="h-48 object-contain"
                  style={{ width: '500px' }}
                />
                <div className="p-2 text-xs text-gray-600 bg-gray-50">
                  {product.name}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <img
              src="/no-image.png"
              alt="product image"
              className="w-full h-full rounded-sm object-cover aspect-square transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:rounded-md opacity-60"
            />
            {/* No image preview */}
            <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 bg-gray-100 flex items-center justify-center" style={{ width: '500px' }}>
                  <span className="text-gray-400 text-sm">No image available</span>
                </div>
                <div className="p-2 text-xs text-gray-600 bg-gray-50">
                  {product.name}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    ),
    product: get(product, "name", ""),
    categ: get(product, "category.name", ""),
    material: get(product, "material", ""),
    stock: get(product, "variant[0].remainingStock", 0),
    sold: get(product, "variant[0].usedStock", 0),
    status: (
      <StatusSwitch
        isActive={get(product, "isActive", true)}
        onToggle={(newStatus) => handleStatusToggle(product._id, newStatus)}
      />
    ),
  }));

  if (isError) {
    return (
      <div className="p-4">
        <Header text="Products" />
        <div className="text-red-500">
          Error loading products:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </div>
    );
  }

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
          rows={tableData}
          showAction
        />
      </div>
    </div>
  );
};

export default ProductList;
