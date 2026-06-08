import { z } from "zod";
import { IFetchCompany } from "../../server/api/companyHooks";
import { get } from "lodash";

export const attributeObj = [
  {
    label: "Clasp Type",
    value: "clasp-type",
  },
  {
    label: "Metal Type",
    value: "metal-type",
  },
  {
    label: "Metal Prices",
    value: "metal-prices",
  },
];

export const claspsColumn = [
  { key: "sn", title: "S.N" },

  {
    key: "name",
    title: "Claspy Type Name",
  },
  {
    key: "photo",
    title: "Image",
  },
  {
    key: "status",
    title: "Status",
  },
];

export const metalTypeColumns = [
  { key: "sn", title: "S.N" },
  { key: "name", title: "Metal Type" },
  { key: "slug", title: "Slug" },
  { key: "sortOrder", title: "Sort Order" },
  { key: "status", title: "Status" },
];

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

// export const editCustomerSchema = z.object({
//   shop_name: z.string().min(1, "Shop Name is required"),
//   owner_name: z.string().min(1, "Owner Name is required"),
//   email: z.string().min(1, "Email is required"),
//   phone_no: z.string().min(1, "Phone Number is required"),
//   registration_number: z.string().min(1, "Registration number is required"),
//   street_address: z.string().min(1, "Street Address is required"),
//   city: z.string().min(1, "City is required"),
//   country: z.string().min(1, "Country is required"),
//   zip_code: z.string().min(1, "Zip Code is required"),
//   open_day: z.string().min(1, "Opening days are required"),
//   opening_time: z
//     .string()
//     .regex(timeRegex, { message: "Invalid time format. Use 24 hour format" }),

//   closing_time: z
//     .string()
//     .regex(timeRegex, { message: "Invalid time format. Use 24 hour format" }),

//   payment_method: z.string().min(1, "Payment method is required"),
//   bank_name: z.string().min(1, "Bank Name is required"),
//   bank_account_number: z.string().min(1, "Bank Account Number is required"),
//   account_name: z.string().min(1, "Account Name is required"),

//   password: z
//     .string()
//     .min(1, "Password is required")
//     .regex(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
//       "Password must be at least 8 characters long, and include uppercase, lowercase, number, and special character"
//     ),
//   terms_and_conditions: z.literal(true, {
//     errorMap: () => ({ message: "Follow through the terms and conditions" }),
//   }),

//   profile_photo: z.instanceof(File, {
//     message: "Profile photo is required",
//   }),
//   qrcode: z.instanceof(File, {
//     message: "QR code is required",
//   }),
// });

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
  profile_photo: z
    .instanceof(File, { message: "Profile photo is required" })
    .refine(
      (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
      "Profile photo must be in PNG, JPEG, or JPG format"
    ),
  qrcode: z
    .instanceof(File, { message: "QR code is required" })
    .refine(
      (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
      "QR code must be in PNG, JPEG, or JPG format"
    ),
});

export interface IProfileValue {
  name: string;
  ownerNo: string;
  phone: string;
  email: string;
  registrationNo: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  openDay: string;
  openTime: string;
  closeTime: string;
  paymentMode?: string;
  companyName?: string;
  bankName: string;
  branch: string;
  accountNo: string;
  accountHolder: string;
  logo: null | File;
  qr: File[];
  existingQr: string[];
}
export const generateProfileValue = (data: IFetchCompany): IProfileValue => ({
  name: get(data, "name", ""),
  ownerNo: get(data, "ownerNo", ""),
  phone: get(data, "phone", ""),
  email: get(data, "email", ""),
  registrationNo: get(data, "registrationNo", ""),
  address: get(data, "address", ""),
  city: get(data, "city", ""),
  country: get(data, "country", ""),
  zipCode: get(data, "zipCode", ""),
  openDay: get(data, "openDay", ""),
  openTime: get(data, "openTime", ""),
  closeTime: get(data, "closeTime", ""),
  paymentMode: get(data, "paymentMode"),
  companyName: get(data, "companyName"),
  bankName: get(data, "bankName", ""),
  branch: get(data, "branch", ""),
  accountNo: get(data, "accountNo", ""),
  accountHolder: get(data, "accountHolder", ""),
  logo: null,
  qr: [] as File[],
  existingQr: get(data, "qr", []),
});
