// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import "./BlogEditor.css";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import { toast } from "react-toastify";
// import Cookies from "js-cookie";

// import { Text } from "../../../components/shared/Text";
// import { Button } from "../../../components/ui/button";
// import Header from "../../../components/shared/table_heading/Header";
// import FileDropInput from "../../../components/shared/form_components/FileDropInput";
// import VideoUploadField from "../../../components/shared/form_components/VideoUploadField";

// import {
//   useCreateBlogMutation,
//   useUpdateBlogMutation,
//   useGetBlogByIdQuery,
// } from "../../../server/api/blogHooks";
// import { IBlogFormData } from "../../../types/blog.types";
// import { FrontendRoutes } from "../../../routes/routes";

// // Validation schema
// const blogValidationSchema = Yup.object({
//   title: Yup.string()
//     .required("Title is required")
//     .max(200, "Title must be less than 200 characters"),
//   slug: Yup.string()
//     .required("Slug is required")
//     .matches(
//       /^[a-z0-9-]+$/,
//       "Slug can only contain lowercase letters, numbers, and hyphens"
//     ),
//   content: Yup.string().required("Content is required"),
//   excerpt: Yup.string().max(500, "Excerpt must be less than 500 characters"),
//   tags: Yup.array().of(Yup.string()),
//   categories: Yup.array().of(Yup.string()),
//   status: Yup.string().oneOf(["draft", "published", "archived"]).required(),
//   metadata: Yup.object({
//     seoTitle: Yup.string().max(60, "SEO title must be less than 60 characters"),
//     seoDescription: Yup.string().max(
//       160,
//       "SEO description must be less than 160 characters"
//     ),
//     keywords: Yup.array().of(Yup.string()),
//     canonicalUrl: Yup.string().url("Must be a valid URL"),
//   }),
// });

// const BlogEditor: React.FC = () => {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const isEditing = Boolean(id);

//   // State
//   const [tagInput, setTagInput] = useState("");
//   const [categoryInput, setCategoryInput] = useState("");
//   const [keywordInput, setKeywordInput] = useState("");

//   // API hooks
//   const { data: existingBlog, isLoading: isLoadingBlog } = useGetBlogByIdQuery(
//     id!
//   );
//   const { mutate: createBlog, isPending: isCreating } = useCreateBlogMutation();
//   const { mutate: updateBlog, isPending: isUpdating } = useUpdateBlogMutation();

//   // Initial values
//   const initialValues: IBlogFormData = {
//     title: "",
//     slug: "",
//     content: "",
//     excerpt: "",
//     tags: [],
//     categories: [],
//     featuredImage: null,
//     images: [],
//     video: null,
//     status: "draft",
//     isFeatured: false,
//     metadata: {
//       seoTitle: "",
//       seoDescription: "",
//       keywords: [],
//       canonicalUrl: "",
//     },
//   };

//   // Formik setup
//   const formik = useFormik({
//     initialValues,
//     // Temporarily disable validation to test submission
//     // validationSchema: blogValidationSchema,
//     enableReinitialize: true,
//     onSubmit: async (values) => {
//       console.log("🚀🚀🚀 FORM SUBMISSION TRIGGERED! 🚀🚀🚀");
//       console.log("📝 Form values:", values);
//       console.log("🔍 Formik errors:", formik.errors);
//       console.log("🔍 Formik touched:", formik.touched);

//       try {
//         // Validate required fields
//         if (!values.title.trim()) {
//           toast.error("Title is required");
//           return;
//         }
//         if (!values.content.trim()) {
//           toast.error("Content is required");
//           return;
//         }
//         if (!values.slug.trim()) {
//           toast.error("Slug is required");
//           return;
//         }

//         // Create FormData for file uploads
//         const formData = new FormData();

//         console.log("📦 Building FormData...");

//         // Add text fields
//         formData.append("title", values.title.trim());
//         formData.append("slug", values.slug.trim());
//         formData.append("content", values.content.trim());
//         formData.append("excerpt", values.excerpt.trim());
//         formData.append("status", values.status);
//         formData.append("isFeatured", values.isFeatured.toString());

//         // Add arrays as JSON strings (backend will parse them)
//         formData.append("tags", JSON.stringify(values.tags));
//         formData.append("categories", JSON.stringify(values.categories));

//         // Add metadata as JSON string
//         formData.append("metadata", JSON.stringify(values.metadata));

//         console.log("✅ Text fields added to FormData");

//         // Add files
//         if (values.featuredImage) {
//           formData.append("featuredImage", values.featuredImage);
//           console.log("✅ Featured image added");
//         }
//         if (values.video) {
//           formData.append("video", values.video);
//           console.log("✅ Video added");
//         }
//         if (values.images.length > 0) {
//           values.images.forEach((image, index) => {
//             formData.append("images", image);
//             console.log(`✅ Image ${index + 1} added`);
//           });
//         }

//         console.log("📤 FormData ready for submission");

//         // Log FormData contents for debugging
//         console.log("📋 FormData contents:");
//         for (let [key, value] of formData.entries()) {
//           if (value instanceof File) {
//             console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
//           } else {
//             console.log(`  ${key}: ${value}`);
//           }
//         }

//         if (isEditing && id) {
//           console.log("🔄 Updating existing blog...");
//           updateBlog(
//             { id, formData },
//             {
//               onSuccess: () => {
//                 console.log("✅ Blog updated successfully");
//                 toast.success("Blog updated successfully!");
//                 navigate(FrontendRoutes.BLOGLIST);
//               },
//               onError: (error) => {
//                 console.error("❌ Update error:", error);
//               },
//             }
//           );
//         } else {
//           console.log("🆕 Creating new blog...");
//           createBlog(formData, {
//             onSuccess: (data) => {
//               console.log("✅ Blog created successfully:", data);
//               toast.success("Blog created successfully!");
//               navigate(FrontendRoutes.BLOGLIST);
//             },
//             onError: (error) => {
//               console.error("❌ Blog creation error:", error);
//             },
//           });
//         }
//       } catch (error) {
//         console.error("Form submission error:", error);
//         toast.error("An error occurred while saving the blog");
//       }
//     },
//   });

//   // Load existing blog data for editing
//   useEffect(() => {
//     if (existingBlog && isEditing) {
//       formik.setValues({
//         title: existingBlog.title || "",
//         slug: existingBlog.slug || "",
//         content: existingBlog.content || "",
//         excerpt: existingBlog.excerpt || "",
//         tags: existingBlog.tags || [],
//         categories: existingBlog.categories || [],
//         featuredImage: null, // Files need to be re-uploaded
//         images: [], // Files need to be re-uploaded
//         video: null, // Files need to be re-uploaded
//         status: existingBlog.status || "draft",
//         isFeatured: existingBlog.isFeatured || false,
//         metadata: {
//           seoTitle: existingBlog.metadata?.seoTitle || "",
//           seoDescription: existingBlog.metadata?.seoDescription || "",
//           keywords: existingBlog.metadata?.keywords || [],
//           canonicalUrl: existingBlog.metadata?.canonicalUrl || "",
//         },
//       });
//     }
//   }, [existingBlog, isEditing]);

//   // Handle title change (no auto-generation)
//   const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const title = e.target.value;
//     formik.setFieldValue("title", title);
//   };

//   // ReactQuill modules and formats
//   const quillModules = useMemo(
//     () => ({
//       toolbar: [
//         [{ header: [1, 2, 3, 4, 5, 6, false] }],
//         ["bold", "italic", "underline", "strike"],
//         [{ color: [] }, { background: [] }],
//         [{ list: "ordered" }, { list: "bullet" }],
//         [{ indent: "-1" }, { indent: "+1" }],
//         [{ align: [] }],
//         ["link", "image", "video"],
//         ["blockquote", "code-block"],
//         ["clean"],
//       ],
//     }),
//     []
//   );

//   const quillFormats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "color",
//     "background",
//     "list",
//     "bullet",
//     "indent",
//     "align",
//     "link",
//     "image",
//     "video",
//     "blockquote",
//     "code-block",
//   ];

//   // Helper functions
//   const addTag = () => {
//     if (tagInput.trim() && !formik.values.tags.includes(tagInput.trim())) {
//       formik.setFieldValue("tags", [...formik.values.tags, tagInput.trim()]);
//       setTagInput("");
//     }
//   };

//   const removeTag = (tagToRemove: string) => {
//     formik.setFieldValue(
//       "tags",
//       formik.values.tags.filter((tag) => tag !== tagToRemove)
//     );
//   };

//   const addCategory = () => {
//     if (
//       categoryInput.trim() &&
//       !formik.values.categories.includes(categoryInput.trim())
//     ) {
//       formik.setFieldValue("categories", [
//         ...formik.values.categories,
//         categoryInput.trim(),
//       ]);
//       setCategoryInput("");
//     }
//   };

//   const removeCategory = (categoryToRemove: string) => {
//     formik.setFieldValue(
//       "categories",
//       formik.values.categories.filter((cat) => cat !== categoryToRemove)
//     );
//   };

//   const addKeyword = () => {
//     if (
//       keywordInput.trim() &&
//       !formik.values.metadata.keywords.includes(keywordInput.trim())
//     ) {
//       formik.setFieldValue("metadata.keywords", [
//         ...formik.values.metadata.keywords,
//         keywordInput.trim(),
//       ]);
//       setKeywordInput("");
//     }
//   };

//   const removeKeyword = (keywordToRemove: string) => {
//     formik.setFieldValue(
//       "metadata.keywords",
//       formik.values.metadata.keywords.filter((kw) => kw !== keywordToRemove)
//     );
//   };

//   // Handle slug change and update canonical URL
//   const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
//     formik.setFieldValue("slug", slug);
//     if (slug) {
//       formik.setFieldValue(
//         "metadata.canonicalUrl",
//         `${window.location.origin}/blog/${slug}`
//       );
//     }
//   };

//   if (isLoadingBlog && isEditing) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Icon icon="svg-spinners:ring-resize" width="32" height="32" />
//       </div>
//     );
//   }

//   return (
//     <div className=" bg-gray-50">
//       <Header text={isEditing ? "Edit Blog" : "Create New Blog"}>
//         <div className="flex gap-3">
//           <Button
//             variant="outline"
//             onClick={() => navigate(FrontendRoutes.BLOGLIST)}
//             className="border-gray-300 hover:border-gray-400"
//           >
//             <Icon icon="material-symbols:arrow-back" className="w-4 h-4 mr-2" />
//             Cancel
//           </Button>
//           <Button
//             onClick={(e) => {
//               e.preventDefault();
//               console.log("🔘 BUTTON CLICKED!");
//               console.log("📋 Form values:", formik.values);
//               console.log("🔍 Form errors:", formik.errors);
//               console.log("🔍 Form isValid:", formik.isValid);
//               console.log("🔍 Form isSubmitting:", formik.isSubmitting);
//               console.log("✅ Calling handleSubmit...");
//               formik.handleSubmit();
//             }}
//             disabled={isCreating || isUpdating}
//             className="bg-customorange hover:bg-customorangedark text-white"
//           >
//             {isCreating || isUpdating ? (
//               <Icon icon="svg-spinners:ring-resize" className="w-4 h-4 mr-2" />
//             ) : (
//               <Icon icon="material-symbols:save" className="w-4 h-4 mr-2" />
//             )}
//             {isEditing ? "Update Blog" : "Create Blog"}
//           </Button>
//         </div>
//       </Header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
//         <form
//           id="blog-form"
//           onSubmit={formik.handleSubmit}
//           className="space-y-4 sm:space-y-6"
//         >
//           {/* Main Content Area */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
//             {/* Left Column - Main Content */}
//             <div className="lg:col-span-2 space-y-4 sm:space-y-6">
//               {/* Title and Slug Card */}
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
//                 <div className="flex items-center gap-2 sm:gap-3 mb-4">
//                   <div className="p-1.5 sm:p-2 bg-customorange/10 rounded-lg">
//                     <Icon
//                       icon="material-symbols:title"
//                       className="w-4 h-4 sm:w-5 sm:h-5 text-customorange"
//                     />
//                   </div>
//                   <h3 className="text-base sm:text-lg font-semibold text-gray-900">
//                     Blog Title & URL
//                   </h3>
//                 </div>

//                 <div className="space-y-4">
//                   {/* Title Input */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Title *
//                     </label>
//                     <input
//                       type="text"
//                       name="title"
//                       value={formik.values.title}
//                       onChange={handleTitleChange}
//                       onBlur={formik.handleBlur}
//                       className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customorange focus:border-transparent text-sm sm:text-base"
//                       placeholder="Enter an engaging blog title..."
//                     />
//                     {formik.touched.title && formik.errors.title && (
//                       <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
//                         <Icon
//                           icon="material-symbols:error"
//                           className="w-3 h-3 sm:w-4 sm:h-4"
//                         />
//                         {formik.errors.title}
//                       </p>
//                     )}
//                   </div>

//                   {/* Slug Input */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       URL Slug *
//                     </label>
//                     <div className="flex items-center">
//                       <span className="text-xs sm:text-sm text-gray-500 bg-gray-50 px-2 sm:px-3 py-2 sm:py-3 border border-r-0 border-gray-300 rounded-l-lg">
//                         /blog/
//                       </span>
//                       <input
//                         type="text"
//                         name="slug"
//                         value={formik.values.slug}
//                         onChange={handleSlugChange}
//                         onBlur={formik.handleBlur}
//                         className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-customorange focus:border-transparent text-sm sm:text-base"
//                         placeholder="url-friendly-slug"
//                       />
//                     </div>
//                     {formik.touched.slug && formik.errors.slug && (
//                       <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
//                         <Icon
//                           icon="material-symbols:error"
//                           className="w-3 h-3 sm:w-4 sm:h-4"
//                         />
//                         {formik.errors.slug}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Content Editor Card */}
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
//                 <div className="flex items-center gap-2 sm:gap-3 mb-4">
//                   <div className="p-1.5 sm:p-2 bg-customorange/10 rounded-lg">
//                     <Icon
//                       icon="material-symbols:edit-document"
//                       className="w-4 h-4 sm:w-5 sm:h-5 text-customorange"
//                     />
//                   </div>
//                   <h3 className="text-base sm:text-lg font-semibold text-gray-900">
//                     Blog Content
//                   </h3>
//                 </div>
//                 <div className="border border-gray-300 rounded-lg overflow-hidden">
//                   <ReactQuill
//                     theme="snow"
//                     value={formik.values.content}
//                     onChange={(content) =>
//                       formik.setFieldValue("content", content)
//                     }
//                     modules={quillModules}
//                     formats={quillFormats}
//                     placeholder="Write your blog content here..."
//                     style={{
//                       minHeight: window.innerWidth < 640 ? "250px" : "350px",
//                     }}
//                   />
//                 </div>
//                 {formik.touched.content && formik.errors.content && (
//                   <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center gap-1">
//                     <Icon
//                       icon="material-symbols:error"
//                       className="w-3 h-3 sm:w-4 sm:h-4"
//                     />
//                     {formik.errors.content}
//                   </p>
//                 )}
//               </div>

//               {/* Excerpt Card */}
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
//                 <div className="flex items-center gap-2 sm:gap-3 mb-4">
//                   <div className="p-1.5 sm:p-2 bg-customorange/10 rounded-lg">
//                     <Icon
//                       icon="material-symbols:description"
//                       className="w-4 h-4 sm:w-5 sm:h-5 text-customorange"
//                     />
//                   </div>
//                   <h3 className="text-base sm:text-lg font-semibold text-gray-900">
//                     Blog Excerpt
//                   </h3>
//                 </div>
//                 <textarea
//                   name="excerpt"
//                   value={formik.values.excerpt}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   rows={3}
//                   className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customorange focus:border-transparent resize-none text-sm sm:text-base"
//                   placeholder="Write a brief, engaging description of your blog post..."
//                   maxLength={500}
//                 />
//                 <div className="flex justify-between mt-2">
//                   {formik.touched.excerpt && formik.errors.excerpt && (
//                     <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
//                       <Icon
//                         icon="material-symbols:error"
//                         className="w-3 h-3 sm:w-4 sm:h-4"
//                       />
//                       {formik.errors.excerpt}
//                     </p>
//                   )}
//                   <span className="text-xs sm:text-sm text-gray-400 ml-auto">
//                     {formik.values.excerpt.length}/500
//                   </span>
//                 </div>
//               </div>

//               {/* Featured Image Card */}
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
//                 <div className="flex items-center gap-2 sm:gap-3 mb-4">
//                   <div className="p-1.5 sm:p-2 bg-customorange/10 rounded-lg">
//                     <Icon
//                       icon="material-symbols:image"
//                       className="w-4 h-4 sm:w-5 sm:h-5 text-customorange"
//                     />
//                   </div>
//                   <h3 className="text-base sm:text-lg font-semibold text-gray-900">
//                     Featured Image
//                   </h3>
//                 </div>
//                 <FileDropInput
//                   multiple={false}
//                   value={formik.values.featuredImage}
//                   onChange={(file) =>
//                     formik.setFieldValue("featuredImage", file)
//                   }
//                   label="Upload Featured Image"
//                 />
//               </div>

//               {/* Additional Images Card */}
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
//                 <div className="flex items-center gap-2 sm:gap-3 mb-4">
//                   <div className="p-1.5 sm:p-2 bg-customorange/10 rounded-lg">
//                     <Icon
//                       icon="material-symbols:photo-library"
//                       className="w-4 h-4 sm:w-5 sm:h-5 text-customorange"
//                     />
//                   </div>
//                   <h3 className="text-base sm:text-lg font-semibold text-gray-900">
//                     Additional Images
//                   </h3>
//                 </div>
//                 <FileDropInput
//                   multiple={true}
//                   value={formik.values.images}
//                   onChange={(files) => formik.setFieldValue("images", files)}
//                   label="Upload Additional Images"
//                   maxFiles={10}
//                 />
//                 {formik.values.images.length > 0 && (
//                   <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
//                     {formik.values.images.map((file, index) => (
//                       <div key={index} className="relative">
//                         <img
//                           src={URL.createObjectURL(file)}
//                           alt={`Additional ${index + 1}`}
//                           className="w-full h-20 object-cover rounded-lg"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => {
//                             const newImages = formik.values.images.filter(
//                               (_, i) => i !== index
//                             );
//                             formik.setFieldValue("images", newImages);
//                           }}
//                           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
//                         >
//                           ×
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Right Column - Sidebar */}
//             <div className="lg:col-span-1 space-y-4 sm:space-y-6">
//               {/* Publish Settings Card */}
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
//                 <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
//                   <div className="p-1.5 sm:p-2 bg-customorange/10 rounded-lg">
//                     <Icon
//                       icon="material-symbols:publish"
//                       className="w-4 h-4 sm:w-5 sm:h-5 text-customorange"
//                     />
//                   </div>
//                   <h3 className="text-base sm:text-lg font-semibold text-gray-900">
//                     Publish Settings
//                   </h3>
//                 </div>

//                 <div className="space-y-4 sm:space-y-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
//                       Status
//                     </label>
//                     <select
//                       name="status"
//                       value={formik.values.status}
//                       onChange={formik.handleChange}
//                       className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customorange focus:border-transparent text-sm sm:text-base"
//                     >
//                       <option value="draft">📝 Draft</option>
//                       <option value="published">🚀 Published</option>
//                       <option value="archived">📦 Archived</option>
//                     </select>
//                   </div>

//                   <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
//                     <div>
//                       <p className="text-sm font-medium text-gray-900">
//                         Featured Blog
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         Show this blog prominently
//                       </p>
//                     </div>
//                     <input
//                       type="checkbox"
//                       name="isFeatured"
//                       checked={formik.values.isFeatured}
//                       onChange={formik.handleChange}
//                       className="h-4 w-4 sm:h-5 sm:w-5 text-customorange focus:ring-customorange border-gray-300 rounded"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Tags Card */}
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
//                 <div className="flex items-center gap-2 sm:gap-3 mb-4">
//                   <div className="p-1.5 sm:p-2 bg-customorange/10 rounded-lg">
//                     <Icon
//                       icon="material-symbols:tag"
//                       className="w-4 h-4 sm:w-5 sm:h-5 text-customorange"
//                     />
//                   </div>
//                   <h3 className="text-base sm:text-lg font-semibold text-gray-900">
//                     Tags
//                   </h3>
//                 </div>
//                 <div className="flex gap-2 mb-4">
//                   <input
//                     type="text"
//                     value={tagInput}
//                     onChange={(e) => setTagInput(e.target.value)}
//                     onKeyPress={(e) =>
//                       e.key === "Enter" && (e.preventDefault(), addTag())
//                     }
//                     className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customorange focus:border-transparent text-sm"
//                     placeholder="Add tag..."
//                   />
//                   <Button
//                     type="button"
//                     size="sm"
//                     onClick={addTag}
//                     className="bg-customorange hover:bg-customorangedark px-2 sm:px-3"
//                   >
//                     <Icon
//                       icon="material-symbols:add"
//                       className="w-3 h-3 sm:w-4 sm:h-4"
//                     />
//                   </Button>
//                 </div>
//                 <div className="flex flex-wrap gap-1.5 sm:gap-2">
//                   {formik.values.tags.map((tag, index) => (
//                     <span
//                       key={index}
//                       className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-customorange/10 text-customorange border border-customorange/20"
//                     >
//                       #{tag}
//                       <button
//                         type="button"
//                         onClick={() => removeTag(tag)}
//                         className="ml-1 sm:ml-2 text-customorange hover:text-customorangedark"
//                       >
//                         <Icon
//                           icon="material-symbols:close"
//                           className="w-2.5 h-2.5 sm:w-3 sm:h-3"
//                         />
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               {/* Categories Card */}
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="p-2 bg-customorange/10 rounded-lg">
//                     <Icon
//                       icon="material-symbols:category"
//                       className="w-5 h-5 text-customorange"
//                     />
//                   </div>
//                   <Text
//                     size="body-lg-lg"
//                     className="font-semibold text-gray-900"
//                   >
//                     Categories
//                   </Text>
//                 </div>
//                 <div className="flex gap-2 mb-4">
//                   <input
//                     type="text"
//                     value={categoryInput}
//                     onChange={(e) => setCategoryInput(e.target.value)}
//                     onKeyPress={(e) =>
//                       e.key === "Enter" && (e.preventDefault(), addCategory())
//                     }
//                     className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customorange focus:border-transparent"
//                     placeholder="Add category..."
//                   />
//                   <Button
//                     type="button"
//                     size="sm"
//                     onClick={addCategory}
//                     className="bg-customorange hover:bg-customorangedark"
//                   >
//                     <Icon icon="material-symbols:add" className="w-4 h-4" />
//                   </Button>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {formik.values.categories.map((category, index) => (
//                     <span
//                       key={index}
//                       className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
//                     >
//                       {category}
//                       <button
//                         type="button"
//                         onClick={() => removeCategory(category)}
//                         className="ml-2 text-blue-700 hover:text-blue-900"
//                       >
//                         <Icon
//                           icon="material-symbols:close"
//                           className="w-3 h-3"
//                         />
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               {/* Video Card */}
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
//                 <div className="flex items-center gap-2 sm:gap-3 mb-4">
//                   <div className="p-1.5 sm:p-2 bg-customorange/10 rounded-lg">
//                     <Icon
//                       icon="material-symbols:video-library"
//                       className="w-4 h-4 sm:w-5 sm:h-5 text-customorange"
//                     />
//                   </div>
//                   <h3 className="text-base sm:text-lg font-semibold text-gray-900">
//                     Video (Optional)
//                   </h3>
//                 </div>
//                 <VideoUploadField
//                   value={formik.values.video}
//                   onChange={(file) => formik.setFieldValue("video", file)}
//                   label="Upload Video"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* SEO Section */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
//             <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
//               <div className="p-1.5 sm:p-2 bg-customorange/10 rounded-lg">
//                 <Icon
//                   icon="material-symbols:search"
//                   className="w-4 h-4 sm:w-5 sm:h-5 text-customorange"
//                 />
//               </div>
//               <h3 className="text-base sm:text-lg font-semibold text-gray-900">
//                 SEO Settings
//               </h3>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
//                   SEO Title
//                 </label>
//                 <input
//                   type="text"
//                   name="metadata.seoTitle"
//                   value={formik.values.metadata.seoTitle}
//                   onChange={formik.handleChange}
//                   className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customorange focus:border-transparent text-sm sm:text-base"
//                   placeholder="SEO optimized title..."
//                   maxLength={60}
//                 />
//                 <span className="text-xs sm:text-sm text-gray-400 mt-1 block">
//                   {formik.values.metadata.seoTitle.length}/60 characters
//                 </span>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
//                   Canonical URL (Auto-generated)
//                 </label>
//                 <input
//                   type="url"
//                   name="metadata.canonicalUrl"
//                   value={formik.values.metadata.canonicalUrl}
//                   readOnly
//                   className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm sm:text-base"
//                   placeholder="Will be generated from slug"
//                 />
//               </div>

//               <div className="lg:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                   SEO Description
//                 </label>
//                 <textarea
//                   name="metadata.seoDescription"
//                   value={formik.values.metadata.seoDescription}
//                   onChange={formik.handleChange}
//                   rows={4}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customorange focus:border-transparent resize-none"
//                   placeholder="SEO meta description..."
//                   maxLength={160}
//                 />
//                 <Text
//                   size="body-xs-default"
//                   variant="grey-400"
//                   className="mt-2"
//                 >
//                   {formik.values.metadata.seoDescription.length}/160 characters
//                 </Text>
//               </div>

//               <div className="lg:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                   SEO Keywords
//                 </label>
//                 <div className="flex gap-2 mb-4">
//                   <input
//                     type="text"
//                     value={keywordInput}
//                     onChange={(e) => setKeywordInput(e.target.value)}
//                     onKeyPress={(e) =>
//                       e.key === "Enter" && (e.preventDefault(), addKeyword())
//                     }
//                     className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customorange focus:border-transparent"
//                     placeholder="Add SEO keyword..."
//                   />
//                   <Button
//                     type="button"
//                     size="sm"
//                     onClick={addKeyword}
//                     className="bg-customorange hover:bg-customorangedark"
//                   >
//                     <Icon icon="material-symbols:add" className="w-4 h-4" />
//                   </Button>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {formik.values.metadata.keywords.map((keyword, index) => (
//                     <span
//                       key={index}
//                       className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"
//                     >
//                       {keyword}
//                       <button
//                         type="button"
//                         onClick={() => removeKeyword(keyword)}
//                         className="ml-2 text-green-700 hover:text-green-900"
//                       >
//                         <Icon
//                           icon="material-symbols:close"
//                           className="w-3 h-3"
//                         />
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default BlogEditor;

// Second

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./BlogEditor.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import { Text } from "../../../components/shared/Text";
import { Button } from "../../../components/ui/button";
import Header from "../../../components/shared/table_heading/Header";
import FileDropInput from "../../../components/shared/form_components/FileDropInput";
import VideoUploadField from "../../../components/shared/form_components/VideoUploadField";

import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useGetBlogByIdQuery,
} from "../../../server/api/blogHooks";
import { IBlogFormData } from "../../../types/blog.types";
import { FrontendRoutes } from "../../../routes/routes";

// Fallback base URL for canonical URL generation
const BASE_URL =
  typeof window !== "undefined" && window.location.origin
    ? window.location.origin
    : "https://your-default-domain.com"; // Replace with your actual domain

// Validation schema
const blogValidationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .max(200, "Title must be less than 200 characters")
    .trim(),
  slug: Yup.string()
    .required("Slug is required")
    .matches(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .trim(),
  content: Yup.string()
    .required("Content is required")
    .test("not-empty-html", "Content cannot be empty", (value) => {
      if (typeof value !== "string" || !value) return false;
      return value !== "<p><br></p>" && value.trim().length > 0;
    }),
  excerpt: Yup.string().max(500, "Excerpt must be less than 500 characters"),
  tags: Yup.array().of(Yup.string()),
  categories: Yup.array().of(Yup.string()),
  status: Yup.string()
    .oneOf(["draft", "published", "archived"])
    .required("Status is required"),
  author: Yup.string().required("Author is required").trim(),
  metadata: Yup.object({
    seoTitle: Yup.string().max(60, "SEO title must be less than 60 characters"),
    seoDescription: Yup.string().max(
      160,
      "SEO description must be less than 160 characters"
    ),
    keywords: Yup.array().of(Yup.string()),
    canonicalUrl: Yup.string().optional().nullable(), // Simplified to plain string
  }),
});

const BlogEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  // State
  const [tagInput, setTagInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  // API hooks
  const { data: existingBlog, isLoading: isLoadingBlog } = isEditing
    ? useGetBlogByIdQuery(id!)
    : { data: undefined, isLoading: false };
  const { mutate: createBlog, isPending: isCreating } = useCreateBlogMutation();
  const { mutate: updateBlog, isPending: isUpdating } = useUpdateBlogMutation();

  // Initial values
  const initialValues: IBlogFormData = {
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    tags: [],
    categories: [],
    featuredImage: null,
    images: [],
    video: null,
    status: "draft",
    isFeatured: false,
    author: "",
    metadata: {
      seoTitle: "",
      seoDescription: "",
      keywords: [],
      canonicalUrl: "",
    },
  };

  // Formik setup
  const formik = useFormik({
    initialValues,
    validationSchema: blogValidationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      console.log("🚀🚀🚀 FORM SUBMISSION TRIGGERED! 🚀🚀🚀");
      console.log("📝 Form values:", values);
      console.log("🔍 Formik errors:", formik.errors);
      console.log("🔍 Formik touched:", formik.touched);
      console.log("🔍 Formik isValid:", formik.isValid);

      try {
        const formData = new FormData();
        console.log("📦 Building FormData...");

        formData.append("title", values.title.trim());
        formData.append("slug", values.slug.trim());
        formData.append("content", values.content.trim());
        formData.append("excerpt", values.excerpt.trim());
        formData.append("status", values.status);
        formData.append("isFeatured", values.isFeatured.toString());
        formData.append("author", values.author.trim());
        formData.append("tags", JSON.stringify(values.tags));
        formData.append("categories", JSON.stringify(values.categories));
        formData.append("metadata", JSON.stringify(values.metadata));

        if (values.featuredImage) {
          formData.append("featuredImage", values.featuredImage);
          console.log("✅ Featured image added");
        }
        if (values.video) {
          formData.append("video", values.video);
          console.log("✅ Video added");
        }
        if (values.images.length > 0) {
          values.images.forEach((image, index) => {
            formData.append("images", image);
            console.log(`✅ Image ${index + 1} added`);
          });
        }

        const token = Cookies.get("token");
        console.log("🔍 Token from cookies:", token);
        if (!token) {
          console.error("❌ No JWT token found");
          toast.error("User not authenticated. Please log in.");
          setSubmitting(false);
          navigate(FrontendRoutes.LOGIN);
          return;
        }

        let createdBy: string;
        try {
          const decodedToken: any = jwtDecode(token);
          console.log("🔍 Decoded token:", decodedToken);
          const currentTime = Math.floor(Date.now() / 1000);
          if (decodedToken.exp && decodedToken.exp < currentTime) {
            console.error("❌ Token expired");
            toast.error("Session expired. Please log in again.");
            Cookies.remove("token");
            navigate(FrontendRoutes.LOGIN);
            setSubmitting(false);
            return;
          }
          createdBy = decodedToken.id || decodedToken.sub;
          if (!createdBy) {
            console.error("❌ No user ID found in JWT token");
            toast.error("Invalid user authentication data");
            setSubmitting(false);
            navigate(FrontendRoutes.LOGIN);
            return;
          }
          formData.append("createdBy", createdBy);
        } catch (error) {
          console.error("❌ JWT decode error:", error);
          toast.error("Failed to authenticate user");
          setSubmitting(false);
          navigate(FrontendRoutes.LOGIN);
          return;
        }

        console.log("📤 FormData ready for submission");
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
          } else {
            console.log(`  ${key}: ${value}`);
          }
        }

        if (isEditing && id) {
          console.log("🔄 Updating existing blog...");
          updateBlog(
            { id, formData },
            {
              onSuccess: () => {
                console.log("✅ Blog updated successfully");
                toast.success("Blog updated successfully!");
                navigate(FrontendRoutes.BLOGLIST);
              },
              onError: (error: any) => {
                console.error("❌ Update error:", error);
                toast.error(`Failed to update blog: ${error.message}`);
              },
              onSettled: () => {
                setSubmitting(false);
              },
            }
          );
        } else {
          console.log("🆕 Creating new blog...");
          createBlog(formData, {
            onSuccess: (data) => {
              console.log("✅ Blog created successfully:", data);
              toast.success("Blog created successfully!");
              navigate(FrontendRoutes.BLOGLIST);
            },
            onError: (error: any) => {
              console.error("❌ Blog creation error:", error);
              toast.error(`Failed to create blog: ${error.message}`);
            },
            onSettled: () => {
              setSubmitting(false);
            },
          });
        }
      } catch (error: any) {
        console.error("❌ Form submission error:", error);
        toast.error("An error occurred while saving the blog");
        setSubmitting(false);
      }
    },
  });

  // Debug validation state
  useEffect(() => {
    console.log("🔍 Formik state on render:");
    console.log("  Values:", formik.values);
    console.log("  Errors:", formik.errors);
    console.log("  Touched:", formik.touched);
    console.log("  IsValid:", formik.isValid);
  }, [formik.values, formik.errors, formik.touched, formik.isValid]);

  // Load existing blog data for editing
  useEffect(() => {
    if (existingBlog && isEditing) {
      console.log("📥 Loading existing blog data:", existingBlog);
      formik.setValues({
        title: existingBlog.title || "",
        slug: existingBlog.slug || "",
        content: existingBlog.content || "",
        excerpt: existingBlog.excerpt || "",
        tags: existingBlog.tags || [],
        categories: existingBlog.categories || [],
        featuredImage: null,
        images: [],
        video: null,
        status: existingBlog.status || "draft",
        isFeatured: existingBlog.isFeatured || false,
        author: existingBlog.author?.name || "",
        metadata: {
          seoTitle: existingBlog.metadata?.seoTitle || "",
          seoDescription: existingBlog.metadata?.seoDescription || "",
          keywords: existingBlog.metadata?.keywords || [],
          canonicalUrl: existingBlog.metadata?.canonicalUrl || "",
        },
      });
    }
  }, [existingBlog, isEditing]);

  // Memoize image blob URLs with immediate cleanup
  const imagePreviews = useMemo(() => {
    console.log("🔍 Computing imagePreviews for images:", formik.values.images);
    const urls = formik.values.images.map((file) => URL.createObjectURL(file));
    return urls;
  }, [formik.values.images]);

  // Cleanup blob URLs on unmount or when images change
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      console.log("🧹 Cleaned up blob URLs for images");
    };
  }, [imagePreviews]);

  // Handle title change
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const title = e.target.value;
      formik.setFieldValue("title", title);
      formik.validateField("title");
    },
    [formik]
  );

  // Handle slug change
  const handleSlugChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
      slug = slug.replace(/^-+|-+$/g, "").replace(/-+/g, "-");
      console.log("📍 Slug:", slug);
      formik.setFieldValue("slug", slug);
      formik.validateField("slug");
      const canonicalUrl = slug ? `${BASE_URL}/blog/${slug}` : "";
      console.log("📍 Canonical URL:", canonicalUrl);
      formik.setFieldValue("metadata.canonicalUrl", canonicalUrl);
      formik.validateField("metadata.canonicalUrl");
    },
    [formik]
  );

  // ReactQuill modules and formats
  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["link", "image", "video"],
        ["blockquote", "code-block"],
        ["clean"],
      ],
    }),
    []
  );

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "video",
    "blockquote",
    "code-block",
  ];

  // Helper functions
  const addTag = useCallback(() => {
    if (tagInput.trim() && !formik.values.tags.includes(tagInput.trim())) {
      formik.setFieldValue("tags", [...formik.values.tags, tagInput.trim()]);
      setTagInput("");
    }
  }, [tagInput, formik]);

  const removeTag = useCallback(
    (tagToRemove: string) => {
      formik.setFieldValue(
        "tags",
        formik.values.tags.filter((tag) => tag !== tagToRemove)
      );
    },
    [formik]
  );

  const addCategory = useCallback(() => {
    if (
      categoryInput.trim() &&
      !formik.values.categories.includes(categoryInput.trim())
    ) {
      formik.setFieldValue("categories", [
        ...formik.values.categories,
        categoryInput.trim(),
      ]);
      setCategoryInput("");
    }
  }, [categoryInput, formik]);

  const removeCategory = useCallback(
    (categoryToRemove: string) => {
      formik.setFieldValue(
        "categories",
        formik.values.categories.filter((cat) => cat !== categoryToRemove)
      );
    },
    [formik]
  );

  const addKeyword = useCallback(() => {
    if (
      keywordInput.trim() &&
      !formik.values.metadata.keywords.includes(keywordInput.trim())
    ) {
      formik.setFieldValue("metadata.keywords", [
        ...formik.values.metadata.keywords,
        keywordInput.trim(),
      ]);
      setKeywordInput("");
    }
  }, [keywordInput, formik]);

  const removeKeyword = useCallback(
    (keywordToRemove: string) => {
      formik.setFieldValue(
        "metadata.keywords",
        formik.values.metadata.keywords.filter((kw) => kw !== keywordToRemove)
      );
    },
    [formik]
  );

  if (isLoadingBlog && isEditing) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icon icon="svg-spinners:ring-resize" width="32" height="32" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <Header text={isEditing ? "Edit Blog" : "Create New Blog"}>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(FrontendRoutes.BLOGLIST)}
            className="border-gray-300 hover:border-gray-400"
          >
            <Icon icon="material-symbols:arrow-back" className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            form="blog-form"
            disabled={isCreating || isUpdating || !formik.isValid}
            className="bg-customorange hover:bg-customorangedark text-white"
          >
            {isCreating || isUpdating ? (
              <Icon icon="svg-spinners:ring-resize" className="w-4 h-4 mr-2" />
            ) : (
              <Icon icon="material-symbols:save" className="w-4 h-4 mr-2" />
            )}
            {isEditing ? "Update Blog" : "Create Blog"}
          </Button>
        </div>
      </Header>

      {/* Debug Validation Errors */}
      {Object.keys(formik.errors).length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-sm font-semibold text-red-700">
            Form Validation Errors:
          </h3>
          <ul className="list-disc pl-5 text-sm text-red-600">
            {Object.entries(formik.errors).map(([field, error]) => (
              <li key={field}>
                {field}:{" "}
                {typeof error === "string" ? error : JSON.stringify(error)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <form
          id="blog-form"
          onSubmit={(e) => {
            console.log("🔘 Form submit event triggered!");
            formik.handleSubmit(e);
          }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Title, Author and Slug Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <div className="p-1.5 sm:p-2 bg-customorange/10 rounded-lg">
                    <Icon
                      icon="material-symbols:title"
                      className="w-4 h-4 sm:w-5 sm:h-5 text-customorange"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Blog Title, Author & URL
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formik.values.title}
                      onChange={handleTitleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customorange focus:border-transparent text-sm sm:text-base"
                      placeholder="Enter an engaging blog title..."
                    />
                    {formik.touched.title && formik.errors.title && (
                      <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                        <Icon
                          icon="material-symbols:error"
                          className="w-3 h-3 sm:w-4 sm:h-4"
                        />
                        {formik.errors.title}
                      </p>
                    )}
                  </div>

                  {/* Author Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author *
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formik.values.author}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customorange focus:border-transparent text-sm sm:text-base"
                      placeholder="Enter author name..."
                    />
                    {formik.touched.author && formik.errors.author && (
                      <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                        <Icon
                          icon="material-symbols:error"
                          className="w-3 h-3 sm:w-4 sm:h-4"
                        />
                        {formik.errors.author}
                      </p>
                    )}
                  </div>

                  {/* Slug Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug *
                    </label>
                    <div className="flex items-center">
                      <span className="text-xs sm:text-sm text-gray-500 bg-gray-50 px-2 sm:px-3 py-2 sm:py-3 border border-r-0 border-gray-300 rounded-l-lg">
                        /blog/
                      </span>
                      <input
                        type="text"
                        name="slug"
                        value={formik.values.slug}
                        onChange={handleSlugChange}
                        onBlur={formik.handleBlur}
                        className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-customorange focus:border-transparent text-sm sm:text-base"
                        placeholder="url-friendly-slug"
                      />
                    </div>
                    {formik.touched.slug && formik.errors.slug && (
                      <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                        <Icon
                          icon="material-symbols:error"
                          className="w-3 h-3 sm:w-4 sm:h-4"
                        />
                        {formik.errors.slug}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Editor Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <div className="p-1.5 sm:p-2 bg-customorange/10 rounded-lg">
                    <Icon
                      icon="material-symbols:edit-document"
                      className="w-4 h-4 sm:w-5 sm:h-5 text-customorange"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Blog Content
                  </h3>
                </div>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={formik.values.content}
                    onChange={(content) => {
                      formik.setFieldValue("content", content);
                      formik.validateField("content");
                    }}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Write your blog content here..."
                    style={{
                      minHeight: window.innerWidth < 640 ? "250px" : "350px",
                    }}
                  />
                </div>
                {formik.touched.content && formik.errors.content && (
                  <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                    <Icon
                      icon="material-symbols:error"
                      className="w-3 h-3 sm:w-4 sm:h-4"
                    />
                    {formik.errors.content}
                  </p>
                )}
              </div>

              {/* Excerpt Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <div className="p-1.5 sm:p-2 bg-customorange/10 rounded-lg">
                    <Icon
                      icon="material-symbols:description"
                      className="w-4 h-4 sm:w-5 sm:h-5 text-customorange"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Blog Excerpt
                  </h3>
                </div>
                <textarea
                  name="excerpt"
                  value={formik.values.excerpt}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customorange focus:border-transparent resize-none text-sm sm:text-base"
                  placeholder="Write a brief, engaging description of your blog post..."
                  maxLength={500}
                />
                <div className="flex justify-between mt-2">
                  {formik.touched.excerpt && formik.errors.excerpt && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
                      <Icon
                        icon="material-symbols:error"
                        className="w-3 h-3 sm:w-4 sm:h-4"
                      />
                      {formik.errors.excerpt}
                    </p>
                  )}
                  <span className="text-xs sm:text-sm text-gray-400 ml-auto">
                    {formik.values.excerpt.length}/500
                  </span>
                </div>
              </div>

              {/* Featured Image Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <div className="p-1.5 sm:p-2 bg-customorange/10 rounded-lg">
                    <Icon
                      icon="material-symbols:image"
                      className="w-4 h-4 sm:w-5 sm:h-5 text-customorange"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Featured Image
                  </h3>
                </div>
                <FileDropInput
                  multiple={false}
                  value={formik.values.featuredImage}
                  onChange={(file) =>
                    formik.setFieldValue("featuredImage", file)
                  }
                  label="Upload Featured Image"
                />
              </div>

              {/* Additional Images Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <div className="p-1.5 sm:p-2 bg-customorange/10 rounded-lg">
                    <Icon
                      icon="material-symbols:photo-library"
                      className="w-4 h-4 sm:w-5 sm:h-5 text-customorange"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Additional Images
                  </h3>
                </div>
                <FileDropInput
                  multiple={true}
                  value={formik.values.images}
                  onChange={(files) => formik.setFieldValue("images", files)}
                  label="Upload Additional Images"
                  maxFiles={10}
                />
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {imagePreviews.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Additional ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = formik.values.images.filter(
                              (_, i) => i !== index
                            );
                            formik.setFieldValue("images", newImages);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              {/* Publish Settings Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="p-1.5 sm:p-2 bg-customorange/10 rounded-lg">
                    <Icon
                      icon="material-symbols:publish"
                      className="w-4 h-4 sm:w-5 sm:h-5 text-customorange"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Publish Settings
                  </h3>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formik.values.status}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.validateField("status");
                      }}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customorange focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="draft">📝 Draft</option>
                      <option value="published">🚀 Published</option>
                      <option value="archived">📦 Archived</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Featured Blog
                      </p>
                      <p className="text-xs text-gray-500">
                        Show this blog prominently
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formik.values.isFeatured}
                      onChange={formik.handleChange}
                      className="h-4 w-4 sm:h-5 sm:w-5 text-customorange focus:ring-customorange border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Tags Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <div className="p-1.5 sm:p-2 bg-customorange/10 rounded-lg">
                    <Icon
                      icon="material-symbols:tag"
                      className="w-4 h-4 sm:w-5 sm:h-5 text-customorange"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Tags
                  </h3>
                </div>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customorange focus:border-transparent text-sm"
                    placeholder="Add tag..."
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={addTag}
                    className="bg-customorange hover:bg-customorangedark px-2 sm:px-3"
                  >
                    <Icon
                      icon="material-symbols:add"
                      className="w-3 h-3 sm:w-4 sm:h-4"
                    />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {formik.values.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-customorange/10 text-customorange border border-customorange/20"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 sm:ml-2 text-customorange hover:text-customorangedark"
                      >
                        <Icon
                          icon="material-symbols:close"
                          className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                        />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Categories Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <div className="p-1.5 sm:p-2 bg-customorange/10 rounded-lg">
                    <Icon
                      icon="material-symbols:category"
                      className="w-4 h-4 sm:w-5 sm:h-5 text-customorange"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Categories
                  </h3>
                </div>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addCategory())
                    }
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customorange focus:border-transparent text-sm sm:text-base"
                    placeholder="Add category..."
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={addCategory}
                    className="bg-customorange hover:bg-customorangedark px-2 sm:px-3"
                  >
                    <Icon
                      icon="material-symbols:add"
                      className="w-3 h-3 sm:w-4 sm:h-4"
                    />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {formik.values.categories.map((category, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      {category}
                      <button
                        type="button"
                        onClick={() => removeCategory(category)}
                        className="ml-1 sm:ml-2 text-blue-700 hover:text-blue-900"
                      >
                        <Icon
                          icon="material-symbols:close"
                          className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                        />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Video Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <div className="p-1.5 sm:p-2 bg-customorange/10 rounded-lg">
                    <Icon
                      icon="material-symbols:video-library"
                      className="w-4 h-4 sm:w-5 sm:h-5 text-customorange"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Video (Optional)
                  </h3>
                </div>
                <VideoUploadField
                  value={formik.values.video}
                  onChange={(file) => formik.setFieldValue("video", file)}
                  label="Upload Video"
                />
              </div>
            </div>
          </div>

          {/* SEO Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-1.5 sm:p-2 bg-customorange/10 rounded-lg">
                <Icon
                  icon="material-symbols:search"
                  className="w-4 h-4 sm:w-5 sm:h-5 text-customorange"
                />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                SEO Settings
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                  SEO Title
                </label>
                <input
                  type="text"
                  name="metadata.seoTitle"
                  value={formik.values.metadata.seoTitle}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customorange focus:border-transparent text-sm sm:text-base"
                  placeholder="SEO optimized title..."
                  maxLength={60}
                />
                <span className="text-xs sm:text-sm text-gray-400 mt-1 block">
                  {formik.values.metadata.seoTitle.length}/60 characters
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                  Canonical URL (Auto-generated)
                </label>
                <input
                  type="url"
                  name="metadata.canonicalUrl"
                  value={formik.values.metadata.canonicalUrl}
                  readOnly
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm sm:text-base"
                  placeholder="Will be generated from slug"
                />
                {formik.touched.metadata?.canonicalUrl &&
                  formik.errors.metadata?.canonicalUrl && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                      <Icon
                        icon="material-symbols:error"
                        className="w-3 h-3 sm:w-4 sm:h-4"
                      />
                      {formik.errors.metadata.canonicalUrl}
                    </p>
                  )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                  SEO Description
                </label>
                <textarea
                  name="metadata.seoDescription"
                  value={formik.values.metadata.seoDescription}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customorange focus:border-transparent resize-none text-sm sm:text-base"
                  placeholder="SEO meta description..."
                  maxLength={160}
                />
                <span className="text-xs sm:text-sm text-gray-400 mt-1 block">
                  {formik.values.metadata.seoDescription.length}/160 characters
                </span>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                  SEO Keywords
                </label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addKeyword())
                    }
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customorange focus:border-transparent text-sm sm:text-base"
                    placeholder="Add SEO keyword..."
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={addKeyword}
                    className="bg-customorange hover:bg-customorangedark px-2 sm:px-3"
                  >
                    <Icon
                      icon="material-symbols:add"
                      className="w-3 h-3 sm:w-4 sm:h-4"
                    />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {formik.values.metadata.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1 sm:ml-2 text-green-700 hover:text-green-900"
                      >
                        <Icon
                          icon="material-symbols:close"
                          className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                        />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogEditor;
