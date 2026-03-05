import { Link } from 'react-router-dom'

const Navigation = ({ user, onLogout }) => (
  <nav className="navigation">
    <Link to="/">blogs</Link>
    <Link to="/users">users</Link>
    <span>{user.name} logged in</span>
    <button type="button" onClick={onLogout}>
      logout
    </button>
  </nav>
)

export default Navigation
