import React, { createContext, useContext, useState, useCallback } from "react";

// Product Variant Interface - Stock fields removed as they're not needed
export interface ProductVariant {
  sku?: string;
  price: number;
  wt: number;
  unit: "grams" | "kg" | "pieces" | "carats";
  costPrice?: number;
  isActive: boolean;
}

// Product Stone Interface
export interface ProductStone {
  name: string;
  weight: number; // in carats
  price: number;
  color: string;
}

// Other Charge Interface
export interface OtherCharge {
  name: string;
  price: number;
}

// Product Form Data Interface
export interface ProductFormData {
  // Page 1: Basic Information
  name: string;
  slug?: string;
  description: string;
  productType?: "normal" | "diamond" | "gold" | "silver";
  category: string;
  existingImages?: string[];

  // Page 2: Product Specifications
  length: number;
  claspType?: string;
  rhodoumFinishes: boolean;
  shape: string;
  quantity: number;
  totalCarat?: number;
  color?: string;
  clarity: string;
  dimension: number;
  gender?: "male" | "female" | "unisex";
  makingCharges: number;

  // Wastage
  wastage?: {
    type: "fixed" | "per";
    value: number;
  };

  // Page 3: Product Variants
  variants: ProductVariant[];

  // Page 4: Stones and Occasions
  stones?: ProductStone[];
  occasions?: string[];

  // Other Charges
  otherCharges?: OtherCharge[];

  // Page 5: Media Assets
  images: (string | File)[];

  // Page 6: SEO & Marketing
  tags: string[];
  visibleAs: string[];
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
    vendor?: string;
    barcode?: string;
    compareAtPrice?: number;
  };

  // Page 7: Inventory & Status
  isActive: boolean;
  isFeatured: boolean;
}

// Validation State Interface
interface FieldValidationState {
  isValid: boolean;
  errors: string[];
  touched?: boolean;
}

interface FormValidationState {
  [fieldName: string]: FieldValidationState;
}

// Context Interface
interface ProductFormContextType {
  // Form Data
  formData: ProductFormData;
  updateFormData: (updates: Partial<ProductFormData>) => void;
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
const defaultFormData: ProductFormData = {
  // Page 1: Basic Information
  name: "",
  slug: "",
  description: "",
  productType: "gold",
  category: "",

  // Page 2: Product Specifications
  length: 0,
  claspType: "",
  rhodoumFinishes: false,
  shape: "",
  quantity: 0,
  totalCarat: 0,
  color: "",
  clarity: "",
  dimension: 0,
  gender: undefined,
  makingCharges: 0,

  // Wastage
  wastage: undefined,

  // Page 3: Product Variants
  variants: [
    {
      sku: "",
      price: 0,
      wt: 0,
      unit: "grams",
      isActive: true,
    },
  ],

  // Page 4: Stones and Occasions
  stones: [],
  occasions: [],

  // Other Charges
  otherCharges: [],

  // Page 5: Media Assets
  images: [],

  // Page 6: SEO & Marketing
  tags: [],
  visibleAs: ["normal"],
  metadata: {
    seoTitle: "",
    seoDescription: "",
    keywords: [],
    vendor: "",
    barcode: "",
    compareAtPrice: 0,
  },

  // Page 7: Inventory & Status
  isActive: true,
  isFeatured: false,
};

// Create Context
const ProductFormContext = createContext<ProductFormContextType | undefined>(
  undefined
);

// Provider Component
interface ProductFormProviderProps {
  children: React.ReactNode;
  initialData?: Partial<ProductFormData>;
  totalSteps?: number;
}

export const ProductFormProvider: React.FC<ProductFormProviderProps> = ({
  children,
  initialData = {},
  totalSteps = 7,
}) => {
  // Form Data State
  const [formData, setFormData] = useState<ProductFormData>({
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

  // Step Management
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Update form data
  const updateFormData = useCallback((updates: Partial<ProductFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setIsDirty(true);
  }, []);

  // Reset form data
  const resetFormData = useCallback(() => {
    setFormData({ ...defaultFormData, ...initialData });
    setValidationState({});
    setCurrentStep(1);
    setCompletedSteps(new Set());
    setIsDirty(false);
  }, [initialData]);

  // Navigation functions
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

  // Validation functions
  const updateValidation = useCallback(
    (field: string, isValid: boolean, errors: string[], touched = true) => {
      setValidationState((prev) => ({
        ...prev,
        [field]: { isValid, errors, touched },
      }));
    },
    []
  );

  // Step completion management
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

  const contextValue: ProductFormContextType = {
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
    <ProductFormContext.Provider value={contextValue}>
      {children}
    </ProductFormContext.Provider>
  );
};

// Hook to use the context
export const useProductForm = (): ProductFormContextType => {
  const context = useContext(ProductFormContext);
  if (!context) {
    throw new Error("useProductForm must be used within a ProductFormProvider");
  }
  return context;
};

// Helper function to get fields for each step
const getStepFields = (step: number): string[] => {
  switch (step) {
    case 1:
      return ["name", "description", "category", "subCategory"];
    case 2:
      return ["length", "shape", "clarity", "dimension", "gender"];
    case 3:
      return ["variants"];
    case 4:
      return ["stones", "occasions"];
    case 5:
      return ["images"];
    case 6:
      return ["tags", "visibleAs"];
    case 7:
      return ["isActive"];
    default:
      return [];
  }
};
