
import { LoginPage } from '../pages';
import { DashboardPage } from '../pages/Dashboard/Dashboard';
import { NotFoundPage } from '../pages/NotFound/NotFound';
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
    path: '*',
    element: <NotFoundPage />,
  },
];
