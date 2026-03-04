import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls event handler with right details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  await user.type(screen.getByTestId('title'), 'Testing forms in frontend')
  await user.type(screen.getByTestId('author'), 'Matti Luukkainen')
  await user.type(screen.getByTestId('url'), 'https://fullstackopen.com')

  await user.click(screen.getByText('create'))

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testing forms in frontend',
    author: 'Matti Luukkainen',
    url: 'https://fullstackopen.com',
  })
})

