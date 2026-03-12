import { useEffect } from "react";
import { useGetProductionCapacityQuery } from "../../../api";

export const useProduction = () => {
    const { data, isLoading, isError, refetch, isFetching } =
        useGetProductionCapacityQuery();

    const topProduct = data?.products.length
        ? data.products.reduce((best, p) =>
              p.maxProductionCapacity > best.maxProductionCapacity ? p : best,
          )
        : null;

    useEffect(() => {
        refetch();
    }, [refetch]);

    return {
        data,
        isLoading: isLoading || isFetching,
        isError,
        topProduct,
    };
};
