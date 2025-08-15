export const FrontendRoutes = {
  HOME: '/',
  LOGIN: '/login',
  PRODUCTLIST: '/product/product-list',
  ADDPRODUCT: '/product/add',
  EDITPRODUCT: '/product/edit/:id',
  PRODUCTDESCRIPTION: '/product/:productId',
  PRODUCTCATEGORY: '/product/product-category',
  PRODUCTSUBCATEGORY: '/product/sub-category',
  PRODUCTOCCASION: '/product/product-occasion',
  STONE: '/stone',
  ADDSTONE: '/stone/add',
  EDITSTONE: '/stone/edit/:id',
  ASSIGNEDORDER: '/order/assigned-order',
  CONFIRMEDORDER: '/order/confirmed-order',
  ADDORDER: '/order/add-order',

  CANCELLEDORDER: '/order/cancelled-order',
  COMPLETEDORDER: '/order/completed-order',
  ORDER: '/order/orders',
  ORDERDETAILS: '/order/order-details',
  CUSTOMER: '/customer/customer-list',
  CUSTOMERDETAILS: '/customer/customer-details/:id',
  ADDCUSTOMER: '/customer/add-customer',
  SUPPLIERS: '/inventory/suppliers',
  ADDSUPPLIERS: '/inventory/suppliers/:page',
  SUPPLIERDETAIL: '/inventory/supplier/:id',
  SUPPLIERHISTORY: '/inventory/suppliers/supplier-history',

  BANNER: "/banner",
  ADDBANNER: "/banner/add-banner",
  NOTIFICATION: "/notification",
  MYPOSTBUSINESS: "/my-post-business",

  GIFTS: "/gifts",

  TRANSACTION: '/transaction',
  VERIFY_CASH: '/transaction/verify-cash-payment',

  EXPENSE: '/expenses',
  CASHFLOW: '/cashflow',
  PROFIT_LOSS: '/profit&loss',

  ORDER_REPORT: '/order-report',
  SALES_REPORT: '/sales-report',

  // Collection routes
  COLLECTION: '/collection',
  ADDCOLLECTION: '/collection/add',
  EDITCOLLECTION: '/collection/edit/:id',
  COLLECTIONDETAILS: '/collection/:id',

  SETTINGS: '/settings',
  PROFILECONFIG: '/settings/profile-config',

  // Blog routes
  BLOG: '/blog',
  BLOGLIST: '/blog/list',
  ADDBLOG: '/blog/add',
  EDITBLOG: '/blog/edit/:id',
  BLOGDETAILS: '/blog/details/:id',
  BLOGANALYTICS: '/blog/analytics',
};
