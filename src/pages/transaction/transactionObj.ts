import { get } from "lodash";
import * as z from "zod";
interface IButtonObj {
  [key: string]: {
    text?: string;
    onClick: (data?: string) => void;
    show: boolean;
  };
}
export interface SupplierFormValues {
  name: string;
  description: string;
  email: string;
  phone: string;
  alternatePhone: string;
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
  products: string[];
}
export const buttonObj: IButtonObj = {
  purchase: {
    text: "New Purchase",
    onClick(data) {},
    show: true,
  },
  "purchase-return": {
    text: "New Purchase",
    onClick(data) {},
    show: false,
  },
  supplier: {
    text: "New Supplier",
    onClick(data) {},
    show: true,
  },
};
export const transactionTabOption = [
  { label: "Cash", value: "cash" },
  { label: "Digital Payment", value: "digitalPayment" },
];
export const supplierSchema = z.object({
  supplier_name: z.string().min(1, "Supplier Name is required"),
  business_type: z.string().min(1, "Business Type is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required"),
  phone_no: z.string().min(1, "Phone Number is required"),
  address: z.string().min(1, "Address is required"),

  payment_terms: z.string().min(1, "Payment Terms is required"),
  bank_name: z.string().min(1, "Bank name is required"),
  branch: z.string().min(1, "Branch is required"),
  account_name: z.string().min(1, "Account Name is required"),
  account_number: z.string().min(10, "Account number is required"),
  company_number: z.string().min(8, "Company number is required"),
  pan_no: z.string().min(10, "PAN number is required"),

  item_supplied: z.string().min(1, "Item supplied is required"),

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

// Merge initialData with defaultSupplierData if provided (for editing)
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
  };
}
