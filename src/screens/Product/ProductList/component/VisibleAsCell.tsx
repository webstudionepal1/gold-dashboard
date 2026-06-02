import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const VISIBILITY_OPTIONS = [
  { value: "public", label: "Public" },
  { value: "BestSellers", label: "BestSellers" },
  { value: "Featured", label: "Featured" },
  { value: "Popular", label: "Popular" },
  { value: "NewArrivals", label: "NewArrivals" },
  { value: "Recommended", label: "Recommended" },
];

const TAG_COLORS: Record<string, string> = {
  BestSellers: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Featured: "bg-blue-100 text-blue-800 border-blue-200",
  Popular: "bg-purple-100 text-purple-800 border-purple-200",
  NewArrivals: "bg-green-100 text-green-800 border-green-200",
  Recommended: "bg-pink-100 text-pink-800 border-pink-200",
  public: "bg-gray-100 text-gray-700 border-gray-200",
};

function parseVisibleAs(value: string | undefined): string[] {
  if (!value) return ["public"];
  const parts = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : ["public"];
}

interface Props {
  productId: string;
  visibleAs: string | undefined;
  onSave: (productId: string, newValue: string) => void;
  saving?: boolean;
}

const VisibleAsCell: React.FC<Props> = ({
  productId,
  visibleAs,
  onSave,
  saving,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(
    parseVisibleAs(visibleAs)
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(parseVisibleAs(visibleAs));
  }, [visibleAs]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = (value: string) => {
    setSelected((prev) => {
      if (value === "public") return ["public"];
      const withoutPublic = prev.filter((v) => v !== "public");
      if (withoutPublic.includes(value)) {
        const next = withoutPublic.filter((v) => v !== value);
        return next.length === 0 ? ["public"] : next;
      }
      return [...withoutPublic, value];
    });
  };

  const handleSave = () => {
    onSave(productId, selected.join(","));
    setOpen(false);
  };

  const handleCancel = () => {
    setSelected(parseVisibleAs(visibleAs));
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={saving}
        className="flex flex-wrap gap-1 items-center min-w-[100px] max-w-[180px] cursor-pointer group"
        title="Click to change visibility"
      >
        {selected.map((tag) => (
          <span
            key={tag}
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-medium border ${
              TAG_COLORS[tag] ?? "bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            {tag}
          </span>
        ))}
        <Icon
          icon="material-symbols:edit-outline"
          className="w-3 h-3 text-gray-400 group-hover:text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </button>

      {open && (
        <div className="absolute z-50 left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-500 border-b">
            Visible as
          </div>
          <div className="py-1">
            {VISIBILITY_OPTIONS.map((opt) => {
              const checked = selected.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(opt.value)}
                    className="accent-amber-500 w-3.5 h-3.5"
                  />
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full border font-medium ${
                      TAG_COLORS[opt.value] ??
                      "bg-gray-100 text-gray-700 border-gray-200"
                    }`}
                  >
                    {opt.label}
                  </span>
                </label>
              );
            })}
          </div>
          <div className="flex gap-2 px-3 py-2 border-t bg-gray-50 rounded-b-lg">
            <button
              onClick={handleSave}
              className="flex-1 py-1 text-xs bg-amber-500 hover:bg-amber-600 text-white rounded font-medium transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 py-1 text-xs bg-white hover:bg-gray-100 text-gray-600 border border-gray-200 rounded font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisibleAsCell;
