// import React from "react";

// type NotificationCardProps = {
//   title: string;
//   description: string;
//   time: string;
//   buttonText?: string;
//   showCheckbox?: boolean;
//   onButtonClick?: () => void;
// };

// const NotificationCard: React.FC<NotificationCardProps> = ({
//   title,
//   description,
//   time,
//   buttonText = "View Order",
//   showCheckbox = true,
//   onButtonClick,
// }) => {
//   return (
//     <div className="border border-[#dbdce0] rounded-xl p-4 flex justify-between items-start space-x-4">
//       <div className="flex items-start space-x-4">
//         {showCheckbox && (
//           <input
//             type="checkbox"
//             className="mt-1 w-4 h-4 accent-[#DF8D28] cursor-pointer"
//           />
//         )}
//         <div>
//           <h4 className="font-semibold text-gray-800">{title}</h4>
//           <p className="text-sm text-gray-500">{description}</p>
//           <p className="text-sm text-[#DF8D28] mt-1">{time}</p>
//           <button
//             onClick={onButtonClick}
//             className="mt-2 bg-[#DF8D28] text-white text-sm px-4 py-1 rounded-md hover:opacity-90"
//           >
//             {buttonText}
//           </button>
//         </div>
//       </div>
//       <div className="mt-1">
//         <span className="w-2 h-2 inline-block bg-[#9A5000] rounded-full"></span>
//       </div>
//     </div>
//   );
// };

// export default NotificationCard;

// components/NotificationCard.tsx
import React from "react";

type NotificationCardProps = {
  title: string;
  description: string;
  time: string;
  buttonText?: string;
  showCheckbox?: boolean;
  showStatusDot?: boolean;
  statusColor?: string; // e.g., '#9A5000' or 'green'
  onButtonClick?: () => void;
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  title,
  description,
  time,
  buttonText = "View Order",
  showCheckbox = true,
  showStatusDot = true,
  statusColor = "#9A5000",
  onButtonClick,
}) => {
  return (
    <div className="border border-[#dbdce0] rounded-xl p-4 flex justify-between items-start space-x-4 my-2">
      <div className="flex items-start space-x-4">
        {showCheckbox && (
          <input
            type="checkbox"
            className="mt-10 w-4 h-4 accent-[#DF8D28] cursor-pointer"
          />
        )}
        <div>
          <h4 className="font-semibold text-gray-800">{title}</h4>
          <p className="text-sm text-gray-500">{description}</p>
          <p className="text-sm text-[#DF8D28] mt-1">{time}</p>
          <button
            onClick={onButtonClick}
            className="mt-2 bg-[#DF8D28] text-white text-sm px-4 py-1 rounded-md hover:opacity-90"
          >
            {buttonText}
          </button>
        </div>
      </div>

      {showStatusDot && (
        <div>
          <span
            className="w-2 h-2 inline-block rounded-full"
            style={{ backgroundColor: statusColor }}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationCard;
