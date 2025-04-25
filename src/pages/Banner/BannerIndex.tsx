import type React from "react";
import { useState } from "react";
import { SearchFilterSort } from "../../components/global/SearchFilterSort";
import {
  Table,
  type ColumnConfig,
  type TableData,
} from "../../components/shared/Table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/shared/tab";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Modal } from "../../components/shared";

import { Link } from "react-router-dom";
import { FrontendRoutes } from "../../routes/routes";
import Header from "../../components/shared/table_heading/Header";
import {
  IFetchBanner,
  useDeleteBannerMutation,
  useGetAllBannerQuery,
} from "../../server/api/bannerHook";
import { ScrollableModal } from "../../components/shared/ScrollableModal";

interface BannerItem {
  _id: string;
  title: string;
  banner_type: string;
  image: string[];
  mobImage: string[];

  banner_title?: string;
  description?: string;
  select_by?: string;
  priority?: number;
}

const BannerIndex: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState("");
  console.log(selectedFilter);
  const [selectedSort, setSelectedSort] = useState("");
  console.log(selectedSort);

  const [selectedTab, setSelectedTab] = useState("homepage");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setisViewModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IFetchBanner | null>(null);

  const { data: banners = [], isLoading, error } = useGetAllBannerQuery();
  const { mutate: deleteBanner } = useDeleteBannerMutation();
  console.log("banners", banners);
  const customerTableData: IFetchBanner[] = banners
    .filter((item) => item.locations?.includes(selectedTab))
    .map((banner, index) => ({
      _id: banner._id,
      title: banner.title,
      description: banner.description,
      image: banner.image,
      mobImage: banner.mobImage,
      priority: banner.priority,
      locations: banner.locations,
      type: banner.type,
    }));

  const handleAddBannerClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Sample inventory data for different tabs

  // Filter options for the dropdown
  const filterOptions = [
    { value: "", label: "All Customers" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  // Sort options for the dropdown
  const sortOptions = [
    { value: "", label: "Default" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "orders-high", label: "Orders (High)" },
    { value: "orders-low", label: "Orders (Low)" },
  ];

  const filterItems = (items: IFetchBanner[]) => {
    return items.filter(
      (item) =>
        (item?.title &&
          item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item?._id &&
          item._id.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const handleViewItem = (item: TableData<IFetchBanner>) => {
    // if (selectedTab === "home_page") {
    //   setEditingItem(item);
    // } else if (selectedTab === "other_page") {
    //   setEditingItem(item);
    // }
    setEditingItem(item);
    setisViewModalOpen(true);
  };

  const handleEditItem = (item: TableData<IFetchBanner>) => {
    // Check which tab is selected and set the editing item accordingly
    // if (selectedTab === "home_page") {
    //   setEditingItem(item); // Set the item for the Home Page Banner
    // } else if (selectedTab === "other_page") {
    //   setEditingItem(item); // Set the item for the Other Page Banner
    // }
    setIsModalOpen(true); // Open the modal for either banner
  };

  const handleDeleteItem = (item: TableData<IFetchBanner>) => {
    deleteBanner(item._id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
  };

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

  const columns: ColumnConfig<IFetchBanner>[] = [
    {
      header: "Title",
      key: "title",
    },
    {
      header: "Banner Type",
      key: "type",
    },
    {
      header: "Web Image",
      key: "image",
      render: (_, row) => (
        <div>
          {row.image &&
            row?.image.map((item) => {
              return (
                <img
                  src={`https://gold-api.webstudiomatrix.com/${item}`}
                  width={120}
                  className="rounded-lg"
                />
              );
            })}
        </div>
      ),
    },

    {
      header: "Mobile Image",
      key: "mobImage",
      render: (_, row) => (
        <div>
          {row.mobImage &&
            row?.mobImage.map((item) => {
              return (
                <img
                  src={`https://gold-api.webstudiomatrix.com/${item}`}
                  width={120}
                  className="rounded-lg"
                />
              );
            })}
        </div>
      ),
    },
  ];

  const renderBannerTable = (items: IFetchBanner[]) => {
    const filteredItems = filterItems(items);

    return (
      <Table
        columns={columns}
        data={filteredItems}
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
          totalCount: filteredItems.length,
        }}
        onItemsPerPageChange={handleItemsPerPageChange}
        onPageChange={handlePageChange}
        showBg={true}
      />
    );
  };

  return (
    <div className="container mx-auto px-4 py-3">
      <Header text="Banner">
        <button className="px-3 py-2  flex items-center  text-white bg-[#d49327] transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg">
          <Link className="flex items-center" to={FrontendRoutes.ADDBANNER}>
            <Icon
              icon="material-symbols-light:add-rounded"
              width="24"
              height="24"
              className="fill-white"
            />{" "}
            Add Banner
          </Link>
        </button>
      </Header>
      <div className="bg-white rounded-lg shadow">
        <Tabs
          defaultValue="homepage"
          value={selectedTab}
          onValueChange={(value) => setSelectedTab(value)}
          className="w-full"
        >
          {/* Container for both TabsList and SearchFilterSort */}
          <div className="flex items-center justify-between ">
            <TabsList className="bg-transparent p-0 h-auto">
              <TabsTrigger
                value="homepage"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                Home Page
              </TabsTrigger>
              <TabsTrigger
                value="category-page"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                Category Page
              </TabsTrigger>
              <TabsTrigger
                value="product-page"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                Product Page
              </TabsTrigger>
            </TabsList>

            {/* SearchFilterSort moved here and aligned to the right */}
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
          </div>

          {/* Tab content remains unchanged */}
          <TabsContent value="homepage" className="px-4 pb-4 ">
            {renderBannerTable(customerTableData)}
          </TabsContent>
          <TabsContent value="category-page" className="px-4 pb-4">
            {renderBannerTable(customerTableData)}
          </TabsContent>
          <TabsContent value="product-page" className="px-4 pb-4">
            {renderBannerTable(customerTableData)}
          </TabsContent>
        </Tabs>
      </div>

      {isViewModalOpen && editingItem && (
        <ScrollableModal classname="w-[30%]" onClose={handleCloseModal}>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Banner Details</h2>
            {editingItem && (
              <div className="space-y-2">
                <div>
                  <strong>Title:</strong> {editingItem.title}
                </div>
                <div>
                  <strong>Banner Type:</strong> {editingItem.type}
                </div>
                <div>
                  <strong>Web Image:</strong>{" "}
                  <img
                    src={`https://gold-api.webstudiomatrix.com/${editingItem.image?.[0]}`}
                    alt={editingItem.title}
                    className="w-28 h-14 aspect-w-2 aspect-h-3 rounded-md object-cover"
                  />
                </div>
                <div>
                  <strong>Mobile Image:</strong>{" "}
                  <img
                    src={`https://gold-api.webstudiomatrix.com/${editingItem.mobImage?.[0]}`}
                    alt={editingItem.title}
                    className="w-28 h-14   rounded-md object-cover"
                  />
                </div>
              </div>
            )}
            <button
              onClick={() => setisViewModalOpen(false)}
              className="mt-4 bg-red-500 text-white bg-[#e48a28] transition-transform duration-200 ease-in-out hover:scale-105 py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </ScrollableModal>
      )}
    </div>
  );
};

export default BannerIndex;
