const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'First blog',
    author: 'Tester One',
    url: 'https://example.com/1',
    likes: 1,
  },
  {
    title: 'Second blog',
    author: 'Tester Two',
    url: 'https://example.com/2',
    likes: 2,
  },
]

const initialUsers = [
  {
    username: 'root',
    name: 'Superuser',
    password: 'sekret',
  },
  {
    username: 'tester',
    name: 'Test User',
    password: 'secret',
  },
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'temp',
    url: 'https://temp.invalid',
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = {
  initialBlogs,
  initialUsers,
  nonExistingId,
  blogsInDb,
  usersInDb,
}

