import { useState } from 'react'

const BlogView = ({
  blog,
  currentUser,
  onLike,
  onDelete,
  onAddComment,
}) => {
  const [comment, setComment] = useState('')

  if (!blog) {
    return null
  }

  const canDelete = currentUser?.username === blog.user?.username

  const handleComment = (event) => {
    event.preventDefault()
    onAddComment(blog.id, comment)
    setComment('')
  }

  return (
    <div className="card">
      <h2>
        {blog.title} {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        {blog.likes} likes
        <button type="button" onClick={() => onLike(blog)}>
          like
        </button>
      </div>
      <div>added by {blog.user?.name}</div>
      {canDelete && (
        <button type="button" onClick={() => onDelete(blog)}>
          remove
        </button>
      )}

      <h3>comments</h3>
      <form onSubmit={handleComment}>
        <input
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {(blog.comments || []).map((entry, index) => (
          <li key={`${entry}-${index}`}>{entry}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogView
