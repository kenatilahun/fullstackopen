import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    replaceAnecdote(state, action) {
      const changedAnecdote = action.payload
      return state.map((anecdote) =>
        anecdote.id === changedAnecdote.id ? changedAnecdote : anecdote
      )
    },
  },
})

export const { appendAnecdote, setAnecdotes, replaceAnecdote } =
  anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (anecdote) => {
  return async (dispatch) => {
    const votedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1,
    }
    const updatedAnecdote = await anecdoteService.updateAnecdote(votedAnecdote)
    dispatch(replaceAnecdote(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer
