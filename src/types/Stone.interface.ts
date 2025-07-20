export interface IStone {
  _id: string;
  name: string;
  type: "diamond" | "ruby" | "emerald" | "sapphire" | "pearl" | "other";
  color: string;
  clarity: string;
  cut: string;
  carat: number;
  pricePerCarat: number;
  totalPrice: number;
  shape: string;
  certification?: string;
  description?: string;
  images: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IStoneFormData {
  name: string;
  type: "diamond" | "ruby" | "emerald" | "sapphire" | "pearl" | "other";
  color: string;
  clarity: string;
  cut: string;
  carat: number;
  pricePerCarat: number;
  shape: string;
  certification?: string;
  description?: string;
  images: string[];
}

export interface IStoneFilters {
  search?: string;
  type?: string;
  color?: string;
  minCarat?: number;
  maxCarat?: number;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
}

export interface IStonePagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface IStoneListResponse {
  stones: IStone[];
  pagination: IStonePagination;
  filters: IStoneFilters;
}

export interface IStoneTableColumn {
  key: keyof IStone | "actions";
  title: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, stone: IStone) => React.ReactNode;
}

export interface IStoneFormProps {
  stone?: IStone;
  onSubmit: (data: IStoneFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface IStoneListProps {
  stones: IStone[];
  loading?: boolean;
  pagination?: IStonePagination;
  onEdit: (stone: IStone) => void;
  onDelete: (stoneId: string) => void;
  onPageChange: (page: number) => void;
  onSort?: (column: string, direction: "asc" | "desc") => void;
}

export interface IStoneFiltersProps {
  filters: IStoneFilters;
  onFiltersChange: (filters: IStoneFilters) => void;
  onReset: () => void;
}

export const STONE_TYPES = [
  { value: "diamond", label: "Diamond" },
  { value: "ruby", label: "Ruby" },
  { value: "emerald", label: "Emerald" },
  { value: "sapphire", label: "Sapphire" },
  { value: "pearl", label: "Pearl" },
  { value: "other", label: "Other" },
] as const;

export const STONE_CUTS = [
  { value: "round", label: "Round" },
  { value: "princess", label: "Princess" },
  { value: "emerald", label: "Emerald" },
  { value: "asscher", label: "Asscher" },
  { value: "oval", label: "Oval" },
  { value: "radiant", label: "Radiant" },
  { value: "cushion", label: "Cushion" },
  { value: "marquise", label: "Marquise" },
  { value: "pear", label: "Pear" },
  { value: "heart", label: "Heart" },
] as const;

export const STONE_SHAPES = [
  { value: "round", label: "Round" },
  { value: "square", label: "Square" },
  { value: "rectangular", label: "Rectangular" },
  { value: "oval", label: "Oval" },
  { value: "pear", label: "Pear" },
  { value: "heart", label: "Heart" },
  { value: "marquise", label: "Marquise" },
  { value: "trillion", label: "Trillion" },
  { value: "baguette", label: "Baguette" },
] as const;

export const DIAMOND_CLARITY_GRADES = [
  { value: "FL", label: "FL (Flawless)" },
  { value: "IF", label: "IF (Internally Flawless)" },
  { value: "VVS1", label: "VVS1 (Very Very Slightly Included 1)" },
  { value: "VVS2", label: "VVS2 (Very Very Slightly Included 2)" },
  { value: "VS1", label: "VS1 (Very Slightly Included 1)" },
  { value: "VS2", label: "VS2 (Very Slightly Included 2)" },
  { value: "SI1", label: "SI1 (Slightly Included 1)" },
  { value: "SI2", label: "SI2 (Slightly Included 2)" },
  { value: "I1", label: "I1 (Included 1)" },
  { value: "I2", label: "I2 (Included 2)" },
  { value: "I3", label: "I3 (Included 3)" },
] as const;

export const STONE_COLORS = [
  { value: "colorless", label: "Colorless (D-F)" },
  { value: "near-colorless", label: "Near Colorless (G-J)" },
  { value: "faint", label: "Faint (K-M)" },
  { value: "very-light", label: "Very Light (N-R)" },
  { value: "light", label: "Light (S-Z)" },
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "yellow", label: "Yellow" },
  { value: "pink", label: "Pink" },
  { value: "purple", label: "Purple" },
  { value: "orange", label: "Orange" },
  { value: "brown", label: "Brown" },
  { value: "black", label: "Black" },
  { value: "white", label: "White" },
  { value: "cream", label: "Cream" },
  { value: "golden", label: "Golden" },
  { value: "silver", label: "Silver" },
] as const;
