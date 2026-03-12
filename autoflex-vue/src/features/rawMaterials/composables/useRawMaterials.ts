import { onMounted, ref } from "vue";
import type { RawMaterial } from "../types";
import { getRawMaterials } from "../api/rawMaterialsApi";

export const useRawMaterials = () => {
  const items = ref<RawMaterial[]>([]);
  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const totalItems = ref(0);
  const isLoading = ref(false);
  const errorMessage = ref("");

  const loadData = async () => {
    isLoading.value = true;
    errorMessage.value = "";

    try {
      const response = await getRawMaterials({
        page: currentPage.value,
        itemsPerPage: itemsPerPage.value,
      });
      items.value = response.data;
      totalItems.value = response.totalItems;
    } catch {
      errorMessage.value = "Erro ao carregar insumos.";
    } finally {
      isLoading.value = false;
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
    errorMessage,
    reload: loadData,
    onPageChange,
  };
};