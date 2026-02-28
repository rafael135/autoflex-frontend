import { baseApi } from "../../../app/api/baseApi";
import type { PaginatedResponse } from "../../../types";
import type {
    UpdateProductCommand,
    Product,
    CreateProductCommand,
} from "../types";

export const productsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<
            PaginatedResponse<Product>,
            { page?: number; itemsPerPage?: number }
        >({
            query: ({ page = 1, itemsPerPage = 10 }) =>
                `/products?page=${page}&itemsPerPage=${itemsPerPage}`,
            providesTags: ["Product"],
        }),
        createProduct: builder.mutation<Product, CreateProductCommand>({
            query: (newProduct) => ({
                url: "/products",
                method: "POST",
                body: newProduct,
            }),
            invalidatesTags: ["Product"],
        }),
        updateProduct: builder.mutation<Product, UpdateProductCommand>({
            query: (updatedProduct) => ({
                url: `/products/${updatedProduct.id}`,
                method: "PUT",
                body: updatedProduct,
            }),
            invalidatesTags: ["Product"],
        }),
        deleteProduct: builder.mutation<void, number>({
            query: (id) => ({
                url: `/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productsApi;
