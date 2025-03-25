import React from 'react';
import { createPortal } from 'react-dom';

interface modalProps {
  children: React.ReactNode;
  classname?: string;
}

export const Modal = React.memo(
  React.forwardRef<HTMLDivElement, modalProps>(
    ({ children, classname }, ref) => {
      return createPortal(
        <>
          <div className="fixed inset-0 bg-black bg-opacity-65 z-50"></div>

          <main
            ref={ref}
            className={`${classname} fixed top-[50%] left-[50%] z-[999] bg-white   border  outline-none rounded-lg`}
            style={{
              transform: 'translate(-50%, -50%)',
            }}
          >
            {children}
          </main>
        </>,
        document.body
      );
    }
  )
);
