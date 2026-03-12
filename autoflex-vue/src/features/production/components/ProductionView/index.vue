<template>
  <div class="production-view">
    <ErrorAlert :visible="!!errorMessage" :message="errorMessage" />

    <div class="stats-grid">
      <StatisticCard
        test-id="statistic-total-value"
        title="Valor Total de Produção"
        :value="totalProductionValue"
      />
      <StatisticCard
        test-id="statistic-products-count"
        title="Produtos Simulados"
        :value="productsCount"
      />
      <StatisticCard
        test-id="statistic-max-capacity"
        title="Maior Capacidade"
        :value="topCapacityLabel"
      />
    </div>

    <Card>
      <template #title>Capacidade de Produção por Produto</template>
      <template #content>
        <div v-if="isLoading" class="loading-wrap">
          <ProgressSpinner style="width: 42px; height: 42px" strokeWidth="8" />
        </div>
        <DataTable
          v-else
          data-testid="production-table"
          :value="tableRows"
          paginator
          :rows="10"
          emptyMessage="Nenhum produto pode ser produzido com o estoque atual."
          responsiveLayout="scroll"
        >
          <Column field="rank" header="#" />
          <Column field="name" header="Produto" />
          <Column field="maxProductionCapacity" header="Capacidade Máxima" />
          <Column field="totalValue" header="Valor Total" />
        </DataTable>
        <p v-if="!isLoading && tableRows.length === 0" data-testid="production-empty" class="empty-text">
          Nenhum produto pode ser produzido com o estoque atual.
        </p>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ProgressSpinner from "primevue/progressspinner";
import { formatCurrency } from "../../../../app/utils/formatters";
import { ErrorAlert, StatisticCard } from "../../../../components/_ui";
import { useProduction } from "../../composables/useProduction";

const { data, isLoading, errorMessage, topProduct } = useProduction();

const totalProductionValue = computed(() => formatCurrency(data.value?.totalProductionValue ?? 0));

const productsCount = computed(() => data.value?.products.length ?? 0);

const topCapacityLabel = computed(() => {
  if (!topProduct.value) {
    return "-";
  }

  return `${topProduct.value.name} (${topProduct.value.maxProductionCapacity.toLocaleString("pt-BR")})`;
});

const tableRows = computed(() =>
  (data.value?.products ?? []).map((product, index) => ({
    rank: index + 1,
    name: product.name,
    maxProductionCapacity: product.maxProductionCapacity.toLocaleString("pt-BR"),
    totalValue: formatCurrency(product.totalValue),
  })),
);
</script>

<style scoped>
.production-view {
  display: grid;
  gap: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.loading-wrap {
  min-height: 120px;
  display: grid;
  place-content: center;
}

.empty-text {
  margin: 8px 0 0;
  color: #6b7280;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>