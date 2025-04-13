import React, { useState } from "react";
import { SearchFilterSort } from "../../components/global/SearchFilterSort";
import { Table, ColumnConfig, TableData } from "../../components/shared/Table";
import { Icon } from "@iconify/react/dist/iconify.js";

interface PostBusinessItem {
  _id: string;
  item_name: string;
  price: string;
  total_amount: string;
  image: string;
  selected_packages: string;
}

const MyPostBusinessIndex = () => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isactionButtonClicked, setIsActionButtonClicked] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilter = (filter: string) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handleSort = (sort: string) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  const filterOptions = [
    { value: "", label: "All Customers" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const sortOptions = [
    { value: "", label: "Default" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "orders-high", label: "Orders (High)" },
    { value: "orders-low", label: "Orders (Low)" },
  ];

  const dummyData: TableData<PostBusinessItem>[] = [
    {
      _id: "1",
      item_name: "2 X 1 Gold Neckless",
      price: "$12.09",
      total_amount: "$24.00",
      selected_packages: "Custom Packing (15 x 10 x 3) Weight(kg) 0.09",
      image: "/necklace.jpg",
    },
    {
      _id: "2",
      item_name: "2 X 1 Gold Neckless",
      price: "$12.09",
      total_amount: "$24.00",
      selected_packages: "Custom Packing (15 x 10 x 3) Weight(kg) 0.09",
      image: "/necklace.jpg",
    },
    {
      _id: "3",
      item_name: "2 X 1 Gold Neckless",
      price: "$12.09",
      total_amount: "$24.00",
      selected_packages: "Custom Packing (15 x 10 x 3) Weight(kg) 0.09",
      image: "/necklace.jpg",
    },
    {
      _id: "4",
      item_name: "2 X 1 Gold Neckless",
      price: "$12.09",
      total_amount: "$24.00",
      selected_packages: "Custom Packing (15 x 10 x 3) Weight(kg) 0.09",
      image: "/necklace.jpg",
    },
  ];

  const columns: ColumnConfig<PostBusinessItem>[] = [
    {
      header: "Items",
      key: "items",
      render: (_, row) => (
        <div className="flex items-center">
          <img
            src={row.image}
            alt={row.item_name}
            className="w-10 h-10 rounded-md mr-3 object-cover"
          />
          <div>
            <div className="font-medium text-gray-900">{row.item_name}</div>
            {row._id && (
              <div className="text-sm text-gray-500">ID {row._id}</div>
            )}
          </div>
        </div>
      ),
    },
    { key: "price", header: "Price" },
    { key: "total_amount", header: "Total Amount" },
    {
      key: "selected_packages",
      header: "Selected Packages",
      render: (_, row) => (
        <div>
          <p className="text-wrap">{row.selected_packages}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-6 my-2">
      <h1 className="text-3xl font-semibold mb-8">Packages</h1>

      <div className="bg-[#ffffff] border-[#dcdddf] border-2 rounded-xl">
        <div className="p-4">
          <SearchFilterSort
            onSearch={handleSearch}
            onFilter={handleFilter}
            onSort={handleSort}
            filterOptions={filterOptions}
            sortOptions={sortOptions}
            placeholder="Search here..."
          />
        </div>

        <div className="flex items-center gap-2 px-3 ">
          <Table
            data={dummyData}
            columns={columns}
            showSelectAll
            showPagination
            showAction={false}
            paginationDetails={{
              currentPage,
              limit: itemsPerPage,
              totalCount: dummyData.length,
            }}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
          <div className="w-[40%] mx-4 mb-[10rem]">
            <div className="flex justify-end items-center gap-2  ">
              <button className="bg-[#df8d29] px-3 py-2 text-white text-nowrap rounded-xl">
                CREATE LABEL
              </button>
              <button
                onClick={() => setIsActionButtonClicked(!isactionButtonClicked)}
                className="flex items-center gap-2 w-[7rem]  bg-[#df8d29] px-3 py-2 text-white rounded-xl"
              >
                Actions
                <Icon
                  icon="solar:alt-arrow-down-outline"
                  width="24"
                  height="24"
                />
              </button>
            </div>

            <div className="flex items-center justify-between text-white bg-[#df8d29] rounded-tr-xl rounded-tl-xl w-full px-3 py-2 mt-2 ">
              <h1>Parcel Post</h1>
              <h2>$12.90</h2>
            </div>

            {isactionButtonClicked && (
              <>
                <div className="flex flex-col  justify-start bg-[#f6f6f6] rounded-br-xl rounded-bl-xl">
                  <div className="flex items-center gap-8">
                    <img
                      src="https://www.hollywoodreporter.com/wp-content/uploads/2012/12/img_logo_blue.jpg"
                      height={50}
                      width={100}
                      className="ml-2"
                    />
                    <h1 className="font-semibold">MyPost</h1>
                  </div>

                  <div className="flex flex-col gap-4 mx-2 text-sm ">
                    <div className="flex items-center justify-between">
                      <h1 className="font-bold">Parcel Post</h1>
                      <p>$10.73</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <h1 className="font-bold">Express Post</h1>
                      <p>$10.73</p>
                    </div>
                  </div>

                  <div className="flex justify-end my-2">
                    <h1 className="text-sm">Band 2 Zone 3 </h1>
                  </div>
                </div>
              </>
            )}
            <div className="flex items-center gap-2 text-sm mt-7">
              <h1 className="font-bold">Express Post</h1>
              <p>Standard</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPostBusinessIndex;
