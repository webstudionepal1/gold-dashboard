import { z } from "zod";
import { IFetchCompany } from "../../server/api/companyHooks";

export const attributeObj = [
  {
    label: "Calsp Type",
    value: "clasp-type",
  },
  {
    label: "Raw Material",
    value: "raw-material",
  },
];

export const claspsColumn = [
  { key: "sn", title: "S.N" },

  {
    key: "name",
    title: "Claspy Type Name",
  },
  {
    key: "img",
    title: "Image",
  },
  {
    key: "status",
    title: "Status",
  },
];
export const rawColumns = [
  { key: "sn", title: "S.N" },
  {
    key: "name",
    title: "name",
  },
  { key: "unit", title: "unit" },
];
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const editCustomerSchema = z.object({
  shop_name: z.string().min(1, "Shop Name is required"),
  owner_name: z.string().min(1, "Owner Name is required"),
  email: z.string().min(1, "Email is required"),
  phone_no: z.string().min(1, "Phone Number is required"),
  registration_number: z.string().min(1, "Registration number is required"),
  street_address: z.string().min(1, "Street Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  zip_code: z.string().min(1, "Zip Code is required"),
  open_day: z.string().min(1, "Opening days are required"),
  opening_time: z
    .string()
    .regex(timeRegex, { message: "Invalid time format. Use 24 hour format" }),

  closing_time: z
    .string()
    .regex(timeRegex, { message: "Invalid time format. Use 24 hour format" }),

  payment_method: z.string().min(1, "Payment method is required"),
  bank_name: z.string().min(1, "Bank Name is required"),
  bank_account_number: z.string().min(1, "Bank Account Number is required"),
  account_name: z.string().min(1, "Account Name is required"),

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
  qrcode: z.instanceof(File, {
    message: "QR code is required",
  }),
});

export const generateProfileValue = (data: IFetchCompany) => ({
  shop_name: "",
  owner_name: "",
  email: "",
  phone_no: "",
  registration_number: "",
  street_address: "",
  city: "",
  country: "",
  zip_code: "",

  open_day: "",
  opening_time: "",

  closing_time: "",
  payment_method: "",

  bank_name: "",
  bank_account_number: "",
  account_name: "",
  password: "",
  terms_and_conditions: false,
  profile_photo: null as File | null,
  qrcode: null as File | null,
});
