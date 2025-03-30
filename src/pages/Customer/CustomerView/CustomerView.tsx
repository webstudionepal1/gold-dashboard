import { Table, type TableData, type ColumnConfig } from "../../../components/shared/Table"
import { Icon } from "@iconify/react/dist/iconify.js"
import type React from "react"
import { useState } from "react"
import { Breadcrumb } from "../../../components/global/Breadcrumb"


interface Order {
  _id: string
  orderId: string
  orderDate: string
  totalPrice: number
  status: "Delivered" | "Out of Stock" | "Cancelled" | "In Stock"
}

interface Address {
  type: string
  address: string
  city: string
  state: string
  zip: string
  phoneNo: string
}

interface CustomerDetail {
  _id: string
  name: string
  businessName: string
  extension: string
  phoneNumber: string
  email: string
  registeredOn: string
  profileImage: string
  addresses: Address[]
  username: string
  password: string
  orders: Order[]
}

interface CustomerDetailProps {
  customerId: string
  onBack: () => void
  onEdit: (customerId: string) => void
}

const CustomerDetail: React.FC = () => {
  // In a real app, you would fetch this data based on the customerId
  const [customer] = useState<CustomerDetail>({
    _id: "customerId",
    name: "Jane Smith",
    businessName: "Opulent Jewel House",
    extension: "Woman Extension 14001",
    phoneNumber: "+1774923012912",
    email: "jane.smith@gmail.com",
    registeredOn: "2023-09-10",
    profileImage: "/placeholder.svg?height=80&width=80",
    addresses: [
      {
        type: "Home",
        address: "601 Finch, Stralia Blvd.",
        city: "Kingston",
        state: "NY",
        zip: "12401",
        phoneNo: "+1773-9999999199",
      },
      {
        type: "Office",
        address: "601 Finch, Stralia Blvd.",
        city: "Kingston",
        state: "NY",
        zip: "12401",
        phoneNo: "+1773-9999999199",
      },
    ],
    username: "janesmith@gmail.com",
    password: "********",
    orders: [
      {
        _id: "1",
        orderId: "01",
        orderDate: "2023-02-11",
        totalPrice: 242,
        status: "Out of Stock",
      },
      {
        _id: "2",
        orderId: "01",
        orderDate: "2023-02-05",
        totalPrice: 242,
        status: "Delivered",
      },
      {
        _id: "3",
        orderId: "01",
        orderDate: "2023-01-19",
        totalPrice: 242,
        status: "Cancelled",
      },
      {
        _id: "4",
        orderId: "01",
        orderDate: "2023-01-12",
        totalPrice: 242,
        status: "In Stock",
      },
      {
        _id: "5",
        orderId: "01",
        orderDate: "2023-01-12",
        totalPrice: 242,
        status: "In Stock",
      },
    ],
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Out of Stock":
        return "bg-red-100 text-red-800"
      case "Cancelled":
        return "bg-yellow-100 text-yellow-800"
      case "In Stock":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
  const orderColumns: ColumnConfig<Order>[] = [
    { header: "Order ID", key: "orderId" },
    { header: "Order Date", key: "orderDate" },
    {
      header: "Total Price",
      key: "totalPrice",
      render: (value, row) => `$${row.totalPrice}`,
    },
    {
      header: "Status",
      key: "status",
      render: (value, row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      ),
    },
  ];

  const handleViewOrder = (order: TableData<Order>) => {
    console.log("View order:", order)
  }

  return (
    <div className="container mx-auto px-6 py-8">

      <div className="flex items-center justify-between mb-8">
        {/* Heading (left side) */}
        <h1 className="text-3xl font-bold text-gray-900">Customer Details</h1>

        {/* Breadcrumb (right side) */}
        <div className="flex items-center text-sm">
          <Breadcrumb
            className="mb-6"
            items={[
              {
                label: "Dashboard",
                href: "/dashboard",
                icon: "mdi:home"
              },
              {
                label: "Customers",
                href: "/customer/customer-list",
              },
              {
                label: "Customer Details",
                // Last item has no link/handler
              }
            ]}
          />

        </div>
      </div>

      {/* Customer Profile Card */}
      <div className="bg-white rounded-xl shadow-md p-8 mb-8 border border-gray-100">
        <div className="flex justify-between">
          <div className="flex">
            <div className="mr-6">
              <img
                src={customer.profileImage || "/placeholder.svg"}
                alt={customer.name}
                className="rounded-xl bg-amber-100 object-cover border-2 border-amber-50"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{customer.businessName}</h2>
              <div className="mt-4 space-y-2">
                {/* Flex row for account, phone, email */}
                <div className="flex flex-row gap-4 flex-wrap">
                  <div className="flex items-center  text-gray-600">
                    <Icon fontSize={24} icon="material-symbols:home-outline-rounded" className="mr-2 " />
                    <span>{customer.extension}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Icon fontSize={24} icon="mdi:phone" className="mr-2 " />
                    <span>{customer.phoneNumber}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Icon fontSize={24} icon="mdi:email" className="mr-2 " />
                    <span>{customer.email}</span>
                  </div>
                </div>

                {/* Registered on - will automatically wrap to next line */}
                <div className="text-gray-600">
                  Registered on: {new Date(customer.registeredOn).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() =>{}}
            className="h-10 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-amber-50 flex items-center"
          >
            <Icon fontSize={24} icon="uil:edit" className="mr-2" /> Edit
          </button>
        </div>
      </div>



      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order History */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-2xl border-b pb-2">Order History</h3>
          </div>
          <Table
            columns={orderColumns}
            data={customer.orders}
            showEdit={false}
            showDelete={false}
            showToggle={false}
            showSelectAll={false}
            showView={true}
            showAction={true}
            showBg={true}
            hasPadding={true}
          />
        </div>


        <div className="space-y-8">
          {/* Address Book */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100">
            <div className="p-6  border-gray-100 flex justify-between  items-center border-b-4">
              <h3 className="font-semibold  text-gray-900 text-2xl   ">Address Book</h3>
              <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center text-white">
                <Icon fontSize={24} icon="iconamoon:edit" />
              </div>
            </div>
            <div className="p-6  space-y-6">
              {customer.addresses.map((address, index) => (
                <div key={index} className="space-y-3">
                  <h4 className="font-medium text-amber-600">{address.type}</h4>
                  <div className="text-gray-700 ">
                    <div className="flex justify-between">
                    <p>Address</p>
                    <p>{address.address}</p>
                    </div>
                    <p className=" flex justify-end">
                      {address.city}, {address.state} {address.zip}
                    </p>
                  </div>
                  <div className="text-gray-700 flex justify-between">

                    <p >Phone no.</p>
                    <p>{address.phoneNo}</p>
                  </div>
                  {index < customer.addresses.length - 1 && <hr className="my-4 border-gray-100" />}
                </div>
              ))}
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100">
            <div className="p-6 border-b-4 border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 text-2xl">Account Information</h3>
              <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center text-white">
                <Icon fontSize="20" icon="iconamoon:edit"  />
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <p className="text-gray-600 text-sm">Username</p>
                <p className="text-gray-900">{customer.username}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600 text-sm">Password</p>
                <p className="text-gray-900 flex items-center">
                  {customer.password}
                  <button className="ml-2 text-gray-400 hover:text-gray-600">
                  <Icon fontSize={16} icon="hugeicons:view" />
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDetail

