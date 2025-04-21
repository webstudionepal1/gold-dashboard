// import React, { useEffect } from "react";
// import { createPortal } from "react-dom";

// interface ScrollableModalProps {
//   children: React.ReactNode;
//   classname?: string;
// }

// export const ScrollableModal = React.memo(
//   React.forwardRef<HTMLDivElement, ScrollableModalProps>(
//     ({ children, classname }, ref) => {
//       // Prevent background scroll on mount
//       useEffect(() => {
//         const originalStyle = window.getComputedStyle(document.body).overflow;
//         document.body.style.overflow = "hidden";

//         return () => {
//           document.body.style.overflow = originalStyle;
//         };
//       }, []);

//       return createPortal(
//         <>
//           <div className="fixed inset-0 bg-black bg-opacity-65 z-50"></div>

//           <main
//             ref={ref}
//             className={`${classname} fixed top-[50%] left-[50%] z-[999] bg-white border outline-none rounded-lg max-h-[90vh] overflow-y-auto`}
//             style={{
//               transform: "translate(-50%, -50%)",
//             }}
//           >
//             {children}
//           </main>
//         </>,
//         document.body
//       );
//     }
//   )
// );

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ScrollableModalProps {
  children: React.ReactNode;
  classname?: string;
  onClose: () => void;
}

export const ScrollableModal = React.memo(
  React.forwardRef<HTMLDivElement, ScrollableModalProps>(
    ({ children, classname, onClose }, ref) => {
      const modalRef = useRef<HTMLDivElement | null>(null);

      // Combine forwarded ref with local ref
      useEffect(() => {
        if (typeof ref === "function") {
          ref(modalRef.current);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current =
            modalRef.current;
        }
      }, [ref]);

      // Prevent background scroll on mount
      useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = originalStyle;
        };
      }, []);

      // Close on outside click
      useEffect(() => {
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
      }, [onClose]);

      return createPortal(
        <>
          <div className="fixed inset-0 bg-black bg-opacity-65 z-50"></div>

          <main
            ref={modalRef}
            className={`${classname} fixed top-[50%] left-[50%] z-[999] bg-white border outline-none rounded-lg max-h-[90vh] overflow-y-auto`}
            style={{ transform: "translate(-50%, -50%)" }}
          >
            {children}
          </main>
        </>,
        document.body
      );
    }
  )
);
