import { DropdownField } from '../../../../components/shared/form_components/Dropdown';
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { InputField } from '../../../../components/shared/form_components/InputField';

interface AddDialogProps {
    onClose: () => void;
    onSubmit: () => void;
}

const AddProductSchema = z.object({
    category: z.string().min(1, "Select a Category"),
    subCategory: z.string().min(1, "Select a Subcategory"),
    description: z.string().min(1, "Add Description"),

})

const FieldError = ({ field }: { field: any }) => {
    if (field.state.meta.errors.length > 0) {
        const error = field.state.meta.errors[0];
        // Handle the case where the error is an object
        const errorMessage =
            typeof error === "string"
                ? error
                : error.message || JSON.stringify(error);

        return (
            <div className="min-h-[20px]">
                <span className="text-xs text-red">{errorMessage}</span>
            </div>
        );
    }
    return <div className="min-h-[20px]"></div>; // Return empty div when no errors
};

const AddProductDialog = ({ onClose, onSubmit }: AddDialogProps) => {
    const form = useForm({
        defaultValues: {

            category: "",
            subCategory: "",
            description: "",

        },
        validators: {
            onSubmit: AddProductSchema,
        },
        onSubmit: async ({ value }) => {
            console.log("Order Submitted:", value);
            // Submit to backend or API
        },
    });


    return (
        <div className="fixed md:px-0 px-5 inset-0 z-40 flex items-center justify-center bg-gray-700 bg-opacity-30 backdrop-blur-[0.5px]">
            <div className="p-6 bg-white rounded-xl shadow-lg w-[24rem]">

                <h2 className="text-lg font-semibold text-center mb-6 text-[#1A1A1A]">Add Category</h2>
                <form
                    className="flex flex-col gap-4 "
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                >
                    <form.Field name="category">
                        {(field) => (
                            <div className="">
                                <DropdownField
                                    label='Category'
                                    required
                                    firstInput="Select Category"
                                    options={[
                                        { value: "samsung", label: "Samsung" },
                                        { value: "asus", label: "Asus" },
                                        { value: "dell", label: "Dell" },
                                        { value: "acer", label: "Acer" },
                                    ]}
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                <FieldError field={field} />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="subCategory">
                        {(field) => (
                            <div className="">
                                <DropdownField
                                    label='Sub Category'
                                    required
                                    firstInput="Select sub Category"
                                    options={[
                                        { value: "samsung", label: "Samsung" },
                                        { value: "asus", label: "Asus" },
                                        { value: "dell", label: "Dell" },
                                        { value: "acer", label: "Acer" },
                                    ]}
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                <FieldError field={field} />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="description">
                        {(field) => (
                            <div className="w-full">
                                <InputField
                                    label="Description"
                                    required
                                    placeholder="Enter Short Description"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                <FieldError field={field} />
                            </div>
                        )}
                    </form.Field>

                    <div className="flex justify-center w-full gap-4 pt-4 border-t">
                        <button type='button' onClick={onClose} className="w-1/2 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button onClick={onSubmit} className="bg-[#DF8D28] text-white px-6 py-2 w-1/2 rounded-md hover:bg-[#c17821]">
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductDialog;
