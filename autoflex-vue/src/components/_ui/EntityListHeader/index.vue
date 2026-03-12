<template>
  <div class="header">
    <div class="text-wrap">
      <h3>{{ title }}</h3>
      <small v-if="subtitle">{{ subtitle }}</small>
    </div>
    <Button
      :label="buttonLabel"
      icon="pi pi-plus"
      :data-testid="addButtonTestId"
      @click="$emit('add')"
    />
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";

defineProps<{
  title: string;
  buttonLabel?: string;
  subtitle?: string;
  addButtonTestId?: string;
}>();

defineEmits<{
  add: [];
}>();
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 8px;
}

.text-wrap {
  display: grid;
  gap: 2px;
}

h3 {
  margin: 0;
}

small {
  color: #6b7280;
}
</style>