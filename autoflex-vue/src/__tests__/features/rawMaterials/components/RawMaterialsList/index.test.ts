import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import RawMaterialsList from "../../../../../features/rawMaterials/components/RawMaterialsList/index.vue";
import { renderWithPrimeVue } from "@/test/renderWithPrimeVue";

const openCreateModal = vi.fn();
const openEditModal = vi.fn();
const closeModal = vi.fn();
const saveRawMaterial = vi.fn();
const removeRawMaterial = vi.fn();
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
  editingRawMaterial: null,
  isSaving: false,
  formData: {
    name: "",
    stockQuantity: null,
  },
  openCreateModal,
  openEditModal,
  closeModal,
  saveRawMaterial,
  removeRawMaterial,
  reload: vi.fn(),
  onPageChange,
  ...overrides,
});

vi.mock("../../../../../features/rawMaterials/composables/useRawMaterials", () => ({
  useRawMaterials: vi.fn(() => makeComposableReturn()),
}));

import { useRawMaterials } from "../../../../../features/rawMaterials/composables/useRawMaterials";
const mockedUseRawMaterials = useRawMaterials as unknown as {
  mockImplementation: (impl: () => any) => void;
};

describe("RawMaterialsList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseRawMaterials.mockImplementation(() => makeComposableReturn());
  });

  it("renders title and empty subtitle", () => {
    renderWithPrimeVue(RawMaterialsList);

    expect(screen.getByText("Insumos")).toBeTruthy();
    expect(screen.getByText("0 insumos cadastrados")).toBeTruthy();
  });

  it("renders singular subtitle", () => {
    mockedUseRawMaterials.mockImplementation(() =>
      makeComposableReturn({
        totalItems: 1,
      }),
    );

    renderWithPrimeVue(RawMaterialsList);
    expect(screen.getByText("1 insumo cadastrado")).toBeTruthy();
  });

  it("calls openCreateModal on click", async () => {
    renderWithPrimeVue(RawMaterialsList);
    await userEvent.click(screen.getByRole("button", { name: "Novo Insumo" }));
    expect(openCreateModal).toHaveBeenCalledTimes(1);
  });

  it("renders raw material rows", () => {
    mockedUseRawMaterials.mockImplementation(() =>
      makeComposableReturn({
        items: [
          { id: 1, name: "Aço Carbono", stockQuantity: 300 },
          { id: 2, name: "Cobre", stockQuantity: 100 },
        ],
        totalItems: 2,
      }),
    );

    renderWithPrimeVue(RawMaterialsList);
    expect(screen.getByText("Aço Carbono")).toBeTruthy();
    expect(screen.getByText("Cobre")).toBeTruthy();
  });
});