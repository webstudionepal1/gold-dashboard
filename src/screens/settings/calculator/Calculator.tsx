import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useGetAllPriceConfigurations, useDeletePriceConfiguration } from "@/server/api/priceCalculatorHooks";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/shared/form_components/Button";
import get from "lodash/get";

interface PriceConfiguration {
  _id: string;
  type: string;
  for: string;
  incrementalCalculations: CalculationItem[];
  decrementalCalculations: CalculationItem[];
  createdAt?: string;
  updatedAt?: string;
}

interface CalculationItem {
  name: string;
  type: "percentage" | "flat";
  value: number;
  stonePrice?: number;
}

const Calculator: React.FC = () => {
  const {
    data: configurations,
    isLoading,
    error,
  } = useGetAllPriceConfigurations();
  const { mutate: deleteConfiguration, isPending: isDeleting } = useDeletePriceConfiguration();
  const navigate = useNavigate();
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterTransaction, setFilterTransaction] = useState<string>("all");
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    config: PriceConfiguration | null;
  }>({ isOpen: false, config: null });

  // Handle edit configuration
  const handleEdit = (config: PriceConfiguration) => {
    // Store configuration data in session storage for editing
    sessionStorage.setItem('editingConfiguration', JSON.stringify(config));
    navigate('/settings/calculator/edit');
  };

  // Handle delete configuration
  const handleDelete = (config: PriceConfiguration) => {
    setDeleteDialog({ isOpen: true, config });
  };

  // Confirm delete
  const confirmDelete = () => {
    if (deleteDialog.config) {
      deleteConfiguration(deleteDialog.config._id);
      setDeleteDialog({ isOpen: false, config: null });
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, config: null });
  };

  // Handle add new configuration
  const handleAddNew = () => {
    // Clear any existing editing data
    sessionStorage.removeItem('editingConfiguration');
    navigate('/settings/calculator/add');
  };

  // Get material icon and color
  const getMaterialIcon = (type: string) => {
    if (type?.toLowerCase().includes("gold")) return "mdi:gold";
    if (type?.toLowerCase().includes("diamond")) return "mdi:diamond-stone";
    if (type?.toLowerCase().includes("stone"))
      return "material-symbols:diamond";
    return "material-symbols:calculate";
  };

  const getMaterialColor = (type: string) => {
    if (type?.toLowerCase().includes("gold")) return "text-yellow-600";
    if (type?.toLowerCase().includes("diamond")) return "text-blue-600";
    if (type?.toLowerCase().includes("stone")) return "text-purple-600";
    return "text-gray-600";
  };
  console.log("configurations", configurations);
  // Filter configurations
  const filteredConfigurations =
    get(configurations, "data", [])?.filter((config: PriceConfiguration) => {
      const typeMatch =
        filterType === "all" ||
        config.type?.toLowerCase().includes(filterType?.toLowerCase());
      const transactionMatch =
        filterTransaction === "all" ||
        config.for?.toLowerCase() === filterTransaction?.toLowerCase();
      return typeMatch && transactionMatch;
    }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Icon
            icon="material-symbols:calculate"
            className="w-8 h-8 text-amber-600 animate-pulse"
          />
          <p className="text-gray-600">Loading price configurations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <Icon
          icon="material-symbols:error"
          className="w-8 h-8 text-red-600 mx-auto mb-2"
        />
        <h3 className="text-red-800 font-medium mb-1">
          Error Loading Configurations
        </h3>
        <p className="text-red-600 text-sm">
          Failed to fetch price configurations. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Icon
                icon="material-symbols:settings"
                className="w-6 h-6 text-amber-600"
              />
              Price Calculator Configurations
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and view all price calculation configurations
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={handleAddNew}
              variant="primary"
              size="sm"
              icon="material-symbols:add"
            >
              Add New
            </Button>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Configurations</p>
              <p className="text-2xl font-bold text-amber-600 text-center">
                {filteredConfigurations.length}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Material:
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">All Materials</option>
              <option value="gold">Gold</option>
              <option value="diamond">Diamond</option>
              <option value="stone">Stone</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Transaction:
            </label>
            <select
              value={filterTransaction}
              onChange={(e) => setFilterTransaction(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">All Types</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>
        </div>
      </div>

      {/* Configurations Grid */}
      {filteredConfigurations.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Icon
            icon="material-symbols:calculate"
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Configurations Found
          </h3>
          <p className="text-gray-600">
            {configurations?.length === 0
              ? "No price configurations have been created yet."
              : "No configurations match your current filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredConfigurations.map((config: PriceConfiguration) => (
            <ConfigurationCard
              key={config._id}
              config={config}
              isSelected={selectedConfig === config._id}
              onSelect={() =>
                setSelectedConfig(
                  selectedConfig === config._id ? null : config._id
                )
              }
              onEdit={() => handleEdit(config)}
              onDelete={() => handleDelete(config)}
              getMaterialIcon={getMaterialIcon}
              getMaterialColor={getMaterialColor}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialog.isOpen && (
        <DeleteConfirmationDialog
          isOpen={deleteDialog.isOpen}
          config={deleteDialog.config}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

// Configuration Card Component
interface ConfigurationCardProps {
  config: PriceConfiguration;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  getMaterialIcon: (type: string) => string;
  getMaterialColor: (type: string) => string;
  isDeleting: boolean;
}

const ConfigurationCard: React.FC<ConfigurationCardProps> = ({
  config,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  getMaterialIcon,
  getMaterialColor,
  isDeleting,
}) => {
  const totalIncrements = config.incrementalCalculations?.length || 0;
  const totalDecrements = config.decrementalCalculations?.length || 0;

  return (
    <div
      className={`bg-white rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
        isSelected
          ? "border-amber-500 shadow-lg"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={onSelect}
    >
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon
              icon={getMaterialIcon(config.type)}
              className={`w-5 h-5 ${getMaterialColor(config.type)}`}
            />
            <h3 className="font-semibold text-gray-900">{config.type}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                config.for?.toLowerCase() === "buy"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {config.for}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                title="Edit Configuration"
              >
                <Icon icon="material-symbols:edit" className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                disabled={isDeleting}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                title="Delete Configuration"
              >
                <Icon
                  icon={isDeleting ? "material-symbols:hourglass-empty" : "material-symbols:delete"}
                  className="w-4 h-4"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Icon
              icon="material-symbols:add-circle"
              className="w-4 h-4 text-green-600"
            />
            <span>{totalIncrements} increments</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon
              icon="material-symbols:remove-circle"
              className="w-4 h-4 text-red-600"
            />
            <span>{totalDecrements} decrements</span>
          </div>
        </div>
      </div>

      {/* Card Content - Expanded when selected */}
      {isSelected && (
        <div className="p-4 space-y-4">
          {/* Increment Calculations */}
          {totalIncrements > 0 && (
            <CalculationSection
              title="Increment Calculations"
              calculations={config.incrementalCalculations}
              type="increment"
            />
          )}

          {/* Decrement Calculations */}
          {totalDecrements > 0 && (
            <CalculationSection
              title="Decrement Calculations"
              calculations={config.decrementalCalculations}
              type="decrement"
            />
          )}
        </div>
      )}

      {/* Card Footer */}
      <div className="px-4 py-3 bg-gray-50 rounded-b-lg">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Click to {isSelected ? "collapse" : "expand"}</span>
          <Icon
            icon={
              isSelected
                ? "material-symbols:expand-less"
                : "material-symbols:expand-more"
            }
            className="w-4 h-4"
          />
        </div>
      </div>
    </div>
  );
};

// Calculation Section Component
interface CalculationSectionProps {
  title: string;
  calculations: CalculationItem[];
  type: "increment" | "decrement";
}

const CalculationSection: React.FC<CalculationSectionProps> = ({
  title,
  calculations,
  type,
}) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
        <Icon
          icon={
            type === "increment"
              ? "material-symbols:add-circle"
              : "material-symbols:remove-circle"
          }
          className={`w-4 h-4 ${
            type === "increment" ? "text-green-600" : "text-red-600"
          }`}
        />
        {title}
      </h4>
      <div className="space-y-2">
        {calculations.map((calc, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-md p-3 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">
                {calc.name || "Unnamed"}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    calc.type === "percentage"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {calc.type === "percentage" ? "Percent" : "Flat"}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {calc.type === "percentage"
                    ? `${calc.value}%`
                    : `$${calc.value}`}
                </span>
              </div>
            </div>
            {calc.stonePrice !== undefined && calc.stonePrice > 0 && (
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <Icon icon="material-symbols:diamond" className="w-4 h-4" />
                <span>Stone Price: ${calc.stonePrice}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Delete Confirmation Dialog Component
interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  config: PriceConfiguration | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  config,
  onConfirm,
  onCancel,
  isDeleting,
}) => {
  if (!isOpen || !config) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Dialog Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
              <Icon icon="material-symbols:warning" className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Configuration</h3>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
        </div>

        {/* Dialog Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete the configuration for{" "}
            <span className="font-semibold text-gray-900">{config.type}</span>{" "}
            ({config.for})?
          </p>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="material-symbols:info" className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Configuration Details:</span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>• Material: {config.type}</div>
              <div>• Transaction: {config.for}</div>
              <div>• Increment rules: {config.incrementalCalculations?.length || 0}</div>
              <div>• Decrement rules: {config.decrementalCalculations?.length || 0}</div>
            </div>
          </div>
        </div>

        {/* Dialog Actions */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
          <Button
            onClick={onCancel}
            variant="secondary"
            size="sm"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="danger"
            size="sm"
            disabled={isDeleting}
            icon={isDeleting ? "material-symbols:hourglass-empty" : "material-symbols:delete"}
          >
            {isDeleting ? "Deleting..." : "Delete Configuration"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
