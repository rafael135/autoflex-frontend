<template>
  <div class="header">
    <h3>{{ title }}</h3>
    <Button :label="buttonLabel" icon="pi pi-plus" @click="$emit('add')" />
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";

defineProps<{
  title: string;
  buttonLabel?: string;
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

h3 {
  margin: 0;
}
</style>