import { httpClient } from "../../../app/api/httpClient";
import type { PaginatedResponse } from "../../../types";
import type {
  CreateRawMaterialCommand,
  RawMaterial,
  UpdateRawMaterialCommand,
} from "../types";

type GetRawMaterialsParams = {
  page?: number;
  itemsPerPage?: number;
  name?: string;
};

export const getRawMaterials = async ({
  page = 1,
  itemsPerPage = 20,
  name,
}: GetRawMaterialsParams) => {
  const params = new URLSearchParams({
    page: String(page),
    itemsPerPage: String(itemsPerPage),
  });

  if (name) {
    params.set("name", name);
  }

  const response = await httpClient.get<PaginatedResponse<RawMaterial>>(
    `/raw-materials?${params.toString()}`,
  );

  return response.data;
};

export const createRawMaterial = async (payload: CreateRawMaterialCommand) => {
  const response = await httpClient.post<RawMaterial>("/raw-materials", payload);
  return response.data;
};

export const updateRawMaterial = async (payload: UpdateRawMaterialCommand) => {
  const response = await httpClient.put<RawMaterial>(`/raw-materials/${payload.id}`, payload);
  return response.data;
};

export const deleteRawMaterial = async (id: number) => {
  await httpClient.delete(`/raw-materials/${id}`);
};