import { defineConfig } from "@playwright/test";

export default defineConfig({
  fullyParallel: true,
  reporter: "list",
  testDir: "./tests",
  timeout: 45_000,
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm.cmd run dev -- --hostname 127.0.0.1 --port 3100",
    reuseExistingServer: false,
    timeout: 120_000,
    url: "http://127.0.0.1:3100",
  },
});
