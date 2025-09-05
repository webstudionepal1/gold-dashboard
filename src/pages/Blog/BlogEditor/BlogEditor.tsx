import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./BlogEditor.css";
import { Icon } from "@iconify/react/dist/iconify.js";

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
import { useAuth } from "@/hooks/useAuth";

// Fallback base URL for canonical URL generation
const BASE_URL =
  typeof window !== "undefined" && window.location.origin
    ? window.location.origin
    : "https://panch-admin.webstudiomatrix.com/"; // Replace with your actual domain

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

// Utility function to generate URL-friendly slug from title
const generateSlug = (title: string): string => {
  return (
    title
      .toLowerCase()
      .trim()
      // Replace spaces with hyphens
      .replace(/\s+/g, "-")
      // Remove special characters except hyphens
      .replace(/[^a-z0-9-]/g, "")
      // Remove multiple consecutive hyphens
      .replace(/-+/g, "-")
      // Remove leading and trailing hyphens
      .replace(/^-+|-+$/g, "")
  );
};

const BlogEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const { data } = useAuth();
  const userData = JSON.parse(data?.user ?? "");

  // State
  const [tagInput, setTagInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  // API hooks
  const { data: existingBlog, isLoading: isLoadingBlog } = useGetBlogByIdQuery(
    id!
  );
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
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      console.log("🚀 Form submission started!", values);

      // Quick test - just log and return
      if (!values.title || !values.author) {
        console.log("⚠️ Missing required fields - filling with test data");
        values.title = values.title || "Test Blog Title";
        values.author = values.author || "Test Author";
        values.slug = values.slug || "test-blog-title";
        values.content = values.content || "<p>Test content</p>";
      }

      try {
        const formData = new FormData();

        formData.append("title", values.title.trim());
        formData.append("slug", values.slug.trim());
        formData.append("content", values.content.trim());
        formData.append("excerpt", values.excerpt.trim());
        formData.append("status", values.status);
        formData.append("isFeatured", values.isFeatured.toString());
        formData.append("author", userData?._id);
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

        for (const [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
          } else {
            console.log(`  ${key}: ${value}`);
          }
        }

        if (isEditing && id) {
          updateBlog(
            { id, formData },
            {
              onSuccess: () => {
                history.back();
              },
            }
          );
        } else {
          createBlog(formData, {
            onSuccess: () => {
              resetForm();
            },
          });
        }
      } catch {
        setSubmitting(false);
      }
    },
  });

  // Debug validation state
  useEffect(() => {}, [
    formik.values,
    formik.errors,
    formik.touched,
    formik.isValid,
  ]);

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

  // Handle title change and auto-generate slug
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const title = e.target.value;
      formik.setFieldValue("title", title);
      formik.validateField("title");

      // Auto-generate slug from title (only if slug hasn't been manually edited)
      if (!isSlugManuallyEdited) {
        const autoSlug = generateSlug(title);
        formik.setFieldValue("slug", autoSlug);
        formik.validateField("slug");

        // Update canonical URL as well
        const canonicalUrl = autoSlug ? `${BASE_URL}/blog/${autoSlug}` : "";
        formik.setFieldValue("metadata.canonicalUrl", canonicalUrl);
        formik.validateField("metadata.canonicalUrl");

        console.log("🔄 Auto-generated slug:", autoSlug);
        console.log("🔄 Auto-generated canonical URL:", canonicalUrl);
      }
    },
    [formik, isEditing]
  );

  // Handle slug change
  const handleSlugChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Mark that slug has been manually edited
      setIsSlugManuallyEdited(true);

      let slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
      slug = slug.replace(/^-+|-+$/g, "").replace(/-+/g, "-");
      console.log("📍 Manual slug edit:", slug);
      formik.setFieldValue("slug", slug);
      formik.validateField("slug");
      const canonicalUrl = slug ? `${BASE_URL}/blog/${slug}` : "";
      console.log("📍 Canonical URL:", canonicalUrl);
      formik.setFieldValue("metadata.canonicalUrl", canonicalUrl);
      formik.validateField("metadata.canonicalUrl");
    },
    [formik, setIsSlugManuallyEdited]
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
            disabled={isCreating || isUpdating}
            className="bg-customorange hover:bg-customorangedark text-white"
            onClick={() => {
              console.log("🔘 Submit button clicked!");
              console.log(
                "🔍 Button disabled:",
                isCreating || isUpdating || !formik.isValid
              );
              console.log("🔍 Form valid:", formik.isValid);
            }}
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


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <form
          id="blog-form"
          onSubmit={(e) => {
            console.log("🔘 Form submit event triggered!");
            console.log("🔍 Form valid:", formik.isValid);
            console.log("🔍 Form errors:", formik.errors);
            console.log("🔍 Form values:", formik.values);
            formik.handleSubmit(e);
          }}
          className="space-y-3"
        >
          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-3">
              {/* Title, Author and Slug Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 bg-customorange/10 rounded">
                    <Icon
                      icon="material-symbols:title"
                      className="w-4 h-4 text-customorange"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Blog Title, Author & URL
                  </h3>
                </div>

                <div className="space-y-3">
                  {/* Title Input */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formik.values.title}
                      onChange={handleTitleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-customorange focus:border-transparent text-sm"
                      placeholder="Enter an engaging blog title..."
                    />
                    {formik.touched.title && formik.errors.title && (
                      <p className="mt-1 text-xs text-red flex items-center gap-1">
                        <Icon
                          icon="material-symbols:error"
                          className="w-3 h-3"
                        />
                        {formik.errors.title}
                      </p>
                    )}
                  </div>

                  {/* Author Input */}
                  {/* <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Author *
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formik.values.author}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-customorange focus:border-transparent text-sm"
                      placeholder="Enter author name..."
                    />
                    {formik.touched.author && formik.errors.author && (
                      <p className="mt-1 text-xs text-red flex items-center gap-1">
                        <Icon
                          icon="material-symbols:error"
                          className="w-3 h-3"
                        />
                        {formik.errors.author}
                      </p>
                    )}
                  </div> */}

                  {/* Slug Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-gray-700">
                        URL Slug *
                      </label>
                      {isSlugManuallyEdited && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsSlugManuallyEdited(false);
                            const autoSlug = generateSlug(formik.values.title);
                            formik.setFieldValue("slug", autoSlug);
                            formik.validateField("slug");
                            const canonicalUrl = autoSlug
                              ? `${BASE_URL}/blog/${autoSlug}`
                              : "";
                            formik.setFieldValue(
                              "metadata.canonicalUrl",
                              canonicalUrl
                            );
                            formik.validateField("metadata.canonicalUrl");
                            console.log(
                              "🔄 Reset to auto-generated slug:",
                              autoSlug
                            );
                          }}
                          className="text-xs text-customorange hover:text-customorangedark font-medium"
                        >
                          Reset to Auto
                        </button>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 bg-gray-50 px-2 py-2 border border-r-0 border-gray-300 rounded-l">
                        /blog/
                      </span>
                      <input
                        type="text"
                        name="slug"
                        value={formik.values.slug}
                        onChange={handleSlugChange}
                        onBlur={formik.handleBlur}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-r focus:outline-none focus:ring-1 focus:ring-customorange focus:border-transparent text-sm"
                        placeholder="url-friendly-slug"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      {formik.touched.slug && formik.errors.slug && (
                        <p className="text-xs text-red flex items-center gap-1">
                          <Icon
                            icon="material-symbols:error"
                            className="w-3 h-3"
                          />
                          {formik.errors.slug}
                        </p>
                      )}
                      {!isSlugManuallyEdited && formik.values.title && (
                        <p className="text-xs text-green-600 ml-auto flex items-center gap-1">
                          <Icon
                            icon="material-symbols:auto-awesome"
                            className="w-3 h-3"
                          />
                          Auto-generated from title
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Editor Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 bg-customorange/10 rounded">
                    <Icon
                      icon="material-symbols:edit-document"
                      className="w-4 h-4 text-customorange"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Blog Content
                  </h3>
                </div>
                <div className="border border-gray-300 rounded overflow-hidden max-w-full">
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
                      minHeight: "280px",
                      maxWidth: "100%",
                    }}
                  />
                </div>
                {formik.touched.content && formik.errors.content && (
                  <p className="mt-1 text-xs text-red flex items-center gap-1">
                    <Icon icon="material-symbols:error" className="w-3 h-3" />
                    {formik.errors.content}
                  </p>
                )}
              </div>

              {/* Excerpt Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 bg-customorange/10 rounded">
                    <Icon
                      icon="material-symbols:description"
                      className="w-4 h-4 text-customorange"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Blog Excerpt
                  </h3>
                </div>
                <textarea
                  name="excerpt"
                  value={formik.values.excerpt}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-customorange focus:border-transparent resize-none text-sm"
                  placeholder="Write a brief, engaging description of your blog post..."
                  maxLength={500}
                />
                <div className="flex justify-between mt-1">
                  {formik.touched.excerpt && formik.errors.excerpt && (
                    <p className="text-xs text-red flex items-center gap-1">
                      <Icon
                        icon="material-symbols:error"
                        className="w-3 h-3"
                      />
                      {formik.errors.excerpt}
                    </p>
                  )}
                  <span className="text-xs text-gray-400 ml-auto">
                    {formik.values.excerpt.length}/500
                  </span>
                </div>
              </div>

              {/* Featured Image Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 bg-customorange/10 rounded">
                    <Icon
                      icon="material-symbols:image"
                      className="w-4 h-4 text-customorange"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
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
              {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 bg-customorange/10 rounded">
                    <Icon
                      icon="material-symbols:photo-library"
                      className="w-4 h-4 text-customorange"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
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
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {imagePreviews.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Additional ${index + 1}`}
                          className="w-full h-16 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = formik.values.images.filter(
                              (_, i) => i !== index
                            );
                            formik.setFieldValue("images", newImages);
                          }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div> */}
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-3">
              {/* Publish Settings Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 bg-customorange/10 rounded">
                    <Icon
                      icon="material-symbols:publish"
                      className="w-4 h-4 text-customorange"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Publish Settings
                  </h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formik.values.status}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.validateField("status");
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-customorange focus:border-transparent text-sm"
                    >
                      <option value="draft">📝 Draft</option>
                      <option value="published">🚀 Published</option>
                      <option value="archived">📦 Archived</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-xs font-medium text-gray-900">
                        Featured Blog
                      </p>
                      <p className="text-xs text-gray-500">Show prominently</p>
                    </div>
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formik.values.isFeatured}
                      onChange={formik.handleChange}
                      className="h-4 w-4 text-customorange focus:ring-customorange border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Tags Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 bg-customorange/10 rounded">
                    <Icon
                      icon="material-symbols:tag"
                      className="w-4 h-4 text-customorange"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Tags</h3>
                </div>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-customorange focus:border-transparent text-sm"
                    placeholder="Add tag..."
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={addTag}
                    className="bg-customorange hover:bg-customorangedark px-2"
                  >
                    <Icon icon="material-symbols:add" className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formik.values.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-customorange/10 text-customorange border border-customorange/20"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-customorange hover:text-customorangedark"
                      >
                        <Icon
                          icon="material-symbols:close"
                          className="w-2.5 h-2.5"
                        />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Categories Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 bg-customorange/10 rounded">
                    <Icon
                      icon="material-symbols:category"
                      className="w-4 h-4 text-customorange"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Categories
                  </h3>
                </div>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addCategory())
                    }
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-customorange focus:border-transparent text-sm"
                    placeholder="Add category..."
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={addCategory}
                    className="bg-customorange hover:bg-customorangedark px-2"
                  >
                    <Icon icon="material-symbols:add" className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formik.values.categories.map((category, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      {category}
                      <button
                        type="button"
                        onClick={() => removeCategory(category)}
                        className="ml-1 text-blue-700 hover:text-blue-900"
                      >
                        <Icon
                          icon="material-symbols:close"
                          className="w-2.5 h-2.5"
                        />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Video Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 bg-customorange/10 rounded">
                    <Icon
                      icon="material-symbols:video-library"
                      className="w-4 h-4 text-customorange"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-customorange/10 rounded">
                <Icon
                  icon="material-symbols:search"
                  className="w-4 h-4 text-customorange"
                />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">
                SEO Settings
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  SEO Title
                </label>
                <input
                  type="text"
                  name="metadata.seoTitle"
                  value={formik.values.metadata.seoTitle}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-customorange focus:border-transparent text-sm"
                  placeholder="SEO optimized title..."
                  maxLength={60}
                />
                <span className="text-xs text-gray-400 mt-1 block">
                  {formik.values.metadata.seoTitle.length}/60 characters
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Canonical URL (Auto-generated)
                </label>
                <input
                  type="url"
                  name="metadata.canonicalUrl"
                  value={formik.values.metadata.canonicalUrl}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-600 text-sm"
                  placeholder="Will be generated from slug"
                />
                {formik.touched.metadata?.canonicalUrl &&
                  formik.errors.metadata?.canonicalUrl && (
                    <p className="mt-1 text-xs text-red flex items-center gap-1">
                      <Icon icon="material-symbols:error" className="w-3 h-3" />
                      {formik.errors.metadata.canonicalUrl}
                    </p>
                  )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  SEO Description
                </label>
                <textarea
                  name="metadata.seoDescription"
                  value={formik.values.metadata.seoDescription}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-customorange focus:border-transparent resize-none text-sm"
                  placeholder="SEO meta description..."
                  maxLength={160}
                />
                <span className="text-xs text-gray-400 mt-1 block">
                  {formik.values.metadata.seoDescription.length}/160 characters
                </span>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  SEO Keywords
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addKeyword())
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-customorange focus:border-transparent text-sm"
                    placeholder="Add SEO keyword..."
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={addKeyword}
                    className="bg-customorange hover:bg-customorangedark px-2"
                  >
                    <Icon icon="material-symbols:add" className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formik.values.metadata.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1 text-green-700 hover:text-green-900"
                      >
                        <Icon
                          icon="material-symbols:close"
                          className="w-2.5 h-2.5"
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
