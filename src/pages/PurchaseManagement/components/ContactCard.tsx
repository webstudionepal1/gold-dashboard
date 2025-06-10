// components/ui/ContactCard.tsx
import React from "react";
import { cn } from "../../../lib/utils";
import { get } from "lodash";

interface ContactInfo {
  subtitle: string;
  text: string;
}

interface ContactCardProps {
  title?: string;
  contacts: ContactInfo[];
  className?: string;
}

const ContactCard: React.FC<ContactCardProps> = ({
  title = "Contact Information",
  contacts,
  className,
}) => {
  return (
    <div className={cn("bg-white shadow-md rounded-xl", className)}>
      <div className="px-6 py-5">
        <div className="flex flex-col mb-6">
          <h1 className="text-[#343436] font-semibold text-xl">{title}</h1>
          <div className="border-b border-[#d3d9e2] my-1" />
        </div>

        <div className="flex flex-col gap-4">
          {contacts.map((contact, idx) => (
            <div key={idx} className="">
              <h2 className="text-gray-800 font-semibold text-sm">
                {contact.subtitle}
              </h2>
              <p className="text-gray-600 font-semibold text-sm">
                {get(contact, "text") !== "" ? get(contact, "text") : "-"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
