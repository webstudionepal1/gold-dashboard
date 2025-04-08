import { useForm } from "@tanstack/react-form";
import { DropdownField } from "../../../../components/shared/form_components/Dropdown";
import { useEffect, useState } from "react";

// zod
import { z } from "zod";
import { InputField } from "../../../../components/shared/form_components/InputField";

const emptyDiscountGroup = {
  category: "",
  sub_category: "",
  type: "",
  discount: "",
  start_date: "",
  end_date: "",
};

const MIN_DATE = new Date("1970-01-01");

const individualDiscountSchema = z.object({
  product: z.string().min(1, "Product is required"),
  type: z.string().min(1, "Type is required"),
  discount: z.string().min(1, "Discount is required"),
  start_date: z
    .string()
    .min(1, "Start Date is required")
    .refine((val) => new Date(val) >= MIN_DATE, {
      message: "Start Date cannot be earlier than 1970-01-01",
    }),
  end_date: z
    .string()
    .min(1, "End Date is required")
    .refine((val) => new Date(val) >= MIN_DATE, {
      message: "End Date cannot be earlier than 1970-01-01",
    }),
});
interface Iinitial {
  product?: string;
  type?: string;
  discount?: string;
  start_date?: string;
  end_date?: string;
  [key: string]: any;
}

interface individualDiscountFormProps {
  closeModal: () => void;
  initialValues?: Iinitial;
  onSubmit: (data: Iinitial) => void;
  mode: string;
}
export const IndividualDiscountForm: React.FC<individualDiscountFormProps> = ({
  closeModal,
  initialValues = {
    product: "",
    type: "",
    discount: "",
    start_date: "",
    end_date: "",
  },
  onSubmit,
  mode,
}) => {
  const { product, type, discount, start_date, end_date } = initialValues;
  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: individualDiscountSchema,
    },
    onSubmit: async (data) => {
      await onSubmit(data);
      closeModal();
    },
  });

  useEffect(() => {
    form.reset();
  }, [product, type, discount, start_date, end_date]);

  const isEditing = initialValues.product !== "" || initialValues.type !== "";

  const [isAddMoreClicked, setIsAddMoreClicked] = useState(false);
  const [discountGroups, setDiscountGroups] = useState<
    (typeof emptyDiscountGroup)[]
  >([]);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="px-10 py-6 flex flex-col gap-8"
    >
      <p className="text-lg font-bold text-center text-[#1a1336]">
        {isEditing ? "Edit Attribute" : "Add Attribute"}
      </p>

      <section className="flex flex-col gap-6 w-full">
        <div>
          <form.Field
            name="product"
            validators={{
              onChange: ({ value }) => {
                const result =
                  individualDiscountSchema.shape.product.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0].message;
              },
            }}
          >
            {(field) => (
              <div className="w-full">
                <InputField
                  label="Product"
                  required
                  placeholder="e.g Christmas Sale"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red  mt-1">
                    {typeof field.state.meta.errors[0] === "string"
                      ? field.state.meta.errors[0]
                      : (field.state.meta.errors[0] as any)?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>
        <div className="border-b border-[#dedde2] w-full mb-2 "></div>

        <div className="flex items-center gap-4 w-full">
          <form.Field
            name="type"
            validators={{
              onChange: ({ value }) => {
                const result =
                  individualDiscountSchema.shape.type.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0].message;
              },
            }}
          >
            {(field) => (
              <div className="w-full">
                <DropdownField
                  label="Type"
                  required
                  options={[
                    { value: "Round", label: "Round" },
                    { value: "Square", label: "Square" },
                    { value: "Oval", label: "Oval" },
                  ]}
                  firstInput="Select"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  inputClassname="w-full"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red mt-1">
                    {typeof field.state.meta.errors[0] === "string"
                      ? field.state.meta.errors[0]
                      : (field.state.meta.errors[0] as any)?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="discount"
            validators={{
              onChange: ({ value }) => {
                const result =
                  individualDiscountSchema.shape.discount.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0].message;
              },
            }}
          >
            {(field) => (
              <div className="w-full">
                <DropdownField
                  label="Discount"
                  required
                  options={[
                    { value: "15%", label: "15%" },
                    { value: "25%", label: "25%" },
                    { value: "30%", label: "30%" },
                  ]}
                  firstInput="Enter Discount"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  inputClassname="w-full"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red mt-1">
                    {typeof field.state.meta.errors[0] === "string"
                      ? field.state.meta.errors[0]
                      : (field.state.meta.errors[0] as any)?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>

        <div className="border-b border-[#dedde2] w-full"></div>

        <div className="flex items-center gap-4">
          <form.Field
            name="start_date"
            validators={{
              onChange: ({ value }) => {
                const result =
                  individualDiscountSchema.shape.start_date.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0].message;
              },
            }}
          >
            {(field) => (
              <div className="w-full">
                <InputField
                  label="Start Date"
                  type="date"
                  required
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red  mt-1">
                    {typeof field.state.meta.errors[0] === "string"
                      ? field.state.meta.errors[0]
                      : (field.state.meta.errors[0] as any)?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="end_date"
            validators={{
              onChange: ({ value }) => {
                const result =
                  individualDiscountSchema.shape.end_date.safeParse(value);

                return result.success
                  ? undefined
                  : result.error.errors[0].message;
              },
            }}
          >
            {(field) => (
              <div className="w-full">
                <InputField
                  label="End Date"
                  type="date"
                  min="1970-01-01"
                  readOnly={false}
                  max={new Date().toISOString().split("T")[0]}
                  required
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red  mt-1">
                    {typeof field.state.meta.errors[0] === "string"
                      ? field.state.meta.errors[0]
                      : (field.state.meta.errors[0] as any)?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>
        <div className="border-b border-[#dedde2] w-full mb-2 "></div>

        {discountGroups.map((group, index) => (
          <>
            <div key={index}>
              <div className="flex justify-end items-center underline">
                <button
                  type="button"
                  onClick={() => {
                    const updatedGroups = discountGroups.filter(
                      (_, idx) => idx !== index
                    );
                    setDiscountGroups(updatedGroups);
                  }}
                  className="mt-4 text-red-600"
                >
                  Remove
                </button>
              </div>
              <form.Field
                name="product"
                validators={{
                  onChange: ({ value }) => {
                    const result =
                      individualDiscountSchema.shape.product.safeParse(value);
                    return result.success
                      ? undefined
                      : result.error.errors[0].message;
                  },
                }}
              >
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Product"
                      required
                      placeholder="e.g Christmas Sale"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />

                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red  mt-1">
                        {typeof field.state.meta.errors[0] === "string"
                          ? field.state.meta.errors[0]
                          : (field.state.meta.errors[0] as any)?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>
            <div className="border-b border-[#dedde2] w-full mb-2 "></div>

            <div className="flex items-center gap-4 w-full">
              <form.Field
                name="type"
                validators={{
                  onChange: ({ value }) => {
                    const result =
                      individualDiscountSchema.shape.type.safeParse(value);
                    return result.success
                      ? undefined
                      : result.error.errors[0].message;
                  },
                }}
              >
                {(field) => (
                  <div className="w-full">
                    <DropdownField
                      label="Type"
                      required
                      options={[
                        { value: "Round", label: "Round" },
                        { value: "Square", label: "Square" },
                        { value: "Oval", label: "Oval" },
                      ]}
                      firstInput="Select"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      inputClassname="w-full"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red mt-1">
                        {typeof field.state.meta.errors[0] === "string"
                          ? field.state.meta.errors[0]
                          : (field.state.meta.errors[0] as any)?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="discount"
                validators={{
                  onChange: ({ value }) => {
                    const result =
                      individualDiscountSchema.shape.discount.safeParse(value);
                    return result.success
                      ? undefined
                      : result.error.errors[0].message;
                  },
                }}
              >
                {(field) => (
                  <div className="w-full">
                    <DropdownField
                      label="Discount"
                      required
                      options={[
                        { value: "15%", label: "15%" },
                        { value: "25%", label: "25%" },
                        { value: "30%", label: "30%" },
                      ]}
                      firstInput="Enter Discount"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      inputClassname="w-full"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red mt-1">
                        {typeof field.state.meta.errors[0] === "string"
                          ? field.state.meta.errors[0]
                          : (field.state.meta.errors[0] as any)?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            <div className="border-b border-[#dedde2] w-full"></div>

            <div className="flex items-center gap-4">
              <form.Field
                name="start_date"
                validators={{
                  onChange: ({ value }) => {
                    const result =
                      individualDiscountSchema.shape.start_date.safeParse(
                        value
                      );
                    return result.success
                      ? undefined
                      : result.error.errors[0].message;
                  },
                }}
              >
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Start Date"
                      type="date"
                      required
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />

                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red  mt-1">
                        {typeof field.state.meta.errors[0] === "string"
                          ? field.state.meta.errors[0]
                          : (field.state.meta.errors[0] as any)?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="end_date"
                validators={{
                  onChange: ({ value }) => {
                    const result =
                      individualDiscountSchema.shape.end_date.safeParse(value);

                    return result.success
                      ? undefined
                      : result.error.errors[0].message;
                  },
                }}
              >
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="End Date"
                      type="date"
                      min="1970-01-01"
                      readOnly={false}
                      max={new Date().toISOString().split("T")[0]}
                      required
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />

                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red  mt-1">
                        {typeof field.state.meta.errors[0] === "string"
                          ? field.state.meta.errors[0]
                          : (field.state.meta.errors[0] as any)?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            <div className="border-b border-[#dedde2] w-full mb-2 "></div>
          </>
        ))}

        <div>
          <button
            type="button"
            onClick={() =>
              setDiscountGroups((prev) => [...prev, { ...emptyDiscountGroup }])
            }
            className="px-3 py-2 bg-[#f7e8ca] rounded-lg font-semibold transition-transform duration-200 ease-in-out hover:scale-105 "
          >
            Add More
          </button>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={closeModal}
            className="w-full bg-[#c9c9c9] text-[#1a1336] font-semibold py-2 rounded-md hover:scale-105 transition-transform"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full bg-[#d49327] text-white font-semibold py-2 rounded-md hover:scale-105 transition-transform"
          >
            {isEditing ? "Update" : "Create"}
          </button>
        </div>
      </section>
    </form>
  );
};
