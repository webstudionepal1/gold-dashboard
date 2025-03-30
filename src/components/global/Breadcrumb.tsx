import * as React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { cn } from "../../lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav className={cn("flex items-center text-sm", className)}>
      {items.map((item, index) => {
        const isLastItem = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <Icon
                icon="heroicons:chevron-right-20-solid"
                className="mx-2 text-gray-400 h-5 w-5"
              />
            )}

            {isLastItem ? (
              <span className="text-amber-600 font-medium flex items-center gap-1">
                {item.icon && <Icon icon={item.icon} className="h-4 w-4" />}
                {item.label}
              </span>
            ) : item.onClick ? (
              <button
                onClick={item.onClick}
                className="text-gray-600 hover:text-amber-600 flex items-center gap-1"
              >
                {item.icon && <Icon icon={item.icon} className="h-4 w-4" />}
                {item.label}
              </button>
            ) : (
              <a
                href={item.href || "#"}
                className="text-gray-600 hover:text-amber-600 flex items-center gap-1"
              >
                {item.icon && <Icon icon={item.icon} className="h-4 w-4" />}
                {item.label}
              </a>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};