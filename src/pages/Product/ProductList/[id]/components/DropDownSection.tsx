import { Icon } from "@iconify/react/dist/iconify.js";

export const DropdownSection: React.FC<{ title: string; isOpen: boolean; toggle: () => void; data?: Record<string, string> }> = ({ title, isOpen, toggle, data }) =>
    data ? (
        <div className="space-y-2">
            <div className="flex cursor-pointer items-center justify-between border-b" onClick={toggle}>
                <h3 className="text-sm font-semibold">{title}</h3>
                <Icon icon={isOpen ? "mdi:chevron-up" : "mdi:chevron-down"} className="h-5 w-5 transition-transform" />
            </div>
            {isOpen && (
                <div className="space-y-2 transition-all duration-300">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1">
                            <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                            <span>{value || "N/A"}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    ) : null
