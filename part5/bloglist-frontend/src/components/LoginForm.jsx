const LoginForm = ({
  username,
  password,
  setUsername,
  setPassword,
  handleSubmit,
}) => (
  <form onSubmit={handleSubmit}>
    <div>
      <label htmlFor="username">username</label>
      <input
        id="username"
        data-testid="username"
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      <label htmlFor="password">password</label>
      <input
        id="password"
        data-testid="password"
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button type="submit">login</button>
  </form>
)

export default LoginForm
