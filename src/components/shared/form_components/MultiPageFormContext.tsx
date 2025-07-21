import React, { createContext, useContext, useState, useCallback } from "react";
import { ISmartCollectionConditions } from "../../../server/api/collectionHooks";

// Form Data Interface
export interface CollectionFormData {
  // Page 1: Basic Information
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  isActive: boolean;
  isFeatured: boolean;

  // Page 2: Collection Properties
  materialType: string;
  gemstoneType: string;
  styleCategory: string;

  // Page 3: Smart Collection Rules
  collectionMode: "manual" | "automatic" | "hybrid";
  conditions: ISmartCollectionConditions;

  // Page 4: Media and Assets
  images: string[];
  bannerImage: string;
  video: string;

  // Page 5: SEO and Marketing
  metadata: {
    seoTitle: string;
    seoDescription: string;
    keywords: string[];
    tags: string[];
    targetAudience: "men" | "women" | "unisex" | "children" | "";
    seasonality: "spring" | "summer" | "autumn" | "winter" | "year-round";
    popularity: number;
    trendingScore: number;
  };

  // Page 6: Availability and Timing
  isLimitedEdition: boolean;
  availableFrom: string;
  availableUntil: string;
  sortOrder: number;
}

// Form Validation State
export interface FormValidationState {
  [key: string]: {
    isValid: boolean;
    errors: string[];
    touched: boolean;
  };
}

// Context Interface
interface MultiPageFormContextType {
  // Form Data
  formData: CollectionFormData;
  updateFormData: (updates: Partial<CollectionFormData>) => void;
  resetFormData: () => void;

  // Current Step
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;

  // Validation
  validationState: FormValidationState;
  updateValidation: (
    field: string,
    isValid: boolean,
    errors: string[],
    touched?: boolean
  ) => void;
  isStepValid: (step: number) => boolean;

  // Form State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;

  // Step Management
  completedSteps: Set<number>;
  markStepCompleted: (step: number) => void;
  markStepIncomplete: (step: number) => void;
}

// Default Form Data
const defaultFormData: CollectionFormData = {
  // Page 1: Basic Information
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  isActive: true,
  isFeatured: false,

  // Page 2: Collection Properties
  materialType: "",
  gemstoneType: "",
  styleCategory: "",

  // Page 3: Smart Collection Rules
  collectionMode: "manual",
  conditions: {
    groups: [],
    operator: "AND",
    isAutomatic: false,
    manualProductIds: [],
    excludedProductIds: [],
  },

  // Page 4: Media and Assets
  images: [],
  bannerImage: "",
  video: "",

  // Page 5: SEO and Marketing
  metadata: {
    seoTitle: "",
    seoDescription: "",
    keywords: [],
    tags: [],
    targetAudience: "unisex",
    seasonality: "year-round",
    popularity: 0,
    trendingScore: 0,
  },

  // Page 6: Availability and Timing
  isLimitedEdition: false,
  availableFrom: "",
  availableUntil: "",
  sortOrder: 0,
};

// Create Context
const MultiPageFormContext = createContext<
  MultiPageFormContextType | undefined
>(undefined);

// Provider Component
interface MultiPageFormProviderProps {
  children: React.ReactNode;
  initialData?: Partial<CollectionFormData>;
  totalSteps?: number;
}

export const MultiPageFormProvider: React.FC<MultiPageFormProviderProps> = ({
  children,
  initialData = {},
  totalSteps = 6,
}) => {
  // Form Data State
  const [formData, setFormData] = useState<CollectionFormData>({
    ...defaultFormData,
    ...initialData,
  });

  // Current Step State
  const [currentStep, setCurrentStep] = useState(1);

  // Validation State
  const [validationState, setValidationState] = useState<FormValidationState>(
    {}
  );

  // Form State
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Completed Steps
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Update Form Data
  const updateFormData = useCallback((updates: Partial<CollectionFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setIsDirty(true);
  }, []);

  // Reset Form Data
  const resetFormData = useCallback(() => {
    setFormData({ ...defaultFormData, ...initialData });
    setValidationState({});
    setCurrentStep(1);
    setCompletedSteps(new Set());
    setIsDirty(false);
  }, [initialData]);

  // Step Navigation
  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // Validation Management
  const updateValidation = useCallback(
    (
      field: string,
      isValid: boolean,
      errors: string[],
      touched: boolean = true
    ) => {
      setValidationState((prev) => ({
        ...prev,
        [field]: {
          isValid,
          errors,
          touched,
        },
      }));
    },
    []
  );

  // Check if step is valid
  const isStepValid = useCallback(
    (step: number): boolean => {
      const stepFields = getStepFields(step);
      return stepFields.every((field) => {
        const validation = validationState[field];
        return !validation || validation.isValid;
      });
    },
    [validationState]
  );

  // Step Management
  const markStepCompleted = useCallback((step: number) => {
    setCompletedSteps((prev) => new Set([...prev, step]));
  }, []);

  const markStepIncomplete = useCallback((step: number) => {
    setCompletedSteps((prev) => {
      const newSet = new Set(prev);
      newSet.delete(step);
      return newSet;
    });
  }, []);

  const contextValue: MultiPageFormContextType = {
    formData,
    updateFormData,
    resetFormData,
    currentStep,
    setCurrentStep,
    nextStep,
    previousStep,
    validationState,
    updateValidation,
    isStepValid,
    isLoading,
    setIsLoading,
    isDirty,
    setIsDirty,
    completedSteps,
    markStepCompleted,
    markStepIncomplete,
  };

  return (
    <MultiPageFormContext.Provider value={contextValue}>
      {children}
    </MultiPageFormContext.Provider>
  );
};

// Hook to use the context
export const useMultiPageForm = (): MultiPageFormContextType => {
  const context = useContext(MultiPageFormContext);
  if (!context) {
    throw new Error(
      "useMultiPageForm must be used within a MultiPageFormProvider"
    );
  }
  return context;
};

// Helper function to get fields for each step
const getStepFields = (step: number): string[] => {
  switch (step) {
    case 1:
      return ["name", "slug", "shortDescription", "description"];
    case 2:
      return ["materialType", "gemstoneType", "styleCategory"];
    case 3:
      return ["collectionMode", "conditions"];
    case 4:
      return ["images", "bannerImage"];
    case 5:
      return ["metadata.seoTitle", "metadata.seoDescription"];
    case 6:
      return ["sortOrder"];
    default:
      return [];
  }
};
