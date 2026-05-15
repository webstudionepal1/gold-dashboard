import React from "react";
import { Icon } from "@iconify/react";
import { cn } from "../../../lib/utils";

type SupplierCardProps = {
  image: string;
  title: string;
  supplierType: string;
  location: string;
  itemsSupplied: string[];
  buttonText?: string;
  buttonClick?: () => void;
};

const pinkItems = ["Necklaces", "Earrings", "Bracelets"];

const SupplierCard: React.FC<SupplierCardProps> = ({
  image,
  title,
  supplierType,
  location,
  itemsSupplied,
  buttonText,
  buttonClick,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md">
      <div className="px-4 py-3 flex items-center gap-8">
        <div>
          <img src={image} alt="Logo" height={400} width={200} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-[12rem]">
            <div className="flex flex-col gap-4 mt-1">
              <h1 className="text-2xl font-bold">{title}</h1>
              <div className="flex items-center gap-4 text-[#585858]">
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:building" width={16} height={16} />
                  <p className="text-sm">{supplierType}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="proicons:location" width={16} height={16} />
                  <p className="text-sm">{location}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={buttonClick}
                className="text-[#db872b] border-2 border-[#db872b] px-3 py-2 rounded-md"
              >
                {buttonText}
              </button>
              <button className="text-[#726f82] border-2 border-[#cfcfcf] px-3 py-2 text-sm rounded-md flex items-center gap-2">
                <Icon icon="lucide:edit" width={16} height={16} /> Edit
              </button>
            </div>
          </div>

          <div className="border-2 border-[#c8d2db] rounded-xl">
            <div className="px-5 py-3">
              <h1 className="text-xl font-semibold mb-2">Items Supplied</h1>
              <div className="flex items-center gap-2 flex-wrap">
                {itemsSupplied.map((item, index) => {
                  const isPink = pinkItems.includes(item);
                  return (
                    <p
                      key={index}
                      className={cn(
                        "px-3 py-2 text-sm rounded-xl",
                        isPink
                          ? "bg-[#fef2f2] text-[#d02b51]"
                          : "bg-[#f4ebfc] text-[#9850cb]"
                      )}
                    >
                      {item}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierCard;
