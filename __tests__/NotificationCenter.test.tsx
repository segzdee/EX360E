import React from 'react'
import { render, screen } from '@testing-library/react'
import { NotificationCenter } from '@/components/notifications'

jest.mock('socket.io-client', () => {
  const emit = jest.fn()
  const on = jest.fn()
  const socket = { emit, on }
  return jest.fn(() => socket)
})

describe('NotificationCenter', () => {
  it('renders without crashing', () => {
    render(<NotificationCenter />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('displays "No new notifications" when there are no notifications', () => {
    render(<NotificationCenter />)
    const button = screen.getByRole('button')
    button.click()
    expect(screen.getByText('No new notifications')).toBeInTheDocument()
  })
})

