// import React, { useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import { SearchFilterSort } from "../../components/global/SearchFilterSort";
// import Header from "../../components/shared/table_heading/Header";
// import { ScrollableModal } from "../../components/shared/ScrollableModal";
// import { DynamicTab } from "../PurchaseManagement/components/DynamicTab";
// import MasterTable from "../../components/shared/MasterTable";
// import {
//   IFetchBanner,
//   useDeleteBannerMutation,
//   useGetAllBannerQuery,
// } from "../../server/api/bannerHook";
// import { updateBannerState } from "./Components/bannerStore";

// interface BannerItem {
//   _id: string;
//   title: string;
//   banner_type: string;
//   image: string[];
//   mobImage: string[];
//   category: string;
//   subCategory: string;
//   banner_title?: string;
//   description?: string;
//   select_by?: string;
//   priority?: number;
//   locations?: string[];
//   type: string;
// }

// const bannerTabOptions = [
//   { value: "homepage", label: "Home Page" },
//   { value: "category-page", label: "Category Page" },
//   { value: "product-page", label: "Product Page" },
// ];

// const filterOptions = [
//   { value: "", label: "All Banners" },
//   { value: "active", label: "Active" },
//   { value: "inactive", label: "Inactive" },
// ];

// const sortOptions = [
//   { value: "", label: "Default" },
//   { value: "title-asc", label: "Title (A-Z)" },
//   { value: "title-desc", label: "Title (Z-A)" },
//   { value: "priority-high", label: "Priority (High)" },
//   { value: "priority-low", label: "Priority (Low)" },
// ];

// interface FilterState {
//   searchQuery: string;
//   filterValue: string;
//   sortValue: string;
// }

// interface ITable {
//   [key: string]: {
//     columns: { key: string; title: string }[];
//     rows: any[];
//   };
// }

// const BannerIndex: React.FC = () => {
//   const navigate = useNavigate();
//   const [selectedTab, setSelectedTab] = useState("homepage");
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [editingItem, setEditingItem] = useState<IFetchBanner | null>(null);
//   const [filterState, setFilterState] = useState<FilterState>({
//     searchQuery: "",
//     filterValue: "",
//     sortValue: "",
//   });
//   const [isImageModalOpen, setIsImageModalOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);

//   const { data: banners = [], isLoading, error } = useGetAllBannerQuery();
//   const { mutate: deleteBanner } = useDeleteBannerMutation();

//   const handleSearch = (query: string) => {
//     setFilterState((prev) => ({ ...prev, searchQuery: query }));
//   };

//   const handleFilter = (filter: string) => {
//     setFilterState((prev) => ({ ...prev, filterValue: filter }));
//   };

//   const handleSort = (sort: string) => {
//     setFilterState((prev) => ({ ...prev, sortValue: sort }));
//   };

//   const handleImageClick = (imageUrl: string) => {
//     setSelectedImage(imageUrl);
//     setIsImageModalOpen(true);
//   };

//   const handleDownloadImage = async (imageUrl: string) => {
//     try {
//       const response = await fetch(imageUrl, {
//         mode: "cors",
//         credentials: "same-origin",
//       });
//       if (!response.ok) {
//         throw new Error("Failed to fetch image");
//       }
//       const blob = await response.blob();
//       const blobUrl = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = blobUrl;
//       const filename = imageUrl.split("/").pop() || "banner-image";
//       const extension = filename.split(".").pop() || "jpg";
//       link.download = `${
//         filename.split(".")[0] || "banner-image"
//       }.${extension}`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(blobUrl);
//     } catch (error) {
//       console.error("Download failed:", error);
//       const link = document.createElement("a");
//       link.href = imageUrl;
//       const filename = imageUrl.split("/").pop() || "banner-image";
//       const extension = filename.split(".").pop() || "jpg";
//       link.download = `${
//         filename.split(".")[0] || "banner-image"
//       }.${extension}`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const filteredBanners = useMemo(() => {
//     let result = banners.filter((item) =>
//       item.locations?.includes(selectedTab)
//     );

//     if (filterState.searchQuery) {
//       const query = filterState.searchQuery.toLowerCase();
//       result = result.filter(
//         (item) =>
//           (item.title && item.title.toLowerCase().includes(query)) ||
//           (item._id && item._id.toLowerCase().includes(query))
//       );
//     }

//     if (filterState.filterValue) {
//       result = result.filter((item) => item.status === filterState.filterValue);
//     }

//     if (filterState.sortValue) {
//       switch (filterState.sortValue) {
//         case "title-asc":
//           result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
//           break;
//         case "title-desc":
//           result.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
//           break;
//         case "priority-high":
//           result.sort((a, b) => (b.priority || 0) - (a.priority || 0));
//           break;
//         case "priority-low":
//           result.sort((a, b) => (a.priority || 0) - (b.priority || 0));
//           break;
//       }
//     }

//     return result;
//   }, [banners, selectedTab, filterState]);

//   const tableDataObj: ITable = useMemo(
//     () => ({
//       homepage: {
//         columns: [
//           { key: "title", title: "Title" },
//           { key: "type", title: "Banner Type" },
//           { key: "image", title: "Web Image" },
//           { key: "mobImage", title: "Mobile Image" },
//         ],
//         rows: filteredBanners.map((banner) => ({
//           id: banner._id,
//           _id: banner._id,
//           title: banner.title,
//           type: banner.type,
//           image: banner.image?.length ? (
//             <div className="flex justify-center items-center p-2">
//               {banner.image.map((item, index) => (
//                 <img
//                   key={index}
//                   src={`https://gold-api.webstudiomatrix.com/${item}`}
//                   width={120}
//                   className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
//                   alt={banner.title}
//                   onClick={() =>
//                     handleImageClick(
//                       `https://gold-api.webstudiomatrix.com/${item}`
//                     )
//                   }
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="flex justify-center items-center p-2">No Image</div>
//           ),
//           mobImage: banner.mobImage?.length ? (
//             <div className="flex justify-center items-center p-2">
//               {banner.mobImage.map((item, index) => (
//                 <img
//                   key={index}
//                   src={`https://gold-api.webstudiomatrix.com/${item}`}
//                   width={120}
//                   className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
//                   alt={banner.title}
//                   onClick={() =>
//                     handleImageClick(
//                       `https://gold-api.webstudiomatrix.com/${item}`
//                     )
//                   }
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="flex justify-center items-center p-2">No Image</div>
//           ),
//           original: banner,
//         })),
//       },
//       "category-page": {
//         columns: [
//           { key: "title", title: "Title" },
//           { key: "type", title: "Banner Type" },
//           { key: "image", title: "Web Image" },
//           { key: "mobImage", title: "Mobile Image" },
//         ],
//         rows: filteredBanners.map((banner) => ({
//           id: banner._id,
//           _id: banner._id,
//           title: banner.title,
//           type: banner.type,
//           image: banner.image?.length ? (
//             <div className="flex justify-center items-center p-2">
//               {banner.image.map((item, index) => (
//                 <img
//                   key={index}
//                   src={`https://gold-api.webstudiomatrix.com/${item}`}
//                   width={120}
//                   className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
//                   alt={banner.title}
//                   onClick={() =>
//                     handleImageClick(
//                       `https://gold-api.webstudiomatrix.com/${item}`
//                     )
//                   }
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="flex justify-center items-center p-2">No Image</div>
//           ),
//           mobImage: banner.mobImage?.length ? (
//             <div className="flex justify-center items-center p-2">
//               {banner.mobImage.map((item, index) => (
//                 <img
//                   key={index}
//                   src={`https://gold-api.webstudiomatrix.com/${item}`}
//                   width={120}
//                   className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
//                   alt={banner.title}
//                   onClick={() =>
//                     handleImageClick(
//                       `https://gold-api.webstudiomatrix.com/${item}`
//                     )
//                   }
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="flex justify-center items-center p-2">No Image</div>
//           ),
//           original: banner,
//         })),
//       },
//       "product-page": {
//         columns: [
//           { key: "title", title: "Title" },
//           { key: "type", title: "Banner Type" },
//           { key: "image", title: "Web Image" },
//           { key: "mobImage", title: "Mobile Image" },
//         ],
//         rows: filteredBanners.map((banner) => ({
//           id: banner._id,
//           _id: banner._id,
//           title: banner.title,
//           type: banner.type,
//           image: banner.image?.length ? (
//             <div className="flex justify-center items-center p-2">
//               {banner.image.map((item, index) => (
//                 <img
//                   key={index}
//                   src={`https://gold-api.webstudiomatrix.com/${item}`}
//                   width={120}
//                   className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
//                   alt={banner.title}
//                   onClick={() =>
//                     handleImageClick(
//                       `https://gold-api.webstudiomatrix.com/${item}`
//                     )
//                   }
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="flex justify-center items-center p-2">No Image</div>
//           ),
//           mobImage: banner.mobImage?.length ? (
//             <div className="flex justify-center items-center p-2">
//               {banner.mobImage.map((item, index) => (
//                 <img
//                   key={index}
//                   src={`https://gold-api.webstudiomatrix.com/${item}`}
//                   width={120}
//                   className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
//                   alt={banner.title}
//                   onClick={() =>
//                     handleImageClick(
//                       `https://gold-api.webstudiomatrix.com/${item}`
//                     )
//                   }
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="flex justify-center items-center p-2">No Image</div>
//           ),
//           original: banner,
//         })),
//       },
//     }),
//     [filteredBanners]
//   );

//   const handleViewItem = (row: any) => {
//     setEditingItem(row.original);
//     setIsViewModalOpen(true);
//   };

//   const handleEditItem = (row: any) => {
//     updateBannerState(row.original);
//     navigate(`/banner/edit`);
//   };

//   const handleDeleteItem = (id: string) => {
//     deleteBanner(id);
//   };

//   const handleMultipleDelete = (ids: Array<string | number>) => {
//     ids.forEach((id) => deleteBanner(id as string));
//   };

//   return (
//     <div className="container mx-auto px-4 py-3">
//       <Header text="Banner">
//         <button className="px-3 py-2 flex items-center text-white bg-[#d49327] transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg">
//           <a className="flex items-center" href="/banner/add">
//             <Icon
//               icon="material-symbols-light:add-rounded"
//               width="24"
//               height="24"
//               className="fill-white"
//             />
//             Add Banner
//           </a>
//         </button>
//       </Header>

//       <MasterTable
//         loading={isLoading}
//         tabsOptions={
//           <DynamicTab
//             selectedTab={selectedTab}
//             setSelectedTab={setSelectedTab}
//             tabOptions={bannerTabOptions}
//           />
//         }
//         filterSection={
//           <SearchFilterSort
//             onSearch={handleSearch}
//             onFilter={handleFilter}
//             onSort={handleSort}
//             filterOptions={filterOptions}
//             sortOptions={sortOptions}
//             placeholder="Search banners..."
//           />
//         }
//         rows={tableDataObj[selectedTab]?.rows || []}
//         columns={tableDataObj[selectedTab]?.columns || []}
//         canSelect={true}
//         showAction={true}
//         // viewAction={handleViewItem}
//         editAction={handleEditItem}
//         onDelete={handleDeleteItem}
//         onMultipleDelete={handleMultipleDelete}
//         entriesPerPage={10}
//       />

//       {/* {isImageModalOpen && selectedImage && (
//         <ScrollableModal
//           classname="w-[50%]"
//           onClose={() => setIsImageModalOpen(false)}
//         >
//           <div className="p-4">
//             <h2 className="text-xl font-bold mb-4">Image Preview</h2>
//             <div className="flex flex-col items-center space-y-4">
//               <img
//                 src={selectedImage}
//                 alt="Preview"
//                 className="max-w-full max-h-[60vh] rounded-md object-contain"
//               />
//               <div className="flex space-x-4">
//                 <button
//                   onClick={() => handleDownloadImage(selectedImage)}
//                   className="bg-[#d49327] text-white py-2 px-4 rounded transition-transform duration-200 ease-in-out hover:scale-105"
//                 >
//                   Download
//                 </button>
//                 <button
//                   onClick={() => setIsImageModalOpen(false)}
//                   className="bg-[#e48a28] text-white py-2 px-4 rounded transition-transform duration-200 ease-in-out hover:scale-105"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </ScrollableModal>
//       )} */}

//       {isImageModalOpen && selectedImage && (
//         <ScrollableModal
//           classname="w-[35%] max-w-md"
//           onClose={() => setIsImageModalOpen(false)}
//         >
//           <div className="bg-white rounded-lg shadow-lg">
//             {/* Header with Title and Icons */}
//             <div className="flex items-center justify-between p-4 border-b border-gray-200">
//               <h2 className="text-lg font-bold text-gray-800">
//                 {selectedImage.includes("mobImage")
//                   ? "Mobile Image"
//                   : "Web Image"}
//               </h2>
//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() => handleDownloadImage(selectedImage)}
//                   className="text-gray-600 hover:text-gray-800 transition-colors"
//                   title="Download"
//                 >
//                   <Icon
//                     icon="material-symbols:download"
//                     width="24"
//                     height="24"
//                   />
//                 </button>
//                 <button
//                   onClick={() => setIsImageModalOpen(false)}
//                   className=" hover:text-red rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
//                   title="Close"
//                 >
//                   <Icon icon="material-symbols:close" width="16" height="16" />
//                 </button>
//               </div>
//             </div>
//             {/* Image Display */}
//             <div className="p-4 flex justify-center">
//               <img
//                 src={selectedImage}
//                 alt="Preview"
//                 className="max-w-full max-h-[70vh] rounded-md object-contain shadow-md"
//               />
//             </div>
//           </div>
//         </ScrollableModal>
//       )}
//     </div>
//   );
// };

// export default BannerIndex;

// Second

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SearchFilterSort } from "../../components/global/SearchFilterSort";
import Header from "../../components/shared/table_heading/Header";
import { ScrollableModal } from "../../components/shared/ScrollableModal";
import { DynamicTab } from "../PurchaseManagement/components/DynamicTab";
import MasterTable from "../../components/shared/MasterTable";
import {
  IFetchBanner,
  useDeleteBannerMutation,
  useGetAllBannerQuery,
} from "../../server/api/bannerHook";
import { updateBannerState } from "./Components/bannerStore";
import { ensureStreamingUrl } from "../../utils/videoUtils";

interface BannerItem {
  _id: string;
  title: string;
  banner_type: string;
  image: string[];
  category: string;
  subCategory: string;
  banner_title?: string;
  description?: string;
  select_by?: string;
  priority?: number;
  locations?: string[];
  type: string;
}

const bannerTabOptions = [
  { value: "homepage", label: "Home Page" },
  { value: "category-page", label: "Category Page" },
  { value: "product-page", label: "Product Page" },
];

const filterOptions = [
  { value: "", label: "All Banners" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const sortOptions = [
  { value: "", label: "Default" },
  { value: "title-asc", label: "Title (A-Z)" },
  { value: "title-desc", label: "Title (Z-A)" },
  { value: "priority-high", label: "Priority (High)" },
  { value: "priority-low", label: "Priority (Low)" },
];

interface FilterState {
  searchQuery: string;
  filterValue: string;
  sortValue: string;
}

interface ITable {
  [key: string]: {
    columns: { key: string; title: string }[];
    rows: any[];
  };
}

const BannerIndex: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("homepage");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IFetchBanner | null>(null);
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: "",
    filterValue: "",
    sortValue: "",
  });
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    url: string | null;
    type: "web" | "mobile" | null;
  }>({ url: null, type: null });

  const { data: banners = [], isLoading, error } = useGetAllBannerQuery();
  const { mutate: deleteBanner } = useDeleteBannerMutation();

  const handleSearch = (query: string) => {
    setFilterState((prev: FilterState) => ({ ...prev, searchQuery: query }));
  };

  const handleFilter = (filter: string) => {
    setFilterState((prev: FilterState) => ({ ...prev, filterValue: filter }));
  };

  const handleSort = (sort: string) => {
    setFilterState((prev: FilterState) => ({ ...prev, sortValue: sort }));
  };

  const handleImageClick = (imageUrl: string, imageType: "web" | "mobile") => {
    setSelectedImage({ url: imageUrl, type: imageType });
    setIsImageModalOpen(true);
  };

  const handleDownloadImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl, {
        mode: "cors",
        credentials: "same-origin",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const filename = imageUrl.split("/").pop() || "banner-image";
      const extension = filename.split(".").pop() || "jpg";
      link.download = `${
        filename.split(".")[0] || "banner-image"
      }.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      const link = document.createElement("a");
      link.href = imageUrl;
      const filename = imageUrl.split("/").pop() || "banner-image";
      const extension = filename.split(".").pop() || "jpg";
      link.download = `${
        filename.split(".")[0] || "banner-image"
      }.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const filteredBanners = useMemo(() => {
    let result = banners.filter((item) =>
      item.locations?.includes(selectedTab)
    );

    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          (item.title && item.title.toLowerCase().includes(query)) ||
          (item._id && item._id.toLowerCase().includes(query))
      );
    }

    if (filterState.filterValue) {
      result = result.filter((item) => item.status === filterState.filterValue);
    }

    if (filterState.sortValue) {
      switch (filterState.sortValue) {
        case "title-asc":
          result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
          break;
        case "title-desc":
          result.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
          break;
        case "priority-high":
          result.sort((a, b) => (b.priority || 0) - (a.priority || 0));
          break;
        case "priority-low":
          result.sort((a, b) => (a.priority || 0) - (b.priority || 0));
          break;
      }
    }

    return result;
  }, [banners, selectedTab, filterState]);

  const tableDataObj: ITable = useMemo(
    () => ({
      homepage: {
        columns: [
          { key: "title", title: "Title" },
          { key: "type", title: "Banner Type" },
          { key: "image", title: "Web Image" },
          { key: "mobImage", title: "Mobile Image" },
        ],
        rows: filteredBanners.map((banner) => ({
          id: banner._id,
          _id: banner._id,
          title: banner.title,
          type: banner.type,
          image: banner.image?.length ? (
            <div className="flex justify-center items-center p-2">
              {banner.image.map((item, index) => (
                <img
                  key={index}
                  src={`https://gold-api.webstudiomatrix.com/${item}`}
                  width={120}
                  className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  alt={banner.title}
                  onClick={() =>
                    handleImageClick(
                      `https://gold-api.webstudiomatrix.com/${item}`,
                      "web"
                    )
                  }
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center p-2">No Image</div>
          ),
          mobImage: banner.mobImage?.length ? (
            <div className="flex justify-center items-center p-2">
              {banner.mobImage.map((item, index) => (
                <img
                  key={index}
                  src={`https://gold-api.webstudiomatrix.com/${item}`}
                  width={120}
                  className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  alt={banner.title}
                  onClick={() =>
                    handleImageClick(
                      `https://gold-api.webstudiomatrix.com/${item}`,
                      "mobile"
                    )
                  }
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center p-2">No Image</div>
          ),
          original: banner,
        })),
      },
      "category-page": {
        columns: [
          { key: "title", title: "Title" },
          { key: "type", title: "Banner Type" },
          { key: "image", title: "Web Image" },
          { key: "mobImage", title: "Mobile Image" },
        ],
        rows: filteredBanners.map((banner) => ({
          id: banner._id,
          _id: banner._id,
          title: banner.title,
          type: banner.type,
          image: banner.image?.length ? (
            <div className="flex justify-center items-center p-2">
              {banner.image.map((item, index) => (
                <img
                  key={index}
                  src={`https://gold-api.webstudiomatrix.com/${item}`}
                  width={120}
                  className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  alt={banner.title}
                  onClick={() =>
                    handleImageClick(
                      `https://gold-api.webstudiomatrix.com/${item}`,
                      "web"
                    )
                  }
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center p-2">No Image</div>
          ),
          mobImage: banner.mobImage?.length ? (
            <div className="flex justify-center items-center p-2">
              {banner.mobImage.map((item, index) => (
                <img
                  key={index}
                  src={`https://gold-api.webstudiomatrix.com/${item}`}
                  width={120}
                  className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  alt={banner.title}
                  onClick={() =>
                    handleImageClick(
                      `https://gold-api.webstudiomatrix.com/${item}`,
                      "mobile"
                    )
                  }
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center p-2">No Image</div>
          ),
          original: banner,
        })),
      },
      "product-page": {
        columns: [
          { key: "title", title: "Title" },
          { key: "type", title: "Banner Type" },
          { key: "image", title: "Web Image" },
          { key: "mobImage", title: "Mobile Image" },
        ],
        rows: filteredBanners.map((banner) => ({
          id: banner._id,
          _id: banner._id,
          title: banner.title,
          type: banner.type,
          image: banner.image?.length ? (
            <div className="flex justify-center items-center p-2">
              {banner.image.map((item, index) => (
                <img
                  key={index}
                  src={`https://gold-api.webstudiomatrix.com/${item}`}
                  width={120}
                  className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  alt={banner.title}
                  onClick={() =>
                    handleImageClick(
                      `https://gold-api.webstudiomatrix.com/${item}`,
                      "web"
                    )
                  }
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center p-2">No Image</div>
          ),
          mobImage: banner.mobImage?.length ? (
            <div className="flex justify-center items-center p-2">
              {banner.mobImage.map((item, index) => (
                <img
                  key={index}
                  src={`https://gold-api.webstudiomatrix.com/${item}`}
                  width={120}
                  className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  alt={banner.title}
                  onClick={() =>
                    handleImageClick(
                      `https://gold-api.webstudiomatrix.com/${item}`,
                      "mobile"
                    )
                  }
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center p-2">No Image</div>
          ),
          original: banner,
        })),
      },
    }),
    [filteredBanners]
  );

  const handleViewItem = (row: any) => {
    setEditingItem(row.original);
    setIsViewModalOpen(true);
  };

  const handleEditItem = (row: any) => {
    updateBannerState(row.original);
    navigate(`/banner/edit`);
  };

  const handleDeleteItem = (id: string) => {
    deleteBanner(id);
  };

  const handleMultipleDelete = (ids: Array<string | number>) => {
    ids.forEach((id) => deleteBanner(id as string));
  };

  return (
    <div className="container mx-auto px-4 py-3">
      <Header text="Banner">
        <button className="px-3 py-2 flex items-center text-white bg-[#d49327] transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg">
          <a className="flex items-center" href="/banner/add">
            <Icon
              icon="material-symbols-light:add-rounded"
              width="24"
              height="24"
              className="fill-white"
            />
            Add Banner
          </a>
        </button>
      </Header>

      <MasterTable
        loading={isLoading}
        tabsOptions={
          <DynamicTab
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            tabOptions={bannerTabOptions}
          />
        }
        filterSection={
          <SearchFilterSort
            onSearch={handleSearch}
            onFilter={handleFilter}
            onSort={handleSort}
            filterOptions={filterOptions}
            sortOptions={sortOptions}
            placeholder="Search banners..."
          />
        }
        rows={tableDataObj[selectedTab]?.rows || []}
        columns={tableDataObj[selectedTab]?.columns || []}
        canSelect={true}
        showAction={true}
        // viewAction={handleViewItem}
        editAction={handleEditItem}
        onDelete={handleDeleteItem}
        onMultipleDelete={handleMultipleDelete}
        entriesPerPage={10}
      />

      {isImageModalOpen && selectedImage.url && (
        <ScrollableModal
          classname="w-[35%] max-w-md"
          onClose={() => setIsImageModalOpen(false)}
        >
          <div className="bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">
                {selectedImage.type === "mobile" ? "Mobile Image" : "Web Image"}
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownloadImage(selectedImage.url!)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  title="Download"
                >
                  <Icon
                    icon="material-symbols:download"
                    width="24"
                    height="24"
                  />
                </button>
                <button
                  onClick={() => setIsImageModalOpen(false)}
                  className="hover:text-red-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-100 transition-colors"
                  title="Close"
                >
                  <Icon icon="material-symbols:close" width="16" height="16" />
                </button>
              </div>
            </div>
            <div className="p-4 flex justify-center">
              <img
                src={selectedImage.url}
                alt="Preview"
                className="max-w-full max-h-[70vh] rounded-md object-contain shadow-md"
              />
            </div>
          </div>
        </ScrollableModal>
      )}
    </div>
  );
};

export default BannerIndex;
