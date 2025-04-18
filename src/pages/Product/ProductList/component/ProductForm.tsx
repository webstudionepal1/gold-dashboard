// import { useState } from "react";
// import { useForm } from "@tanstack/react-form";
// import { z } from "zod";
// import { InputField } from "../../../../components/shared/form_components/InputField";
// import { DropdownField } from "../../../../components/shared/form_components/Dropdown";

// const ProductSchema = z.object({
//   // General Information
//   productName: z.string().min(1, "Product name is required"),
//   description: z.string().min(1, "Description is required"),
//   productCategory: z.string().min(1, "Product category is required"),
//   productSubCategory: z.string().min(1, "Product sub-category is required"),
//   manufacturerType: z.string().min(1, "Manufacturer type is required"),

//   // Pricing
//   basePrice: z.string().min(1, "Base price is required"),

//   // Product Specification
//   length: z.string().min(1, "Length is required"),
//   colorType: z.string().min(1, "Color type is required"),
//   sizeWithPackagingType: z.string().min(1, "Size with packaging is required"),
//   shoeboxFinish: z.string().min(1, "Shoebox finish is required"),

//   // Material Information
//   shape: z.string().min(1, "Shape is required"),
//   quantity: z.string().min(1, "Quantity is required"),
//   hssnCode: z.string().min(1, "HSSN code is required"),
//   thread: z.string().min(1, "Thread is required"),
//   clarity: z.string().min(1, "Clarity is required"),
//   dimension: z.string().min(1, "Dimension is required"),
//   color: z.string().min(1, "Color is required"),

//   // Visibility Options
//   visibility: z.array(z.string()).optional(),

//   // Tags
//   tags: z.array(z.string()).optional(),
// });

// const FieldError = ({ field }) => {
//   if (field.state.meta.errors && field.state.meta.errors.length > 0) {
//     const error = field.state.meta.errors[0];
//     const errorMessage =
//       typeof error === "string"
//         ? error
//         : error.message || JSON.stringify(error);

//     return (
//       <div className="min-h-[16px]">
//         <span className="text-xs text-red-500">{errorMessage}</span>
//       </div>
//     );
//   }
//   return <div className="min-h-[16px]"></div>;
// };

// const ProductForm = () => {
//   const [activeTab, setActiveTab] = useState("new");
//   const [uploadedImages, setUploadedImages] = useState([]);
//   const [selectedTags, setSelectedTags] = useState(["Featured"]);

//   const form = useForm({
//     defaultValues: {
//       // General Information
//       productName: "",
//       description: "",
//       productCategory: "",
//       productSubCategory: "",
//       manufacturerType: "self-manufactured",

//       // Pricing
//       basePrice: "",

//       // Product Specification
//       length: "",
//       colorType: "",
//       sizeWithPackagingType: "",
//       shoeboxFinish: "Yes",

//       // Material Information
//       shape: "",
//       quantity: "",
//       hssnCode: "",
//       thread: "",
//       clarity: "",
//       dimension: "",
//       color: "",

//       // Visibility Options
//       visibility: ["featured"],

//       // Tags
//       tags: ["Featured"],
//     },
//     validators: {
//       onSubmit: ProductSchema,
//     },
//     onSubmit: async ({ value }) => {
//       console.log("Product Submitted:", value);
//       // Submit to backend or API
//     },
//   });

//   const handleImageUpload = (e) => {
//     if (e.target.files) {
//       const newImages = Array.from(e.target.files).map((file) => ({
//         name: file.name,
//         url: URL.createObjectURL(file),
//       }));
//       setUploadedImages([...uploadedImages, ...newImages].slice(0, 4)); // Limit to 4 images
//     }
//   };

//   const toggleTag = (tag) => {
//     if (selectedTags.includes(tag)) {
//       setSelectedTags(selectedTags.filter((t) => t !== tag));
//     } else {
//       setSelectedTags([...selectedTags, tag]);
//     }
//   };

//   return (
//     <div className="max-w-6xl p-6 mx-auto bg-white">
//       {/* Tab Navigation */}
//       <div className="flex mb-6 border-b">
//         <button
//           className={`px-4 py-2 ${
//             activeTab === "new"
//               ? "border-b-2 border-orange-500 text-orange-500"
//               : "text-gray-500"
//           }`}
//           onClick={() => setActiveTab("new")}
//         >
//           New Product
//         </button>
//         <button
//           className={`px-4 py-2 ${
//             activeTab === "existing"
//               ? "border-b-2 border-orange-500 text-orange-500"
//               : "text-gray-500"
//           }`}
//           onClick={() => setActiveTab("existing")}
//         >
//           Existing Product
//         </button>
//       </div>

//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           e.stopPropagation();
//           form.handleSubmit();
//         }}
//         className="grid grid-cols-1 gap-6 lg:grid-cols-3"
//       >
//         {/* Left Column - Main Form */}
//         <div className="col-span-2 space-y-6">
//           {/* General Information Section */}
//           <div className="p-4 border rounded-lg">
//             <h2 className="mb-4 font-medium text-gray-700">
//               General Information
//             </h2>

//             <div className="space-y-4">
//               <form.Field name="productName">
//                 {(field) => (
//                   <div>
//                     <InputField
//                       label="Product Name"
//                       required
//                       placeholder="Select"
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                     />
//                     <FieldError field={field} />
//                   </div>
//                 )}
//               </form.Field>

//               <form.Field name="description">
//                 {(field) => (
//                   <div>
//                     <div className="flex flex-col">
//                       <label className="mb-1 text-sm font-medium text-gray-700">
//                         Description <span className="text-red-500">*</span>
//                       </label>
//                       <textarea
//                         placeholder="Enter short description"
//                         className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
//                         value={field.state.value}
//                         onChange={(e) => field.handleChange(e.target.value)}
//                         rows={3}
//                       />
//                     </div>
//                     <FieldError field={field} />
//                   </div>
//                 )}
//               </form.Field>

//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                 <form.Field name="productCategory">
//                   {(field) => (
//                     <div>
//                       <DropdownField
//                         label="Product Category"
//                         required
//                         firstInput="Select Category"
//                         options={[
//                           { value: "jewelry", label: "Jewelry" },
//                           { value: "watches", label: "Watches" },
//                           { value: "accessories", label: "Accessories" },
//                         ]}
//                         value={field.state.value}
//                         onChange={(e) => field.handleChange(e.target.value)}
//                       />
//                       <FieldError field={field} />
//                     </div>
//                   )}
//                 </form.Field>

//                 <form.Field name="productSubCategory">
//                   {(field) => (
//                     <div>
//                       <DropdownField
//                         label="Product Sub-Category"
//                         required
//                         firstInput="Select Sub Category"
//                         options={[
//                           { value: "rings", label: "Rings" },
//                           { value: "necklaces", label: "Necklaces" },
//                           { value: "bracelets", label: "Bracelets" },
//                         ]}
//                         value={field.state.value}
//                         onChange={(e) => field.handleChange(e.target.value)}
//                       />
//                       <FieldError field={field} />
//                     </div>
//                   )}
//                 </form.Field>
//               </div>

//               <form.Field name="manufacturerType">
//                 {(field) => (
//                   <div>
//                     <label className="mb-1 text-sm font-medium text-gray-700">
//                       Manufacturer
//                     </label>
//                     <div className="flex flex-col gap-2">
//                       <div className="flex items-center">
//                         <input
//                           type="radio"
//                           id="self-manufactured"
//                           name="manufacturerType"
//                           value="self-manufactured"
//                           checked={field.state.value === "self-manufactured"}
//                           onChange={() =>
//                             field.handleChange("self-manufactured")
//                           }
//                           className="mr-2"
//                         />
//                         <label htmlFor="self-manufactured">
//                           Self Manufactured goods
//                         </label>
//                       </div>
//                       <div className="flex items-center">
//                         <input
//                           type="radio"
//                           id="third-party"
//                           name="manufacturerType"
//                           value="third-party"
//                           checked={field.state.value === "third-party"}
//                           onChange={() => field.handleChange("third-party")}
//                           className="mr-2"
//                         />
//                         <label htmlFor="third-party">Third-party goods</label>
//                       </div>
//                     </div>
//                     <FieldError field={field} />
//                   </div>
//                 )}
//               </form.Field>
//             </div>
//           </div>

//           {/* Pricing Section */}
//           <div className="p-4 border rounded-lg">
//             <h2 className="mb-4 font-medium text-gray-700">Pricing</h2>

//             <form.Field name="basePrice">
//               {(field) => (
//                 <div>
//                   <div className="flex items-end gap-2">
//                     <div className="w-1/6">
//                       <label className="mb-1 text-sm font-medium text-gray-700">
//                         Base Price <span className="text-red-500">*</span>
//                       </label>
//                       <div className="p-2 text-center bg-gray-100 border rounded-md">
//                         Rs.
//                       </div>
//                     </div>
//                     <div className="flex-1">
//                       <InputField
//                         placeholder="Enter Base Price"
//                         value={field.state.value}
//                         onChange={(e) => field.handleChange(e.target.value)}
//                       />
//                     </div>
//                   </div>
//                   <FieldError field={field} />
//                 </div>
//               )}
//             </form.Field>
//           </div>

//           {/* Product Specification */}
//           <div className="p-4 border rounded-lg">
//             <h2 className="mb-4 font-medium text-gray-700">
//               Product Specification
//             </h2>

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//               <form.Field name="length">
//                 {(field) => (
//                   <div>
//                     <InputField
//                       label="Length"
//                       required
//                       placeholder="1000"
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                     />
//                     <FieldError field={field} />
//                   </div>
//                 )}
//               </form.Field>

//               <form.Field name="colorType">
//                 {(field) => (
//                   <div>
//                     <DropdownField
//                       label="Color Type"
//                       required
//                       firstInput="Size with packaging"
//                       options={[
//                         { value: "gold", label: "Gold" },
//                         { value: "silver", label: "Silver" },
//                         { value: "rose-gold", label: "Rose Gold" },
//                       ]}
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                     />
//                     <FieldError field={field} />
//                   </div>
//                 )}
//               </form.Field>

//               <form.Field name="sizeWithPackagingType">
//                 {(field) => (
//                   <div>
//                     <DropdownField
//                       label="Size with packaging"
//                       required
//                       firstInput="Size with packaging"
//                       options={[
//                         { value: "small", label: "Small" },
//                         { value: "medium", label: "Medium" },
//                         { value: "large", label: "Large" },
//                       ]}
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                     />
//                     <FieldError field={field} />
//                   </div>
//                 )}
//               </form.Field>
//             </div>

//             <div className="mt-4">
//               <form.Field name="shoeboxFinish">
//                 {(field) => (
//                   <div>
//                     <DropdownField
//                       label="Shoebox Finish"
//                       required
//                       options={[
//                         { value: "Yes", label: "Yes" },
//                         { value: "No", label: "No" },
//                       ]}
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                     />
//                     <FieldError field={field} />
//                   </div>
//                 )}
//               </form.Field>
//             </div>
//           </div>

//           {/* Material Information */}
//           <div className="p-4 border rounded-lg">
//             <h2 className="mb-4 font-medium text-gray-700">
//               Material Information
//             </h2>

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//               <form.Field name="shape">
//                 {(field) => (
//                   <div>
//                     <InputField
//                       label="Shape"
//                       required
//                       placeholder=""
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                     />
//                     <FieldError field={field} />
//                   </div>
//                 )}
//               </form.Field>

//               <form.Field name="quantity">
//                 {(field) => (
//                   <div>
//                     <InputField
//                       label="Quantity"
//                       required
//                       placeholder="25"
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                     />
//                     <FieldError field={field} />
//                   </div>
//                 )}
//               </form.Field>

//               <form.Field name="hssnCode">
//                 {(field) => (
//                   <div>
//                     <InputField
//                       label="HSSN Code"
//                       required
//                       placeholder="52.2"
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                     />
//                     <FieldError field={field} />
//                   </div>
//                 )}
//               </form.Field>

//               <form.Field name="thread">
//                 {(field) => (
//                   <div>
//                     <InputField
//                       label="Thread"
//                       required
//                       placeholder=""
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                     />
//                     <FieldError field={field} />
//                   </div>
//                 )}
//               </form.Field>

//               <form.Field name="clarity">
//                 {(field) => (
//                   <div>
//                     <InputField
//                       label="Clarity"
//                       required
//                       placeholder=""
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                     />
//                     <FieldError field={field} />
//                   </div>
//                 )}
//               </form.Field>

//               <form.Field name="dimension">
//                 {(field) => (
//                   <div>
//                     <InputField
//                       label="Dimension"
//                       required
//                       placeholder=""
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                     />
//                     <FieldError field={field} />
//                   </div>
//                 )}
//               </form.Field>

//               <form.Field name="color">
//                 {(field) => (
//                   <div>
//                     <InputField
//                       label="Color"
//                       required
//                       placeholder=""
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                     />
//                     <FieldError field={field} />
//                   </div>
//                 )}
//               </form.Field>
//             </div>
//           </div>
//         </div>

//         {/* Right Column - Sidebar */}
//         <div className="space-y-6">
//           {/* Visibility Options */}
//           <div className="p-4 border rounded-lg">
//             <h2 className="mb-4 font-medium text-gray-700">Visible as</h2>

//             <form.Field name="visibility">
//               {(field) => (
//                 <div className="space-y-2">
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       id="visibility-featured"
//                       value="featured"
//                       checked={field.state.value?.includes("featured")}
//                       onChange={(e) => {
//                         const newVisibility = e.target.checked
//                           ? [...(field.state.value || []), "featured"]
//                           : (field.state.value || []).filter(
//                               (v) => v !== "featured"
//                             );
//                         field.handleChange(newVisibility);
//                       }}
//                       className="mr-2"
//                     />
//                     <label htmlFor="visibility-featured">Featured</label>
//                   </div>

//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       id="visibility-bestsellers"
//                       value="bestsellers"
//                       checked={field.state.value?.includes("bestsellers")}
//                       onChange={(e) => {
//                         const newVisibility = e.target.checked
//                           ? [...(field.state.value || []), "bestsellers"]
//                           : (field.state.value || []).filter(
//                               (v) => v !== "bestsellers"
//                             );
//                         field.handleChange(newVisibility);
//                       }}
//                       className="mr-2"
//                     />
//                     <label htmlFor="visibility-bestsellers">Best Sellers</label>
//                   </div>

//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       id="visibility-newarrivals"
//                       value="newarrivals"
//                       checked={field.state.value?.includes("newarrivals")}
//                       onChange={(e) => {
//                         const newVisibility = e.target.checked
//                           ? [...(field.state.value || []), "newarrivals"]
//                           : (field.state.value || []).filter(
//                               (v) => v !== "newarrivals"
//                             );
//                         field.handleChange(newVisibility);
//                       }}
//                       className="mr-2"
//                     />
//                     <label htmlFor="visibility-newarrivals">New Arrivals</label>
//                   </div>

//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       id="visibility-recommended"
//                       value="recommended"
//                       checked={field.state.value?.includes("recommended")}
//                       onChange={(e) => {
//                         const newVisibility = e.target.checked
//                           ? [...(field.state.value || []), "recommended"]
//                           : (field.state.value || []).filter(
//                               (v) => v !== "recommended"
//                             );
//                         field.handleChange(newVisibility);
//                       }}
//                       className="mr-2"
//                     />
//                     <label htmlFor="visibility-recommended">
//                       Recommended for you
//                     </label>
//                   </div>
//                 </div>
//               )}
//             </form.Field>
//           </div>

//           {/* Product Tags */}
//           <div className="p-4 border rounded-lg">
//             <h2 className="mb-4 font-medium text-gray-700">Product Tags</h2>

//             <form.Field name="tags">
//               {(field) => (
//                 <div>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedTags.map((tag) => (
//                       <span
//                         key={tag}
//                         className="px-3 py-1 text-sm text-orange-500 bg-orange-100 rounded-full"
//                       >
//                         {tag}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </form.Field>
//           </div>

//           {/* Upload Photos */}
//           <div className="p-4 border rounded-lg">
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
//             </div>

//             {/* Preview of uploaded images */}
//             {uploadedImages.length > 0 && (
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

//           {/* Submit Button */}
//           <div className="text-right">
//             <button
//               type="submit"
//               className="px-6 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600"
//             >
//               Save Product
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ProductForm;

import React from 'react'

const ProductForm = () => {
  return (
    <div>ProductForm</div>
  )
}

export default ProductForm