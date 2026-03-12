import { httpClient } from "../../../app/api/httpClient";
import type { PaginatedResponse } from "../../../types";
import type { CreateProductCommand, Product, UpdateProductCommand } from "../types";

type GetProductsParams = { page?: number; itemsPerPage?: number };

export const getProducts = async ({ page = 1, itemsPerPage = 10 }: GetProductsParams) => {
  const response = await httpClient.get<PaginatedResponse<Product>>(
    `/products?page=${page}&itemsPerPage=${itemsPerPage}`,
  );

  return response.data;
};

export const createProduct = async (payload: CreateProductCommand) => {
  const response = await httpClient.post<Product>("/products", payload);
  return response.data;
};

export const updateProduct = async (payload: UpdateProductCommand) => {
  const response = await httpClient.put<Product>(`/products/${payload.id}`, payload);
  return response.data;
};

export const deleteProduct = async (id: number) => {
  await httpClient.delete(`/products/${id}`);
};