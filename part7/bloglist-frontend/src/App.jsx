import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Navigate, Route, Routes, useMatch } from 'react-router-dom'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import LoginForm from './components/LoginForm'
import Navigation from './components/Navigation'
import Notification from './components/Notification'
import UsersView from './components/UsersView'
import UserView from './components/UserView'
import { useNotification } from './hooks/useNotification'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import { useUserContext } from './contexts/UserContext'
import './App.css'

const App = () => {
  const { user, userDispatch } = useUserContext()
  const { notification, showNotification } = useNotification()
  const queryClient = useQueryClient()
  const userMatch = useMatch('/users/:id')
  const blogMatch = useMatch('/blogs/:id')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      blogService.setToken(loggedUser.token)
      userDispatch({ type: 'SET', payload: loggedUser })
    }
  }, [userDispatch])

  const blogsQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    enabled: !!user,
  })

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (createdBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      showNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
    },
    onError: () => showNotification('failed to create blog', 'error'),
  })

  const likeBlogMutation = useMutation({
    mutationFn: ({ id, payload }) => blogService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: () => showNotification('failed to like blog', 'error'),
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      showNotification('blog removed')
    },
    onError: () => showNotification('failed to remove blog', 'error'),
  })

  const commentMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.addComment(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: () => showNotification('failed to add comment', 'error'),
  })

  const handleLogin = async ({ username, password }) => {
    try {
      const loggedUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedUser))
      blogService.setToken(loggedUser.token)
      userDispatch({ type: 'SET', payload: loggedUser })
      showNotification(`welcome ${loggedUser.name}`)
    } catch {
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    userDispatch({ type: 'CLEAR' })
  }

  const handleCreate = (blogObject) => {
    createBlogMutation.mutate(blogObject)
  }

  const handleLike = (blog) => {
    likeBlogMutation.mutate({
      id: blog.id,
      payload: {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: blog.user?.id || blog.user,
      },
    })
  }

  const handleDelete = (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      return
    }
    deleteBlogMutation.mutate(blog.id)
  }

  const handleAddComment = (blogId, comment) => {
    if (!comment.trim()) {
      return
    }
    commentMutation.mutate({ id: blogId, comment })
  }

  if (!user) {
    return (
      <div className="container">
        <Notification message={notification.message} type={notification.type} />
        <LoginForm onLogin={handleLogin} />
      </div>
    )
  }

  if (blogsQuery.isLoading) {
    return <div className="container">loading blogs...</div>
  }

  const blogs = blogsQuery.data?.slice().sort((a, b) => b.likes - a.likes) || []
  const users = usersQuery.data || []

  const matchedUser = userMatch
    ? users.find((entry) => entry.id === userMatch.params.id)
    : null
  const matchedBlog = blogMatch
    ? blogs.find((entry) => entry.id === blogMatch.params.id)
    : null

  return (
    <div className="container">
      <Navigation user={user} onLogout={handleLogout} />
      <Notification message={notification.message} type={notification.type} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <BlogForm onCreate={handleCreate} />
              <BlogList blogs={blogs} />
            </>
          }
        />
        <Route path="/users" element={<UsersView users={users} />} />
        <Route path="/users/:id" element={<UserView user={matchedUser} />} />
        <Route
          path="/blogs/:id"
          element={
            <BlogView
              blog={matchedBlog}
              currentUser={user}
              onLike={handleLike}
              onDelete={handleDelete}
              onAddComment={handleAddComment}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
