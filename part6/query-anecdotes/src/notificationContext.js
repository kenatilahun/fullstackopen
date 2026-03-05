import { createContext, useContext } from 'react'

const NotificationContext = createContext()
const NotificationDispatchContext = createContext()

export const useNotificationValue = () => {
  const notification = useContext(NotificationContext)
  return notification
}

export const useNotificationDispatch = () => {
  const notificationDispatch = useContext(NotificationDispatchContext)
  return notificationDispatch
}

let timeoutId

export const setNotification = (dispatch, message, seconds) => {
  dispatch({ type: 'SET', payload: message })
  clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    dispatch({ type: 'CLEAR' })
  }, seconds * 1000)
}

export { NotificationContext, NotificationDispatchContext }

