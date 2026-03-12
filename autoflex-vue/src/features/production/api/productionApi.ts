import { httpClient } from "../../../app/api/httpClient";
import type { TotalProductionResponse } from "../types";

export const getProductionCapacity = async (): Promise<TotalProductionResponse> => {
  const response = await httpClient.get<TotalProductionResponse>("/production");
  return response.data;
};