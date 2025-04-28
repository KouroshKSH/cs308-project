import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignupPage from './SignupPage';

test('renders signup form', () => {
  render(<SignupPage />);

  expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
});

test('allows user to fill and submit signup form', () => {
  render(<SignupPage />);

  fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'newuser' } });
  fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'newuser@example.com' } });
  fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
  fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: 'password123' } });

  expect(screen.getByPlaceholderText(/username/i).value).toBe('newuser');
  expect(screen.getByPlaceholderText(/email/i).value).toBe('newuser@example.com');

  fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

  // You can add assertions to check success/failure messages
});
