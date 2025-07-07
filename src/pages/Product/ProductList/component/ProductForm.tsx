// import { useEffect, useMemo, useState } from "react";
// import { useForm, useStore } from "@tanstack/react-form";
// import { InputField } from "../../../../components/shared/form_components/InputField";
// import { DropdownField } from "../../../../components/shared/form_components/Dropdown";
// import { FieldError } from "../../../auth/LoginPage";
// import * as z from "zod";
// import {
//   useCreateProductsMutation,
//   useGetAllProductCategoriesQuery,
//   useGetAllProductClaspsQuery,
//   useGetAllProductSubCategoriesQuery,
//   useUpdateProductsMutation,
// } from "../../../../server/api/productHooks";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import { PriceInputField } from "../../../OrderManagement/Order/components/PriceInputField";
// import ChipInputInside from "../../ProductCategory/components/ChipInputInside";
// import { useNavigate, useParams } from "react-router-dom";
// import Header from "../../../../components/shared/table_heading/Header";
// import { productStore } from "../../../../store/productStore";
// import {
//   generateProductDefaultValue,
//   IProductFormValues,
//   productFormSchema,
//   UploadedImage,
//   VisibilityType,
// } from "../../productObj";
// import MultiImageUploader from "../../../../components/shared/form_components/FileDropInput";

// const ProductForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const productData = useStore(productStore, (state) => state);
//   console.log("productData", productData);
//   const {
//     mutate: createProduct,
//     isPending: pendingAddition,
//     isSuccess: productCreateSuccess,
//   } = useCreateProductsMutation();
//   const {
//     mutate: updateProduct,
//     isPending: pendingUpdate,
//     isSuccess: productUpdateSuccess,
//   } = useUpdateProductsMutation();
//   const { data: categories, isSuccess: categorySuccess } =
//     useGetAllProductCategoriesQuery();
//   const { data: subCategories, isSuccess: subSuccess } =
//     useGetAllProductSubCategoriesQuery();
//   const { data: clasps, isSuccess: claspsSuccess } =
//     useGetAllProductClaspsQuery();

//   const categoriesList = useMemo(
//     () =>
//       categorySuccess
//         ? categories.map((item) => ({ label: item.name, value: item._id }))
//         : [],
//     [categorySuccess, categories]
//   );

//   const subCategoriesList = useMemo(
//     () =>
//       subSuccess
//         ? subCategories.map((item) => ({ label: item.name, value: item._id }))
//         : [],
//     [subSuccess, subCategories]
//   );

//   const claspsList = useMemo(
//     () =>
//       claspsSuccess
//         ? clasps.map((item) => ({ label: item.name, value: item._id }))
//         : [],
//     [claspsSuccess, clasps]
//   );

//   const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
//   const visibilityOptions = [
//     { value: "featured", label: "Featured" },
//     { value: "bestsellers", label: "Best Sellers" },
//     { value: "popular", label: "Popular" },
//     { value: "newarrivals", label: "New Arrivals" },
//     { value: "recommended", label: "Recommended for you" },
//   ];
//   const formstate = id ?? "add";
//   const form = useForm({
//     defaultValues: generateProductDefaultValue(
//       formstate,
//       productData
//     ) as IProductFormValues,
//     validators: {
//       onSubmit: productFormSchema, // Only validate on submit
//     },
//     onSubmit: async ({ value }) => {
//       const formData = new FormData();

//       formData.append("name", value.name);
//       formData.append("description", value.description);
//       formData.append("category", value.category);
//       // formData.append("subCategory", value.subCategory);
//       if (value.subCategory && value.subCategory.trim() !== "") {
//         formData.append("subCategory", value.subCategory);
//       }

//       value.variant.forEach((v, index: number) => {
//         formData.append(`variant[${index}][price]`, String(v.price));
//         formData.append(`variant[${index}][wt]`, v.wt.toString());
//         formData.append(`variant[${index}][unit]`, v.unit ?? "gm");
//       });

//       formData.append("length", String(value.length));
//       if (value.claspType) formData.append("claspType", value.claspType);
//       formData.append("rhodoumFinishes", String(value.rhodoumFinishes));
//       formData.append("shape", value.shape);
//       formData.append("clarity", value.clarity);
//       formData.append("dimension", String(value.dimension));
//       formData.append("visibleAs", value.visibleAs);

//       value.tags.forEach((tag: string, index: number) => {
//         formData.append(`tags[${index}]`, tag);
//       });

//       // uploadedImages.forEach((img) => {
//       //   formData.append(`images`, img.file);
//       // });
//       if (value.image) {
//         formData.append("image", value.image);
//       }

//       // Append existing images in edit mode
//       // if (id !== "add") {
//       //   value.existingImages?.forEach((img) => {
//       //     formData.append("existingImages", img);
//       //   });
//       // }
//       if (id === "add") createProduct(formData);
//       else {
//         productData.images.map((img) => formData.append(`existingImages`, img));
//         updateProduct({ id: productData._id, body: formData });
//       }
//     },
//   });

//   useEffect(() => {
//     if (productCreateSuccess || productUpdateSuccess) {
//       form.reset();
//       navigate("/product/product-list");
//     }
//   }, [productCreateSuccess, productUpdateSuccess]);

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const newImages = Array.from(e.target.files).map((file: File) => ({
//         name: file.name,
//         file: file,
//         url: URL.createObjectURL(file),
//       }));
//       setUploadedImages([...uploadedImages, ...newImages].slice(0, 4));
//     }
//   };
//   // console.log(form.state.values, "valuess");
//   return (
//     <div className="p-2">
//       <Header text={id === "add" ? "Add Product" : "Edit Product"} />

//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           e.stopPropagation();
//           form.handleSubmit();
//         }}
//         className="grid grid-cols-1 gap-4 lg:grid-cols-3"
//       >
//         {/* Left Column */}
//         <div className="col-span-2 bg-white border rounded-md">
//           <div className="col-span-2">
//             {/* General Information Section */}
//             <div className="p-4 rounded-lg">
//               <h2 className="py-2 mb-2 font-semibold text-gray-700 border-b">
//                 General Information
//               </h2>

//               <div className="space-y-4">
//                 <form.Field name="name">
//                   {(field) => (
//                     <div>
//                       <InputField
//                         label="Product Name"
//                         required
//                         placeholder="Enter product name"
//                         value={field.state.value}
//                         onChange={(e) => field.handleChange(e.target.value)}
//                       />
//                       <FieldError field={field} />
//                     </div>
//                   )}
//                 </form.Field>

//                 <form.Field name="description">
//                   {(field) => (
//                     <div>
//                       <div className="flex flex-col">
//                         <label className="mb-1 text-sm font-medium text-gray-700">
//                           Description <span className="text-red-500">*</span>
//                         </label>
//                         <textarea
//                           placeholder="Enter short description"
//                           className="p-2 border rounded-md focus:outline-none resize-none "
//                           value={field.state.value}
//                           onChange={(e) => field.handleChange(e.target.value)}
//                           rows={3}
//                         />
//                       </div>
//                       <FieldError field={field} />
//                     </div>
//                   )}
//                 </form.Field>

//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                   <form.Field name="category">
//                     {(field) => (
//                       <div>
//                         <DropdownField
//                           label="Product Category"
//                           required
//                           firstInput="Select Category"
//                           options={categoriesList}
//                           value={field.state.value}
//                           onChange={(e) => field.handleChange(e.target.value)}
//                         />
//                         <FieldError field={field} />
//                       </div>
//                     )}
//                   </form.Field>

//                   <form.Field name="subCategory">
//                     {(field) => (
//                       <div>
//                         <DropdownField
//                           label="Product Sub-Category"
//                           firstInput="Select Sub Category"
//                           options={subCategoriesList}
//                           value={field.state.value}
//                           onChange={(e) => field.handleChange(e.target.value)}
//                         />
//                         <FieldError field={field} />
//                       </div>
//                     )}
//                   </form.Field>
//                 </div>
//               </div>
//             </div>

//             {/* Pricing Section */}
//             <div className="p-4 rounded-lg">
//               <form.Field name="variant" mode="array">
//                 {(field) => (
//                   <div>
//                     <div className="flex items-center justify-between w-full py-2 mb-2 text-sm border-b">
//                       <h2 className="text-base font-semibold text-gray-700 ">
//                         Pricing
//                       </h2>
//                       <button
//                         onClick={() =>
//                           field.pushValue({ price: 0, wt: 0, unit: "gm" })
//                         }
//                         type="button"
//                         className="flex bg-[#DF8D28] rounded-md text-white items-center gap-2 px-3 py-2"
//                       >
//                         <Icon icon="ep:plus" width="18" height="18" />
//                         Product Size
//                       </button>
//                     </div>
//                     {field.state.value.map((_, i: number) => (
//                       <div
//                         key={i.toString()}
//                         className="border rounded-md p-3 mb-2"
//                       >
//                         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                           <form.Field name={`variant[${i}].price`}>
//                             {(subField) => (
//                               <div>
//                                 <PriceInputField
//                                   label="Base Price"
//                                   placeholder="Enter base price"
//                                   type="number"
//                                   required
//                                   value={subField.state.value}
//                                   onChange={(e) =>
//                                     subField.handleChange(
//                                       Number(e.target.value)
//                                     )
//                                   }
//                                 />
//                               </div>
//                             )}
//                           </form.Field>
//                           <form.Field name={`variant[${i}].wt`}>
//                             {(subField) => (
//                               <div>
//                                 {/* <InputField
//                                   label="Size"
//                                   required
//                                   step="0.1"
//                                   placeholder="Enter in gram"
//                                   value={subField.state.value}
//                                   onChange={(e) =>
//                                     subField.handleChange(
//                                       Number(e.target.value)
//                                     )
//                                   }
//                                 /> */}

//                                 <InputField
//                                   label="Size"
//                                   type="number" // Explicitly set type to "number"
//                                   required
//                                   step="any" // Allows two decimal places (e.g., 1.23)
//                                   min="0"
//                                   placeholder="Enter in gram"
//                                   value={subField.state.value}
//                                   onChange={(e) =>
//                                     subField.handleChange(
//                                       Number(e.target.value) || 0
//                                     )
//                                   } // Handle empty input
//                                 />
//                                 <FieldError field={subField} />
//                               </div>
//                             )}
//                           </form.Field>
//                         </div>
//                         {i > 0 && (
//                           <div className="flex justify-end mt-2">
//                             <button
//                               type="button"
//                               onClick={() => field.removeValue(i)}
//                               className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md "
//                             >
//                               <Icon
//                                 icon="mdi:delete"
//                                 className="text-red"
//                                 width="18"
//                                 height="18"
//                               />
//                               Remove
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </form.Field>
//             </div>

//             {/* Product Specification */}
//             <div className="p-4 rounded-lg">
//               <h2 className="py-2 mb-2 font-semibold text-gray-700 border-b">
//                 Product Specification
//               </h2>

//               <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//                 <form.Field name="length">
//                   {(field) => (
//                     <div>
//                       <InputField
//                         label="Length"
//                         required
//                         type="number"
//                         placeholder="0"
//                         value={String(field.state.value)}
//                         onChange={(e) =>
//                           field.handleChange(Number(e.target.value))
//                         }
//                       />
//                       <FieldError field={field} />
//                     </div>
//                   )}
//                 </form.Field>

//                 <form.Field name="claspType">
//                   {(field) => (
//                     <div>
//                       <DropdownField
//                         label="Clasp Type"
//                         required
//                         firstInput="Select clasp type"
//                         options={claspsList}
//                         value={field.state.value}
//                         onChange={(e) => field.handleChange(e.target.value)}
//                       />
//                       <FieldError field={field} />
//                     </div>
//                   )}
//                 </form.Field>

//                 <form.Field name="rhodoumFinishes">
//                   {(field) => (
//                     <div>
//                       <DropdownField
//                         label="Rhodoum Finishes"
//                         required
//                         firstInput="Select finish"
//                         options={[
//                           { value: "true", label: "Yes" },
//                           { value: "false", label: "No" },
//                         ]}
//                         value={String(field.state.value)}
//                         onChange={(e) =>
//                           field.handleChange(e.target.value === "true")
//                         }
//                       />
//                       <FieldError field={field} />
//                     </div>
//                   )}
//                 </form.Field>
//               </div>
//             </div>

//             {/* Material Information */}
//             <div className="p-4 rounded-lg">
//               <h2 className="py-2 mb-2 font-semibold text-gray-700 border-b">
//                 Material Information
//               </h2>

//               <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//                 <form.Field name="shape">
//                   {(field) => (
//                     <div>
//                       <InputField
//                         label="Shape"
//                         required
//                         placeholder="Enter shape"
//                         value={field.state.value}
//                         onChange={(e) => field.handleChange(e.target.value)}
//                       />
//                       <FieldError field={field} />
//                     </div>
//                   )}
//                 </form.Field>

//                 <form.Field name="clarity">
//                   {(field) => (
//                     <div>
//                       <InputField
//                         label="Clarity"
//                         required
//                         placeholder="Enter clarity"
//                         value={field.state.value}
//                         onChange={(e) => field.handleChange(e.target.value)}
//                       />
//                       <FieldError field={field} />
//                     </div>
//                   )}
//                 </form.Field>

//                 <form.Field name="dimension">
//                   {(field) => (
//                     <div>
//                       <InputField
//                         label="Dimension"
//                         required
//                         type="number"
//                         placeholder="0"
//                         value={String(field.state.value)}
//                         onChange={(e) =>
//                           field.handleChange(Number(e.target.value))
//                         }
//                       />
//                       <FieldError field={field} />
//                     </div>
//                   )}
//                 </form.Field>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Column */}
//         <div className="space-y-6 ">
//           {/* Visibility Options - Radio Buttons */}
//           <div className="p-4 bg-white border rounded-lg">
//             <h2 className="mb-4 font-medium text-gray-700">Visible as</h2>

//             <form.Field name="visibleAs">
//               {(field) => (
//                 <div className="space-y-2">
//                   {visibilityOptions.map((option) => (
//                     <div key={option.value} className="flex items-center">
//                       <input
//                         type="radio"
//                         id={`visibility-${option.value}`}
//                         value={option.value}
//                         checked={field.state.value === option.value}
//                         onChange={() =>
//                           field.handleChange(option.value as VisibilityType)
//                         }
//                         className="mr-2"
//                       />
//                       <label htmlFor={`visibility-${option.value}`}>
//                         {option.label}
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </form.Field>
//           </div>

//           {/* Product Tags */}
//           <div className="p-4 bg-white border rounded-lg">
//             <h2 className="mb-4 font-medium text-gray-700">Product Tags</h2>

//             <form.Field name="tags">
//               {(field) => (
//                 <div>
//                   <ChipInputInside field={field} />
//                 </div>
//               )}
//             </form.Field>
//           </div>
//           <div className="bg-[#ffffff] border-[#eeeeee] border-2 shadow-lg rounded-xl w-full">
//             <div className="mx-6 my-4">
//               <div>
//                 <h1 className="text-xl font-semibold">Upload Web Image</h1>
//                 <div className="border-b border-[#dedde2] w-full my-2"></div>
//               </div>

//               <form.Field name="image">
//                 {(field) => (
//                   <MultiImageUploader
//                     multiple={false}
//                     form={form}
//                     label=""
//                     value={field.state.value}
//                     existingFileField="existingImage"
//                     accept={{
//                       "image/*": [".png", ".jpg", ".jpeg", ".svg"],
//                     }}
//                     // existingFile={form.getFieldValue("existingImage")}
//                     existingFile={form.getFieldValue("existingImages")}
//                     onChange={(file) => field.handleChange(file)}
//                   />
//                 )}
//               </form.Field>
//             </div>
//           </div>

//           {/* Upload Photos */}
//           {/* <div className="p-4 bg-white border rounded-lg">
//             <h2 className="mb-4 font-medium text-gray-700">Upload Photos</h2>

//             <div className="p-8 mb-4 text-center border-2 border-dashed rounded-lg">
//               <div className="flex justify-center">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="w-12 h-12 text-gray-400"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                   />
//                 </svg>
//               </div>
//               <p className="mt-2 text-sm text-gray-500">
//                 JPEG, PNG, SVG or JPG
//               </p>
//               <p className="mt-1 text-xs text-gray-400">
//                 (Max file size 800 KB)
//               </p>

//               <input
//                 type="file"
//                 id="photo-upload"
//                 multiple
//                 accept="image/*"
//                 onChange={handleImageUpload}
//                 className="hidden"
//               />
//               <label
//                 htmlFor="photo-upload"
//                 className="inline-block px-4 py-2 mt-4 text-gray-700 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
//               >
//                 Browse File
//               </label>
//             </div> */}

//           {/* Preview of uploaded images */}
//           {/* {uploadedImages.length > 0 && (
//               <div className="grid grid-cols-4 gap-2">
//                 {uploadedImages.map((img, index) => (
//                   <div key={index} className="overflow-hidden border rounded">
//                     <img
//                       src={img.url}
//                       alt={`Preview ${index}`}
//                       className="object-cover w-full h-16"
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//           {formstate !== "add" && productData.images && (
//             <div className="p-4 bg-white border rounded-lg">
//               <h2 className="mb-4 font-medium text-gray-700">Product Images</h2>
//               <div className="grid grid-cols-4 gap-2">
//                 {productData.images.map((img, index) => (
//                   <img
//                     src={`${import.meta.env.VITE_API_IMAGE_BASE_URL}${img}`}
//                     alt="preview"
//                     className="object-contain w-full h-full"
//                   />
//                 ))}
//               </div>
//             </div>
//           )} */}

//           {/* Submit Button */}
//           <div className="text-right">
//             <button
//               type="submit"
//               disabled={pendingAddition || pendingUpdate}
//               className="px-6 py-2 text-white rounded-md min-w-32 bg-orange hover:bg-orange-600"
//             >
//               {pendingAddition || pendingUpdate ? (
//                 <Icon icon="nrk:spinner" width={18} height={18} />
//               ) : (
//                 "Save Product"
//               )}
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ProductForm;

// Second

"use client";

import type React from "react";

import { useEffect, useMemo, useState } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { InputField } from "../../../../components/shared/form_components/InputField";
import { DropdownField } from "../../../../components/shared/form_components/Dropdown";
import { FieldError } from "../../../auth/LoginPage";
import {
  useCreateProductsMutation,
  useGetAllProductCategoriesQuery,
  useGetAllProductClaspsQuery,
  useGetAllProductSubCategoriesQuery,
  useUpdateProductsMutation,
} from "../../../../server/api/productHooks";
import { Icon } from "@iconify/react/dist/iconify.js";
import { PriceInputField } from "../../../OrderManagement/Order/components/PriceInputField";
import ChipInputInside from "../../ProductCategory/components/ChipInputInside";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../../components/shared/table_heading/Header";
import { productStore } from "../../../../store/productStore";
import {
  generateProductDefaultValue,
  type IProductFormValues,
  productFormSchema,
  type UploadedImage,
  type VisibilityType,
} from "../../productObj";
import MultiImageUploader from "../../../../components/shared/form_components/FileDropInput";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const productData = useStore(productStore, (state) => state);
  console.log("productData", productData);

  const {
    mutate: createProduct,
    isPending: pendingAddition,
    isSuccess: productCreateSuccess,
  } = useCreateProductsMutation();

  const {
    mutate: updateProduct,
    isPending: pendingUpdate,
    isSuccess: productUpdateSuccess,
  } = useUpdateProductsMutation();

  const { data: categories, isSuccess: categorySuccess } =
    useGetAllProductCategoriesQuery();
  const { data: subCategories, isSuccess: subSuccess } =
    useGetAllProductSubCategoriesQuery();
  const { data: clasps, isSuccess: claspsSuccess } =
    useGetAllProductClaspsQuery();

  const categoriesList = useMemo(
    () =>
      categorySuccess
        ? categories.map((item) => ({ label: item.name, value: item._id }))
        : [],
    [categorySuccess, categories]
  );

  const subCategoriesList = useMemo(
    () =>
      subSuccess
        ? subCategories.map((item) => ({ label: item.name, value: item._id }))
        : [],
    [subSuccess, subCategories]
  );

  const claspsList = useMemo(
    () =>
      claspsSuccess
        ? clasps.map((item) => ({ label: item.name, value: item._id }))
        : [],
    [claspsSuccess, clasps]
  );

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const visibilityOptions = [
    { value: "featured", label: "Featured" },
    { value: "bestsellers", label: "Best Sellers" },
    { value: "popular", label: "Popular" },
    { value: "newarrivals", label: "New Arrivals" },
    { value: "recommended", label: "Recommended for you" },
  ];

  const formstate = id ?? "add";

  // Custom validation function
  const validateForm = (values: IProductFormValues) => {
    try {
      productFormSchema.parse(values);
      setFormErrors({});
      return true;
    } catch (error: any) {
      const errors: Record<string, string[]> = {};
      if (error.errors) {
        error.errors.forEach((err: any) => {
          const path = err.path.join(".");
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(err.message);
        });
      }
      setFormErrors(errors);
      console.log("Validation errors:", errors);
      return false;
    }
  };

  const form = useForm({
    defaultValues: generateProductDefaultValue(
      formstate,
      productData
    ) as IProductFormValues,
    onSubmit: async ({ value }) => {
      console.log("Form submitted with values:", value);

      // Validate form before submission
      if (!validateForm(value)) {
        console.log("Form validation failed");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("name", value.name);
        formData.append("description", value.description);
        formData.append("category", value.category);

        if (value.subCategory && value.subCategory.trim() !== "") {
          formData.append("subCategory", value.subCategory);
        }

        value.variant.forEach((v, index: number) => {
          formData.append(`variant[${index}][price]`, String(v.price));
          formData.append(`variant[${index}][wt]`, v.wt.toString());
          formData.append(`variant[${index}][unit]`, v.unit ?? "gm");
        });

        formData.append("length", String(value.length));
        if (value.claspType) formData.append("claspType", value.claspType);
        formData.append("rhodoumFinishes", String(value.rhodoumFinishes));
        formData.append("shape", value.shape);
        formData.append("clarity", value.clarity);
        formData.append("dimension", String(value.dimension));
        formData.append("visibleAs", value.visibleAs);

        value.tags.forEach((tag: string, index: number) => {
          formData.append(`tags[${index}]`, tag);
        });

        if (value.image) {
          formData.append("image", value.image);
        }

        if (id === "add") {
          createProduct(formData);
        } else {
          productData.images.map((img) =>
            formData.append(`existingImages`, img)
          );
          updateProduct({ id: productData._id, body: formData });
        }
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
  });

  useEffect(() => {
    if (productCreateSuccess || productUpdateSuccess) {
      form.reset();
      navigate("/product/product-list");
    }
  }, [productCreateSuccess, productUpdateSuccess]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file: File) => ({
        name: file.name,
        file: file,
        url: URL.createObjectURL(file),
      }));
      setUploadedImages([...uploadedImages, ...newImages].slice(0, 4));
    }
  };

  // Helper function to get field errors
  const getFieldError = (fieldPath: string) => {
    return formErrors[fieldPath] || [];
  };

  // Debug: Log form state
  console.log("Form state:", form.state);
  console.log("Form values:", form.state.values);
  console.log("Form errors:", formErrors);

  return (
    <div className="p-2">
      <Header text={id === "add" ? "Add Product" : "Edit Product"} />

      {/* Debug Panel - Remove in production */}
      {/* <div className="mb-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold">Debug Info:</h3>
        <p>Form Submitting: {form.state.isSubmitting ? "Yes" : "No"}</p>
        <p>Form Errors: {JSON.stringify(formErrors, null, 2)}</p>
      </div> */}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Form submit triggered");
          form.handleSubmit();
        }}
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        {/* Left Column */}
        <div className="col-span-2 bg-white border rounded-md">
          <div className="col-span-2">
            {/* General Information Section */}
            <div className="p-4 rounded-lg">
              <h2 className="py-2 mb-2 font-semibold text-gray-700 border-b">
                General Information
              </h2>
              <div className="space-y-4">
                <form.Field name="name">
                  {(field) => (
                    <div>
                      <InputField
                        label="Product Name"
                        required
                        placeholder="Enter product name"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                      {getFieldError("name").length > 0 && (
                        <div className="text-red-500 text-sm mt-1">
                          {getFieldError("name").join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="description">
                  {(field) => (
                    <div>
                      <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          placeholder="Enter short description"
                          className="p-2 border rounded-md focus:outline-none resize-none"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <FieldError field={field} />
                      {getFieldError("description").length > 0 && (
                        <div className="text-red-500 text-sm mt-1">
                          {getFieldError("description").join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </form.Field>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <form.Field name="category">
                    {(field) => (
                      <div>
                        <DropdownField
                          label="Product Category"
                          required
                          firstInput="Select Category"
                          options={categoriesList}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldError field={field} />
                        {getFieldError("category").length > 0 && (
                          <div className="text-red-500 text-sm mt-1">
                            {getFieldError("category").join(", ")}
                          </div>
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="subCategory">
                    {(field) => (
                      <div>
                        <DropdownField
                          label="Product Sub-Category"
                          firstInput="Select Sub Category"
                          options={subCategoriesList}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldError field={field} />
                        {getFieldError("subCategory").length > 0 && (
                          <div className="text-red-500 text-sm mt-1">
                            {getFieldError("subCategory").join(", ")}
                          </div>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-4 rounded-lg">
              <form.Field name="variant" mode="array">
                {(field) => (
                  <div>
                    <div className="flex items-center justify-between w-full py-2 mb-2 text-sm border-b">
                      <h2 className="text-base font-semibold text-gray-700">
                        Pricing
                      </h2>
                      <button
                        onClick={() =>
                          field.pushValue({ price: 0, wt: 0, unit: "gm" })
                        }
                        type="button"
                        className="flex bg-[#DF8D28] rounded-md text-white items-center gap-2 px-3 py-2"
                      >
                        <Icon icon="ep:plus" width="18" height="18" />
                        Product Size
                      </button>
                    </div>
                    {getFieldError("variant").length > 0 && (
                      <div className="text-red-500 text-sm mb-2">
                        {getFieldError("variant").join(", ")}
                      </div>
                    )}
                    {field.state.value.map((_, i: number) => (
                      <div
                        key={i.toString()}
                        className="border rounded-md p-3 mb-2"
                      >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <form.Field name={`variant[${i}].price`}>
                            {(subField) => (
                              <div>
                                <PriceInputField
                                  label="Base Price"
                                  placeholder="Enter base price"
                                  type="number"
                                  required
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(
                                      Number(e.target.value)
                                    )
                                  }
                                />
                                {getFieldError(`variant.${i}.price`).length >
                                  0 && (
                                  <div className="text-red-500 text-sm mt-1">
                                    {getFieldError(`variant.${i}.price`).join(
                                      ", "
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </form.Field>

                          <form.Field name={`variant[${i}].wt`}>
                            {(subField) => (
                              <div>
                                <InputField
                                  label="Size"
                                  type="number"
                                  required
                                  step="any"
                                  min="0"
                                  placeholder="Enter in gram"
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(
                                      Number(e.target.value) || 0
                                    )
                                  }
                                />
                                <FieldError field={subField} />
                                {getFieldError(`variant.${i}.wt`).length >
                                  0 && (
                                  <div className="text-red-500 text-sm mt-1">
                                    {getFieldError(`variant.${i}.wt`).join(
                                      ", "
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </form.Field>
                        </div>
                        {i > 0 && (
                          <div className="flex justify-end mt-2">
                            <button
                              type="button"
                              onClick={() => field.removeValue(i)}
                              className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md"
                            >
                              <Icon
                                icon="mdi:delete"
                                className="text-red"
                                width="18"
                                height="18"
                              />
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </form.Field>
            </div>

            {/* Product Specification */}
            <div className="p-4 rounded-lg">
              <h2 className="py-2 mb-2 font-semibold text-gray-700 border-b">
                Product Specification
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <form.Field name="length">
                  {(field) => (
                    <div>
                      <InputField
                        label="Length"
                        required
                        type="number"
                        placeholder="0"
                        value={String(field.state.value)}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                      />
                      <FieldError field={field} />
                      {getFieldError("length").length > 0 && (
                        <div className="text-red-500 text-sm mt-1">
                          {getFieldError("length").join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="claspType">
                  {(field) => (
                    <div>
                      <DropdownField
                        label="Clasp Type"
                        firstInput="Select clasp type"
                        options={claspsList}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                      {getFieldError("claspType").length > 0 && (
                        <div className="text-red-500 text-sm mt-1">
                          {getFieldError("claspType").join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="rhodoumFinishes">
                  {(field) => (
                    <div>
                      <DropdownField
                        label="Rhodoum Finishes"
                        required
                        firstInput="Select finish"
                        options={[
                          { value: "true", label: "Yes" },
                          { value: "false", label: "No" },
                        ]}
                        value={String(field.state.value)}
                        onChange={(e) =>
                          field.handleChange(e.target.value === "true")
                        }
                      />
                      <FieldError field={field} />
                      {getFieldError("rhodoumFinishes").length > 0 && (
                        <div className="text-red-500 text-sm mt-1">
                          {getFieldError("rhodoumFinishes").join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>
            </div>

            {/* Material Information */}
            <div className="p-4 rounded-lg">
              <h2 className="py-2 mb-2 font-semibold text-gray-700 border-b">
                Material Information
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <form.Field name="shape">
                  {(field) => (
                    <div>
                      <InputField
                        label="Shape"
                        required
                        placeholder="Enter shape"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                      {getFieldError("shape").length > 0 && (
                        <div className="text-red-500 text-sm mt-1">
                          {getFieldError("shape").join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="clarity">
                  {(field) => (
                    <div>
                      <InputField
                        label="Clarity"
                        required
                        placeholder="Enter clarity"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                      {getFieldError("clarity").length > 0 && (
                        <div className="text-red-500 text-sm mt-1">
                          {getFieldError("clarity").join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="dimension">
                  {(field) => (
                    <div>
                      <InputField
                        label="Dimension"
                        required
                        type="number"
                        placeholder="0"
                        value={String(field.state.value)}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                      />
                      <FieldError field={field} />
                      {getFieldError("dimension").length > 0 && (
                        <div className="text-red-500 text-sm mt-1">
                          {getFieldError("dimension").join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Visibility Options - Radio Buttons */}
          <div className="p-4 bg-white border rounded-lg">
            <h2 className="mb-4 font-medium text-gray-700">Visible as</h2>
            <form.Field name="visibleAs">
              {(field) => (
                <div className="space-y-2">
                  {visibilityOptions.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        id={`visibility-${option.value}`}
                        value={option.value}
                        checked={field.state.value === option.value}
                        onChange={() =>
                          field.handleChange(option.value as VisibilityType)
                        }
                        className="mr-2"
                      />
                      <label htmlFor={`visibility-${option.value}`}>
                        {option.label}
                      </label>
                    </div>
                  ))}
                  {getFieldError("visibleAs").length > 0 && (
                    <div className="text-red-500 text-sm mt-1">
                      {getFieldError("visibleAs").join(", ")}
                    </div>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          {/* Product Tags */}
          <div className="p-4 bg-white border rounded-lg">
            <h2 className="mb-4 font-medium text-gray-700">Product Tags</h2>
            <form.Field name="tags">
              {(field) => (
                <div>
                  <ChipInputInside field={field} />
                  {getFieldError("tags").length > 0 && (
                    <div className="text-red-500 text-sm mt-1">
                      {getFieldError("tags").join(", ")}
                    </div>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <div className="bg-[#ffffff] border-[#eeeeee] border-2 shadow-lg rounded-xl w-full">
            <div className="mx-6 my-4">
              <div>
                <h1 className="text-xl font-semibold">Upload Web Image</h1>
                <div className="border-b border-[#dedde2] w-full my-2"></div>
              </div>
              <form.Field name="image">
                {(field) => (
                  <div>
                    <MultiImageUploader
                      multiple={false}
                      form={form}
                      label=""
                      value={field.state.value}
                      existingFileField="existingImage"
                      accept={{
                        "image/*": [".png", ".jpg", ".jpeg", ".svg"],
                      }}
                      existingFile={form.getFieldValue("existingImages")}
                      onChange={(file) => field.handleChange(file)}
                    />
                    {getFieldError("image").length > 0 && (
                      <div className="text-red-500 text-sm mt-1">
                        {getFieldError("image").join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              disabled={pendingAddition || pendingUpdate}
              className="px-6 py-2 text-white rounded-md min-w-32 bg-orange hover:bg-orange-600 disabled:opacity-50"
            >
              {pendingAddition || pendingUpdate ? (
                <Icon icon="nrk:spinner" width={18} height={18} />
              ) : (
                "Save Product"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
