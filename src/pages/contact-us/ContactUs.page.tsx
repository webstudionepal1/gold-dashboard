import MasterTable from "@/components/shared/MasterTable";
import { ScrollableModal } from "@/components/shared/ScrollableModal";
import Header from "@/components/shared/table_heading/Header";
import {
  IContact,
  useDeleteContactUsMutation,
  useGetAllContactUsQuery,
  useCreateContactUsMutation,
} from "@/server/api/contact.api";
import { IParams } from "@/server/api/productHooks";
import { Icon } from "@iconify/react/dist/iconify.js";
import dayjs from "dayjs";
import get from "lodash/get";
import { useCallback, useState } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";

const AddQuerySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().min(1, "Description is required"),
});

export const ContactUs = () => {
  const [paginationParams, setPaginationParams] = useState<IParams>({
    page: 1,
    limit: 10,
  });
  const [view, setView] = useState({
    isOpen: false,
    data: null as IContact | null,
  });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const viewAction = useCallback(
    (row: IContact) => setView({ isOpen: true, data: row }),
    []
  );
  const addAction = useCallback(() => setIsAddOpen(true), []);

  const {
    data: contactList,
    isSuccess,
    isLoading,
  } = useGetAllContactUsQuery(paginationParams);

  const { mutate: createQuery, isPending: queryPending } =
    useCreateContactUsMutation();

  const handlePageChange = useCallback((page: number, pageSize: number) => {
    setPaginationParams((prev) => ({
      ...prev,
      page: page + 1,
      limit: pageSize,
    }));
  }, []);

  const contactListColumns = [
    { title: "S.N", key: "sn" },
    { title: "User", key: "user" },
    { title: "Email", key: "email" },
    { title: "Subject", key: "subject" },
  ];

  const tableData = contactList?.map((product: IContact, index: number) => {
    const currentPage = paginationParams.page || 1;
    const limit = paginationParams.limit || 10;
    const serialNumber = (currentPage - 1) * limit + index + 1;

    return {
      ...product,
      sn: index + 1,
      user: get(product, "name", ""),
      email: get(product, "email", "-"),
      subject: get(product, "subject", "-"),
    };
  });

  const { mutateAsync: deleteProduct } = useDeleteContactUsMutation();

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
        createQuery(value, {
          onSuccess: () => {
            setIsAddOpen(false);
            form.reset();
          },
        });
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

  return (
    <div>
      <Header text="Customer Queries">
        <button
          onClick={addAction}
          className="px-3 py-2 flex items-center text-white bg-[#d49327] transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg"
        >
          <Icon
            icon="material-symbols-light:add-rounded"
            width="24"
            height="24"
            className="fill-white mr-2"
          />
          Add Query
        </button>
      </Header>
      <section className="">
        <MasterTable
          columns={contactListColumns}
          onDelete={(id) => deleteProduct(id)}
          viewAction={viewAction}
          loading={isLoading}
          showAction={true}
          rows={tableData}
          canSearch={false}
          apiPagination={true}
          totalItems={contactList?.length || 0}
          onPageChange={handlePageChange}
        />
        <ScrollableModal
          isOpen={view.isOpen}
          onClose={() => setView({ isOpen: false, data: null })}
          title="Details"
          size="md"
        >
          <div className="w-full space-y-2">
            {/* Profile Card-like Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon
                    icon="mdi:account-outline"
                    className="w-6 h-6 text-blue-600"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {view?.data?.name}
                  </h3>
                  <p className="text-sm text-gray-500">{view?.data?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Subject
                  </p>
                  <p className="text-gray-900 font-medium">
                    {view?.data?.subject}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Created
                  </p>
                  <p className="text-sm text-gray-600">
                    {dayjs(get(view?.data, "createdAt")).isValid()
                      ? dayjs(get(view?.data, "createdAt")).format(
                          "DD MMM YYYY, hh:mm A"
                        )
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5 flex-shrink-0">
                  <Icon
                    icon="mdi:card-text-outline"
                    className="w-3 h-3 text-gray-500"
                  />
                </div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Description
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {view?.data?.description}
              </p>
            </div>
          </div>
        </ScrollableModal>

        <ScrollableModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          title="Add New Query"
          size="lg"
        >
          <div className="w-full space-y-4">
            <form
              id="query-form"
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <div className="flex items-center gap-4 w-full">
                <form.Field name="name">
                  {(field) => (
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Name"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="email">
                  {(field) => (
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        placeholder="Enter Email"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>

              <form.Field name="subject">
                {(field) => (
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Subject"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      placeholder="Enter Description"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={queryPending}
                  className="px-4 py-2 bg-[#df8d29] text-white rounded-md hover:bg-[#d49327] disabled:opacity-50"
                >
                  {queryPending ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </ScrollableModal>
      </section>
    </div>
  );
};
