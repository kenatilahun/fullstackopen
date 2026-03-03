const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  await new User({
    username: 'root',
    name: 'Superuser',
    passwordHash,
  }).save()
})

describe('login', () => {
  test('succeeds with valid credentials', async () => {
    const credentials = {
      username: 'root',
      password: 'sekret',
    }

    const result = await api
      .post('/api/login')
      .send(credentials)
      .expect(200)

    expect(result.body.token).toBeDefined()
    expect(typeof result.body.token).toBe('string')
  })

  test('fails with status 401 with invalid credentials', async () => {
    const credentials = {
      username: 'root',
      password: 'wrong',
    }

    const result = await api
      .post('/api/login')
      .send(credentials)
      .expect(401)

    expect(result.body.error).toContain('invalid username or password')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})

