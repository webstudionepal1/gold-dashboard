import { LoginPage } from "../pages";

import { DashboardPage } from "../pages/Dashboard/Dashboard";

import InventoryOverview from "../pages/Inventory/InventoryOverview/InventoryOverview";
import Purchase from "../pages/Inventory/PurchaseManagement/Purchase";
// import PurchaseReturn from "../pages/Inventory/PurchaseManagement/PurchaseReturn";
// import Suppliers from "../pages/Inventory/PurchaseManagement/Suppliers";
import { NotFoundPage } from "../pages/NotFound/NotFound";
import AssignedOrders from "../pages/OrderManagement/AssignedOrder/AssignedOrder";
import CancelledOrder from "../pages/OrderManagement/CancelledOrder/CancelledOrder";
import CompletedOrder from "../pages/OrderManagement/CompletedOrder/CompletedOrder";
import { FrontendRoutes } from "./routes";
import ProductDescription from "../pages/Product/ProductList/[id]/ProdectDescription";
import ProductList from "../pages/Product/ProductList/ProductList";
import { ProductCategory } from "../pages/Product/ProductCategory/ProductCategory";
import Productsubcategory from "../pages/Product/ProductSubcategory/ProductSubCategory";
import AttributeIndex from "../pages/Attribute/AttributeIndex";
import BannerIndex from "../pages/Banner/BannerIndex";
import NotificationIndex from "../pages/Notification/NotificationIndex";
import MyPostBusinessIndex from "../pages/MyPostBusiness/MyPostBusinessIndex";
import ConfirmedOrder from "../pages/OrderManagement/ConfirmedOrder/ConfirmedOrder";
import OrderIndex from "../pages/OrderManagement/Order/OrderIndex";
import AddOrderForm from "../pages/OrderManagement/Order/components/AddOrderPage";
import AddBannerForm from "../pages/Banner/Components/AddBannerForm";
import CustomerIndex from "../pages/Customer/CustomerIndex";
import AddCustomerForm from "../pages/Customer/components/AddCustomerForm";
import Transaction from "../pages/transaction/Transaction";
import VerifyCashPayment from "../pages/transaction/VerifyCashPayment";
import Expenses from "../pages/financeandexpenses/Expenses";
import Cashflow from "../pages/financeandexpenses/Cashflow";
import ProfitandLoss from "../pages/financeandexpenses/ProfitandLoss";
import SettingForm from "../pages/settings/SettingForm";
import OrderReport from "../pages/analytics/OrderReport";
import SalesReport from "../pages/analytics/SalesReport";
import StoreReport from "../pages/analytics/StoreReport";
import CustomerDetails from "../pages/Customer/components/CustomerDetails";
import OrderDetails from "../pages/OrderManagement/Order/OrderDetails";

export const routesConfig = [
  {
    //*********Add the path in frontend-routes file if required  *********//
    path: FrontendRoutes.HOME,
    //******<Route path={path}/> */

    //*********Required page*********//
    element: <DashboardPage />,
    //******<Route element={element}/> *****/
  },
  {
    path: FrontendRoutes.LOGIN,
    element: <LoginPage />,
  },
  {
    path: FrontendRoutes.ORDER,
    element: <OrderIndex />,
  },
  {
    path: FrontendRoutes.ORDERDETAILS,
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
    path: FrontendRoutes.PRODUCTDESCRIPTION,
    element: <ProductDescription />,
  },
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
    path: FrontendRoutes.CUSTOMERDETAILS,
    element: <CustomerDetails />,
  },
  {
    path: FrontendRoutes.ADDCUSTOMER,
    element: <AddCustomerForm />,
  },

  {
    path: FrontendRoutes.INVENTORY,
    element: <InventoryOverview />,
  },
  {
    path: FrontendRoutes.PURCHASE,
    element: <Purchase />,
  },
  // {
  //   path: FrontendRoutes.PURCHASERETURN,
  //   element: <PurchaseReturn />,
  // },
  // {
  //   path: FrontendRoutes.SUPPLIERS,
  //   element: <Suppliers />,
  // },

  // Attributes
  {
    path: FrontendRoutes.ATTRIBUTES,
    element: <AttributeIndex />,
  },
  // Banner
  {
    path: FrontendRoutes.BANNER,
    element: <BannerIndex />,
  },
  {
    path: FrontendRoutes.ADDBANNER,
    element: <AddBannerForm />,
  },
  {
    path: FrontendRoutes.NOTIFICATION,
    element: <NotificationIndex />,
  },
  {
    path: FrontendRoutes.MYPOSTBUSINESS,
    element: <MyPostBusinessIndex />,
  },

  //Transactions
  {
    path: FrontendRoutes.TRANSACTION,
    element: <Transaction />,
  },
  {
    path: FrontendRoutes.VERIFY_CASH,
    element: <VerifyCashPayment />,
  },

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

  //Settings
  {
    path: FrontendRoutes.SETTINGS,
    element: <SettingForm />,
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
