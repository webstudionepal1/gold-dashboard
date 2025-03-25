import { FrontendRoutes } from "./routes";


export const SidebarMainRoutes = {
  title: 'main',
  routes: [
    {
      id: 1,
      path: FrontendRoutes.HOME,
      title: 'Dashboard',
      icon: 'ic:outline-dashboard-customize',
    },
    {
      id: 2,
      path: "#",
      title: "Products",
      icon: "raphael:package",
      children: [
        {
          id: 20,
          path: FrontendRoutes.PRODUCTLIST,
          title: "Product List",
          icon: "",
        },
        {
          id: 21,
          path: FrontendRoutes.PRODUCTCATEGORY,
          title: "Product Category",
          icon: "",
        },
        {
          id: 22,
          path: FrontendRoutes.PRODUCTSUBCATEGORY,
          title: "Product Sub Category",
          icon: "",
        },
      ],
    }

  ],
};


