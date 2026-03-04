import { render, screen } from '@testing-library/react'
import App from './App'

test('renders setup heading', () => {
  render(<App />)
  expect(screen.getByText('Blog List Frontend')).toBeInTheDocument()
})
