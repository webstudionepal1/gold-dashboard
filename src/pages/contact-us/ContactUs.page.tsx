import MasterTable from '@/components/shared/MasterTable';
import { ScrollableModal } from '@/components/shared/ScrollableModal';
import Header from '@/components/shared/table_heading/Header';
import {
  IContact,
  useDeleteContactUsMutation,
  useGetAllContactUsQuery,
} from '@/server/api/contact.api';
import { IParams } from '@/server/api/productHooks';
import dayjs from 'dayjs';
import get from 'lodash/get';
import { useCallback, useMemo, useState } from 'react';

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
    isError,
  } = useGetAllContactUsQuery(paginationParams);

  // Extract pagination data from API response
  //   const paginationData = useMemo(() => {
  //     if (contactList?.pagination) {
  //       return {
  //         currentPage: contactList.pagination.currentPage,
  //         totalPages: contactList.pagination.totalPages,
  //         totalCount: contactList.pagination.totalCount,
  //         limit: contactList.pagination.limit,
  //         hasNextPage: contactList.pagination.hasNextPage,
  //         hasPrevPage: contactList.pagination.hasPrevPage,
  //         nextPage: contactList.pagination.nextPage,
  //         prevPage: contactList.pagination.prevPage,
  //       };
  //     }
  //     return null;
  //   }, [contactList?.pagination]);

  const handlePageChange = useCallback((page: number, pageSize: number) => {
    setPaginationParams((prev) => ({
      ...prev,
      page: page + 1, // MasterTable uses 0-based indexing, API uses 1-based
      limit: pageSize,
    }));
  }, []);

  const contactListColumns = useMemo(
    () => [
      { title: 'S.N', key: 'sn' },
      { title: 'User', key: 'user' },
      { title: 'Email', key: 'email' },
      { title: 'Subject', key: 'subject' },
      { title: 'Description', key: 'description' },
    ],
    []
  );

  const tableData = useMemo(() => {
    return contactList?.map((product: IContact, index: number) => {
      return {
        ...product,
        sn: index + 1,

        user: get(product, 'name', ''),
        email: get(product, 'email', '-'),
        subject: get(product, 'subject', '-'),
        description: get(product, 'description', '-'),
      };
    });
  }, [contactList]);

  const { mutateAsync: deleteProduct } = useDeleteContactUsMutation();

  return (
    <div>
      <Header text="Customer Queries" />
      <section className="">
        <MasterTable
          columns={contactListColumns}
          // onDelete={(id) => {
          // return deleteProduct(id);
          // }}
          viewAction={viewAction}
          // loading={isError ? false : isLoading}
          showAction={true}
          rows={tableData}
          canSearch={false}
          apiPagination={true}
          totalItems={contactList?.length || 0}
          // onPageChange={handlePageChange}
          //   onSearch={handleSearch}
          //   entriesPerPage={paginationData?.limit || 10}
        />
        <ScrollableModal
          isOpen={view.isOpen}
          onClose={() => setView({ isOpen: false, data: null })}
          title="Details"
          size="lg"
        >
          <div className="w-full">
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <p className="font-medium">Name</p>
                  <p className="text-gray-700">{view?.data?.name}</p>
                </div>

                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-700">{view?.data?.email}</p>
                </div>

                <div>
                  <p className="font-medium">Subject</p>
                  <p className="text-gray-700">{view?.data?.subject}</p>
                </div>
              </div>

              <div>
                <p className="font-medium">Description</p>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {view?.data?.description}
                </p>
              </div>

              <div className="text-sm text-gray-500">
                <p>
                  Created:{' '}
                  {dayjs(get(view?.data, 'createdAt')).isValid()
                    ? dayjs(get(view?.data, 'createdAt')).format(
                        'DD MMM YYYY hh:mm A'
                      )
                    : '-'}
                </p>
                <p>
                  Updated:{' '}
                  {dayjs(get(view?.data, 'updatedAt')).isValid()
                    ? dayjs(get(view?.data, 'updatedAt')).format(
                        'DD MMM YYYY hh:mm A'
                      )
                    : '-'}
                </p>
              </div>
            </div>
          </div>
        </ScrollableModal>
      </section>
    </div>
  );
};
