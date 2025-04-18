import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useMemo, useState } from "react";
import { Table } from "../../../components/shared/Table";
import { useOutsideClick } from "../../../hooks/UseOutsideClick";
import {
  IFetchSubCategory,
  useDeleteProductSubCategoryMutation,
  useGetAllProductSubCategoriesQuery,
} from "../../../server/api/productHooks";
import { AddProductSubCategory } from "./components/AddProductSubCategory";
import Header from "../../../components/shared/table_heading/Header";

interface IEditModal {
  state: boolean;
  editData?: IFetchSubCategory | null;
}
const Productsubcategory: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<IEditModal>({
    state: false,
    editData: null,
  });
  const modalRef = useOutsideClick(() =>
    setIsModalOpen({ state: false, editData: null })
  );

  const { data: subCategories, isSuccess } =
    useGetAllProductSubCategoriesQuery();
  const { mutate: deleteSubCategory } = useDeleteProductSubCategoryMutation();
  // const { mutate: updateSubCategory } = useUpdateProductSubCategoryMutation();
  const subCategoriesData = useMemo(
    () => (isSuccess ? subCategories : []),
    [isSuccess, subCategories]
  );

  // const [filteredData, setFilteredData] =
  //   useState<ProductSubcategory[]>(productSubcategories);

  // Search handler
  // const handleSearch = useCallback(
  //   (query: string) => {
  //     const filtered = productSubcategories.filter(
  //       (item) =>
  //         item.name.toLowerCase().includes(query.toLowerCase()) ||
  //         item.description.toLowerCase().includes(query.toLowerCase())
  //     );
  //     setFilteredData(filtered);
  //   },
  //   [productSubcategories]
  // );

  // Filter handlerpnpm 
  // const handleFilter = useCallback(
  //   (filter: string) => {
  //     const filtered = filter
  //       ? productSubcategories.filter((item) => item.status === filter)
  //       : productSubcategories;
  //     setFilteredData(filtered);
  //   },
  //   [productSubcategories]
  // );

  // Sort handler
  // const handleSort = useCallback(
  //   (sort: string) => {
  //     const dataToSort = [...filteredData];
  //     switch (sort) {
  //       case "name_asc":
  //         dataToSort.sort((a, b) => a.name.localeCompare(b.name));
  //         break;
  //       case "name_desc":
  //         dataToSort.sort((a, b) => b.name.localeCompare(a.name));
  //         break;
  //       case "products_asc":
  //         dataToSort.sort(
  //           (a, b) => (a.totalProducts || 0) - (b.totalProducts || 0)
  //         );
  //         break;
  //       case "products_desc":
  //         dataToSort.sort(
  //           (a, b) => (b.totalProducts || 0) - (a.totalProducts || 0)
  //         );
  //         break;
  //     }
  //     setFilteredData(dataToSort);
  //   },
  //   [filteredData]
  // );

  // const filterOptions = [
  //   { value: "", label: "All" },
  //   { value: "Active", label: "Active" },
  //   { value: "Inactive", label: "Inactive" },
  // ];

  // const sortOptions = [
  //   { value: "name_asc", label: "Name (A-Z)" },
  //   { value: "name_desc", label: "Name (Z-A)" },
  //   { value: "products_asc", label: "Products (Low-High)" },
  //   { value: "products_desc", label: "Products (High-Low)" },
  // ];

  // const handleToggleStatus = (row: ProductSubcategory) => {
  //   setProductSubcategories((prev) =>
  //     prev.map((subcategory) =>
  //       subcategory._id === row._id
  //         ? {
  //             ...subcategory,
  //             status: subcategory.status === "Active" ? "Inactive" : "Active",
  //             isActive: !subcategory.isActive,
  //           }
  //         : subcategory
  //     )
  //   );
  // };

  const tableColumns = [
    {
      header: "Subcategory",
      key: "name",
      render: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      header: "Description",
      key: "description",
      render: (value: string) => <span className="text-gray-600">{value}</span>,
    },
    {
      header: "Total Products",
      key: "totalProducts",
      render: (value: number) => (
        <span className="font-medium">{value || 0}</span>
      ),
    },
    // {
    //   header: "Status",
    //   key: "status",
    //   render: (_: any, row: IFetchSubCategory) => (
    //     <span
    //       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    //         row.status === "Active"
    //           ? "bg-green-100 text-green-800"
    //           : "bg-red-100 text-red-800"
    //       }`}
    //     >
    //       {row.status}
    //     </span>
    //   ),
    // },
  ];

  return (
    <div className="container px-4 mx-auto">
      <Header text="Product Subcategories">
        <button
          onClick={() => {
            setIsModalOpen({
              state: true,
              editData: null,
            });
          }}
          className="bg-[#DF8D28] hover:bg-[#DF8D28]/90 text-white px-4 py-2 flex rounded-lg transition-colors duration-200"
        >
          <Icon icon="ic:outline-add" fontSize={24} />
          New Subcategory
        </button>
      </Header>
      <div className="p-4 bg-white">
        {/* <SearchFilterSort
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSort={handleSort}
          filterOptions={filterOptions}
          sortOptions={sortOptions}
          placeholder="Search here"
          showFilter={true}
          showSort={true}
          showView={false}
        /> */}

        <Table
          columns={tableColumns}
          data={subCategoriesData}
          // onButtonClick={setSelectedSubcategory}
          showEdit={true}
          editRow={(row) => setIsModalOpen({ state: true, editData: row })}
          showDelete={true}
          showToggle={true}
          // onToggle={(row) =>
          //   updateSubCategory({
          //     id: row._id,
          //     body: { isActive: !row.isActive },
          //   })
          // }
          deleteRow={(row) => deleteSubCategory(row._id)}
          showPagination={true}
          paginationDetails={{
            currentPage: 1,
            limit: 10,
            totalCount: subCategoriesData.length,
          }}
          onItemsPerPageChange={() => {}}
          onPageChange={() => {}}
        />
      </div>
      {isModalOpen.state && (
        <AddProductSubCategory
          modalRef={modalRef}
          closeModal={() => setIsModalOpen({ state: false, editData: null })}
          editData={isModalOpen.editData}
        />
      )}
    </div>
  );
};

export default Productsubcategory;
