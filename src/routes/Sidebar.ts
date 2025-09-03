import { FrontendRoutes } from './routes';

export const SidebarConfig = {
  sections: [
    {
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
          path: '#',
          title: 'Products',
          icon: 'raphael:package',
          children: [
            {
              id: 20,
              path: FrontendRoutes.PRODUCTLIST,
              title: 'Product List',
              icon: '',
            },
            {
              id: 21,
              path: FrontendRoutes.PRODUCTCATEGORY,
              title: 'Product Category',
              icon: '',
            },
            {
              id: 22,
              path: FrontendRoutes.PRODUCTSUBCATEGORY,
              title: 'Product Sub Category',
              icon: '',
            },
            // {
            //   id: 23,
            //   path: FrontendRoutes.PRODUCTOCCASION,
            //   title: "Product Occasion",
            //   icon: "",
            // },
            // {
            //   id: 24,
            //   path: FrontendRoutes.STONE,
            //   title: "Stone Management",
            //   icon: "",
            // },
          ],
        },
        {
          id: 25,
          path: FrontendRoutes.COLLECTION,
          title: 'Collections',
          icon: 'bi:collection',
        },
        {
          id: 3,
          path: '#',
          title: 'Order',
          icon: 'lets-icons:order',
          children: [
            {
              id: 34,
              path: FrontendRoutes.ORDER,
              title: 'Orders',
            },

            {
              id: 38,
              path: FrontendRoutes.CONFIRMEDORDER,
              title: 'Confirmed Order',
            },
            {
              id: 32,
              path: FrontendRoutes.COMPLETEDORDER,
              title: 'Completed Order',
            },
            {
              id: 33,
              path: FrontendRoutes.CANCELLEDORDER,
              title: 'Cancelled Order',
            },
          ],
        },
        // {
        //   id: 4,
        //   path: FrontendRoutes.CUSTOMER,
        //   title: "Customer",
        //   icon: "line-md:account-small",
        // },
        // {
        //   id: 5,
        //   path: "#",
        //   title: "Inventory",
        //   icon: "mingcute:inventory-line",
        //   children: [
        //     {
        //       id: 50,
        //       path: FrontendRoutes.INVENTORY,
        //       title: "Inventory Overview",
        //     },
        //     {
        //       id: 51,
        //       path: FrontendRoutes.PURCHASE,
        //       title: "Purchase Management",
        //       icon: "",
        //     },
        //   ],
        // },
        // {
        //   id: 6,
        //   path: FrontendRoutes.ATTRIBUTES,
        //   title: "Attributes",
        //   icon: "game-icons:gear-stick-pattern",
        // },
        // {
        //   id: 18,
        //   path: FrontendRoutes.TRANSACTION,
        //   title: "Transaction",
        //   icon: "hugeicons:bitcoin-transaction",
        //   children: [
        //     // {
        //     //   id: 60,
        //     //   path: FrontendRoutes.TRANSACTION,
        //     //   title: "Transaction",
        //     // },
        //     // {
        //     //   id: 61,
        //     //   path: FrontendRoutes.VERIFY_CASH,
        //     //   title: "Verify Cash Payment",
        //     //   icon: "",
        //     // },
        //   ],
        // },
        // {
        //   id: 7,
        //   path: "#",
        //   title: "Finance and Expenses",
        //   icon: "fluent:wallet-credit-card-24-regular",
        //   children: [
        //     {
        //       id: 70,
        //       path: FrontendRoutes.EXPENSE,
        //       title: "Expenses",
        //     },
        //     {
        //       id: 71,
        //       path: FrontendRoutes.CASHFLOW,
        //       title: "Cash Flow",
        //       icon: "",
        //     },
        //     {
        //       id: 72,
        //       path: FrontendRoutes.PROFIT_LOSS,
        //       title: "Profit & Loss",
        //       icon: "",
        //     },
        //   ],
        // },
        // {
        //   id: 8,
        //   path: "#",
        //   title: "Analytics",
        //   icon: "ic:sharp-query-stats",
        //   children: [
        //     {
        //       id: 70,
        //       path: FrontendRoutes.ORDER_REPORT,
        //       title: "Order Report",
        //     },
        //     {
        //       id: 71,
        //       path: FrontendRoutes.SALES_REPORT,
        //       title: "Sales Report",
        //     },
        //     {
        //       id: 72,
        //       path: FrontendRoutes.STOCK_REPORT,
        //       title: "Stock Report",
        //     },
        //   ],
        // },

        {
          id: 13,
          path: '#',
          title: 'Settings',
          icon: 'mdi-light:settings',
          children: [
            {
              id: 107,
              path: '/settings/profile-config',
              title: 'Profile config',
            },
            // {
            //   id: 108,
            //   path: "/settings/attribute-config",
            //   title: "Attribute config",
            // },
            // {
            //   id:109,
            //   path: "/settings/calculator",
            //   title: "Calculator",
            // }
          ],
        },
        {
          id: 15,
          path: FrontendRoutes.BANNER,
          title: 'Banner',
          icon: 'fluent:content-view-32-regular',
        },
        // {
        //   id: 16,
        //   path: FrontendRoutes.GIFTS,
        //   title: 'Gifts & Packages',
        //   icon: 'tabler:gift',
        // },
        // {
        //   id: 19,
        //   path: FrontendRoutes.NOTIFICATION,
        //   title: 'Notification',
        //   icon: 'iconamoon:notification-bold',
        // },
        {
          id: 20,
          path: '#',
          title: 'Blog',
          icon: 'material-symbols:article-outline',
          children: [
            {
              id: 201,
              path: FrontendRoutes.BLOGLIST,
              title: 'Blog List',
              icon: '',
            },
            // {
            //   id: 202,
            //   path: FrontendRoutes.ADDBLOG,
            //   title: 'Create Blog',
            //   icon: '',
            // },
            {
              id: 203,
              path: FrontendRoutes.BLOGANALYTICS,
              title: 'Blog Analytics',
              icon: '',
            },
          ],
        },

        // {
        //   id: 22,
        //   path: FrontendRoutes.CONTACTUS,
        //   title: 'Contact Us',
        //   icon: 'lucide:contact-round',
        // },
        // MyPostBusiness commented out - will be integrated later
        // {
        //   id: 9,
        //   path: FrontendRoutes.MYPOSTBUSINESS,
        //   title: "My Post Business",
        //   icon: "mdi:truck-fast-outline",
        // },
      ],
    },
  ],
};
