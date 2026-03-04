import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, currentUsername }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const showWhenVisible = { display: visible ? '' : 'none' }
  const removeButtonStyle = {
    display: currentUsername === blog.user?.username ? '' : 'none',
  }

  return (
    <div className="blog">
      {blog.title} {blog.author}
      <button type="button" onClick={toggleVisibility}>
        {visible ? 'hide' : 'view'}
      </button>
      <div style={showWhenVisible} className="togglableContent">
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button type="button" onClick={() => handleLike(blog)}>like</button>
        </div>
        <div>{blog.user?.name}</div>
        <button
          type="button"
          style={removeButtonStyle}
          onClick={() => handleDelete(blog)}
        >
          remove
        </button>
      </div>
    </div>
  )
}

export default Blog

