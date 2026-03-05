import { Link } from 'react-router-dom'

const UsersView = ({ users }) => (
  <div className="card">
    <h2>users</h2>
    <table>
      <thead>
        <tr>
          <th />
          <th>blogs created</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>
              <Link to={`/users/${user.id}`}>{user.name}</Link>
            </td>
            <td>{user.blogs.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default UsersView
