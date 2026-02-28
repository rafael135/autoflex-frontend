export type ProductMaterialRequirement = {
    rawMaterialId: number;
    name: string;
    quantity: number;
}

export type Product = {
    id: number;
    name: string;
    value: number;
    materials: ProductMaterialRequirement[];
};

export type ProductDto = Omit<Product, "id">;

export type CreateProductMaterialRequirementDto = {
    rawMaterialId: number;
    quantity: number;
}

export type CreateProductCommand = {
    name: string;
    value: number;
    materials: CreateProductMaterialRequirementDto[];
}

export type UpdateMaterialRequirementDto = {
    rawMaterialId: number;
    quantity: number;
}

export type UpdateProductCommand = {
    id: number;
    name: string;
    value: number;
    materials: UpdateMaterialRequirementDto[];
}