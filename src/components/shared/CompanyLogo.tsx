import React from "react";
import clsx from "clsx";
import { useGetMainCompanyQuery } from "../../server/api/companyHooks";

interface CompanyLogoProps {
  className?: string;
  alt?: string;
  fallbackSrc?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showLoadingState?: boolean;
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({
  className,
  alt,
  fallbackSrc = "/companylogo.png",
  size = "md",
  showLoadingState = true,
}) => {
  const { data: company, isLoading, error } = useGetMainCompanyQuery();

  // Get the company logo URL
  const getLogoUrl = () => {
    if (company?.logo && company.logo.length > 0) {
      const logoPath = company.logo[0];
      // Check if it's already a full URL or needs the base URL
      if (logoPath.startsWith("http")) {
        return logoPath;
      }
      //get the url from the env
      const backendUrl = import.meta.env.VITE_API_LOCAL_URL;
      return `${backendUrl}${logoPath}`;
    }
    return fallbackSrc;
  };

  // Size classes
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  // Show loading state if enabled and data is loading
  if (isLoading && showLoadingState) {
    return (
      <div
        className={clsx(
          "animate-pulse bg-gray-200 rounded",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <img
      src={getLogoUrl()}
      alt={alt || company?.companyName || company?.name || "Company Logo"}
      className={clsx(
        "object-contain transition-all duration-300",
        sizeClasses[size],
        className
      )}
      onError={(e) => {
        // Fallback to default logo if the company logo fails to load
        const target = e.target as HTMLImageElement;
        if (target.src !== fallbackSrc) {
          target.src = fallbackSrc;
        }
      }}
    />
  );
};

export default CompanyLogo;
