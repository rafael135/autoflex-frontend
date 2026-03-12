<template>
  <div class="list-view">
    <EntityListHeader title="Produtos" button-label="Novo Produto" @add="noop" />
    <ErrorAlert :visible="!!errorMessage" :message="errorMessage" />

    <Card>
      <template #content>
        <DataTable
          :value="items"
          :loading="isLoading"
          paginator
          :rows="itemsPerPage"
          :totalRecords="totalItems"
          lazy
          responsiveLayout="scroll"
          @page="handlePage"
        >
          <Column field="id" header="ID" />
          <Column field="name" header="Nome" />
          <Column header="Valor Unitário">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.value) }}
            </template>
          </Column>
          <Column header="Qtd. Insumos">
            <template #body="slotProps">
              {{ slotProps.data.materials?.length ?? 0 }}
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { EntityListHeader, ErrorAlert } from "../../../../components/_ui";
import { useProducts } from "../../composables/useProducts";
import { formatCurrency } from "../../../../app/utils/formatters";

const { items, isLoading, itemsPerPage, totalItems, errorMessage, onPageChange } = useProducts();

const handlePage = (event: { page: number; rows: number }) => {
  onPageChange(event.page + 1, event.rows);
};

const noop = () => {};
</script>

<style scoped>
.list-view {
  display: grid;
  gap: 12px;
}
</style>