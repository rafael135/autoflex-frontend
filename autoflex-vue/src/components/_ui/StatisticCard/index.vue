<template>
  <Card :data-testid="testId">
    <template #title>{{ title }}</template>
    <template #content>
      <p class="stat-value">{{ value }}</p>
      <small v-if="description">{{ description }}</small>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from "primevue/card";

defineProps<{
  title: string;
  value: string | number;
  description?: string;
  testId?: string;
}>();
</script>

<style scoped>
.stat-value {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

small {
  color: #6b7280;
}
</style>