import { describe, it, expect, vi, beforeEach } from "vitest";
import { defineComponent, h } from "vue";
import { waitFor } from "@testing-library/vue";
import { renderWithPrimeVue } from "@/test/renderWithPrimeVue";
import type { PaginatedResponse } from "@/types";
import type { Product } from "@/features/products/types";

const {
  mockToastAdd,
  mockGetProducts,
  mockCreateProduct,
  mockUpdateProduct,
  mockDeleteProduct,
  mockGetRawMaterials,
} = vi.hoisted(() => ({
  mockToastAdd: vi.fn(),
  mockGetProducts: vi.fn(),
  mockCreateProduct: vi.fn(),
  mockUpdateProduct: vi.fn(),
  mockDeleteProduct: vi.fn(),
  mockGetRawMaterials: vi.fn(),
}));

vi.mock("primevue/usetoast", () => ({
  useToast: () => ({ add: mockToastAdd }),
}));

vi.mock("@/features/products/api/productsApi", () => ({
  getProducts: mockGetProducts,
  createProduct: mockCreateProduct,
  updateProduct: mockUpdateProduct,
  deleteProduct: mockDeleteProduct,
}));

vi.mock("@/features/rawMaterials/api/rawMaterialsApi", () => ({
  getRawMaterials: mockGetRawMaterials,
}));

import { useProducts } from "@/features/products/composables/useProducts";

const makeProductsResponse = (overrides: Partial<PaginatedResponse<Product>> = {}): PaginatedResponse<Product> => ({
  data: [],
  totalItems: 0,
  currentPage: 1,
  totalPages: 1,
  ...overrides,
});

describe("useProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetProducts.mockResolvedValue(makeProductsResponse());
    mockGetRawMaterials.mockResolvedValue({ data: [], totalItems: 0, currentPage: 1, totalPages: 1 });
  });

  it("loads products on mount", async () => {
    let composable: ReturnType<typeof useProducts> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useProducts();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);

    await waitFor(() => {
      expect(mockGetProducts).toHaveBeenCalledWith({ page: 1, itemsPerPage: 10 });
    });

    expect(composable?.items.value).toEqual([]);
    expect(composable?.totalItems.value).toBe(0);
    expect(composable?.loadErrorMessage.value).toBe("");
  });

  it("openCreateModal opens modal and loads raw materials", async () => {
    let composable: ReturnType<typeof useProducts> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useProducts();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);

    await waitFor(() => expect(mockGetProducts).toHaveBeenCalledTimes(1));

    await composable?.openCreateModal();

    expect(composable?.isModalOpen.value).toBe(true);
    expect(composable?.editingProduct.value).toBeNull();
    expect(mockGetRawMaterials).toHaveBeenCalledWith({ name: "", page: 1, itemsPerPage: 20 });
  });

  it("saveProduct validates required name", async () => {
    let composable: ReturnType<typeof useProducts> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useProducts();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);

    await waitFor(() => expect(mockGetProducts).toHaveBeenCalledTimes(1));
    await composable?.openCreateModal();

    if (!composable) {
      throw new Error("Composable not initialized");
    }

    composable.formData.value = { name: "", value: 10, materials: [] };
    await composable.saveProduct();

    expect(mockCreateProduct).not.toHaveBeenCalled();
    expect(mockToastAdd).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "warn", detail: "Informe o nome do produto." }),
    );
  });

  it("creates product successfully and reloads list", async () => {
    mockCreateProduct.mockResolvedValue({});
    mockGetProducts
      .mockResolvedValueOnce(makeProductsResponse())
      .mockResolvedValueOnce(makeProductsResponse({ data: [{ id: 1, name: "Novo", value: 30, materials: [] }], totalItems: 1 }));

    let composable: ReturnType<typeof useProducts> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useProducts();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);
    await waitFor(() => expect(mockGetProducts).toHaveBeenCalledTimes(1));

    await composable?.openCreateModal();
    if (!composable) {
      throw new Error("Composable not initialized");
    }

    composable.formData.value = {
      name: "Produto Novo",
      value: 30,
      materials: [{ rawMaterialId: 5, quantity: 2 }],
    };

    await composable.saveProduct();

    expect(mockCreateProduct).toHaveBeenCalledWith({
      name: "Produto Novo",
      value: 30,
      materials: [{ rawMaterialId: 5, quantity: 2 }],
    });
    expect(composable.isModalOpen.value).toBe(false);
    expect(mockGetProducts).toHaveBeenCalledTimes(2);
    expect(mockToastAdd).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "success", detail: "Produto cadastrado com sucesso!" }),
    );
  });

  it("sets createError when create request fails", async () => {
    mockCreateProduct.mockRejectedValue(new Error("create-error"));

    let composable: ReturnType<typeof useProducts> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useProducts();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);
    await waitFor(() => expect(mockGetProducts).toHaveBeenCalledTimes(1));

    await composable?.openCreateModal();
    if (!composable) {
      throw new Error("Composable not initialized");
    }

    composable.formData.value = {
      name: "Produto com erro",
      value: 100,
      materials: [{ rawMaterialId: 1, quantity: 1 }],
    };

    await composable.saveProduct();

    expect(mockCreateProduct).toHaveBeenCalledTimes(1);
    expect(composable.createError.value).toBe(true);
    expect(composable.isModalOpen.value).toBe(true);
  });

  it("sets updateError when update request fails", async () => {
    mockUpdateProduct.mockRejectedValue(new Error("update-error"));

    let composable: ReturnType<typeof useProducts> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useProducts();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);
    await waitFor(() => expect(mockGetProducts).toHaveBeenCalledTimes(1));

    await composable?.openEditModal({
      id: 7,
      name: "Produto existente",
      value: 75,
      materials: [{ rawMaterialId: 1, name: "Aço", quantity: 2 }],
    });

    await composable?.saveProduct();

    expect(mockUpdateProduct).toHaveBeenCalledTimes(1);
    expect(composable?.updateError.value).toBe(true);
    expect(composable?.isModalOpen.value).toBe(true);
  });

  it("onPageChange updates pagination and loads requested page", async () => {
    let composable: ReturnType<typeof useProducts> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useProducts();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);
    await waitFor(() => expect(mockGetProducts).toHaveBeenCalledTimes(1));

    composable?.onPageChange(2, 20);

    await waitFor(() => {
      expect(mockGetProducts).toHaveBeenLastCalledWith({ page: 2, itemsPerPage: 20 });
    });

    expect(composable?.currentPage.value).toBe(2);
    expect(composable?.itemsPerPage.value).toBe(20);
  });

  it("removeProduct deletes and reloads list", async () => {
    mockDeleteProduct.mockResolvedValue(undefined);

    let composable: ReturnType<typeof useProducts> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useProducts();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);
    await waitFor(() => expect(mockGetProducts).toHaveBeenCalledTimes(1));

    await composable?.removeProduct(10);

    expect(mockDeleteProduct).toHaveBeenCalledWith(10);
    expect(mockGetProducts).toHaveBeenCalledTimes(2);
    expect(mockToastAdd).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "success", detail: "Produto excluído com sucesso!" }),
    );
  });

  it("removeProduct shows error toast when delete fails", async () => {
    mockDeleteProduct.mockRejectedValue(new Error("delete-error"));

    let composable: ReturnType<typeof useProducts> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useProducts();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);
    await waitFor(() => expect(mockGetProducts).toHaveBeenCalledTimes(1));

    await composable?.removeProduct(10);

    expect(mockDeleteProduct).toHaveBeenCalledWith(10);
    expect(mockGetProducts).toHaveBeenCalledTimes(1);
    expect(mockToastAdd).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "error", detail: "Erro ao excluir produto. Tente novamente." }),
    );
  });

  it("debounces raw materials search and uses latest term", async () => {
    vi.useFakeTimers();
    try {
      let composable: ReturnType<typeof useProducts> | undefined;
      const Harness = defineComponent({
        setup() {
          composable = useProducts();
          return () => h("div");
        },
      });

      renderWithPrimeVue(Harness);
      await waitFor(() => expect(mockGetProducts).toHaveBeenCalledTimes(1));

      composable?.onSearchRawMaterials("aco");
      composable?.onSearchRawMaterials("aco carbono");

      expect(mockGetRawMaterials).toHaveBeenCalledTimes(0);

      vi.advanceTimersByTime(300);
      await Promise.resolve();

      expect(mockGetRawMaterials).toHaveBeenCalledTimes(1);
      expect(mockGetRawMaterials).toHaveBeenLastCalledWith({
        name: "aco carbono",
        page: 1,
        itemsPerPage: 20,
      });
    } finally {
      vi.useRealTimers();
    }
  });

  it("loads next page of raw materials when hasMoreRawMaterials is true", async () => {
    mockGetRawMaterials
      .mockResolvedValueOnce({
        data: [{ id: 1, name: "Aço", stockQuantity: 10 }],
        totalItems: 21,
        currentPage: 1,
        totalPages: 2,
      })
      .mockResolvedValueOnce({
        data: [{ id: 2, name: "Cobre", stockQuantity: 5 }],
        totalItems: 21,
        currentPage: 2,
        totalPages: 2,
      });

    let composable: ReturnType<typeof useProducts> | undefined;
    const Harness = defineComponent({
      setup() {
        composable = useProducts();
        return () => h("div");
      },
    });

    renderWithPrimeVue(Harness);
    await waitFor(() => expect(mockGetProducts).toHaveBeenCalledTimes(1));

    await composable?.openCreateModal();
    await composable?.onLoadMoreRawMaterials();

    expect(mockGetRawMaterials).toHaveBeenCalledTimes(2);
    expect(mockGetRawMaterials).toHaveBeenLastCalledWith({
      name: "",
      page: 2,
      itemsPerPage: 20,
    });
    expect(composable?.hasMoreRawMaterials.value).toBe(false);
  });
});
