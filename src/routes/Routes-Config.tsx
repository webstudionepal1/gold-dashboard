
import { LoginPage } from '../pages';
import AddCustomerForm from '../pages/Customer/AddCustomerForm/AddCustomerForm';
import CustomerList from '../pages/Customer/CustomerList/CustomerList';
import CustomerDetail from '../pages/Customer/CustomerView/CustomerView';
import { DashboardPage } from '../pages/Dashboard/Dashboard';
import InventoryOverview from '../pages/Inventory/InventoryOverview/InventoryOverview';
import Purchase from '../pages/Inventory/PurchaseManagement/Purchase';
import PurchaseReturn from '../pages/Inventory/PurchaseManagement/PurchaseReturn';
import Suppliers from '../pages/Inventory/PurchaseManagement/Suppliers';
import { NotFoundPage } from '../pages/NotFound/NotFound';
import AssignedOrders from '../pages/OrderManagement/AssignedOrder/AssignedOrder';
import CancelledOrder from '../pages/OrderManagement/CancelledOrder/CancelledOrder';
import CompletedOrder from '../pages/OrderManagement/CompletedOrder/CompletedOrder';
import { FrontendRoutes } from './routes';
import ProductDescription from '../pages/Product/ProductList/[id]/ProdectDescription';
import ProductList from '../pages/Product/ProductList/ProductList';
import { ProductCategory } from '../pages/Product/ProductCategory/ProductCategory';
import Productsubcategory from '../pages/Product/ProductSubcategory/ProductSubCategory';

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
    path: FrontendRoutes.ASSIGNEDORDER,
    element: <AssignedOrders />
  },
  {
    path: FrontendRoutes.CANCELLEDORDER,
    element: <CancelledOrder />
  },
  {
    path: FrontendRoutes.COMPLETEDORDER,
    element: <CompletedOrder />
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
    element: <CustomerList/>
  },

  // {
  //   path: FrontendRoutes.CUSTOMERVIEW,
  //   element: <CustomerDetail/>
  // },

  // {
  //   path: FrontendRoutes.ADDCUSTOMER,
  //   element: <AddCustomerForm/>
  // },

  {
    path: FrontendRoutes.INVENTORY,
    element: <InventoryOverview/>
  },
  {
    path: FrontendRoutes.PURCHASE,
    element: <Purchase/>
  },
  {
    path: FrontendRoutes.PURCHASERETURN,
    element: <PurchaseReturn/>
  },
  {
    path: FrontendRoutes.SUPPLIERS,
    element: <Suppliers/>
  },


  {
    path: '*',
    element: <NotFoundPage />,
  },
];
