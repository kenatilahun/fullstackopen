import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => (
  <div className="card">
    <h2>blogs</h2>
    {blogs.map((blog) => (
      <div key={blog.id} className="row">
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
      </div>
    ))}
  </div>
)

export default BlogList
