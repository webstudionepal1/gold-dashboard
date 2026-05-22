import { useFormik, FieldArray, FormikProvider, FormikErrors } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import { InputField } from "../../../components/shared/form_components/InputField";
import { Button } from "../../../components/shared/form_components/Button";
import {
  useCreatePriceConfiguration,
  useUpdatePriceConfiguration,
} from "@/server/api/priceCalculatorHooks";

interface CalculationRow {
  name: string;
  type: "flat" | "percent";
  value: number;
}

interface FormValues {
  selectedMaterial:
    | "gold"
    | "diamond"
    | "gold+diamond"
    | "gold+stone"
    | "diamond+stone"
    | "";
  transactionType: "buy" | "sell" | "";
  stonePrice?: number; // Moved outside of individual calculations
  incrementCalculations: CalculationRow[];
  decrementCalculations: CalculationRow[];
}

interface StoredConfiguration {
  _id: string;
  type: string;
  for: string;
  stonePrice?: number; // Add this to the stored configuration interface
  incrementalCalculations: Array<{
    name: string;
    type: "percentage" | "flat";
    value: number;
  }>;
  decrementalCalculations: Array<{
    name: string;
    type: "percentage" | "flat";
    value: number;
  }>;
}

// Updated validation schema
const validationSchema = Yup.object({
  selectedMaterial: Yup.string().required("Material type is required"),
  transactionType: Yup.string().required("Transaction type is required"),
  stonePrice: Yup.number().when("selectedMaterial", {
    is: (val: string) => val && val.includes("stone"),
    then: (schema) => schema.min(0, "Stone price must be positive").required("Stone price is required when stone material is selected"),
    otherwise: (schema) => schema.notRequired(),
  }),
  incrementCalculations: Yup.array().of(
    Yup.object({
      name: Yup.string().required("Name is required"),
      type: Yup.string()
        .oneOf(["flat", "percent"])
        .required("Type is required"),
      value: Yup.number()
        .min(0, "Value must be positive")
        .required("Value is required"),
    })
  ),
  decrementCalculations: Yup.array().of(
    Yup.object({
      name: Yup.string().required("Name is required"),
      type: Yup.string()
        .oneOf(["flat", "percent"])
        .required("Type is required"),
      value: Yup.number()
        .min(0, "Value must be positive")
        .required("Value is required"),
    })
  ),
});

const CalculatorIndex = () => {
  const navigate = useNavigate();
  const { mutate, isPending: isCreating } = useCreatePriceConfiguration();
  const { mutate: updatePriceConfiguration, isPending: isUpdating } =
    useUpdatePriceConfiguration();
  const location = useLocation();
  const [editingConfig, setEditingConfig] =
    useState<StoredConfiguration | null>(null);

  // Check if we're on edit route and load session storage data
  const isEdit = location.pathname.includes("/edit");

  // Function to transform stored config to form values
  const transformStoredConfigToFormValues = (
    config: StoredConfiguration
  ): FormValues => {
    // Map material type from stored format to form format
    const materialMapping: Record<string, FormValues["selectedMaterial"]> = {
      Gold: "gold",
      Diamond: "diamond",
      "Gold + Diamond": "gold+diamond",
      "Gold + Stone": "gold+stone",
      "Diamond + Stone": "diamond+stone",
    };

    // Transform calculations from stored format to form format
    const transformCalculations = (
      calculations: StoredConfiguration["incrementalCalculations"]
    ): CalculationRow[] => {
      return calculations.map((calc) => ({
        name: calc.name,
        type: (calc.type.toLowerCase() === "percentage" ? "percent" : "flat") as "flat" | "percent",
        value: calc.value,
      }));
    };

    return {
      selectedMaterial: materialMapping[config.type] || "",
      transactionType: config.for.toLowerCase() as "buy" | "sell",
      stonePrice: config.stonePrice || 0,
      incrementCalculations: transformCalculations(
        config.incrementalCalculations || []
      ),
      decrementCalculations: transformCalculations(
        config.decrementalCalculations || []
      ),
    };
  };

  // Load editing data from session storage
  useEffect(() => {
    if (isEdit) {
      const storedData = sessionStorage.getItem("editingConfiguration");
      if (storedData) {
        try {
          const parsedConfig: StoredConfiguration = JSON.parse(storedData);
          setEditingConfig(parsedConfig);
        } catch (error) {
          console.error("Error parsing stored configuration:", error);
          // Clear invalid data
          sessionStorage.removeItem("editingConfiguration");
        }
      }
    } else {
      // Clear editing config when not in edit mode
      setEditingConfig(null);
    }
  }, [isEdit]);

  // Set initial values based on edit mode
  const getInitialValues = (): FormValues => {
    if (isEdit && editingConfig) {
      return transformStoredConfigToFormValues(editingConfig);
    }
    return {
      selectedMaterial: "",
      transactionType: "",
      stonePrice: 0,
      incrementCalculations: [],
      decrementCalculations: [],
    };
  };

  const initialValues = getInitialValues();

  const materialOptions = [
    { value: "", label: "Select Material" },
    { value: "gold", label: "Gold" },
    { value: "diamond", label: "Diamond" },
    { value: "gold+diamond", label: "Gold + Diamond" },
    { value: "gold+stone", label: "Gold + Stone" },
    { value: "diamond+stone", label: "Diamond + Stone" },
  ];

  const transactionTypeOptions = [
    { value: "", label: "Select Type" },
    { value: "buy", label: "Buy" },
    { value: "sell", label: "Sell" },
  ];

  const chargeTypeOptions = [
    { value: "flat", label: "Flat" },
    { value: "percent", label: "Percent" },
  ];

  const isSubmitting = isCreating || isUpdating;

  // Helper function to check if stone is selected
  const hasStone = (material: string) => material.includes("stone");

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      // Transform calculations to match backend schema
      const transformCalculations = (calculations: CalculationRow[]) => {
        return calculations.map(calc => ({
          name: calc.name,
          value: calc.value,
          type: calc.type === "percent" ? "percentage" : "flat", // Convert "percent" to "percentage"
        }));
      };

      const formattedData = {
        type: values.selectedMaterial,
        for: values.transactionType,
        ...(hasStone(values.selectedMaterial) && values.stonePrice && { stonePrice: values.stonePrice }),
        incrementalCalculations: transformCalculations(values.incrementCalculations),
        decrementalCalculations: transformCalculations(values.decrementCalculations),
      };

      console.log("Formatted data being sent:", JSON.stringify(formattedData, null, 2));

      if (isEdit && editingConfig) {
        // Update existing configuration
        updatePriceConfiguration(
          {
            entityData: formattedData,
            _id: editingConfig._id,
          },
          {
            onSuccess: () => {
              sessionStorage.removeItem("editingConfiguration");
              navigate("/settings/calculator");
            },
            onError: (error) => {
              console.error("Error updating configuration:", error);
            },
          }
        );
      } else {
        mutate(formattedData, {
          onSuccess: () => {
            formik.resetForm();
            navigate("/settings/calculator");
          },
          onError: (error) => {
            console.error("Error creating configuration:", error);
          },
        });
      }
    },
    enableReinitialize: true,
  });

  const handleResetAll = () => {
    formik.setFieldValue("incrementCalculations", []);
    formik.setFieldValue("decrementCalculations", []);
    if (hasStone(formik.values.selectedMaterial)) {
      formik.setFieldValue("stonePrice", 0);
    }
  };

  const renderCalculationSection = (sectionType: "increment" | "decrement") => {
    const fieldName =
      sectionType === "increment"
        ? "incrementCalculations"
        : "decrementCalculations";
    const calculations = formik.values[fieldName];
    const sectionTitle =
      sectionType === "increment"
        ? "Increment Calculations"
        : "Decrement Calculations";

    return (
      <div className="bg-white rounded-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
            <Icon
              icon={
                sectionType === "increment"
                  ? "material-symbols:add-circle"
                  : "material-symbols:remove-circle"
              }
              className={`w-4 h-4 ${
                sectionType === "increment" ? "text-green-600" : "text-red-600"
              }`}
            />
            {sectionTitle}
          </h3>
          <FieldArray name={fieldName}>
            {({ push }) => (
              <Button
                type="button"
                onClick={() =>
                  push({
                    name: "",
                    type: "flat",
                    value: 0,
                  })
                }
                variant="primary"
                size="xs"
                icon="material-symbols:add"
              >
                Add Row
              </Button>
            )}
          </FieldArray>
        </div>

        <FieldArray name={fieldName}>
          {({ remove }) => (
            <>
              {calculations.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Icon
                    icon="material-symbols:calculate"
                    className="w-8 h-8 mx-auto mb-1 opacity-50"
                  />
                  <p className="text-sm">No calculations added yet</p>
                  <p className="text-xs">
                    Click "Add Row" to start adding calculations
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {calculations.map((row, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 gap-3 p-3 bg-gray-50 rounded-sm md:grid-cols-4"
                    >
                      <div className="md:col-span-1">
                        <InputField
                          label={index === 0 ? "Name" : ""}
                          name={`${fieldName}.${index}.name`}
                          placeholder="Enter calculation name"
                          value={formik.values[fieldName][index]?.name || ""}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          icon="material-symbols:edit"
                          helperText={
                            index === 0
                              ? "Descriptive name for this calculation"
                              : undefined
                          }
                          error={
                            formik.touched[fieldName]?.[index]?.name &&
                            (
                              formik.errors[fieldName]?.[
                                index
                              ] as FormikErrors<CalculationRow>
                            )?.name
                              ? (
                                  formik.errors[fieldName]?.[
                                    index
                                  ] as FormikErrors<CalculationRow>
                                )?.name
                              : undefined
                          }
                        />
                      </div>

                      <div className="md:col-span-1">
                        <DropdownField
                          label={index === 0 ? "Type" : ""}
                          name={`${fieldName}.${index}.type`}
                          options={chargeTypeOptions}
                          value={
                            formik.values[fieldName][index]?.type || "flat"
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          icon="material-symbols:category"
                          helperText={
                            index === 0
                              ? "Choose calculation method"
                              : undefined
                          }
                          error={
                            formik.touched[fieldName]?.[index]?.type &&
                            (
                              formik.errors[fieldName]?.[
                                index
                              ] as FormikErrors<CalculationRow>
                            )?.type
                              ? (
                                  formik.errors[fieldName]?.[
                                    index
                                  ] as FormikErrors<CalculationRow>
                                )?.type
                              : undefined
                          }
                        />
                      </div>

                      <div className="md:col-span-1">
                        <InputField
                          label={index === 0 ? "Value" : ""}
                          name={`${fieldName}.${index}.value`}
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={
                            formik.values[fieldName][
                              index
                            ]?.value?.toString() || "0"
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          icon={
                            row.type === "percent"
                              ? "material-symbols:percent"
                              : "material-symbols:attach-money"
                          }
                          helperText={
                            index === 0
                              ? row.type === "percent"
                                ? "Percentage value"
                                : "Fixed amount"
                              : undefined
                          }
                          error={
                            formik.touched[fieldName]?.[index]?.value &&
                            (
                              formik.errors[fieldName]?.[
                                index
                              ] as FormikErrors<CalculationRow>
                            )?.value
                              ? (
                                  formik.errors[fieldName]?.[
                                    index
                                  ] as FormikErrors<CalculationRow>
                                )?.value
                              : undefined
                          }
                        />
                      </div>

                      <div className="md:col-span-1 flex items-end">
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          variant="danger"
                          size="xs"
                          icon="material-symbols:delete"
                          title="Remove row"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </FieldArray>
      </div>
    );
  };

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Compact Header with Material Selection */}
        <div className="bg-white rounded-sm border border-gray-200 p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Icon
                  icon={
                    isEdit ? "material-symbols:edit" : "material-symbols:add"
                  }
                  className="w-5 h-5 text-amber-600"
                />
                {isEdit ? "Edit" : "Create"} Price Calculator
                {formik.values.selectedMaterial && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span
                      className={`text-sm font-medium ${
                        formik.values.selectedMaterial.includes("gold")
                          ? "text-yellow-600"
                          : formik.values.selectedMaterial.includes("diamond")
                          ? "text-blue-600"
                          : "text-purple-600"
                      }`}
                    >
                      {formik.values.selectedMaterial
                        .split("+")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" + ")}
                    </span>
                  </>
                )}
                {formik.values.transactionType && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span
                      className={`text-sm font-medium ${
                        formik.values.transactionType === "buy"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formik.values.transactionType.charAt(0).toUpperCase() +
                        formik.values.transactionType.slice(1)}
                    </span>
                  </>
                )}
              </h1>
              <p className="text-gray-600 text-xs mt-1">
                {isEdit && editingConfig
                  ? `Editing configuration for ${editingConfig.type} (${editingConfig.for})`
                  : "Configure pricing calculations with custom increment and decrement rules"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
            <DropdownField
              label="Material Type"
              name="selectedMaterial"
              options={materialOptions}
              value={formik.values.selectedMaterial}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              icon="material-symbols:diamond"
              helperText="Choose the material type for calculations"
              error={
                formik.touched.selectedMaterial &&
                formik.errors.selectedMaterial
                  ? formik.errors.selectedMaterial
                  : undefined
              }
            />
            <DropdownField
              label="Transaction Type"
              name="transactionType"
              options={transactionTypeOptions}
              value={formik.values.transactionType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              icon={
                formik.values.transactionType === "buy"
                  ? "material-symbols:shopping-cart"
                  : formik.values.transactionType === "sell"
                  ? "material-symbols:sell"
                  : "material-symbols:swap-horiz"
              }
              helperText="Choose buy or sell transaction type"
              error={
                formik.touched.transactionType && formik.errors.transactionType
                  ? formik.errors.transactionType
                  : undefined
              }
            />
            
            {/* Stone Price Field - Only show when stone material is selected */}
            {hasStone(formik.values.selectedMaterial) && (
              <InputField
                label="Stone Price"
                name="stonePrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formik.values.stonePrice?.toString() || "0"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                icon="material-symbols:diamond"
                helperText="Base stone price for all calculations"
                error={
                  formik.touched.stonePrice && formik.errors.stonePrice
                    ? formik.errors.stonePrice
                    : undefined
                }
              />
            )}
          </div>
        </div>

        {/* Calculation Sections - Only show when both material and transaction type are selected */}
        {formik.values.selectedMaterial && formik.values.transactionType && (
          <>
            {/* Increment Section */}
            {renderCalculationSection("increment")}

            {/* Decrement Section */}
            {renderCalculationSection("decrement")}

            {/* Summary/Actions */}
            <div className="bg-white rounded-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Calculation Summary
                  </h3>
                  <p className="text-gray-600 text-xs">
                    Total increment rules:{" "}
                    {formik.values.incrementCalculations.length} | Total
                    decrement rules:{" "}
                    {formik.values.decrementCalculations.length}
                    {hasStone(formik.values.selectedMaterial) && (
                      <span className="block mt-1 text-purple-600">
                        💎 Stone price: ${formik.values.stonePrice || 0} (applies to all calculations)
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    icon="material-symbols:refresh"
                    onClick={handleResetAll}
                    disabled={isSubmitting}
                  >
                    Reset All
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    icon="material-symbols:save"
                    disabled={!formik.isValid || isSubmitting}
                    loading={isSubmitting}
                  >
                    {isEdit ? "Update Configuration" : "Save Configuration"}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </form>
    </FormikProvider>
  );
};

export default CalculatorIndex;