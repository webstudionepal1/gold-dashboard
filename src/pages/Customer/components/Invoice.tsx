// import React from "react";
// export interface InvoiceItem {
//   name: string;
//   weight: number;
//   purity: string;
//   makingCharge: number;
//   ratePerGram: number;
//   total: number;
// }

// export interface InvoiceData {
//   invoiceNumber: string;
//   date: string;
//   customerName: string;
//   customerPhone?: string;
//   customerAddress?: string;
//   items: InvoiceItem[];
//   discount?: number;
//   taxRate?: number;
//   shopName: string;
//   shopAddress: string;
//   shopPhone: string;
// }
// interface Props {
//   data: InvoiceData;
// }

// const Invoice: React.FC<Props> = ({ data }) => {
//   const subtotal = data.items.reduce((sum, item) => sum + item.total, 0);
//   const discount = data.discount || 0;
//   const taxRate = data.taxRate || 0;
//   const taxAmount = ((subtotal - discount) * taxRate) / 100;
//   const grandTotal = subtotal - discount + taxAmount;

//   return (
//     <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl text-sm text-gray-800 font-sans">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">{data.shopName}</h1>
//           <p className="text-xs text-gray-500">{data.shopAddress}</p>
//           <p className="text-xs text-gray-500">Phone: {data.shopPhone}</p>
//         </div>
//         <div className="text-right">
//           <h2 className="text-xl font-semibold">Invoice</h2>
//           <p>
//             Invoice #: <strong>{data.invoiceNumber}</strong>
//           </p>
//           <p>
//             Date: <strong>{data.date}</strong>
//           </p>
//         </div>
//       </div>

//       {/* Customer Info */}
//       <div className="mb-6">
//         <p>
//           <strong>Customer:</strong> {data.customerName}
//         </p>
//         {data.customerPhone && (
//           <p>
//             <strong>Phone:</strong> {data.customerPhone}
//           </p>
//         )}
//         {data.customerAddress && (
//           <p>
//             <strong>Address:</strong> {data.customerAddress}
//           </p>
//         )}
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="p-2 border">Item</th>
//               <th className="p-2 border">Weight (g)</th>
//               <th className="p-2 border">Purity</th>
//               <th className="p-2 border">Making Charge</th>
//               <th className="p-2 border">Rate/gram</th>
//               <th className="p-2 border">Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.items.map((item, i) => (
//               <tr key={i}>
//                 <td className="p-2 border">{item.name}</td>
//                 <td className="p-2 border">{item.weight}</td>
//                 <td className="p-2 border">{item.purity}</td>
//                 <td className="p-2 border">{item.makingCharge}</td>
//                 <td className="p-2 border">{item.ratePerGram}</td>
//                 <td className="p-2 border">{item.total}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Summary */}
//       <div className="flex justify-end mt-8">
//         <div className="w-full sm:w-1/2 md:w-1/3">
//           <div className="flex justify-between py-1">
//             <span>Subtotal:</span>
//             <span>Rs. {subtotal}</span>
//           </div>
//           {discount > 0 && (
//             <div className="flex justify-between py-1">
//               <span>Discount:</span>
//               <span>Rs. {discount}</span>
//             </div>
//           )}
//           {taxRate > 0 && (
//             <div className="flex justify-between py-1">
//               <span>Tax ({taxRate}%):</span>
//               <span>Rs. {taxAmount.toFixed(2)}</span>
//             </div>
//           )}
//           <div className="border-t mt-2 pt-2 flex justify-between font-bold text-lg">
//             <span>Total:</span>
//             <span>Rs. {grandTotal.toFixed(2)}</span>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <p className="mt-12 text-xs text-center text-gray-500">
//         Thank you for your purchase!
//       </p>
//     </div>
//   );
// };

// export default Invoice;

// import dayjs from "dayjs";
// import React from "react";

// export interface InvoiceItem {
//   name: string;
//   description?: string; // Optional description for each item
//   quantity: number; // Added quantity field
//   weight: number; // Weight in grams
//   purity: string; // Purity of the item (e.g., 22K)
//   makingCharge: number; // Making charges for the item
//   ratePerGram: number; // Rate per gram
//   total: number; // Total cost for this item (quantity * ratePerGram + makingCharge)
// }

// export interface InvoiceData {
//   invoiceNumber: string;
//   date: string; // Date the invoice was created
//   dueDate?: string; // Payment due date
//   customerName: string;
//   customerPhone?: string;
//   customerAddress?: string;
//   items: InvoiceItem[];
//   discount?: number; // Discount on the total
//   taxRate?: number; // Tax rate applied to the subtotal
//   shopName?: string;
//   shopAddress: string;
//   shopPhone: string;
//   shopGSTNumber?: string; // GST Number for the shop (if applicable)
//   paymentMethod?: string; // Payment method (e.g., Credit Card, Cash)
//   notes?: string; // Additional notes or terms
// }

// interface Props {
//   data: InvoiceData;
// }

// const Invoice: React.FC<Props> = ({ data }) => {
//   const subtotal = data.items.reduce((sum, item) => sum + item.total, 0);
//   const discount = data.discount || 0;
//   const taxRate = data.taxRate || 0;
//   const taxAmount = ((subtotal - discount) * taxRate) / 100;
//   const grandTotal = subtotal - discount + taxAmount;

//   return (
//     <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl text-sm text-gray-800 font-sans">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <div>
//             <img
//               src="/barun_gems_logo.png"
//               alt="Barun Gems Logo"
//               height={200}
//               width={200}
//             />
//             {/* <h1 className="text-2xl font-bold text-gray-900">
//               {data.shopName}
//             </h1> */}
//           </div>
//           <p className="text-xs text-gray-500">{data.shopAddress}</p>
//           <p className="text-xs text-gray-500">Phone: {data.shopPhone}</p>
//           {data.shopGSTNumber && (
//             <p className="text-xs text-gray-500">
//               GST No: {data.shopGSTNumber}
//             </p>
//           )}
//         </div>
//         <div className="text-right">
//           <h2 className="text-xl font-semibold">Invoice</h2>
//           <p>
//             Invoice #: <strong>{data.invoiceNumber}</strong>
//           </p>
//           <p>
//             Date: <strong>{dayjs(data.date).format("YYYY-MM-DD")}</strong>
//           </p>
//           {/* <p>
//             Due Date: <strong>{data.dueDate}</strong>
//           </p> */}
//         </div>
//       </div>

//       {/* Customer Info */}
//       <div className="mb-6">
//         <p>
//           <strong>Customer:</strong> {data.customerName}
//         </p>
//         {data.customerPhone && (
//           <p>
//             <strong>Phone:</strong> {data.customerPhone}
//           </p>
//         )}
//         {data.customerAddress && (
//           <p>
//             <strong>Address:</strong> {data.customerAddress}
//           </p>
//         )}
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="p-2 border">Item</th>
//               {/* <th className="p-2 border">Description</th> */}
//               <th className="p-2 border">Quantity</th>
//               <th className="p-2 border">Weight (g)</th>
//               {/* <th className="p-2 border">Purity</th> */}
//               <th className="p-2 border">Making Charge</th>
//               <th className="p-2 border">Rate/gram</th>
//               <th className="p-2 border">Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.items.map((item, i) => (
//               <tr key={i}>
//                 <td className="p-2 border">{item.name}</td>
//                 {/* <td className="p-2 border">{item.description || "-"}</td> */}
//                 <td className="p-2 border">{item.quantity}</td>
//                 <td className="p-2 border">{item.weight}</td>
//                 {/* <td className="p-2 border">{item.purity}</td> */}
//                 <td className="p-2 border">{item.makingCharge}</td>
//                 <td className="p-2 border">{item.ratePerGram}</td>
//                 <td className="p-2 border">{item.total}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Summary */}
//       <div className="flex justify-end mt-8">
//         <div className="w-full sm:w-1/2 md:w-1/3">
//           <div className="flex justify-between py-1">
//             <span>Subtotal:</span>
//             <span>Rs. {subtotal}</span>
//           </div>
//           {discount > 0 && (
//             <div className="flex justify-between py-1">
//               <span>Discount:</span>
//               <span>Rs. {discount}</span>
//             </div>
//           )}
//           {taxRate > 0 && (
//             <div className="flex justify-between py-1">
//               <span>Tax ({taxRate}%):</span>
//               <span>Rs. {taxAmount.toFixed(2)}</span>
//             </div>
//           )}
//           <div className="border-t mt-2 pt-2 flex justify-between font-bold text-lg">
//             <span>Total:</span>
//             <span>Rs. {grandTotal.toFixed(2)}</span>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="mt-8">
//         {data.paymentMethod && (
//           <div className="mb-4">
//             <strong>Payment Method:</strong> {data.paymentMethod}
//           </div>
//         )}
//         {/* {data.notes && (
//           <div className="mb-4">
//             <strong>Notes:</strong> {data.notes}
//           </div>
//         )} */}
//         <p className="mt-12 text-xs text-center text-gray-500">
//           Thank you for your purchase! Please make payment by the due date.
//         </p>
//         <p className="mt-2 text-xs text-center text-gray-500">
//           Bank details: <strong>XYZ Bank, Account Number: 123456789</strong>
//         </p>
//       </div>

//       <div className="flex justify-end mt-6 gap-4">
//         <button
//           onClick={() => console.log("Print")}
//           className="px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-600 transition"
//         >
//           Print
//         </button>
//         <button
//           onClick={() => console.log("hello")}
//           className="px-4 py-2 bg-[#df8d29] text-white rounded-lg hover:bg-[#c6893f] transition"
//         >
//           Export
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Invoice;

import dayjs from "dayjs";
import React from "react";
import html2pdf from "html2pdf.js";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export interface InvoiceItem {
  name: string;
  description?: string; // Optional description for each item
  quantity: number; // Added quantity field
  weight: number; // Weight in grams
  purity: string; // Purity of the item (e.g., 22K)
  makingCharge: number; // Making charges for the item
  ratePerGram: number; // Rate per gram
  total: number; // Total cost for this item (quantity * ratePerGram + makingCharge)
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string; // Date the invoice was created
  dueDate?: string; // Payment due date
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  items: InvoiceItem[];
  discount?: number; // Discount on the total
  taxRate?: number; // Tax rate applied to the subtotal
  shopName?: string;
  shopAddress: string;
  shopPhone: string;
  shopGSTNumber?: string; // GST Number for the shop (if applicable)
  paymentMethod?: string; // Payment method (e.g., Credit Card, Cash)
  notes?: string; // Additional notes or terms
}

interface Props {
  data: InvoiceData;
}

const Invoice: React.FC<Props> = ({ data }) => {
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
  });
  const subtotal = data.items.reduce((sum, item) => sum + item.total, 0);
  const discount = data.discount || 0;
  const taxRate = data.taxRate || 0;
  const taxAmount = ((subtotal - discount) * taxRate) / 100;
  const grandTotal = subtotal - discount + taxAmount;

  const handleExportPDF = () => {
    if (contentRef.current) {
      html2pdf()
        .set({
          margin: 0.5,
          filename: `${"invoice"}.pdf`,
          image: { tyep: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .from(contentRef.current)
        .save();
    }
  };
  return (
    <div>
      <div
        className="max-w-4xl mx-auto p-8 bg-white rounded-xl text-sm text-gray-800 font-sans"
        ref={contentRef}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div>
              <img
                src="/barun_gems_logo.png"
                alt="Barun Gems Logo"
                height={200}
                width={200}
              />
              {/* <h1 className="text-2xl font-bold text-gray-900">
              {data.shopName}
            </h1> */}
            </div>
            <p className="text-xs text-gray-500">{data.shopAddress}</p>
            <p className="text-xs text-gray-500">Phone: {data.shopPhone}</p>
            {data.shopGSTNumber && (
              <p className="text-xs text-gray-500">
                GST No: {data.shopGSTNumber}
              </p>
            )}
          </div>
          <div className="text-right">
            <h2 className="text-xl font-semibold">Invoice</h2>
            <p>
              Invoice #: <strong>{data.invoiceNumber}</strong>
            </p>
            <p>
              Date: <strong>{dayjs(data.date).format("YYYY-MM-DD")}</strong>
            </p>
            {/* <p>
            Due Date: <strong>{data.dueDate}</strong>
          </p> */}
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-6">
          <p>
            <strong>Customer:</strong> {data.customerName}
          </p>
          {data.customerPhone && (
            <p>
              <strong>Phone:</strong> {data.customerPhone}
            </p>
          )}
          {data.customerAddress && (
            <p>
              <strong>Address:</strong> {data.customerAddress}
            </p>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Item</th>
                {/* <th className="p-2 border">Description</th> */}
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Weight (g)</th>
                {/* <th className="p-2 border">Purity</th> */}
                <th className="p-2 border">Making Charge</th>
                <th className="p-2 border">Rate/gram</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, i) => (
                <tr key={i}>
                  <td className="p-2 border">{item.name}</td>
                  {/* <td className="p-2 border">{item.description || "-"}</td> */}
                  <td className="p-2 border">{item.quantity}</td>
                  <td className="p-2 border">{item.weight}</td>
                  {/* <td className="p-2 border">{item.purity}</td> */}
                  <td className="p-2 border">{item.makingCharge}</td>
                  <td className="p-2 border">{item.ratePerGram}</td>
                  <td className="p-2 border">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-end mt-8">
          <div className="w-full sm:w-1/2 md:w-1/3">
            <div className="flex justify-between py-1">
              <span>Subtotal:</span>
              <span>Rs. {subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between py-1">
                <span>Discount:</span>
                <span>Rs. {discount}</span>
              </div>
            )}
            {taxRate > 0 && (
              <div className="flex justify-between py-1">
                <span>Tax ({taxRate}%):</span>
                <span>Rs. {taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t mt-2 pt-2 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>Rs. {grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8">
          {data.paymentMethod && (
            <div className="mb-4">
              <strong>Payment Method:</strong> {data.paymentMethod}
            </div>
          )}
          {/* {data.notes && (
          <div className="mb-4">
            <strong>Notes:</strong> {data.notes}
          </div>
        )} */}
          <p className="mt-12 text-xs text-center text-gray-500">
            Thank you for your purchase! Please make payment by the due date.
          </p>
          <p className="mt-2 text-xs text-center text-gray-500">
            Bank details: <strong>XYZ Bank, Account Number: 123456789</strong>
          </p>
        </div>
      </div>

      <div className="flex justify-end mt-6 gap-4">
        <button
          onClick={() => handlePrint()}
          className="px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Print
        </button>
        <button
          onClick={() => handleExportPDF()}
          className="px-4 py-2 bg-[#df8d29] text-white rounded-lg hover:bg-[#c6893f] transition"
        >
          Export
        </button>
      </div>
    </div>
  );
};

export default Invoice;
