import { describe, it, expect, vi, beforeEach } from "vitest";
import { defineComponent, h } from "vue";
import { waitFor } from "@testing-library/vue";
import { renderWithPrimeVue } from "@/test/renderWithPrimeVue";
import type { TotalProductionResponse } from "@/features/production/types";

const { mockGetProductionCapacity } = vi.hoisted(() => ({
  mockGetProductionCapacity: vi.fn(),
}));

vi.mock("@/features/production/api/productionApi", () => ({
  getProductionCapacity: mockGetProductionCapacity,
}));

import { useProduction } from "@/features/production/composables/useProduction";

describe("useProduction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads production data on mount and computes topProduct", async () => {
    const payload: TotalProductionResponse = {
      products: [
        { id: 1, name: "Produto A", maxProductionCapacity: 120, totalValue: 1200 },
        { id: 2, name: "Produto B", maxProductionCapacity: 180, totalValue: 2000 },
      ],
      totalProductionValue: 3200,
    };

    mockGetProductionCapacity.mockResolvedValue(payload);

    let composable: ReturnType<typeof useProduction> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useProduction();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);

    await waitFor(() => {
      expect(mockGetProductionCapacity).toHaveBeenCalledTimes(1);
    });

    expect(composable?.data.value).toEqual(payload);
    expect(composable?.topProduct.value?.name).toBe("Produto B");
    expect(composable?.errorMessage.value).toBe("");
    expect(composable?.isLoading.value).toBe(false);
  });

  it("sets error message when request fails", async () => {
    mockGetProductionCapacity.mockRejectedValue(new Error("network"));

    let composable: ReturnType<typeof useProduction> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useProduction();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);

    await waitFor(() => {
      expect(mockGetProductionCapacity).toHaveBeenCalledTimes(1);
    });

    expect(composable?.data.value).toBeNull();
    expect(composable?.topProduct.value).toBeNull();
    expect(composable?.errorMessage.value).toBe("Erro ao carregar dados de produção.");
    expect(composable?.isLoading.value).toBe(false);
  });

  it("reload fetches data again", async () => {
    mockGetProductionCapacity
      .mockResolvedValueOnce({
        products: [{ id: 1, name: "Produto A", maxProductionCapacity: 100, totalValue: 1000 }],
        totalProductionValue: 1000,
      })
      .mockResolvedValueOnce({
        products: [{ id: 2, name: "Produto B", maxProductionCapacity: 220, totalValue: 2200 }],
        totalProductionValue: 2200,
      });

    let composable: ReturnType<typeof useProduction> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useProduction();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);

    await waitFor(() => {
      expect(mockGetProductionCapacity).toHaveBeenCalledTimes(1);
    });

    await composable?.reload();

    expect(mockGetProductionCapacity).toHaveBeenCalledTimes(2);
    expect(composable?.topProduct.value?.name).toBe("Produto B");
  });

  it("recovers from initial error after reload", async () => {
    mockGetProductionCapacity
      .mockRejectedValueOnce(new Error("initial-error"))
      .mockResolvedValueOnce({
        products: [{ id: 3, name: "Produto C", maxProductionCapacity: 300, totalValue: 3300 }],
        totalProductionValue: 3300,
      });

    let composable: ReturnType<typeof useProduction> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useProduction();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);

    await waitFor(() => {
      expect(composable?.errorMessage.value).toBe("Erro ao carregar dados de produção.");
    });

    await composable?.reload();

    expect(mockGetProductionCapacity).toHaveBeenCalledTimes(2);
    expect(composable?.errorMessage.value).toBe("");
    expect(composable?.topProduct.value?.name).toBe("Produto C");
  });

  it("keeps previous data when reload fails", async () => {
    mockGetProductionCapacity
      .mockResolvedValueOnce({
        products: [{ id: 1, name: "Produto A", maxProductionCapacity: 120, totalValue: 1200 }],
        totalProductionValue: 1200,
      })
      .mockRejectedValueOnce(new Error("reload-error"));

    let composable: ReturnType<typeof useProduction> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useProduction();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);

    await waitFor(() => {
      expect(mockGetProductionCapacity).toHaveBeenCalledTimes(1);
    });

    await composable?.reload();

    expect(mockGetProductionCapacity).toHaveBeenCalledTimes(2);
    expect(composable?.errorMessage.value).toBe("Erro ao carregar dados de produção.");
    expect(composable?.topProduct.value?.name).toBe("Produto A");
    expect(composable?.data.value?.totalProductionValue).toBe(1200);
  });
});
