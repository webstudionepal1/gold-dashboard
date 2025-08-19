import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Plus, X, Search } from "lucide-react";
import {
  useCreateGiftMutation,
  useUpdateGiftMutation,
  IFetchGift,
} from "../../../server/api/giftHooks";
import { IFetchProduct } from "../../../server/api/productHooks";
import FileDropInput from "../../shared/form_components/FileDropInput";
import { InputField } from "../../shared/form_components/InputField";
import { TextareaField } from "../../shared/form_components/TextArea";
import { DropdownField } from "../../shared/form_components/Dropdown";
// Removed uploadFiles import as we're now using FormData directly

interface GiftFormProps {
  gift?: IFetchGift;
  onSuccess: () => void;
  onCancel: () => void;
  products: IFetchProduct[];
}

interface GiftProductForm {
  product: string;
  quantity: number;
  isOptional: boolean;
  alternativeProducts: string[];
}

export const occassion = [
  "Wedding",
  "Anniversary",
  "Birthday",
  "Valentine",
  "Christmas",
  "New Year",
  "Graduation",
  "Mother's Day",
  "Father's Day",
  "Other",
];

// Validation schema
const giftValidationSchema = Yup.object({
  name: Yup.string()
    .required("Gift name is required")
    .max(100, "Gift name cannot exceed 100 characters")
    .trim(),
  description: Yup.string().max(
    2000,
    "Description cannot exceed 2000 characters"
  ),
  type: Yup.string()
    .oneOf(["gift", "package"], "Invalid type")
    .required("Type is required"),
  pricingType: Yup.string()
    .oneOf(["fixed", "calculated", "discounted"], "Invalid pricing type")
    .required("Pricing type is required"),
  fixedPrice: Yup.number()
    .min(0, "Fixed price cannot be negative")
    .when("pricingType", {
      is: "fixed",
      then: (schema) =>
        schema.required("Fixed price is required for fixed pricing"),
      otherwise: (schema) => schema.notRequired(),
    }),
  discountPercentage: Yup.number()
    .min(0, "Discount percentage cannot be negative")
    .max(100, "Discount percentage cannot exceed 100%"),
  discountAmount: Yup.number().min(0, "Discount amount cannot be negative"),
  category: Yup.string(),
  setCategory: Yup.string(),
  occasion: Yup.string(),
  setType: Yup.string(),
  setTheme: Yup.string(),
  metalType: Yup.string(),
  stoneType: Yup.string(),
  tags: Yup.string(),
  isActive: Yup.boolean(),
  isAvailable: Yup.boolean(),
  stockType: Yup.string()
    .oneOf(["unlimited", "limited", "based_on_products"], "Invalid stock type")
    .required("Stock type is required"),
  totalStock: Yup.number()
    .min(0, "Total stock cannot be negative")
    .when("stockType", {
      is: "limited",
      then: (schema) =>
        schema.required("Total stock is required for limited stock"),
      otherwise: (schema) => schema.notRequired(),
    }),
  featuredImage: Yup.string(),
  slug: Yup.string(),
  visibleAs: Yup.string().required("Visible As is required"),
  weight: Yup.number().min(0, "Weight cannot be negative"),
  isCustomizable: Yup.boolean(),
  allowPartialPurchase: Yup.boolean(),
  minimumOrderQuantity: Yup.number().min(
    1,
    "Minimum order quantity must be at least 1"
  ),
  maximumOrderQuantity: Yup.number()
    .min(1, "Maximum order quantity must be at least 1")
    .test(
      "max-greater-than-min",
      "Maximum quantity must be greater than minimum quantity",
      function (value) {
        const { minimumOrderQuantity } = this.parent;
        return !value || !minimumOrderQuantity || value >= minimumOrderQuantity;
      }
    ),
  priority: Yup.number().min(1, "Priority must be at least 1"),
});

// Form data interface
interface GiftFormData {
  name: string;
  description: string;
  type: "gift" | "package";
  pricingType: "fixed" | "calculated" | "discounted";
  fixedPrice: number;
  discountPercentage: number;
  discountAmount: number;
  category: string;
  setCategory: string;
  occasion: string;
  setType:
    | "necklace_set"
    | "bridal_set"
    | "earring_set"
    | "bracelet_set"
    | "ring_set"
    | "custom"
    | "";
  setTheme: string;
  metalType: string;
  stoneType: string;
  tags: string;
  isActive: boolean;
  isAvailable: boolean;
  stockType: "unlimited" | "limited" | "based_on_products";
  totalStock: number;
  featuredImage: string;
  slug: string;
  visibleAs: string;
  weight: number;
  isCustomizable: boolean;
  allowPartialPurchase: boolean;
  minimumOrderQuantity: number;
  maximumOrderQuantity: number;
  priority: number;
}
const GiftForm: React.FC<GiftFormProps> = ({ gift, onCancel, products }) => {
  const [selectedProducts, setSelectedProducts] = useState<GiftProductForm[]>(
    gift?.products?.map((p) => ({
      product: p.product._id,
      quantity: p.quantity,
      isOptional: p.isOptional,
      alternativeProducts: p.alternativeProducts?.map((alt) => alt._id) || [],
    })) || [
      { product: "", quantity: 1, isOptional: false, alternativeProducts: [] },
    ]
  );
  const [productSearch, setProductSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState<number | null>(
    null
  );
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize existing images when editing
  useEffect(() => {
    if (gift?.images) {
      // For editing mode, we'll show existing images in the FileDropInput
      // The component will handle displaying them
    }
  }, [gift]);

  const createGiftMutation = useCreateGiftMutation();
  const updateGiftMutation = useUpdateGiftMutation();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Initial values for Formik
  const initialValues: GiftFormData = {
    name: gift?.name || "",
    description: gift?.description || "",
    type: gift?.type || "gift",
    pricingType: gift?.pricingType || "calculated",
    fixedPrice: gift?.fixedPrice || 0,
    discountPercentage: gift?.discountPercentage || 0,
    discountAmount: gift?.discountAmount || 0,
    category: gift?.category || "",
    setCategory: gift?.setCategory || "",
    occasion: gift?.occasion || "",
    setType: gift?.setType || "",
    setTheme: gift?.setTheme || "",
    metalType: gift?.metalType || "",
    stoneType: gift?.stoneType || "",
    tags: gift?.tags?.join(", ") || "",
    isActive: gift?.isActive ?? true,
    isAvailable: gift?.isAvailable ?? true,
    stockType: gift?.stockType || "unlimited",
    totalStock: gift?.totalStock || 0,
    featuredImage: gift?.featuredImage || "",
    slug: gift?.slug || "",
    visibleAs: Array.isArray(gift?.visibleAs)
      ? gift?.visibleAs.length > 0
        ? gift?.visibleAs[0]
        : ""
      : gift?.visibleAs || "",
    weight: gift?.weight || 0,
    isCustomizable: gift?.isCustomizable ?? false,
    allowPartialPurchase: gift?.allowPartialPurchase ?? false,
    minimumOrderQuantity: gift?.minimumOrderQuantity || 1,
    maximumOrderQuantity: gift?.maximumOrderQuantity || 100,
    priority: gift?.priority || 1,
  };

  // Formik form
  const formik = useFormik({
    initialValues,
    validationSchema: giftValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values: GiftFormData) => {
      try {
        setIsUploading(true);

        // Create FormData object
        const formData = new FormData();

        // Append basic fields
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("type", values.type);
        formData.append("pricingType", values.pricingType);
        formData.append("isActive", values.isActive.toString());
        formData.append("isAvailable", values.isAvailable.toString());
        formData.append("stockType", values.stockType);
        formData.append("visibleAs", values.visibleAs);
        formData.append("isCustomizable", values.isCustomizable.toString());
        formData.append(
          "allowPartialPurchase",
          values.allowPartialPurchase.toString()
        );

        // Append optional fields only if they have values
        if (values.fixedPrice)
          formData.append("fixedPrice", values.fixedPrice.toString());
        if (values.discountPercentage)
          formData.append(
            "discountPercentage",
            values.discountPercentage.toString()
          );
        if (values.discountAmount)
          formData.append("discountAmount", values.discountAmount.toString());
        if (values.category) formData.append("category", values.category);
        if (values.setCategory)
          formData.append("setCategory", values.setCategory);
        if (values.occasion) formData.append("occasion", values.occasion);
        if (values.setType) formData.append("setType", values.setType);
        if (values.setTheme) formData.append("setTheme", values.setTheme);
        if (values.metalType) formData.append("metalType", values.metalType);
        if (values.stoneType) formData.append("stoneType", values.stoneType);
        if (values.totalStock)
          formData.append("totalStock", values.totalStock.toString());
        if (values.featuredImage)
          formData.append("featuredImage", values.featuredImage);
        if (values.slug) formData.append("slug", values.slug);
        if (values.weight) formData.append("weight", values.weight.toString());
        if (values.minimumOrderQuantity)
          formData.append(
            "minimumOrderQuantity",
            values.minimumOrderQuantity.toString()
          );
        if (values.maximumOrderQuantity)
          formData.append(
            "maximumOrderQuantity",
            values.maximumOrderQuantity.toString()
          );
        if (values.priority)
          formData.append("priority", values.priority.toString());

        // Handle tags
        if (values.tags) {
          const tags = values.tags
            .split(",")
            .map((tag: string) => tag.trim())
            .filter(Boolean);
          tags.forEach((tag: string, index: number) => {
            formData.append(`tags[${index}]`, tag);
          });
        }

        // Handle products
        const validProducts = selectedProducts.filter((p) => p.product);
        validProducts.forEach((product, index) => {
          formData.append(`products[${index}][product]`, product.product);
          formData.append(
            `products[${index}][quantity]`,
            product.quantity.toString()
          );
          formData.append(
            `products[${index}][isOptional]`,
            product.isOptional.toString()
          );

          product.alternativeProducts
            .filter(Boolean)
            .forEach((altProduct, altIndex) => {
              formData.append(
                `products[${index}][alternativeProducts][${altIndex}]`,
                altProduct
              );
            });
        });

        // Handle new images
        selectedImages.forEach((file) => {
          formData.append("images", file);
        });

        // Handle existing images for updates
        if (gift?.images) {
          const currentExistingImages = gift.images;
          if (Array.isArray(currentExistingImages)) {
            currentExistingImages.forEach((imageUrl: string, index: number) => {
              formData.append(`existingImages[${index}]`, imageUrl);
            });
          }
        }

        if (gift) {
          await updateGiftMutation.mutateAsync({
            id: gift._id,
            data: formData,
          });
        } else {
          await createGiftMutation.mutateAsync(formData);
        }
        onCancel();
      } catch (error) {
        console.error("Error saving gift:", error);
      } finally {
        setIsUploading(false);
      }
    },
  });

  const addProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      { product: "", quantity: 1, isOptional: false, alternativeProducts: [] },
    ]);
  };

  const removeProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const updateProduct = (
    index: number,
    field: keyof GiftProductForm,
    value: string | number | boolean | string[]
  ) => {
    const updated = [...selectedProducts];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedProducts(updated);
  };

  const addAlternativeProduct = (productIndex: number, productId: string) => {
    const updated = [...selectedProducts];
    if (!updated[productIndex].alternativeProducts.includes(productId)) {
      updated[productIndex].alternativeProducts.push(productId);
      setSelectedProducts(updated);
    }
  };

  const removeAlternativeProduct = (
    productIndex: number,
    altProductId: string
  ) => {
    const updated = [...selectedProducts];
    updated[productIndex].alternativeProducts = updated[
      productIndex
    ].alternativeProducts.filter((id) => id !== altProductId);
    setSelectedProducts(updated);
  };

  const getProductName = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    return product?.name || "Unknown Product";
  };

  // Helper function to get error message
  const getFieldError = (fieldName: keyof GiftFormData) => {
    return formik.touched[fieldName] && formik.errors[fieldName]
      ? formik.errors[fieldName]
      : undefined;
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <InputField
            label="Gift Name"
            placeholder="Enter gift name"
            required
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="name"
            error={getFieldError("name")}
          />
        </div>

        <div>
          <DropdownField
            label="Type"
            required
            options={[
              { value: "gift", label: "Gift" },
              { value: "package", label: "Package" },
            ]}
            value={formik.values.type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="type"
            error={getFieldError("type")}
          />
        </div>
      </div>

      <div>
        <TextareaField
          label="Description"
          placeholder="Enter gift description"
          rows={3}
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="description"
          error={getFieldError("description")}
        />
      </div>

      {/* Image Upload Section */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Gift Images
        </label>
        <FileDropInput
          multiple={true}
          value={selectedImages}
          onChange={setSelectedImages}
          maxFiles={10}
          accept={{
            "image/*": [".jpeg", ".jpg", ".png", ".webp"],
          }}
          existingFiles={gift?.images}
          existingFileField="images"
        />
        {selectedImages.length > 0 && (
          <div className="text-sm text-gray-600">
            {selectedImages.length} image(s) selected
          </div>
        )}
      </div>

      {/* Occasion and Set Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <DropdownField
            label="Occasion"
            firstInput="Select occasion"
            options={[
              { value: "", label: "Select occasion" },
              ...occassion.map((occasion) => ({
                value: occasion,
                label: occasion,
              })),
            ]}
            value={formik.values.occasion}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="occasion"
            error={getFieldError("occasion")}
          />
        </div>

        <div>
          <DropdownField
            label="Set Type"
            firstInput="Select set type"
            options={[
              { value: "", label: "Select set type" },
              { value: "necklace_set", label: "Necklace Set" },
              { value: "bridal_set", label: "Bridal Set" },
              { value: "earring_set", label: "Earring Set" },
              { value: "bracelet_set", label: "Bracelet Set" },
              { value: "ring_set", label: "Ring Set" },
              { value: "custom", label: "Custom" },
            ]}
            value={formik.values.setType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="setType"
            error={getFieldError("setType")}
          />
        </div>
      </div>

      {/* Products Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Products</h3>
          <button
            type="button"
            onClick={addProduct}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        <div className="space-y-4">
          {selectedProducts.map((selectedProduct, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">
                  Product {index + 1}
                </h4>
                {selectedProducts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="text-red hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Product Selection */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product <span className="text-red">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={
                        selectedProduct.product
                          ? getProductName(selectedProduct.product)
                          : ""
                      }
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                        setShowProductDropdown(index);
                      }}
                      onFocus={() => setShowProductDropdown(index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Search and select product"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>

                  {showProductDropdown === index && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <button
                          key={product._id}
                          type="button"
                          onClick={() => {
                            updateProduct(index, "product", product._id);
                            setShowProductDropdown(null);
                            setProductSearch("");
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">
                            {product.category?.name || "No Category"}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity <span className="text-red">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={selectedProduct.quantity}
                    onChange={(e) =>
                      updateProduct(
                        index,
                        "quantity",
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Optional */}
                <div className="flex items-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedProduct.isOptional}
                      onChange={(e) =>
                        updateProduct(index, "isOptional", e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Optional Product
                    </span>
                  </label>
                </div>
              </div>

              {/* Alternative Products */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alternative Products
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedProduct.alternativeProducts.map((altProductId) => (
                    <span
                      key={altProductId}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                    >
                      {getProductName(altProductId)}
                      <button
                        type="button"
                        onClick={() =>
                          removeAlternativeProduct(index, altProductId)
                        }
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addAlternativeProduct(index, e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Add alternative product</option>
                  {products
                    .filter(
                      (p) =>
                        p._id !== selectedProduct.product &&
                        !selectedProduct.alternativeProducts.includes(p._id)
                    )
                    .map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          {/* <InputField
            label="Discount Percentage"
            type="number"
            min="0"
            max="100"
            step="0.01"
            placeholder="0"
            value={formik.values.discountPercentage}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="discountPercentage"
            error={getFieldError("discountPercentage")}
          /> */}
          <InputField
            label="Discount Percentage"
            type="number"
            min="0"
            max="100"
            step="0.01"
            placeholder="0"
            numberValue={formik.values.discountPercentage}
            onBlur={formik.handleBlur}
            allowNegative={false}
            name="discountPercentage"
            error={getFieldError("discountPercentage")}
            onNumberChange={(value) =>
              formik.setFieldValue("discountPercentage", value)
            }
            clearZeroOnFocus
          />
        </div>

        <div>
          <InputField
            label="Priority"
            type="number"
            min="1"
            value={formik.values.priority}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="priority"
            error={getFieldError("priority")}
          />
        </div>

        <div>
          <DropdownField
            label="Visible As"
            required
            firstInput="Select visibility"
            options={[
              { value: "", label: "Select visibility" },
              { value: "featured", label: "Featured" },
              { value: "bestsellers", label: "Best Sellers" },
              { value: "newarrivals", label: "New Arrivals" },
              { value: "recommended", label: "Recommended" },
              { value: "popular", label: "Popular" },
            ]}
            value={formik.values.visibleAs}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="visibleAs"
            error={getFieldError("visibleAs")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div className="flex items-center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formik.values.isActive}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="isActive"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
        </div>
      </div>

      <div>
        <InputField
          label="Tags (comma-separated)"
          placeholder="e.g., luxury, wedding, gold"
          value={formik.values.tags}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="tags"
          error={getFieldError("tags")}
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={
            createGiftMutation.isPending ||
            updateGiftMutation.isPending ||
            isUploading
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading
            ? "Uploading images..."
            : createGiftMutation.isPending || updateGiftMutation.isPending
            ? "Saving..."
            : gift
            ? "Update Gift"
            : "Create Gift"}
        </button>
      </div>

      {/* Click outside to close dropdown */}
      {showProductDropdown !== null && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowProductDropdown(null)}
        />
      )}
    </form>
  );
};

export default GiftForm;
