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
    () => (isSuccess ? productsList : []),
    [isSuccess, productsList]
  );
  const { mutate: deleteProduct } = useDeleteProductsMutation();
  const navigate = useNavigate();

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
    navigate(`/product/edit`);
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
