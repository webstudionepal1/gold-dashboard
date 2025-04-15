import React from "react";

interface ToggleSliderProps {
  enabled: boolean;
  onToggle: () => void;
}

const ToggleSlider: React.FC<ToggleSliderProps> = ({ enabled, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
        enabled ? "bg-[#70e252]  " : "bg-[#ff4d4e] "
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
          enabled ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default ToggleSlider;
