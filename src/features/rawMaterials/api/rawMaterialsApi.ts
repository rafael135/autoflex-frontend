import { baseApi } from "../../../app/api/baseApi";
import type { PaginatedResponse } from "../../../types";
import type { CreateRawMaterialCommand, UpdateRawMaterialCommand, RawMaterial } from "../types";

export const rawMaterialsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRawMaterials: builder.query<PaginatedResponse<RawMaterial>, { page?: number; itemsPerPage?: number; name?: string }>({
            query: ({ page = 1, itemsPerPage = 20, name }) => {
                const params = new URLSearchParams({
                    page: String(page),
                    itemsPerPage: String(itemsPerPage),
                });
                if (name) params.set("name", name);
                return `/raw-materials?${params.toString()}`;
            },
            providesTags: ["RawMaterial"],
        }),
        createRawMaterial: builder.mutation<RawMaterial, CreateRawMaterialCommand>({
            query: (newRawMaterial) => ({
                url: "/raw-materials",
                method: "POST",
                body: newRawMaterial,
            }),
            invalidatesTags: ["RawMaterial"],
        }),
        updateRawMaterial: builder.mutation<RawMaterial, UpdateRawMaterialCommand>({
            query: (updatedRawMaterial) => ({
                url: `/raw-materials/${updatedRawMaterial.id}`,
                method: "PUT",
                body: updatedRawMaterial,
            }),
            invalidatesTags: ["RawMaterial"],
        }),
        deleteRawMaterial: builder.mutation<void, number>({
            query: (id) => ({
                url: `/raw-materials/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["RawMaterial"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetRawMaterialsQuery,
    useLazyGetRawMaterialsQuery,
    useCreateRawMaterialMutation,
    useUpdateRawMaterialMutation,
    useDeleteRawMaterialMutation,
} = rawMaterialsApi;
