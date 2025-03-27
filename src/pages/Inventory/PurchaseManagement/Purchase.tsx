

import type React from "react"
import { useState } from "react"
import { Table, type TableData, type ColumnConfig } from "../../../components/shared/Table"
import { SearchFilterSort } from "../../../components/global/SearchFilterSort"

interface PurchaseItem {
  _id: string
  purchaseId: string
  supplierName: string
  costPrice: number
  paid: number
  due: number
  qty: number
}

const PurchaseManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedFilter, setSelectedFilter] = useState("")
  const [selectedSort, setSelectedSort] = useState("")

  // Sample purchase data
  const [purchaseItems] = useState<PurchaseItem[]>([
    {
      _id: "1",
      purchaseId: "P-0001",
      supplierName: "Gold supplier pvt ltd",
      costPrice: 45.45,
      paid: 25.45,
      due: 20.0,
      qty: 50,
    },
    {
      _id: "2",
      purchaseId: "P-0002",
      supplierName: "Gold supplier pvt ltd",
      costPrice: 45.45,
      paid: 25.45,
      due: 20.0,
      qty: 50,
    },
    {
      _id: "3",
      purchaseId: "P-0003",
      supplierName: "Gold supplier pvt ltd",
      costPrice: 45.45,
      paid: 25.45,
      due: 20.0,
      qty: 50,
    },
    {
      _id: "4",
      purchaseId: "P-0004",
      supplierName: "Gold supplier pvt ltd",
      costPrice: 45.45,
      paid: 25.45,
      due: 20.0,
      qty: 50,
    },
    {
      _id: "5",
      purchaseId: "P-0005",
      supplierName: "Gold supplier pvt ltd",
      costPrice: 45.45,
      paid: 25.45,
      due: 20.0,
      qty: 50,
    },
    {
      _id: "6",
      purchaseId: "P-0006",
      supplierName: "Gold supplier pvt ltd",
      costPrice: 45.45,
      paid: 25.45,
      due: 20.0,
      qty: 50,
    },
    {
      _id: "7",
      purchaseId: "P-0007",
      supplierName: "Gold supplier pvt ltd",
      costPrice: 45.45,
      paid: 25.45,
      due: 20.0,
      qty: 50,
    },
    {
      _id: "8",
      purchaseId: "P-0008",
      supplierName: "Gold supplier pvt ltd",
      costPrice: 45.45,
      paid: 25.45,
      due: 20.0,
      qty: 50,
    },
    {
      _id: "9",
      purchaseId: "P-0009",
      supplierName: "Gold supplier pvt ltd",
      costPrice: 45.45,
      paid: 25.45,
      due: 20.0,
      qty: 50,
    },
  ])

  // Filter options for the dropdown
  const filterOptions = [
    { value: "", label: "All Purchases" },
    { value: "paid", label: "Fully Paid" },
    { value: "due", label: "Has Due" },
  ]

  // Sort options for the dropdown
  const sortOptions = [
    { value: "", label: "Default" },
    { value: "date-desc", label: "Newest First" },
    { value: "date-asc", label: "Oldest First" },
    { value: "amount-high", label: "Amount (High)" },
    { value: "amount-low", label: "Amount (Low)" },
  ]

  const filterItems = (items: PurchaseItem[]) => {
    return items.filter(
      (item) =>
        item.purchaseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplierName.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  const handleViewItem = (item: TableData<PurchaseItem>) => {
    console.log("View item:", item)
  }

  const handleEditItem = (item: TableData<PurchaseItem>) => {
    console.log("Edit item:", item)
  }

  const handleDeleteItem = (item: TableData<PurchaseItem>) => {
    console.log("Delete item:", item)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit)
    setCurrentPage(1)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleFilter = (filter: string) => {
    setSelectedFilter(filter)
    setCurrentPage(1)
  }

  const handleSort = (sort: string) => {
    setSelectedSort(sort)
    setCurrentPage(1)
  }

  const columns: ColumnConfig<PurchaseItem>[] = [
    {
      header: "Purchase ID",
      key: "purchaseId",
    },
    {
      header: "Supplier Name",
      key: "supplierName",
    },
    {
      header: "Cost Price",
      key: "costPrice",
      render: (_, row) => `$${row.costPrice.toFixed(2)}`,
    },
    {
      header: "Paid",
      key: "paid",
      render: (_, row) => `$${row.paid.toFixed(2)}`,
    },
    {
      header: "Due",
      key: "due",
      render: (_, row) => `$${row.due.toFixed(2)}`,
    },
    {
      header: "QTY",
      key: "qty",
    },
  ]

  const filteredItems = filterItems(purchaseItems)

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Purchase Management</h1>
        <button className="bg-[#DF8D28] hover:bg-[#DF8D28]/90 text-white px-4 py-2 rounded-lg">+ New Purchase</button>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Navigation links */}
        <div className="flex border-b">
          <a href="/purchase" className="px-4 py-3 font-medium text-sm text-[#DF8D28] border-b-2 border-[#DF8D28]">
            Purchase
          </a>
          <a href="/purchase/return" className="px-4 py-3 font-medium text-sm text-gray-500 hover:text-gray-700">
            Purchase Return
          </a>
          <a href="/purchase/suppliers" className="px-4 py-3 font-medium text-sm text-gray-500 hover:text-gray-700">
            Suppliers
          </a>
        </div>

        {/* Search, Filter, Sort */}
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

        {/* Purchase Table */}
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
      </div>
    </div>
  )
}

export default PurchaseManagement

