import axios from 'axios'

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'
const baseUrl = `${backendUrl}/api/users`

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export default { getAll }
