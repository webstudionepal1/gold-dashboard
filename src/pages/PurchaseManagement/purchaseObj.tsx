import { get } from "lodash";
import * as z from "zod";
import { Constants } from "../../utils/constants";
interface IButtonObj {
  [key: string]: {
    text?: string;
    show: boolean;
  };
}
interface IContactPerson {
  name: string;
  phone: string;
  email: string;
}
export interface SupplierFormValues {
  name: string;
  description: string;
  email: string;
  phone: string;
  contactPerson: {
    name: string;
    phone: string;
    email: string;
  };
  businessType: string;
  addresses: {
    district: string;
    address: string;
    province: string;
  };
  businessInfo: {
    company: string;
    companyNumber: string;
    PAN: string;
  };
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    paymentTerms: string;
    branch: string;
  };
  logo: File | null; // Optional logo file
  existingLogo?: string; // Optional existing logo URL
  products: string[];
}
export const buttonObj: IButtonObj = {
  purchase: {
    text: "New Purchase",
    show: true,
  },
  "purchase-return": {
    text: "New Purchase",
    show: false,
  },
  supplier: {
    text: "New Supplier",
    show: true,
  },
};
export const purchaseTabOption = [
  { label: "Purchase", value: "purchase" },
  { label: "Purchase Return", value: "purchase-return" },
  { label: "Suppliers", value: "supplier" },
];

// Merge initialData with defaultSupplierData if provided (for editing)

export const supplierSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  phone: z.string().min(1, "Phone is required"),
  contactPerson: z.object({
    name: z.string().min(1, "Contact person name is required"),
    phone: z
      .string()
      .regex(/^\d+$/, "Only digits are allowed")
      .min(1, "Phone is required"),
    email: z.string().email("Invalid email format").min(1, "Email is required"),
  }),
  // alternatePhone: z.string().optional(),
  businessType: z.string().min(1, "Business Type is required"),
  addresses: z.object({
    district: z.string().min(1, "District is required"),
    address: z.string().min(1, "Address is required"),
    province: z.string().min(1, "Province is required"),
  }),
  businessInfo: z.object({
    company: z.string().min(1, "Company is required"),
    companyNumber: z.string().min(1, "Company Number is required"),
    PAN: z.string().min(1, "PAN is required"),
  }),
  bankDetails: z.object({
    accountHolderName: z.string().min(1, "Account Holder Name is required"),
    accountNumber: z.string().min(1, "Account Number is required"),
    bankName: z.string().min(1, "Bank Name is required"),
    paymentTerms: z.string().min(1, "Payment Terms are required"),
    branch: z.string().min(1, "Branch is required"),
  }),
  // logo: z.instanceof(File).nullable(),
  logo: z.instanceof(File).nullable(),
  products: z.array(z.string()).optional(),
});
export const getSupplierInitialFormValues = (state: string, editData?: any) => {
  if (state === "add")
    return {
      name: "",
      description: "",
      email: "",
      phone: "",
      contactPerson: {
        name: "",
        phone: "",
        email: "",
      },
      businessType: "",
      addresses: {
        district: "",
        address: "",
        province: "",
      },
      businessInfo: {
        company: "",
        companyNumber: "",
        PAN: "",
      },
      bankDetails: {
        accountHolderName: "",
        accountNumber: "",
        bankName: "",
        paymentTerms: "",
        branch: "",
      },
      logo: null, // Fix: null instead of File constructor
      products: [],
    };

  return {
    name: get(editData, "name", ""),
    description: get(editData, "description", ""),
    email: get(editData, "email", ""),
    phone: get(editData, "phone", ""),
    contactPerson: {
      name: get(editData, "contactPerson.name", ""),
      phone: get(editData, "contactPerson.phone", ""),
      email: get(editData, "contactPerson.email", ""),
    },
    businessType: get(editData, "businessType", ""),
    addresses: {
      district: get(editData, "addresses.district", ""),
      address: get(editData, "addresses.address", ""),
      province: get(editData, "addresses.province", ""),
    },
    businessInfo: {
      company: get(editData, "businessInfo.company", ""),
      companyNumber: get(editData, "businessInfo.companyNumber", ""),
      PAN: get(editData, "businessInfo.PAN", ""),
    },
    bankDetails: {
      accountHolderName: get(editData, "bankDetails.accountHolderName", ""),
      accountNumber: get(editData, "bankDetails.accountNumber", ""),
      bankName: get(editData, "bankDetails.bankName", ""),
      paymentTerms: get(editData, "bankDetails.paymentTerms", ""),
      branch: get(editData, "bankDetails.branch", ""),
    },
    logo: null, // Fix: null instead of File constructor
    existingLogo: get(editData, "logo[0]"),
    products: get(editData, "products", []).map((item: { _id: string }) =>
      get(item, "_id")
    ),
  };
};

export function appendFormData(
  formData: FormData,
  data: Record<string, any>,
  parentKey: string = ""
) {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];
      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      if (
        typeof value === "object" &&
        value !== null &&
        !(value instanceof File)
      ) {
        appendFormData(formData, value, fullKey); // Recursive call for nested object
      } else {
        formData.append(fullKey, value);
      }
    }
  }
}

export interface ITable {
  [key: string]: {
    columns: { key: string; title: string }[];
    rows: any;
    [key: string]: any;
  };
}

export const supplierColumns = [
  {
    title: "Supplier Name",
    key: "name",
  },
  { title: "Contact Person", key: "contactPerson" },
  {
    title: "Phone",
    key: "phone",
  },
  {
    title: "Contact Person No",
    key: "contactNo",
  },
  {
    title: "Lead Time (Days)",
    key: "leadTime",
  },
];

export const purchaseColumns = [
  {
    title: "Date",
    key: "date",
  },
  {
    title: "billNo",
    key: "billNo",
  },
  {
    title: "Supplier Name",
    key: "supplier",
  },
  {
    title: "Total Amount",
    key: "totalCost",
  },
];
export const purchaseReturnColumns = [
  { key: "date", title: "Date" },
  {
    title: "Return No",
    key: "returnNo",
  },
  {
    key: "totalAmount",
    title: "Total Amount",
  },
  {
    key: "refundAmount",
    title: "Refund Amount",
  },
  {
    title: "Reason",
    key: "reason",
  },
];

export const purchaseReturnFormSchema = z.object({
  bill_no: z.string().min(1, "Bill No is required"),
  return_id: z.string().min(1, "Return Id is required"),
  supplier_name: z.string().min(1, "Supplier Name is required"),
  address: z.string().min(1, "Address is required"),
  username: z.string().min(1, "User Name is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
      "Password must be at least 8 characters long, and include uppercase, lowercase, number, and special character"
    ),
  terms_and_conditions: z.literal(true, {
    errorMap: () => ({ message: "Follow through the terms and conditions" }),
  }),

  profile_photo: z.instanceof(File, {
    message: "Profile photo is required",
  }),
  mobile_image: z.instanceof(File, {
    message: "Mobile Image is required",
  }),
});

export const returnColumns = [
  { key: "name", title: "Item Name" },
  {
    key: "price",
    title: `Cost per unit (${Constants.currency})`,
  },
  { key: "quantity", title: "QTY" },
  {
    key: "total",
    title: `Total (${Constants.currency})`,
  },
];

export const viewPurchaseColumns = [
  { key: "name", title: "Item Name" },
  {
    key: "costPerUnit",
    title: `Cost per unit (${Constants.currency})`,
  },
  { key: "quantity", title: "QTY" },
  { key: "wt", title: "Weight" },
  {
    key: "total",
    title: `Total (${Constants.currency})`,
  },
];

export interface IRawMaterialForm {
  billNo: string;
  supplier: string;
  // phone_no: string;
  items: {
    item: string;
    quantity: number;
    price: number;
    wt: number;
    paidAmount: number;
  }[];
  description?: string;
}
export const RawMaterialSchema = z.object({
  billNo: z.string().min(1, "**Bill No is required**"),
  supplier: z.string().min(1, "**Supplier name is required**"),
  // phone_no: z.string().min(1, "**Phone Number is required**"),
  items: z
    .array(
      z.object({
        item: z.string().min(1, "**Item name is required**"),
        quantity: z.coerce.number().min(1, "**Quantity is required**"),
        price: z.coerce.number().min(1, "**Price is required**"),
        wt: z.number().min(1, "** Weight is required **"),
        paidAmount: z.coerce.number().min(1, "**Paid Amount is required**"),
      })
    )
    .min(1, "**At least one item is required**"),
  description: z.string().optional(),
});

export interface IPurchaseForm {
  billNo: string;
  supplier: string;
  // phone_no: string;
  products: {
    product: string;
    quantity: number;
    price: number;
    paidAmount: number;
    wt: number;
  }[];
  description?: string;
}
export const PurchaseSchema = z.object({
  billNo: z.string().min(1, "**Bill No is required**"),
  supplier: z.string().min(1, "**Supplier name is required**"),
  // phone_no: z.string().min(1, "**Phone Number is required**"),
  products: z
    .array(
      z.object({
        product: z.string().min(1, "**Product name is required**"),
        quantity: z.coerce.number().min(1, "**Quantity is required**"),
        price: z.coerce.number().min(1, "**Price is required**"),
        paidAmount: z.coerce.number().min(1, "**Paid Amount is required**"),
        wt: z.coerce.number().min(1, "**Weight is required**"),
      })
    )
    .min(1, "**At least one item is required**"),
  description: z.string().optional(),
});
export const supplierfieldSchemas = {
  name: supplierSchema.shape.name,
  email: supplierSchema.shape.email,
  phone: supplierSchema.shape.phone,
  businessType: supplierSchema.shape.businessType,
  addresses: {
    address: supplierSchema.shape.addresses.shape.address,
    district: supplierSchema.shape.addresses.shape.district,
    province: supplierSchema.shape.addresses.shape.province,
  },
  description: supplierSchema.shape.description,
  contactPerson: {
    name: supplierSchema.shape.contactPerson.shape.name,
    phone: supplierSchema.shape.contactPerson.shape.phone,
    email: supplierSchema.shape.contactPerson.shape.email,
  },
  bankDetails: {
    paymentTerms: supplierSchema.shape.bankDetails.shape.paymentTerms,
    bankName: supplierSchema.shape.bankDetails.shape.bankName,
    branch: supplierSchema.shape.bankDetails.shape.branch,
    accountHolderName: supplierSchema.shape.bankDetails.shape.accountHolderName,
    accountNumber: supplierSchema.shape.bankDetails.shape.accountNumber,
  },
  businessInfo: {
    company: supplierSchema.shape.businessInfo.shape.company,
    companyNumber: supplierSchema.shape.businessInfo.shape.companyNumber,
    PAN: supplierSchema.shape.businessInfo.shape.PAN,
  },
  products: supplierSchema.shape.products,
  logo: supplierSchema.shape.logo,
};
