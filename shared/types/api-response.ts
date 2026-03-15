export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta: {
    success: boolean;
    message?: string;
    [key: string]: unknown;
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
