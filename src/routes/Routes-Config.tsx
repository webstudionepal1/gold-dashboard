import { DashboardPage } from "../screens/Dashboard/Dashboard";

// import PurchaseReturn from "../screens/Inventory/PurchaseManagement/PurchaseReturn";
// import Suppliers from "../screens/Inventory/PurchaseManagement/Suppliers";
import { NotFoundPage } from "../screens/NotFound/NotFound";
import ProductCategory from "../screens/Product/ProductCategory/ProductCategory";
import ProductDescription from "../screens/Product/ProductList/[id]/ProdectDescription";
import ProductList from "../screens/Product/ProductList/ProductList";
import Productsubcategory from "../screens/Product/ProductSubcategory/ProductSubCategory";
import { FrontendRoutes } from "./routes";

import GiftsAdminPanel from "../components/admin/GiftsAdminPanel";
import GiftFormPage from "../screens/Gifts/GiftFormPage";
import NotificationAdminPanel from "../components/admin/NotificationAdminPanel";
import NotificationTest from "../components/test/NotificationTest";
import BannerIndex from "../screens/Banner/BannerIndex";
import AddBannerForm from "../screens/Banner/Components/AddBannerForm";
import NotificationIndex from "../screens/Notification/NotificationIndex";

// import AddCustomerForm from "../screens/Customer/components/AddCustomerForm";

import BlogAnalytics from "@/screens/Blog/BlogAnalytics/BlogAnalytics";
import BlogEditor from "@/screens/Blog/BlogEditor/BlogEditor";
import BlogList from "@/screens/Blog/BlogList/BlogList";
import BlogView from "@/screens/Blog/BlogView/BlogView";
import NewProductForm from "../screens/Product/components/NewProductForm";
import ProductImageDemo from "../screens/Product/ProductImageDemo";
import ProductForm from "../screens/Product/ProductList/component/ProductForm";
import AttribConfig from "../screens/settings/components/AttribConfig";
import EditProfileForm from "../screens/settings/ProfileConfig/EditProfileForm";
import { ContactUs } from "@/screens/contact-us/ContactUs.page";
import AddQueries from "@/screens/contact-us/components/AddQueries";
import OrderIndex from "../screens/OrderManagement/Order/OrderIndex";
import OrderDetails from "../screens/OrderManagement/Order/OrderDetails";
import AddOrderForm from "../screens/OrderManagement/Order/components/AddOrderPage";
import AssignedOrders from "../screens/OrderManagement/AssignedOrder/AssignedOrder";
import ConfirmedOrder from "../screens/OrderManagement/ConfirmedOrder/ConfirmedOrder";
import CancelledOrder from "../screens/OrderManagement/CancelledOrder/CancelledOrder";
import CompletedOrder from "../screens/OrderManagement/CompletedOrder/CompletedOrder";
import Transaction from "../screens/transaction/Transaction";
import VerifyCashPayment from "../screens/transaction/VerifyCashPayment";
// import BlogList from "@/screens/Blog/BlogList/BlogList";
// import BlogEditor from "@/screens/Blog/BlogEditor/BlogEditor";
// import BlogView from "@/screens/Blog/BlogView/BlogView";
// import BlogAnalytics from "@/screens/Blog/BlogAnalytics/BlogAnalytics";

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
    path: "/settings/profile-config",
    element: <EditProfileForm />,
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
  {
    path: FrontendRoutes.PRODUCTCATEGORY,
    element: <ProductCategory />,
  },
  {
    path: FrontendRoutes.PRODUCTSUBCATEGORY,
    element: <Productsubcategory />,
  },
  {
    path: "/product/image-demo",
    element: <ProductImageDemo />,
  },

  // {
  //   path: FrontendRoutes.CUSTOMER,
  //   element: <CustomerIndex />,
  // },
  // {
  //   // path: "/customer/customer-details/:id",
  //   path: FrontendRoutes.CUSTOMERDETAILS,

  //   element: <CustomerDetails />,
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

  // {
  //   path: FrontendRoutes.NOTIFICATION,
  //   element: <NotificationIndex />,
  // },
  // {
  //   path: "/notification-test",
  //   element: <NotificationTest />,
  // },
  // {
  //   path: "/notification-admin",
  //   element: <NotificationAdminPanel />,
  // },
  {
    path: FrontendRoutes.GIFTS,
    element: <GiftsAdminPanel />,
  },
  {
    path: FrontendRoutes.ADDGIFT,
    element: <GiftFormPage />,
  },
  {
    path: FrontendRoutes.EDITGIFT,
    element: <GiftFormPage />,
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

  {
    path: FrontendRoutes.TRANSACTION,
    element: <Transaction />,
  },
  {
    path: FrontendRoutes.VERIFY_CASH,
    element: <VerifyCashPayment />,
  },

  //finance and expenses
  // {
  //   path: FrontendRoutes.EXPENSE,
  //   element: <Expenses />,
  // },
  // {
  //   path: FrontendRoutes.CASHFLOW,
  //   element: <Cashflow />,
  // },
  // {
  //   path: FrontendRoutes.PROFIT_LOSS,
  //   element: <ProfitandLoss />,
  // },
  //Analytics
  // {
  //   path: FrontendRoutes.ORDER_REPORT,
  //   element: <OrderReport />,
  // },
  // {
  //   path: FrontendRoutes.SALES_REPORT,
  //   element: <SalesReport />,
  // },
  // {
  //   path: FrontendRoutes.STOCK_REPORT,
  //   element: <StoreReport />,
  // },
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
  // {
  //   path: FrontendRoutes.BLOGANALYTICS,
  //   element: <BlogAnalytics />,
  // },

  {
    path: FrontendRoutes.CONTACTUS,
    element: <ContactUs />,
  },
  {
    path: FrontendRoutes.ADDQUERIES,
    element: <AddQueries />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
