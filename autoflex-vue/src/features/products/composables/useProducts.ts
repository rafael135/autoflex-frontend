import { onMounted, ref } from "vue";
import { useToast } from "primevue/usetoast";
import type { Product } from "../types";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../api/productsApi";
import { getRawMaterials } from "../../rawMaterials/api/rawMaterialsApi";
import type { CreateProductMaterialRequirementDto } from "../types";

type ProductFormMaterial = {
  rawMaterialId: number | null;
  quantity: number | null;
};

type ProductFormData = {
  name: string;
  value: number | null;
  materials: ProductFormMaterial[];
};

type RawMaterialOption = {
  value: number;
  label: string;
};

const RAW_MATERIALS_ITEMS_PER_PAGE = 20;

export const useProducts = () => {
  const toast = useToast();
  const items = ref<Product[]>([]);
  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const totalItems = ref(0);
  const isLoading = ref(false);
  const loadErrorMessage = ref("");
  const createError = ref(false);
  const updateError = ref(false);

  const isModalOpen = ref(false);
  const editingProduct = ref<Product | null>(null);
  const isSaving = ref(false);
  const formData = ref<ProductFormData>({
    name: "",
    value: 0,
    materials: [],
  });

  const rawMaterialOptions = ref<RawMaterialOption[]>([]);
  const rawMaterialsSearch = ref("");
  const rawMaterialsPage = ref(1);
  const hasMoreRawMaterials = ref(false);
  const isLoadingRawMaterials = ref(false);

  let searchDebounce: ReturnType<typeof setTimeout> | null = null;

  const resetForm = () => {
    formData.value = {
      name: "",
      value: 0,
      materials: [],
    };
  };

  const appendRawMaterialOptions = (options: RawMaterialOption[], append: boolean) => {
    const base = append ? rawMaterialOptions.value : [];
    const merged = [...base, ...options];
    rawMaterialOptions.value = merged.filter(
      (option, index, arr) => arr.findIndex((entry) => entry.value === option.value) === index,
    );
  };

  const loadRawMaterials = async (search: string, page: number, append: boolean) => {
    isLoadingRawMaterials.value = true;
    try {
      const response = await getRawMaterials({
        name: search,
        page,
        itemsPerPage: RAW_MATERIALS_ITEMS_PER_PAGE,
      });
      appendRawMaterialOptions(
        response.data.map((rawMaterial) => ({ value: rawMaterial.id, label: rawMaterial.name })),
        append,
      );
      hasMoreRawMaterials.value = response.currentPage < response.totalPages;
    } finally {
      isLoadingRawMaterials.value = false;
    }
  };

  const loadRawMaterialsForModal = async () => {
    rawMaterialsSearch.value = "";
    rawMaterialsPage.value = 1;
    await loadRawMaterials("", 1, false);
  };

  const onSearchRawMaterials = (search: string) => {
    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }
    searchDebounce = setTimeout(() => {
      rawMaterialsSearch.value = search;
      rawMaterialsPage.value = 1;
      void loadRawMaterials(search, 1, false);
    }, 300);
  };

  const onLoadMoreRawMaterials = async () => {
    if (!hasMoreRawMaterials.value || isLoadingRawMaterials.value) {
      return;
    }

    const nextPage = rawMaterialsPage.value + 1;
    rawMaterialsPage.value = nextPage;
    await loadRawMaterials(rawMaterialsSearch.value, nextPage, true);
  };

  const loadData = async () => {
    isLoading.value = true;
    loadErrorMessage.value = "";

    try {
      const response = await getProducts({
        page: currentPage.value,
        itemsPerPage: itemsPerPage.value,
      });
      items.value = response.data;
      totalItems.value = response.totalItems;
    } catch {
      loadErrorMessage.value = "Erro ao carregar produtos.";
    } finally {
      isLoading.value = false;
    }
  };

  const validateForm = () => {
    if (!formData.value.name.trim()) {
      return "Informe o nome do produto.";
    }

    if (formData.value.value === null || formData.value.value < 0) {
      return "Informe um valor unitário válido.";
    }

    const hasInvalidMaterial = formData.value.materials.some(
      (material) => !material.rawMaterialId || !material.quantity || material.quantity <= 0,
    );
    if (hasInvalidMaterial) {
      return "Preencha corretamente os insumos e quantidades.";
    }

    return "";
  };

  const mapMaterialsPayload = (): CreateProductMaterialRequirementDto[] =>
    formData.value.materials
      .filter((material) => !!material.rawMaterialId && !!material.quantity && material.quantity > 0)
      .map((material) => ({
        rawMaterialId: Number(material.rawMaterialId),
        quantity: Number(material.quantity),
      }));

  const openCreateModal = async () => {
    editingProduct.value = null;
    createError.value = false;
    updateError.value = false;
    resetForm();
    isModalOpen.value = true;
    await loadRawMaterialsForModal();
  };

  const openEditModal = async (product: Product) => {
    editingProduct.value = product;
    createError.value = false;
    updateError.value = false;
    formData.value = {
      name: product.name,
      value: product.value,
      materials: product.materials.map((material) => ({
        rawMaterialId: material.rawMaterialId,
        quantity: material.quantity,
      })),
    };
    isModalOpen.value = true;
    rawMaterialOptions.value = product.materials.map((material) => ({
      value: material.rawMaterialId,
      label: material.name,
    }));
    await loadRawMaterialsForModal();
  };

  const closeModal = () => {
    isModalOpen.value = false;
    editingProduct.value = null;
    resetForm();
  };

  const addMaterialRow = () => {
    formData.value.materials.push({ rawMaterialId: null, quantity: 1 });
  };

  const removeMaterialRow = (index: number) => {
    formData.value.materials.splice(index, 1);
  };

  const saveProduct = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.add({ severity: "warn", summary: "Validação", detail: validationError, life: 3000 });
      return;
    }

    isSaving.value = true;
    createError.value = false;
    updateError.value = false;

    const payload = {
      name: formData.value.name.trim(),
      value: Number(formData.value.value ?? 0),
      materials: mapMaterialsPayload(),
    };

    try {
      if (editingProduct.value) {
        await updateProduct({ id: editingProduct.value.id, ...payload });
        toast.add({
          severity: "success",
          summary: "Sucesso",
          detail: "Produto atualizado com sucesso!",
          life: 2500,
        });
      } else {
        await createProduct(payload);
        toast.add({
          severity: "success",
          summary: "Sucesso",
          detail: "Produto cadastrado com sucesso!",
          life: 2500,
        });
      }

      closeModal();
      await loadData();
    } catch {
      if (editingProduct.value) {
        updateError.value = true;
      } else {
        createError.value = true;
      }
    } finally {
      isSaving.value = false;
    }
  };

  const removeProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Produto excluído com sucesso!",
        life: 2500,
      });
      await loadData();
    } catch {
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao excluir produto. Tente novamente.",
        life: 3000,
      });
    }
  };

  const onPageChange = (page: number, rows: number) => {
    currentPage.value = page;
    itemsPerPage.value = rows;
    void loadData();
  };

  onMounted(() => {
    void loadData();
  });

  return {
    items,
    currentPage,
    itemsPerPage,
    totalItems,
    isLoading,
    loadErrorMessage,
    createError,
    updateError,
    isModalOpen,
    editingProduct,
    formData,
    isSaving,
    rawMaterialOptions,
    hasMoreRawMaterials,
    isLoadingRawMaterials,
    openCreateModal,
    openEditModal,
    closeModal,
    saveProduct,
    removeProduct,
    addMaterialRow,
    removeMaterialRow,
    onSearchRawMaterials,
    onLoadMoreRawMaterials,
    reload: loadData,
    onPageChange,
  };
};