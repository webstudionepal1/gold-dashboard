import { useFormik, FormikProvider, Field, Form } from "formik";
import * as Yup from "yup";
import FormSection from "./components/FormSection";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRef } from "react";

// Define the validation schema using Yup
const validationSchema = Yup.object({
  // General
  shopName: Yup.string().required("Shop name is required"),
  ownerName: Yup.string().required("Owner name is required"),
  phone: Yup.string().required("Phone number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  registerationNo: Yup.string().required("Registration number is required"),

  // Address
  address: Yup.string().required("Street address is required"),
  city: Yup.string().required("City is required"),
  country: Yup.string(),
  zipCode: Yup.string(),

  // Business Hours
  openDay: Yup.string().required("Open day is required"),
  openingTime: Yup.string().required("Opening time is required"),
  closingTime: Yup.string().required("Closing time is required"),

  // Preference
  payment: Yup.string().required("Payment method is required"),

  // Bank Details
  bankName: Yup.string().required("Bank name is required"),
  accountNumber: Yup.string().required("Bank account number is required"),
  accountName: Yup.string().required("Account name is required"),
});

const SettingForm = () => {
  const handleSubmit = (values: any) => {
    console.log("FormValues", values);
  };

  const initialValues = {
    // General
    shopName: "",
    ownerName: "",
    phone: "",
    email: "",
    registerationNo: "",
    // Address
    address: "",
    city: "",
    country: "",
    zipCode: "",
    // Business Hours
    openDay: "",
    openingTime: "",
    closingTime: "",
    // Preference
    payment: "",
    // Bank Details
    bankName: "",
    accountNumber: "",
    accountName: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);

  const general = [
    {
      label: "Shop Name",
      name: "shopName",
      type: "text",
      placeholder: "Enter shop name",
      important: true,
      width: "col-span-2", // Full width – spans both columns
    },
    {
      label: "Owner Name",
      name: "ownerName",
      type: "text",
      important: true,
      placeholder: "Enter Owner Name",
      width: "col-span-1",
    },
    {
      label: "Phone Number",
      name: "phone",
      type: "text",
      important: true,
      placeholder: "eg. +977 32432543",
      width: "col-span-1",
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "Enter Email",
      important: true,
      width: "col-span-1",
    },
    {
      label: "Registration Number",
      name: "registerationNo",
      type: "text",
      placeholder: "Enter Registration Number",
      important: true,
      width: "col-span-1",
    },
  ];

  const address = [
    {
      label: "Street Address",
      name: "address",
      type: "text",
      placeholder: "Enter Street",
      important: true,
    },
    {
      label: "City",
      name: "city",
      type: "text",
      placeholder: "Enter Name of the City",
      important: true,
    },
    {
      label: "Country",
      name: "country",
      type: "text",
      important: true,
      placeholder: "eg. Nepal",
    },
    {
      label: "Zip Code",
      name: "zipCode",
      type: "text",
      placeholder: "Enter Zip Code",
    },
  ];
  const business = [
    {
      label: "Open Day",
      name: "openDay",
      type: "text",
      placeholder: "Sun - Mon",
      important: true,
    },
    {
      label: "Opening Time",
      name: "openingTime",
      type: "time",
      placeholder: "02:00",
    },
    {
      label: "Closing Time",
      name: "closingTime",
      type: "time",
      placeholder: "02:00",
    },
  ];
  const preference = [
    {
      label: "Payment Method",
      name: "payment",
      type: "select",
      options: ["Cash", "Fonepay"],
      important: true,
      width: "w-1/2",
    },
  ];
  const bankDetails = [
    {
      label: "Bank Name",
      name: "bankName",
      type: "text",
      placeholder: "Nepal Rastriya Bank Ltd.",
      important: true,
    },
    {
      label: "Bank Account Number",
      name: "accountNumber",
      type: "text",
      important: true,
      placeholder: "0987654321123456",
    },
    {
      label: "Account Name",
      name: "accountName",
      type: "text",
      important: true,
      placeholder: "Barun Gems",
    },
  ];

  const handleFileChange = () => {
    console.log("file change");
  };

  const handleClick = (ref: any) => {
    if (ref.current) {
      ref.current.click();
    }
  };

  return (
    <div className="m-5 ">
      <h1 className="font-bold text-3xl my-3">Add Shop Profile</h1>
      <div className="flex gap-3">
        <div className="bg-white px-5 py-7 w-[70%] shadow-xl rounded-lg">
          <FormikProvider value={formik}>
            <Form className="flex flex-col">
              <FormSection
                inputs={general}
                heading="General Information"
                className="grid grid-cols-2"
              />
              <FormSection
                inputs={address}
                heading="Address"
                className="grid grid-cols-2"
              />
              <FormSection
                inputs={business}
                heading="Business Hours"
                className="grid grid-cols-3"
              />
              <FormSection inputs={preference} heading="Shop Preference" />
              <FormSection
                inputs={bankDetails}
                heading="Bank Details"
                className="grid grid-cols-2"
              />

              <button
                type="submit"
                className="bg-yellow text-white px-5 py-2 rounded-md w-[100px] uppercase font-medium self-end hover:text-black hover:opacity-70"
              >
                save
              </button>
            </Form>
          </FormikProvider>
        </div>
        <div></div>
        <div className="w-[30%] px-5 py-7 rounded-lg flex flex-col gap-10">
          <div className="flex flex-col bg-white shadow-xl p-5 rounded-lg text-slate-600">
            <label className="my-2 font-semibold">Update Profile Photo</label>
            <hr className="border-[0.5px] border-gray-400 mb-5" />
            <div className="flex flex-col items-center justify-center border-dashed h-[200px] rounded border-[1px] border-black p-5 text-center gap-3">
              <Icon icon="mynaui:cloud-upload" height={70} />
              <p className="text-xs">
                JPEG, PNG, JPG, and MP4 formats up to 50MB
              </p>
              <button
                className="bg-white border-[1px] border-r-gray-300 text-sm p-2 rounded-sm shadow-sm"
                onClick={() => handleClick(fileInputRef1)}
              >
                Browse File
              </button>
            </div>
            <input
              ref={fileInputRef1}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div className="flex flex-col bg-white shadow-xl p-5 rounded-lg text-slate-600">
            <label className="my-2 font-semibold">Update QR</label>
            <hr className="border-[0.5px] border-gray-400 mb-5" />
            <div className="flex flex-col items-center justify-center border-dashed h-[200px] rounded border-[1px] border-black p-5 text-center gap-3">
              <Icon icon="mynaui:cloud-upload" height={70} />
              <p className="text-xs">
                JPEG, PNG, JPG, and MP4 formats up to 50MB
              </p>
              <button
                className="bg-white border-[1px] border-r-gray-300 text-sm p-2 rounded-sm shadow-sm"
                onClick={() => handleClick(fileInputRef2)}
              >
                Browse File
              </button>
            </div>
            <input
              ref={fileInputRef2}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingForm;
