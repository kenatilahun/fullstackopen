const baseUrl = 'http://localhost:3001/anecdotes'

const getAnecdotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('anecdote service unavailable due to problems in server')
  }
  return response.json()
}

const createAnecdote = async (content) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, votes: 0 }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }

  return response.json()
}

const voteAnecdote = async (anecdote) => {
  const response = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...anecdote, votes: anecdote.votes + 1 }),
  })

  if (!response.ok) {
    throw new Error('failed to vote anecdote')
  }

  return response.json()
}

export { getAnecdotes, createAnecdote, voteAnecdote }

