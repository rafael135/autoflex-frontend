import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import ProductModal from "../../../../../../features/products/components/ProductsList/components/ProductModal.vue";
import { renderWithPrimeVue } from "@/test/renderWithPrimeVue";

const dialogStubs = {
  Dialog: {
    props: ["header", "visible"],
    template:
      '<div v-if="visible"><h2>{{ header }}</h2><slot></slot><slot name="footer"></slot></div>',
  },
};

const getDefaultProps = () => ({
  open: true,
  editing: false,
  saving: false,
  formData: { name: "", value: null, materials: [] },
  rawMaterialOptions: [],
  hasMoreRawMaterials: false,
  isLoadingRawMaterials: false,
});

describe("ProductModal", () => {
  it("shows create title and fields", () => {
    renderWithPrimeVue(ProductModal, {
      props: getDefaultProps() as any,
      global: {
        stubs: dialogStubs,
      },
    });

    expect(screen.getByText("Novo Produto")).toBeTruthy();
    expect(screen.getByText("Nome do Produto")).toBeTruthy();
    expect(screen.getByText("Valor Unitário (R$)")).toBeTruthy();
  });

  it("shows edit title when editing", () => {
    renderWithPrimeVue(ProductModal, {
      props: {
        ...getDefaultProps(),
        editing: true,
      } as any,
      global: {
        stubs: dialogStubs,
      },
    });

    expect(screen.getByText("Editar Produto")).toBeTruthy();
  });

  it("emits add-material when clicking add button", async () => {
    const { emitted } = renderWithPrimeVue(ProductModal, {
      props: getDefaultProps() as any,
      global: {
        stubs: dialogStubs,
      },
    });

    await userEvent.click(screen.getByRole("button", { name: "Adicionar Insumo" }));
    expect(emitted("add-material")).toBeTruthy();
  });

  it("renders load more button when has more raw materials", () => {
    renderWithPrimeVue(ProductModal, {
      props: {
        ...getDefaultProps(),
        hasMoreRawMaterials: true,
      } as any,
      global: {
        stubs: dialogStubs,
      },
    });

    expect(screen.getByRole("button", { name: "Carregar mais insumos" })).toBeTruthy();
  });
});