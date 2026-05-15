import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ScrollableModalProps {
  children: React.ReactNode;
  classname?: string;
  onClose: () => void;
  isOpen?: boolean;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "w-[90%] max-w-md",
  md: "w-[90%] max-w-2xl",
  lg: "w-[90%] max-w-4xl",
  xl: "w-[90%] max-w-6xl",
};

export const ScrollableModal = React.memo(
  React.forwardRef<HTMLDivElement, ScrollableModalProps>(
    (
      { children, classname, onClose, isOpen = true, title, size = "md" },
      ref
    ) => {
      const modalRef = useRef<HTMLDivElement | null>(null);

      useEffect(() => {
        if (typeof ref === "function") {
          ref(modalRef.current);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current =
            modalRef.current;
        }
      }, [ref]);

      useEffect(() => {
        if (!isOpen) return;
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = originalStyle;
        };
      }, [isOpen]);

      useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
          if (
            modalRef.current &&
            !modalRef.current.contains(event.target as Node)
          ) {
            onClose();
          }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [onClose, isOpen]);

      if (!isOpen) return null;

      return createPortal(
        <>
          <div className="fixed inset-0 bg-black bg-opacity-65 z-50" />
          <main
            ref={modalRef}
            className={`${classname || ""} ${sizeClasses[size]} fixed top-[50%] left-[50%] z-[999] bg-white border outline-none rounded-lg max-h-[90vh] overflow-hidden flex flex-col`}
            style={{ transform: "translate(-50%, -50%)" }}
          >
            {title ? (
              <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            ) : null}
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </main>
        </>,
        document.body
      );
    }
  )
);

ScrollableModal.displayName = "ScrollableModal";
