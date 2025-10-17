import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

import Breadcrumbs from "../../../components/shared/Breadcrumb";
import { InputField } from "../../../components/shared/form_components/InputField";
import Header from "../../../components/shared/table_heading/Header";
import { useCreateContactUsMutation } from "../../../server/api/contact.api";

const AddQuerySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().min(1, "Description is required"),
});

const AddQueries = () => {
  const navigate = useNavigate();
  const {
    mutate: createQuery,
    isPending: queryPending,
    isSuccess: querySuccess,
  } = useCreateContactUsMutation();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      description: "",
    },
    validators: {
      onSubmit: AddQuerySchema,
    },
    onSubmit: async ({ value }) => {
      try {
        createQuery(value);
      } catch (error) {
        console.error("Failed to create query", error);
      }
    },
  });

  const FieldError = ({
    field,
  }: {
    field: { state: { meta: { errors: unknown[] } } };
  }) => {
    if (field.state.meta.errors.length > 0) {
      const error = field.state.meta.errors[0];
      const errorMessage =
        typeof error === "string"
          ? error
          : (error as { message?: string })?.message || JSON.stringify(error);

      return (
        <div className="min-h-[20px] mt-1">
          <span className="text-xs font-medium" style={{ color: "#ef4444" }}>
            {errorMessage}
          </span>
        </div>
      );
    }
    return <div className="min-h-[20px]"></div>;
  };

  useEffect(() => {
    if (querySuccess) {
      form.reset();
      navigate("/queries", { replace: true });
    }
  }, [querySuccess, navigate, form]);

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <Header text="Add New Query" />
        <Breadcrumbs />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:space-y-0 lg:space-x-4 space-x-0 space-y-4">
        <div className="bg-[#ffffff] col-span-1 lg:col-span-2 border-[#eeeeee] border-2 shadow-lg rounded-xl w-full">
          <form
            id="query-form"
            className="flex flex-col gap-4 mx-4 my-6"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div>
              <h1 className="text-xl font-semibold">Query Information</h1>
              <div className="border-b border-[#dedde2] w-full my-2"></div>
            </div>

            <div className="flex items-center gap-2 w-full">
              <form.Field name="name">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Name"
                      required
                      type="text"
                      placeholder="Enter Name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field name="email">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Email"
                      required
                      type="email"
                      placeholder="Enter Email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field name="subject">
              {(field) => (
                <div className="w-full">
                  <InputField
                    label="Subject"
                    required
                    type="text"
                    placeholder="Enter Subject"
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
                    type="textarea"
                    placeholder="Enter Description"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            <button
              type="submit"
              disabled={queryPending}
              className="self-end sm:block hidden bg-[#df8d29] text-white px-7 py-2 rounded-xl disabled:opacity-50"
            >
              {queryPending ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      </div>

      <div className="flex justify-end items-center mt-4 sm:hidden">
        <button
          form="query-form"
          type="submit"
          disabled={queryPending}
          className="self-end block sm:hidden bg-[#df8d29] text-white px-7 py-2 rounded-xl disabled:opacity-50"
        >
          {queryPending ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default AddQueries;
