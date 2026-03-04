import { test, expect } from '@playwright/test'
import { createBlogByApi, createBlogWith, loginByApi, loginWith } from './helper'

const backendUrl = 'http://127.0.0.1:3005'

test.beforeEach(async ({ page, request }) => {
  await request.post(`${backendUrl}/api/testing/reset`)
  await request.post(`${backendUrl}/api/users`, {
    data: {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen',
    },
  })

  await page.goto('/')
})

test('Login form is shown', async ({ page }) => {
  await expect(page.getByText('Log in to application')).toBeVisible()
  await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
})

test.describe('Login', () => {
  test('succeeds with correct credentials', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  test('fails with wrong credentials', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'wrong')
    await expect(page.getByText('wrong username or password')).toBeVisible()
  })
})

test.describe('When logged in', () => {
  test.beforeEach(async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
  })

  test('a new blog can be created', async ({ page }) => {
    await createBlogWith(page, {
      title: 'Playwright created blog',
      author: 'E2E Tester',
      url: 'https://playwright.dev',
    })

    await expect(page.getByText('Playwright created blog E2E Tester')).toBeVisible()
  })

  test('a blog can be liked', async ({ page }) => {
    await createBlogWith(page, {
      title: 'A blog to be liked',
      author: 'Like Tester',
      url: 'https://example.com',
    })

    const blog = page.locator('.blog').filter({ hasText: 'A blog to be liked Like Tester' })
    await blog.getByRole('button', { name: 'view' }).click()
    await blog.getByRole('button', { name: 'like' }).click()
    await expect(blog.getByText('likes 1')).toBeVisible()
  })

  test('the user who added a blog can delete it', async ({ page }) => {
    await createBlogWith(page, {
      title: 'Blog to remove',
      author: 'Delete Tester',
      url: 'https://delete.me',
    })

    page.on('dialog', (dialog) => dialog.accept())
    const blog = page.locator('.blog').filter({ hasText: 'Blog to remove Delete Tester' })
    await blog.getByRole('button', { name: 'view' }).click()
    await blog.getByRole('button', { name: 'remove' }).click()

    await expect(page.getByText('Blog to remove Delete Tester')).not.toBeVisible()
  })

  test('only the user who added the blog sees the remove button', async ({ page, request }) => {
    await createBlogWith(page, {
      title: 'Ownership Blog',
      author: 'Owner',
      url: 'https://owner.blog',
    })
    await page.getByRole('button', { name: 'logout' }).click()

    await request.post(`${backendUrl}/api/users`, {
      data: {
        name: 'Second User',
        username: 'second',
        password: 'salainen',
      },
    })
    await loginWith(page, 'second', 'salainen')

    const blog = page.locator('.blog').filter({ hasText: 'Ownership Blog Owner' })
    await blog.getByRole('button', { name: 'view' }).click()
    await expect(blog.getByRole('button', { name: 'remove' })).not.toBeVisible()
  })

  test('blogs are arranged in descending order by likes', async ({ page, request }) => {
    const firstLogin = await loginByApi(request, 'mluukkai', 'salainen')
    const token = firstLogin.token

    await createBlogByApi(request, token, {
      title: 'Least liked',
      author: 'Order',
      url: 'https://1.com',
      likes: 1,
    })
    await createBlogByApi(request, token, {
      title: 'Most liked',
      author: 'Order',
      url: 'https://2.com',
      likes: 20,
    })
    await createBlogByApi(request, token, {
      title: 'Middle liked',
      author: 'Order',
      url: 'https://3.com',
      likes: 10,
    })

    await page.reload()

    const blogs = page.locator('.blog')
    await expect(blogs.nth(0)).toContainText('Most liked')
    await expect(blogs.nth(1)).toContainText('Middle liked')
    await expect(blogs.nth(2)).toContainText('Least liked')
  })
})

