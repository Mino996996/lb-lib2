import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  // 変更用のコメント
  const linkElement = screen.getByText('LBの図書館');
  expect(linkElement).toBeInTheDocument();
});
