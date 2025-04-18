// import { Icon } from "@iconify/react/dist/iconify.js";
// import React from "react";

// const InfoCard = () => {
//   return (
//     <>
//       <div className="bg-[#ffffff] border border-[#d5d9e2] rounded-lg ">
//         <div className="mx-6 my-4">
//           <div className="flex items-center justify-between">
//             <h1 className="text-xl font-semibold">Address Book</h1>
//             <button>
//               <div className="text-xl text-black cursor-pointer bg-green rounded p-1">
//                 <Icon icon="lucide:pen-line" fontSize={16} color="white" />
//               </div>
//             </button>
//           </div>
//           <div>
//             <h1 className="text-[#d07b21] font-semibold mt-4">Home</h1>
//             <div className="border-b-2 border-[#d5d9e2] my-2"></div>

//             <div className="flex items-center justify-between">
//               <h1>Address</h1>
//               <p className="text-wrap">
//                 601 Frank Stottile Blvd, Kingston NY 12401
//               </p>
//             </div>
//             <div className="flex items-center justify-between">
//               <h1>Phone no.</h1>
//               <p className="text-wrap">+977-9898989898</p>
//             </div>
//             <h1 className="text-[#d07b21] font-semibold mt-4">Home</h1>
//             <div className="border-b-2 border-[#d5d9e2] my-2"></div>
//             <div className="flex items-center justify-between">
//               <h1>Address</h1>
//               <p className="text-wrap">
//                 601 Frank Stottile Blvd, Kingston NY 12401
//               </p>
//             </div>
//             <div className="flex items-center justify-between">
//               <h1>Phone no.</h1>
//               <p className="text-wrap">+977-9898989898</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default InfoCard;

// components/InfoCard.tsx
// import React from "react";
// import { Icon } from "@iconify/react";

// type AddressEntry = {
//   label?: string;
//   address?: string;
//   phone?: string;
//   username?: string;
//   password?: string;
// };

// type InfoCardProps = {
//   title: string;
//   onEdit?: () => void;
//   entries: AddressEntry[];
// };

// const InfoCard: React.FC<InfoCardProps> = ({ title, onEdit, entries }) => {
//   return (
//     <div className="bg-white border border-[#d5d9e2] rounded-lg">
//       <div className="mx-6 my-4">
//         <div className="flex items-center justify-between">
//           <h1 className="text-xl font-semibold">{title}</h1>
//           {onEdit && (
//             <button onClick={onEdit}>
//               <div className="text-xl text-black cursor-pointer bg-green rounded p-1">
//                 <Icon icon="lucide:pen-line" fontSize={16} color="white" />
//               </div>
//             </button>
//           )}
//         </div>

//         {entries.map((entry, index) => (
//           <div key={index}>
//             <h2 className="text-[#d07b21] font-semibold mt-4">{entry.label}</h2>
//             <div className="border-b-2 border-[#d5d9e2] my-2"></div>
//             <div className="flex items-center justify-between">
//               <span>Address</span>
//               <p className="text-wrap text-right">{entry.address}</p>
//             </div>
//             <div className="flex items-center justify-between">
//               <span>Phone no.</span>
//               <p className="text-wrap text-right">{entry.phone}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default InfoCard;

import React, { useState } from "react";
import { Icon } from "@iconify/react";

type AddressEntry = {
  label?: string;
  address?: string;
  phone?: string;
  username?: string;
  password?: string;
};

type InfoCardProps = {
  title: string;
  onEdit?: () => void;
  entries: AddressEntry[];
};

const InfoCard: React.FC<InfoCardProps> = ({ title, onEdit, entries }) => {
  const [visiblePasswords, setVisiblePasswords] = useState<
    Record<number, boolean>
  >({});

  const togglePasswordVisibility = (index: number) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  return (
    <div className="bg-white border border-[#d5d9e2] rounded-lg">
      <div className="mx-6 my-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{title}</h1>
          {onEdit && (
            <button onClick={onEdit}>
              <div className="text-xl text-black cursor-pointer bg-green rounded p-1">
                <Icon icon="lucide:pen-line" fontSize={16} color="white" />
              </div>
            </button>
          )}
        </div>

        {entries.map((entry, index) => (
          <div key={index}>
            {entry.label && (
              <>
                <h2 className="text-[#d07b21] font-semibold mt-4">
                  {entry.label}
                </h2>
                <div className="border-b-2 border-[#d5d9e2] my-2"></div>
              </>
            )}
            {entry.address && (
              <div className="flex items-center justify-between">
                <span>Address</span>
                <p className="text-wrap text-right">{entry.address}</p>
              </div>
            )}
            {entry.phone && (
              <div className="flex items-center justify-between">
                <span>Phone no.</span>
                <p className="text-wrap text-right">{entry.phone}</p>
              </div>
            )}
            {entry.username && (
              <div className="flex items-center justify-between">
                <span>Username</span>
                <p className="text-wrap text-right">{entry.username}</p>
              </div>
            )}
            {entry.password && (
              <div className="flex items-center justify-between">
                <span>Password</span>
                <div className="flex items-center gap-2">
                  <p className="text-wrap text-right">
                    {visiblePasswords[index] ? entry.password : "••••••••"}
                  </p>
                  <button
                    onClick={() => togglePasswordVisibility(index)}
                    className="text-gray-600"
                  >
                    <Icon
                      icon={
                        visiblePasswords[index]
                          ? "lucide:eye-off"
                          : "lucide:eye"
                      }
                      fontSize={18}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoCard;
