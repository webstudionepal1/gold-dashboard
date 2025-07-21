import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

export interface StepperStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  isCompleted?: boolean;
  isActive?: boolean;
  hasError?: boolean;
}

interface FormStepperProps {
  steps: StepperStep[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
  allowClickNavigation?: boolean;
  className?: string;
}

export const FormStepper: React.FC<FormStepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  allowClickNavigation = false,
  className = "",
}) => {
  const handleStepClick = (stepId: number) => {
    if (allowClickNavigation && onStepClick) {
      onStepClick(stepId);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isClickable = allowClickNavigation && (isCompleted || isActive);
          const hasError = step.hasError;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle and Content */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`
                    relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 cursor-pointer
                    ${
                      hasError
                        ? "bg-red-100 border-red-500 text-red-600"
                        : isCompleted
                        ? "bg-[#DF8D28] border-[#DF8D28] text-white"
                        : isActive
                        ? "bg-[#DF8D28]/10 border-[#DF8D28] text-[#DF8D28]"
                        : "bg-gray-100 border-gray-300 text-gray-400"
                    }
                    ${isClickable ? "hover:scale-105" : ""}
                  `}
                  onClick={() => handleStepClick(step.id)}
                >
                  {hasError ? (
                    <Icon icon="material-symbols:error" className="w-6 h-6" />
                  ) : isCompleted ? (
                    <Icon icon="material-symbols:check" className="w-6 h-6" />
                  ) : (
                    <Icon icon={step.icon} className="w-6 h-6" />
                  )}

                  {/* Active Step Pulse Animation */}
                  {isActive && !hasError && (
                    <div className="absolute inset-0 rounded-full border-2 border-[#DF8D28] animate-ping opacity-75"></div>
                  )}
                </div>

                {/* Step Title and Description */}
                <div
                  className={`mt-2 text-center max-w-[120px] ${
                    className?.includes("compact-stepper")
                      ? "hidden sm:block"
                      : ""
                  }`}
                >
                  <h3
                    className={`text-xs font-medium transition-colors duration-300 text-nowrap ${
                      hasError
                        ? "text-red-600"
                        : isActive
                        ? "text-[#DF8D28]"
                        : isCompleted
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </h3>
                  {!className?.includes("compact-stepper") && (
                    <p
                      className={`text-xs mt-1 transition-colors duration-300 text-nowrap ${
                        hasError
                          ? "text-red-500"
                          : isActive
                          ? "text-[#DF8D28]/70"
                          : isCompleted
                          ? "text-gray-600"
                          : "text-gray-400"
                      }`}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 mx-4 ${
                    className?.includes("compact-stepper") ? "mb-4" : "mb-8"
                  }`}
                >
                  <div
                    className={`h-0.5 w-full transition-all duration-500 ${
                      currentStep > step.id ? "bg-[#DF8D28]" : "bg-gray-300"
                    }`}
                  ></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// Progress Bar Component
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  completedSteps?: number[];
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  completedSteps = [],
  className = "",
}) => {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-gray-500">
          {Math.round(progressPercentage)}% Complete
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-[#DF8D28] to-[#B8691A] h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Navigation Buttons Component
interface StepperNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  isValid?: boolean;
  className?: string;
}

export const StepperNavigation: React.FC<StepperNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isLoading = false,
  isValid = true,
  className = "",
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className={`flex justify-between items-center ${className}`}>
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirstStep}
        className={`
          px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
          ${
            isFirstStep
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
          }
        `}
      >
        <Icon icon="material-symbols:arrow-back" className="w-4 h-4" />
        Previous
      </button>

      <div className="flex gap-3">
        {!isLastStep ? (
          <button
            type="button"
            onClick={onNext}
            disabled={!isValid || isLoading}
            className={`
              px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
              ${
                !isValid || isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#DF8D28] text-white hover:bg-[#B8691A] hover:scale-105"
              }
            `}
          >
            {isLoading ? (
              <>
                <Icon
                  icon="material-symbols:hourglass-empty"
                  className="w-4 h-4 animate-spin"
                />
                Processing...
              </>
            ) : (
              <>
                Next
                <Icon
                  icon="material-symbols:arrow-forward"
                  className="w-4 h-4"
                />
              </>
            )}
          </button>
        ) : (
          <button
            type="submit"
            onClick={onSubmit}
            disabled={!isValid || isLoading}
            className={`
              px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
              ${
                !isValid || isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#DF8D28] to-[#B8691A] text-white hover:from-[#B8691A] hover:to-[#9A5515] hover:scale-105 shadow-lg"
              }
            `}
          >
            {isLoading ? (
              <>
                <Icon
                  icon="material-symbols:hourglass-empty"
                  className="w-4 h-4 animate-spin"
                />
                Creating Collection...
              </>
            ) : (
              <>
                <Icon
                  icon="material-symbols:check-circle"
                  className="w-5 h-5"
                />
                Create Collection
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
