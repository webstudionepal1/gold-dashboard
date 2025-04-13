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
import {
  categoryWiseData,
  generalData,
  individualData,
  voucherData,
} from "./dummyData/data";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Modal } from "../../components/shared/Modal";
import { AttributeForm } from "./components/AttributeForm";
import { VoucherForm } from "./components/VoucherForm";
import { DiscountForm } from "./components/DiscountForm/DiscountForm";
import { DiscountModal } from "./components/DiscountModal";
import Header from "../../components/shared/table_heading/Header";

interface GeneralItem {
  _id: string;
  name: string;
  value: string;
  isActive: boolean;
  status: string;
}
interface CategoryItem {
  _id: string;
  category_name: string;
  sub_category: string;
  type: string;
  discount: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface IndividualItem {
  _id: string;
  product_name: string;
  type: string;
  discount: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface VoucherItem {
  _id: string;
  code: string;
  type: string;
  discount: string;
  start_date: string;
  end_date: string;
  status: string;
  isActive: boolean;
}

const AttributeIndex: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  console.log(selectedFilter);
  console.log(selectedSort);

  // for tabs
  const [activeTab, setActiveTab] = useState("general");

  // for modal
  const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
  const closeModal = () => {
    setIsAttributeModalOpen(false);
  };
  // for + add attribute button
  const handleAddButtonClick = () => {
    switch (activeTab) {
      case "general":
        setIsAttributeModalOpen(true);
        break;
      case "voucher":
        setIsVoucherModalOpen(true);
        break;

      case "discount":
        setIsDiscountModalOpen(true);
        break;

      default:
        break;
    }
  };
  // for voucher modal
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  // for discount modal
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

  const closeVoucherModal = () => {
    setIsVoucherModalOpen(false);
  };
  const closeDiscountModal = () => {
    setIsDiscountModalOpen(false);
  };
  const filterOptions = [
    { value: "", label: "All Customers" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const sortOptions = [
    { value: "", label: "Default" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "orders-high", label: "Orders (High)" },
    { value: "orders-low", label: "Orders (Low)" },
  ];

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "On Stock":
  //       return "bg-green-100 text-green-800";
  //     case "Low Stock":
  //       return "bg-yellow-100 text-yellow-800";
  //     case "Out of Stock":
  //       return "bg-red-100 text-red-800";
  //     default:
  //       return "bg-gray-100 text-gray-800";
  //   }
  // };

  const filterItems = (items: GeneralItem[]) => {
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item._id?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // View functionalities
  // View functionality for general
  const [selectedGeneralItem, setSelectedGeneralItem] =
    useState<GeneralItem | null>(null);
  const [isGeneralViewModalOpen, setIsGeneralViewModalOpen] = useState(false);

  const handleViewItem = (item: TableData<GeneralItem>) => {
    setSelectedGeneralItem(item);
    setIsGeneralViewModalOpen(true);
  };

  // View functionality for Voucher
  const [selectedVoucherItem, setSelectedVoucherItem] =
    useState<VoucherItem | null>(null);
  const [isVoucherViewModalOpen, setIsVoucherViewModalOpen] = useState(false);
  const handleViewVoucherItem = (item: TableData<VoucherItem>) => {
    setSelectedVoucherItem(item);
    setIsVoucherViewModalOpen(true);
  };

  // View functionality for Discount category wise
  const [selectedDiscountCategoryItem, setSelectedDiscountCategoryItem] =
    useState<CategoryItem | null>(null);
  const [isDiscountCategoryViewModalOpen, setIsDiscountCategoryViewModalOpen] =
    useState(false);
  const handleViewCategoryItem = (item: TableData<CategoryItem>) => {
    setSelectedDiscountCategoryItem(item);
    setIsDiscountCategoryViewModalOpen(true);
  };

  // View functionality for Discount Individual

  const [selectedDiscountIndividualItem, setSelectedDiscountIndividualItem] =
    useState<IndividualItem | null>(null);
  const [
    isDiscountIndividualViewModalOpen,
    setIsDiscountIndividualViewModalOpen,
  ] = useState(false);
  const handleViewIndividualItem = (item: TableData<IndividualItem>) => {
    setSelectedDiscountIndividualItem(item);
    setIsDiscountIndividualViewModalOpen(true);
  };

  // ---------------------------------------------------------------------------------------

  const handleEditItem = (item: TableData<GeneralItem>) => {
    setSelectedGeneralItem(item);
    setIsAttributeModalOpen(true);
  };
  const handleEditCategoryItem = (item: TableData<CategoryItem>) => {
    setSelectedDiscountCategoryItem(item);
    setIsDiscountModalOpen(true);
  };
  const handleEditIndividualItem = (item: TableData<IndividualItem>) => {
    setSelectedDiscountIndividualItem(item);
    setIsDiscountModalOpen(true);
  };

  const handleEditVoucherItem = (item: TableData<VoucherItem>) => {
    setSelectedVoucherItem(item);
    setIsVoucherModalOpen(true);
  };

  const handleDeleteItem = (item: TableData<GeneralItem>) => {
    console.log("Delete item:", item);
  };

  const handleDeleteCategoryItem = (item: TableData<CategoryItem>) => {
    console.log("Delete Category item:", item);
  };

  const handleDeleteIndividualItem = (item: TableData<IndividualItem>) => {
    console.log("Delete Individual item:", item);
  };

  const handleDeleteVoucherItem = (item: TableData<VoucherItem>) => {
    console.log("Delete Individual item:", item);
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

  // for tabs
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const renderButtonText = () => {
    switch (activeTab) {
      case "general":
        return (
          <>
            <Icon
              icon="material-symbols-light:add-rounded"
              width="24"
              height="24"
              className="fill-white"
            />{" "}
            Add Attribute
          </>
        );
      case "discount":
        return (
          <>
            <Icon
              icon="material-symbols-light:add-rounded"
              width="24"
              height="24"
              className="fill-white"
            />{" "}
            Add Discount
          </>
        );
      case "voucher":
        return (
          <>
            <Icon
              icon="material-symbols-light:add-rounded"
              width="24"
              height="24"
              className="fill-white"
            />{" "}
            Add Voucher
          </>
        );
      default:
        return (
          <>
            <Icon
              icon="material-symbols-light:add-rounded"
              width="24"
              height="24"
              className="fill-white"
            />{" "}
            Add Attribute
          </>
        );
    }
  };

  const columns: ColumnConfig<GeneralItem>[] = [
    {
      header: "Attribute Category",
      key: "name",
    },

    {
      header: "Value",
      key: "value",
    },
  ];

  const renderGeneralTable = (items: GeneralItem[]) => {
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
        showBg={false}
      />
    );
  };
  const categoryColumns: ColumnConfig<CategoryItem>[] = [
    {
      header: "Category Name",
      key: "category_name",
      render: (_, row) => (
        <div className="font-medium text-gray-900">{row.category_name}</div>
      ),
    },
    { header: "Sub Category", key: "sub_category" },
    { header: "Type", key: "type" },
    { header: "Discount", key: "discount" },
    { header: "Start Date", key: "start_date" },
    { header: "End Date", key: "end_date" },
    {
      header: "Status",
      key: "status",
      render: (_, row) => {
        return (
          <span
            className={`inline-block px-3 py-1 text-xs font-semibold  rounded-full ${
              row.status === "Active"
                ? "bg-[#e9fbee] text-green"
                : "bg-[#feeeee] text-red"
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
  ];

  const individualColumns: ColumnConfig<IndividualItem>[] = [
    {
      header: "Product Name",
      key: "product_name",
      render: (_, row) => (
        <div className="font-medium text-gray-900">{row.product_name}</div>
      ),
    },
    { header: "Type", key: "type" },
    { header: "Discount", key: "discount" },
    { header: "Start Date", key: "start_date" },
    { header: "End Date", key: "end_date" },
    {
      header: "Status",
      key: "status",
      render: (_, row) => {
        return (
          <span
            className={`inline-block px-3 py-1 text-xs font-semibold  rounded-full ${
              row.status === "Active"
                ? "bg-[#e9fbee] text-green"
                : "bg-[#feeeee] text-red"
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
  ];
  const renderCategoryTable = (items: CategoryItem[]) => {
    return (
      <Table
        columns={categoryColumns}
        data={items}
        showEdit={true}
        showDelete={true}
        showView={true}
        showAction={true}
        showSelectAll={true}
        viewRow={handleViewCategoryItem}
        editRow={handleEditCategoryItem}
        deleteRow={handleDeleteCategoryItem}
        showPagination={true}
        paginationDetails={{
          currentPage,
          limit: itemsPerPage,
          totalCount: items.length,
        }}
        onItemsPerPageChange={handleItemsPerPageChange}
        onPageChange={handlePageChange}
        showBg={true}
      />
    );
  };

  const renderIndividualTable = (items: IndividualItem[]) => {
    return (
      <Table
        columns={individualColumns}
        data={items}
        showEdit={true}
        showDelete={true}
        showView={true}
        showAction={true}
        showSelectAll={true}
        viewRow={handleViewIndividualItem}
        editRow={handleEditIndividualItem}
        deleteRow={handleDeleteIndividualItem}
        showPagination={true}
        paginationDetails={{
          currentPage,
          limit: itemsPerPage,
          totalCount: items.length,
        }}
        onItemsPerPageChange={handleItemsPerPageChange}
        onPageChange={handlePageChange}
        showBg={true}
      />
    );
  };
  const voucherColumns: ColumnConfig<VoucherItem>[] = [
    {
      header: "Code",
      key: "code",
      render: (_, row) => <div>{row.code}</div>,
    },
    { header: "Type", key: "type" },
    { header: "Discount", key: "discount" },
    { header: "Start Date", key: "start_date" },
    { header: "End Date", key: "end_date" },
    {
      header: "Status",
      key: "status",
      render: (_, row) => {
        return (
          <span
            className={`inline-block px-3 py-1 text-xs font-semibold  rounded-full ${
              row.status === "Active"
                ? "bg-[#e9fbee] text-green" // Green if "active"
                : "bg-[#feeeee] text-red"
            }`}
          >
            {row.status} {/* Displaying original status value */}
          </span>
        );
      },
    },
  ];

  const renderVoucherTable = (items: VoucherItem[]) => {
    return (
      <Table
        columns={voucherColumns}
        data={items}
        showEdit={true}
        showDelete={true}
        showView={true}
        showAction={true}
        showSelectAll={true}
        viewRow={handleViewVoucherItem}
        editRow={handleEditVoucherItem}
        deleteRow={handleDeleteVoucherItem}
        showPagination={true}
        paginationDetails={{
          currentPage,
          limit: itemsPerPage,
          totalCount: items.length,
        }}
        onItemsPerPageChange={handleItemsPerPageChange}
        onPageChange={handlePageChange}
        showBg={true}
      />
    );
  };
  return (
    <div className="container mx-auto px-4 py-3">
      <Header
        text="Attribute"
        button={
          <button
            onClick={handleAddButtonClick}
            className="px-3 py-2  flex items-center  text-white bg-[#d49327] transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg"
          >
            {renderButtonText()}
          </button>
        }
      />
      <div className="flex items-center justify-between ">
        {/* <h1 className="text-2xl font-bold text-gray-800 ">Attribute</h1>

        <button
          onClick={handleAddButtonClick}
          className="px-3 py-2  flex items-center  text-white bg-[#d49327] transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg"
        >
          {renderButtonText()}
        </button> */}

        {isAttributeModalOpen && (
          <Modal>
            <AttributeForm
              closeModal={closeModal}
              onSubmit={() => console.log("submit")}
            />
          </Modal>
        )}

        {isAttributeModalOpen && selectedGeneralItem && (
          <Modal>
            <AttributeForm
              closeModal={() => {
                setSelectedGeneralItem(null);
                closeModal();
              }}
              initialValues={{
                category: selectedGeneralItem.name,
                value: selectedGeneralItem.value,
              }}
              onSubmit={() => console.log("submit")}
            />
          </Modal>
        )}
        {isGeneralViewModalOpen && selectedGeneralItem && (
          <Modal>
            <div className="p-4 space-y-3">
              <h2 className="text-lg font-semibold mb-2">Attribute Details</h2>
              <p>
                <strong>Name:</strong> {selectedGeneralItem.name}
              </p>
              <p>
                <strong>Value:</strong> {selectedGeneralItem.value}
              </p>
              <p>
                <strong>Status:</strong> {selectedGeneralItem.status}
              </p>
              <button
                onClick={() => setIsGeneralViewModalOpen(false)}
                className="mt-4 px-4 py-2 bg-[#d49329] text-white rounded"
              >
                Close
              </button>
            </div>
          </Modal>
        )}
        {isDiscountCategoryViewModalOpen && selectedDiscountCategoryItem && (
          <Modal>
            <div className="p-4 space-y-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center justify-center">
                Discount Category-Wise Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <strong>Category Name:</strong>{" "}
                  {selectedDiscountCategoryItem.category_name}
                </div>
                <div>
                  <strong>Sub Category:</strong>{" "}
                  {selectedDiscountCategoryItem.sub_category}
                </div>
                <div>
                  <strong>Type:</strong> {selectedDiscountCategoryItem.type}
                </div>
                <div>
                  <strong>Discount:</strong>{" "}
                  {selectedDiscountCategoryItem.discount}
                </div>
                <div>
                  <strong>Start Date:</strong>{" "}
                  {selectedDiscountCategoryItem.start_date}
                </div>
                <div>
                  <strong>End Date:</strong>{" "}
                  {selectedDiscountCategoryItem.end_date}
                </div>
                <div>
                  <strong>Status:</strong> {selectedDiscountCategoryItem.status}
                </div>
              </div>

              <button
                onClick={() => setIsDiscountCategoryViewModalOpen(false)}
                className="mt-6 px-4 py-2 bg-[#d49329] text-white rounded"
              >
                Close
              </button>
            </div>
          </Modal>
        )}

        {isDiscountCategoryViewModalOpen && selectedDiscountCategoryItem && (
          <DiscountModal>
            <DiscountForm
              closeModal={closeDiscountModal}
              mode="edit"
              initialValues={{
                type: "category",
                data: [selectedDiscountCategoryItem],
              }}
            />
          </DiscountModal>
        )}
        {isDiscountIndividualViewModalOpen &&
          selectedDiscountIndividualItem && (
            <Modal>
              <div className="p-4 space-y-4">
                <h2 className="text-lg font-semibold mb-4 flex items-center justify-center">
                  Discount Individual Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <strong>Product Name:</strong>{" "}
                    {selectedDiscountIndividualItem.product_name}
                  </div>
                  <div>
                    <strong>Type:</strong> {selectedDiscountIndividualItem.type}
                  </div>
                  <div>
                    <strong>Discount:</strong>{" "}
                    {selectedDiscountIndividualItem.discount}
                  </div>

                  <div>
                    <strong>Start Date:</strong>{" "}
                    {selectedDiscountIndividualItem.start_date}
                  </div>
                  <div>
                    <strong>End Date:</strong>{" "}
                    {selectedDiscountIndividualItem.end_date}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    {selectedDiscountIndividualItem.status}
                  </div>
                </div>

                <button
                  onClick={() => setIsDiscountIndividualViewModalOpen(false)}
                  className="mt-6 px-4 py-2 bg-[#d49329] text-white rounded"
                >
                  Close
                </button>
              </div>
            </Modal>
          )}

        {isDiscountIndividualViewModalOpen &&
          selectedDiscountIndividualItem && (
            <DiscountModal>
              <DiscountForm
                closeModal={closeDiscountModal}
                mode="edit"
                initialValues={{
                  type: "individual",
                  data: [selectedDiscountIndividualItem], // must be an array
                }}
              />
            </DiscountModal>
          )}

        {isVoucherViewModalOpen && selectedVoucherItem && (
          <Modal>
            <div className="p-4 space-y-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center justify-center">
                Voucher Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <strong>Code:</strong> {selectedVoucherItem.code}
                </div>
                <div>
                  <strong>Type:</strong> {selectedVoucherItem.type}
                </div>
                <div>
                  <strong>Discount:</strong> {selectedVoucherItem.discount}
                </div>
                <div>
                  <strong>Start Date:</strong> {selectedVoucherItem.start_date}
                </div>
                <div>
                  <strong>End Date:</strong> {selectedVoucherItem.end_date}
                </div>
                <div>
                  <strong>Status:</strong> {selectedVoucherItem.status}
                </div>
              </div>

              <button
                onClick={() => setIsVoucherViewModalOpen(false)}
                className="mt-6 px-4 py-2 bg-[#d49329] text-white rounded"
              >
                Close
              </button>
            </div>
          </Modal>
        )}

        {isVoucherModalOpen && (
          <Modal>
            <VoucherForm
              onSubmit={() => console.log("submit")}
              closeModal={closeVoucherModal}
            />
          </Modal>
        )}

        {isVoucherModalOpen && selectedVoucherItem && (
          <Modal>
            <VoucherForm
              closeModal={() => {
                setSelectedVoucherItem(null);
                closeVoucherModal();
              }}
              initialValues={{
                code: selectedVoucherItem?.code || "",
                type: selectedVoucherItem?.type || "",
                discount: selectedVoucherItem?.discount || "",
                startDate: selectedVoucherItem?.start_date || "",
                endDate: selectedVoucherItem?.end_date || "",
              }}
              onSubmit={(data) => console.log("submit", data)}
            />
          </Modal>
        )}
        {isDiscountModalOpen && (
          <DiscountModal>
            <DiscountForm closeModal={closeDiscountModal} />
          </DiscountModal>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <Tabs
          defaultValue="general"
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="flex items-center justify-between ">
            <TabsList className="bg-transparent p-0 h-auto">
              <TabsTrigger
                value="general"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                General
              </TabsTrigger>
              <TabsTrigger
                value="discount"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                Discount
              </TabsTrigger>
              <TabsTrigger
                value="voucher"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                Voucher
              </TabsTrigger>
            </TabsList>
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

          <TabsContent value="general" className="px-4 pb-4">
            {renderGeneralTable(generalData)}
          </TabsContent>

          <TabsContent value="discount" className="px-4 pb-4 space-y-8">
            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-700">
                Category-Wise
              </h2>
              {renderCategoryTable(categoryWiseData)}
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-700">
                Individual
              </h2>
              {renderIndividualTable(individualData)}
            </div>
          </TabsContent>

          <TabsContent value="voucher" className="px-4 pb-4">
            {renderVoucherTable(voucherData)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AttributeIndex;
