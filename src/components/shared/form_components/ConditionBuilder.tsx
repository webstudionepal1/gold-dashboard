import React, { useMemo, useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { InputField } from "./InputField";
import { DropdownField } from "./Dropdown";
import { MatchingProductsList, MatchingProduct } from "./MatchingProductsList";
import {
  IConditionRule,
  IConditionGroup,
  ISmartCollectionConditions,
  usePreviewCollectionProductsMutation,
} from "../../../server/api/collectionHooks";
import {
  useGetAllProductCategoriesQuery,
  useGetAllProductSubCategoriesQuery,
  useGetAllProductClaspsQuery,
  useGetAllProductOccasionsQuery,
  useGetAllStonesQuery,
} from "../../../server/api/productHooks";

interface ConditionBuilderProps {
  conditions: ISmartCollectionConditions;
  onChange: (conditions: ISmartCollectionConditions) => void;
  collectionMode?: "manual" | "automatic" | "hybrid";
  collectionId?: string;
  showMatchingProducts?: boolean;
}

// Available fields for conditions
const fieldOptions = [
  { label: "Product Name", value: "name" },
  { label: "Category", value: "category" },
  { label: "Subcategory", value: "subCategory" },
  { label: "Product Type", value: "productType" },
  { label: "Tags", value: "tags" },
  { label: "Price", value: "variants.price" },
  { label: "Compare At Price", value: "variants.compareAtPrice" },
  { label: "SKU", value: "variants.sku" },
  { label: "Inventory Quantity", value: "variants.inventoryQuantity" },
  { label: "Weight", value: "variants.weight" },
  { label: "Material Type", value: "materialType" },
  { label: "Gemstone Type", value: "gemstoneType" },
  { label: "Style Category", value: "styleCategory" },
  { label: "Clasp Type", value: "claspType" },
  { label: "Occasions", value: "occasions" },
  { label: "Stones", value: "stones" },
  { label: "Vendor", value: "metadata.vendor" },
  { label: "Visibility", value: "visibleAs" },
  { label: "Is Active", value: "isActive" },
  { label: "Is Featured", value: "isFeatured" },
  { label: "Created Date", value: "createdAt" },
  { label: "Updated Date", value: "updatedAt" },
];

// Dropdown options for specific fields
const materialTypeOptions = [
  { label: "Gold", value: "gold" },
  { label: "Silver", value: "silver" },
  { label: "Platinum", value: "platinum" },
  { label: "Rose Gold", value: "rose_gold" },
  { label: "White Gold", value: "white_gold" },
  { label: "Mixed", value: "mixed" },
  { label: "Other", value: "other" },
];

const gemstoneTypeOptions = [
  { label: "Diamond", value: "diamond" },
  { label: "Ruby", value: "ruby" },
  { label: "Emerald", value: "emerald" },
  { label: "Sapphire", value: "sapphire" },
  { label: "Pearl", value: "pearl" },
  { label: "Mixed", value: "mixed" },
  { label: "None", value: "none" },
  { label: "Other", value: "other" },
];

const styleCategoryOptions = [
  { label: "Vintage", value: "vintage" },
  { label: "Modern", value: "modern" },
  { label: "Classic", value: "classic" },
  { label: "Contemporary", value: "contemporary" },
  { label: "Minimalist", value: "minimalist" },
  { label: "Bohemian", value: "bohemian" },
  { label: "Luxury", value: "luxury" },
  { label: "Other", value: "other" },
];

const productTypeOptions = [
  { label: "Ring", value: "ring" },
  { label: "Necklace", value: "necklace" },
  { label: "Bracelet", value: "bracelet" },
  { label: "Earrings", value: "earrings" },
  { label: "Pendant", value: "pendant" },
  { label: "Chain", value: "chain" },
  { label: "Bangle", value: "bangle" },
  { label: "Anklet", value: "anklet" },
];

const visibilityOptions = [
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
  { label: "Draft", value: "draft" },
];

// Function to get dropdown options for a specific field
const getFieldDropdownOptions = (
  field: string,
  dynamicOptions?: { [key: string]: Array<{ label: string; value: string }> }
) => {
  // Check for dynamic options first (from database)
  if (dynamicOptions && dynamicOptions[field]) {
    return dynamicOptions[field];
  }

  // Fallback to static options
  switch (field) {
    case "materialType":
      return materialTypeOptions;
    case "gemstoneType":
      return gemstoneTypeOptions;
    case "styleCategory":
      return styleCategoryOptions;
    case "productType":
      return productTypeOptions;
    case "visibleAs":
      return visibilityOptions;
    default:
      return [];
  }
};

// Operators based on field type
const getOperatorOptions = (field: string) => {
  const stringOperators = [
    { label: "Equals", value: "equals" },
    { label: "Not Equals", value: "not_equals" },
    { label: "Contains", value: "contains" },
    { label: "Not Contains", value: "not_contains" },
    { label: "Starts With", value: "starts_with" },
    { label: "Ends With", value: "ends_with" },
  ];

  const numberOperators = [
    { label: "Equals", value: "equals" },
    { label: "Not Equals", value: "not_equals" },
    { label: "Greater Than", value: "greater_than" },
    { label: "Less Than", value: "less_than" },
    { label: "Greater Than or Equal", value: "greater_than_or_equal" },
    { label: "Less Than or Equal", value: "less_than_or_equal" },
  ];

  const booleanOperators = [
    { label: "Is True", value: "equals" },
    { label: "Is False", value: "not_equals" },
  ];

  const arrayOperators = [
    { label: "Contains", value: "contains" },
    { label: "Not Contains", value: "not_contains" },
    { label: "In", value: "in" },
    { label: "Not In", value: "not_in" },
  ];

  // Determine field type and return appropriate operators
  if (
    field.includes("price") ||
    field.includes("quantity") ||
    field.includes("weight")
  ) {
    return numberOperators;
  } else if (field === "isActive" || field === "isFeatured") {
    return booleanOperators;
  } else if (field === "tags") {
    return arrayOperators;
  } else {
    return stringOperators;
  }
};

const getValueType = (
  field: string
): "string" | "number" | "boolean" | "array" | "date" => {
  if (
    field.includes("price") ||
    field.includes("quantity") ||
    field.includes("weight")
  ) {
    return "number";
  } else if (field === "isActive" || field === "isFeatured") {
    return "boolean";
  } else if (field === "tags") {
    return "array";
  } else if (
    field.includes("Date") ||
    field === "createdAt" ||
    field === "updatedAt"
  ) {
    return "date";
  } else {
    return "string";
  }
};

// Function to check if a field should be rendered as a dropdown
const isDropdownField = (field: string): boolean => {
  return [
    "materialType",
    "gemstoneType",
    "styleCategory",
    "productType",
    "visibleAs",
    "category",
    "subCategory",
    "claspType",
    "occasions",
    "stones",
  ].includes(field);
};

const operatorOptions = [
  { label: "AND", value: "AND" },
  { label: "OR", value: "OR" },
];

export const ConditionBuilder: React.FC<ConditionBuilderProps> = ({
  conditions,
  onChange,
  collectionMode = "manual",
  collectionId,
  showMatchingProducts = true,
}) => {
  // Fetch real database values
  const {
    data: categories,
    isSuccess: categoriesSuccess,
    isLoading: categoriesLoading,
  } = useGetAllProductCategoriesQuery();
  const {
    data: subCategories,
    isSuccess: subCategoriesSuccess,
    isLoading: subCategoriesLoading,
  } = useGetAllProductSubCategoriesQuery();
  const {
    data: clasps,
    isSuccess: claspsSuccess,
    isLoading: claspsLoading,
  } = useGetAllProductClaspsQuery();
  const {
    data: occasions,
    isSuccess: occasionsSuccess,
    isLoading: occasionsLoading,
  } = useGetAllProductOccasionsQuery();
  const {
    data: stones,
    isSuccess: stonesSuccess,
    isLoading: stonesLoading,
  } = useGetAllStonesQuery();

  // Create dynamic dropdown options from database
  const dynamicDropdownOptions = useMemo(() => {
    const options: { [key: string]: Array<{ label: string; value: string }> } =
      {};

    // Categories
    if (categoriesSuccess && categories) {
      options.category = categories.map((cat) => ({
        label: cat.name,
        value: cat._id,
      }));
    }

    // Subcategories
    if (subCategoriesSuccess && subCategories) {
      options.subCategory = subCategories.map((subCat) => ({
        label: subCat.name,
        value: subCat._id,
      }));
    }

    // Clasp types
    if (claspsSuccess && clasps) {
      options.claspType = clasps.map((clasp) => ({
        label: clasp.name,
        value: clasp._id,
      }));
    }

    // Occasions
    if (occasionsSuccess && occasions) {
      options.occasions = occasions.map((occasion) => ({
        label: occasion.name,
        value: occasion._id,
      }));
    }

    // Stones
    if (stonesSuccess && stones) {
      options.stones = stones.map((stone) => ({
        label: `${stone.name} (${stone.carat}ct - ${stone.color})`,
        value: stone._id,
      }));
    }

    return options;
  }, [
    categories,
    categoriesSuccess,
    subCategories,
    subCategoriesSuccess,
    clasps,
    claspsSuccess,
    occasions,
    occasionsSuccess,
    stones,
    stonesSuccess,
  ]);

  // Helper function to check if a field is loading
  const isFieldLoading = (field: string): boolean => {
    switch (field) {
      case "category":
        return categoriesLoading;
      case "subCategory":
        return subCategoriesLoading;
      case "claspType":
        return claspsLoading;
      case "occasions":
        return occasionsLoading;
      case "stones":
        return stonesLoading;
      default:
        return false;
    }
  };

  // Matching products functionality
  const [matchingProducts, setMatchingProducts] = useState<MatchingProduct[]>(
    []
  );
  const [totalMatchingCount, setTotalMatchingCount] = useState(0);
  const [shouldShowMatching, setShouldShowMatching] = useState(false);

  const previewProductsMutation = usePreviewCollectionProductsMutation();

  // Check if we should show matching products
  const shouldShowMatchingProducts =
    showMatchingProducts &&
    (collectionMode === "automatic" || collectionMode === "hybrid") &&
    conditions.groups.length > 0;

  // Debounced effect to preview products when conditions change
  useEffect(() => {
    console.log("ConditionBuilder useEffect triggered:", {
      shouldShowMatchingProducts,
      collectionMode,
      groupsLength: conditions.groups.length,
      conditions: JSON.stringify(conditions, null, 2),
    });

    if (!shouldShowMatchingProducts) {
      console.log("Not showing matching products, clearing state");
      setMatchingProducts([]);
      setTotalMatchingCount(0);
      setShouldShowMatching(false);
      return;
    }

    // Only preview if we have actual conditions with values
    const hasValidConditions = conditions.groups.some(
      (group) =>
        group.rules.length > 0 &&
        group.rules.some((rule) => {
          // Check if rule has a meaningful value
          if (rule.value === null || rule.value === undefined) return false;
          if (typeof rule.value === "string" && rule.value.trim() === "")
            return false;
          if (Array.isArray(rule.value) && rule.value.length === 0)
            return false;
          return true;
        })
    );

    if (!hasValidConditions) {
      console.log("No valid conditions found, clearing state");
      setMatchingProducts([]);
      setTotalMatchingCount(0);
      setShouldShowMatching(false);
      return;
    }

    console.log("Valid conditions found, setting up API call");
    setShouldShowMatching(true);

    // Debounce the API call
    const timeoutId = setTimeout(() => {
      console.log("Making API call to preview products with:", {
        collectionId,
        conditions,
      });

      previewProductsMutation.mutate(
        {
          collectionId,
          conditions,
        },
        {
          onSuccess: (data) => {
            console.log("API call successful:", data);
            setMatchingProducts(data?.previewProducts || []);
            setTotalMatchingCount(data?.totalCount || 0);
          },
          onError: (error) => {
            console.error("API call failed:", error);
            setMatchingProducts([]);
            setTotalMatchingCount(0);
          },
        }
      );
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [conditions, shouldShowMatchingProducts, collectionId]);
  const addGroup = () => {
    const newGroup: IConditionGroup = {
      rules: [
        {
          field: "name",
          operator: "contains",
          value: "",
          valueType: "string",
        },
      ],
      operator: "AND",
    };

    onChange({
      ...conditions,
      groups: [...conditions.groups, newGroup],
    });
  };

  const removeGroup = (groupIndex: number) => {
    const newGroups = conditions.groups.filter(
      (_, index) => index !== groupIndex
    );
    onChange({
      ...conditions,
      groups: newGroups,
    });
  };

  const updateGroup = (groupIndex: number, updatedGroup: IConditionGroup) => {
    const newGroups = [...conditions.groups];
    newGroups[groupIndex] = updatedGroup;
    onChange({
      ...conditions,
      groups: newGroups,
    });
  };

  const addRule = (groupIndex: number) => {
    const newRule: IConditionRule = {
      field: "name",
      operator: "contains",
      value: "",
      valueType: "string",
    };

    const updatedGroup = {
      ...conditions.groups[groupIndex],
      rules: [...conditions.groups[groupIndex].rules, newRule],
    };

    updateGroup(groupIndex, updatedGroup);
  };

  const removeRule = (groupIndex: number, ruleIndex: number) => {
    const updatedGroup = {
      ...conditions.groups[groupIndex],
      rules: conditions.groups[groupIndex].rules.filter(
        (_, index) => index !== ruleIndex
      ),
    };

    updateGroup(groupIndex, updatedGroup);
  };

  const updateRule = (
    groupIndex: number,
    ruleIndex: number,
    updatedRule: IConditionRule
  ) => {
    const updatedGroup = {
      ...conditions.groups[groupIndex],
      rules: conditions.groups[groupIndex].rules.map((rule, index) =>
        index === ruleIndex ? updatedRule : rule
      ),
    };

    updateGroup(groupIndex, updatedGroup);
  };

  const renderValueInput = (
    rule: IConditionRule,
    groupIndex: number,
    ruleIndex: number
  ) => {
    const updateRuleValue = (value: string | number | boolean | string[]) => {
      updateRule(groupIndex, ruleIndex, { ...rule, value });
    };

    switch (rule.valueType) {
      case "boolean":
        return (
          <DropdownField
            label=""
            firstInput="Select value"
            options={[
              { label: "True", value: "true" },
              { label: "False", value: "false" },
            ]}
            value={rule.value?.toString() || ""}
            onChange={(e) => updateRuleValue(e.target.value === "true")}
          />
        );

      case "number":
        return (
          <InputField
            label=""
            type="number"
            placeholder="Enter number"
            value={rule.value || ""}
            onChange={(e) => updateRuleValue(Number(e.target.value))}
          />
        );

      case "date":
        return (
          <InputField
            label=""
            type="date"
            value={rule.value || ""}
            onChange={(e) => updateRuleValue(e.target.value)}
          />
        );

      case "array":
        return (
          <InputField
            label=""
            placeholder="Enter values separated by commas"
            value={
              Array.isArray(rule.value)
                ? rule.value.join(", ")
                : rule.value || ""
            }
            onChange={(e) => {
              const values = e.target.value
                .split(",")
                .map((v) => v.trim())
                .filter((v) => v);
              updateRuleValue(values);
            }}
          />
        );

      default:
        // Check if this field should be rendered as a dropdown
        if (isDropdownField(rule.field)) {
          // Check if field is loading
          if (isFieldLoading(rule.field)) {
            return (
              <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                <Icon
                  icon="eos-icons:loading"
                  className="w-4 h-4 text-customorange mr-2 animate-spin"
                />
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            );
          }

          const dropdownOptions = getFieldDropdownOptions(
            rule.field,
            dynamicDropdownOptions
          );

          // If no options available, show "Not Found" message
          if (dropdownOptions.length === 0) {
            return (
              <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                <Icon
                  icon="material-symbols:error-outline"
                  className="w-4 h-4 text-red-500 mr-2"
                />
                <span className="text-sm text-gray-500">Not Found</span>
              </div>
            );
          }

          return (
            <DropdownField
              label=""
              firstInput="Select value"
              options={dropdownOptions}
              value={rule.value || ""}
              onChange={(e) => updateRuleValue(e.target.value)}
            />
          );
        }

        return (
          <InputField
            label=""
            placeholder="Enter value"
            value={rule.value || ""}
            onChange={(e) => updateRuleValue(e.target.value)}
          />
        );
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Icon
            icon="material-symbols:rule"
            className="w-5 h-5 text-customorange"
          />
          Collection Conditions
        </h3>
        <button
          type="button"
          onClick={addGroup}
          className="bg-customorange hover:bg-customorangedark text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors"
        >
          <Icon icon="ic:outline-add" className="w-4 h-4" />
          Add Group
        </button>
      </div>

      {conditions.groups.length > 0 && (
        <div className="mb-4">
          <DropdownField
            label="Combine Groups With"
            firstInput="Select operator"
            options={operatorOptions}
            value={conditions.operator}
            onChange={(e) =>
              onChange({
                ...conditions,
                operator: e.target.value as "AND" | "OR",
              })
            }
          />
        </div>
      )}

      <div className="space-y-4">
        {conditions.groups.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">
                Group {groupIndex + 1}
              </h4>
              <button
                type="button"
                onClick={() => removeGroup(groupIndex)}
                className="text-red-600 hover:text-red-700 p-1"
                disabled={conditions.groups.length === 1}
              >
                <Icon icon="ic:outline-delete" className="w-4 h-4" />
              </button>
            </div>

            {group.rules.length > 1 && (
              <div className="mb-4">
                <DropdownField
                  label="Combine Rules With"
                  firstInput="Select operator"
                  options={operatorOptions}
                  value={group.operator}
                  onChange={(e) =>
                    updateGroup(groupIndex, {
                      ...group,
                      operator: e.target.value as "AND" | "OR",
                    })
                  }
                />
              </div>
            )}

            <div className="space-y-3">
              {group.rules.map((rule, ruleIndex) => (
                <div
                  key={ruleIndex}
                  className="grid grid-cols-12 gap-2 items-end"
                >
                  <div className="col-span-3">
                    <DropdownField
                      label={ruleIndex === 0 ? "Field" : ""}
                      firstInput="Select field"
                      options={fieldOptions}
                      value={rule.field}
                      onChange={(e) => {
                        const field = e.target.value;
                        const valueType = getValueType(field);
                        const firstOperator =
                          getOperatorOptions(field)[0]?.value || "equals";
                        updateRule(groupIndex, ruleIndex, {
                          ...rule,
                          field,
                          valueType,
                          operator: firstOperator as IConditionRule["operator"],
                          value: valueType === "boolean" ? false : "",
                        });
                      }}
                    />
                  </div>

                  <div className="col-span-3">
                    <DropdownField
                      label={ruleIndex === 0 ? "Operator" : ""}
                      firstInput="Select operator"
                      options={getOperatorOptions(rule.field)}
                      value={rule.operator}
                      onChange={(e) =>
                        updateRule(groupIndex, ruleIndex, {
                          ...rule,
                          operator: e.target
                            .value as IConditionRule["operator"],
                        })
                      }
                    />
                  </div>

                  <div className="col-span-5">
                    {ruleIndex === 0 && (
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Value
                      </label>
                    )}
                    {renderValueInput(rule, groupIndex, ruleIndex)}
                  </div>

                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => removeRule(groupIndex, ruleIndex)}
                      className="text-red-600 hover:text-red-700 p-1"
                      disabled={group.rules.length === 1}
                    >
                      <Icon icon="ic:outline-remove" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addRule(groupIndex)}
              className="mt-3 text-customorange hover:text-customorangedark text-sm flex items-center gap-1"
            >
              <Icon icon="ic:outline-add" className="w-4 h-4" />
              Add Rule
            </button>
          </div>
        ))}
      </div>

      {conditions.groups.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Icon
            icon="material-symbols:rule"
            className="w-12 h-12 mx-auto mb-2 opacity-50"
          />
          <p>
            No conditions defined. Click "Add Group" to create your first
            condition group.
          </p>
        </div>
      )}

      {/* Matching Products Display */}
      {shouldShowMatching && (
        <div className="mt-6">
          <MatchingProductsList
            products={matchingProducts}
            totalCount={totalMatchingCount}
            isLoading={previewProductsMutation.isPending}
            error={previewProductsMutation.error?.message}
          />
        </div>
      )}
    </div>
  );
};
