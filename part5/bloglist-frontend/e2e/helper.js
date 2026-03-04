const backendUrl = 'http://127.0.0.1:3005'

const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlogWith = async (page, blog) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByTestId('title').fill(blog.title)
  await page.getByTestId('author').fill(blog.author)
  await page.getByTestId('url').fill(blog.url)
  await page.getByRole('button', { name: 'create' }).click()
}

const createBlogByApi = async (request, token, blog) => {
  await request.post(`${backendUrl}/api/blogs`, {
    data: blog,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

const loginByApi = async (request, username, password) => {
  const response = await request.post(`${backendUrl}/api/login`, {
    data: { username, password },
  })
  return response.json()
}

export { loginWith, createBlogWith, createBlogByApi, loginByApi }
