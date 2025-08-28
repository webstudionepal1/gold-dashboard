import React from 'react';
import { createPortal } from 'react-dom';
import { FormLoader } from './FormLoader.component';

interface modalProps {
  children: React.ReactNode;
  classname?: string;
  blurChildren?: boolean;
  showLoader?: boolean;
}

export const Modal = React.memo(
  React.forwardRef<HTMLDivElement, modalProps>(
    ({ children, classname, blurChildren = false, showLoader = false }, ref) => {
      return createPortal(
        <>
          {/* backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-65 z-50"></div>

          {/* modal */}
          <main
            ref={ref}
            className={`
              ${classname} 
              fixed top-1/2 left-1/2 z-[999] 
              bg-white border outline-none rounded-lg shadow-lg
              w-[90%] max-w-md sm:max-w-lg md:max-w-xl 
              max-h-[90vh] overflow-y-auto
            `}
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
