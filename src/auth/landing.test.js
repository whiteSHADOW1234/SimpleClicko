import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Landing from './landing';

describe('Landing Component', () => {
  test('renders login page by default', () => {
    render(<Landing />);

    expect(screen.getByText('Clicko')).toBeInTheDocument();
    expect(screen.getByText('~ A simple rating system ~')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Signup')).not.toBeInTheDocument();
  });

});
