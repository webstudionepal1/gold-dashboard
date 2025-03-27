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
    },
    {
      id: 3,
      path: "#",
      title: "Order",
      icon: "lets-icons:order",
      children: [
        {
          id: 34,
          path: FrontendRoutes.ORDER,
          title: "Orders"
        },
        {
          id: 30,
          path: FrontendRoutes.ASSIGNEDORDER,
          title: "Assigned Order",
          icon: "",
        },
        {
          id: 32,
          path: FrontendRoutes.COMPLETEDORDER,
          title: "Completed Order",

        },
        {
          id: 33,
          path: FrontendRoutes.CANCELLEDORDER,
          title: "Cancelled Order"
        },


      ],
    },
    {
      id: 4,
      path: FrontendRoutes.CUSTOMER,
      title: 'Customer',
      icon: 'line-md:account-small',
    },
    {
      id: 5,
      path: "#",
      title: "Inventory",
      icon: "mingcute:inventory-line",
      children: [
        {
          id: 50,
          path: FrontendRoutes.INVENTORY,
          title: "Inventory Overview"
        },
        {
          id: 51,
          path: FrontendRoutes.PURCHASE,
          title: "Purchase Management",
          icon: "",
        },
        

      ],
    },

  ],
};


