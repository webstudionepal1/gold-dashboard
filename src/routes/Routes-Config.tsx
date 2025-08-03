
import { DashboardPage } from "../pages/Dashboard/Dashboard";

// import PurchaseReturn from "../pages/Inventory/PurchaseManagement/PurchaseReturn";
// import Suppliers from "../pages/Inventory/PurchaseManagement/Suppliers";
import { NotFoundPage } from "../pages/NotFound/NotFound";
import AssignedOrders from "../pages/OrderManagement/AssignedOrder/AssignedOrder";
import CancelledOrder from "../pages/OrderManagement/CancelledOrder/CancelledOrder";
import CompletedOrder from "../pages/OrderManagement/CompletedOrder/CompletedOrder";
import ProductCategory from "../pages/Product/ProductCategory/ProductCategory";
import ProductDescription from "../pages/Product/ProductList/[id]/ProdectDescription";
import ProductList from "../pages/Product/ProductList/ProductList";
import Productsubcategory from "../pages/Product/ProductSubcategory/ProductSubCategory";
import { FrontendRoutes } from "./routes";

import NotificationAdminPanel from "../components/admin/NotificationAdminPanel";
import NotificationTest from "../components/test/NotificationTest";
import BannerIndex from "../pages/Banner/BannerIndex";
import AddBannerForm from "../pages/Banner/Components/AddBannerForm";
import CollectionIndex from "../pages/Collection/CollectionIndex";
import CollectionDetails from "../pages/Collection/components/CollectionDetails";
import NotificationIndex from "../pages/Notification/NotificationIndex";
import ConfirmedOrder from "../pages/OrderManagement/ConfirmedOrder/ConfirmedOrder";
import AddOrderForm from "../pages/OrderManagement/Order/components/AddOrderPage";
import OrderIndex from "../pages/OrderManagement/Order/OrderIndex";

import NewCollectionForm from "../pages/Collection/components/NewCollectionForm";
import CustomerIndex from "../pages/Customer/CustomerIndex";
// import AddCustomerForm from "../pages/Customer/components/AddCustomerForm";
import Cashflow from "../pages/financeandexpenses/Cashflow";
import Expenses from "../pages/financeandexpenses/Expenses";
import ProfitandLoss from "../pages/financeandexpenses/ProfitandLoss";
import Transaction from "../pages/transaction/Transaction";

import CalculatorIndex from "@/pages/settings/calculator/CalculatorIndex";
import OrderReport from "../pages/analytics/OrderReport";
import SalesReport from "../pages/analytics/SalesReport";
import StoreReport from "../pages/analytics/StockReport";
import CustomerDetails from "../pages/Customer/components/CustomerDetails";
import InventoryIndex from "../pages/Inventory/InventoryIndex";
import OrderDetails from "../pages/OrderManagement/Order/OrderDetails";
import NewProductForm from "../pages/Product/components/NewProductForm";
import ProductImageDemo from "../pages/Product/ProductImageDemo";
import ProductForm from "../pages/Product/ProductList/component/ProductForm";
import ProductOccasion from "../pages/Product/ProductOccasion/ProductOccasion";
import AddSupplierForm from "../pages/PurchaseManagement/components/AddSupplierForm";
import SupplierDetail from "../pages/PurchaseManagement/pages/SupplierDetail";
import SupplierHistory from "../pages/PurchaseManagement/pages/SupplierHistory";
import PurchaseIndex from "../pages/PurchaseManagement/PurchaseIndex";
import AttribConfig from "../pages/settings/components/AttribConfig";
import EditProfileForm from "../pages/settings/ProfileConfig/EditProfileForm";
import StoneIndex from "../pages/Stone/StoneIndex";
import TestUpload from "../pages/TestUpload";
import BlogList from "@/pages/Blog/BlogList/BlogList";
import BlogEditor from "@/pages/Blog/BlogEditor/BlogEditor";
import BlogView from "@/pages/Blog/BlogView/BlogView";
import BlogAnalytics from "@/pages/Blog/BlogAnalytics/BlogAnalytics";
// import BlogList from "@/pages/Blog/BlogList/BlogList";
// import BlogEditor from "@/pages/Blog/BlogEditor/BlogEditor";
// import BlogView from "@/pages/Blog/BlogView/BlogView";
// import BlogAnalytics from "@/pages/Blog/BlogAnalytics/BlogAnalytics";

export const routesConfig = [
  {
    //*********Add the path in frontend-routes file if required  *********//
    path: FrontendRoutes.HOME,
    //******<Route path={path}/> */

    //*********Required page*********//
    element: <DashboardPage />,
    //******<Route element={element}/> *****/
  },
  // {
  //   path: FrontendRoutes.LOGIN,
  //   element: <LoginPage />,
  // },
  {
    path: FrontendRoutes.ORDER,
    element: <OrderIndex />,
  },
  {
    path: "/order/order-details/:id",
    element: <OrderDetails />,
  },
  {
    path: "/order/confirmed-order-details/:id",
    element: <OrderDetails />,
  },
  {
    path: "/attribs",
    element: <AttribConfig />,
  },
  {
    path: "/order/assigned-order-details/:id",
    element: <OrderDetails />,
  },
  {
    path: "/order/completed-order-details/:id",
    element: <OrderDetails />,
  },
  {
    path: "/order/cancelled-order-details/:id",
    element: <OrderDetails />,
  },
  {
    path: FrontendRoutes.ADDORDER,
    element: <AddOrderForm />,
  },
  {
    path: FrontendRoutes.ASSIGNEDORDER,
    element: <AssignedOrders />,
  },
  {
    path: FrontendRoutes.CONFIRMEDORDER,
    element: <ConfirmedOrder />,
  },
  {
    path: FrontendRoutes.CANCELLEDORDER,
    element: <CancelledOrder />,
  },
  {
    path: FrontendRoutes.COMPLETEDORDER,
    element: <CompletedOrder />,
  },
  {
    path: FrontendRoutes.PRODUCTLIST,
    element: <ProductList />,
  },
  {
    path: FrontendRoutes.ADDPRODUCT,
    element: <NewProductForm />,
  },
  {
    path: FrontendRoutes.EDITPRODUCT,
    element: <NewProductForm />,
  },
  {
    path: "/product/details/:id",
    element: <ProductDescription />,
  },
  {
    path: "/product/:id",
    element: <ProductForm />,
  },
  // {
  //   path: FrontendRoutes.PRODUCTDESCRIPTION,
  //   element: <ProductDescription />,
  // },
  {
    path: FrontendRoutes.PRODUCTCATEGORY,
    element: <ProductCategory />,
  },
  {
    path: FrontendRoutes.PRODUCTSUBCATEGORY,
    element: <Productsubcategory />,
  },
  {
    path: FrontendRoutes.PRODUCTOCCASION,
    element: <ProductOccasion />,
  },
  {
    path: FrontendRoutes.STONE,
    element: <StoneIndex />,
  },
  {
    path: "/product/image-demo",
    element: <ProductImageDemo />,
  },

  {
    path: FrontendRoutes.CUSTOMER,
    element: <CustomerIndex />,
  },
  {
    // path: "/customer/customer-details/:id",
    path: FrontendRoutes.CUSTOMERDETAILS,

    element: <CustomerDetails />,
  },
  // {
  //   path: FrontendRoutes.ADDCUSTOMER,
  //   element: <AddCustomerForm />,
  // },

  {
    path: FrontendRoutes.INVENTORY,
    element: <InventoryIndex />,
  },
  {
    path: FrontendRoutes.ADDSUPPLIERS,
    element: <AddSupplierForm />,
  },
  {
    path: FrontendRoutes.SUPPLIERDETAIL,
    element: <SupplierDetail />,
  },
  {
    path: FrontendRoutes.SUPPLIERHISTORY,
    element: <SupplierHistory />,
  },
  {
    path: FrontendRoutes.PURCHASE,
    element: <PurchaseIndex />,
  },
  // {
  //   path: FrontendRoutes.PURCHASERETURN,
  //   element: <PurchaseReturn />,
  // },
  // {
  //   path: FrontendRoutes.SUPPLIERS,
  //   element: <Suppliers />,
  // },

  // Banner
  {
    path: FrontendRoutes.BANNER,
    element: <BannerIndex />,
  },
  {
    path: "/banner/:id",
    element: <AddBannerForm />,
  },

  // Collections
  {
    path: FrontendRoutes.COLLECTION,
    element: <CollectionIndex />,
  },
  {
    path: FrontendRoutes.ADDCOLLECTION,
    element: <NewCollectionForm />,
  },
  {
    path: FrontendRoutes.EDITCOLLECTION,
    element: <NewCollectionForm />,
  },
  {
    path: FrontendRoutes.COLLECTIONDETAILS,
    element: <CollectionDetails />,
  },

  {
    path: FrontendRoutes.NOTIFICATION,
    element: <NotificationIndex />,
  },
  {
    path: "/notification-test",
    element: <NotificationTest />,
  },
  {
    path: "/notification-admin",
    element: <NotificationAdminPanel />,
  },
  // MyPostBusiness route commented out - will be integrated later
  // {
  //   path: FrontendRoutes.MYPOSTBUSINESS,
  //   element: <MyPostBusinessIndex />,
  // },

  //Transactions
  {
    path: FrontendRoutes.TRANSACTION,
    element: <Transaction />,
  },
  // {
  //   path: FrontendRoutes.VERIFY_CASH,
  //   element: <VerifyCashPayment />,
  // },

  //finance and expenses
  {
    path: FrontendRoutes.EXPENSE,
    element: <Expenses />,
  },
  {
    path: FrontendRoutes.CASHFLOW,
    element: <Cashflow />,
  },
  {
    path: FrontendRoutes.PROFIT_LOSS,
    element: <ProfitandLoss />,
  },

  {
    path: FrontendRoutes.PROFILECONFIG,
    element: <EditProfileForm />,
  },
  {
    path: "/settings/attribute-config",
    element: <AttribConfig />,
  },
  {
    path: "/settings/calculator",
    element: <CalculatorIndex />,
  },
  //Analytics
  {
    path: FrontendRoutes.ORDER_REPORT,
    element: <OrderReport />,
  },
  {
    path: FrontendRoutes.SALES_REPORT,
    element: <SalesReport />,
  },
  {
    path: FrontendRoutes.STOCK_REPORT,
    element: <StoreReport />,
  },
  {
    path: "/test-upload",
    element: <TestUpload />,
  },
  // Blog routes - commented out due to missing components
  {
    path: FrontendRoutes.BLOGLIST,
    element: <BlogList />,
  },
  {
    path: FrontendRoutes.ADDBLOG,
    element: <BlogEditor />,
  },
  {
    path: FrontendRoutes.EDITBLOG,
    element: <BlogEditor />,
  },
  {
    path: FrontendRoutes.BLOGDETAILS,
    element: <BlogView />,
  },
  {
    path: FrontendRoutes.BLOGANALYTICS,
    element: <BlogAnalytics />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
