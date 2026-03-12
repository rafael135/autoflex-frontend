import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import ProductsList from "../../../../../features/products/components/ProductsList/index.vue";
import { renderWithPrimeVue } from "@/test/renderWithPrimeVue";

const openCreateModal = vi.fn();
const openEditModal = vi.fn();
const closeModal = vi.fn();
const saveProduct = vi.fn();
const removeProduct = vi.fn();
const addMaterialRow = vi.fn();
const removeMaterialRow = vi.fn();
const onSearchRawMaterials = vi.fn();
const onLoadMoreRawMaterials = vi.fn();
const onPageChange = vi.fn();

const makeComposableReturn = (overrides = {}) => ({
  items: [],
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  isLoading: false,
  loadErrorMessage: "",
  createError: false,
  updateError: false,
  isModalOpen: false,
  editingProduct: null,
  formData: { name: "", value: null, materials: [] },
  isSaving: false,
  rawMaterialOptions: [],
  hasMoreRawMaterials: false,
  isLoadingRawMaterials: false,
  openCreateModal,
  openEditModal,
  closeModal,
  saveProduct,
  removeProduct,
  addMaterialRow,
  removeMaterialRow,
  onSearchRawMaterials,
  onLoadMoreRawMaterials,
  reload: vi.fn(),
  onPageChange,
  ...overrides,
});

vi.mock("../../../../../features/products/composables/useProducts", () => ({
  useProducts: vi.fn(() => makeComposableReturn()),
}));

import { useProducts } from "../../../../../features/products/composables/useProducts";
const mockedUseProducts = useProducts as unknown as { mockImplementation: (impl: () => any) => void };

describe("ProductsList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseProducts.mockImplementation(() => makeComposableReturn());
  });

  it("renders title and empty subtitle", () => {
    renderWithPrimeVue(ProductsList);

    expect(screen.getByText("Produtos")).toBeTruthy();
    expect(screen.getByText("0 produtos cadastrados")).toBeTruthy();
  });

  it("renders singular subtitle", () => {
    mockedUseProducts.mockImplementation(() =>
      makeComposableReturn({
        totalItems: 1,
      }),
    );

    renderWithPrimeVue(ProductsList);
    expect(screen.getByText("1 produto cadastrado")).toBeTruthy();
  });

  it("calls openCreateModal on click", async () => {
    renderWithPrimeVue(ProductsList);
    await userEvent.click(screen.getByRole("button", { name: "Novo Produto" }));
    expect(openCreateModal).toHaveBeenCalledTimes(1);
  });

  it("renders product rows", () => {
    mockedUseProducts.mockImplementation(() =>
      makeComposableReturn({
        items: [
          { id: 1, name: "Produto Alpha", value: 100, materials: [] },
          {
            id: 2,
            name: "Produto Beta",
            value: 200,
            materials: [{ rawMaterialId: 1, name: "Aço", quantity: 2 }],
          },
        ],
        totalItems: 2,
      }),
    );

    renderWithPrimeVue(ProductsList);
    expect(screen.getByText("Produto Alpha")).toBeTruthy();
    expect(screen.getByText("Produto Beta")).toBeTruthy();
  });
});