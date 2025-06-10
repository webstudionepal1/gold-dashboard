// import { useCallback, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import MasterTable from "../../components/shared/MasterTable";
// import Header from "../../components/shared/table_heading/Header";
// import { DynamicTab } from "../PurchaseManagement/components/DynamicTab";

// import { salesReportTabOption, type ITable } from "../analytics/SalesReportObj";

// import { map } from "lodash";
// import {
//   type IFetchExpenses,
//   useDeleteExpenseMutation,
//   useGetExpenseCategoryQuery,
//   useGetExpensesQuery,
// } from "../../server/api/expensesHook";

// import { SearchFilterSort } from "../../components/global/SearchFilterSort";
// import { filterOptions, sortOptions } from "../../constants/DropDownOptions";
// import {
//   useGetCategoryWiseDataQuery,
//   useGetProductWiseDataQuery,
//   useGetSubCategoryWiseDataQuery,
// } from "../../server/api/salesReportHook";
// import {
//   DateFilter,
//   type PeriodOption,
// } from "../../components/shared/DatePeriodFilter";

// interface IEditModal {
//   state: boolean;
//   editData?: IFetchExpenses | null;
// }

// interface FilterState {
//   searchQuery: string;
//   filterValue: string;
//   sortValue: string;
// }

// type TabFilter = {
//   date: string;
//   period: PeriodOption;
// };

// const SalesReport = () => {
//   const navigate = useNavigate();
//   const [selectedTab, setSelectedTab] = useState("productWise");
//   const todayFilter = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
//   const initialTabFilters: Record<string, TabFilter> = {
//     productWise: { date: todayFilter, period: "Yearly" },
//     categoryWise: { date: todayFilter, period: "Yearly" },
//     subCategoryWise: { date: todayFilter, period: "Yearly" },
//   };

//   const [tabFilters, setTabFilters] = useState(initialTabFilters);
//   const handleTabFilterChange = (updatedFilter: TabFilter) => {
//     setTabFilters((prev) => ({
//       ...prev,
//       [selectedTab]: updatedFilter,
//     }));
//   };
//   const [isExpenseModalOpen, setIsExpenseModalOpen] = useState<IEditModal>({
//     state: false,
//     editData: null,
//   });

//   const today = new Date();
//   const sevenDaysAgo = new Date();
//   sevenDaysAgo.setDate(today.getDate() - 7);

//   const formatDate = (date: Date) => date.toISOString().split("T")[0];

//   const [startDate, setStartDate] = useState<string>(formatDate(sevenDaysAgo));
//   const [endDate, setEndDate] = useState<string>(formatDate(today));

//   const [filterState, setFilterState] = useState<FilterState>({
//     searchQuery: "",
//     filterValue: "",
//     sortValue: "",
//   });

//   const {
//     data: ProductWiseData,
//     isSuccess: isProductWiseDataSuccess,
//     isLoading: isProductWiseDataLoading,
//   } = useGetProductWiseDataQuery({
//     date: tabFilters.productWise.date,
//     period: tabFilters.productWise.period.toLowerCase(), // lowercase for `monthly`
//   });

//   const {
//     data: categoryWiseDataList,
//     isLoading: isCategoryWiseDataLoading,
//     isSuccess: isCategoryWiseDataSuccess,
//   } = useGetCategoryWiseDataQuery({
//     date: tabFilters.categoryWise.date,
//     period: tabFilters.categoryWise.period.toLowerCase(),
//   });

//   const {
//     data: subCategoryWiseDataList,
//     isLoading: isSubCategoryWiseDataLoading,
//     isSuccess: isSubCategoryWiseDataSuccess,
//   } = useGetSubCategoryWiseDataQuery({
//     date: tabFilters.subCategoryWise.date,
//     period: tabFilters.subCategoryWise.period.toLowerCase(),
//   });

//   const { mutate: deleteExpense } = useDeleteExpenseMutation();
//   const {
//     data: expensesList,
//     isLoading: expensesLoading,
//     isSuccess: expensesSuccess,
//   } = useGetExpensesQuery();

//   const {
//     data: expenseCategories,
//     isLoading: expenseCatLoading,
//     isSuccess: expenseCatSuccess,
//   } = useGetExpenseCategoryQuery();

//   const expenseData = useMemo(
//     () => (expensesSuccess ? expensesList : []),
//     [expensesSuccess, expensesList]
//   );

//   const filteredExpenses = useMemo(() => {
//     if (!expenseData || expenseData.length === 0) return [];

//     let result = [...expenseData];

//     if (filterState.searchQuery) {
//       const query = filterState.searchQuery.toLowerCase();
//       result = result.filter(
//         (item) =>
//           (item.expenseCategory.name &&
//             item.expenseCategory.name.toLowerCase().includes(query)) ||
//           (typeof item.expenseCategory.name === "string" &&
//             item.expenseCategory.name.toLowerCase().includes(query)) ||
//           (item.description && item.description.toLowerCase().includes(query))
//       );
//     }
//     if (filterState.filterValue) {
//       result = result.filter(
//         (item) =>
//           (typeof item.expenseCategory.name === "string" &&
//             item.expenseCategory.name === filterState.filterValue) ||
//           (item.description && item.description === filterState.filterValue)
//       );
//     }

//     return result;
//   }, [expenseData, filterState]);

//   const handleSearch = (query: string) => {
//     setFilterState((prev) => ({ ...prev, searchQuery: query }));
//   };

//   const handleFilter = (filter: string) => {
//     setFilterState((prev) => ({ ...prev, filterValue: filter }));
//   };

//   const handleSort = (sort: string) => {
//     setFilterState((prev) => ({ ...prev, sortValue: sort }));
//   };

//   const productWiseTableData = useMemo(
//     () => ({
//       columns: [
//         { key: "category", title: "Category" },
//         { key: "subCategory", title: "Sub Category" },
//         { key: "product", title: "Products" },
//         { key: "totalRevenue", title: "Revenue" },
//       ],
//       rows: map(ProductWiseData, (item) => ({
//         ...item,
//       })),
//     }),
//     [ProductWiseData, isProductWiseDataSuccess]
//   );
//   const categoryWiseTableData = useMemo(
//     () => ({
//       columns: [
//         { key: "category", title: "Category" },
//         { key: "totalOrders", title: "Total Orders" },
//         { key: "totalRevenue", title: "Revenue" },
//         { key: "percentageSharee", title: "Percentage Share" },
//       ],
//       rows: map(categoryWiseDataList, (item) => ({
//         ...item,
//         percentageSharee: <div>{item.percentageShare} %</div>,
//       })),
//     }),
//     [categoryWiseDataList, isCategoryWiseDataSuccess]
//   );

//   const subCategoryTableData = useMemo(
//     () => ({
//       columns: [
//         { key: "subCategory", title: "Sub Category" },
//         { key: "totalOrders", title: "Total Orders" },
//         { key: "totalRevenue", title: "Revenue" },
//         { key: "percentageSharee", title: "Percentage Share" },
//       ],
//       rows: map(subCategoryWiseDataList, (item) => ({
//         ...item,
//         percentageSharee: <div>{item.percentageShare} %</div>,
//       })),
//     }),
//     [subCategoryWiseDataList, isSubCategoryWiseDataSuccess]
//   );

//   const tableDataObj: ITable = {
//     productWise: productWiseTableData,
//     categoryWise: categoryWiseTableData,
//     subCategoryWise: subCategoryTableData,
//   };
//   const [modal, setModal] = useState({
//     of: "",
//     edit: false,
//     data: null,
//   });
//   const closeModal = useCallback(
//     () => setModal({ of: "", edit: false, data: null }),
//     []
//   );

//   return (
//     <div className="container px-4 py-3 mx-auto">
//       {/* Improved header section with better layout */}
//       <div className="mb-6">
//         <Header text="Sales Report" />
//       </div>

//       {/* Improved layout for date and period filters */}
//       <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="flex-1">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">
//               Report Settings
//             </h3>
//             <DateFilter
//               value={tabFilters[selectedTab]}
//               onChange={handleTabFilterChange}
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="px-3 py-1.5 bg-gray-100 rounded-md text-sm">
//               <span className="font-medium">Current Period:</span>{" "}
//               <span>{tabFilters[selectedTab].period}</span>
//             </div>
//             <div className="px-3 py-1.5 bg-gray-100 rounded-md text-sm">
//               <span className="font-medium">Date:</span>{" "}
//               <span>
//                 {new Date(tabFilters[selectedTab].date).toLocaleDateString()}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Optional: Add search and filter section */}

//       {/* Table with tabs */}
//       <div className="bg-white rounded-lg shadow-sm">
//         <MasterTable
//           loading={expensesLoading || expenseCatLoading}
//           tabsOptions={
//             <DynamicTab
//               selectedTab={selectedTab}
//               setSelectedTab={setSelectedTab}
//               tabOptions={salesReportTabOption}
//             />
//           }
//           rows={tableDataObj[selectedTab].rows || []}
//           columns={tableDataObj[selectedTab].columns}
//           canSelect
//           filterSection={
//             <SearchFilterSort
//               onFilter={handleFilter}
//               onSort={handleSort}
//               onViewChange={() => {}}
//               showFilter={true}
//               showSort={true}
//               showView={false}
//               filterOptions={filterOptions}
//               sortOptions={sortOptions}
//               placeholder="Search products..."
//             />
//           }
//         />
//       </div>
//     </div>
//   );
// };

// export default SalesReport;

// Second

// import { useCallback, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import MasterTable from "../../components/shared/MasterTable";
// import Header from "../../components/shared/table_heading/Header";
// import { DynamicTab } from "../PurchaseManagement/components/DynamicTab";
// import { salesReportTabOption, type ITable } from "../analytics/SalesReportObj";
// import { map } from "lodash";
// import {
//   type IFetchExpenses,
//   useDeleteExpenseMutation,
//   useGetExpenseCategoryQuery,
//   useGetExpensesQuery,
// } from "../../server/api/expensesHook";
// import { SearchFilterSort } from "../../components/global/SearchFilterSort";
// import {
//   useGetCategoryWiseDataQuery,
//   useGetProductWiseDataQuery,
//   useGetSubCategoryWiseDataQuery,
// } from "../../server/api/salesReportHook";
// import {
//   DateFilter,
//   type PeriodOption,
// } from "../../components/shared/DatePeriodFilter";

// interface IEditModal {
//   state: boolean;
//   editData?: IFetchExpenses | null;
// }

// interface FilterState {
//   searchQuery: string;
//   filterValue: string;
//   sortValue: string;
// }

// type TabFilter = {
//   date: string;
//   period: PeriodOption;
// };

// const SalesReport = () => {
//   const navigate = useNavigate();
//   const [selectedTab, setSelectedTab] = useState("productWise");
//   const todayFilter = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
//   const initialTabFilters: Record<string, TabFilter> = {
//     productWise: { date: todayFilter, period: "Yearly" },
//     categoryWise: { date: todayFilter, period: "Yearly" },
//     subCategoryWise: { date: todayFilter, period: "Yearly" },
//   };

//   const [tabFilters, setTabFilters] = useState(initialTabFilters);
//   const handleTabFilterChange = (updatedFilter: TabFilter) => {
//     setTabFilters((prev) => ({
//       ...prev,
//       [selectedTab]: updatedFilter,
//     }));
//   };
//   const [isExpenseModalOpen, setIsExpenseModalOpen] = useState<IEditModal>({
//     state: false,
//     editData: null,
//   });

//   const today = new Date();
//   const sevenDaysAgo = new Date();
//   sevenDaysAgo.setDate(today.getDate() - 7);

//   const formatDate = (date: Date) => date.toISOString().split("T")[0];

//   const [startDate, setStartDate] = useState<string>(formatDate(sevenDaysAgo));
//   const [endDate, setEndDate] = useState<string>(formatDate(today));

//   const [filterState, setFilterState] = useState<FilterState>({
//     searchQuery: "",
//     filterValue: "",
//     sortValue: "",
//   });

//   // Define filter options based on backend fields
//   const filterOptions = [
//     { label: "All", value: "" },
//     { label: "Category: Uncategorized", value: "Uncategorized" },
//     { label: "Subcategory: Uncategorized", value: "Uncategorized_sub" },
//   ];

//   // Define sort options for product-wise tab
//   const productWiseSortOptions = [
//     { label: "Category A-Z", value: "category_asc" },
//     { label: "Category Z-A", value: "category_desc" },
//     { label: "Subcategory A-Z", value: "subCategory_asc" },
//     { label: "Subcategory Z-A", value: "subCategory_desc" },
//     { label: "Product A-Z", value: "product_asc" },
//     { label: "Product Z-A", value: "product_desc" },
//     { label: "Units Sold (Low to High)", value: "unitsSold_asc" },
//     { label: "Units Sold (High to Low)", value: "unitsSold_desc" },
//     { label: "Total Revenue (Low to High)", value: "totalRevenue_asc" },
//     { label: "Total Revenue (High to Low)", value: "totalRevenue_desc" },
//     { label: "Average Price (Low to High)", value: "averagePrice_asc" },
//     { label: "Average Price (High to Low)", value: "averagePrice_desc" },
//   ];

//   // Define sort options for category-wise tab
//   const categoryWiseSortOptions = [
//     { label: "Category A-Z", value: "category_asc" },
//     { label: "Category Z-A", value: "category_desc" },
//     { label: "Units Sold (Low to High)", value: "unitsSold_asc" },
//     { label: "Units Sold (High to Low)", value: "unitsSold_desc" },
//     { label: "Total Orders (Low to High)", value: "totalOrders_asc" },
//     { label: "Total Orders (High to Low)", value: "totalOrders_desc" },
//     { label: "Total Revenue (Low to High)", value: "totalRevenue_asc" },
//     { label: "Total Revenue (High to Low)", value: "totalRevenue_desc" },
//     { label: "Average Price (Low to High)", value: "averagePrice_asc" },
//     { label: "Average Price (High to Low)", value: "averagePrice_desc" },
//     { label: "Percentage Share (Low to High)", value: "percentageShare_asc" },
//     { label: "Percentage Share (High to Low)", value: "percentageShare_desc" },
//   ];

//   // Define sort options for subcategory-wise tab
//   const subCategoryWiseSortOptions = [
//     { label: "Subcategory A-Z", value: "subCategory_asc" },
//     { label: "Subcategory Z-A", value: "subCategory_desc" },
//     { label: "Units Sold (Low to High)", value: "unitsSold_asc" },
//     { label: "Units Sold (High to Low)", value: "unitsSold_desc" },
//     { label: "Total Orders (Low to High)", value: "totalOrders_asc" },
//     { label: "Total Orders (High to Low)", value: "totalOrders_desc" },
//     { label: "Total Revenue (Low to High)", value: "totalRevenue_asc" },
//     { label: "Total Revenue (High to Low)", value: "totalRevenue_desc" },
//     { label: "Average Price (Low to High)", value: "averagePrice_asc" },
//     { label: "Average Price (High to Low)", value: "averagePrice_desc" },
//     { label: "Percentage Share (Low to High)", value: "percentageShare_asc" },
//     { label: "Percentage Share (High to Low)", value: "percentageShare_desc" },
//   ];

//   // Get current sort options based on selected tab
//   const currentSortOptions =
//     selectedTab === "productWise"
//       ? productWiseSortOptions
//       : selectedTab === "categoryWise"
//       ? categoryWiseSortOptions
//       : subCategoryWiseSortOptions;

//   // Log filter and sort options to debug
//   console.log("Defined filterOptions:", filterOptions);
//   console.log("Current sortOptions for", selectedTab, ":", currentSortOptions);

//   const {
//     data: ProductWiseData,
//     isSuccess: isProductWiseDataSuccess,
//     isLoading: isProductWiseDataLoading,
//   } = useGetProductWiseDataQuery({
//     date: tabFilters.productWise.date,
//     period: tabFilters.productWise.period.toLowerCase(),
//   });

//   console.log("Product wise data", ProductWiseData);

//   const {
//     data: categoryWiseDataList,
//     isLoading: isCategoryWiseDataLoading,
//     isSuccess: isCategoryWiseDataSuccess,
//   } = useGetCategoryWiseDataQuery({
//     date: tabFilters.categoryWise.date,
//     period: tabFilters.categoryWise.period.toLowerCase(),
//   });

//   const {
//     data: subCategoryWiseDataList,
//     isLoading: isSubCategoryWiseDataLoading,
//     isSuccess: isSubCategoryWiseDataSuccess,
//   } = useGetSubCategoryWiseDataQuery({
//     date: tabFilters.subCategoryWise.date,
//     period: tabFilters.subCategoryWise.period.toLowerCase(),
//   });

//   // Log raw data
//   console.log("Raw ProductWiseData:", ProductWiseData);
//   console.log("Raw categoryWiseDataList:", categoryWiseDataList);
//   console.log("Raw subCategoryWiseDataList:", subCategoryWiseDataList);

//   const { mutate: deleteExpense } = useDeleteExpenseMutation();
//   const {
//     data: expensesList,
//     isLoading: expensesLoading,
//     isSuccess: expensesSuccess,
//   } = useGetExpensesQuery();

//   const {
//     data: expenseCategories,
//     isLoading: expenseCatLoading,
//     isSuccess: expenseCatSuccess,
//   } = useGetExpenseCategoryQuery();

//   const expenseData = useMemo(
//     () => (expensesSuccess ? expensesList : []),
//     [expensesSuccess, expensesList]
//   );

//   const productWiseDataFiltered = useMemo(() => {
//     if (
//       !ProductWiseData ||
//       !ProductWiseData.products ||
//       ProductWiseData.products.length === 0
//     ) {
//       console.log("Product wise data empty or null, returning empty array");
//       return [];
//     }

//     let result = [...ProductWiseData.products];

//     if (filterState.searchQuery) {
//       const query = filterState.searchQuery.toLowerCase();
//       result = result.filter(
//         (item) =>
//           item.category?.toLowerCase().includes(query) ||
//           item.subCategory?.toLowerCase().includes(query) ||
//           item.product?.toLowerCase().includes(query) ||
//           String(item.unitsSold).includes(query) ||
//           String(item.totalRevenue).includes(query) ||
//           String(item.averagePrice).includes(query)
//       );
//       console.log("After search filter (product wise):", result);
//     }

//     if (filterState.filterValue) {
//       console.log(
//         "Filtering product wise data with filterValue:",
//         filterState.filterValue
//       );
//       result = result.filter((item) => {
//         if (filterState.filterValue === "Uncategorized") {
//           return item.category === "Uncategorized";
//         }
//         if (filterState.filterValue === "Uncategorized_sub") {
//           return item.subCategory === "Uncategorized";
//         }
//         console.log(
//           "No matching filter value for product wise data:",
//           filterState.filterValue
//         );
//         return false;
//       });
//       console.log("After filter (product wise):", result);
//     }

//     if (filterState.sortValue) {
//       console.log(
//         "Sorting product wise data with sortValue:",
//         filterState.sortValue
//       );
//       switch (filterState.sortValue) {
//         case "category_asc":
//           result.sort((a, b) =>
//             (a.category || "").localeCompare(b.category || "")
//           );
//           console.log("Applied category_asc sort");
//           break;
//         case "category_desc":
//           result.sort((a, b) =>
//             (b.category || "").localeCompare(a.category || "")
//           );
//           console.log("Applied category_desc sort");
//           break;
//         case "subCategory_asc":
//           result.sort((a, b) =>
//             (a.subCategory || "").localeCompare(b.subCategory || "")
//           );
//           console.log("Applied subCategory_asc sort");
//           break;
//         case "subCategory_desc":
//           result.sort((a, b) =>
//             (b.subCategory || "").localeCompare(a.subCategory || "")
//           );
//           console.log("Applied subCategory_desc sort");
//           break;
//         case "product_asc":
//           result.sort((a, b) =>
//             (a.product || "").localeCompare(b.product || "")
//           );
//           console.log("Applied product_asc sort");
//           break;
//         case "product_desc":
//           result.sort((a, b) =>
//             (b.product || "").localeCompare(a.product || "")
//           );
//           console.log("Applied product_desc sort");
//           break;
//         case "unitsSold_asc":
//           result.sort((a, b) => (a.unitsSold || 0) - (b.unitsSold || 0));
//           console.log("Applied unitsSold_asc sort");
//           break;
//         case "unitsSold_desc":
//           result.sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0));
//           console.log("Applied unitsSold_desc sort");
//           break;
//         case "totalRevenue_asc":
//           result.sort((a, b) => (a.totalRevenue || 0) - (b.totalRevenue || 0));
//           console.log("Applied totalRevenue_asc sort");
//           break;
//         case "totalRevenue_desc":
//           result.sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0));
//           console.log("Applied totalRevenue_desc sort");
//           break;
//         case "averagePrice_asc":
//           result.sort((a, b) => (a.averagePrice || 0) - (b.averagePrice || 0));
//           console.log("Applied averagePrice_asc sort");
//           break;
//         case "averagePrice_desc":
//           result.sort((a, b) => (b.averagePrice || 0) - (a.averagePrice || 0));
//           console.log("Applied averagePrice_desc sort");
//           break;
//         default:
//           console.log(
//             "No matching sort value for product wise data:",
//             filterState.sortValue
//           );
//           break;
//       }
//       console.log("After sort (product wise):", result);
//     }

//     console.log("Final filtered product wise data:", result);
//     return result;
//   }, [ProductWiseData, filterState]);

//   const categoryWiseDataFiltered = useMemo(() => {
//     if (
//       !categoryWiseDataList ||
//       !categoryWiseDataList.data ||
//       categoryWiseDataList.data.length === 0
//     ) {
//       console.log("Category wise data empty or null, returning empty array");
//       return [];
//     }

//     let result = [...categoryWiseDataList.data];

//     if (filterState.searchQuery) {
//       const query = filterState.searchQuery.toLowerCase();
//       result = result.filter(
//         (item) =>
//           item.category?.toLowerCase().includes(query) ||
//           String(item.unitsSold).includes(query) ||
//           String(item.totalOrders).includes(query) ||
//           String(item.totalRevenue).includes(query) ||
//           String(item.averagePrice).includes(query) ||
//           String(item.percentageShare).includes(query)
//       );
//       console.log("After search filter (category wise):", result);
//     }

//     if (filterState.filterValue) {
//       console.log(
//         "Filtering category wise data with filterValue:",
//         filterState.filterValue
//       );
//       result = result.filter((item) => {
//         if (filterState.filterValue === "Uncategorized") {
//           return item.category === "Uncategorized";
//         }
//         console.log(
//           "No matching filter value for category wise data:",
//           filterState.filterValue
//         );
//         return false;
//       });
//       console.log("After filter (category wise):", result);
//     }

//     if (filterState.sortValue) {
//       console.log(
//         "Sorting category wise data with sortValue:",
//         filterState.sortValue
//       );
//       switch (filterState.sortValue) {
//         case "category_asc":
//           result.sort((a, b) =>
//             (a.category || "").localeCompare(b.category || "")
//           );
//           console.log("Applied category_asc sort");
//           break;
//         case "category_desc":
//           result.sort((a, b) =>
//             (b.category || "").localeCompare(a.category || "")
//           );
//           console.log("Applied category_desc sort");
//           break;
//         case "unitsSold_asc":
//           result.sort((a, b) => (a.unitsSold || 0) - (b.unitsSold || 0));
//           console.log("Applied unitsSold_asc sort");
//           break;
//         case "unitsSold_desc":
//           result.sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0));
//           console.log("Applied unitsSold_desc sort");
//           break;
//         case "totalOrders_asc":
//           result.sort((a, b) => (a.totalOrders || 0) - (b.totalOrders || 0));
//           console.log("Applied totalOrders_asc sort");
//           break;
//         case "totalOrders_desc":
//           result.sort((a, b) => (b.totalOrders || 0) - (a.totalOrders || 0));
//           console.log("Applied totalOrders_desc sort");
//           break;
//         case "totalRevenue_asc":
//           result.sort((a, b) => (a.totalRevenue || 0) - (b.totalRevenue || 0));
//           console.log("Applied totalRevenue_asc sort");
//           break;
//         case "totalRevenue_desc":
//           result.sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0));
//           console.log("Applied totalRevenue_desc sort");
//           break;
//         case "averagePrice_asc":
//           result.sort((a, b) => (a.averagePrice || 0) - (b.averagePrice || 0));
//           console.log("Applied averagePrice_asc sort");
//           break;
//         case "averagePrice_desc":
//           result.sort((a, b) => (b.averagePrice || 0) - (a.averagePrice || 0));
//           console.log("Applied averagePrice_desc sort");
//           break;
//         case "percentageShare_asc":
//           result.sort(
//             (a, b) => (a.percentageShare || 0) - (b.percentageShare || 0)
//           );
//           console.log("Applied percentageShare_asc sort");
//           break;
//         case "percentageShare_desc":
//           result.sort(
//             (a, b) => (b.percentageShare || 0) - (a.percentageShare || 0)
//           );
//           console.log("Applied percentageShare_desc sort");
//           break;
//         default:
//           console.log(
//             "No matching sort value for category wise data:",
//             filterState.sortValue
//           );
//           break;
//       }
//       console.log("After sort (category wise):", result);
//     }

//     console.log("Final filtered category wise data:", result);
//     return result;
//   }, [categoryWiseDataList, filterState]);

//   const subCategoryWiseDataFiltered = useMemo(() => {
//     if (
//       !subCategoryWiseDataList ||
//       !subCategoryWiseDataList.data ||
//       subCategoryWiseDataList.data.length === 0
//     ) {
//       console.log("Subcategory wise data empty or null, returning empty array");
//       return [];
//     }

//     let result = [...subCategoryWiseDataList.data];

//     if (filterState.searchQuery) {
//       const query = filterState.searchQuery.toLowerCase();
//       result = result.filter(
//         (item) =>
//           item.subCategory?.toLowerCase().includes(query) ||
//           String(item.unitsSold).includes(query) ||
//           String(item.totalOrders).includes(query) ||
//           String(item.totalRevenue).includes(query) ||
//           String(item.averagePrice).includes(query) ||
//           String(item.percentageShare).includes(query)
//       );
//       console.log("After search filter (subcategory wise):", result);
//     }

//     if (filterState.filterValue) {
//       console.log(
//         "Filtering subcategory wise data with filterValue:",
//         filterState.filterValue
//       );
//       result = result.filter((item) => {
//         if (filterState.filterValue === "Uncategorized_sub") {
//           return item.subCategory === "Uncategorized";
//         }
//         console.log(
//           "No matching filter value for subcategory wise data:",
//           filterState.filterValue
//         );
//         return false;
//       });
//       console.log("After filter (subcategory wise):", result);
//     }

//     if (filterState.sortValue) {
//       console.log(
//         "Sorting subcategory wise data with sortValue:",
//         filterState.sortValue
//       );
//       switch (filterState.sortValue) {
//         case "subCategory_asc":
//           result.sort((a, b) =>
//             (a.subCategory || "").localeCompare(b.subCategory || "")
//           );
//           console.log("Applied subCategory_asc sort");
//           break;
//         case "subCategory_desc":
//           result.sort((a, b) =>
//             (b.subCategory || "").localeCompare(a.subCategory || "")
//           );
//           console.log("Applied subCategory_desc sort");
//           break;
//         case "unitsSold_asc":
//           result.sort((a, b) => (a.unitsSold || 0) - (b.unitsSold || 0));
//           console.log("Applied unitsSold_asc sort");
//           break;
//         case "unitsSold_desc":
//           result.sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0));
//           console.log("Applied unitsSold_desc sort");
//           break;
//         case "totalOrders_asc":
//           result.sort((a, b) => (a.totalOrders || 0) - (b.totalOrders || 0));
//           console.log("Applied totalOrders_asc sort");
//           break;
//         case "totalOrders_desc":
//           result.sort((a, b) => (b.totalOrders || 0) - (a.totalOrders || 0));
//           console.log("Applied totalOrders_desc sort");
//           break;
//         case "totalRevenue_asc":
//           result.sort((a, b) => (a.totalRevenue || 0) - (b.totalRevenue || 0));
//           console.log("Applied totalRevenue_asc sort");
//           break;
//         case "totalRevenue_desc":
//           result.sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0));
//           console.log("Applied totalRevenue_desc sort");
//           break;
//         case "averagePrice_asc":
//           result.sort((a, b) => (a.averagePrice || 0) - (b.averagePrice || 0));
//           console.log("Applied averagePrice_asc sort");
//           break;
//         case "averagePrice_desc":
//           result.sort((a, b) => (b.averagePrice || 0) - (a.averagePrice || 0));
//           console.log("Applied averagePrice_desc sort");
//           break;
//         case "percentageShare_asc":
//           result.sort(
//             (a, b) => (a.percentageShare || 0) - (b.percentageShare || 0)
//           );
//           console.log("Applied percentageShare_asc sort");
//           break;
//         case "percentageShare_desc":
//           result.sort(
//             (a, b) => (b.percentageShare || 0) - (a.percentageShare || 0)
//           );
//           console.log("Applied percentageShare_desc sort");
//           break;
//         default:
//           console.log(
//             "No matching sort value for subcategory wise data:",
//             filterState.sortValue
//           );
//           break;
//       }
//       console.log("After sort (subcategory wise):", result);
//     }

//     console.log("Final filtered subcategory wise data:", result);
//     return result;
//   }, [subCategoryWiseDataList, filterState]);

//   const handleSearch = (query: string) => {
//     console.log("Search query received:", query);
//     setFilterState((prev) => ({ ...prev, searchQuery: query }));
//   };

//   const handleFilter = (filter: string) => {
//     console.log("Filter value received:", filter);
//     setFilterState((prev) => ({ ...prev, filterValue: filter }));
//   };

//   const handleSort = (sort: string) => {
//     console.log("Sort value received:", sort);
//     setFilterState((prev) => ({ ...prev, sortValue: sort }));
//   };

//   // Reset sort value when tab changes to avoid invalid sort options
//   const handleTabChange = (tab: string) => {
//     setSelectedTab(tab);
//     setFilterState((prev) => ({ ...prev, sortValue: "" })); // Reset sort when switching tabs
//   };

//   const productWiseTableData = useMemo(
//     () => ({
//       columns: [
//         { key: "category", title: "Category" },
//         { key: "subCategory", title: "Sub Category" },
//         { key: "product", title: "Products" },
//         { key: "totalRevenue", title: "Revenue" },
//       ],
//       rows: map(productWiseDataFiltered, (item) => ({
//         category: item.category || "N/A",
//         subCategory: item.subCategory || "N/A",
//         product: item.product || "N/A",
//         totalRevenue: item.totalRevenue ?? 0,
//       })),
//     }),
//     [productWiseDataFiltered]
//   );

//   const categoryWiseTableData = useMemo(
//     () => ({
//       columns: [
//         { key: "category", title: "Category" },
//         { key: "totalOrders", title: "Total Orders" },
//         { key: "totalRevenue", title: "Revenue" },
//         { key: "percentageSharee", title: "Percentage Share" },
//       ],
//       rows: map(categoryWiseDataFiltered, (item) => ({
//         category: item.category || "N/A",
//         totalOrders: item.totalOrders ?? 0,
//         totalRevenue: item.totalRevenue ?? 0,
//         percentageSharee: <div>{item.percentageShare ?? 0} %</div>,
//       })),
//     }),
//     [categoryWiseDataFiltered]
//   );

//   const subCategoryTableData = useMemo(
//     () => ({
//       columns: [
//         { key: "subCategory", title: "Sub Category" },
//         { key: "totalOrders", title: "Total Orders" },
//         { key: "totalRevenue", title: "Revenue" },
//         { key: "percentageSharee", title: "Percentage Share" },
//       ],
//       rows: map(subCategoryWiseDataFiltered, (item) => ({
//         subCategory: item.subCategory || "N/A",
//         totalOrders: item.totalOrders ?? 0,
//         totalRevenue: item.totalRevenue ?? 0,
//         percentageSharee: <div>{item.percentageShare ?? 0} %</div>,
//       })),
//     }),
//     [subCategoryWiseDataFiltered]
//   );

//   const tableDataObj: ITable = {
//     productWise: productWiseTableData,
//     categoryWise: categoryWiseTableData,
//     subCategoryWise: subCategoryTableData,
//   };

//   const [modal, setModal] = useState({
//     of: "",
//     edit: false,
//     data: null,
//   });
//   const closeModal = useCallback(
//     () => setModal({ of: "", edit: false, data: null }),
//     []
//   );

//   return (
//     <div className="container px-4 py-3 mx-auto">
//       <div className="mb-6">
//         <Header text="Sales Report" />
//       </div>

//       <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="flex-1">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">
//               Report Settings
//             </h3>
//             <DateFilter
//               value={tabFilters[selectedTab]}
//               onChange={handleTabFilterChange}
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="px-3 py-1.5 bg-gray-100 rounded-md text-sm">
//               <span className="font-medium">Current Period:</span>{" "}
//               <span>{tabFilters[selectedTab].period}</span>
//             </div>
//             <div className="px-3 py-1.5 bg-gray-100 rounded-md text-sm">
//               <span className="font-medium">Date:</span>{" "}
//               <span>
//                 {new Date(tabFilters[selectedTab].date).toLocaleDateString()}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm">
//         <MasterTable
//           loading={
//             isProductWiseDataLoading ||
//             isCategoryWiseDataLoading ||
//             isSubCategoryWiseDataLoading ||
//             expensesLoading ||
//             expenseCatLoading
//           }
//           tabsOptions={
//             <DynamicTab
//               selectedTab={selectedTab}
//               setSelectedTab={handleTabChange}
//               tabOptions={salesReportTabOption}
//             />
//           }
//           filterSection={
//             <SearchFilterSort
//               onFilter={handleFilter}
//               onSort={handleSort}
//               onViewChange={() => {}}
//               showFilter={true}
//               showSort={true}
//               showView={false}
//               filterOptions={filterOptions}
//               sortOptions={currentSortOptions}
//               placeholder="Search products..."
//             />
//           }
//           rows={tableDataObj[selectedTab].rows || []}
//           columns={tableDataObj[selectedTab].columns}
//           canSelect
//         />
//       </div>
//     </div>
//   );
// };

// export default SalesReport;

import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MasterTable from "../../components/shared/MasterTable";
import Header from "../../components/shared/table_heading/Header";
import { DynamicTab } from "../PurchaseManagement/components/DynamicTab";
import { salesReportTabOption, type ITable } from "../analytics/SalesReportObj";
import { map } from "lodash";
import {
  type IFetchExpenses,
  useDeleteExpenseMutation,
  useGetExpenseCategoryQuery,
  useGetExpensesQuery,
} from "../../server/api/expensesHook";
import { SearchFilterSort } from "../../components/global/SearchFilterSort";
import {
  useGetCategoryWiseDataQuery,
  useGetProductWiseDataQuery,
  useGetSubCategoryWiseDataQuery,
} from "../../server/api/salesReportHook";
import {
  DateFilter,
  type PeriodOption,
} from "../../components/shared/DatePeriodFilter";

interface IEditModal {
  state: boolean;
  editData?: IFetchExpenses | null;
}

interface FilterState {
  searchQuery: string;
  filterValue: string;
  sortValue: string;
}

type TabFilter = {
  date: string;
  period: PeriodOption;
};

const SalesReport = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("productWise");
  const todayFilter = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const initialTabFilters: Record<string, TabFilter> = {
    productWise: { date: todayFilter, period: "Yearly" },
    categoryWise: { date: todayFilter, period: "Yearly" },
    subCategoryWise: { date: todayFilter, period: "Yearly" },
  };

  const [tabFilters, setTabFilters] = useState(initialTabFilters);
  const handleTabFilterChange = (updatedFilter: TabFilter) => {
    setTabFilters((prev) => ({
      ...prev,
      [selectedTab]: updatedFilter,
    }));
  };
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState<IEditModal>({
    state: false,
    editData: null,
  });

  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState<string>(formatDate(sevenDaysAgo));
  const [endDate, setEndDate] = useState<string>(formatDate(today));

  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: "",
    filterValue: "",
    sortValue: "",
  });

  // Define filter options based on backend fields
  const filterOptions = [
    { label: "All", value: "" },
    { label: "Category: Uncategorized", value: "Uncategorized" },
    { label: "Subcategory: Uncategorized", value: "Uncategorized_sub" },
  ];

  // Define sort options for product-wise tab
  const productWiseSortOptions = [
    { label: "Category A-Z", value: "category_asc" },
    { label: "Category Z-A", value: "category_desc" },
    { label: "Subcategory A-Z", value: "subCategory_asc" },
    { label: "Subcategory Z-A", value: "subCategory_desc" },
    { label: "Product A-Z", value: "product_asc" },
    { label: "Product Z-A", value: "product_desc" },
    { label: "Units Sold (Low to High)", value: "unitsSold_asc" },
    { label: "Units Sold (High to Low)", value: "unitsSold_desc" },
    { label: "Total Revenue (Low to High)", value: "totalRevenue_asc" },
    { label: "Total Revenue (High to Low)", value: "totalRevenue_desc" },
    { label: "Average Price (Low to High)", value: "averagePrice_asc" },
    { label: "Average Price (High to Low)", value: "averagePrice_desc" },
  ];

  // Define sort options for category-wise tab
  const categoryWiseSortOptions = [
    { label: "Category A-Z", value: "category_asc" },
    { label: "Category Z-A", value: "category_desc" },
    { label: "Units Sold (Low to High)", value: "unitsSold_asc" },
    { label: "Units Sold (High to Low)", value: "unitsSold_desc" },
    { label: "Total Orders (Low to High)", value: "totalOrders_asc" },
    { label: "Total Orders (High to Low)", value: "totalOrders_desc" },
    { label: "Total Revenue (Low to High)", value: "totalRevenue_asc" },
    { label: "Total Revenue (High to Low)", value: "totalRevenue_desc" },
    { label: "Average Price (Low to High)", value: "averagePrice_asc" },
    { label: "Average Price (High to Low)", value: "averagePrice_desc" },
    { label: "Percentage Share (Low to High)", value: "percentageShare_asc" },
    { label: "Percentage Share (High to Low)", value: "percentageShare_desc" },
  ];

  // Define sort options for subcategory-wise tab
  const subCategoryWiseSortOptions = [
    { label: "Subcategory A-Z", value: "subCategory_asc" },
    { label: "Subcategory Z-A", value: "subCategory_desc" },
    { label: "Units Sold (Low to High)", value: "unitsSold_asc" },
    { label: "Units Sold (High to Low)", value: "unitsSold_desc" },
    { label: "Total Orders (Low to High)", value: "totalOrders_asc" },
    { label: "Total Orders (High to Low)", value: "totalOrders_desc" },
    { label: "Total Revenue (Low to High)", value: "totalRevenue_asc" },
    { label: "Total Revenue (High to Low)", value: "totalRevenue_desc" },
    { label: "Average Price (Low to High)", value: "averagePrice_asc" },
    { label: "Average Price (High to Low)", value: "averagePrice_desc" },
    { label: "Percentage Share (Low to High)", value: "percentageShare_asc" },
    { label: "Percentage Share (High to Low)", value: "percentageShare_desc" },
  ];

  // Get current sort options based on selected tab
  const currentSortOptions =
    selectedTab === "productWise"
      ? productWiseSortOptions
      : selectedTab === "categoryWise"
      ? categoryWiseSortOptions
      : subCategoryWiseSortOptions;

  // Log filter and sort options to debug
  console.log("Defined filterOptions:", filterOptions);
  console.log("Current sortOptions for", selectedTab, ":", currentSortOptions);

  const {
    data: ProductWiseData,
    isSuccess: isProductWiseDataSuccess,
    isLoading: isProductWiseDataLoading,
  } = useGetProductWiseDataQuery({
    date: tabFilters.productWise.date,
    period: tabFilters.productWise.period.toLowerCase(),
  });

  const {
    data: categoryWiseDataList,
    isLoading: isCategoryWiseDataLoading,
    isSuccess: isCategoryWiseDataSuccess,
  } = useGetCategoryWiseDataQuery({
    date: tabFilters.categoryWise.date,
    period: tabFilters.categoryWise.period.toLowerCase(),
  });

  const {
    data: subCategoryWiseDataList,
    isLoading: isSubCategoryWiseDataLoading,
    isSuccess: isSubCategoryWiseDataSuccess,
  } = useGetSubCategoryWiseDataQuery({
    date: tabFilters.subCategoryWise.date,
    period: tabFilters.subCategoryWise.period.toLowerCase(),
  });

  // Log raw data
  console.log("Raw ProductWiseData:", ProductWiseData);
  console.log("Raw categoryWiseDataList:", categoryWiseDataList);
  console.log("Raw subCategoryWiseDataList:", subCategoryWiseDataList);

  const { mutate: deleteExpense } = useDeleteExpenseMutation();
  const {
    data: expensesList,
    isLoading: expensesLoading,
    isSuccess: expensesSuccess,
  } = useGetExpensesQuery();

  const {
    data: expenseCategories,
    isLoading: expenseCatLoading,
    isSuccess: expenseCatSuccess,
  } = useGetExpenseCategoryQuery();

  const expenseData = useMemo(
    () => (expensesSuccess ? expensesList : []),
    [expensesSuccess, expensesList]
  );

  const productWiseDataFiltered = useMemo(() => {
    if (!ProductWiseData || ProductWiseData.length === 0) {
      console.log("Product wise data empty or null, returning empty array");
      return [];
    }

    let result = [...ProductWiseData];

    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.category?.toLowerCase().includes(query) ||
          item.subCategory?.toLowerCase().includes(query) ||
          item.product?.toLowerCase().includes(query) ||
          String(item.unitsSold).includes(query) ||
          String(item.totalRevenue).includes(query) ||
          String(item.averagePrice).includes(query)
      );
      console.log("After search filter (product wise):", result);
    }

    if (filterState.filterValue) {
      console.log(
        "Filtering product wise data with filterValue:",
        filterState.filterValue
      );
      result = result.filter((item) => {
        if (filterState.filterValue === "Uncategorized") {
          return item.category === "Uncategorized";
        }
        if (filterState.filterValue === "Uncategorized_sub") {
          return item.subCategory === "Uncategorized";
        }
        console.log(
          "No matching filter value for product wise data:",
          filterState.filterValue
        );
        return false;
      });
      console.log("After filter (product wise):", result);
    }

    if (filterState.sortValue) {
      console.log(
        "Sorting product wise data with sortValue:",
        filterState.sortValue
      );
      switch (filterState.sortValue) {
        case "category_asc":
          result.sort((a, b) =>
            (a.category || "").localeCompare(b.category || "")
          );
          console.log("Applied category_asc sort");
          break;
        case "category_desc":
          result.sort((a, b) =>
            (b.category || "").localeCompare(a.category || "")
          );
          console.log("Applied category_desc sort");
          break;
        case "subCategory_asc":
          result.sort((a, b) =>
            (a.subCategory || "").localeCompare(b.subCategory || "")
          );
          console.log("Applied subCategory_asc sort");
          break;
        case "subCategory_desc":
          result.sort((a, b) =>
            (b.subCategory || "").localeCompare(a.subCategory || "")
          );
          console.log("Applied subCategory_desc sort");
          break;
        case "product_asc":
          result.sort((a, b) =>
            (a.product || "").localeCompare(b.product || "")
          );
          console.log("Applied product_asc sort");
          break;
        case "product_desc":
          result.sort((a, b) =>
            (b.product || "").localeCompare(a.product || "")
          );
          console.log("Applied product_desc sort");
          break;
        case "unitsSold_asc":
          result.sort((a, b) => (a.unitsSold || 0) - (b.unitsSold || 0));
          console.log("Applied unitsSold_asc sort");
          break;
        case "unitsSold_desc":
          result.sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0));
          console.log("Applied unitsSold_desc sort");
          break;
        case "totalRevenue_asc":
          result.sort((a, b) => (a.totalRevenue || 0) - (b.totalRevenue || 0));
          console.log("Applied totalRevenue_asc sort");
          break;
        case "totalRevenue_desc":
          result.sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0));
          console.log("Applied totalRevenue_desc sort");
          break;
        case "averagePrice_asc":
          result.sort((a, b) => (a.averagePrice || 0) - (b.averagePrice || 0));
          console.log("Applied averagePrice_asc sort");
          break;
        case "averagePrice_desc":
          result.sort((a, b) => (b.averagePrice || 0) - (a.averagePrice || 0));
          console.log("Applied averagePrice_desc sort");
          break;
        default:
          console.log(
            "No matching sort value for product wise data:",
            filterState.sortValue
          );
          break;
      }
      console.log("After sort (product wise):", result);
    }

    console.log("Final filtered product wise data:", result);
    return result;
  }, [ProductWiseData, filterState]);

  const categoryWiseDataFiltered = useMemo(() => {
    if (
      !categoryWiseDataList ||
      !categoryWiseDataList.data ||
      categoryWiseDataList.data.length === 0
    ) {
      console.log("Category wise data empty or null, returning empty array");
      return [];
    }

    let result = [...categoryWiseDataList.data];

    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.category?.toLowerCase().includes(query) ||
          String(item.unitsSold).includes(query) ||
          String(item.totalOrders).includes(query) ||
          String(item.totalRevenue).includes(query) ||
          String(item.averagePrice).includes(query) ||
          String(item.percentageShare).includes(query)
      );
      console.log("After search filter (category wise):", result);
    }

    if (filterState.filterValue) {
      console.log(
        "Filtering category wise data with filterValue:",
        filterState.filterValue
      );
      result = result.filter((item) => {
        if (filterState.filterValue === "Uncategorized") {
          return item.category === "Uncategorized";
        }
        console.log(
          "No matching filter value for category wise data:",
          filterState.filterValue
        );
        return false;
      });
      console.log("After filter (category wise):", result);
    }

    if (filterState.sortValue) {
      console.log(
        "Sorting category wise data with sortValue:",
        filterState.sortValue
      );
      switch (filterState.sortValue) {
        case "category_asc":
          result.sort((a, b) =>
            (a.category || "").localeCompare(b.category || "")
          );
          console.log("Applied category_asc sort");
          break;
        case "category_desc":
          result.sort((a, b) =>
            (b.category || "").localeCompare(a.category || "")
          );
          console.log("Applied category_desc sort");
          break;
        case "unitsSold_asc":
          result.sort((a, b) => (a.unitsSold || 0) - (b.unitsSold || 0));
          console.log("Applied unitsSold_asc sort");
          break;
        case "unitsSold_desc":
          result.sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0));
          console.log("Applied unitsSold_desc sort");
          break;
        case "totalOrders_asc":
          result.sort((a, b) => (a.totalOrders || 0) - (b.totalOrders || 0));
          console.log("Applied totalOrders_asc sort");
          break;
        case "totalOrders_desc":
          result.sort((a, b) => (b.totalOrders || 0) - (a.totalOrders || 0));
          console.log("Applied totalOrders_desc sort");
          break;
        case "totalRevenue_asc":
          result.sort((a, b) => (a.totalRevenue || 0) - (b.totalRevenue || 0));
          console.log("Applied totalRevenue_asc sort");
          break;
        case "totalRevenue_desc":
          result.sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0));
          console.log("Applied totalRevenue_desc sort");
          break;
        case "averagePrice_asc":
          result.sort((a, b) => (a.averagePrice || 0) - (b.averagePrice || 0));
          console.log("Applied averagePrice_asc sort");
          break;
        case "averagePrice_desc":
          result.sort((a, b) => (b.averagePrice || 0) - (a.averagePrice || 0));
          console.log("Applied averagePrice_desc sort");
          break;
        case "percentageShare_asc":
          result.sort(
            (a, b) => (a.percentageShare || 0) - (b.percentageShare || 0)
          );
          console.log("Applied percentageShare_asc sort");
          break;
        case "percentageShare_desc":
          result.sort(
            (a, b) => (b.percentageShare || 0) - (a.percentageShare || 0)
          );
          console.log("Applied percentageShare_desc sort");
          break;
        default:
          console.log(
            "No matching sort value for category wise data:",
            filterState.sortValue
          );
          break;
      }
      console.log("After sort (category wise):", result);
    }

    console.log("Final filtered category wise data:", result);
    return result;
  }, [categoryWiseDataList, filterState]);

  const subCategoryWiseDataFiltered = useMemo(() => {
    if (
      !subCategoryWiseDataList ||
      !subCategoryWiseDataList.data ||
      subCategoryWiseDataList.data.length === 0
    ) {
      console.log("Subcategory wise data empty or null, returning empty array");
      return [];
    }

    let result = [...subCategoryWiseDataList.data];

    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.subCategory?.toLowerCase().includes(query) ||
          String(item.unitsSold).includes(query) ||
          String(item.totalOrders).includes(query) ||
          String(item.totalRevenue).includes(query) ||
          String(item.averagePrice).includes(query) ||
          String(item.percentageShare).includes(query)
      );
      console.log("After search filter (subcategory wise):", result);
    }

    if (filterState.filterValue) {
      console.log(
        "Filtering subcategory wise data with filterValue:",
        filterState.filterValue
      );
      result = result.filter((item) => {
        if (filterState.filterValue === "Uncategorized_sub") {
          return item.subCategory === "Uncategorized";
        }
        console.log(
          "No matching filter value for subcategory wise data:",
          filterState.filterValue
        );
        return false;
      });
      console.log("After filter (subcategory wise):", result);
    }

    if (filterState.sortValue) {
      console.log(
        "Sorting subcategory wise data with sortValue:",
        filterState.sortValue
      );
      switch (filterState.sortValue) {
        case "subCategory_asc":
          result.sort((a, b) =>
            (a.subCategory || "").localeCompare(b.subCategory || "")
          );
          console.log("Applied subCategory_asc sort");
          break;
        case "subCategory_desc":
          result.sort((a, b) =>
            (b.subCategory || "").localeCompare(a.subCategory || "")
          );
          console.log("Applied subCategory_desc sort");
          break;
        case "unitsSold_asc":
          result.sort((a, b) => (a.unitsSold || 0) - (b.unitsSold || 0));
          console.log("Applied unitsSold_asc sort");
          break;
        case "unitsSold_desc":
          result.sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0));
          console.log("Applied unitsSold_desc sort");
          break;
        case "totalOrders_asc":
          result.sort((a, b) => (a.totalOrders || 0) - (b.totalOrders || 0));
          console.log("Applied totalOrders_asc sort");
          break;
        case "totalOrders_desc":
          result.sort((a, b) => (b.totalOrders || 0) - (a.totalOrders || 0));
          console.log("Applied totalOrders_desc sort");
          break;
        case "totalRevenue_asc":
          result.sort((a, b) => (a.totalRevenue || 0) - (b.totalRevenue || 0));
          console.log("Applied totalRevenue_asc sort");
          break;
        case "totalRevenue_desc":
          result.sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0));
          console.log("Applied totalRevenue_desc sort");
          break;
        case "averagePrice_asc":
          result.sort((a, b) => (a.averagePrice || 0) - (b.averagePrice || 0));
          console.log("Applied averagePrice_asc sort");
          break;
        case "averagePrice_desc":
          result.sort((a, b) => (b.averagePrice || 0) - (a.averagePrice || 0));
          console.log("Applied averagePrice_desc sort");
          break;
        case "percentageShare_asc":
          result.sort(
            (a, b) => (a.percentageShare || 0) - (b.percentageShare || 0)
          );
          console.log("Applied percentageShare_asc sort");
          break;
        case "percentageShare_desc":
          result.sort(
            (a, b) => (b.percentageShare || 0) - (a.percentageShare || 0)
          );
          console.log("Applied percentageShare_desc sort");
          break;
        default:
          console.log(
            "No matching sort value for subcategory wise data:",
            filterState.sortValue
          );
          break;
      }
      console.log("After sort (subcategory wise):", result);
    }

    console.log("Final filtered subcategory wise data:", result);
    return result;
  }, [subCategoryWiseDataList, filterState]);

  const handleSearch = (query: string) => {
    console.log("Search query received:", query);
    setFilterState((prev) => ({ ...prev, searchQuery: query }));
  };

  const handleFilter = (filter: string) => {
    console.log("Filter value received:", filter);
    setFilterState((prev) => ({ ...prev, filterValue: filter }));
  };

  const handleSort = (sort: string) => {
    console.log("Sort value received:", sort);
    setFilterState((prev) => ({ ...prev, sortValue: sort }));
  };

  // Reset sort value when tab changes to avoid invalid sort options
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    setFilterState((prev) => ({ ...prev, sortValue: "" })); // Reset sort when switching tabs
  };

  const productWiseTableData = useMemo(
    () => ({
      columns: [
        { key: "category", title: "Category" },
        { key: "subCategory", title: "Sub Category" },
        { key: "product", title: "Products" },
        { key: "totalRevenue", title: "Revenue" },
      ],
      rows: map(productWiseDataFiltered, (item) => {
        const row = {
          category: item.category || "N/A",
          subCategory: item.subCategory || "N/A",
          product: item.product || "N/A",
          totalRevenue: item.totalRevenue ?? 0,
        };
        console.log("Product wise table row:", row);
        return row;
      }),
    }),
    [productWiseDataFiltered]
  );

  const categoryWiseTableData = useMemo(
    () => ({
      columns: [
        { key: "category", title: "Category" },
        { key: "totalOrders", title: "Total Orders" },
        { key: "totalRevenue", title: "Revenue" },
        { key: "percentageSharee", title: "Percentage Share" },
      ],
      rows: map(categoryWiseDataFiltered, (item) => {
        const row = {
          category: item.category || "N/A",
          totalOrders: item.totalOrders ?? 0,
          totalRevenue: item.totalRevenue ?? 0,
          percentageSharee: <div>{item.percentageShare ?? 0} %</div>,
        };
        console.log("Category wise table row:", row);
        return row;
      }),
    }),
    [categoryWiseDataFiltered]
  );

  const subCategoryTableData = useMemo(
    () => ({
      columns: [
        { key: "subCategory", title: "Sub Category" },
        { key: "totalOrders", title: "Total Orders" },
        { key: "totalRevenue", title: "Revenue" },
        { key: "percentageSharee", title: "Percentage Share" },
      ],
      rows: map(subCategoryWiseDataFiltered, (item) => {
        const row = {
          subCategory: item.subCategory || "N/A",
          totalOrders: item.totalOrders ?? 0,
          totalRevenue: item.totalRevenue ?? 0,
          percentageSharee: <div>{item.percentageShare ?? 0} %</div>,
        };
        console.log("Subcategory wise table row:", row);
        return row;
      }),
    }),
    [subCategoryWiseDataFiltered]
  );

  const tableDataObj: ITable = {
    productWise: productWiseTableData,
    categoryWise: categoryWiseTableData,
    subCategoryWise: subCategoryTableData,
  };

  console.log("Table data for current tab:", tableDataObj[selectedTab]);

  const [modal, setModal] = useState({
    of: "",
    edit: false,
    data: null,
  });
  const closeModal = useCallback(
    () => setModal({ of: "", edit: false, data: null }),
    []
  );

  return (
    <div className="container px-4 py-3 mx-auto">
      <div className="mb-6">
        <Header text="Sales Report" />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Report Settings
            </h3>
            <DateFilter
              value={tabFilters[selectedTab]}
              onChange={handleTabFilterChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-gray-100 rounded-md text-sm">
              <span className="font-medium">Current Period:</span>{" "}
              <span>{tabFilters[selectedTab].period}</span>
            </div>
            <div className="px-3 py-1.5 bg-gray-100 rounded-md text-sm">
              <span className="font-medium">Date:</span>{" "}
              <span>
                {new Date(tabFilters[selectedTab].date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <MasterTable
          loading={
            isProductWiseDataLoading ||
            isCategoryWiseDataLoading ||
            isSubCategoryWiseDataLoading ||
            expensesLoading ||
            expenseCatLoading
          }
          tabsOptions={
            <DynamicTab
              selectedTab={selectedTab}
              setSelectedTab={handleTabChange}
              tabOptions={salesReportTabOption}
            />
          }
          filterSection={
            <SearchFilterSort
              onFilter={handleFilter}
              onSort={handleSort}
              onViewChange={() => {}}
              showFilter={true}
              showSort={true}
              showView={false}
              filterOptions={filterOptions}
              sortOptions={currentSortOptions}
              placeholder="Search products..."
            />
          }
          rows={tableDataObj[selectedTab].rows || []}
          columns={tableDataObj[selectedTab].columns}
          canSelect
        />
      </div>
    </div>
  );
};

export default SalesReport;
