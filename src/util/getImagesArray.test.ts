import {afterEach, describe, expect, it, vi} from 'vitest';
import getJsonObject from './getImagesArray';

describe('getJsonObject', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('parses a JSON string into an array', () => {
    expect(getJsonObject('["a.jpg","b.jpg"]')).toEqual(['a.jpg', 'b.jpg']);
  });

  it('returns the value unchanged when it is already an object', () => {
    const value = [{url: 'a.jpg'}];
    expect(getJsonObject(value)).toBe(value);
  });

  it('returns an empty array and logs an error for invalid JSON', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(getJsonObject('not-json')).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });
});
