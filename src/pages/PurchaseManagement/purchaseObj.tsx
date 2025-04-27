import { get } from "lodash";
import * as z from "zod";
interface IButtonObj {
  [key: string]: {
    text?: string;
    show: boolean;
  };
}
export interface SupplierFormValues {
  name: string;
  description?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
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
  logo: File | null;
  products?: string[];
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
  alternatePhone: z.string().optional(),
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
      alternatePhone: "",
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
      logo: null,
      products: [""],
    };

  return {
    name: get(editData, "name", ""),
    description: get(editData, "description"),
    email: get(editData, "email", ""),
    phone: get(editData, "phone", ""),
    alternatePhone: get(editData, "alternatePhone", ""),
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
    logo: null,
    products: [],
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
    title: "Contact No",
    key: "contactNo",
  },
  {
    title: "Lead Time",
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
    key: "return",
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
    title: "Cost per unit",
  },
  { key: "quantity", title: "QTY" },
  {
    key: "total",
    title: "Total",
  },
];

export const viewPurchaseColumns = [
  { key: "name", title: "Item Name" },
  { key: "unit", title: "Unit" },
  {
    key: "costPerUnit",
    title: "Cost per unit",
  },
  { key: "quantity", title: "QTY" },
  {
    key: "total",
    title: "Total",
  },
];
