import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Board from '../board'

describe('Board', () => {
  it('renders the board with dummy data', () => {
    render(<Board />)
    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText('Task 1')).toBeInTheDocument()
  })

  it('allows adding a new card', () => {
    render(<Board />)
    const addButton = screen.getAllByText('Add Card')[0]
    fireEvent.click(addButton)
    const titleInput = screen.getByPlaceholderText('Card title')
    const detailsInput = screen.getByPlaceholderText('Card details')
    const addBtn = screen.getByText('Add')
    fireEvent.change(titleInput, { target: { value: 'New Task' } })
    fireEvent.change(detailsInput, { target: { value: 'New details' } })
    fireEvent.click(addBtn)
    expect(screen.getByText('New Task')).toBeInTheDocument()
  })

  it('allows deleting a card', () => {
    render(<Board />)
    const deleteButton = screen.getAllByText('×')[0]
    fireEvent.click(deleteButton)
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument()
  })

  it('allows renaming a column', () => {
    render(<Board />)
    const columnTitle = screen.getByText('To Do')
    fireEvent.click(columnTitle)
    const input = screen.getByDisplayValue('To Do')
    fireEvent.change(input, { target: { value: 'New Name' } })
    fireEvent.blur(input)
    expect(screen.getByText('New Name')).toBeInTheDocument()
  })
})