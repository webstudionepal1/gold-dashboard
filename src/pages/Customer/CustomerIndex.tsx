import { useState } from "react";
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
  useDeleteCustomerMutation,
  useGetCustomerQuery,
} from "../../server/api/customerHook";

interface CustomerItem {
  _id: string;
  customer_name: string;
  email: string;
  address: string;
  contact_number: string;
  total_order: string;
}

const CustomerIndex = () => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const {
    data: customers = [],
    isLoading,
    error,
  } = useGetCustomerQuery({ role: "customer" });

  console.log("customer data", customers);

  const customerTableData: CustomerItem[] = customers.map(
    (customer, index) => ({
      _id: customer._id,
      customer_name: customer.name,
      email: customer.email,
      address: customer.address,
      contact_number: customer.phone,
      total_order: customer.orders?.length?.toString() ?? "0",
    })
  );
  const { mutate: deleteCustomer } = useDeleteCustomerMutation();

  const handleDeleteItem = (item: TableData<CustomerItem>) => {
    deleteCustomer(item._id);
  };

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setisViewModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CustomerItem | null>(null);

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

  const filterItems = (items: CustomerItem[]) => {
    return items.filter(
      (item) =>
        item.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item._id?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleViewItem = (item: TableData<CustomerItem>) => {
    navigate(`/customer/customer-details/${item._id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
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

  const columns: ColumnConfig<CustomerItem>[] = [
    { header: "Customer Name", key: "customer_name" },
    { header: "Email", key: "email" },
    { header: "Address", key: "address" },
    { header: "Contact Number", key: "contact_number" },
    { header: "Total Order", key: "total_order" },
  ];

  const renderCustomerTable = (items: CustomerItem[]) => {
    const filteredItems = filterItems(items);
    const paginatedItems = filteredItems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Something went wrong</div>;
    return (
      <Table
        columns={columns}
        data={paginatedItems}
        showEdit={false}
        showDelete={true}
        showView={true}
        showAction={true}
        showSelectAll={true}
        viewRow={handleViewItem}
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
    <>
      <div className="container mx-auto px-4 py-3">
        <Header text="Customer List">
          {/* <button className="px-3 py-2  flex items-center  text-white bg-[#d49327] transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg">
            <Link className="flex items-center" to={FrontendRoutes.ADDCUSTOMER}>
              <Icon
                icon="material-symbols-light:add-rounded"
                width="24"
                height="24"
                className="fill-white"
              />{" "}
              New Customer
            </Link>
          </button> */}
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
          <div className="mx-2">{renderCustomerTable(customerTableData)}</div>
        </div>
      </div>
    </>
  );
};

export default CustomerIndex;
