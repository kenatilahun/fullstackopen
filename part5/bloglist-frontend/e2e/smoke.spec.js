import { test, expect } from '@playwright/test'

test('frontend starts and shows app root', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#root')).toBeVisible()
})

