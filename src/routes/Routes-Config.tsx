import { LoginPage } from "../pages";

import { DashboardPage } from "../pages/Dashboard/Dashboard";

// import PurchaseReturn from "../pages/Inventory/PurchaseManagement/PurchaseReturn";
// import Suppliers from "../pages/Inventory/PurchaseManagement/Suppliers";
import { NotFoundPage } from "../pages/NotFound/NotFound";

import { FrontendRoutes } from "./routes";
import ProductDescription from "../pages/Product/ProductList/[id]/ProdectDescription";
import ProductList from "../pages/Product/ProductList/ProductList";
import ProductCategory from "../pages/Product/ProductCategory/ProductCategory";
import Productsubcategory from "../pages/Product/ProductSubcategory/ProductSubCategory";

import BannerIndex from "../pages/Banner/BannerIndex";
import NotificationIndex from "../pages/Notification/NotificationIndex";
import MyPostBusinessIndex from "../pages/MyPostBusiness/MyPostBusinessIndex";
import NotificationAdminPanel from "../components/admin/NotificationAdminPanel";
import NotificationTest from "../components/test/NotificationTest";

import OrderIndex from "../pages/OrderManagement/Order/OrderIndex";
import AddOrderForm from "../pages/OrderManagement/Order/components/AddOrderPage";
import CancelledOrder from "../pages/OrderManagement/CancelledOrder/CancelledOrder";
import PickupOrder from "../pages/OrderManagement/PickupOrder/PickupOrder";
import AddBannerForm from "../pages/Banner/Components/AddBannerForm";
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
import CustomerDetails from "../pages/Customer/components/CustomerDetails";
import OrderDetails from "../pages/OrderManagement/Order/OrderDetails";
import InventoryIndex from "../pages/Inventory/InventoryIndex";
import PurchaseIndex from "../pages/PurchaseManagement/PurchaseIndex";
import AddSupplierForm from "../pages/PurchaseManagement/components/AddSupplierForm";
import SupplierDetail from "../pages/PurchaseManagement/pages/SupplierDetail";
import SupplierHistory from "../pages/PurchaseManagement/pages/SupplierHistory";
import AttribConfig from "../pages/settings/components/AttribConfig";
import EditProfileForm from "../pages/settings/ProfileConfig/EditProfileForm";
import { ProductDetails } from "../pages/Product/ProductList/[id]/components/ProductDetails";

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
    path: "/order/cancelled-order",
    element: <CancelledOrder />,
  },
  {
    path: "/order/pickup-order",
    element: <PickupOrder />,
  },
  {
    path: "/order/order-details/:id",
    element: <OrderDetails />,
  },
  {
    path: "/order/cancelled-order-details/:id",
    element: <OrderDetails />,
  },
  {
    path: "/order/completed-order-details/:id",
    element: <OrderDetails />,
  },
  {
    path: "/order/assigned-order-details/:id",
    element: <OrderDetails />,
  },
  {
    path: "/order/pickup-order-details/:id",
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
    path: FrontendRoutes.ADDORDER,
    element: <AddOrderForm />,
  },

  {
    path: FrontendRoutes.PRODUCTLIST,
    element: <ProductList />,
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
    path: "/inventory/suppliers/edit",
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
  {
    path: FrontendRoutes.NOTIFICATION,
    element: <NotificationIndex />,
  },
  {
    path: "/notification-admin",
    element: <NotificationAdminPanel />,
  },
  {
    path: "/notification-test",
    element: <NotificationTest />,
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
    path: "*",
    element: <NotFoundPage />,
  },
];
