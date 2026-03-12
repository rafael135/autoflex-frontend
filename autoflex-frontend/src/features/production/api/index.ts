import { baseApi } from "../../../app/api/baseApi";
import type {
    TotalProductionResponse
} from "../types";

export const productsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProductionCapacity: builder.query<
            TotalProductionResponse,
            void
        >({
            query: () => `/production`,
            providesTags: ["Production"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetProductionCapacityQuery,
} = productsApi;
