import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchFilterSort } from "../../../components/global/SearchFilterSort";
import { filterOptions, sortOptions } from "../../../constants/DropDownOptions";
import {
  IFetchProduct,
  useDeleteProductsMutation,
  useGetAllProductsQuery,
} from "../../../server/api/productHooks";
import { ProductGridView } from "./component/GridView";
import { Table } from "../../../components/shared";
import { updateProductState } from "../../../store/productStore";
import { get } from "lodash";
import MasterTable from "../../../components/shared/MasterTable";
import Header from "../../../components/shared/table_heading/Header";

// Filter state interface
interface FilterState {
  searchQuery: string;
  filterValue: string;
  sortValue: string;
}

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
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: "",
    filterValue: "",
    sortValue: "",
  });

  // Debounce search query for better performance
  const debouncedSearchQuery = useDebounce(filterState.searchQuery, 300);
  const onEdit = useCallback((row: IFetchProduct) => {
    updateProductState(row);
    navigate(`/product/edit`);
  }, []);
  // Optimized filtering with debounced search
  const filteredProducts = useMemo(() => {
    if (!productsData || productsData.length === 0) return [];

    let result = [...productsData];

    // Apply debounced search
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          (item.name && item.name.toLowerCase().includes(query)) ||
          (typeof item.category === "string" &&
            item.category.toLowerCase().includes(query)) ||
          (item.description && item.description.toLowerCase().includes(query))
      );
    }

    // Apply filter
    if (filterState.filterValue) {
      result = result.filter(
        (item) =>
          (typeof item.category === "string" &&
            item.category === filterState.filterValue) ||
          (item.visibleAs && item.visibleAs === filterState.filterValue)
      );
    }

    // Apply sort with optimized sorting
    if (filterState.sortValue) {
      switch (filterState.sortValue) {
        case "title_asc":
          result.sort((a, b) =>
            a.name && b.name ? a.name.localeCompare(b.name) : 0
          );
          break;
        case "title_desc":
          result.sort((a, b) =>
            a.name && b.name ? b.name.localeCompare(a.name) : 0
          );
          break;
        case "price_asc":
          result.sort((a, b) => {
            const aPrice = a.variants?.[0]?.price || 0;
            const bPrice = b.variants?.[0]?.price || 0;
            return aPrice - bPrice;
          });
          break;
        case "price_desc":
          result.sort((a, b) => {
            const aPrice = a.variants?.[0]?.price || 0;
            const bPrice = b.variants?.[0]?.price || 0;
            return bPrice - aPrice;
          });
          break;
        case "rating_asc":
          result.sort((a, b) => {
            const aRating = a.averageRating || 0;
            const bRating = b.averageRating || 0;
            return aRating - bRating;
          });
          break;
        case "rating_desc":
          result.sort((a, b) => {
            const aRating = a.averageRating || 0;
            const bRating = b.averageRating || 0;
            return bRating - aRating;
          });
          break;
      }
    }

    return result;
  }, [productsData, debouncedSearchQuery, filterState.filterValue, filterState.sortValue]);

  const handleSearch = (query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query }));
  };

  const handleFilter = (filter: string) => {
    setFilterState((prev) => ({ ...prev, filterValue: filter }));
  };

  const handleSort = (sort: string) => {
    setFilterState((prev) => ({ ...prev, sortValue: sort }));
  };

  const handleCardClick = useCallback((product: IFetchProduct) => {
    navigate(`/product/${product._id}`, { state: { product } });
  }, [navigate]);

  // Memoize table columns to prevent unnecessary re-renders
  const columns = useMemo(() => [
    {
      title: "Product",
      key: "product",
    },
    {
      title: "Category",
      key: "category",
    },
    {
      title: "Sub Category",
      key: "subCategory",
    },
    {
      title: "Price",
      key: "price",
    },
    {
      title: "Stock",
      key: "stock",
    },
  ], []);

  // Memoize table data transformation
  const tableData = useMemo(() => filteredProducts.map((product) => ({
    ...product,
    product: get(product, "name", ""),
    category: get(product, "category.name", ""),
    subCategory: get(product, "subCategory.name", ""),
    price: get(product, "variants[0].price", 0),
    stock: get(product, "variants[0].stockQuantity", "-"),
  })), [filteredProducts]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icon icon="svg-spinners:ring-resize" width="24" height="24" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-auto">
      <Header text="Products">
        <Link to="/product/add">
          <button className="bg-[#DF8D28] hover:bg-[#DF8D28]/90 text-sm text-white px-4 py-2 flex rounded-lg transition-colors duration-200">
            <Icon icon="ic:outline-add" fontSize={18} />
            New Product
          </button>
        </Link>
      </Header>
      <div className="p-4">
        <MasterTable
          columns={columns}
          onDelete={(id) => deleteProduct(id)}
          editAction={onEdit}
          filterSection={
            <SearchFilterSort
              onSearch={handleSearch}
              onFilter={handleFilter}
              onSort={handleSort}
              onViewChange={() => {}}
              showFilter={true}
              showSort={true}
              showView={true}
              filterOptions={filterOptions}
              sortOptions={sortOptions}
              placeholder="Search products..."
            />
          }
          rows={tableData}
          showAction
        />
      </div>
    </div>
  );
};

export default React.memo(ProductList);
