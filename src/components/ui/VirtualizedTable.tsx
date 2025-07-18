import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';

interface VirtualizedTableProps {
  data: any[];
  columns: Array<{ title: string; key: string }>;
  itemHeight?: number;
  height?: number;
  onRowClick?: (item: any) => void;
}

const VirtualizedTable: React.FC<VirtualizedTableProps> = ({
  data,
  columns,
  itemHeight = 60,
  height = 400,
  onRowClick
}) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = data[index];
    
    return (
      <div
        style={style}
        className="flex items-center border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
        onClick={() => onRowClick?.(item)}
      >
        {columns.map((column, colIndex) => (
          <div
            key={column.key}
            className="flex-1 px-4 py-2 text-sm text-gray-900 truncate"
            style={{ minWidth: `${100 / columns.length}%` }}
          >
            {item[column.key]}
          </div>
        ))}
      </div>
    );
  };

  const MemoizedRow = React.memo(Row);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="flex bg-gray-50 border-b border-gray-200">
        {columns.map((column) => (
          <div
            key={column.key}
            className="flex-1 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            style={{ minWidth: `${100 / columns.length}%` }}
          >
            {column.title}
          </div>
        ))}
      </div>

      {/* Virtualized Rows */}
      <List
        height={height}
        itemCount={data.length}
        itemSize={itemHeight}
        itemData={data}
        width="100%"
      >
        {MemoizedRow}
      </List>
    </div>
  );
};

export default React.memo(VirtualizedTable);