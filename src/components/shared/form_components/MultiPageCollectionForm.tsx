import React, { useEffect, useMemo } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  FormStepper,
  ProgressBar,
  StepperNavigation,
  StepperStep,
} from "./FormStepper";
import {
  MultiPageFormProvider,
  useMultiPageForm,
} from "./MultiPageFormContext";
import { BasicInformationPage } from "./collection-form-pages/BasicInformationPage";
import { CollectionPropertiesPage } from "./collection-form-pages/CollectionPropertiesPage";
import { SmartCollectionRulesPage } from "./collection-form-pages/SmartCollectionRulesPage";
import { ProductSelectionPage } from "./collection-form-pages/ProductSelectionPage";
import { MediaAssetsPage } from "./collection-form-pages/MediaAssetsPage";

import { AvailabilityTimingPage } from "./collection-form-pages/AvailabilityTimingPage";

// Define the steps for the stepper
const FORM_STEPS: StepperStep[] = [
  {
    id: 1,
    title: "Basic Info",
    description: "Name & Description",
    icon: "material-symbols:info",
  },
  {
    id: 2,
    title: "Properties",
    description: "Material & Style",
    icon: "material-symbols:diamond",
  },
  {
    id: 3,
    title: "Collection Rules",
    description: "Product Management",
    icon: "material-symbols:smart-toy",
  },
  {
    id: 4,
    title: "Media",
    description: "Images & Videos",
    icon: "material-symbols:image",
  },
  {
    id: 5,
    title: "Availability",
    description: "Timing & Review",
    icon: "material-symbols:schedule",
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
  } = useMultiPageForm();

  // Determine if we should show the product selection step
  const shouldShowProductSelection = formData.collectionMode === "manual";

  // Dynamic steps based on collection mode
  const dynamicSteps = useMemo(() => {
    const baseSteps = [...FORM_STEPS];

    if (shouldShowProductSelection) {
      // Insert product selection step after collection rules
      const productSelectionStep: StepperStep = {
        id: 3.5,
        title: "Select Products",
        description: "Choose Products",
        icon: "material-symbols:inventory-2",
      };

      // Insert at index 3 (after collection rules)
      baseSteps.splice(3, 0, productSelectionStep);

      // Update subsequent step IDs
      baseSteps.forEach((step, index) => {
        if (index > 3) {
          step.id = index + 1;
        }
      });
    }

    return baseSteps;
  }, [shouldShowProductSelection]);

  // Update step completion status based on validation
  useEffect(() => {
    const stepValid = isStepValid(currentStep);
    if (stepValid && !completedSteps.has(currentStep)) {
      markStepCompleted(currentStep);
    } else if (!stepValid && completedSteps.has(currentStep)) {
      markStepIncomplete(currentStep);
    }
  }, [
    currentStep,
    isStepValid,
    completedSteps,
    markStepCompleted,
    markStepIncomplete,
  ]);

  // Enhanced steps with completion and error status
  const enhancedSteps = useMemo(() => {
    return dynamicSteps.map((step) => ({
      ...step,
      isCompleted: completedSteps.has(step.id),
      isActive: currentStep === step.id,
      hasError: !isStepValid(step.id) && step.id < currentStep,
    }));
  }, [dynamicSteps, currentStep, completedSteps, isStepValid]);

  // Handle step navigation
  const handleStepClick = (stepId: number) => {
    // Allow navigation to completed steps or the next step
    if (completedSteps.has(stepId) || stepId === currentStep + 1) {
      setCurrentStep(stepId);
    }
  };

  // Handle next step
  const handleNext = () => {
    if (isStepValid(currentStep)) {
      markStepCompleted(currentStep);
      nextStep();
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!isStepValid(currentStep)) return;

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
    if (shouldShowProductSelection) {
      // With product selection step
      switch (currentStep) {
        case 1:
          return <BasicInformationPage />;
        case 2:
          return <CollectionPropertiesPage />;
        case 3:
          return <SmartCollectionRulesPage />;
        case 4:
          return <ProductSelectionPage />;
        case 5:
          return <MediaAssetsPage />;
        case 6:
          return <AvailabilityTimingPage />;
        default:
          return <BasicInformationPage />;
      }
    } else {
      // Without product selection step
      switch (currentStep) {
        case 1:
          return <BasicInformationPage />;
        case 2:
          return <CollectionPropertiesPage />;
        case 3:
          return <SmartCollectionRulesPage />;
        case 4:
          return <MediaAssetsPage />;
        case 5:
          return <AvailabilityTimingPage />;
        default:
          return <BasicInformationPage />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 w-full overflow-hidden">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 min-w-0">
            <div className="flex items-center gap-3">
              <Icon
                icon="material-symbols:collections"
                className="w-8 h-8 text-[#DF8D28]"
              />
              <h1 className="text-xl font-semibold text-gray-900">
                {isEdit ? "Edit Collection" : "Create New Collection"}
              </h1>
            </div>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
              >
                <Icon icon="material-symbols:close" className="w-5 h-5" />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Compact Progress and Stepper */}
      <div className="bg-white border-b border-gray-200 w-full overflow-hidden">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ProgressBar
            currentStep={currentStep}
            totalSteps={dynamicSteps.length}
          />
          <div className="mt-3">
            <FormStepper
              steps={enhancedSteps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
              allowClickNavigation={true}
              className="compact-stepper"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full min-w-0 overflow-hidden">
          <div className="p-4 sm:p-6 w-full min-w-0">{renderCurrentPage()}</div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <StepperNavigation
            currentStep={currentStep}
            totalSteps={dynamicSteps.length}
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
interface MultiPageCollectionFormProps {
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  initialData?: any;
  isEdit?: boolean;
}

export const MultiPageCollectionForm: React.FC<
  MultiPageCollectionFormProps
> = ({ onSubmit, onCancel, initialData, isEdit = false }) => {
  return (
    <MultiPageFormProvider
      initialData={initialData}
      totalSteps={6} // Max possible steps (with product selection)
    >
      <MultiPageFormContent
        onSubmit={onSubmit}
        onCancel={onCancel}
        isEdit={isEdit}
      />
    </MultiPageFormProvider>
  );
};

// Export individual components for flexibility
export {
  BasicInformationPage,
  CollectionPropertiesPage,
  SmartCollectionRulesPage,
  ProductSelectionPage,
  MediaAssetsPage,
  AvailabilityTimingPage,
  FORM_STEPS,
};
