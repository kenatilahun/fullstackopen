const dummy = (_blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce((prev, current) =>
    current.likes > prev.likes ? current : prev
  )

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authors = {}
  blogs.forEach((blog) => {
    authors[blog.author] = (authors[blog.author] || 0) + 1
  })

  const author = Object.keys(authors).reduce((prev, current) =>
    authors[current] > authors[prev] ? current : prev
  )

  return {
    author,
    blogs: authors[author],
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authors = {}
  blogs.forEach((blog) => {
    authors[blog.author] = (authors[blog.author] || 0) + blog.likes
  })

  const author = Object.keys(authors).reduce((prev, current) =>
    authors[current] > authors[prev] ? current : prev
  )

  return {
    author,
    likes: authors[author],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
