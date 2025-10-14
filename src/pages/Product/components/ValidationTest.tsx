import React, { useState } from "react";
import { mainProductFormSchema } from "../../../components/shared/form_components/validation/ProductFormValidation";

// Simple test component to verify validation logic
const ValidationTest: React.FC = () => {
  const [testData, setTestData] = useState({
    name: "",
    productType: "gold" as "normal" | "gold" | "silver",
    description: "",
    category: "",
    subCategory: "",
    totalCarat: 0,
    wastage: undefined as any,
    variants: [
      {
        price: 0,
        wt: 0,
        unit: "grams" as any,
        sku: "",
        totalStock: 0,
        usedStock: 0,
        remainingStock: 0,
        reorderPoint: 0,
        isActive: true,
      },
    ],
  });

  const [validationResult, setValidationResult] = useState<any>(null);

  const testValidation = () => {
    const result = mainProductFormSchema.safeParse(testData);
    setValidationResult(result);
    console.log("Validation result:", result);
  };

  const updateTestData = (field: string, value: any) => {
    setTestData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Product Form Validation Test</h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Test Data</h3>

          <div>
            <label className="block text-sm font-medium mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={testData.name}
              onChange={(e) => updateTestData("name", e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Product Type
            </label>
            <select
              value={testData.productType}
              onChange={(e) => updateTestData("productType", e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="normal">Normal</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={testData.description}
              onChange={(e) => updateTestData("description", e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter description"
              rows={3}
            />
          </div>

          {(testData.productType === "gold" ||
            testData.productType === "silver") && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={testData.category}
                  onChange={(e) => updateTestData("category", e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter category"
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium mb-1">Sub Category</label>
                <input
                  type="text"
                  value={testData.subCategory}
                  onChange={(e) => updateTestData('subCategory', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter sub category"
                />
              </div> */}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Total Carat
                </label>
                <input
                  type="number"
                  value={testData.totalCarat}
                  onChange={(e) =>
                    updateTestData(
                      "totalCarat",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Enter total carat"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Wastage
                </label>
                <div className="space-y-2">
                  <select
                    value={testData.wastage?.type || ""}
                    onChange={(e) =>
                      updateTestData("wastage", {
                        type: e.target.value,
                        value: testData.wastage?.value || 0,
                      })
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Type</option>
                    <option value="fixed">Fixed</option>
                    <option value="per">Percentage</option>
                  </select>
                  <input
                    type="number"
                    value={testData.wastage?.value || 0}
                    onChange={(e) =>
                      updateTestData("wastage", {
                        type: testData.wastage?.type || "fixed",
                        value: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Enter wastage value"
                    step="0.01"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              Variant Price
            </label>
            <input
              type="number"
              value={testData.variants[0].price}
              onChange={(e) => {
                const newVariants = [...testData.variants];
                newVariants[0].price = parseFloat(e.target.value) || 0;
                updateTestData("variants", newVariants);
              }}
              className="w-full p-2 border rounded"
              placeholder="Enter price"
              step="0.01"
            />
          </div>

          <button
            onClick={testValidation}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Test Validation
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Validation Result</h3>

          {validationResult && (
            <div className="p-4 border rounded">
              <div
                className={`mb-2 font-medium ${
                  validationResult.success ? "text-green-600" : "text-red-600"
                }`}
              >
                {validationResult.success
                  ? "✅ Validation Passed"
                  : "❌ Validation Failed"}
              </div>

              {!validationResult.success && (
                <div className="space-y-2">
                  <h4 className="font-medium">Errors:</h4>
                  {validationResult.error.errors.map(
                    (error: any, index: number) => (
                      <div
                        key={index}
                        className="text-sm text-red-600 bg-red-50 p-2 rounded"
                      >
                        <strong>Path:</strong> {error.path.join(".")} <br />
                        <strong>Message:</strong> {error.message}
                      </div>
                    )
                  )}
                </div>
              )}

              <div className="mt-4">
                <h4 className="font-medium mb-2">Test Data:</h4>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(testData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidationTest;
