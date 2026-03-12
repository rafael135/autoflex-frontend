<template>
    <CrudModal :open="open" :title="editing ? 'Editar Produto' : 'Novo Produto'" :saving="saving" :width="'42rem'"
        @cancel="$emit('cancel')" @save="$emit('save')" @update:open="$emit('update:open', $event)">
        <div class="form-grid">
            <div class="field">
                <label for="product-name">Nome do Produto</label>
                <InputText id="product-name" v-model.trim="localForm.name" data-testid="name-input"
                    placeholder="Ex: Quadro Elétrico Industrial" fluid />
            </div>

            <div class="field">
                <label for="product-value">Valor Unitário (R$)</label>
                <input id="product-value" v-model.number="localForm.value" data-testid="value-input" type="number"
                    min="0" step="0.01" class="p-inputtext p-component" />
            </div>
        </div>

        <Divider align="left">Insumos por unidade produzida</Divider>

        <div class="materials-wrap">
            <div v-for="(material, index) in localForm.materials" :key="index" class="material-row">
                <Dropdown v-model="material.rawMaterialId" :data-testid="`material-select-${index}`"
                    :options="rawMaterialOptions" optionLabel="label" optionValue="value"
                    placeholder="Selecione o insumo" filter class="material-select" @filter="onFilter" />

                <InputNumber v-model="material.quantity" :data-testid="`quantity-input-${index}`" :min="1" :step="1"
                    mode="decimal" :minFractionDigits="0" :maxFractionDigits="0" class="material-qty"
                    inputClass="w-full" />

                <Button :data-testid="`remove-material-button-${index}`" icon="pi pi-trash" severity="danger" text
                    @click="removeRow(index)" />
            </div>

            <div class="materials-actions">
                <Button data-testid="add-material-button" label="Adicionar Insumo" icon="pi pi-plus" outlined
                    @click="$emit('add-material')" />
                <Button data-testid="load-more-materials-button" v-if="hasMoreRawMaterials"
                    label="Carregar mais insumos" icon="pi pi-angle-down" text :loading="isLoadingRawMaterials"
                    @click="$emit('load-more-raw-materials')" />
            </div>
        </div>
    </CrudModal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Divider from "primevue/divider";
import { CrudModal } from "../../../../../components/_ui";

type ProductFormData = {
    name: string;
    value: number | null;
    materials: Array<{
        rawMaterialId: number | null;
        quantity: number | null;
    }>;
};

type RawMaterialOption = {
    value: number;
    label: string;
};

const props = defineProps<{
    open: boolean;
    editing: boolean;
    saving: boolean;
    formData: ProductFormData;
    rawMaterialOptions: RawMaterialOption[];
    hasMoreRawMaterials: boolean;
    isLoadingRawMaterials: boolean;
}>();

const emit = defineEmits<{
    cancel: [];
    save: [];
    "update:open": [value: boolean];
    "add-material": [];
    "remove-material": [index: number];
    "search-raw-materials": [search: string];
    "load-more-raw-materials": [];
}>();

const localForm = computed(() => props.formData);

const removeRow = (index: number) => {
    emit("remove-material", index);
};

const onFilter = (event: { value: string }) => {
    emit("search-raw-materials", event.value ?? "");
};
</script>

<style scoped>
.form-grid {
    display: grid;
    gap: 12px;
    margin-bottom: 6px;
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

.materials-wrap {
    display: grid;
    gap: 8px;
    min-width: 0;
}

.material-row {
    display: flex;
    gap: 8px;
    align-items: center;
    min-width: 0;
}

.material-row>* {
    min-width: 0;
}

.material-select {
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
}

.material-qty {
    flex: 0 0 120px;
    width: 120px;
    min-width: 100px;
}

.material-row :deep(.p-dropdown),
.material-row :deep(.p-inputnumber),
.material-row :deep(.p-inputnumber-input) {
    width: 100%;
}

.materials-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

@media (max-width: 720px) {
    .material-row {
        flex-wrap: wrap;
    }

    .material-qty {
        flex: 1 1 140px;
        width: 100%;
    }
}
</style>