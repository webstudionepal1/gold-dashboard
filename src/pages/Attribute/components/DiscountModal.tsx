import React from "react";
import { createPortal } from "react-dom";

interface modalProps {
  children: React.ReactNode;
  classname?: string;
}

export const DiscountModal = React.memo(
  React.forwardRef<HTMLDivElement, modalProps>(
    ({ children, classname }, ref) => {
      return createPortal(
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-65 z-50"></div>

          {/* Modal container */}
          <main
            ref={ref}
            className={`${classname} fixed top-[50%] left-[50%] z-[999] bg-white border outline-none rounded-lg w-[90%] max-w-2xl`}
            style={{
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Scrollable content */}
            <div className="max-h-[80vh] overflow-y-auto p-6">{children}</div>
          </main>
        </>,
        document.body
      );
    }
  )
);
