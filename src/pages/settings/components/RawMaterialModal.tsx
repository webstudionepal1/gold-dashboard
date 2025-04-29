import { useForm } from "@tanstack/react-form";
import clsx from "clsx";
import { get } from "lodash";
import React, { useEffect } from "react";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import { InputField } from "../../../components/shared/form_components/InputField";
import { ScrollableModal } from "../../../components/shared/ScrollableModal";
import {
  IFetchItems,
  useCreateRawMaterialMutation,
  useUpdateRawItemsMutation,
} from "../../../server/api/purchaseHooks";
import { FieldError } from "../../auth/LoginPage";
import {z} from 'zod'
interface IClaspProps {
  onClose: () => void;
  data?: IFetchItems;
  edit?: boolean;
}

const schema = z.object({
  name: z.string().min(1, "**Name is Required"),
  unit: z.string().min(1, "**Unit is Required"),
});

const RawMaterialModal: React.FC<IClaspProps> = ({
  onClose,
  data,
  edit = false,
}) => {
  const {
    mutate: createClasps,
    isSuccess,
    isPending,
  } = useCreateRawMaterialMutation();
  const {
    mutate: updateClasps,
    isSuccess: updateSuccess,
    isPending: updatePending,
  } = useUpdateRawItemsMutation();
  const form = useForm({
    defaultValues: {
      name: edit ? get(data, "name", "") : "",
      unit: edit ? get(data, "unit", "") : "",
    },
    validators:{
      onChange:schema,
      onBlur:schema,
      onSubmit:schema
    },
    onSubmit: async ({ value }) => {
      if (edit) updateClasps({ id: data?._id ?? "", body: value });
      else createClasps(value);
      onClose();
    },
  });
  useEffect(() => {
    if (isSuccess || updateSuccess) {
      form.reset();
      onClose();
    }
  }, [isSuccess, updateSuccess]);
  return (
    <ScrollableModal classname="w-full max-w-lg px-4 py-4" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="grid gap-4 gird-cols-1 sm:grid-cols-2">
          <form.Field name="name">
            {(field) => (
              <div>
                <InputField
                  label="Name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldError field={field} />
              </div>
            )}
          </form.Field>
          <form.Field name="unit">
            {(field) => (
              <div>
                <DropdownField
                  label="Product Unit"
                  required
                  firstInput="Select unit"
                  options={[
                    { label: "Gm", value: "gm" },
                    { label: "Carat", value: "carat" },
                    { label: "Tola", value: "tola" },
                  ]}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldError field={field} />
              </div>
            )}
          </form.Field>
        </div>

        <div className="border-b border-[#dedde2] w-full mt-4 mb-4" />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-[#c9c9c9] px-7 py-2 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending || updatePending}
            className={clsx(
              "flex-1 bg-[#df8d29] text-white px-7 py-2 rounded-xl",
              (isPending || updatePending) && "cursor-pending"
            )}
          >
            {edit ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </ScrollableModal>
  );
};

export default RawMaterialModal;
