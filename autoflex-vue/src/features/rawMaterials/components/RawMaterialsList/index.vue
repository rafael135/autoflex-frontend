<template>
  <div class="list-view">
    <EntityListHeader title="Insumos" button-label="Novo Insumo" @add="noop" />
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
          <Column field="stockQuantity" header="Estoque" />
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
import { useRawMaterials } from "../../composables/useRawMaterials";

const { items, isLoading, itemsPerPage, totalItems, errorMessage, onPageChange } = useRawMaterials();

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