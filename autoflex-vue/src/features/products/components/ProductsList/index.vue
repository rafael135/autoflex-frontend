<template>
  <div class="list-view">
    <ErrorAlert :visible="!!loadErrorMessage" :message="loadErrorMessage" />
    <ErrorAlert
      :visible="createError"
      message="Erro ao cadastrar produto. Verifique os dados e tente novamente."
    />
    <ErrorAlert
      :visible="updateError"
      message="Erro ao atualizar produto. Verifique os dados e tente novamente."
    />

    <EntityListHeader
      title="Produtos"
      :subtitle="`${totalItems} ${totalItems === 1 ? 'produto cadastrado' : 'produtos cadastrados'}`"
      button-label="Novo Produto"
      add-button-test-id="add-product-button"
      @add="openCreateModal"
    />

    <Card>
      <template #content>
        <DataTable
          data-testid="products-table"
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

    <ProductModal
      :open="isModalOpen"
      :editing="!!editingProduct"
      :saving="isSaving"
      :formData="formData"
      :rawMaterialOptions="rawMaterialOptions"
      :hasMoreRawMaterials="hasMoreRawMaterials"
      :isLoadingRawMaterials="isLoadingRawMaterials"
      @cancel="closeModal"
      @save="saveProduct"
      @update:open="setModalOpen"
      @add-material="addMaterialRow"
      @remove-material="removeMaterialRow"
      @search-raw-materials="onSearchRawMaterials"
      @load-more-raw-materials="onLoadMoreRawMaterials"
    />
  </div>
</template>

<script setup lang="ts">
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import { EntityListHeader, ErrorAlert } from "../../../../components/_ui";
import { useProducts } from "../../composables/useProducts";
import { formatCurrency } from "../../../../app/utils/formatters";
import ProductModal from "./components/ProductModal.vue";

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
} = useProducts();

const handlePage = (event: { page: number; rows: number }) => {
  onPageChange(event.page + 1, event.rows);
};

const confirmDelete = (id: number) => {
  const shouldDelete = window.confirm("Tem certeza que deseja excluir este produto?");
  if (shouldDelete) {
    void removeProduct(id);
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