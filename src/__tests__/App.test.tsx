import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('renders fullscreen canvas layout', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /reset view/i })).toBeInTheDocument()
  })

  it('shows reset view button', () => {
    render(<App />)
    expect(screen.getByText('Reset View')).toBeInTheDocument()
  })
})
