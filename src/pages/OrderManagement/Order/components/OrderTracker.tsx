// import React from "react";

// interface Step {
//   id: number;
//   name: string;
//   icon?: React.ReactNode;
// }

// interface OrderTrackerProps {
//   steps: Step[];
//   currentStep: number;
//   cancelledClassName?: string;
// }

// export default function OrderTracker({
//   steps,
//   currentStep,
//   cancelledClassName,
// }: OrderTrackerProps) {
//   return (
//     <div className="mx-auto p-6 bg-white rounded-lg border-2 border-[#d5d9e2]">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Track Order</h2>
//       <div className="border-t border-gray-200 pt-6">
//         <div className="relative flex items-center">
//           {steps.map((step, index) => (
//             <React.Fragment key={step.id}>
//               <div className="flex flex-col items-center">
//                 <div
//                   className={`flex items-center justify-center w-10 h-10 rounded-full ${
//                     currentStep >= step.id ? "bg-amber-500" : "bg-gray-300"
//                   }`}
//                 >
//                   {step.icon ? (
//                     step.icon
//                   ) : (
//                     <DefaultIcon current={currentStep >= step.id} />
//                   )}
//                 </div>
//                 <p
//                   className={`mt-2 text-sm ${
//                     currentStep === step.id
//                       ? "text-amber-500 font-medium"
//                       : "text-gray-400"
//                   }`}
//                 >
//                   {step.name}
//                 </p>
//               </div>

//               {/* Dotted Line Between Steps */}
//               {index !== steps.length - 1 && (
//                 <div className="flex-1 mx-4 mb-[1rem]">
//                   <div
//                     className={`h-0.5 w-full border-t-2 border-dotted ${
//                       currentStep > step.id
//                         ? "border-amber-500"
//                         : "border-gray-300"
//                     }`}
//                   ></div>
//                 </div>
//               )}
//             </React.Fragment>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Default clock icon
// const DefaultIcon = ({ current }: { current: boolean }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className="w-6 h-6 text-white"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//     />
//   </svg>
// );

import React from "react";

interface Step {
  id: number;
  name: string;
  icon?: React.ReactNode;
}

interface OrderTrackerProps {
  steps: Step[];
  currentStep: number;
  cancelledBg?: string;
  cancelledBorder?: string;
  cancelledText?: string;
}

export default function OrderTracker({
  steps,
  currentStep,
  cancelledBg,
  cancelledBorder,
  cancelledText,
}: OrderTrackerProps) {
  return (
    <div className="mx-auto p-4 bg-white rounded-lg border-2 border-[#d5d9e2]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Track Order</h2>
      <div className="border-t border-gray-200 pt-6">
        <div className="relative flex items-center">
          {steps.map((step, index) => {
            const isCancelledStep =
              step.id === 3 && cancelledBg && cancelledBorder;
            const isActive = currentStep >= step.id;
            const isCurrent = currentStep === step.id;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      isCancelledStep
                        ? cancelledBg
                        : isActive
                        ? "bg-amber-500"
                        : "bg-gray-300"
                    }`}
                  >
                    {step.icon ? step.icon : <DefaultIcon current={isActive} />}
                  </div>
                  <p
                    className={`mt-2 text-sm ${
                      isCancelledStep
                        ? cancelledText
                        : isCurrent
                        ? "text-amber-500 font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    {step.name}
                  </p>
                </div>

                {/* Dotted Line Between Steps */}
                {index !== steps.length - 1 && (
                  <div className="flex-1 mx-4 mb-[1rem]">
                    <div
                      className={`h-0.5 w-full border-t-2 border-dotted ${
                        isCancelledStep
                          ? cancelledBorder
                          : currentStep > step.id
                          ? "border-amber-500"
                          : "border-gray-300"
                      }`}
                    ></div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Default clock icon
const DefaultIcon = ({ current }: { current: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
