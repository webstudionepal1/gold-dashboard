// import { useState, useEffect, useMemo } from "react";
// import { Link } from "react-router-dom";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import Header from "../../components/shared/table_heading/Header";
// import { SearchFilterSort } from "../../components/global/SearchFilterSort";
// import MasterTable from "../../components/shared/MasterTable";
// import {
//   useGetAllProductsQuery,
//   IFetchProduct,
// } from "../../server/api/productHooks";
// import { columns } from "./inventoryObj";

// // Types
// interface InventoryItem {
//   _id: string;
//   name: string;
//   totalStock: number;
//   remainingStock: number;
//   usedStock: number;
//   unit: string;
//   reorder_point: number;
//   status: "On Stock" | "Low Stock" | "Out of Stock";
//   image?: string;
//   category?: string;
//   subCategory?: string;
//   price?: number;
//   wt?: number;
// }

// type SortOption =
//   | "name-asc"
//   | "name-desc"
//   | "price-high"
//   | "price-low"
//   | "weight-high"
//   | "weight-low"
//   | "stock-high"
//   | "stock-low";

// // Constants
// const STATUS_OPTIONS = [
//   { value: "", label: "All Status" },
//   { value: "On Stock", label: "On Stock" },
//   { value: "Low Stock", label: "Low Stock" },
//   { value: "Out of Stock", label: "Out of Stock" },
// ];

// const SORT_OPTIONS = [
//   { value: "", label: "Default" },
//   { value: "name-asc", label: "Name (A-Z)" },
//   { value: "name-desc", label: "Name (Z-A)" },
//   { value: "price-high", label: "Price (High-Low)" },
//   { value: "price-low", label: "Price (Low-High)" },
//   { value: "weight-high", label: "Weight (High-Low)" },
//   { value: "weight-low", label: "Weight (Low-High)" },
//   { value: "stock-high", label: "Stock (High-Low)" },
//   { value: "stock-low", label: "Stock (Low-High)" },
// ];

// // Utility functions
// const getStockStatus = (
//   remainingStock: number,
//   totalStock: number,
//   reorderPoint?: number
// ): InventoryItem["status"] => {
//   if (remainingStock <= 0) return "Out of Stock";
//   const threshold = reorderPoint || Math.floor(totalStock * 0.2);
//   return remainingStock <= threshold ? "Low Stock" : "On Stock";
// };

// const extractCategoryName = (category: any): string => {
//   return typeof category === "object" && category && "name" in category
//     ? (category.name as string)
//     : "";
// };

// const transformProductToInventoryItems = (
//   product: IFetchProduct
// ): InventoryItem[] => {
//   const categoryName = extractCategoryName(product.category);
//   const subCategoryName = extractCategoryName(product.subCategory);
//   const productImage = product.images?.[0];

//   // Handle products without variants
//   if (!product.variant?.length) {
//     return [
//       {
//         _id: product._id || "",
//         name: product.name || "",
//         totalStock: 0,
//         remainingStock: 0,
//         usedStock: 0,
//         unit: "",
//         reorder_point: 0,
//         status: "Out of Stock",
//         image: productImage,
//         category: categoryName,
//         subCategory: subCategoryName,
//         price: 0,
//         wt: 0,
//       },
//     ];
//   }

//   // Combine all variants into a single inventory item
//   const combinedData = product.variant.reduce(
//     (acc, variant) => {
//       acc.totalStock += variant.totalStock || 0;
//       acc.remainingStock += variant.remainingStock || 0;
//       acc.usedStock += variant.usedStock || 0;
//       acc.totalWeight += variant.wt || 0;
//       acc.reorderPoints.push(variant.reorderPoint || 0);

//       // Collect unique units
//       if (variant.unit && !acc.units.includes(variant.unit)) {
//         acc.units.push(variant.unit);
//       }

//       // Keep track of price range (min and max)
//       const price = variant.price || 0;
//       if (price > 0) {
//         acc.minPrice =
//           acc.minPrice === 0 ? price : Math.min(acc.minPrice, price);
//         acc.maxPrice = Math.max(acc.maxPrice, price);
//       }

//       return acc;
//     },
//     {
//       totalStock: 0,
//       remainingStock: 0,
//       usedStock: 0,
//       totalWeight: 0,
//       units: [] as string[],
//       reorderPoints: [] as number[],
//       minPrice: 0,
//       maxPrice: 0,
//     }
//   );

//   // Calculate combined reorder point (average of all variant reorder points)
//   const avgReorderPoint =
//     combinedData.reorderPoints.length > 0
//       ? Math.round(
//           combinedData.reorderPoints.reduce((sum, point) => sum + point, 0) /
//             combinedData.reorderPoints.length
//         )
//       : Math.floor(combinedData.totalStock * 0.2);

//   // Create display strings for combined data
//   const unitDisplay =
//     combinedData.units.length > 1
//       ? `${combinedData.units.join(", ")}`
//       : combinedData.units[0] || "";

//   const priceDisplay =
//     combinedData.minPrice === combinedData.maxPrice
//       ? combinedData.minPrice
//       : combinedData.minPrice; // Show minimum price for sorting

//   return [
//     {
//       _id: product._id || "",
//       name: product.name || "",
//       totalStock: combinedData.totalStock,
//       remainingStock: combinedData.remainingStock,
//       usedStock: combinedData.usedStock,
//       unit: unitDisplay,
//       reorder_point: avgReorderPoint,
//       status: getStockStatus(
//         combinedData.remainingStock,
//         combinedData.totalStock,
//         avgReorderPoint
//       ),
//       image: productImage,
//       category: categoryName,
//       subCategory: subCategoryName,
//       price: priceDisplay,
//       wt: combinedData.totalWeight,
//     },
//   ];
// };

// const sortItems = (
//   items: InventoryItem[],
//   sortOption: string
// ): InventoryItem[] => {
//   const sortedItems = [...items];

//   switch (sortOption as SortOption) {
//     case "name-asc":
//       return sortedItems.sort((a, b) => a.name.localeCompare(b.name));
//     case "name-desc":
//       return sortedItems.sort((a, b) => b.name.localeCompare(a.name));
//     case "price-high":
//       return sortedItems.sort((a, b) => (b.price || 0) - (a.price || 0));
//     case "price-low":
//       return sortedItems.sort((a, b) => (a.price || 0) - (b.price || 0));
//     case "weight-high":
//       return sortedItems.sort((a, b) => (b.wt || 0) - (a.wt || 0));
//     case "weight-low":
//       return sortedItems.sort((a, b) => (a.wt || 0) - (b.wt || 0));
//     case "stock-high":
//       return sortedItems.sort((a, b) => b.remainingStock - a.remainingStock);
//     case "stock-low":
//       return sortedItems.sort((a, b) => a.remainingStock - b.remainingStock);
//     default:
//       return sortedItems;
//   }
// };

// const filterItemsBySearch = (
//   items: InventoryItem[],
//   query: string
// ): InventoryItem[] => {
//   if (!query) return items;

//   const searchTerm = query.toLowerCase();
//   return items.filter((item) =>
//     Object.entries(item).some(([key, value]) => {
//       if (key === "_id" || key === "image") return false;
//       return value?.toString().toLowerCase().includes(searchTerm);
//     })
//   );
// };

// const filterItemsByCategory = (
//   items: InventoryItem[],
//   filter: string
// ): InventoryItem[] => {
//   if (!filter) return items;

//   const statusFilters = ["On Stock", "Low Stock", "Out of Stock"];
//   const isStatusFilter = statusFilters.includes(filter);

//   return items.filter((item) =>
//     isStatusFilter ? item.status === filter : item.category === filter
//   );
// };

// // Main component
// const InventoryIndex = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedFilter, setSelectedFilter] = useState("");
//   const [selectedSort, setSelectedSort] = useState("");

//   const { data: products = [], isLoading, error } = useGetAllProductsQuery({});
//   // Transform products to inventory items
//   const inventoryItems = useMemo(
//     () => products.flatMap(transformProductToInventoryItems),
//     [products]
//   );

//   // Get unique categories for filter options
//   const categoryOptions = useMemo(() => {
//     const categories = new Set(
//       products
//         .map((product) => extractCategoryName(product.category))
//         .filter(Boolean)
//     );

//     return [
//       { value: "", label: "All Products" },
//       ...Array.from(categories).map((category) => ({
//         value: category,
//         label: category,
//       })),
//     ];
//   }, [products]);

//   // Filter and sort items
//   const processedItems = useMemo(() => {
//     let filtered = filterItemsBySearch(inventoryItems, searchQuery);
//     filtered = filterItemsByCategory(filtered, selectedFilter);
//     return sortItems(filtered, selectedSort);
//   }, [inventoryItems, searchQuery, selectedFilter, selectedSort]);

//   const handleSearch = (query: string) => setSearchQuery(query);
//   const handleFilter = (filter: string) => setSelectedFilter(filter);
//   const handleSort = (sort: string) => setSelectedSort(sort);

//   const filterOptions = [...categoryOptions, ...STATUS_OPTIONS];

//   if (error) return <div>Error loading inventory</div>;
//   return (
//     <div className="container mx-auto px-4 py-3">
//       <Header text="Inventory">
//         {/* <Link
//           to="/product/add"
//           className="px-3 py-2 flex items-center text-white bg-[#d49327] transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg"
//         >
//           <Icon
//             icon="material-symbols-light:add-rounded"
//             width="24"
//             height="24"
//             className="fill-white"
//           />
//           New Product
//         </Link> */}
//       </Header>

//       <div className="bg-white border-[#dcdddf] pb-4 border rounded-xl">
//         <div className="mx-2">
//           <MasterTable
//             columns={columns}
//             filterSection={
//               <SearchFilterSort
//                 onSearch={handleSearch}
//                 onFilter={handleFilter}
//                 onSort={handleSort}
//                 filterOptions={filterOptions}
//                 sortOptions={SORT_OPTIONS}
//                 placeholder="Search here..."
//               />
//             }
//             rows={processedItems}
//             loading={isLoading}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InventoryIndex;

// Second
import { useState, useMemo } from "react";
import Header from "../../components/shared/table_heading/Header";
import { SearchFilterSort } from "../../components/global/SearchFilterSort";
import MasterTable from "../../components/shared/MasterTable";
import {
  useGetAllProductsQuery,
  IFetchProduct,
} from "../../server/api/productHooks";
import { columns } from "./inventoryObj";

// Types
interface InventoryItem {
  _id: string;
  name: string;
  totalStock: number;
  remainingStock: number;
  usedStock: number;
  unit: string;
  reorder_point: number;
  status: "On Stock" | "Low Stock" | "Out of Stock";
  image?: string;
  category?: string;
  subCategory?: string;
  price?: number;
  wt?: number;
}

type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-high"
  | "price-low"
  | "weight-high"
  | "weight-low"
  | "stock-high"
  | "stock-low";

// Constants
const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "On Stock", label: "On Stock" },
  { value: "Low Stock", label: "Low Stock" },
  { value: "Out of Stock", label: "Out of Stock" },
];

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "price-high", label: "Price (High-Low)" },
  { value: "price-low", label: "Price (Low-High)" },
  { value: "weight-high", label: "Weight (High-Low)" },
  { value: "weight-low", label: "Weight (Low-High)" },
  { value: "stock-high", label: "Stock (High-Low)" },
  { value: "stock-low", label: "Stock (Low-High)" },
];

// Utility functions
const getStockStatus = (
  remainingStock: number,
  totalStock: number,
  reorderPoint?: number
): InventoryItem["status"] => {
  if (remainingStock <= 0) return "Out of Stock";
  const threshold = reorderPoint || Math.floor(totalStock * 0.2);
  return remainingStock <= threshold ? "Low Stock" : "On Stock";
};

interface Category {
  name?: string;
}

const extractCategoryName = (category?: Category): string => {
  return category && "name" in category && typeof category.name === "string"
    ? category.name
    : "";
};

const transformProductToInventoryItems = (
  product: IFetchProduct
): InventoryItem[] => {
  const categoryName = extractCategoryName(product.category);
  const subCategoryName = extractCategoryName(product.subCategory);
  const productImage = product.images?.[0];

  // Handle products without variants
  if (!product.variant?.length) {
    return [
      {
        _id: product._id || "",
        name: product.name || "",
        totalStock: 0,
        remainingStock: 0,
        usedStock: 0,
        unit: "",
        reorder_point: 0,
        status: "Out of Stock",
        image: productImage,
        category: categoryName,
        subCategory: subCategoryName,
        price: 0,
        wt: 0,
      },
    ];
  }

  // Combine all variants into a single inventory item
  const combinedData = product.variant.reduce(
    (acc, variant) => {
      acc.totalStock += variant.totalStock || 0;
      acc.remainingStock += variant.remainingStock || 0;
      acc.usedStock += variant.usedStock || 0;
      acc.totalWeight += variant.wt || 0;
      acc.reorderPoints.push(variant.reorderPoint || 0);

      // Collect unique units
      if (variant.unit && !acc.units.includes(variant.unit)) {
        acc.units.push(variant.unit);
      }

      // Keep track of price range (min and max)
      const price = variant.price || 0;
      if (price > 0) {
        acc.minPrice =
          acc.minPrice === 0 ? price : Math.min(acc.minPrice, price);
        acc.maxPrice = Math.max(acc.maxPrice, price);
      }

      return acc;
    },
    {
      totalStock: 0,
      remainingStock: 0,
      usedStock: 0,
      totalWeight: 0,
      units: [] as string[],
      reorderPoints: [] as number[],
      minPrice: 0,
      maxPrice: 0,
    }
  );

  // Calculate combined reorder point (average of all variant reorder points)
  const avgReorderPoint =
    combinedData.reorderPoints.length > 0
      ? Math.round(
          combinedData.reorderPoints.reduce((sum, point) => sum + point, 0) /
            combinedData.reorderPoints.length
        )
      : Math.floor(combinedData.totalStock * 0.2);

  // Create display strings for combined data
  const unitDisplay =
    combinedData.units.length > 1
      ? `${combinedData.units.join(", ")}`
      : combinedData.units[0] || "";

  const priceDisplay =
    combinedData.minPrice === combinedData.maxPrice
      ? combinedData.minPrice
      : combinedData.minPrice; // Show minimum price for sorting

  return [
    {
      _id: product._id || "",
      name: product.name || "",
      totalStock: combinedData.totalStock,
      remainingStock: combinedData.remainingStock,
      usedStock: combinedData.usedStock,
      unit: unitDisplay,
      reorder_point: avgReorderPoint,
      status: getStockStatus(
        combinedData.remainingStock,
        combinedData.totalStock,
        avgReorderPoint
      ),
      image: productImage,
      category: categoryName,
      subCategory: subCategoryName,
      price: priceDisplay,
      wt: combinedData.totalWeight,
    },
  ];
};

const sortItems = (
  items: InventoryItem[],
  sortOption: string
): InventoryItem[] => {
  const sortedItems = [...items];

  switch (sortOption as SortOption) {
    case "name-asc":
      return sortedItems.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sortedItems.sort((a, b) => b.name.localeCompare(a.name));
    case "price-high":
      return sortedItems.sort((a, b) => (b.price || 0) - (a.price || 0));
    case "price-low":
      return sortedItems.sort((a, b) => (a.price || 0) - (b.price || 0));
    case "weight-high":
      return sortedItems.sort((a, b) => (b.wt || 0) - (a.wt || 0));
    case "weight-low":
      return sortedItems.sort((a, b) => (a.wt || 0) - (b.wt || 0));
    case "stock-high":
      return sortedItems.sort((a, b) => b.remainingStock - a.remainingStock);
    case "stock-low":
      return sortedItems.sort((a, b) => a.remainingStock - b.remainingStock);
    default:
      return sortedItems;
  }
};

const filterItemsBySearch = (
  items: InventoryItem[],
  query: string
): InventoryItem[] => {
  if (!query) return items;

  const searchTerm = query.toLowerCase();
  return items.filter((item) =>
    Object.entries(item).some(([key, value]) => {
      if (key === "_id" || key === "image") return false;
      return value?.toString().toLowerCase().includes(searchTerm);
    })
  );
};

const filterItemsByCategory = (
  items: InventoryItem[],
  filter: string
): InventoryItem[] => {
  if (!filter) return items;

  const statusFilters = ["On Stock", "Low Stock", "Out of Stock"];
  const isStatusFilter = statusFilters.includes(filter);

  return items.filter((item) =>
    isStatusFilter ? item.status === filter : item.category === filter
  );
};

// Main component
const InventoryIndex = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSort, setSelectedSort] = useState("");

  const { data, isLoading, error } = useGetAllProductsQuery({});
  const products = (data?.products || []) as IFetchProduct[];

  // Transform products to inventory items
  const inventoryItems = useMemo(
    () => products.flatMap(transformProductToInventoryItems),
    [products]
  );

  // Get unique categories for filter options
  const categoryOptions = useMemo(() => {
    const categories = new Set(
      products
        .map((product: IFetchProduct) => extractCategoryName(product.category))
        .filter(Boolean)
    );

    return [
      { value: "", label: "All Products" },
      ...Array.from(categories).map((category) => ({
        value: category,
        label: category,
      })),
    ] as { value: string; label: string }[];
  }, [products]);

  // Filter and sort items
  const processedItems = useMemo(() => {
    let filtered = filterItemsBySearch(inventoryItems, searchQuery);
    filtered = filterItemsByCategory(filtered, selectedFilter);
    return sortItems(filtered, selectedSort);
  }, [inventoryItems, searchQuery, selectedFilter, selectedSort]);

  const handleSearch = (query: string) => setSearchQuery(query);
  const handleFilter = (filter: string) => setSelectedFilter(filter);
  const handleSort = (sort: string) => setSelectedSort(sort);

  const filterOptions = [...categoryOptions, ...STATUS_OPTIONS];

  if (error) return <div>Error loading inventory</div>;
  return (
    <div className="container mx-auto px-4 py-3">
      <Header text="Inventory" />

      <div className="bg-white border-[#dcdddf] pb-4 border rounded-xl">
        <div className="mx-2">
          <MasterTable
            columns={columns}
            filterSection={
              <SearchFilterSort
                onSearch={handleSearch}
                onFilter={handleFilter}
                onSort={handleSort}
                filterOptions={filterOptions}
                sortOptions={SORT_OPTIONS}
                placeholder="Search here..."
              />
            }
            rows={processedItems}
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryIndex;
