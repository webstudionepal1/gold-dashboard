// Comprehensive type definitions for order management

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "assigned"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Address {
  fullname: string;
  phone: string;
  email: string;
  address: string;
  landMark?: string;
  landmark?: string; // Alternative casing for compatibility
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface ProductVariant {
  _id: string;
  price: number;
  quantity: number;
  wt?: number; // Weight property
  unit?: string; // Unit property for compatibility
  sku?: string;
  attributes?: Record<string, any>;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  images: string[];
  category?: string;
  brand?: string;
}

export interface OrderedProduct {
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
}

export interface BillDetails {
  subTotal: number;
  subTotalItemPrice?: number; // Alternative field name for compatibility
  shippingCost: number;
  discount: number;
  taxes: number;
  total: number;
  totalBill?: number; // Alternative field name for compatibility
  coupon?: any[]; // Additional field for compatibility
}

export interface OrderTimeline {
  created: string;
  confirmed?: string;
  assigned?: string;
  shipped?: string;
  delivered?: string;
  cancelled?: string;
  // Additional fields for compatibility with IFetchOrder
  canceled?: {
    reason: string | null;
  };
  orderCreated?: string;
  orderConfirmation?: string | null;
  pickUp?: string | null;
  deliveryAssignment?: string | null;
  outForDelivery?: string | null;
  orderHandOver?: string | null;
  deliveryCompletion?: string | null;
}

export interface TransactionDetails {
  paymentMethod: string;
  transactionId?: string;
  paymentGateway?: string;
  paymentDate?: string;
  // Additional fields for compatibility with IFetchOrder
  image?: string;
  payment?: number;
  remainingPayment?: number;
}

export interface DeliveryDetails {
  partner?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
}

export interface CancellationDetails {
  reason: string;
  date: string;
  refundStatus?: "pending" | "processed" | "failed";
  refundAmount?: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: Customer;
  orderedProducts: OrderedProduct[];
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryStatus?: string;
  totalAmount: number;
  shippingAddress: Address;
  billingAddress: Address;
  billDetails: BillDetails;
  orderTimeline: OrderTimeline;
  transactionDetails?: TransactionDetails;
  deliveryDetails?: DeliveryDetails;
  cancellation?: CancellationDetails;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// API Response types
export interface OrdersResponse {
  data: Order[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface OrderResponse {
  data: Order;
}

// Filter and search types
export interface OrderFilters {
  status?: OrderStatus;
  orderStatus?: OrderStatus; // Alternative field name for compatibility
  paymentStatus?: PaymentStatus;
  dateFrom?: string;
  dateTo?: string;
  customerId?: string;
  customer?: string; // Alternative field name for compatibility
  searchQuery?: string;
}

export interface OrderSortOptions {
  field: keyof Order;
  direction: "asc" | "desc";
}

// Table column types
export interface OrderTableColumn {
  key: keyof Order | string;
  title: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, order: Order) => React.ReactNode;
}

// Form types
export interface CreateOrderRequest {
  customerId: string;
  orderedProducts: Array<{
    productId: string;
    variantId: string;
    quantity: number;
  }>;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  notes?: string;
}

export interface UpdateOrderRequest {
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  deliveryDetails?: Partial<DeliveryDetails>;
  cancellation?: CancellationDetails;
  notes?: string;
}

// Component prop types
export interface OrderListProps {
  orders: Order[];
  loading?: boolean;
  onOrderSelect?: (order: Order) => void;
  onStatusUpdate?: (orderId: string, status: OrderStatus) => void;
  filters?: OrderFilters;
  onFiltersChange?: (filters: OrderFilters) => void;
}

export interface OrderDetailsProps {
  order: Order;
  loading?: boolean;
  onUpdate?: (updates: UpdateOrderRequest) => void;
  onCancel?: (reason: string) => void;
  onComplete?: (notes?: string) => void;
}

// Utility types
export type OrderStatusCount = Record<OrderStatus, number>;

export interface OrderStats {
  total: number;
  statusCounts: OrderStatusCount;
  totalRevenue: number;
  averageOrderValue: number;
}

// Error types
export interface OrderError {
  code: string;
  message: string;
  field?: string;
}

export interface OrderValidationResult {
  isValid: boolean;
  errors: OrderError[];
}

// Hook return types
export interface UseOrdersResult {
  orders: Order[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseOrderResult {
  order: Order | null;
  loading: boolean;
  error: string | null;
  update: (updates: UpdateOrderRequest) => Promise<void>;
  cancel: (reason: string) => Promise<void>;
  complete: (notes?: string) => Promise<void>;
}
