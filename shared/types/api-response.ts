export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta: {
    success: boolean;
    message?: string;
    [key: string]: unknown;
  };
  pagination?: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type PaginatedApiResponse<T> = ApiResponse<PaginatedData<T>>;
