
import { LoginPage } from '../pages';
import { DashboardPage } from '../pages/Dashboard/Dashboard';
import { NotFoundPage } from '../pages/NotFound/NotFound';
import ProductCategory from '../pages/Product/ProductCategory/ProductCategory';
import ProductList from '../pages/Product/ProductList/ProductList';
import ProductSubCategory from '../pages/Product/ProductSubcategory/ProductSubCategory';
import AssignedOrders from '../pages/OrderManagement/AssignedOrder/AssignedOrder';
import CancelledOrder from '../pages/OrderManagement/CancelledOrder/CancelledOrder';
import CompletedOrder from '../pages/OrderManagement/CompletedOrder/CompletedOrder';
import { FrontendRoutes } from './routes';
import ProductDescription from '../pages/Product/ProductList/[id]/ProdectDescription';

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
    element: <ProductSubCategory />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
