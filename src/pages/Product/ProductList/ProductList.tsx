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
      <div className="size-6 text-center">
        {product.images && product.images.length > 0 ? (
          <img
            src={`${import.meta.env.VITE_API_IMAGE_BASE_URL}${
              product.images[0]
            }`}
            alt="product image"
            className="w-full h-full rounded-sm object-fit aspect-square"
          />
        ) : (
          <img
            src="/no-image.png"
            alt="product image"
            className="w-full h-full rounded-sm object-fit aspect-square"
          />
        )}
      </div>
    ),
    product: get(product, "name", ""),
    categ: get(product, "category.name", ""),
    subCate: get(product, "subCategory.name", ""),
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
