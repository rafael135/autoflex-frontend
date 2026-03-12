import { computed, onMounted, ref } from "vue";
import { getProductionCapacity } from "../api/productionApi";
import type { TotalProductionResponse } from "../types";

export const useProduction = () => {
  const data = ref<TotalProductionResponse | null>(null);
  const isLoading = ref(false);
  const errorMessage = ref("");

  const loadData = async () => {
    isLoading.value = true;
    errorMessage.value = "";

    try {
      data.value = await getProductionCapacity();
    } catch {
      errorMessage.value = "Erro ao carregar dados de produção.";
    } finally {
      isLoading.value = false;
    }
  };

  const topProduct = computed(() => {
    if (!data.value?.products?.length) {
      return null;
    }

    return data.value.products.reduce((best, current) =>
      current.maxProductionCapacity > best.maxProductionCapacity ? current : best,
    );
  });

  onMounted(() => {
    void loadData();
  });

  return {
    data,
    isLoading,
    errorMessage,
    topProduct,
    reload: loadData,
  };
};