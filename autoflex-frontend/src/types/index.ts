export interface PaginatedResponse<T> {
    currentPage: number;
    data: T[];
    totalItems: number;
    totalPages: number;
}