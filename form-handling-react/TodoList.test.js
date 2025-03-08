import { render, fireEvent } from '@testing-library/react';
import TodoList from '../TodoList';

test('renders TodoList component', () => {
  const { getByText, getByPlaceholderText } = render(<TodoList />);
  expect(getByPlaceholderText(/add todo/i)).toBeInTheDocument();
});

test('adds a new todo', () => {
  const { getByPlaceholderText, getByText } = render(<TodoList />);
  const input = getByPlaceholderText(/add todo/i);
  fireEvent.change(input, { target: { value: 'New Todo' } });
  fireEvent.click(getByText(/add todo/i));
  expect(getByText('New Todo')).toBeInTheDocument();
});
