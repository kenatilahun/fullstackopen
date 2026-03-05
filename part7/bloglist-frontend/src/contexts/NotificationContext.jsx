import { createContext, useContext, useMemo, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return { message: action.payload.message, type: action.payload.type }
    case 'CLEAR':
      return { message: null, type: null }
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, {
    message: null,
    type: null,
  })

  const value = useMemo(
    () => ({ notification, notificationDispatch }),
    [notification]
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationContext = () => useContext(NotificationContext)
