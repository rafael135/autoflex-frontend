import { describe, it, expect, vi, beforeEach } from "vitest";
import { defineComponent, h } from "vue";
import { waitFor } from "@testing-library/vue";
import { renderWithPrimeVue } from "@/test/renderWithPrimeVue";
import type { PaginatedResponse } from "@/types";
import type { RawMaterial } from "@/features/rawMaterials/types";

const {
  mockToastAdd,
  mockGetRawMaterials,
  mockCreateRawMaterial,
  mockUpdateRawMaterial,
  mockDeleteRawMaterial,
} = vi.hoisted(() => ({
  mockToastAdd: vi.fn(),
  mockGetRawMaterials: vi.fn(),
  mockCreateRawMaterial: vi.fn(),
  mockUpdateRawMaterial: vi.fn(),
  mockDeleteRawMaterial: vi.fn(),
}));

vi.mock("primevue/usetoast", () => ({
  useToast: () => ({ add: mockToastAdd }),
}));

vi.mock("@/features/rawMaterials/api/rawMaterialsApi", () => ({
  getRawMaterials: mockGetRawMaterials,
  createRawMaterial: mockCreateRawMaterial,
  updateRawMaterial: mockUpdateRawMaterial,
  deleteRawMaterial: mockDeleteRawMaterial,
}));

import { useRawMaterials } from "@/features/rawMaterials/composables/useRawMaterials";

const makeRawMaterialsResponse = (
  overrides: Partial<PaginatedResponse<RawMaterial>> = {},
): PaginatedResponse<RawMaterial> => ({
  data: [],
  totalItems: 0,
  currentPage: 1,
  totalPages: 1,
  ...overrides,
});

describe("useRawMaterials", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetRawMaterials.mockResolvedValue(makeRawMaterialsResponse());
  });

  it("loads raw materials on mount", async () => {
    let composable: ReturnType<typeof useRawMaterials> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useRawMaterials();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);

    await waitFor(() => {
      expect(mockGetRawMaterials).toHaveBeenCalledWith({ page: 1, itemsPerPage: 10 });
    });

    expect(composable?.items.value).toEqual([]);
    expect(composable?.totalItems.value).toBe(0);
    expect(composable?.loadErrorMessage.value).toBe("");
  });

  it("openEditModal updates form with selected item", async () => {
    let composable: ReturnType<typeof useRawMaterials> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useRawMaterials();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);
    await waitFor(() => expect(mockGetRawMaterials).toHaveBeenCalledTimes(1));

    composable?.openEditModal({ id: 3, name: "Cobre", stockQuantity: 15 });

    expect(composable?.isModalOpen.value).toBe(true);
    expect(composable?.editingRawMaterial.value?.id).toBe(3);
    expect(composable?.formData.value).toEqual({ name: "Cobre", stockQuantity: 15 });
  });

  it("saveRawMaterial validates name before create", async () => {
    let composable: ReturnType<typeof useRawMaterials> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useRawMaterials();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);
    await waitFor(() => expect(mockGetRawMaterials).toHaveBeenCalledTimes(1));

    composable?.openCreateModal();
    if (!composable) {
      throw new Error("Composable not initialized");
    }

    composable.formData.value = { name: "", stockQuantity: 7 };
    await composable.saveRawMaterial();

    expect(mockCreateRawMaterial).not.toHaveBeenCalled();
    expect(mockToastAdd).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "warn", detail: "Informe o nome do insumo." }),
    );
  });

  it("creates raw material and reloads list", async () => {
    mockCreateRawMaterial.mockResolvedValue({});

    let composable: ReturnType<typeof useRawMaterials> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useRawMaterials();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);
    await waitFor(() => expect(mockGetRawMaterials).toHaveBeenCalledTimes(1));

    composable?.openCreateModal();
    if (!composable) {
      throw new Error("Composable not initialized");
    }

    composable.formData.value = { name: "Aço", stockQuantity: 30 };
    await composable.saveRawMaterial();

    expect(mockCreateRawMaterial).toHaveBeenCalledWith({ name: "Aço", stockQuantity: 30 });
    expect(composable.isModalOpen.value).toBe(false);
    expect(mockGetRawMaterials).toHaveBeenCalledTimes(2);
    expect(mockToastAdd).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "success", detail: "Insumo cadastrado com sucesso!" }),
    );
  });

  it("sets createError when create request fails", async () => {
    mockCreateRawMaterial.mockRejectedValue(new Error("create-error"));

    let composable: ReturnType<typeof useRawMaterials> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useRawMaterials();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);
    await waitFor(() => expect(mockGetRawMaterials).toHaveBeenCalledTimes(1));

    composable?.openCreateModal();
    if (!composable) {
      throw new Error("Composable not initialized");
    }

    composable.formData.value = { name: "Insumo erro", stockQuantity: 10 };
    await composable.saveRawMaterial();

    expect(mockCreateRawMaterial).toHaveBeenCalledTimes(1);
    expect(composable.createError.value).toBe(true);
    expect(composable.isModalOpen.value).toBe(true);
  });

  it("sets updateError when update request fails", async () => {
    mockUpdateRawMaterial.mockRejectedValue(new Error("update-error"));

    let composable: ReturnType<typeof useRawMaterials> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useRawMaterials();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);
    await waitFor(() => expect(mockGetRawMaterials).toHaveBeenCalledTimes(1));

    composable?.openEditModal({ id: 5, name: "Cobre", stockQuantity: 20 });
    await composable?.saveRawMaterial();

    expect(mockUpdateRawMaterial).toHaveBeenCalledTimes(1);
    expect(composable?.updateError.value).toBe(true);
    expect(composable?.isModalOpen.value).toBe(true);
  });

  it("removeRawMaterial deletes and reloads list", async () => {
    mockDeleteRawMaterial.mockResolvedValue(undefined);

    let composable: ReturnType<typeof useRawMaterials> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useRawMaterials();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);
    await waitFor(() => expect(mockGetRawMaterials).toHaveBeenCalledTimes(1));

    await composable?.removeRawMaterial(9);

    expect(mockDeleteRawMaterial).toHaveBeenCalledWith(9);
    expect(mockGetRawMaterials).toHaveBeenCalledTimes(2);
    expect(mockToastAdd).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "success", detail: "Insumo excluído com sucesso!" }),
    );
  });

  it("removeRawMaterial shows error toast when delete fails", async () => {
    mockDeleteRawMaterial.mockRejectedValue(new Error("delete-error"));

    let composable: ReturnType<typeof useRawMaterials> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useRawMaterials();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);
    await waitFor(() => expect(mockGetRawMaterials).toHaveBeenCalledTimes(1));

    await composable?.removeRawMaterial(9);

    expect(mockDeleteRawMaterial).toHaveBeenCalledWith(9);
    expect(mockGetRawMaterials).toHaveBeenCalledTimes(1);
    expect(mockToastAdd).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "error", detail: "Erro ao excluir insumo. Tente novamente." }),
    );
  });

  it("sets loadErrorMessage when initial load fails", async () => {
    mockGetRawMaterials.mockRejectedValue(new Error("load-error"));

    let composable: ReturnType<typeof useRawMaterials> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useRawMaterials();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);

    await waitFor(() => {
      expect(composable?.loadErrorMessage.value).toBe("Erro ao carregar insumos.");
    });
    expect(composable?.isLoading.value).toBe(false);
  });
});
