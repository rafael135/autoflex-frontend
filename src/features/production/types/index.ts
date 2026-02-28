

export type ProductDetail = {
    id: number;
    name: string;
    maxProductionCapacity: number;
    totalValue: number;
}

export type TotalProductionResponse = {
    products: ProductDetail[];
    totalProductionValue: number;
}