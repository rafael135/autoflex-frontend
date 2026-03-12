<template>
  <Dialog
    :visible="open"
    :header="title"
    modal
    :style="{ width }"
    @update:visible="handleVisibleChange"
  >
    <slot />

    <template #footer>
      <Button label="Cancelar" text @click="$emit('cancel')" />
      <Button :label="saveLabel" :loading="saving" @click="$emit('save')" />
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