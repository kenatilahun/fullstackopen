const Notification = ({ message, type }) => {
  if (!message) {
    return null
  }

  return (
    <div className={type === 'error' ? 'error' : 'success'}>
      {message}
    </div>
  )
}

export default Notification

