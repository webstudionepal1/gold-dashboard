import React from "react";
import { Modal } from "../../../components/shared";

interface propTypes {
  modalRef: React.RefObject<HTMLDivElement | null>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const TransactionDetails: React.FC<propTypes> = ({
  modalRef,
  setOpenModal,
}) => {
  return (
    <Modal ref={modalRef}>
      <div className="w-[500px] text-sm py-3">
        <h2 className="font-semibold text-center py-3">Transaction Details</h2>

        <div className="grid grid-cols-2 gap-3 capitalize mx-10 ">
          <p>
            {" "}
            <span className="text-gray-400 font-medium">Order ID</span> : #
            558855
          </p>
          <p className="flex justify-end ">
            {" "}
            <span className="text-gray-400 font-medium">date</span> : 02 April
            2025
          </p>
          <p>
            {" "}
            <span className="text-gray-400 font-medium">payment method</span> :
            cash
          </p>
          <p className="flex justify-end">
            {" "}
            <span className="text-gray-400 font-medium">status</span> :
            delivered
          </p>
          <p>
            {" "}
            <span className="text-gray-400 font-medium">time</span> : 09:09:08
          </p>
        </div>

        <div>
          <table className="text-center mx-auto border-separate border-spacing-x-10 my-5 w-full ">
            <thead>
              <tr>
                <th className="font-medium py-2 ">Customer Name</th>
                <th className="font-medium py-2 ">Amount</th>
                <th className="font-medium py-2 ">Action</th>
              </tr>
            </thead>
            <tbody className="relative before:absolute before:top-0 before:left-0 before:w-full before:border-t before:border-gray-300 after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-gray-300">
              <tr className="border-t border-b border-gray-300">
                <td className="p-2">Jaddu Singh</td>
                <td className="p-2">Rs. 100</td>
                <td className="p-2">Done</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionDetails;
