import React, { useState } from "react";
import { InputField } from "../../../../components/shared/form_components/InputField";
import { DropdownField } from "../../../../components/shared/form_components/Dropdown";

interface DiscountFields {
  product: string;
  type: string;
  discount: string;
  startDate: string;
  endDate: string;
}

interface IndividualDiscountFormProps {
  closeModal: () => void;
  initialValues?: DiscountFields[];
  mode?: "create" | "edit";
}

export const IndividualDiscountForm = ({
  closeModal,
  initialValues,
  mode = "create",
}: IndividualDiscountFormProps) => {
  const [discountFields, setDiscountFields] = useState<DiscountFields[]>(
    initialValues?.length
      ? initialValues
      : [
          {
            product: "",
            type: "",
            discount: "",
            startDate: "",
            endDate: "",
          },
        ]
  );

  const updateDiscountField = (
    index: number,
    field: keyof DiscountFields,
    value: string
  ) => {
    const updatedFields = [...discountFields];
    updatedFields[index][field] = value;
    setDiscountFields(updatedFields);
  };

  const addMoreFields = () => {
    setDiscountFields([
      ...discountFields,
      {
        product: "",
        type: "",
        discount: "",
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const deleteDiscountField = (index: number) => {
    if (discountFields.length === 1) return; // Prevent deleting the last one
    const updatedFields = discountFields.filter((_, i) => i !== index);
    setDiscountFields(updatedFields);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Discounts:", discountFields);
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {discountFields.map((_, index) => (
        <div
          key={index}
          className="relative border-b border-[#dedde2] pb-4 flex flex-col gap-4 bg-white p-4 rounded-md shadow-sm"
        >
          {/* Remove button */}
          {discountFields.length > 1 && (
            <button
              type="button"
              onClick={() => deleteDiscountField(index)}
              className="absolute top-2 right-2 text-red-500 hover:underline text-sm"
            >
              Remove
            </button>
          )}

          <InputField
            label="Product"
            value={discountFields[index].product}
            onChange={(e) =>
              updateDiscountField(index, "product", e.target.value)
            }
            placeholder="e.g. Holiday Sale"
          />

          <div className="flex gap-4 w-full">
            <div className="w-1/2">
              <DropdownField
                label="Type"
                options={[
                  { value: "fixed", label: "Fixed" },
                  { value: "percentage", label: "Percentage" },
                ]}
                value={discountFields[index].type}
                onChange={(e) =>
                  updateDiscountField(index, "type", e.target.value)
                }
                inputClassname="w-full"
              />
            </div>

            <div className="w-1/2">
              <DropdownField
                label="Discount"
                options={[
                  { value: "shipping", label: "Shipping" },
                  { value: "product", label: "Product" },
                ]}
                value={discountFields[index].discount}
                onChange={(e) =>
                  updateDiscountField(index, "discount", e.target.value)
                }
                inputClassname="w-full"
              />
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <div className="w-1/2">
              <InputField
                label="Start Date"
                type="date"
                value={discountFields[index].startDate}
                onChange={(e) =>
                  updateDiscountField(index, "startDate", e.target.value)
                }
              />
            </div>

            <div className="w-1/2">
              <InputField
                label="End Date"
                type="date"
                value={discountFields[index].endDate}
                onChange={(e) =>
                  updateDiscountField(index, "endDate", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addMoreFields}
        className="bg-[#f7e8c9] px-3 py-2 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 w-fit"
      >
        + Add More
      </button>

      <div className="flex items-center gap-3 pt-4">
        <button
          type="button"
          onClick={closeModal}
          className="bg-[#c9c9c9] py-2 px-6 rounded w-full text-base hover:scale-105 transition-transform"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="bg-[#df8d29] text-white py-2 px-6 rounded w-full text-base hover:scale-105 transition-transform"
        >
          {mode === "edit" ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};
