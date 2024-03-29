import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Signup from './signup';

describe('Signup Component', () => {
  test('renders signup form with email, username, password, and password confirm inputs', () => {
    const onSwitchPageMock = jest.fn();
    const onLoginMock = jest.fn();
    render(<Signup onSwitchPage={onSwitchPageMock} onLogin={onLoginMock} />);

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('UserName')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log in now' })).toBeInTheDocument();
  });

  test('editable signup form with valid email, username, password, and password confirm', async () => {
    render(<Signup />);

    const email = 'test@example.com';
    const username = 'testuser';
    const password = 'password123';

    fireEvent.change(screen.getByTestId('user_email_signup'), { target: { value: email } });
    fireEvent.change(screen.getByTestId('user_name'), { target: { value: username } });
    fireEvent.change(screen.getByTestId('Password'), { target: { value: password } });
    fireEvent.change(screen.getByTestId('Confirm-Password'), { target: { value: password } });

    expect(screen.getByTestId('user_email_signup')).toHaveValue(email);
    expect(screen.getByTestId('user_name')).toHaveValue(username);
    expect(screen.getByTestId('Password')).toHaveValue(password);
    expect(screen.getByTestId('Confirm-Password')).toHaveValue(password);

    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

  });

});
