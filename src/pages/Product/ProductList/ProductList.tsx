"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { get } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MasterTable from "../../../components/shared/MasterTable";
import Header from "../../../components/shared/table_heading/Header";
import {
  type IFetchProduct,
  type IParams,
  useDeleteProductsMutation,
  useGetAllProductCategoriesQuery,
  useGetAllProductsQuery,
  useUpdateProductsMutation,
} from "../../../server/api/productHooks";
import { updateProductState } from "../../../store/productStore";
import { productListColumns } from "../productObj";

const ProductList: React.FC = () => {
  // State for pagination parameters
  const [paginationParams, setPaginationParams] = useState<IParams>({
    page: 1,
    limit: 10,
  });

  const {
    data: productsList,
    isSuccess,
    isLoading,
  } = useGetAllProductsQuery(paginationParams);

  const { data: categories } = useGetAllProductCategoriesQuery();

  const categoryOptions = categories?.map((category) => ({
    label: category.name || "Unnamed Category",
    value: category._id || "0",
  }));

  const productsData = useMemo(
    () => (isSuccess && productsList?.products ? productsList.products : []),
    [isSuccess, productsList]
  );

  // Extract pagination data from API response
  const paginationData = useMemo(() => {
    if (productsList?.pagination) {
      return {
        currentPage: productsList.pagination.currentPage,
        totalPages: productsList.pagination.totalPages,
        totalCount: productsList.pagination.totalCount,
        limit: productsList.pagination.limit,
        hasNextPage: productsList.pagination.hasNextPage,
        hasPrevPage: productsList.pagination.hasPrevPage,
        nextPage: productsList.pagination.nextPage,
        prevPage: productsList.pagination.prevPage,
      };
    }
    return null;
  }, [productsList?.pagination]);

  const { mutate: deleteProduct } = useDeleteProductsMutation();
  const { mutate: updateProduct } = useUpdateProductsMutation();
  const navigate = useNavigate();

  // Pagination handlers
  const handlePageChange = useCallback((page: number, pageSize: number) => {
    setPaginationParams((prev) => ({
      ...prev,
      page: page + 1,
      limit: pageSize,
    }));
  }, []);

  const handleSearch = useCallback((searchTerm: string) => {
    setPaginationParams((prev) => ({
      ...prev,
      page: 1,
      search: searchTerm || undefined,
    }));
  }, []);

  const handleFilterChange = useCallback((filters: any) => {
    setPaginationParams((prev) => ({
      ...prev,
      page: 1,
      category: filters.category || undefined,
      isActive: filters.status || undefined,
      limit: paginationData?.limit || 50,
    }));
  }, []);

  const handleStatusToggle = async (productId: string, newStatus: boolean) => {
    const formData = new FormData();
    formData.append("isActive", newStatus.toString());
    updateProduct({
      id: productId,
      body: formData,
    });
  };

  const viewAction = useCallback((row: IFetchProduct) => {
    navigate(`/product/details/${row._id}`);
  }, []);

  const onEdit = useCallback((row: IFetchProduct) => {
    updateProductState(row);
    navigate(`/product/edit/${row._id}`);
  }, []);

  const tableData = productsData.map(
    (product: IFetchProduct, index: number) => {
      const currentPage = paginationData?.currentPage || 1;
      const limit = paginationData?.limit || 10;
      const serialNumber = (currentPage - 1) * limit + index + 1;

      return {
        ...product,
        sn: serialNumber,
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
                <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-transparent rounded-lg overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_API_IMAGE_BASE_URL}${
                        product.images[0]
                      }`}
                      alt="product image preview"
                      className="h-48 object-contain"
                      style={{ width: "500px" }}
                    />
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
                <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    <div
                      className="h-48 bg-gray-100 flex items-center justify-center"
                      style={{ width: "500px" }}
                    >
                      <span className="text-gray-400 text-sm">
                        No image available
                      </span>
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
        video: (
          <div className="size-12 text-center group cursor-pointer relative">
            {product.video && product.video.length > 0 ? (
              <>
                {(() => {
                  const videoPath = product.video[0];
                  const cleanVideoPath = videoPath.startsWith("/ridisidi/")
                    ? videoPath.substring("/ridisidi/".length)
                    : videoPath.startsWith("/")
                    ? videoPath.substring(1)
                    : videoPath;
                  const baseUrl =
                    import.meta.env.VITE_API_LOCAL_URL ||
                    "http://localhost:8080/api/v1/en/";
                  const videoStreamUrl = `${baseUrl}video/stream/${cleanVideoPath}`;

                  return (
                    <video
                      src={videoStreamUrl}
                      className="w-full h-full rounded-sm object-cover aspect-square transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:rounded-md"
                      preload="metadata"
                      muted
                      onError={(e) => {
                        console.error("Video loading error:", e);
                      }}
                    />
                  );
                })()}
              </>
            ) : (
              <>
                <div className="w-full h-full rounded-sm bg-gray-100 flex items-center justify-center aspect-square">
                  <span className="text-gray-400 text-xs">No video</span>
                </div>
              </>
            )}
          </div>
        ),
        product: get(product, "name", ""),
        categ:
          product.productType !== "normal"
            ? get(product, "category.name", "-")
            : "-",
        subCate:
          product.productType !== "normal"
            ? get(product, "subCategory.name", "-")
            : "-",
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
      };
    }
  );

  // Note: You'll need to fetch categories from your API
  // For now, using placeholder data - replace with actual category data
  const filterConfig = [
    {
      key: "category",
      label: "Category",
      type: "select" as const,
      placeholder: "All Categories",
      options: categoryOptions || [],
    },
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      placeholder: "All Status",
      options: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
    },
  ];
  // </CHANGE>

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
          apiPagination={true}
          totalItems={paginationData?.totalCount || 0}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          entriesPerPage={paginationData?.limit || 10}
          filterConfig={filterConfig}
          onFilterChange={handleFilterChange}
        />
      </div>
    </div>
  );
};

export default React.memo(ProductList);
