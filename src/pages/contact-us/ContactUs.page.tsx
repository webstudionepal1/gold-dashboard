import MasterTable from "@/components/shared/MasterTable";
import { ScrollableModal } from "@/components/shared/ScrollableModal";
import Header from "@/components/shared/table_heading/Header";
import {
  IContact,
  useDeleteContactUsMutation,
  useGetAllContactUsQuery,
} from "@/server/api/contact.api";
import { IParams } from "@/server/api/productHooks";
import { Icon } from "@iconify/react/dist/iconify.js";
import dayjs from "dayjs";
import get from "lodash/get";
import { useCallback, useState } from "react";

export const ContactUs = () => {
  const [paginationParams, setPaginationParams] = useState<IParams>({
    page: 1,
    limit: 10,
  });
  const [view, setView] = useState({
    isOpen: false,
    data: null as IContact | null,
  });
  const viewAction = useCallback(
    (row: IContact) => setView({ isOpen: true, data: row }),
    []
  );

  const {
    data: contactList,
    isSuccess,
    isLoading,
  } = useGetAllContactUsQuery(paginationParams);

  const handlePageChange = useCallback((page: number, pageSize: number) => {
    setPaginationParams((prev) => ({
      ...prev,
      page: page + 1, // MasterTable uses 0-based indexing, API uses 1-based
      limit: pageSize,
    }));
  }, []);

  const contactListColumns = [
    { title: "S.N", key: "sn" },
    { title: "User", key: "user" },
    { title: "Email", key: "email" },
    { title: "Subject", key: "subject" },
    // { title: "Description", key: "description" },
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
      // description: get(product, "description", "-"),
    };
  });

  const { mutateAsync: deleteProduct } = useDeleteContactUsMutation();

  return (
    <div>
      <Header text="Customer Queries" />
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
          //   onSearch={handleSearch}
          //   entriesPerPage={paginationData?.limit || 10}
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
      </section>
    </div>
  );
};
