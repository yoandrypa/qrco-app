import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    supportFile: false,
    experimentalStudio:true,
    viewportWidth: 1024,
    viewportHeight: 900
  },
});
