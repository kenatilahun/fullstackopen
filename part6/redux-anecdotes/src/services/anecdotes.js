const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('failed to fetch anecdotes')
  }
  return response.json()
}

const createNew = async (content) => {
  const anecdote = { content, votes: 0 }
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(anecdote),
  })

  if (!response.ok) {
    throw new Error('failed to create anecdote')
  }

  return response.json()
}

const updateAnecdote = async (anecdote) => {
  const response = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(anecdote),
  })

  if (!response.ok) {
    throw new Error('failed to update anecdote')
  }

  return response.json()
}

export default { getAll, createNew, updateAnecdote }

