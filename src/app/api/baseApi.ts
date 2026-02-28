import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        credentials: "include",
        referrerPolicy: "origin-when-cross-origin"
    }),
    tagTypes: ["Production", "Product", "RawMaterial"],
    endpoints: () => ({})
});