import React from "react";
import Header from "../../../components/shared/table_heading/Header";
import { Icon } from "@iconify/react/dist/iconify.js";
import SupplierCard from "../components/SupplierDetailCard";
import ContactCard from "../components/ContactCard";
import { useNavigate } from "react-router-dom";
import { FrontendRoutes } from "../../../routes/routes";

const itemSupplied = [
  {
    id: 1,
    text: "Necklaces",
  },
  {
    id: 2,
    text: "Earrings",
  },
  {
    id: 3,
    text: "Bracelets",
  },
  {
    id: 4,
    text: "Brooches",
  },
  {
    id: 5,
    text: "Anklets",
  },
  {
    id: 6,
    text: "Cufflinks",
  },
  {
    id: 7,
    text: "Hairpins",
  },
];

const contactDataList = [
  {
    title: "Contact Information",
    contacts: [
      { subtitle: "Contact Person", text: "Sundarlal Gurung" },
      { subtitle: "Contact Number", text: "+977-1234567890" },
      { subtitle: "Email Address", text: "SundarlalGurung@FreshFarm.com" },
    ],
  },
  {
    title: "Business Information",
    contacts: [
      { subtitle: "Business Type", text: "Agricultural Produce Supplier" },
      { subtitle: "Company Registration Number", text: "789456123" },
      { subtitle: "Permanent Account Number", text: "987654321" },
    ],
  },
  {
    title: "Delivery Information",
    contacts: [
      { subtitle: "Frequency", text: "Twice a week" },
      { subtitle: "Delivery Time", text: "9:00 AM to 11:00 AM" },
      { subtitle: "Lead Time", text: "3-5 business days" },
    ],
  },
];
const SupplierDetail = () => {
  const pinkItems = ["Necklaces", "Earrings", "Bracelets"];
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`${FrontendRoutes.SUPPLIERHISTORY}`);
  };
  return (
    <>
      <div className="container mx-auto px-8 py-3">
        <div className="mb-4">
          <Header text="Supplier Details" />
        </div>

        <div>
          <SupplierCard
            image="/test_logo.jpg"
            title="Opulent Jewel House"
            supplierType="Gold Supplier"
            location="SundarBasti, Bhangal, Kathmandu 44600"
            itemsSupplied={[
              "Necklaces",
              "Earrings",
              "Bracelets",
              "Brooches",
              "Anklets",
              "Cufflinks",
              "Hairpins",
            ]}
            buttonText="Purchase History"
            buttonClick={handleButtonClick}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-[2rem]">
          {contactDataList.map((data, index) => (
            <ContactCard
              key={index}
              title={data.title}
              contacts={data.contacts}
            />
          ))}
        </div>

        <div className="bg-[#ffffff] shadow-md rounded-xl">
          <div className="px-6 py-4">
            <div className="flex flex-col mb-6">
              <h1 className="text-[#343436] font-semibold text-xl">
                Payment Information
              </h1>
              <div className="border-b border-[#d3d9e2] my-1  " />
            </div>

            <div className="flex flex-col space-y-4 w-[50%] ">
              <div className="flex items-center justify-between">
                <div className="flex flex-col ">
                  <p className="text-[#726f7e] ">Payment Terms</p>
                  <h1 className="font-semibold text-[#585858]">Net 30 Days</h1>
                </div>
                <div className="flex flex-col ">
                  <p className="text-[#726f7e] ">Branch Name</p>
                  <h1 className="font-semibold text-[#585858]">Net 30 Days</h1>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col ">
                  <p className="text-[#726f7e] ">Bank Name</p>
                  <h1 className="font-semibold text-[#585858]">
                    Agriculture Bank of Nepal
                  </h1>
                </div>
                <div className="flex flex-col  ">
                  <p className="text-[#726f7e]  ">Account Name</p>
                  <h1 className="font-semibold text-[#585858]">
                    Agriculture Bank of Nepal
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex flex-col mt-4 ">
              <p className="text-[#726f7e] ">Account Name</p>
              <h1 className="font-semibold text-[#585858] ">
                Agriculture Bank of Nepal
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupplierDetail;
