import {describe, expect, it} from 'vitest';
import routes, {socialLinks} from './routes';

describe('routes', () => {
  it('exposes unique path values', () => {
    const values = Object.values(routes);
    expect(new Set(values).size).toBe(values.length);
  });

  it('every route is an absolute path', () => {
    Object.values(routes).forEach((path) => {
      expect(path.startsWith('/')).toBe(true);
    });
  });
});

describe('socialLinks', () => {
  it('exposes valid https URLs', () => {
    Object.values(socialLinks).forEach((url) => {
      expect(url.startsWith('https://')).toBe(true);
    });
  });
});
