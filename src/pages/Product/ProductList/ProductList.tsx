import { Icon } from "@iconify/react/dist/iconify.js";
import { get } from "lodash";
import React, { useCallback, useMemo, useState, useEffect } from "react";
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

// Filter state interface
// interface FilterState {
//   searchQuery: string;
//   filterValue: string;
//   sortValue: string;
// }

// Custom hook for debounced search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ProductList: React.FC = () => {
  const { data: productsList, isSuccess, isLoading } = useGetAllProductsQuery();
  const productsData = useMemo(
    () => (isSuccess && productsList ? productsList : []),
    [isSuccess, productsList]
  );
  const { mutate: deleteProduct } = useDeleteProductsMutation();
  const { mutate: updateProduct } = useUpdateProductsMutation();
  const navigate = useNavigate();

  // const handleStatusToggle = async (productId: string, newStatus: boolean) => {
  //   const product = productsList?.find((product) => product._id === productId);
  //   if (product) {
  //     updateProduct({
  //       id: productId,
  //       body: {
  //         ...product,
  //         isActive: newStatus,
  //       },
  //     });
  //   }
  // };

  // const handleStatusToggle = async (productId: string, newStatus: boolean) => {
  //   const product = productsList?.find((product) => product._id === productId);
  //   if (product) {
  //     const formData = new FormData();
  //     // Append required fields from IFetchProduct
  //     formData.append("name", product.name);
  //     formData.append("ratings", product.ratings.toString());
  //     formData.append("description", product.description);
  //     formData.append("category", product.category._id); // Assuming category is an object with _id
  //     formData.append("subCategory", product.subCategory._id); // Assuming subCategory is an object with _id
  //     product.variant.forEach((v, index) => {
  //       formData.append(`variant[${index}][price]`, v.price.toString());
  //       formData.append(`variant[${index}][wt]`, v.wt.toString());
  //       formData.append(`variant[${index}][unit]`, v.unit);
  //       formData.append(
  //         `variant[${index}][totalStock]`,
  //         v.totalStock.toString()
  //       );
  //       formData.append(`variant[${index}][usedStock]`, v.usedStock.toString());
  //       formData.append(
  //         `variant[${index}][remainingStock]`,
  //         v.remainingStock.toString()
  //       );
  //       formData.append(
  //         `variant[${index}][reorderPoint]`,
  //         v.reorderPoint.toString()
  //       );
  //     });
  //     formData.append("makingCharges", product.makingCharges.toString());
  //     formData.append("length", product.length.toString());
  //     formData.append("claspType", product.claspType._id); // Assuming claspType is an object with _id
  //     formData.append("rhodoumFinishes", product.rhodoumFinishes.toString());
  //     formData.append("shape", product.shape);
  //     formData.append("quantity", product.quantity.toString());
  //     formData.append("totalCarat", product.totalCarat.toString());
  //     formData.append("color", product.color);
  //     formData.append("clarity", product.clarity);
  //     formData.append("dimension", product.dimension.toString());
  //     product.tags.forEach((tag, index) =>
  //       formData.append(`tags[${index}]`, tag)
  //     );
  //     formData.append("visibleAs", product.visibleAs);
  //     product.images.forEach((image, index) =>
  //       formData.append(`images[${index}]`, image)
  //     );
  //     // Append isActive (assuming the API expects it)
  //     formData.append("isActive", newStatus.toString());

  //     updateProduct({
  //       id: productId,
  //       body: formData,
  //     });
  //   }
  // };

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

  // Consolidated filter state
  // const [filterState, setFilterState] = useState<FilterState>({
  //   searchQuery: "",
  //   filterValue: "",
  //   sortValue: "",
  // });
  const viewAction = useCallback((row: IFetchProduct) => {
    navigate(`/product/details/${row._id}`);
  }, []);
  const onEdit = useCallback((row: IFetchProduct) => {
    updateProductState(row);
    navigate(`/product/edit/${row._id}`);
  }, []);
  // const filteredProducts = useMemo(() => {
  //   if (!productsData || productsData.length === 0) return [];

  //   let result = [...productsData];

  //   // Apply search
  //   if (filterState.searchQuery) {
  //     const query = filterState.searchQuery.toLowerCase();
  //     result = result.filter(
  //       (item) =>
  //         (item.name && item.name.toLowerCase().includes(query)) ||
  //         (typeof item.category === "string" &&
  //           item.category.toLowerCase().includes(query)) ||
  //         (item.description && item.description.toLowerCase().includes(query))
  //     );
  //   }

  //   // Apply filter
  //   if (filterState.filterValue) {
  //     result = result.filter(
  //       (item) =>
  //         (typeof item.category === "string" &&
  //           item.category === filterState.filterValue) ||
  //         (item.visibleAs && item.visibleAs === filterState.filterValue)
  //     );
  //   }

  //   // Apply sort
  //   if (filterState.sortValue) {
  //     switch (filterState.sortValue) {
  //       case "title_asc":
  //         result.sort((a, b) =>
  //           a.name && b.name ? a.name.localeCompare(b.name) : 0
  //         );
  //         break;
  //       case "title_desc":
  //         result.sort((a, b) =>
  //           a.name && b.name ? b.name.localeCompare(a.name) : 0
  //         );
  //         break;
  //       case "price_asc":
  //         result.sort((a, b) => (a.price && b.price ? a.price - b.price : 0));
  //         break;
  //       case "price_desc":
  //         result.sort((a, b) => (a.price && b.price ? b.price - a.price : 0));
  //         break;
  //       case "rating_asc":
  //         result.sort((a, b) =>
  //           a.ratings && b.ratings ? a.ratings - b.ratings : 0
  //         );
  //         break;
  //       case "rating_desc":
  //         result.sort((a, b) =>
  //           a.ratings && b.ratings ? b.ratings - a.ratings : 0
  //         );
  //         break;
  //     }
  //   }

  //   return result;
  // }, [productsData, filterState]);

  // const handleSearch = (query: string) => {
  //   setFilterState((prev) => ({ ...prev, searchQuery: query }));
  // };

  // const handleFilter = (filter: string) => {
  //   setFilterState((prev) => ({ ...prev, filterValue: filter }));
  // };

  // const handleSort = (sort: string) => {
  //   setFilterState((prev) => ({ ...prev, sortValue: sort }));
  // };

  // const handleCardClick = (product: IFetchProduct) => {
  //   navigate(`/product/${product._id}`, { state: { product } });
  // };

  // if (isLoading) {
  //   return <Icon icon="svg-spinners:ring-resize" width="24" height="24" />;
  // }

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
    price: get(product, "price", 0),
    stock: get(product, "variant[0].remainingStock", 0),
    sold: get(product, "variant[0].usedStock", 0),
    status: (
      <StatusSwitch
        isActive={get(product, "isActive", true)}
        onToggle={(newStatus) => handleStatusToggle(product._id, newStatus)}
      />
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
          // filterSection={
          //   <SearchFilterSort
          //     onSearch={handleSearch}
          //     onFilter={handleFilter}
          //     onSort={handleSort}
          //     onViewChange={() => {}}
          //     showFilter={true}
          //     showSort={true}
          //     showView={true}
          //     filterOptions={filterOptions}
          //     sortOptions={sortOptions}
          //     placeholder="Search products..."
          //   />
          // }
          rows={tableData}
          showAction
        />
      </div>
    </div>
  );
};

export default React.memo(ProductList);
