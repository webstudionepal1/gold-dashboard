import { LoginPage } from "../pages";

import { DashboardPage } from "../pages/Dashboard/Dashboard";

// import PurchaseReturn from "../pages/Inventory/PurchaseManagement/PurchaseReturn";
// import Suppliers from "../pages/Inventory/PurchaseManagement/Suppliers";
import { NotFoundPage } from "../pages/NotFound/NotFound";
import AssignedOrders from "../pages/OrderManagement/AssignedOrder/AssignedOrder";
import CancelledOrder from "../pages/OrderManagement/CancelledOrder/CancelledOrder";
import CompletedOrder from "../pages/OrderManagement/CompletedOrder/CompletedOrder";
import { FrontendRoutes } from "./routes";
import ProductDescription from "../pages/Product/ProductList/[id]/ProdectDescription";
import ProductList from "../pages/Product/ProductList/ProductList";
import ProductCategory from "../pages/Product/ProductCategory/ProductCategory";
import Productsubcategory from "../pages/Product/ProductSubcategory/ProductSubCategory";

import BannerIndex from "../pages/Banner/BannerIndex";
import NotificationIndex from "../pages/Notification/NotificationIndex";
import NotificationTest from "../components/test/NotificationTest";
import NotificationAdminPanel from "../components/admin/NotificationAdminPanel";
import MyPostBusinessIndex from "../pages/MyPostBusiness/MyPostBusinessIndex";
import ConfirmedOrder from "../pages/OrderManagement/ConfirmedOrder/ConfirmedOrder";
import OrderIndex from "../pages/OrderManagement/Order/OrderIndex";
import AddOrderForm from "../pages/OrderManagement/Order/components/AddOrderPage";
import AddBannerForm from "../pages/Banner/Components/AddBannerForm";
import CollectionIndex from "../pages/Collection/CollectionIndex";
import CollectionForm from "../pages/Collection/components/CollectionForm";
import CollectionDetails from "../pages/Collection/components/CollectionDetails";

import NewCollectionForm from "../pages/Collection/components/NewCollectionForm";
import CustomerIndex from "../pages/Customer/CustomerIndex";
// import AddCustomerForm from "../pages/Customer/components/AddCustomerForm";
import Transaction from "../pages/transaction/Transaction";
import VerifyCashPayment from "../pages/transaction/VerifyCashPayment";
import Expenses from "../pages/financeandexpenses/Expenses";
import Cashflow from "../pages/financeandexpenses/Cashflow";
import ProfitandLoss from "../pages/financeandexpenses/ProfitandLoss";

import OrderReport from "../pages/analytics/OrderReport";
import SalesReport from "../pages/analytics/SalesReport";
import StoreReport from "../pages/analytics/StockReport";
import ProductForm from "../pages/Product/ProductList/component/ProductForm";
import NewProductForm from "../pages/Product/components/NewProductForm";
import CustomerDetails from "../pages/Customer/components/CustomerDetails";
import OrderDetails from "../pages/OrderManagement/Order/OrderDetails";
import InventoryIndex from "../pages/Inventory/InventoryIndex";
import PurchaseIndex from "../pages/PurchaseManagement/PurchaseIndex";
import AddSupplierForm from "../pages/PurchaseManagement/components/AddSupplierForm";
import SupplierDetail from "../pages/PurchaseManagement/pages/SupplierDetail";
import SupplierHistory from "../pages/PurchaseManagement/pages/SupplierHistory";
import AttribConfig from "../pages/settings/components/AttribConfig";
import EditProfileForm from "../pages/settings/ProfileConfig/EditProfileForm";
import ProductOccasion from "../pages/Product/ProductOccasion/ProductOccasion";
import StoneIndex from "../pages/Stone/StoneIndex";
import TestUpload from "../pages/TestUpload";
import { ProductDetails } from "../pages/Product/ProductList/[id]/components/ProductDetails";
import BlogList from "../pages/Blog/BlogList/BlogList";
import BlogEditor from "../pages/Blog/BlogEditor/BlogEditor";
import BlogView from "../pages/Blog/BlogView/BlogView";
import BlogAnalytics from "../pages/Blog/BlogAnalytics/BlogAnalytics";

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
  // Blog routes
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
