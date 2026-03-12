<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Página não encontrada.</p>
    <Button label="Voltar para produtos" icon="pi pi-arrow-left" @click="goToProducts" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Button from "primevue/button";

const router = useRouter();

const goToProducts = () => {
  void router.push("/products");
};
</script>

<style scoped>
.not-found {
  height: calc(100vh - 88px);
  display: grid;
  place-content: center;
  gap: 8px;
  justify-items: center;
  text-align: center;
}

h1,
p {
  margin: 0;
}
</style>