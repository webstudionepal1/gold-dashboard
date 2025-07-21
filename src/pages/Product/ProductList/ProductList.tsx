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
} from "../../../server/api/productHooks";
import { updateProductState } from "../../../store/productStore";
import { productListColumns } from "../productObj";

const ProductList: React.FC = () => {
  const { data: productsList, isSuccess, isLoading } = useGetAllProductsQuery();
  const productsData = useMemo(
    () => (isSuccess ? productsList : []),
    [isSuccess, productsList]
  );
  const { mutate: deleteProduct } = useDeleteProductsMutation();
  const navigate = useNavigate();

  const viewAction = useCallback((row: IFetchProduct) => {
    navigate(`/product/details/${row._id}`);
  }, []);
  const onEdit = useCallback((row: IFetchProduct) => {
    updateProductState(row);
    navigate(`/product/edit`);
  }, []);

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
    stock: get(product, "variant[0].remainingStock", 0),
    sold: get(product, "variant[0].usedStock", 0),
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
          rows={tableData}
          showAction
        />
      </div>
    </div>
  );
};

export default ProductList;
