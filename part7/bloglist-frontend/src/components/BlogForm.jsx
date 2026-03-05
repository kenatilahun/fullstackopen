import { useState } from 'react'

const BlogForm = ({ onCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    onCreate({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog} className="card">
      <h3>create new</h3>
      <div>
        title
        <input value={title} onChange={({ target }) => setTitle(target.value)} />
      </div>
      <div>
        author
        <input value={author} onChange={({ target }) => setAuthor(target.value)} />
      </div>
      <div>
        url
        <input value={url} onChange={({ target }) => setUrl(target.value)} />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm
