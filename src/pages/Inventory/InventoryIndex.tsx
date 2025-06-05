import { useState, useEffect } from "react";
import Header from "../../components/shared/table_heading/Header";
import { Link, useNavigate } from "react-router-dom";
import { FrontendRoutes } from "../../routes/routes";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SearchFilterSort } from "../../components/global/SearchFilterSort";
import {
  type ColumnConfig,
  Table,
  type TableData,
} from "../../components/shared/Table";
import {
  useGetAllProductsQuery,
  IFetchProduct,
  IProductCategory,
  IBaseProductSubCategory,
} from "../../server/api/productHooks";

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
  isActive?: boolean;
  _rowStyle?: string; // Custom property for row styling
}

const InventoryIndex = () => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  // const [selectedTab, setSelectedTab] = useState("home_page");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setisViewModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  // Fetch products from API
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useGetAllProductsQuery({});

  console.log(
    isModalOpen,
    selectedFilter,
    selectedSort,
    isViewModalOpen,
    editingItem
  );
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilter = (filter: string) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handleSort = (sort: string) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  // Apply filters and sorting to inventory items
  const applyFiltersAndSort = (items: InventoryItem[]) => {
    // First apply search filter
    let filteredItems = filterItems(items);

    // Then apply category or status filter
    if (selectedFilter) {
      // Check if it's a status filter
      if (["On Stock", "Low Stock", "Out of Stock"].includes(selectedFilter)) {
        filteredItems = filteredItems.filter(
          (item) => item.status === selectedFilter
        );
      } else {
        // It's a category filter
        filteredItems = filteredItems.filter(
          (item) => item.category === selectedFilter
        );
      }
    }

    // Then apply sorting
    if (selectedSort) {
      switch (selectedSort) {
        case "name-asc":
          filteredItems.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          filteredItems.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "price-high":
          filteredItems.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case "price-low":
          filteredItems.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case "weight-high":
          filteredItems.sort((a, b) => (b.wt || 0) - (a.wt || 0));
          break;
        case "weight-low":
          filteredItems.sort((a, b) => (a.wt || 0) - (b.wt || 0));
          break;
        case "stock-high":
          filteredItems.sort((a, b) => b.remainingStock - a.remainingStock);
          break;
        case "stock-low":
          filteredItems.sort((a, b) => a.remainingStock - b.remainingStock);
          break;
        default:
          break;
      }
    }

    return filteredItems;
  };

  const filterItems = (items: InventoryItem[]) => {
    if (!searchQuery) return items;

    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item._id?.toLowerCase().includes(query) ||
        (item.category && item.category.toLowerCase().includes(query)) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(query)) ||
        item.status.toLowerCase().includes(query) ||
        (item.unit && item.unit.toLowerCase().includes(query)) ||
        (item.price !== undefined && item.price.toString().includes(query)) ||
        (item.wt !== undefined && item.wt.toString().includes(query)) ||
        item.totalStock.toString().includes(query) ||
        item.remainingStock.toString().includes(query) ||
        item.usedStock.toString().includes(query) ||
        item.reorder_point.toString().includes(query)
    );
  };

  const handleViewItem = (item: TableData<InventoryItem>) => {
    navigate(`${FrontendRoutes.CUSTOMERDETAILS}`);
  };

  const handleEditItem = (item: TableData<InventoryItem>) => {
    // Convert TableData<InventoryItem> to InventoryItem
    const inventoryItem: InventoryItem = {
      _id: item._id,
      name: item.name,
      totalStock: item.totalStock,
      remainingStock: item.remainingStock,
      usedStock: item.usedStock,
      unit: item.unit,
      reorder_point: item.reorder_point,
      status: item.status,
      image: item.image,
      category: item.category,
      subCategory: item.subCategory,
      price: item.price,
      wt: item.wt,
      isActive: item.isActive,
    };
    setEditingItem(inventoryItem);
    setIsModalOpen(true);
    console.log(item);
  };

  const handleDeleteItem = (item: TableData<InventoryItem>) => {
    console.log("Delete item:", item);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
  };

  // Get unique categories from products for filter options
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [statusOptions, setStatusOptions] = useState<
    { value: string; label: string }[]
  >([
    { value: "", label: "All Status" },
    { value: "On Stock", label: "On Stock" },
    { value: "Low Stock", label: "Low Stock" },
    { value: "Out of Stock", label: "Out of Stock" },
  ]);

  useEffect(() => {
    if (products) {
      // Extract unique categories
      const categories = new Set<string>();
      products.forEach((product) => {
        if (
          product.category &&
          typeof product.category === "object" &&
          "name" in product.category &&
          product.category.name
        ) {
          categories.add(product.category.name);
        }
      });

      // Create filter options
      const options = [{ value: "", label: "All Products" }];
      categories.forEach((category) => {
        options.push({ value: category, label: category });
      });

      setCategoryOptions(options);
    }
  }, [products]);

  const filterOptions = [
    ...(categoryOptions.length > 0
      ? categoryOptions
      : [{ value: "", label: "All Products" }]),
    ...statusOptions,
  ];

  const sortOptions = [
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Stock":
        return "bg-[#e9fbef] text-[#1dc45e] px-8";
      case "Low Stock":
        return "bg-[#fffae6] text-[#ffcc01] px-8";
      case "Out of Stock":
        return "bg-[#ffeceb] text-[#ff3a2f] px-7";

      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Transform products to inventory items
  useEffect(() => {
    if (products) {
      const transformedItems = products.flatMap((product) => {
        // Get category and subcategory names
        const categoryName =
          typeof product.category === "object" &&
          product.category &&
          "name" in product.category
            ? (product.category.name as string)
            : "";
        const subCategoryName =
          typeof product.subCategory === "object" &&
          product.subCategory &&
          "name" in product.subCategory
            ? (product.subCategory.name as string)
            : "";

        // If no variants, create a single item with default values
        if (
          !product.variant ||
          !Array.isArray(product.variant) ||
          product.variant.length < 1
        ) {
          return [
            {
              _id: product._id || "",
              name: product.name || "",
              totalStock: 0,
              remainingStock: 0,
              usedStock: 0,
              unit: "",
              reorder_point: 0,
              status: "Out of Stock" as const,
              image:
                product.images &&
                Array.isArray(product.images) &&
                product.images.length > 0
                  ? product.images[0]
                  : undefined,
              category: categoryName,
              subCategory: subCategoryName,
              price: 0,
              wt: 0,
            },
          ];
        }

        // Create an inventory item for each variant
        return product.variant.map((variant, index) => {
          // Determine status based on stock levels
          let status: "On Stock" | "Low Stock" | "Out of Stock" = "On Stock";
          const remainingStock = variant.remainingStock || 0;
          const totalStock = variant.totalStock || 0;
          const reorderPoint =
            variant.reorderPoint || Math.floor(totalStock * 0.2); // Use variant's reorderPoint if available

          if (remainingStock <= 0) {
            status = "Out of Stock";
          } else if (remainingStock <= reorderPoint) {
            // Less than reorder point
            status = "Low Stock";
          }

          return {
            _id: `${product._id}-${index}`,
            name: product.name || "",
            totalStock: totalStock,
            remainingStock: remainingStock,
            usedStock: variant.usedStock || 0,
            unit: variant.unit || "",
            reorder_point: reorderPoint,
            status: status,
            image:
              product.images &&
              Array.isArray(product.images) &&
              product.images.length > 0
                ? product.images[0]
                : undefined,
            category: categoryName,
            subCategory: subCategoryName,
            price: variant.price || 0,
            wt: variant.wt || 0,
          };
        });
      });

      setInventoryItems(transformedItems);
      setIsLoading(false);
    }
  }, [products]);

  const columns: ColumnConfig<InventoryItem>[] = [
    {
      key: "name",
      header: "Items",
      render: (_: any, row: any) => (
        <div className="flex items-center">
          <img
            src={
              row.image
                ? row.image
                : "https://imgs.search.brave.com/N7iiPmgTwP6DQJtXQfwaAm-6xOmlKftSIdIkAcau0yk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE5/ODI1MjY3Mi9waG90/by9lbmdhZ2VtZW50/LWRpYW1vbmQtcmlu/Zy1qZXdlbHJ5LWlz/b2xhdGVkLW9uLXdo/aXQlRDElODMtYmFj/a2dyb3VuZC5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9cDFu/Q2o0SDBkWnFURlBs/YTVxT0hMSnRDQUZJ/Y0F6NW5zeGU2UDJs/cWdXMD0"
            }
            alt={row.name}
            className="w-10 h-10 rounded-md mr-3 object-cover"
          />
          <div>
            <h1 className="font-medium text-gray-900">{row.name}</h1>
            <p className=" text-[#8795a8]">
              ID:{row._id.split("-")[0].substring(0, 8)}
            </p>
          </div>
        </div>
      ),
    },
    { header: "Category", key: "category" },
    {
      header: "Price",
      key: "price",
      render: (value, row) => (
        <span className="font-medium text-blue-600">
          ${row.price?.toFixed(2) || "0.00"}
        </span>
      ),
    },
    {
      header: "Weight",
      key: "wt",
      render: (value, row) => <span>{row.wt || "0"}</span>,
    },
    {
      header: "Total Stock",
      key: "totalStock",
      render: (value, row) => (
        <span className="font-medium">{row.totalStock}</span>
      ),
    },
    {
      header: "Remaining",
      key: "remainingStock",
      render: (value, row) => {
        let colorClass = "text-green-600";
        if (row.remainingStock <= 0) {
          colorClass = "text-red-600";
        } else if (row.remainingStock <= row.reorder_point) {
          colorClass = "text-yellow-600";
        }
        return (
          <span className={`font-medium ${colorClass}`}>
            {row.remainingStock}
          </span>
        );
      },
    },
    {
      header: "Used",
      key: "usedStock",
      render: (value, row) => (
        <span className="font-medium">{row.usedStock}</span>
      ),
    },
    { header: "Unit", key: "unit" },
    {
      header: "Reorder Point",
      key: "reorder_point",
      render: (value, row) => {
        const isLowStock = row.remainingStock <= row.reorder_point;
        return (
          <div className="flex items-center">
            <span
              className={`font-medium ${
                isLowStock ? "text-yellow-600" : "text-gray-600"
              }`}
            >
              {row.reorder_point}
            </span>
            {isLowStock && (
              <span className="ml-2 text-yellow-600">
                <Icon icon="mdi:alert-circle-outline" width="16" height="16" />
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "Status",
      key: "status",
      render: (value, row) => {
        const statusIcons: Record<string, string> = {
          "On Stock": "mdi:check-circle",
          "Low Stock": "mdi:alert-circle",
          "Out of Stock": "mdi:close-circle",
        };

        return (
          <div className="flex items-center">
            <span
              className={`px-5 py-1 rounded-full text-xs ${getStatusColor(
                row.status
              )}`}
            >
              {row.status}
            </span>
            <span className="ml-2">
              <Icon
                icon={statusIcons[row.status] || "mdi:help-circle"}
                width="16"
                height="16"
                className={
                  getStatusColor(row.status).includes("text-")
                    ? getStatusColor(row.status).split("text-")[1].split(" ")[0]
                    : ""
                }
              />
            </span>
          </div>
        );
      },
    },
  ];

  const renderInventoryTable = (items: InventoryItem[]) => {
    const filteredAndSortedItems = applyFiltersAndSort(items);

    // Add a custom property to each row to determine background color
    const dataWithRowStyles: TableData<InventoryItem>[] =
      filteredAndSortedItems.map((item) => {
        let rowStyle = "";

        // Apply red background for out of stock items
        if (item.remainingStock <= 0) {
          rowStyle = "bg-fade-red";
        }
        // Apply yellow background for low stock items (at or below reorder point)
        else if (item.remainingStock <= item.reorder_point) {
          rowStyle = "bg-fade-yellow";
        }

        return {
          ...item,
          _rowStyle: rowStyle, // Add custom property for styling
        };
      });

    return (
      <Table
        columns={columns}
        data={dataWithRowStyles}
        showEdit={true}
        showDelete={true}
        showView={true}
        showAction={true}
        showSelectAll={true}
        viewRow={handleViewItem}
        editRow={handleEditItem}
        deleteRow={handleDeleteItem}
        showPagination={true}
        paginationDetails={{
          currentPage,
          limit: itemsPerPage,
          totalCount: filteredAndSortedItems.length,
        }}
        onItemsPerPageChange={handleItemsPerPageChange}
        onPageChange={handlePageChange}
        showBg={false} // Turn off the default background
      />
    );
  };

  // Render loading state
  const renderLoading = () => {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d49327]"></div>
      </div>
    );
  };

  // Render error state
  const renderError = (errorMessage: string) => {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-red-500">
          <p>Error loading inventory data: {errorMessage}</p>
        </div>
      </div>
    );
  };

  // Render empty state
  const renderEmpty = () => {
    return (
      <div className="flex flex-col justify-center items-center h-40">
        <Icon
          icon="mdi:inventory"
          width="48"
          height="48"
          className="text-gray-400 mb-2"
        />
        <p className="text-gray-500">No inventory items found</p>
      </div>
    );
  };

  return (
    <>
      <div className="container mx-auto px-4 py-3">
        <Header text="Inventory">
          <button className="px-3 py-2  flex items-center  text-white bg-[#d49327] transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg">
            <Link className="flex items-center" to="/product/add">
              <Icon
                icon="material-symbols-light:add-rounded"
                width="24"
                height="24"
                className="fill-white"
              />{" "}
              New Product
            </Link>
          </button>
        </Header>

        <div className="bg-[#ffffff] border-[#dcdddf] pb-[1rem] border rounded-xl">
          <div className="p-4">
            <SearchFilterSort
              onSearch={handleSearch}
              onFilter={handleFilter}
              onSort={handleSort}
              filterOptions={filterOptions}
              sortOptions={sortOptions}
              placeholder="Search here..."
            />
          </div>
          <div className="mx-2">
            {productsLoading
              ? renderLoading()
              : productsError
              ? renderError(
                  typeof productsError === "string"
                    ? productsError
                    : "Failed to load products"
                )
              : inventoryItems.length === 0
              ? renderEmpty()
              : renderInventoryTable(inventoryItems)}
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryIndex;
