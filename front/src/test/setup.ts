import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Очистка после каждого теста
afterEach(() => {
  cleanup();
});

// Мокаем localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as Storage;

// Мокаем window.confirm
global.window.confirm = vi.fn(() => true);

// Мокаем window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    search: '',
  },
  writable: true,
});
