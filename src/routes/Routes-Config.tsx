
import { DashboardPage } from "../pages/Dashboard/Dashboard";

// import PurchaseReturn from "../pages/Inventory/PurchaseManagement/PurchaseReturn";
// import Suppliers from "../pages/Inventory/PurchaseManagement/Suppliers";
import { NotFoundPage } from "../pages/NotFound/NotFound";
import ProductCategory from "../pages/Product/ProductCategory/ProductCategory";
import ProductDescription from "../pages/Product/ProductList/[id]/ProdectDescription";
import ProductList from "../pages/Product/ProductList/ProductList";
import Productsubcategory from "../pages/Product/ProductSubcategory/ProductSubCategory";
import { FrontendRoutes } from "./routes";

import NotificationAdminPanel from "../components/admin/NotificationAdminPanel";
import NotificationTest from "../components/test/NotificationTest";
import BannerIndex from "../pages/Banner/BannerIndex";
import AddBannerForm from "../pages/Banner/Components/AddBannerForm";
import NotificationIndex from "../pages/Notification/NotificationIndex";
import OrderIndex from "../pages/OrderManagement/Order/OrderIndex";

// import AddCustomerForm from "../pages/Customer/components/AddCustomerForm";
import Transaction from "../pages/transaction/Transaction";

import BlogAnalytics from "@/pages/Blog/BlogAnalytics/BlogAnalytics";
import BlogEditor from "@/pages/Blog/BlogEditor/BlogEditor";
import BlogList from "@/pages/Blog/BlogList/BlogList";
import BlogView from "@/pages/Blog/BlogView/BlogView";
import Calculator from "@/pages/settings/calculator/Calculator";
import CalculatorIndex from "@/pages/settings/calculator/CalculatorIndex";
import OrderDetails from "../pages/OrderManagement/Order/OrderDetails";
import NewProductForm from "../pages/Product/components/NewProductForm";
import ProductImageDemo from "../pages/Product/ProductImageDemo";
import ProductForm from "../pages/Product/ProductList/component/ProductForm";
import AttribConfig from "../pages/settings/components/AttribConfig";
import EditProfileForm from "../pages/settings/ProfileConfig/EditProfileForm";
import TestUpload from "../pages/TestUpload";
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
  //   path: FrontendRoutes.ORDER,
  //   element: <OrderIndex />,
  // },
  // {
  //   path: "/order/order-details/:id",
  //   element: <OrderDetails />,
  // },
  // {
  //   path: "/order/confirmed-order-details/:id",
  //   element: <OrderDetails />,
  // },
  {
    path: "/attribs",
    element: <AttribConfig />,
  },
  // {
  //   path: "/order/assigned-order-details/:id",
  //   element: <OrderDetails />,
  // },
  // {
  //   path: "/order/completed-order-details/:id",
  //   element: <OrderDetails />,
  // },
  // {
  //   path: "/order/cancelled-order-details/:id",
  //   element: <OrderDetails />,
  // },
  // {
  //   path: FrontendRoutes.ADDORDER,
  //   element: <AddOrderForm />,
  // },
  // {
  //   path: FrontendRoutes.ASSIGNEDORDER,
  //   element: <AssignedOrders />,
  // },
  // {
  //   path: FrontendRoutes.CONFIRMEDORDER,
  //   element: <ConfirmedOrder />,
  // },
  // {
  //   path: FrontendRoutes.CANCELLEDORDER,
  //   element: <CancelledOrder />,
  // },
  // {
  //   path: FrontendRoutes.COMPLETEDORDER,
  //   element: <CompletedOrder />,
  // },
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
  {
    path: FrontendRoutes.TRANSACTION,
    element: <Transaction />,
  },
  
  {
    path: FrontendRoutes.PROFILECONFIG,
    element: <EditProfileForm />,
  },
  // {
  //   path: "/settings/attribute-config",
  //   element: <AttribConfig />,
  // },
  {
    path: "/settings/calculator",
    element: <Calculator />,
  },
  {
    path:'/settings/calculator/:status',
    element:<CalculatorIndex />,
  },
  {
    path: "/test-upload",
    element: <TestUpload />,
  },
  // {
  //   path: FrontendRoutes.LOGIN,
  //   element: <LoginPage />,
  // },
  // {
  //   path: FrontendRoutes.PRODUCTDESCRIPTION,
  //   element: <ProductDescription />,
  // },
  // {
  //   path: FrontendRoutes.PRODUCTOCCASION,
  //   element: <ProductOccasion />,
  // },
  // {
  //   path: FrontendRoutes.STONE,
  //   element: <StoneIndex />,
  // },
  // {
  //   path: FrontendRoutes.ADDCUSTOMER,
  //   element: <AddCustomerForm />,
  // },

  // {
  //   path: FrontendRoutes.INVENTORY,
  //   element: <InventoryIndex />,
  // },
  // {
  //   path: FrontendRoutes.ADDSUPPLIERS,
  //   element: <AddSupplierForm />,
  // },
  // {
  //   path: FrontendRoutes.SUPPLIERDETAIL,
  //   element: <SupplierDetail />,
  // },
  // {
  //   path: FrontendRoutes.SUPPLIERHISTORY,
  //   element: <SupplierHistory />,
  // },
  // {
  //   path: FrontendRoutes.PURCHASE,
  //   element: <PurchaseIndex />,
  // },
  // {
  //   path: FrontendRoutes.PURCHASERETURN,
  //   element: <PurchaseReturn />,
  // },
  // {
  //   path: FrontendRoutes.SUPPLIERS,
  //   element: <Suppliers />,
  // },
  // Collections
  // {
  //   path: FrontendRoutes.COLLECTION,
  //   element: <CollectionIndex />,
  // },
  // {
  //   path: FrontendRoutes.ADDCOLLECTION,
  //   element: <NewCollectionForm />,
  // },
  // {
  //   path: FrontendRoutes.EDITCOLLECTION,
  //   element: <NewCollectionForm />,
  // },
  // {
  //   path: FrontendRoutes.COLLECTIONDETAILS,
  //   element: <CollectionDetails />,
  // },
  // MyPostBusiness route commented out - will be integrated later
  // {
  //   path: FrontendRoutes.MYPOSTBUSINESS,
  //   element: <MyPostBusinessIndex />,
  // },

  //Transactions
  // {
  //   path: FrontendRoutes.VERIFY_CASH,
  //   element: <VerifyCashPayment />,
  // },

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
  {
    path: FrontendRoutes.BLOGANALYTICS,
    element: <BlogAnalytics />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
