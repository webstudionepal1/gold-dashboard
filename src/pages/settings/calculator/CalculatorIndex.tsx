import { useFormik, FieldArray, FormikProvider, FormikErrors } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
  stonePrice?: number;
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
  incrementCalculations: CalculationRow[];
  decrementCalculations: CalculationRow[];
}

interface StoredConfiguration {
  _id: string;
  type: string;
  for: string;
  incrementalCalculations: Array<{
    name: string;
    type: "percentage" | "flat";
    value: number;
    stonePrice?: number;
  }>;
  decrementalCalculations: Array<{
    name: string;
    type: "percentage" | "flat";
    value: number;
    stonePrice?: number;
  }>;
}

// Validation schema
const validationSchema = Yup.object({
  selectedMaterial: Yup.string().required("Material type is required"),
  transactionType: Yup.string().required("Transaction type is required"),
  incrementCalculations: Yup.array().of(
    Yup.object({
      name: Yup.string().required("Name is required"),
      type: Yup.string()
        .oneOf(["flat", "percent"])
        .required("Type is required"),
      value: Yup.number()
        .min(0, "Value must be positive")
        .required("Value is required"),
      stonePrice: Yup.number().min(0, "Stone price must be positive"),
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
      stonePrice: Yup.number().min(0, "Stone price must be positive"),
    })
  ),
});

interface IConfig {
  type: string;
  value: number;
  stonePrice?: number;
}

const CalculatorIndex = () => {
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
        stonePrice: calc.stonePrice || 0,
      }));
    };

    return {
      selectedMaterial: materialMapping[config.type] || "",
      transactionType: config.for.toLowerCase() as "buy" | "sell",
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
          ...(calc.stonePrice && { stonePrice: calc.stonePrice })
        }));
      };

      const formattedData = {
        type: values.selectedMaterial,
        for: values.transactionType,
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
              console.log("Configuration updated successfully");
              // Clear session storage after successful update
              sessionStorage.removeItem("editingConfiguration");
              // Optionally redirect back to configurations list
              // navigate('/settings/calculator');
            },
            onError: (error) => {
              console.error("Error updating configuration:", error);
            },
          }
        );
      } else {
        mutate(formattedData, {
          onSuccess: () => {
            console.log("Configuration created successfully");
            formik.resetForm(); // Reset form on successful creation
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
                    ...(hasStone(formik.values.selectedMaterial) && {
                      stonePrice: 0,
                    }),
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
                    {formik.values.selectedMaterial.includes("stone") && (
                      <span className="block mt-1 text-purple-600">
                        💡 For stone materials, you can add stone price as a
                        calculation
                      </span>
                    )}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {calculations.map((row, index) => (
                    <div
                      key={index}
                      className={`grid grid-cols-1 gap-3 p-3 bg-gray-50 rounded-sm ${
                        hasStone(formik.values.selectedMaterial)
                          ? "md:grid-cols-5"
                          : "md:grid-cols-4"
                      }`}
                    >
                      <div className="md:col-span-1">
                        <InputField
                          label={index === 0 ? "Name" : ""}
                          name={`${fieldName}.${index}.name`}
                          placeholder={
                            formik.values.selectedMaterial.includes("stone")
                              ? "e.g., Stone Price, Labor, etc."
                              : "Enter calculation name"
                          }
                          value={formik.values[fieldName][index]?.name || ""}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          icon="material-symbols:edit"
                          helperText={
                            index === 0
                              ? formik.values.selectedMaterial.includes("stone")
                                ? "Add stone price or other stone-related calculations"
                                : "Descriptive name for this calculation"
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

                      {/* Stone Price Field - Only show when stone material is selected */}
                      {hasStone(formik.values.selectedMaterial) && (
                        <div className="md:col-span-1">
                          <InputField
                            label={index === 0 ? "Stone Price" : ""}
                            name={`${fieldName}.${index}.stonePrice`}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={
                              formik.values[fieldName][
                                index
                              ]?.stonePrice?.toString() || "0"
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            icon="material-symbols:diamond"
                            helperText={
                              index === 0
                                ? "Stone price for this calculation"
                                : undefined
                            }
                            error={
                              formik.touched[fieldName]?.[index]?.stonePrice &&
                              (
                                formik.errors[fieldName]?.[
                                  index
                                ] as FormikErrors<CalculationRow>
                              )?.stonePrice
                                ? (
                                    formik.errors[fieldName]?.[
                                      index
                                    ] as FormikErrors<CalculationRow>
                                  )?.stonePrice
                                : undefined
                            }
                          />
                        </div>
                      )}

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
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
                    {formik.values.selectedMaterial.includes("stone") && (
                      <span className="block mt-1 text-purple-600">
                        💡 Remember to add stone price in increment/decrement
                        calculations
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

        {/* Debug: Show form values (remove in production) */}
        {/* {import.meta.env?.DEV && (
          <div className="bg-gray-100 p-4 rounded-sm">
            <h4 className="font-medium mb-2">Form Values (Debug):</h4>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(formik.values, null, 2)}
            </pre>
            {Object.keys(formik.errors).length > 0 && (
              <>
                <h4 className="font-medium mb-2 mt-4 text-red-600">
                  Form Errors:
                </h4>
                <pre className="text-xs overflow-auto text-red-600">
                  {JSON.stringify(formik.errors, null, 2)}
                </pre>
              </>
            )}
          </div>
        )} */}
      </form>
    </FormikProvider>
  );
};

export default CalculatorIndex;
