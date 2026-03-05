import { useReducer } from 'react'
import {
  NotificationContext,
  NotificationDispatchContext,
} from './notificationContext'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return ''
    default:
      return state
  }
}

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={notification}>
      <NotificationDispatchContext.Provider value={notificationDispatch}>
        {props.children}
      </NotificationDispatchContext.Provider>
    </NotificationContext.Provider>
  )
}
