import {describe, expect, it} from 'vitest';
import isEmailValid from './validationEmail.utility';

describe('isEmailValid', () => {
  it.each(['user@example.com', 'first.last@sub.example.co.uk', 'user+tag@example.io'])(
    'accepts valid email %s',
    (email) => {
      expect(isEmailValid(email)).toBe(true);
    },
  );

  it.each(['', 'not-an-email', 'user@', '@example.com', 'user@@example.com', 'user example.com'])(
    'rejects invalid email %s',
    (email) => {
      expect(isEmailValid(email)).toBe(false);
    },
  );
});
