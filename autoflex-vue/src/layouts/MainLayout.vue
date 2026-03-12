<template>
    <div class="layout-root">
        <aside class="sidebar desktop-only">
            <div class="logo">
                <i class="pi pi-cog" />
                <div>
                    <h3>Autoflex</h3>
                    <small>Gestão Industrial</small>
                </div>
            </div>

            <nav class="nav-list">
                <Button
                    v-for="item in navItems"
                    :key="item.key"
                    :label="item.label"
                    :icon="item.icon"
                    text
                    :class="['nav-btn', { 'nav-btn-active': activeView === item.key }]"
                    @click="navigateTo(item.key)"
                />
            </nav>
        </aside>

        <Sidebar
            v-model:visible="mobileSidebarOpen"
            position="left"
            class="mobile-sidebar"
        >
            <template #header>
                <div class="logo mobile-logo">
                    <i class="pi pi-cog" />
                    <div>
                        <h3>Autoflex</h3>
                        <small>Gestão Industrial</small>
                    </div>
                </div>
            </template>
            <nav class="nav-list">
                <Button
                    v-for="item in navItems"
                    :key="item.key"
                    :label="item.label"
                    :icon="item.icon"
                    text
                    :class="['nav-btn', { 'nav-btn-active': activeView === item.key }]"
                    @click="navigateTo(item.key, true)"
                />
            </nav>
        </Sidebar>

        <div class="content-area">
            <header class="topbar">
                <Button
                    icon="pi pi-bars"
                    text
                    class="mobile-menu-btn"
                    @click="mobileSidebarOpen = true"
                />
                <h2>{{ viewTitle }}</h2>
            </header>

            <main class="content">
                <RouterView />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import Sidebar from "primevue/sidebar";
import Button from "primevue/button";

type ActiveView = "products" | "rawMaterials" | "production";

const navItems: Array<{ key: ActiveView; label: string; icon: string }> = [
    { key: "products", label: "Produtos", icon: "pi pi-shopping-cart" },
    { key: "rawMaterials", label: "Insumos", icon: "pi pi-database" },
    { key: "production", label: "Simulador", icon: "pi pi-chart-bar" },
];

const viewTitles: Record<ActiveView, string> = {
    products: "Gestão de Produtos",
    rawMaterials: "Gestão de Insumos",
    production: "Simulador de Produção",
};

const route = useRoute();
const router = useRouter();
const mobileSidebarOpen = ref(false);

const activeView = computed<ActiveView>(() => {
    if (route.path.startsWith("/rawMaterials")) return "rawMaterials";
    if (route.path.startsWith("/production")) return "production";
    return "products";
});

const viewTitle = computed(() => viewTitles[activeView.value]);

const navigateTo = (key: ActiveView, closeMobile = false) => {
    void router.push(`/${key}`);
    if (closeMobile) {
        mobileSidebarOpen.value = false;
    }
};
</script>

<style scoped>
.layout-root {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 220px 1fr;
}

.sidebar {
    background: #1e3a5f;
    color: #ffffff;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo i {
    color: #facc15;
    font-size: 20px;
}

.logo h3 {
    margin: 0;
    font-size: 16px;
}

.logo small {
    opacity: 0.7;
}

.nav-list {
    padding: 12px;
    display: grid;
    gap: 8px;
}

.nav-btn {
    justify-content: flex-start;
}

:deep(.nav-btn.p-button) {
    width: 100%;
    justify-content: flex-start;
    color: #dbeafe;
    border-radius: 10px;
    transition: background-color 0.15s ease, color 0.15s ease;
}

:deep(.nav-btn.p-button .p-button-icon) {
    color: #93c5fd;
}

:deep(.nav-btn.p-button:enabled:hover) {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
}

:deep(.nav-btn.p-button:enabled:active) {
    background: rgba(255, 255, 255, 0.16);
    color: #ffffff;
    transform: none;
}

:deep(.nav-btn.p-button:focus-visible) {
    outline: none;
    box-shadow: 0 0 0 2px rgba(147, 197, 253, 0.5);
}

:deep(.nav-btn-active.p-button) {
    background: rgba(59, 130, 246, 0.35);
    color: #ffffff;
}

:deep(.nav-btn-active.p-button .p-button-icon) {
    color: #bfdbfe;
}

.content-area {
    display: grid;
    grid-template-rows: 56px 1fr;
    min-width: 0;
}

.topbar {
    background: #fff;
    border-bottom: 1px solid #e8edf3;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 16px;
    position: sticky;
    top: 0;
    z-index: 10;
}

.topbar h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
}

.content {
    padding: 16px;
}

.mobile-menu-btn {
    display: none;
}

@media (max-width: 768px) {
    .layout-root {
        grid-template-columns: 1fr;
    }

    .desktop-only {
        display: none;
    }

    .mobile-menu-btn {
        display: inline-flex;
    }

    .content {
        padding: 12px 8px;
    }
}
</style>
