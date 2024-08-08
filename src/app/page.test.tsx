import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from './page';
import { UserProvider } from './useUserContext';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

test('renders homepage', async () => {
  render(
    <UserProvider>
      <HomePage />
    </UserProvider>
  );

});
