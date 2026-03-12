<template>
  <Dialog
    :visible="open"
    :header="title"
    modal
    :style="{ width }"
    :contentStyle="{ overflowY: 'visible' }"
    data-testid="crud-modal"
    @update:visible="handleVisibleChange"
  >
    <slot />

    <template #footer>
      <Button data-testid="modal-cancel-button" label="Cancelar" text @click="$emit('cancel')" />
      <Button data-testid="modal-ok-button" :label="saveLabel" :loading="saving" @click="$emit('save')" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "primevue/dialog";
import Button from "primevue/button";

withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    saveLabel?: string;
    saving?: boolean;
    width?: string;
  }>(),
  {
    saveLabel: "Salvar",
    saving: false,
    width: "40rem",
  },
);

const emit = defineEmits<{
  cancel: [];
  save: [];
  "update:open": [value: boolean];
}>();

const handleVisibleChange = (value: boolean) => {
  emit("update:open", value);
  if (!value) {
    emit("cancel");
  }
};
</script>