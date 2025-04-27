import { get } from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/shared/table_heading/Header";
import { FrontendRoutes } from "../../../routes/routes";
import { useGetSupplierByIdQuery } from "../../../server/api/supplierHooks";
import ContactCard from "../components/ContactCard";
import SupplierCard from "../components/SupplierDetailCard";


const SupplierDetail = () => {
  let { id } = useParams();
  id ??= "";
  const { data: supplierData } = useGetSupplierByIdQuery(id);
  const navigate = useNavigate();
  const contactDataList = [
    {
      title: "Contact Information",
      contacts: [
        {
          subtitle: "Contact Person",
          text: get(supplierData, "contactPerson.name", "-"),
        },
        {
          subtitle: "Contact Number",
          text: get(supplierData, "contactPerson.phone", "-"),
        },
        { subtitle: "Email Address", text: get(supplierData, "email", "-") },
      ],
    },
    {
      title: "Business Information",
      contacts: [
        {
          subtitle: "Business Type",
          text: get(supplierData, "businessType", "-") || "-",
        },
        {
          subtitle: "Company Registration Number",
          text: get(supplierData, "businessInfo.company") || "-",
        },
        {
          subtitle: "Permanent Account Number",
          text: get(supplierData, "businessInfo.PAN") || "-",
        },
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
  const handleButtonClick = () => {
    navigate(`${FrontendRoutes.SUPPLIERHISTORY}`);
  };
  return (
    <>
      <div className="container mx-auto">
        <Header text="Supplier Details" />

        <div>
          <SupplierCard
            image={
              supplierData && supplierData?.logo.length > 0
                ? supplierData?.logo[0]
                : "https://via.placeholder.com/150"
            }
            title={get(supplierData, "name", "-")}
            supplierType={get(supplierData, "email", "-")}
            location={get(supplierData, "addresses.district", "-")}
            itemsSupplied={get(supplierData, "products", []).map(
              (item) => item.name
            )}
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
              <p className="text-[#343436] font-semibold text-xl">
                Payment Information
              </p>
              <div className="border-b border-[#d3d9e2] my-1  " />
            </div>

            <div className="flex flex-col space-y-4 w-[50%] ">
              <div className="flex items-center justify-between">
                <div className="flex flex-col ">
                  <p className="text-[#726f7e] ">Payment Terms</p>
                  <p className="font-semibold text-[#585858]">
                    {get(supplierData, "bankDetails.paymentTerms", "-")}
                  </p>
                </div>
                <div className="flex flex-col ">
                  <p className="text-[#726f7e] ">Branch Name</p>
                  <p className="font-semibold text-[#585858]">
                    {get(supplierData, "bankDetails.branch", "-")}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col ">
                  <p className="text-[#726f7e] ">Bank Name</p>
                  <p className="font-semibold text-[#585858]">
                    {get(supplierData, "bankDetails.bankName", "-")}
                  </p>
                </div>
                <div className="flex flex-col ">
                  <p className="text-[#726f7e]  ">Account Name</p>
                  <p className="font-semibold text-[#585858]">
                    {get(supplierData, "bankDetails.accountHolderName")}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col mt-4 ">
              <p className="text-[#726f7e] ">Account Number</p>
              <p className="font-semibold text-[#585858] ">
                {get(supplierData, "bankDetails.accountNumber", "-")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupplierDetail;
