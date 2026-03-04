import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Full Stack Open',
    url: 'https://fullstackopen.com/en/',
    likes: 10,
    user: { username: 'root', name: 'Superuser' },
  }

  test('renders title and author but does not render url and likes by default', () => {
    const { container } = render(
      <Blog
        blog={blog}
        handleLike={() => {}}
        handleDelete={() => {}}
        currentUsername="root"
      />
    )

    expect(screen.getByText('Component testing is done with react-testing-library Full Stack Open')).toBeDefined()
    const togglableContent = container.querySelector('.togglableContent')
    expect(togglableContent).toHaveStyle('display: none')
  })

  test('shows url and likes when view button is clicked', async () => {
    render(
      <Blog
        blog={blog}
        handleLike={() => {}}
        handleDelete={() => {}}
        currentUsername="root"
      />
    )

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.getByText('https://fullstackopen.com/en/')).toBeInTheDocument()
    expect(screen.getByText('likes 10')).toBeInTheDocument()
  })

  test('calls event handler twice if like button is clicked twice', async () => {
    const mockHandler = vi.fn()
    render(
      <Blog
        blog={blog}
        handleLike={mockHandler}
        handleDelete={() => {}}
        currentUsername="root"
      />
    )

    const user = userEvent.setup()
    await user.click(screen.getByText('view'))
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})

