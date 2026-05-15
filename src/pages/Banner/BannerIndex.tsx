import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SearchFilterSort } from "../../components/global/SearchFilterSort";
import Header from "../../components/shared/table_heading/Header";
import { ScrollableModal } from "../../components/shared/ScrollableModal";
import MasterTable from "../../components/shared/MasterTable";
import {
  IFetchBanner,
  useDeleteBannerMutation,
  useGetAllBannerQuery,
} from "../../server/api/bannerHook";
import { updateBannerState } from "./Components/bannerStore";
import { resolveMediaUrl } from "../../utils/media";
import { getApiBaseUrl } from "../../utils/apiBase";

// Location labels mapping for better display
const LOCATION_LABELS: Record<string, string> = {
  homepage: "Home Page",
  "category-page": "Category Page",
  "product-page": "Product Page",
  marketing: "Marketing Section",
  advertisement: "Advertisement",
};

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

// Simplified table structure - no need for complex ITable interface
const BannerIndex: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: "",
    filterValue: "",
    sortValue: "",
  });
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    url: string | null;
    type: "web" | "mobile" | null;
  }>({ url: null, type: null });
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string | null;
    title: string | null;
  }>({ url: null, title: null });

  const { data: banners = [], isLoading } = useGetAllBannerQuery();
  const { mutate: deleteBanner } = useDeleteBannerMutation();

  // Dynamically generate location options from existing banners
  const locationOptions = useMemo(() => {
    const allLocations = new Set<string>();
    banners.forEach((banner) => {
      banner.locations?.forEach((location) => allLocations.add(location));
    });

    const options = [{ value: "all", label: "All Locations" }];
    Array.from(allLocations)
      .sort()
      .forEach((location) => {
        options.push({
          value: location,
          label:
            LOCATION_LABELS[location] ||
            location.charAt(0).toUpperCase() +
              location.slice(1).replace(/-/g, " "),
        });
      });

    return options;
  }, [banners]);

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

  const handleVideoClick = (videoUrl: string, title: string) => {
    console.log("Video clicked:", { videoUrl, title });
    setSelectedVideo({ url: videoUrl, title });
    setIsVideoModalOpen(true);
  };

  const testVideoStream = async (videoPath: string) => {
    try {
      const cleanPath = videoPath.startsWith("/ridisidi/")
        ? videoPath.substring("/ridisidi/".length)
        : videoPath.startsWith("/")
        ? videoPath.substring(1)
        : videoPath;

      const testUrl = `${getApiBaseUrl()}video/test/${cleanPath}`;
      console.log("Testing video stream:", testUrl);

      const response = await fetch(testUrl);
      const result = await response.json();
      console.log("Video test result:", result);

      return result.success;
    } catch (error) {
      console.error("Video test error:", error);
      return false;
    }
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
    let result =
      selectedLocation === "all"
        ? banners
        : banners.filter((item) => item.locations?.includes(selectedLocation));

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
  }, [banners, selectedLocation, filterState]);

  // Single reusable table structure - no duplication!
  const tableColumns = [
    { key: "title", title: "Title" },
    { key: "type", title: "Banner Type" },
    { key: "location", title: "Location" },
    { key: "image", title: "Web Image" },
    { key: "video", title: "Video" },
  ];

  const tableRows = useMemo(
    () =>
      filteredBanners.map((banner) => ({
        id: banner._id,
        _id: banner._id,
        title: banner.title,
        type: banner.type,
        location:
          banner.locations
            ?.map(
              (loc) =>
                LOCATION_LABELS[loc] ||
                loc.charAt(0).toUpperCase() + loc.slice(1).replace(/-/g, " ")
            )
            .join(", ") || "No Location",
        image: banner.image?.length ? (
          <div className="flex justify-center items-center size-5 mx-auto">
            {banner.image.map((item, index) => (
              <img
                key={index}
                src={resolveMediaUrl(item)}
                width={120}
                className="rounded-lg object-contain object-center  cursor-pointer hover:opacity-80 transition-opacity"
                alt={banner.title}
                onClick={() =>
                  handleImageClick(
                    resolveMediaUrl(item),
                    "web"
                  )
                }
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center p-2 text-gray-500">
            No Image
          </div>
        ),
        video: banner.video && banner.video.length > 0 ? (
          <div className="flex justify-center items-center size-5 mx-auto">
            {banner.video.map((item: string, index: number) => {
              // Clean the video path for streaming
              const cleanVideoPath = item.startsWith("/ridisidi/")
                ? item.substring("/ridisidi/".length)
                : item.startsWith("/")
                ? item.substring(1)
                : item;

              // Ensure we have the correct API base URL
              const baseUrl =
                getApiBaseUrl();
              const videoStreamUrl = `${baseUrl}video/stream/${cleanVideoPath}`;

              return (
                <video
                  key={index}
                  src={videoStreamUrl}
                  width={120}
                  height={80}
                  className="rounded-lg object-contain object-center cursor-pointer hover:opacity-80 transition-opacity"
                  preload="metadata"
                  muted
                  onClick={() => handleVideoClick(videoStreamUrl, banner.title || '')}
                  onError={async (e) => {
                    console.error("Video loading error:", e);
                    console.log("Video URL:", videoStreamUrl);
                    console.log("Original item:", item);

                    // Test if video exists
                    const exists = await testVideoStream(item);
                    if (!exists) {
                      console.error(
                        "Video file does not exist or is not accessible"
                      );
                    }
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center p-2 text-gray-500">
            No Video
          </div>
        ),
        original: banner,
      })),
    [filteredBanners]
  );

  const handleEditItem = (row: { original: IFetchBanner }) => {
    updateBannerState(row.original);
    navigate(`/banner/edit`);
  };

  // Location dropdown component
  const LocationFilter = () => (
    <div className="flex items-center gap-2">
      <label
        htmlFor="location-filter"
        className="text-sm font-medium text-gray-700">
        Location:
      </label>
      <select
        id="location-filter"
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        {locationOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const handleDeleteItem = (id: string) => {
    deleteBanner(id);
  };

  const handleMultipleDelete = (ids: Array<string | number>) => {
    ids.forEach((id) => deleteBanner(id as string));
  };

  return (
    <div className="w-full mx-auto px-2 md:px-0 py-3">
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
        tabsOptions={<LocationFilter />}
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
        rows={tableRows}
        columns={tableColumns}
        canSelect={true}
        showAction={true}
        editAction={handleEditItem}
        onDelete={handleDeleteItem}
        onMultipleDelete={handleMultipleDelete}
        entriesPerPage={10}
      />

      {isImageModalOpen && selectedImage.url && (
        <ScrollableModal
          classname="w-[35%] max-w-md"
          onClose={() => setIsImageModalOpen(false)}>
          <div className="bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">
                {selectedImage.type === "mobile" ? "Mobile Image" : "Web Image"}
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownloadImage(selectedImage.url!)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  title="Download">
                  <Icon
                    icon="material-symbols:download"
                    width="24"
                    height="24"
                  />
                </button>
                <button
                  onClick={() => setIsImageModalOpen(false)}
                  className="hover:text-red-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-100 transition-colors"
                  title="Close">
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

      {isVideoModalOpen && selectedVideo.url && (
        <ScrollableModal
          classname="w-[50%] max-w-2xl"
          onClose={() => setIsVideoModalOpen(false)}>
          <div className="bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">
                {selectedVideo.title || "Banner Video"}
              </h2>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="hover:text-red-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-100 transition-colors"
                title="Close">
                <Icon icon="material-symbols:close" width="16" height="16" />
              </button>
            </div>
            <div className="p-4 flex justify-center">
              <video
                src={selectedVideo.url}
                controls
                className="max-w-full max-h-[70vh] rounded-md shadow-md"
                preload="metadata"
              />
            </div>
          </div>
        </ScrollableModal>
      )}
    </div>
  );
};

export default BannerIndex;
