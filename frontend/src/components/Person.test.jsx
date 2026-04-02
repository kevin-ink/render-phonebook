import { render, screen } from '@testing-library/react'
import Person from './Person'
import userEvent from '@testing-library/user-event'

test('renders content', () => {
  const dummyFunction = () => {}
  const person = {
    name: 'Aliyah Campson',
    number: '69-696969696996',
  }

  render(<Person person={person} handleDeletePerson={dummyFunction} />)

  const element = screen.getByText('Aliyah Campson', { exact: false })
  expect(element).toBeDefined()
})

test('clicking button calls event handler once', async () => {
  const person = {
    name: 'Aliyah Campson',
    number: '69-696969696996',
  }

  const mockHandler = vi.fn()

  render(<Person person={person} handleDeletePerson={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('remove')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})
