import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/vue";
import RawMaterialModal from "../../../../../../features/rawMaterials/components/RawMaterialsList/components/RawMaterialModal.vue";
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
  formData: {
    name: "",
    stockQuantity: null,
  },
});

describe("RawMaterialModal", () => {
  it("shows create title and fields", () => {
    renderWithPrimeVue(RawMaterialModal, {
      props: getDefaultProps() as any,
      global: {
        stubs: dialogStubs,
      },
    });

    expect(screen.getByText("Novo Insumo")).toBeTruthy();
    expect(screen.getByText("Nome do Insumo")).toBeTruthy();
    expect(screen.getByText("Quantidade em Estoque")).toBeTruthy();
  });

  it("shows edit title when editing", () => {
    renderWithPrimeVue(RawMaterialModal, {
      props: {
        ...getDefaultProps(),
        editing: true,
      } as any,
      global: {
        stubs: dialogStubs,
      },
    });

    expect(screen.getByText("Editar Insumo")).toBeTruthy();
  });
});