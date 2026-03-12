<template>
  <Message v-if="visible" severity="error" :closable="false">{{ message }}</Message>
</template>

<script setup lang="ts">
import Message from "primevue/message";

defineProps<{
  visible: boolean;
  message: string;
}>();
</script>