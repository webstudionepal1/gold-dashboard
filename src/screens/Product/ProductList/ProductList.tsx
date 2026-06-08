import { Icon } from "@iconify/react/dist/iconify.js";
import { get } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MasterTable from "../../../components/shared/MasterTable";
import Header from "../../../components/shared/table_heading/Header";
import { ScrollableModal } from "../../../components/shared/ScrollableModal";
import {
  type IFetchProduct,
  type IParams,
  useDeleteProductsMutation,
  useGetAllProductCategoriesQuery,
  useGetAllProductTypesQuery,
  useGetAllProductsQuery,
  useUpdateProductsMutation,
} from "../../../server/api/productHooks";
import { updateProductState } from "../../../store/productStore";
import { resolveMediaUrl } from "../../../utils/media";
import { getApiBaseUrl } from "../../../utils/apiBase";
import { productListColumns } from "../productObj";
import VisibleAsCell from "./component/VisibleAsCell";

const ProductList: React.FC = () => {
  // State for pagination parameters
  const [paginationParams, setPaginationParams] = useState<IParams>({
    page: 1,
    limit: 10,
  });

  // Video modal state (SAME AS BANNER)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string | null;
    title: string | null;
  }>({ url: null, title: null });

  const {
    data: productsList,
    isSuccess,
    isLoading,
  } = useGetAllProductsQuery(paginationParams);

  const { data: categories } = useGetAllProductCategoriesQuery();
  const { data: productTypes } = useGetAllProductTypesQuery();

  const categoryOptions = categories?.map((category) => ({
    label: category.name || "Unnamed Category",
    value: category._id || "0",
  }));

  const productTypeOptions =
    productTypes?.map((type) => ({
      label: type.name,
      value: type.slug,
    })) || [
      { label: "Gold", value: "gold" },
      { label: "Silver", value: "silver" },
      { label: "Diamond", value: "diamond" },
      { label: "Astral Gems", value: "astral_gems" },
    ];

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

  const [savingVisibility, setSavingVisibility] = useState<string | null>(null);

  const { mutate: deleteProduct } = useDeleteProductsMutation();
  const { mutate: updateProduct } = useUpdateProductsMutation();
  const navigate = useNavigate();

  // VIDEO CLICK HANDLER (SAME AS BANNER)
  const handleVideoClick = (videoUrl: string, title: string) => {
    console.log("Video clicked:", { videoUrl, title });
    setSelectedVideo({ url: videoUrl, title });
    setIsVideoModalOpen(true);
  };

  // VIDEO STREAM TEST (SAME AS BANNER)
  const testVideoStream = async (videoPath: string) => {
    try {
      const cleanPath = videoPath.startsWith("/ridisidi/")
        ? videoPath.substring("/ridisidi/".length)
        : videoPath.startsWith("/")
        ? videoPath.substring(1)
        : videoPath;

      const testUrl = `${getApiBaseUrl()}video/test/${cleanPath}`;
      console.log("Testing video stream:", testUrl);

      const response = await fetch(testUrl);
      const result = await response.json();
      console.log("Video test result:", result);

      return result.success;
    } catch (error) {
      console.error("Video test error:", error);
      return false;
    }
  };

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
      productType: filters.productType || undefined,
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

  const handleVisibilityChange = (productId: string, newValue: string) => {
    setSavingVisibility(productId);
    const formData = new FormData();
    formData.append("visibleAs", newValue);
    updateProduct(
      { id: productId, body: formData },
      { onSettled: () => setSavingVisibility(null) }
    );
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
                  src={resolveMediaUrl(product.images[0])}
                  alt="product image"
                  className="w-full h-full rounded-sm object-cover aspect-square transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:rounded-md"
                />
                <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-transparent rounded-lg overflow-hidden">
                    <img
                      src={resolveMediaUrl(product.images[0])}
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
                  const videoStreamUrl = resolveMediaUrl(product.video[0]);

                  return (
                    <video
                      src={videoStreamUrl}
                      width={48}
                      height={48}
                      className="w-full h-full rounded-sm object-cover aspect-square  duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                      preload="metadata"
                      muted
                      onClick={() =>
                        handleVideoClick(videoStreamUrl, product.name || "")
                      }
                      onError={async (e) => {
                        console.error("Video loading error:", e);
                        console.log("Video URL:", videoStreamUrl);
                        console.log("Original item:", videoPath);

                        // Test if video exists
                        const exists = await testVideoStream(videoPath);
                        if (!exists) {
                          console.error(
                            "Video file does not exist or is not accessible"
                          );
                        }
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
        visibleAs: (
          <VisibleAsCell
            productId={product._id}
            visibleAs={product.visibleAs}
            onSave={handleVisibilityChange}
            saving={savingVisibility === product._id}
          />
        ),
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

  // Filter config
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
    {
      key: "productType",
      label: "Product Type",
      type: "select" as const,
      placeholder: "All Products",
      options: productTypeOptions,
    },
  ];

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

      {/* VIDEO MODAL (EXACTLY LIKE BANNER) */}
      {isVideoModalOpen && selectedVideo.url && (
        <ScrollableModal
          classname="w-[50%] max-w-xl"
          onClose={() => setIsVideoModalOpen(false)}
        >
          <div className="bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-2 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">
                {selectedVideo.title || "Product Video"}
              </h2>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="hover:text-red-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-100 transition-colors"
                title="Close"
              >
                <Icon icon="material-symbols:close" width="16" height="16" />
              </button>
            </div>
            <div className="p-4 flex justify-center">
              <video
                src={selectedVideo.url}
                controls
                className="max-w-full max-h-[70vh] rounded-md shadow-md"
                preload="metadata"
              />
            </div>
          </div>
        </ScrollableModal>
      )}
    </div>
  );
};

export default React.memo(ProductList);
