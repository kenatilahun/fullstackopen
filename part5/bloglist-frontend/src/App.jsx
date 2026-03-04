import { useEffect, useRef, useState } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (!loggedUserJSON) {
      return null
    }

    const loggedUser = JSON.parse(loggedUserJSON)
    blogService.setToken(loggedUser.token)
    return loggedUser
  })
  const [notification, setNotification] = useState({ message: null, type: null })
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((fetchedBlogs) => {
      setBlogs(fetchedBlogs)
    })
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedUser))
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      setUsername('')
      setPassword('')
    } catch {
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(createdBlog))
      showNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
      blogFormRef.current.toggleVisibility()
    } catch {
      showNotification('failed to create blog', 'error')
    }
  }

  const handleLike = async (blog) => {
    try {
      const blogToUpdate = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: blog.user.id || blog.user,
      }

      const updatedBlog = await blogService.update(blog.id, blogToUpdate)
      const normalizedUpdatedBlog = {
        ...updatedBlog,
        user: updatedBlog.user || blog.user,
      }

      setBlogs(blogs.map((entry) => (entry.id === blog.id ? normalizedUpdatedBlog : entry)))
    } catch {
      showNotification('failed to like blog', 'error')
    }
  }

  const handleDelete = async (blog) => {
    const shouldDelete = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (!shouldDelete) {
      return
    }

    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((entry) => entry.id !== blog.id))
      showNotification(`removed ${blog.title}`)
    } catch {
      showNotification('failed to remove blog', 'error')
    }
  }

  const blogsToShow = blogs.slice().sort((a, b) => b.likes - a.likes)

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification.message} type={notification.type} />
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleSubmit={handleLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      <p>
        {user.name} logged in
        <button type="button" onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {blogsToShow.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={handleLike}
          handleDelete={handleDelete}
          currentUsername={user.username}
        />
      ))}
    </div>
  )
}

export default App
