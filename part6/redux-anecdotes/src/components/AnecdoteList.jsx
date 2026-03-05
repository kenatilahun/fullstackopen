import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector((state) => {
    const filter = state.filter
    const visibleAnecdotes = filter
      ? state.anecdotes.filter((anecdote) =>
          anecdote.content.toLowerCase().includes(filter.toLowerCase())
        )
      : state.anecdotes

    return visibleAnecdotes.slice().sort((a, b) => b.votes - a.votes)
  })

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    dispatch(setNotificationWithTimeout(`you voted '${anecdote.content}'`, 5))
  }

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
