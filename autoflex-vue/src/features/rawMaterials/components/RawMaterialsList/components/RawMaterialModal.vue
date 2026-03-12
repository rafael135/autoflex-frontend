<template>
  <CrudModal
    :open="open"
    :title="editing ? 'Editar Insumo' : 'Novo Insumo'"
    :saving="saving"
    :width="'34rem'"
    @cancel="$emit('cancel')"
    @save="$emit('save')"
    @update:open="$emit('update:open', $event)"
  >
    <div class="form-grid">
      <div class="field">
        <label for="raw-name">Nome do Insumo</label>
        <InputText
          id="raw-name"
          v-model.trim="formData.name"
          data-testid="name-input"
          placeholder="Ex: Chapa de Aço 2mm"
          fluid
        />
      </div>

      <div class="field">
        <label for="raw-stock">Quantidade em Estoque</label>
        <input
          id="raw-stock"
          v-model.number="formData.stockQuantity"
          data-testid="stock-quantity-input"
          type="number"
          min="0"
          step="1"
          class="p-inputtext p-component"
        />
      </div>
    </div>
  </CrudModal>
</template>

<script setup lang="ts">
import InputText from "primevue/inputtext";
import { CrudModal } from "../../../../../components/_ui";

defineProps<{
  open: boolean;
  editing: boolean;
  saving: boolean;
  formData: {
    name: string;
    stockQuantity: number | null;
  };
}>();

defineEmits<{
  cancel: [];
  save: [];
  "update:open": [value: boolean];
}>();
</script>

<style scoped>
.form-grid {
  display: grid;
  gap: 12px;
}

.field {
  display: grid;
  gap: 6px;
}

input.p-inputtext {
  width: 100%;
}

label {
  font-size: 14px;
  font-weight: 500;
}
</style>