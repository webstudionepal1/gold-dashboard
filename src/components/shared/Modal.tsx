import React from 'react';
import { createPortal } from 'react-dom';
import { FormLoader } from './FormLoader.component';

interface modalProps {
  children: React.ReactNode;
  classname?: string;
  blurChildren?: boolean; // New prop to control blur effect
  showLoader?: boolean;
}

export const Modal = React.memo(
  React.forwardRef<HTMLDivElement, modalProps>(
    (
      { children, classname, blurChildren = false, showLoader = false },
      ref
    ) => {
      return createPortal(
        <>
          <div className="fixed inset-0 bg-black bg-opacity-65 z-50"></div>

          <main
            ref={ref}
            className={`${classname} fixed top-[50%] left-[50%] z-[999] bg-white border outline-none rounded-lg`}
            style={{
              transform: 'translate(-50%, -50%)',
            }}
          >
            {showLoader && (
              <FormLoader variant="linear" isLoading={showLoader} />
            )}

            <div
              className={blurChildren ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {children}
            </div>
          </main>
        </>,
        document.body
      );
    }
  )
);
