import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { apiError } from "@/lib/api-response";
import { handleLogin } from "./handlers/auth";
import { handleDashboard } from "./handlers/dashboard";
import {
  handleMetalPriceCreate,
  handleMetalPricesLatest,
  handleMetalPricesList,
} from "./handlers/metalPrice";
import {
  handleUploadComplete,
  handleUploadInitialize,
  handleUploadSingle,
} from "./handlers/upload";
import {
  handleProductList,
  handleProductSearch,
  handleProductGet,
  handleProductCreate,
  handleProductUpdate,
  handleProductDelete,
  handleValidateSku,
  handleCategoryList,
  handleCategoryCreate,
  handleCategoryUpdate,
  handleCategoryDelete,
  handleSubCategoryList,
  handleSubCategoryCreate,
  handleSubCategoryUpdate,
  handleSubCategoryDelete,
  handleClaspList,
  handleClaspCreate,
  handleClaspUpdate,
  handleClaspDelete,
  handleProductTypeList,
  handleProductTypeCreate,
  handleProductTypeUpdate,
  handleProductTypeDelete,
  handleMetalTypeList,
  handleMetalTypeCreate,
  handleMetalTypeUpdate,
  handleMetalTypeDelete,
  handleStoneList,
  handleStoneCreate,
  handleStoneUpdate,
  handleStoneDelete,
  handleOccasionList,
  handleOccasionCreate,
  handleOccasionUpdate,
  handleOccasionDelete,
} from "./handlers/product";
import {
  handleBlogList,
  handleBlogGet,
  handleBlogCreate,
  handleBlogUpdate,
  handleBlogDelete,
  handleBlogAnalytics,
} from "./handlers/blog";
import {
  handleBannerList,
  handleBannerCreate,
  handleBannerUpdate,
  handleBannerDelete,
  handleGiftList,
  handleGiftGet,
  handleGiftCreate,
  handleGiftUpdate,
  handleGiftDelete,
  handleGiftStatus,
  handleContactList,
  handleContactCreate,
  handleContactDelete,
  handleCompanyList,
  handleCompanyCreate,
  handleCompanyUpdate,
  handleOrderList,
  handleOrderGet,
  handleOrderCreate,
  handleOrderUpdate,
  handleOrderDelete,
  handleCollectionList,
  handleCollectionCreate,
  handleCollectionUpdate,
  handleCollectionDelete,
  handleSupplierList,
  handleSupplierCreate,
  handleSupplierUpdate,
  handleSupplierDelete,
  handlePurchaseList,
  handlePurchaseCreate,
  handleExpenseList,
  handleExpenseCategoryList,
  handleCashflowList,
  handleTransactionList,
  handleReviewList,
  handlePriceConfigList,
  handlePriceConfigCreate,
  handlePriceConfigUpdate,
  handlePriceConfigDelete,
  handlePushNotificationList,
  handlePushNotificationCreate,
  handleUserList,
  handleFinancialReport,
  handleRawItemList,
} from "./handlers/entities";
import { handleGenericDelete } from "./crud";

const PUBLIC_PATHS = new Set(["login", "contact"]);

export async function apiRouter(
  req: NextRequest,
  pathSegments: string[]
): Promise<Response> {
  const method = req.method;
  const [resource, id, action, subAction] = pathSegments;

  // Auth
  if (resource === "login" && method === "POST") {
    return handleLogin(req);
  }

  // Upload (enhanced-upload/*)
  if (resource === "enhanced-upload") {
    if (id === "single" && method === "POST") return handleUploadSingle(req);
    if (id === "initialize" && method === "POST") return handleUploadInitialize();
    if (id === "complete" && action && method === "POST")
      return handleUploadComplete(req, action);
    return apiError("Upload route not found", 404);
  }

  // Auth check for protected routes
  if (!PUBLIC_PATHS.has(resource) || (resource === "contact" && method !== "POST")) {
    const user = await getAuthUser(req);
    if (!user && resource !== "contact") {
      return apiError("Unauthorized", 401);
    }
  }

  switch (resource) {
    case "dashboard":
      if (method === "GET") return handleDashboard();
      break;

    case "search":
      if (method === "GET") return handleProductSearch(req);
      break;

    case "product":
      if (id === "validate-sku" && action && method === "GET")
        return handleValidateSku(action);
      if (!id && method === "GET") return handleProductList(req);
      if (!id && method === "POST") return handleProductCreate(req);
      if (id && method === "GET") return handleProductGet(id);
      if (id && method === "PATCH") return handleProductUpdate(req, id);
      if (id && method === "DELETE") return handleProductDelete(id);
      break;

    case "category":
      if (!id && method === "GET") return handleCategoryList(req);
      if (!id && method === "POST") return handleCategoryCreate(req);
      if (id && method === "PATCH") return handleCategoryUpdate(req, id);
      if (id && method === "DELETE") return handleCategoryDelete(id);
      break;

    case "subcategory":
      if (!id && method === "GET") return handleSubCategoryList();
      if (!id && method === "POST") return handleSubCategoryCreate(req);
      if (id && method === "PATCH") return handleSubCategoryUpdate(req, id);
      if (id && method === "DELETE") return handleSubCategoryDelete(id);
      break;

    case "clasptype":
      if (!id && method === "GET") return handleClaspList();
      if (!id && method === "POST") return handleClaspCreate(req);
      if (id && method === "PATCH") return handleClaspUpdate(req, id);
      if (id && method === "DELETE") return handleClaspDelete(id);
      break;

    case "producttype":
      if (!id && method === "GET") return handleProductTypeList();
      if (!id && method === "POST") return handleProductTypeCreate(req);
      if (id && method === "PATCH") return handleProductTypeUpdate(req, id);
      if (id && method === "DELETE") return handleProductTypeDelete(id);
      break;

    case "metaltype":
      if (!id && method === "GET") return handleMetalTypeList(req);
      if (!id && method === "POST") return handleMetalTypeCreate(req);
      if (id && method === "PATCH") return handleMetalTypeUpdate(req, id);
      if (id && method === "DELETE") return handleMetalTypeDelete(id);
      break;

    case "stone":
      if (!id && method === "GET") return handleStoneList();
      if (!id && method === "POST") return handleStoneCreate(req);
      if (id && (method === "PUT" || method === "PATCH"))
        return handleStoneUpdate(req, id);
      if (id && method === "DELETE") return handleStoneDelete(id);
      break;

    case "occasion":
      if (!id && method === "GET") return handleOccasionList();
      if (!id && method === "POST") return handleOccasionCreate(req);
      if (id && method === "PATCH") return handleOccasionUpdate(req, id);
      if (id && method === "DELETE") return handleOccasionDelete(id);
      break;

    case "banner":
      if (!id && method === "GET") return handleBannerList(req);
      if (!id && method === "POST") return handleBannerCreate(req);
      if (id && method === "PATCH") return handleBannerUpdate(req, id);
      if (id && method === "DELETE") return handleBannerDelete(id);
      break;

    case "blog":
      if (id === "analytics" && method === "GET") return handleBlogAnalytics();
      if (id === "published" && method === "GET") return handleBlogList(req);
      if (id === "featured" && method === "GET") return handleBlogList(req);
      if (id === "admin" && method === "GET") return handleBlogList(req);
      if (id === "my-blogs" && method === "GET") return handleBlogList(req);
      if (id === "slug" && action && method === "GET") return handleBlogGet(action);
      if (!id && method === "GET") return handleBlogList(req);
      if (!id && method === "POST") return handleBlogCreate(req);
      if (id && method === "GET") return handleBlogGet(id);
      if (id && method === "PATCH") return handleBlogUpdate(req, id);
      if (id && method === "DELETE") return handleBlogDelete(id);
      break;

    case "gift":
      if (id && action === "status" && method === "PATCH")
        return handleGiftStatus(req, id);
      if (!id && method === "GET") return handleGiftList(req);
      if (!id && method === "POST") return handleGiftCreate(req);
      if (id && method === "GET") return handleGiftGet(id);
      if (id && method === "PATCH") return handleGiftUpdate(req, id);
      if (id && method === "DELETE") return handleGiftDelete(id);
      break;

    case "contact":
      if (!id && method === "GET") return handleContactList(req);
      if (!id && method === "POST") return handleContactCreate(req);
      if (id && method === "DELETE") return handleContactDelete(id);
      break;

    case "company":
      if (!id && method === "GET") return handleCompanyList();
      if (!id && method === "POST") return handleCompanyCreate(req);
      if (id && method === "PATCH") return handleCompanyUpdate(req, id);
      break;

    case "order":
      if (!id && method === "GET") return handleOrderList(req);
      if (!id && method === "POST") return handleOrderCreate(req);
      if (id && method === "GET") return handleOrderGet(id);
      if (id && method === "PATCH") return handleOrderUpdate(req, id);
      if (id && method === "DELETE") return handleOrderDelete(id);
      break;

    case "collection":
      if (!id && method === "GET") return handleCollectionList();
      if (!id && method === "POST") return handleCollectionCreate(req);
      if (id && method === "PATCH") return handleCollectionUpdate(req, id);
      if (id && method === "DELETE") return handleCollectionDelete(id);
      break;

    case "supplier":
      if (!id && method === "GET") return handleSupplierList();
      if (!id && method === "POST") return handleSupplierCreate(req);
      if (id && method === "PATCH") return handleSupplierUpdate(req, id);
      if (id && method === "DELETE") return handleSupplierDelete(id);
      break;

    case "purchase":
      if (id === "return") return apiError("Use purchase return endpoints", 501);
      if (!id && method === "GET") return handlePurchaseList();
      if (!id && method === "POST") return handlePurchaseCreate(req);
      break;

    case "expense":
      if (id === "category") {
        if (method === "GET") return handleExpenseCategoryList();
      }
      if (!id && method === "GET") return handleExpenseList();
      break;

    case "cashflow":
      if (!id && method === "GET") return handleCashflowList();
      if (id && method === "DELETE") return handleGenericDelete("cashFlow", id);
      break;

    case "transactions":
      if (method === "GET") return handleTransactionList(req);
      break;

    case "review":
      if (method === "GET") return handleReviewList();
      break;

    case "metal-prices":
      if (id === "latest" && method === "GET") return handleMetalPricesLatest();
      if (!id && method === "GET") return handleMetalPricesList();
      if (!id && method === "POST") return handleMetalPriceCreate(req);
      break;

    case "price-config":
      if (!id && method === "GET") return handlePriceConfigList();
      if (!id && method === "POST") return handlePriceConfigCreate(req);
      if (id && method === "PATCH") return handlePriceConfigUpdate(req, id);
      if (id && method === "DELETE") return handlePriceConfigDelete(id);
      break;

    case "push-notification":
      if (!id && method === "GET") return handlePushNotificationList();
      if (!id && method === "POST") return handlePushNotificationCreate(req);
      break;

    case "user":
      if (method === "GET") return handleUserList();
      break;

    case "financial-report":
      if (method === "GET") return handleFinancialReport(req);
      break;

    case "rawitem":
      if (method === "GET") return handleRawItemList();
      break;

    case "orderProduct":
    case "orderCategory":
    case "orderSubCategory":
    case "orderStatus":
    case "top-products":
      if (method === "GET") return handleOrderList(req);
      break;

    case "profile":
      if (id && method === "DELETE") return handleGenericDelete("user", id);
      break;
  }

  return apiError(`Route not found: ${pathSegments.join("/")}`, 404);
}
