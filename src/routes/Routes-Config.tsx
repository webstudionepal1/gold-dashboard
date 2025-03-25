
import { LoginPage } from '../pages';
import { DashboardPage } from '../pages/Dashboard/Dashboard';
import { NotFoundPage } from '../pages/NotFound/NotFound';
import AssignedOrders from '../pages/OrderManagement/AssignedOrder/AssignedOrder';
import CancelledOrder from '../pages/OrderManagement/CancelledOrder/CancelledOrder';
import CompletedOrder from '../pages/OrderManagement/CompletedOrder/CompletedOrder';
import { FrontendRoutes } from './routes';

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
    element: <AssignedOrders/>,
  },
  {
    path: FrontendRoutes.COMPLETEDORDER,
    element: <CompletedOrder/>
  },
  {
    path: FrontendRoutes.CANCELLEDORDER,
    element: <CancelledOrder/>,
  },



  {
    path: '*',
    element: <NotFoundPage />,
  },
];
