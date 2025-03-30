import React, { useState, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

// Interface definitions
interface CustomerFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  username: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface AddCustomerFormProps {
  onSubmit: (data: CustomerFormData, profileImage: File | null) => void;
}

// Reusable Input Component
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { error?: string }
>(({ className, error, ...props }, ref) => (
  <div className="w-full">
    <input
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#DF8D28] ${
        error ? "border-red-500" : "border-gray-300"
      } ${className}`}
      ref={ref}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
));

// Reusable Button Component
const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "outline";
  }
> = ({ variant = "primary", className, children, ...props }) => {
  const variants = {
    primary: "bg-[#DF8D28] text-white hover:bg-[#C77E23]",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    outline: "border border-[#DF8D28] text-[#DF8D28] hover:bg-[#FFF5E9]",
  };

  return (
    <button
      className={`px-4 py-2 rounded-md font-medium transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Main Component
const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    username: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, profileImage);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Form Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Add New Customer</h1>
        </div>

        {/* Main Form Content */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Profile Image Upload */}
          <div className="md:col-span-1">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <Icon icon="mdi:close" className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-gray-400 mb-2">
                    <Icon icon="mdi:cloud-upload" className="w-12 h-12 mx-auto" />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Photo
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">JPEG or PNG, max 5MB</p>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="md:col-span-2">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <Icon
                        icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                        className="text-gray-400"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }))}
                  className="h-4 w-4 text-[#DF8D28] rounded focus:ring-[#DF8D28]"
                />
                <label className="ml-2 text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-[#DF8D28] hover:underline">
                    terms and conditions
                  </a>
                </label>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button type="submit">Create Customer</Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerForm;