import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('displays the app title', () => {
    render(<App />)
    expect(screen.getByText('Subnautica Map')).toBeInTheDocument()
  })

  it('shows canvas initialization message', () => {
    render(<App />)
    expect(screen.getByText('Canvas initialized with coordinate grid and Lifeboat 5 origin point.')).toBeInTheDocument()
  })
})
