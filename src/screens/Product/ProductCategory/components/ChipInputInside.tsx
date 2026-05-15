import { FieldApi } from "@tanstack/react-form";
import { KeyboardEvent, ChangeEvent } from "react";

type ChipInputProps = {
  field: any
};

const ChipInputInside = ({ field }: ChipInputProps) => {
  const inputValue = field.state.meta?.inputValue || "";

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim() !== "") {
      e.preventDefault();
      field.setValue([...field.state.value, inputValue.trim()]);
      field.setMeta((prev:any) => ({ ...prev, inputValue: "" }));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    field.setMeta((prev:any) => ({ ...prev, inputValue: value }));
  };

  const removeChip = (index: number) => {
    field.setValue(field.state.value.filter((_:void, i:number) => i !== index)) 
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border rounded min-h-[48px]">
      {field.state.value.map((chip:string, index:number) => (
        <div
          key={index}
          className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-200 rounded-full"
        >
          {chip}
          <button
            onClick={() => removeChip(index)}
            className="font-bold text-red-500"
            type="button"
          >
            ×
          </button>
        </div>
      ))}

      <input
        type="text"
        className="flex-1 min-w-[100px] p-1 focus:outline-none"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type and press Enter..."
      />
    </div>
  );
};
export default ChipInputInside;
