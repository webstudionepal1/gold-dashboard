import React, { useState, useRef } from "react"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Breadcrumb } from "../../../components/global/Breadcrumb"

// Custom Input Component
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { error?: string }>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DF8D28] focus:border-transparent ${
            error ? "border-red-500" : ""
          } ${className}`}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    )
  },
)
Input.displayName = "Input"

// Custom Button Component
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline" | "ghost" | "link"
  }
>(({ className, variant = "default", children, ...props }, ref) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "outline":
        return "border border-gray-300 text-gray-700 hover:bg-gray-50"
      case "ghost":
        return "bg-transparent hover:bg-gray-100 text-gray-700"
      case "link":
        return "bg-transparent underline text-[#DF8D28] hover:text-[#C77E23]"
      default:
        return "bg-[#DF8D28] text-white hover:bg-[#C77E23]"
    }
  }

  return (
    <button
      className={`px-4 py-2 rounded-md font-medium transition-colors ${getVariantClasses()} ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})
Button.displayName = "Button"

// Custom Checkbox Component
const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    onCheckedChange?: (checked: boolean) => void
  }
>(({ className, onCheckedChange, checked, ...props }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onCheckedChange) {
      onCheckedChange(e.target.checked)
    }
  }

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        className={`h-4 w-4 rounded border-gray-300 text-[#DF8D28] focus:ring-[#DF8D28] ${className}`}
        ref={ref}
        checked={checked}
        onChange={handleChange}
        {...props}
      />
    </div>
  )
})
Checkbox.displayName = "Checkbox"

interface CustomerFormData {
  fullName: string
  email: string
  phoneNumber: string
  address: string
  username: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

interface AddCustomerFormProps {
  onSubmit: (data: CustomerFormData, profileImage: File | null) => void
  onCancel: () => void
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    username: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })

  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeTerms: checked }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    setProfileImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData, profileImage)
  }

  return (
    <div className="container mx-auto px-4 py-6 ">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold  text-gray-800 mb-6">Add New Customer</h1>
        <div className="flex items-center mb-6 ">
          <Breadcrumb
        className="mb-6"
        items={[
          {
            label: "Dashboard",
            href: "/dashboard",
            icon: "mdi:home"
          },
          {
            label: "Customers",
            href: "/customer/customer-list",
          },
          {
            label: "Add New Customer"
            // Last item has no link/handler
          }
        ]}
      />
        </div>

      </div>




      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 border border-[#E5F0FF]">
            {/* General Information */}
            <div className="mb-6 ">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">General Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+977 8273277237"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="295 Plymouth Street, Halifax MA 2338"
                  />
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="john_doe@outlook.com"
                      className="pr-10"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Icon icon="mdi:at" className="text-gray-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••••••"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} className="text-gray-400" />
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••••••"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Icon icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Terms and Conditions</h2>
              <div className="flex items-center space-x-2">
                <Checkbox id="agreeTerms" checked={formData.agreeTerms} onCheckedChange={handleCheckboxChange} />
                <label
                  htmlFor="agreeTerms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree the{" "}
                  <a href="#" className="text-[#DF8D28] hover:underline">
                    terms and conditions
                  </a>
                  .
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>

        {/* Profile Photo Upload */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Upload Profile Photo</h2>
            <div
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center ${
                imagePreview ? "border-[#DF8D28]" : "border-gray-300"
              }`}
            >
              {!imagePreview ? (
                <>
                  <div className="mb-4 text-gray-400">
                    <Icon fontSize={50} icon="mdi:cloud-upload"  />
                  </div>
                  <p className="text-sm text-gray-500 text-center mb-2">JPG, PNG, PDF and MP3 formats up to 10 MB</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept=".jpg,.jpeg,.png,.pdf,.mp3"
                    className="hidden"
                  />
                  <Button type="button" variant="outline" onClick={handleBrowseClick} className="mt-2">
                    Browse File
                  </Button>
                </>
              ) : (
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1 z-10"
                  >
                    <Icon icon="mdi:close" width={16} height={16} />
                  </button>
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Profile Preview"
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddCustomerForm