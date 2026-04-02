import { render, screen } from '@testing-library/react'
import AddPersonForm from './AddPersonForm'
import userEvent from '@testing-library/user-event'

test('<AddPersonForm/> updates parent state and calls onSubmit', async () => {
  const mockHandler = vi.fn()
  const user = userEvent.setup()

  render(<AddPersonForm createPerson={mockHandler} />)

  const inputs = screen.getAllByRole('textbox')
  const button = screen.getByText('add')

  await user.type(inputs[0], 'testing the name text input')
  await user.click(button)

  user.click(button)

  console.log(mockHandler.mock.calls)
})
