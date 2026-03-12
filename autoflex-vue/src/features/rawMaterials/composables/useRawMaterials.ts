import { onMounted, ref } from "vue";
import { useToast } from "primevue/usetoast";
import type { RawMaterial } from "../types";
import {
  createRawMaterial,
  deleteRawMaterial,
  getRawMaterials,
  updateRawMaterial,
} from "../api/rawMaterialsApi";

type RawMaterialFormData = {
  name: string;
  stockQuantity: number | null;
};

export const useRawMaterials = () => {
  const toast = useToast();
  const items = ref<RawMaterial[]>([]);
  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const totalItems = ref(0);
  const isLoading = ref(false);
  const loadErrorMessage = ref("");
  const createError = ref(false);
  const updateError = ref(false);

  const isModalOpen = ref(false);
  const editingRawMaterial = ref<RawMaterial | null>(null);
  const isSaving = ref(false);
  const formData = ref<RawMaterialFormData>({
    name: "",
    stockQuantity: 0,
  });

  const resetForm = () => {
    formData.value = {
      name: "",
      stockQuantity: 0,
    };
  };

  const loadData = async () => {
    isLoading.value = true;
    loadErrorMessage.value = "";

    try {
      const response = await getRawMaterials({
        page: currentPage.value,
        itemsPerPage: itemsPerPage.value,
      });
      items.value = response.data;
      totalItems.value = response.totalItems;
    } catch {
      loadErrorMessage.value = "Erro ao carregar insumos.";
    } finally {
      isLoading.value = false;
    }
  };

  const validateForm = () => {
    if (!formData.value.name.trim()) {
      return "Informe o nome do insumo.";
    }

    if (formData.value.stockQuantity === null || formData.value.stockQuantity < 0) {
      return "Informe uma quantidade em estoque válida.";
    }

    return "";
  };

  const openCreateModal = () => {
    editingRawMaterial.value = null;
    createError.value = false;
    updateError.value = false;
    resetForm();
    isModalOpen.value = true;
  };

  const openEditModal = (rawMaterial: RawMaterial) => {
    editingRawMaterial.value = rawMaterial;
    createError.value = false;
    updateError.value = false;
    formData.value = {
      name: rawMaterial.name,
      stockQuantity: rawMaterial.stockQuantity,
    };
    isModalOpen.value = true;
  };

  const closeModal = () => {
    isModalOpen.value = false;
    editingRawMaterial.value = null;
    resetForm();
  };

  const saveRawMaterial = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.add({ severity: "warn", summary: "Validação", detail: validationError, life: 3000 });
      return;
    }

    createError.value = false;
    updateError.value = false;
    isSaving.value = true;

    const payload = {
      name: formData.value.name.trim(),
      stockQuantity: Number(formData.value.stockQuantity ?? 0),
    };

    try {
      if (editingRawMaterial.value) {
        await updateRawMaterial({ id: editingRawMaterial.value.id, ...payload });
        toast.add({
          severity: "success",
          summary: "Sucesso",
          detail: "Insumo atualizado com sucesso!",
          life: 2500,
        });
      } else {
        await createRawMaterial(payload);
        toast.add({
          severity: "success",
          summary: "Sucesso",
          detail: "Insumo cadastrado com sucesso!",
          life: 2500,
        });
      }

      closeModal();
      await loadData();
    } catch {
      if (editingRawMaterial.value) {
        updateError.value = true;
      } else {
        createError.value = true;
      }
    } finally {
      isSaving.value = false;
    }
  };

  const removeRawMaterial = async (id: number) => {
    try {
      await deleteRawMaterial(id);
      toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Insumo excluído com sucesso!",
        life: 2500,
      });
      await loadData();
    } catch {
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao excluir insumo. Tente novamente.",
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
    editingRawMaterial,
    isSaving,
    formData,
    openCreateModal,
    openEditModal,
    closeModal,
    saveRawMaterial,
    removeRawMaterial,
    reload: loadData,
    onPageChange,
  };
};