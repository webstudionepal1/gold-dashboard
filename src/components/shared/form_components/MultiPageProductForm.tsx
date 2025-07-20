import React, { useEffect, useMemo } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  FormStepper,
  ProgressBar,
  StepperNavigation,
  StepperStep,
} from "./FormStepper";
import {
  ProductFormProvider,
  useProductForm,
} from "./ProductFormContext";
import { BasicProductInformationPage } from "./product-form-pages/BasicProductInformationPage";
import { ProductSpecificationsPage } from "./product-form-pages/ProductSpecificationsPage";
import { ProductVariantsPage } from "./product-form-pages/ProductVariantsPage";
import { ProductStonesOccasionsPage } from "./product-form-pages/ProductStonesOccasionsPage";
import { ProductMediaPage } from "./product-form-pages/ProductMediaPage";
import { ProductSEOMarketingPage } from "./product-form-pages/ProductSEOMarketingPage";
import { ProductInventoryStatusPage } from "./product-form-pages/ProductInventoryStatusPage";

// Define the steps for the stepper
const FORM_STEPS: StepperStep[] = [
  {
    id: 1,
    title: "Basic Info",
    description: "Name & Category",
    icon: "material-symbols:info",
  },
  {
    id: 2,
    title: "Specifications",
    description: "Physical Properties",
    icon: "material-symbols:straighten",
  },
  {
    id: 3,
    title: "Variants",
    description: "Pricing & Inventory",
    icon: "material-symbols:inventory",
  },
  {
    id: 4,
    title: "Stones & Occasions",
    description: "Gemstones & Events",
    icon: "material-symbols:diamond",
  },
  {
    id: 5,
    title: "Media",
    description: "Images & Assets",
    icon: "material-symbols:image",
  },
  {
    id: 6,
    title: "SEO & Marketing",
    description: "Optimization",
    icon: "material-symbols:search",
  },
  {
    id: 7,
    title: "Status & Review",
    description: "Final Settings",
    icon: "material-symbols:checklist",
  },
];

// Form Content Component (needs to be inside the provider)
const MultiPageFormContent: React.FC<{
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  isEdit?: boolean;
}> = ({ onSubmit, onCancel, isEdit = false }) => {
  const {
    currentStep,
    setCurrentStep,
    nextStep,
    previousStep,
    formData,
    isStepValid,
    isLoading,
    setIsLoading,
    completedSteps,
    markStepCompleted,
    markStepIncomplete,
  } = useProductForm();

  // Update step completion status based on validation
  useEffect(() => {
    if (isStepValid(currentStep)) {
      markStepCompleted(currentStep);
    } else {
      markStepIncomplete(currentStep);
    }
  }, [currentStep, isStepValid, markStepCompleted, markStepIncomplete]);

  // Enhanced steps with completion and error states
  const enhancedSteps = useMemo(() => {
    return FORM_STEPS.map((step) => ({
      ...step,
      isCompleted: completedSteps.has(step.id),
      isActive: step.id === currentStep,
      hasError: !isStepValid(step.id) && completedSteps.has(step.id),
    }));
  }, [completedSteps, currentStep, isStepValid]);

  // Handle next step
  const handleNext = () => {
    if (isStepValid(currentStep)) {
      markStepCompleted(currentStep);
      nextStep();
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!isStepValid(currentStep)) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render current page content
  const renderCurrentPage = () => {
    switch (currentStep) {
      case 1:
        return <BasicProductInformationPage />;
      case 2:
        return <ProductSpecificationsPage />;
      case 3:
        return <ProductVariantsPage />;
      case 4:
        return <ProductStonesOccasionsPage />;
      case 5:
        return <ProductMediaPage />;
      case 6:
        return <ProductSEOMarketingPage />;
      case 7:
        return <ProductInventoryStatusPage />;
      default:
        return <BasicProductInformationPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Icon icon="material-symbols:arrow-back" className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {isEdit ? "Edit Product" : "Create New Product"}
                </h1>
                <p className="text-sm text-gray-500">
                  Step {currentStep} of {FORM_STEPS.length}
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="hidden md:flex items-center gap-4">
              <ProgressBar
                currentStep={currentStep}
                totalSteps={FORM_STEPS.length}
                completedSteps={Array.from(completedSteps)}
              />
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / FORM_STEPS.length) * 100)}% Complete
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <FormStepper
            steps={enhancedSteps}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
            allowClickNavigation={true}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
          <div className="p-8">
            {renderCurrentPage()}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <StepperNavigation
            currentStep={currentStep}
            totalSteps={FORM_STEPS.length}
            onPrevious={previousStep}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isValid={isStepValid(currentStep)}
          />
        </div>
      </div>
    </div>
  );
};

// Main Component with Provider
interface MultiPageProductFormProps {
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  initialData?: any;
  isEdit?: boolean;
}

export const MultiPageProductForm: React.FC<
  MultiPageProductFormProps
> = ({ onSubmit, onCancel, initialData, isEdit = false }) => {
  return (
    <ProductFormProvider
      initialData={initialData}
      totalSteps={FORM_STEPS.length}>
      <MultiPageFormContent
        onSubmit={onSubmit}
        onCancel={onCancel}
        isEdit={isEdit}
      />
    </ProductFormProvider>
  );
};

// Export individual components for flexibility
export {
  BasicProductInformationPage,
  ProductSpecificationsPage,
  ProductVariantsPage,
  ProductStonesOccasionsPage,
  ProductMediaPage,
  ProductSEOMarketingPage,
  ProductInventoryStatusPage,
  FORM_STEPS,
};
