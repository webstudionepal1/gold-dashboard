
import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { SearchFilterSort } from "../../../components/global/SearchFilterSort"
import { Modal } from "../../../components/shared"
import { Table, type ColumnConfig, type TableData } from "../../../components/shared/Table"
import { useOutsideClick } from "../../../hooks/UseOutsideClick"
import { FrontendRoutes } from "../../../routes/routes"

interface Customer {
  _id: string
  customerId: string
  customerName: string
  email: string
  address: string
  contactNumber: string
  totalOrder: number
  isActive?: boolean
}


const CustomerList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("")
  const [selectedSort, setSelectedSort] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const ref = useOutsideClick(() => setIsModalOpen(false))

  const [customers, setCustomers] = useState<Customer[]>([
    {
      _id: "1",
      customerId: "#12",
      customerName: "Olivia Bennett",
      email: "info@oliviabennett.net",
      address: "321 West Lane, Bloomington, IN 47401",
      contactNumber: "+1234743775",
      totalOrder: 0,
      isActive: true,
    },
    {
      _id: "2",
      customerId: "#12",
      customerName: "Ethan Rivers",
      email: "hello@ethanrivers.org",
      address: "456 Everett Avenue, Portland, OR 97201",
      contactNumber: "+1234743776",
      totalOrder: 0,
      isActive: true,
    },
    {
      _id: "3",
      customerId: "#12",
      customerName: "Sophia Langley",
      email: "contact@sophialangley.com",
      address: "789 Himalayan Road, Seattle, WA 98101",
      contactNumber: "+1234743778",
      totalOrder: 0,
      isActive: true,
    },
  ])

  const [newCustomer, setNewCustomer] = useState<Omit<Customer, "_id">>({
    customerId: "",
    customerName: "",
    email: "",
    address: "",
    contactNumber: "",
    totalOrder: 0,
    isActive: true,
  })

  const handleAddCustomer = () => {
    setModalMode("add")
    setEditingCustomerId(null)
    setNewCustomer({
      customerId: "",
      customerName: "",
      email: "",
      address: "",
      contactNumber: "",
      totalOrder: 0,
      isActive: true,
    })
    setIsModalOpen(true)
  }



  const handleDeleteCustomer = (row: TableData<Customer>) => {
    setCustomers((prev) => prev.filter((o) => o._id !== row._id))
  }

  const handleSaveCustomer = () => {
    if (newCustomer.customerName.trim() && newCustomer.email.trim()) {
      if (modalMode === "add") {
        // Add new customer
        setCustomers((prev) => [
          ...prev,
          {
            ...newCustomer,
            _id: Math.random().toString(),
            customerId: `#${Math.floor(Math.random() * 100)}`,
          },
        ])
      } else {
        // Update existing customer
        setCustomers((prev) =>
          prev.map((customer) => (customer._id === editingCustomerId ? { ...customer, ...newCustomer } : customer)),
        )
      }
      setIsModalOpen(false)
    } else {
      alert("Please fill required fields")
    }
  }

  // Filter options for the dropdown
  const filterOptions = [
    { value: "", label: "All Customers" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ]

  // Sort options for the dropdown
  const sortOptions = [
    { value: "", label: "Default" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "orders-high", label: "Orders (High)" },
    { value: "orders-low", label: "Orders (Low)" },
  ]

  // Filter customers based on search query and selected filter
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.contactNumber.includes(searchQuery)

    const matchesFilter =
      selectedFilter === "active" ? customer.isActive : selectedFilter === "inactive" ? !customer.isActive : true

    return matchesSearch && matchesFilter
  })

  // Sort filtered customers based on selected sort option
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (selectedSort === "name-asc") {
      return a.customerName.localeCompare(b.customerName)
    } else if (selectedSort === "name-desc") {
      return b.customerName.localeCompare(a.customerName)
    } else if (selectedSort === "orders-high") {
      return b.totalOrder - a.totalOrder
    } else if (selectedSort === "orders-low") {
      return a.totalOrder - b.totalOrder
    }
    return 0
  })

  const columns: ColumnConfig<Customer>[] = [
    { header: "ID", key: "customerId" },
    { header: "Customer Name", key: "customerName" },
    { header: "Email", key: "email" },
    { header: "Address", key: "address" },
    { header: "Contact Number", key: "contactNumber" },
    {
      header: "Total Order",
      key: "totalOrder",
      render: (value, row) => `${row.totalOrder}`,
    },
  ]

  const handleRowSelect = (selectedIds: string[]) => {
    console.log("Selected rows:", selectedIds)
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



  const nav= useNavigate()



  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customer list</h1>
        <button
          onClick={()=>nav(`${FrontendRoutes.ADDCUSTOMER}`)}
          className="bg-[#DF8D28] hover:bg-[#DF8D28]/90 text-white px-4 py-2 rounded-lg"
        >
          + New Customer
        </button>
      </div>

      <div className="bg-white p-4">

      <SearchFilterSort
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        filterOptions={filterOptions}
        sortOptions={sortOptions}
        placeholder="Search here..."
        />

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={sortedCustomers}
          showSelectAll={true}
          onRowSelect={handleRowSelect}
          deleteRow={handleDeleteCustomer}
          showPagination={true}
          paginationDetails={{
            currentPage,
            limit: itemsPerPage,
            totalCount: filteredCustomers.length,
          }}
          onItemsPerPageChange={handleItemsPerPageChange}
          onPageChange={handlePageChange}
          showBg={true}
          showAction={true}
          showEdit={true}
          showDelete={true}
          showView={true}

          viewRow={((row)=>nav(`/customer-view/${row?._id}`))}
          />
      </div>
          </div>

      {isModalOpen && (
        <Modal ref={ref}>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">{modalMode === "add" ? "Add New Customer" : "Edit Customer"}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Customer Name *</label>
                <input
                  value={newCustomer.customerName}
                  onChange={(e) => setNewCustomer({ ...newCustomer, customerName: e.target.value })}
                  className="border rounded-md p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="border rounded-md p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <textarea
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  className="border rounded-md p-2 w-full"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Number</label>
                <input
                  type="tel"
                  value={newCustomer.contactNumber}
                  onChange={(e) => setNewCustomer({ ...newCustomer, contactNumber: e.target.value })}
                  className="border rounded-md p-2 w-full"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-md">
                Cancel
              </button>
              <button onClick={handleSaveCustomer} className="px-4 py-2 bg-[#DF8D28] text-white rounded-md">
                {modalMode === "add" ? "Save Customer" : "Update Customer"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default CustomerList

