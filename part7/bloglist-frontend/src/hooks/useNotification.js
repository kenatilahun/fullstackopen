import { useNotificationContext } from '../contexts/NotificationContext'

export const useNotification = () => {
  const { notification, notificationDispatch } = useNotificationContext()

  const showNotification = (message, type = 'success', duration = 5000) => {
    notificationDispatch({
      type: 'SHOW',
      payload: { message, type },
    })

    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR' })
    }, duration)
  }

  return { notification, showNotification }
}
