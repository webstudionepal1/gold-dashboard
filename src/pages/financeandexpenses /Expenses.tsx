import type React from "react";
import { useState } from "react";
import { ColumnConfig, Table, TableData } from "../../components/shared/Table";
import { SearchFilterSort } from "../../components/global/SearchFilterSort";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/shared/tab";

import { useOutsideClick } from "../../hooks/UseOutsideClick";
import InvoiceSlip from "./components/InvoiceSlip";
import { Icon } from "@iconify/react/dist/iconify.js";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseCategoryForm from "./components/ExpenseCategoryForm";

interface Transaction {
  _id: string;
  date?: string;
  expensesId?: string;
  category?: string;
  purchaseId?: string;
  description?: string;
  amount?: string;
  sn?: string;
  image?: string;
}

const Expenses: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSort, setSelectedSort] = useState("");

  const [selectedForm, setSelectedForm] = useState("expenses");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const modalRef = useOutsideClick(() => setIsModalOpen(false));

  // Sample inventory data for different tabs
  const [Expenses] = useState<Transaction[]>([
    {
      _id: "1",
      date: "2023-01-12",
      expensesId: "#012",
      category: "inventory",
      purchaseId: "#39",
      description: "Purchase of rice and lentils",
      amount: "Rs 1290",
      image: "/invoice.png",
    },
    {
      _id: "3",
      date: "2023-01-12",
      expensesId: "#012",
      category: "inventory",
      purchaseId: "#39",
      description: "Purchase of rice and lentils",
      amount: "Rs 1290",
      image: "/invoice.png",
    },
    {
      _id: "2",
      date: "2023-01-12",
      expensesId: "#012",
      category: "inventory",
      purchaseId: "#39",
      description: "Purchase of rice and lentils",
      amount: "Rs 1290",
      image: "/invoice.png",
    },
  ]);

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

  const [Expenses_Category] = useState<Transaction[]>([
    {
      _id: "3",
      sn: "1",
      category: "Manitenence",
    },
    {
      _id: "2",
      sn: "2",
      category: "Manitenence",
    },
    {
      _id: "1",
      sn: "3",
      category: "Manitenence",
    },
  ]);

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

  const filterItems = (items: Transaction[]) => {
    return items.filter((item) =>
      item._id?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleViewItem = (item: TableData<Transaction>) => {
    console.log("View item:", item);
  };

  const handleEditItem = (item: TableData<Transaction>) => {
    console.log("Edit item:", item);
  };

  const handleDeleteItem = (item: TableData<Transaction>) => {
    console.log("Delete item:", item);
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

  const handleClick = () => {
    console.log("clicked");
    setIsModalOpen(true);
  };

  const columns1: ColumnConfig<Transaction>[] = [
    {
      header: "Date",
      key: "date",
    },
    {
      header: "Expense ID",
      key: "expensesId",
    },
    {
      header: "Category",
      key: "category",
    },
    {
      header: "Link Purchase ID",
      key: "purchaseId",
    },
    {
      header: "Description",
      key: "description",
    },
    {
      header: "Amount",
      key: "amount",
    },
    {
      header: "Invoice",
      key: "image",
      render: (item) => (
        <img
          src={item}
          alt="no"
          className="w-10 h-16 rounded-sm object-cover"
          onClick={handleClick}
        />
      ),
    },
  ];
  const columns2: ColumnConfig<Transaction>[] = [
    {
      header: "S.N.",
      key: "sn",
    },
    {
      header: "Category",
      key: "category",
    },
  ];

  const [columns, setColumns] = useState<any>(columns1);

  const renderInventoryTable = (items: Transaction[]) => {
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
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <p className="text-2xl font-bold text-gray-800">Expenses </p>
        <button
          className="flex  items-center gap-2 bg-[#df8d28] rounded-md text-white font-medium px-3 py-2"
          onClick={() => setIsFormOpen(true)}
        >
          <Icon icon="material-symbols:add-2" />
          <span>
            {selectedForm == "expenses" ? "Add Expenses" : "Add Category"}
          </span>
        </button>
      </div>
      <div className="bg-white rounded-lg shadow">
        <Tabs defaultValue="expenses" className="w-full">
          {/* Container for both TabsList and SearchFilterSort */}
          <div className="flex items-center justify-between border-b">
            <TabsList className="bg-transparent p-0 h-auto">
              <TabsTrigger
                value="expenses"
                onClick={() => {
                  setColumns(columns1);
                  setSelectedForm("expenses");
                }}
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                Expenses
              </TabsTrigger>
              <TabsTrigger
                value="expensesCategory"
                onClick={() => {
                  setColumns(columns2);
                  setSelectedForm("category");
                }}
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                Expenses Category
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
          <TabsContent
            value="expenses"
            className="px-4 pb-4 "
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            {renderInventoryTable(Expenses)}
          </TabsContent>
          <TabsContent value="expensesCategory" className="px-4 pb-4">
            {renderInventoryTable(Expenses_Category)}
          </TabsContent>
        </Tabs>
      </div>

      {isModalOpen && (
        <InvoiceSlip modalRef={modalRef} setOpenModal={setIsModalOpen} />
      )}

      {isFormOpen &&
        (selectedForm === "expenses" ? (
          <ExpenseForm modalRef={modalRef} setOpenModal={setIsFormOpen} />
        ) : (
          <ExpenseCategoryForm
            modalRef={modalRef}
            setOpenModal={setIsFormOpen}
          />
        ))}
    </div>
  );
};

export default Expenses;
