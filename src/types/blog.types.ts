export interface IBlogMetadata {
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  tags: string[];
  categories: string[];
  featuredImage?: string;
  images?: string[];
  video?: string;
  status: "draft" | "published" | "archived";
  publishedAt?: Date;
  readTime?: number; // estimated read time in minutes
  views: number;
  likes: number;
  isActive: boolean;
  isFeatured: boolean;
  metadata: IBlogMetadata;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlogCreateRequest {
  title: string;
  content: string;
  excerpt?: string;
  tags: string[];
  categories: string[];
  featuredImage?: string;
  images?: string[];
  video?: string;
  status: "draft" | "published" | "archived";
  isFeatured?: boolean;
  metadata: IBlogMetadata;
}

export interface IBlogUpdateRequest extends Partial<IBlogCreateRequest> {
  _id: string;
}

export interface IBlogListResponse {
  blogs: IBlog[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBlogs: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface IBlogSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
  status?: "draft" | "published" | "archived";
  featured?: boolean;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IBlogAnalytics {
  overview: {
    totalBlogs: number;
    publishedBlogs: number;
    draftBlogs: number;
    archivedBlogs: number;
    featuredBlogs: number;
    totalViews: number;
    totalLikes: number;
  };
  recentActivity: {
    recentBlogs: IBlog[];
    topViewedBlogs: IBlog[];
    topLikedBlogs: IBlog[];
  };
}

export interface IBlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  categories: string[];
  featuredImage: File | null;
  images: File[];
  video: File | null;
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  metadata: {
    seoTitle: string;
    seoDescription: string;
    keywords: string[];
    canonicalUrl: string;
  };
}

export interface IBlogFilters {
  search: string;
  category: string;
  tag: string;
  status: "all" | "draft" | "published" | "archived";
  featured: boolean | null;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
}

export interface IBlogTableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (value: any, blog: IBlog) => React.ReactNode;
}
