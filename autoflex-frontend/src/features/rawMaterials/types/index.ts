export type RawMaterial = {
    id: number;
    name: string;
    stockQuantity: number;
}

export type RawMaterialDto = Omit<RawMaterial, "id">;


export type CreateRawMaterialCommand = {
    name: string;
    stockQuantity: number;
}

export type UpdateRawMaterialCommand = {
    id: number;
    name: string;
    stockQuantity: number;
}