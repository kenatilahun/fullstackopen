import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: "powershell -NoProfile -Command \"$env:VITE_BACKEND_URL='http://127.0.0.1:3005'; Set-Location '../bloglist-frontend'; npm.cmd run dev -- --host 127.0.0.1 --port 5173\"",
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: false,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
