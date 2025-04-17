import { Form, FormikProvider, useFormik } from "formik";
import { Modal } from "../../../components/shared";
import Field from "../../settings/components/Field";
import React from "react";

const validationSchema = {};

interface PropTypes {
  modalRef: React.RefObject<HTMLDivElement | null>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExpenseForm: React.FC<PropTypes> = ({ modalRef, setOpenModal }) => {
  const handleSubmit = (values: any) => {
    console.log(values);
  };

  const formik = useFormik({
    initialValues: {},
    onSubmit: handleSubmit,
    validationSchema,
  });

  return (
    <>
      <Modal ref={modalRef}>
        <FormikProvider value={formik}>
          <Form className="flex flex-col gap-5 p-5">
            <h1 className="text-center font-bold my-2">Add Expenses</h1>
            <div>
              <Field label="Date" type="date" name="date" />
            </div>
            <hr />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Field label="Category" type="select" name="category" />
              </div>
              <div>
                <Field
                  label="Amount"
                  type="text"
                  name="amount"
                  placeholder="Enter Discount"
                />
              </div>
            </div>
            <hr />
            <div>
              <Field
                label="Description"
                type="text"
                name="description"
                placeholder="eg. Christmas sale"
              />
            </div>
            <div className="flex gap-4">
              <button
                className="bg-[#c9c9c9] w-1/2 py-1 rounded-md"
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                Cancel
              </button>
              <button className="bg-[#df8d28] text-white w-1/2 rounded-md py-1">
                Create
              </button>
            </div>
          </Form>
        </FormikProvider>
      </Modal>
    </>
  );
};

export default ExpenseForm;
