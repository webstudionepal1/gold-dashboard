import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Table, ColumnConfig, TableData } from "../shared/Table";
import {
  IFetchStone,
  IStonePagination,
  STONE_TYPES,
} from "../../types/Stone.interface";

interface StoneListProps {
  stones: IFetchStone[];
  loading?: boolean;
  pagination?: IStonePagination;
  onEdit: (stone: IFetchStone) => void;
  onDelete: (stoneId: string) => void;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (limit: number) => void;
}

const StoneList: React.FC<StoneListProps> = ({
  stones,
  loading = false,
  pagination,
  onEdit,
  onDelete,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const getStoneTypeLabel = (type: string) => {
    const stoneType = STONE_TYPES.find((t) => t.value === type);
    return stoneType?.label || type;
  };

  const getStoneTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      diamond: "bg-blue-100 text-blue-800",
      ruby: "bg-red-100 text-red-800",
      emerald: "bg-green-100 text-green-800",
      sapphire: "bg-indigo-100 text-indigo-800",
      pearl: "bg-gray-100 text-gray-800",
      other: "bg-purple-100 text-purple-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  // Transform stones data for the Table component
  const tableData: TableData<IFetchStone>[] = stones.map((stone) => ({
    ...stone,
    _id: stone._id,
  }));

  // Define table columns
  const columns: ColumnConfig<IFetchStone>[] = [
    {
      key: "name",
      header: "Name",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Icon
              icon="material-symbols:diamond"
              className="w-5 h-5 text-purple-600"
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">
              {row.description || "No description"}
            </div>
          </div>
        </div>
      ),
    },

    {
      key: "type",
      header: "Type",
      render: (value) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStoneTypeColor(
            value
          )}`}>
          {getStoneTypeLabel(value)}
        </span>
      ),
    },
    {
      key: "color",
      header: "Color",
      render: (value) => (
        <span className="text-gray-900 capitalize">{value}</span>
      ),
    },
    {
      key: "carat",
      header: "Carat",
      render: (value) => (
        <span className="text-gray-900 font-medium">{value} ct</span>
      ),
    },
    {
      key: "pricePerCarat",
      header: "Price/Carat",
      render: (value) => (
        <span className="text-gray-900 font-medium">
          NPR {value.toLocaleString()}
        </span>
      ),
    },
    {
      key: "totalPrice",
      header: "Total Price",
      render: (value) => (
        <span className="text-green-600 font-semibold">
          NPR {value.toLocaleString()}
        </span>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      render: (value) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-8 text-center">
          <Icon
            icon="material-symbols:hourglass-empty"
            className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-spin"
          />
          <p className="text-gray-500">Loading stones...</p>
        </div>
      </div>
    );
  }

  if (stones.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-8 text-center">
          <Icon
            icon="material-symbols:diamond"
            className="w-12 h-12 mx-auto mb-4 text-gray-300"
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No stones found
          </h3>
          <p className="text-gray-500">
            No stones match your current filters. Try adjusting your search
            criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Table
      data={tableData}
      columns={columns}
      editRow={(stone) => onEdit(stone)}
      deleteRow={(stone) => onDelete(stone._id)}
      showEdit={true}
      showDelete={true}
      showPagination={!!pagination}
      paginationDetails={
        pagination
          ? {
              currentPage: pagination.currentPage,
              limit: pagination.limit,
              totalCount: pagination.totalCount,
            }
          : undefined
      }
      onPageChange={onPageChange}
      onItemsPerPageChange={onItemsPerPageChange}
      totalCount={pagination?.totalCount}
    />
  );
};

export default StoneList;
