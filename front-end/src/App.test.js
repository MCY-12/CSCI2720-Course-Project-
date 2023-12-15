/*CSCI2720 Project Group 15
MUI Chung Yin (1155163035)
WONG Chun Fei (1155144394)
NIU Ka Ngai (1155174712)
LI Chi (1155172017)
AU YEUNG Ho Hin (1155189480)*/

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
