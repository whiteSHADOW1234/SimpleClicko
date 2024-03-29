import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Login from './login';
import { auth } from '../backend/firebase';

// Mock signInWithEmailAndPassword function
jest.mock('../backend/firebase', () => ({
  auth: jest.fn(),
}));

auth.signInWithEmailAndPassword = jest.fn();

describe('Login Component', () => {
  test('renders login form with email and password inputs', () => {
    render(<Login />);

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign up now' })).toBeInTheDocument();
  });
});
