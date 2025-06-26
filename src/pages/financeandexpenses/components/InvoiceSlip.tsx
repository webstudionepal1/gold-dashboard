import React from "react";
import { Modal } from "../../../components/shared";
import { Icon } from "@iconify/react/dist/iconify.js";

interface propTypes {
  modalRef: React.RefObject<HTMLDivElement | null>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const InvoiceSlip: React.FC<propTypes> = ({ modalRef, setOpenModal }) => {
  return (
    <Modal ref={modalRef}>
      <div className="flex flex-col gap-5 p-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">#012</p>
          <section className="text-[#6d6d6d] flex gap-1 text-lg">
            <span>
              <Icon icon="material-symbols:download-rounded" />
            </span>
            <span>
              <Icon icon="material-symbols:print-outline" />
            </span>
            <span className="text-red" onClick={() => setOpenModal(false)}>
              <Icon icon="material-symbols:cancel-outline" />
            </span>
          </section>
        </div>
        <img src="/invoice.png" alt="" className="h-52 p-2" />
      </div>
    </Modal>
  );
};

export default InvoiceSlip;
