<template>
  <div class="list-view">
    <ErrorAlert :visible="!!loadErrorMessage" :message="loadErrorMessage" />
    <ErrorAlert
      :visible="createError"
      message="Erro ao cadastrar insumo. Verifique os dados e tente novamente."
    />
    <ErrorAlert
      :visible="updateError"
      message="Erro ao atualizar insumo. Verifique os dados e tente novamente."
    />

    <EntityListHeader
      title="Insumos"
      :subtitle="`${totalItems} ${totalItems === 1 ? 'insumo cadastrado' : 'insumos cadastrados'}`"
      button-label="Novo Insumo"
      add-button-test-id="add-raw-material-button"
      @add="openCreateModal"
    />

    <Card>
      <template #content>
        <DataTable
          data-testid="raw-materials-table"
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
          <Column header="Ações" style="width: 150px">
            <template #body="slotProps">
              <div class="actions">
                <Button data-testid="edit-button" icon="pi pi-pencil" text @click="openEditModal(slotProps.data)" />
                <Button
                  data-testid="delete-button"
                  icon="pi pi-trash"
                  text
                  severity="danger"
                  @click="confirmDelete(slotProps.data.id)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <RawMaterialModal
      :open="isModalOpen"
      :editing="!!editingRawMaterial"
      :saving="isSaving"
      :formData="formData"
      @cancel="closeModal"
      @save="saveRawMaterial"
      @update:open="setModalOpen"
    />
  </div>
</template>

<script setup lang="ts">
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import { EntityListHeader, ErrorAlert } from "../../../../components/_ui";
import { useRawMaterials } from "../../composables/useRawMaterials";
import RawMaterialModal from "./components/RawMaterialModal.vue";

const {
  items,
  isLoading,
  itemsPerPage,
  totalItems,
  loadErrorMessage,
  createError,
  updateError,
  onPageChange,
  isModalOpen,
  editingRawMaterial,
  isSaving,
  formData,
  openCreateModal,
  openEditModal,
  closeModal,
  saveRawMaterial,
  removeRawMaterial,
} = useRawMaterials();

const handlePage = (event: { page: number; rows: number }) => {
  onPageChange(event.page + 1, event.rows);
};

const confirmDelete = (id: number) => {
  const shouldDelete = window.confirm("Tem certeza que deseja excluir este insumo?");
  if (shouldDelete) {
    void removeRawMaterial(id);
  }
};

const setModalOpen = (value: boolean) => {
  if (!value) {
    closeModal();
  }
};
</script>

<style scoped>
.list-view {
  display: grid;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 4px;
}
</style>