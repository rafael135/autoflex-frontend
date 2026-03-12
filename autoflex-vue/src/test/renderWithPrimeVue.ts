import { render, type RenderOptions } from "@testing-library/vue";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";

export const renderWithPrimeVue = (component: any, options?: RenderOptions<any>) =>
  render(component, {
    ...options,
    global: {
      plugins: [PrimeVue, ToastService],
      ...(options?.global ?? {}),
    },
  });