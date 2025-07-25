// import React, { useState } from "react";
// import Header from "../../../components/shared/table_heading/Header";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import SupplierCard from "../components/SupplierDetailCard";
// import ContactCard from "../components/ContactCard";
// import { useNavigate } from "react-router-dom";
// import { FrontendRoutes } from "../../../routes/routes";
// import { Table } from "../../../components/shared";
// import { ColumnConfig, TableData } from "../../../components/shared/Table";

// const itemSupplied = [
//   {
//     id: 1,
//     text: "Necklaces",
//   },
//   {
//     id: 2,
//     text: "Earrings",
//   },
//   {
//     id: 3,
//     text: "Bracelets",
//   },
//   {
//     id: 4,
//     text: "Brooches",
//   },
//   {
//     id: 5,
//     text: "Anklets",
//   },
//   {
//     id: 6,
//     text: "Cufflinks",
//   },
//   {
//     id: 7,
//     text: "Hairpins",
//   },
// ];

// const contactDataList = [
//   {
//     title: "Contact Information",
//     contacts: [
//       { subtitle: "Contact Person", text: "Sundarlal Gurung" },
//       { subtitle: "Contact Number", text: "+977-1234567890" },
//       { subtitle: "Email Address", text: "SundarlalGurung@FreshFarm.com" },
//     ],
//   },
//   {
//     title: "Business Information",
//     contacts: [
//       { subtitle: "Business Type", text: "Agricultural Produce Supplier" },
//       { subtitle: "Company Registration Number", text: "789456123" },
//       { subtitle: "Permanent Account Number", text: "987654321" },
//     ],
//   },
//   {
//     title: "Delivery Information",
//     contacts: [
//       { subtitle: "Frequency", text: "Twice a week" },
//       { subtitle: "Delivery Time", text: "9:00 AM to 11:00 AM" },
//       { subtitle: "Lead Time", text: "3-5 business days" },
//     ],
//   },
// ];
// const SupplierHistory = () => {
//   const pinkItems = ["Necklaces", "Earrings", "Bracelets"];
//   const navigate = useNavigate();

//   const handleButtonClick = () => {
//     navigate(`${FrontendRoutes.SUPPLIERDETAIL}`);
//   };

//   interface SupplierHistoryItem {
//     _id: string;
//     purchase_id: string;
//     purchase_date: string;
//     total_amount: string;
//     paid: string;
//     due: string;
//     qty: number;
//   }
//   const [selectedFilter, setSelectedFilter] = useState("");
//   const [selectedSort, setSelectedSort] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     setCurrentPage(1);
//   };

//   const handleFilter = (filter: string) => {
//     setSelectedFilter(filter);
//     setCurrentPage(1);
//   };

//   const handleSort = (sort: string) => {
//     setSelectedSort(sort);
//     setCurrentPage(1);
//   };

//   const handleViewItem = (item: TableData<SupplierHistoryItem>) => {
//     navigate(`${FrontendRoutes.CUSTOMERDETAILS}`);
//   };

//   const handleEditItem = (item: TableData<SupplierHistoryItem>) => {
//     // // Check which tab is selected and set the editing item accordingly
//     // if (selectedTab === "home_page") {
//     //   setEditingItem(item); // Set the item for the Home Page Banner
//     // } else if (selectedTab === "other_page") {
//     //   setEditingItem(item); // Set the item for the Other Page Banner
//     // }
//     setIsModalOpen(true); // Open the modal for either banner
//   };

//   const handleDeleteItem = (item: TableData<SupplierHistoryItem>) => {
//     console.log("Delete item:", item);
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleItemsPerPageChange = (limit: number) => {
//     setItemsPerPage(limit);
//     setCurrentPage(1);
//   };
//   const filterItems = (items: SupplierHistoryItem[]) => {
//     return items.filter(
//       (item) =>
//         item.purchase_date.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item._id?.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   };

//   const columns: ColumnConfig<SupplierHistoryItem>[] = [
//     { header: "Purchase ID", key: "purchase_id" },
//     { header: "Purchase Date", key: "purchase_date" },
//     { header: "Total Amount", key: "total_amount" },
//     { header: "Paid", key: "paid" },
//     { header: "Due", key: "due" },
//     { header: "QTY", key: "qty" },
//   ];

//   const [supplierHistoryItems] = useState<SupplierHistoryItem[]>([
//     {
//       _id: "1",
//       purchase_id: "P-4565",
//       purchase_date: "2025-01-25",
//       total_amount: "Rs.450,000",
//       paid: "Rs.45,000",
//       due: "Rs.45",
//       qty: 50,
//     },
//     {
//       _id: "2",
//       purchase_id: "P-4565",
//       purchase_date: "2025-01-25",
//       total_amount: "Rs.450,000",
//       paid: "Rs.45,000",
//       due: "Rs.45",
//       qty: 50,
//     },
//     {
//       _id: "3",
//       purchase_id: "P-4565",
//       purchase_date: "2025-01-25",
//       total_amount: "Rs.450,000",
//       paid: "Rs.45,000",
//       due: "Rs.45",
//       qty: 50,
//     },
//     {
//       _id: "4",
//       purchase_id: "P-4565",
//       purchase_date: "2025-01-25",
//       total_amount: "Rs.450,000",
//       paid: "Rs.45,000",
//       due: "Rs.45",
//       qty: 50,
//     },
//   ]);

//   const renderSupplierHistoryTable = (items: SupplierHistoryItem[]) => {
//     const filteredItems = filterItems(items);
//     return (
//       <Table
//         columns={columns}
//         data={filteredItems}
//         showEdit={false}
//         showDelete={false}
//         showView={true}
//         showAction={true}
//         showSelectAll={true}
//         viewRow={handleViewItem}
//         editRow={handleEditItem}
//         deleteRow={handleDeleteItem}
//         showPagination={true}
//         paginationDetails={{
//           currentPage,
//           limit: itemsPerPage,
//           totalCount: filteredItems.length,
//         }}
//         onItemsPerPageChange={handleItemsPerPageChange}
//         onPageChange={handlePageChange}
//         showBg={true}
//       />
//     );
//   };
//   return (
//     <>
//       <div className="container mx-auto px-8 py-3">
//         <div className="mb-4">
//           <Header text="Supplier History" />
//         </div>

//         <div className="mb-8">
//           <SupplierCard
//             image="/test_logo.jpg"
//             title="Opulent Jewel House"
//             supplierType="Gold Supplier"
//             location="SundarBasti, Bhangal, Kathmandu 44600"
//             itemsSupplied={[
//               "Necklaces",
//               "Earrings",
//               "Bracelets",
//               "Brooches",
//               "Anklets",
//               "Cufflinks",
//               "Hairpins",
//             ]}
//             buttonText="Basic Information"
//             buttonClick={handleButtonClick}
//           />
//         </div>

//         <div className="bg-white rounded-xl">
//           {renderSupplierHistoryTable(supplierHistoryItems)}
//         </div>
//       </div>
//     </>
//   );
// };

// export default SupplierHistory;

// Second

// import React, { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { get } from "lodash";
// import Header from "../../../components/shared/table_heading/Header";
// import SupplierCard from "../components/SupplierDetailCard";
// import { FrontendRoutes } from "../../../routes/routes";
// import { Table } from "../../../components/shared";
// import { ColumnConfig, TableData } from "../../../components/shared/Table";
// import { useGetSupplierByIdQuery } from "../../../server/api/supplierHooks";
// import { useGetPurchasesQuery } from "../../../server/api/purchaseHooks";

// interface SupplierHistoryItem {
//   _id: string;
//   purchase_id: string;
//   purchase_date: string;
//   total_amount: string;
//   paid: string;
//   due: string;
//   qty: number;
// }

// const SupplierHistory = () => {
//   let { id } = useParams();
//   id ??= "";
//   console.log("Supplier ID from useParams:", id); // Debug: Log supplier ID

//   const navigate = useNavigate();
//   const {
//     data: supplierData,
//     isLoading: isSupplierLoading,
//     error: supplierError,
//   } = useGetSupplierByIdQuery(id);
//   const {
//     data: purchaseData,
//     isLoading: isPurchaseLoading,
//     error: purchaseError,
//   } = useGetPurchasesQuery();

//   const [selectedFilter, setSelectedFilter] = useState("");
//   const [selectedSort, setSelectedSort] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Debug: Log supplier and purchase data
//   console.log("Supplier Data:", supplierData);
//   console.log("Purchase Data:", purchaseData);

//   // Filter purchases by supplier ID and map to SupplierHistoryItem
//   const supplierHistoryItems: SupplierHistoryItem[] =
//     purchaseData
//       ?.filter((purchase) => purchase.supplier === id)
//       .map((purchase) => ({
//         _id: purchase._id,
//         purchase_id: purchase.billNo,
//         purchase_date: new Date(purchase.createdAt).toISOString().split("T")[0], // Format as YYYY-MM-DD
//         total_amount: `Rs.${purchase.totalAmount.toLocaleString()}`,
//         paid: `Rs.${purchase.paid.toLocaleString()}`,
//         due: `Rs.${(purchase.totalAmount - purchase.paid).toLocaleString()}`,
//         qty:
//           purchase.items?.reduce(
//             (sum, item) => sum + (item.quantity || 0),
//             0
//           ) || 0,
//       })) || [];

//   const handleButtonClick = () => {
//     navigate(FrontendRoutes.SUPPLIERDETAIL.replace(":id", id));
//   };

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     setCurrentPage(1);
//   };

//   const handleFilter = (filter: string) => {
//     setSelectedFilter(filter);
//     setCurrentPage(1);
//   };

//   const handleSort = (sort: string) => {
//     setSelectedSort(sort);
//     setCurrentPage(1);
//   };

//   const handleEditItem = (item: TableData<SupplierHistoryItem>) => {
//     setIsModalOpen(true);
//   };

//   const handleDeleteItem = (item: TableData<SupplierHistoryItem>) => {
//     console.log("Delete item:", item);
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleItemsPerPageChange = (limit: number) => {
//     setItemsPerPage(limit);
//     setCurrentPage(1);
//   };

//   const filterItems = (items: SupplierHistoryItem[]) => {
//     return items.filter(
//       (item) =>
//         item.purchase_date.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.purchase_id?.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   };

//   const columns: ColumnConfig<SupplierHistoryItem>[] = [
//     { header: "Purchase ID", key: "purchase_id" },
//     { header: "Purchase Date", key: "purchase_date" },
//     { header: "Total Amount", key: "total_amount" },
//     { header: "Paid", key: "paid" },
//     { header: "Due", key: "due" },
//     { header: "QTY", key: "qty" },
//   ];

//   const renderSupplierHistoryTable = (items: SupplierHistoryItem[]) => {
//     const filteredItems = filterItems(items);
//     if (filteredItems.length === 0) {
//       return (
//         <div className="text-center py-4">
//           No purchase history available for this supplier.
//         </div>
//       );
//     }
//     return (
//       <Table
//         columns={columns}
//         data={filteredItems}
//         showEdit={false}
//         showDelete={false}
//         showView={false} // Disabled due to missing PURCHASEDETAILS route
//         showAction={true}
//         showSelectAll={true}
//         editRow={handleEditItem}
//         deleteRow={handleDeleteItem}
//         showPagination={true}
//         paginationDetails={{
//           currentPage,
//           limit: itemsPerPage,
//           totalCount: filteredItems.length,
//         }}
//         onItemsPerPageChange={handleItemsPerPageChange}
//         onPageChange={handlePageChange}
//         showBg={true}
//       />
//     );
//   };

//   if (isSupplierLoading || isPurchaseLoading) {
//     return <div className="text-center py-4">Loading...</div>;
//   }

//   if (supplierError) {
//     console.log("Supplier Error:", supplierError);
//     return (
//       <div className="text-center py-4">
//         Error loading supplier data: {supplierError.message || "Unknown error"}
//       </div>
//     );
//   }

//   if (purchaseError) {
//     console.log("Purchase Error:", purchaseError);
//     return (
//       <div className="text-center py-4">
//         Error loading purchase data: {purchaseError.message || "Unknown error"}
//       </div>
//     );
//   }

//   if (!id) {
//     return (
//       <div className="text-center py-4">
//         No supplier ID provided in the URL.
//       </div>
//     );
//   }

//   if (!supplierData) {
//     return (
//       <div className="text-center py-4">Supplier not found for ID: {id}</div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-8 py-3">
//       <div className="mb-4">
//         <Header text="Supplier History" />
//       </div>

//       <div className="mb-8">
//         <SupplierCard
//           image={
//             supplierData && supplierData.logo.length > 0
//               ? `${import.meta.env.VITE_API_IMAGE_BASE_URL}/supplier/${
//                   supplierData.logo[0]
//                 }`
//               : "https://via.placeholder.com/150"
//           }
//           title={get(supplierData, "name", "Opulent Supplier")}
//           supplierType={get(supplierData, "businessType", "Gold Supplier")}
//           location={`${get(supplierData, "addresses.city", "-")}, ${get(
//             supplierData,
//             "addresses.state",
//             "Unknown Location"
//           )}`}
//           itemsSupplied={get(supplierData, "products", []).map(
//             (item) => item.name
//           )}
//           buttonText="Basic Information"
//           buttonClick={handleButtonClick}
//         />
//       </div>

//       <div className="bg-white rounded-xl">
//         {renderSupplierHistoryTable(supplierHistoryItems)}
//       </div>
//     </div>
//   );
// };

// export default SupplierHistory;

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get } from "lodash";
import Header from "../../../components/shared/table_heading/Header";
import SupplierCard from "../components/SupplierDetailCard";
import { FrontendRoutes } from "../../../routes/routes";
import { Table } from "../../../components/shared";
import { ColumnConfig, TableData } from "../../../components/shared/Table";
import { useGetSupplierByIdQuery } from "../../../server/api/supplierHooks";
import { useGetPurchasesQuery } from "../../../server/api/purchaseHooks";

interface SupplierHistoryItem {
  _id: string;
  purchase_id: string;
  purchase_date: string;
  total_amount: string;
  paid: string;
  due: string;
  qty: number;
}

const SupplierHistory = () => {
  let { id } = useParams();
  id ??= "";
  console.log("Supplier ID from useParams:", id); // Debug: Log supplier ID

  const navigate = useNavigate();
  const {
    data: supplierData,
    isLoading: isSupplierLoading,
    error: supplierError,
  } = useGetSupplierByIdQuery(id);
  console.log("Suplier Data", supplierData);
  const {
    data: purchaseData,
    isLoading: isPurchaseLoading,
    error: purchaseError,
  } = useGetPurchasesQuery();
  console.log("Purchase Data", purchaseData);

  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debug: Log supplier, purchase data, and logo details
  console.log("Supplier Data:", supplierData);
  console.log("Purchase Data:", purchaseData);
  console.log(
    "VITE_API_IMAGE_BASE_URL:",
    import.meta.env.VITE_API_IMAGE_BASE_URL
  );
  console.log("Supplier Logo Array:", supplierData?.logo);
  console.log(
    "Constructed Logo URL:",
    supplierData && supplierData?.logo?.length > 0
      ? `${import.meta.env.VITE_API_IMAGE_BASE_URL}${supplierData.logo[0]}`
      : "Placeholder"
  );

  // Filter purchases by supplier ID and map to SupplierHistoryItem
  const supplierHistoryItems: SupplierHistoryItem[] =
    purchaseData
      ?.filter((purchase) => purchase.supplier === id)
      .map((purchase) => ({
        _id: purchase._id,
        purchase_id: purchase.billNo,
        purchase_date: new Date(purchase.createdAt).toISOString().split("T")[0], // Format as YYYY-MM-DD
        total_amount: `Rs.${purchase.totalAmount.toLocaleString()}`,
        paid: `Rs.${purchase.paid.toLocaleString()}`,
        due: `Rs.${(purchase.totalAmount - purchase.paid).toLocaleString()}`,
        qty:
          purchase.items?.reduce(
            (sum, item) => sum + (item.quantity || 0),
            0
          ) || 0,
      })) || [];

  const handleButtonClick = () => {
    navigate(FrontendRoutes.SUPPLIERDETAIL.replace(":id", id));
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

  const handleEditItem = (item: TableData<SupplierHistoryItem>) => {
    setIsModalOpen(true);
  };

  const handleDeleteItem = (item: TableData<SupplierHistoryItem>) => {
    console.log("Delete item:", item);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
  };

  const filterItems = (items: SupplierHistoryItem[]) => {
    return items.filter(
      (item) =>
        item.purchase_date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.purchase_id?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const columns: ColumnConfig<SupplierHistoryItem>[] = [
    { header: "Purchase ID", key: "purchase_id" },
    { header: "Purchase Date", key: "purchase_date" },
    { header: "Total Amount", key: "total_amount" },
    { header: "Paid", key: "paid" },
    { header: "Due", key: "due" },
    { header: "QTY", key: "qty" },
  ];

  const renderSupplierHistoryTable = (items: SupplierHistoryItem[]) => {
    const filteredItems = filterItems(items);
    if (filteredItems.length === 0) {
      return (
        <div className="text-center py-4">
          No purchase history available for this supplier.
        </div>
      );
    }
    return (
      <Table
        columns={columns}
        data={filteredItems}
        showEdit={false}
        showDelete={false}
        showView={false} // Disabled due to missing PURCHASEDETAILS route
        showAction={true}
        showSelectAll={true}
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

  if (isSupplierLoading || isPurchaseLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (supplierError) {
    console.log("Supplier Error:", supplierError);
    return (
      <div className="text-center py-4">
        Error loading supplier data: {supplierError.message || "Unknown error"}
      </div>
    );
  }

  if (purchaseError) {
    console.log("Purchase Error:", purchaseError);
    return (
      <div className="text-center py-4">
        Error loading purchase data: {purchaseError.message || "Unknown error"}
      </div>
    );
  }

  if (!id) {
    return (
      <div className="text-center py-4">
        No supplier ID provided in the URL.
      </div>
    );
  }

  if (!supplierData) {
    return (
      <div className="text-center py-4">Supplier not found for ID: {id}</div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-3">
      <div className="mb-4">
        <Header text="Supplier History" />
      </div>

      <div className="mb-8">
        <SupplierCard
          image={
            supplierData && supplierData?.logo?.length > 0
              ? `${import.meta.env.VITE_API_IMAGE_BASE_URL}${
                  supplierData.logo[0]
                }`
              : "https://via.placeholder.com/150"
          }
          title={get(supplierData, "name", "Opulent Supplier")}
          supplierType={get(supplierData, "businessType", "Gold Supplier")}
          location={`${get(supplierData, "addresses.city", "-")}, ${get(
            supplierData,
            "addresses.state",
            "Unknown Location"
          )}`}
          itemsSupplied={get(supplierData, "products", []).map(
            (item) => item.name
          )}
          buttonText="Basic Information"
          buttonClick={handleButtonClick}
        />
      </div>

      <div className="bg-white rounded-xl">
        <div className="px-6 py-4">
          <p className="text-[#343436] font-semibold text-xl mb-2">
            Purchase History
          </p>
          <div className="border-b border-[#d3d9e2] my-1" />
          {renderSupplierHistoryTable(supplierHistoryItems)}
        </div>
      </div>
    </div>
  );
};

export default SupplierHistory;
