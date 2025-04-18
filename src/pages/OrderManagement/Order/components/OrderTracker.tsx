// import { useState } from "react";

// export default function OrderTracker() {
//   const [currentStep, setCurrentStep] = useState(0);

//   const steps = [
//     {
//       id: 0,
//       name: "Pending",
//       icon: () => (
//         <div className="flex items-center justify-center w-10 h-10 bg-amber-500 rounded-full">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-6 h-6 text-white"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//         </div>
//       ),
//     },
//     {
//       id: 1,
//       name: "Confirm",
//       icon: () => (
//         <div
//           className={`flex items-center justify-center w-10 h-10 ${
//             currentStep >= 1 ? "bg-amber-500" : "bg-gray-300"
//           } rounded-full`}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-6 h-6 text-white"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M5 13l4 4L19 7"
//             />
//           </svg>
//         </div>
//       ),
//     },
//     {
//       id: 2,
//       name: "Order Handover",
//       icon: () => (
//         <div
//           className={`flex items-center justify-center w-10 h-10 ${
//             currentStep >= 2 ? "bg-amber-500" : "bg-gray-300"
//           } rounded-full`}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-6 h-6 text-white"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
//             />
//           </svg>
//         </div>
//       ),
//     },
//     {
//       id: 3,
//       name: "Delivery Completion",
//       icon: () => (
//         <div
//           className={`flex items-center justify-center w-10 h-10 ${
//             currentStep >= 3 ? "bg-amber-500" : "bg-gray-300"
//           } rounded-full`}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-6 h-6 text-white"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
//             />
//           </svg>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="  mx-auto p-6 bg-white rounded-lg shadow-sm">
//       <h2 className="text-xl font-bold text-gray-800 mb-6">Track Order</h2>
//       <div className="border-t border-gray-200 pt-6">
//         <div className="relative flex items-center">
//           {/* Step 1 */}
//           <div className="flex flex-col items-center">
//             {steps[0].icon()}
//             <p
//               className={`mt-2 text-sm ${
//                 currentStep === 0
//                   ? "text-amber-500 font-medium"
//                   : "text-gray-400"
//               }`}
//             >
//               {steps[0].name}
//             </p>
//           </div>

//           {/* Dotted line 1 */}
//           <div className="flex-1 mx-4 mb-[1rem]">
//             <div
//               className={`h-0.5 w-full border-t-2 border-dotted ${
//                 currentStep > 0 ? "border-amber-500" : "border-gray-300"
//               }`}
//             ></div>
//           </div>

//           {/* Step 2 */}
//           <div className="flex flex-col items-center">
//             {steps[1].icon()}
//             <p
//               className={`mt-2 text-sm ${
//                 currentStep === 1
//                   ? "text-amber-500 font-medium"
//                   : "text-gray-400"
//               }`}
//             >
//               {steps[1].name}
//             </p>
//           </div>

//           {/* Dotted line 2 */}
//           <div className="flex-1 mx-4 mb-[1rem]">
//             <div
//               className={`h-0.5 w-full border-t-2  border-dotted ${
//                 currentStep > 1 ? "border-amber-500" : "border-gray-300"
//               }`}
//             ></div>
//           </div>

//           {/* Step 3 */}
//           <div className="flex flex-col items-center">
//             {steps[2].icon()}
//             <p
//               className={`mt-2 text-sm ${
//                 currentStep === 2
//                   ? "text-amber-500 font-medium"
//                   : "text-gray-400"
//               }`}
//             >
//               {steps[2].name}
//             </p>
//           </div>

//           {/* Dotted line 3 */}
//           <div className="flex-1 mx-4 mb-[1rem]">
//             <div
//               className={`h-0.5 w-full border-t-2  border-dotted ${
//                 currentStep > 2 ? "border-amber-500" : "border-gray-300"
//               }`}
//             ></div>
//           </div>

//           {/* Step 4 */}
//           <div className="flex flex-col items-center">
//             {steps[3].icon()}
//             <p
//               className={`mt-2 text-sm ${
//                 currentStep === 3
//                   ? "text-amber-500 font-medium"
//                   : "text-gray-400"
//               }`}
//             >
//               {steps[3].name}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";

interface Step {
  id: number;
  name: string;
  icon?: React.ReactNode;
}

interface OrderTrackerProps {
  steps: Step[];
  currentStep: number;
}

export default function OrderTracker({
  steps,
  currentStep,
}: OrderTrackerProps) {
  return (
    <div className="mx-auto p-6 bg-white rounded-lg border-2 border-[#d5d9e2]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Track Order</h2>
      <div className="border-t border-gray-200 pt-6">
        <div className="relative flex items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= step.id ? "bg-amber-500" : "bg-gray-300"
                  }`}
                >
                  {step.icon ? (
                    step.icon
                  ) : (
                    <DefaultIcon current={currentStep >= step.id} />
                  )}
                </div>
                <p
                  className={`mt-2 text-sm ${
                    currentStep === step.id
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
                      currentStep > step.id
                        ? "border-amber-500"
                        : "border-gray-300"
                    }`}
                  ></div>
                </div>
              )}
            </React.Fragment>
          ))}
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
