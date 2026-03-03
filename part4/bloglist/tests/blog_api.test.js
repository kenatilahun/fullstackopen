const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'Superuser', passwordHash })
  const savedUser = await user.save()

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
  token = loginResponse.body.token

  const blogObjects = helper.initialBlogs.map(
    (blog) =>
      new Blog({
        ...blog,
        user: savedUser._id,
      })
  )

  const savedBlogs = await Blog.insertMany(blogObjects)
  await User.findByIdAndUpdate(savedUser._id, {
    blogs: savedBlogs.map((blog) => blog._id),
  })
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('addition of a new blog', () => {
  test('succeeds with valid data and token', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Full Stack Open',
      url: 'https://fullstackopen.com/en/',
      likes: 20,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    expect(titles).toContain('async/await simplifies making async calls')
  })

  test('fails with status 401 if token is not provided', async () => {
    const newBlog = {
      title: 'blog without token',
      author: 'No Auth',
      url: 'https://example.com/no-token',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('likes defaults to 0 if missing', async () => {
    const newBlog = {
      title: 'blog without likes',
      author: 'Defaults',
      url: 'https://example.com/default-likes',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    expect(response.body.likes).toBe(0)
  })

  test('fails with status 400 if title is missing', async () => {
    const newBlog = {
      author: 'No title',
      url: 'https://example.com/no-title',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('fails with status 400 if url is missing', async () => {
    const newBlog = {
      title: 'No URL',
      author: 'No URL',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status 204 when done by creator', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
  })

  test('fails with status 403 when blog creator is another user', async () => {
    const passwordHash = await bcrypt.hash('secret', 10)
    await new User({
      username: 'other',
      name: 'Other User',
      passwordHash,
    }).save()

    const otherLogin = await api
      .post('/api/login')
      .send({ username: 'other', password: 'secret' })
    const otherToken = otherLogin.body.token

    const blogsAtStart = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${blogsAtStart[0].id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403)
  })
})

describe('updating a blog', () => {
  test('succeeds when updating likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedData = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 10,
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)

    expect(response.body.likes).toBe(updatedData.likes)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
