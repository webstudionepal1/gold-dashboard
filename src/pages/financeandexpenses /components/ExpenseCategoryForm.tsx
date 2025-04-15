import { Form, FormikProvider, useFormik } from "formik";
import { Modal } from "../../../components/shared";
import Field from "../../settings/components/Field";
import React, { useState } from "react";

const validationSchema = {};

interface PropTypes {
  modalRef: React.RefObject<HTMLDivElement | null>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExpenseCategoryForm: React.FC<PropTypes> = ({
  modalRef,
  setOpenModal,
}) => {
  const handleSubmit = (values: any) => {
    console.log(values);
  };

  const formik = useFormik({
    initialValues: {},
    onSubmit: handleSubmit,
    validationSchema,
  });

  const [addCategory, setAddCategory] = useState<number>(0);

  console.log(addCategory);

  return (
    <>
      <Modal ref={modalRef}>
        <FormikProvider value={formik}>
          <Form className="flex flex-col gap-4 p-3 min-w-[400px]">
            <h1 className="text-center font-bold my-2">
              Add Expenses Category
            </h1>

            <div>
              <Field
                label="Category"
                type="text"
                name="category"
                placeholder="eg. Inventory"
              />
            </div>
            <hr />
            <div className="flex gap-3">
              {addCategory < 3 && (
                <button
                  type="button"
                  className="bg-[#f7e8ca] text-sm font-semibold py-1 px-2 rounded-md"
                  onClick={() => {
                    setAddCategory(addCategory + 1);
                  }}
                >
                  Add More
                </button>
              )}
              {addCategory > 0 && (
                <button
                  type="button"
                  className="bg-[#d1d1d1] text-sm font-semibold py-1 px-2 rounded-md"
                  onClick={() => {
                    setAddCategory(addCategory - 1);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                className="bg-[#c9c9c9] w-1/2 py-1 rounded-md"
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-[#df8d28] text-white w-1/2 rounded-md py-1"
                type="submit"
              >
                Create
              </button>
            </div>
          </Form>
        </FormikProvider>
      </Modal>
    </>
  );
};

export default ExpenseCategoryForm;
