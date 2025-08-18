import MasterTable from '@/components/shared/MasterTable';
import Header from '@/components/shared/table_heading/Header';
import {
  IContact,
  useDeleteContactUsMutation,
  useGetAllContactUsQuery,
} from '@/server/api/contact.api';
import { IParams } from '@/server/api/productHooks';
import { get } from 'lodash';
import { useCallback, useMemo, useState } from 'react';

export const ContactUs = () => {
  const [paginationParams, setPaginationParams] = useState<IParams>({
    page: 1,
    limit: 10,
  });
  const viewAction = useCallback((row: IContact) => {
    // navigate(`/product/details/${row._id}`);
  }, []);

  const {
    data: contactList,
    isSuccess,
    isLoading,
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

  const contactListColumns = [
    { title: 'S.N', key: 'sn' },
    { title: 'User', key: 'user' },
    { title: 'Email', key: 'email' },
    { title: 'Subject', key: 'subject' },
    { title: 'Description', key: 'description' },
  ];

  const tableData = contactList?.map((product: IContact, index: number) => {
    // Calculate serial number based on current page and limit
    // const currentPage = paginationData?.currentPage || 1;
    // const limit = paginationData?.limit || 10;
    // const serialNumber = (currentPage - 1) * limit + index + 1;

    return {
      ...product,
      sn: index + 1,

      user: get(product, 'name', ''),
      email: get(product, 'email', '-'),
      subject: get(product, 'subject', '-'),
      description: get(product, 'description', '-'),
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
      </section>
    </div>
  );
};
