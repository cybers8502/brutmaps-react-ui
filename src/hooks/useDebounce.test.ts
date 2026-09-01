import {act, renderHook} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import useDebounce from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const {result} = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('does not update before the delay has elapsed', () => {
    const {result, rerender} = renderHook(({value}) => useDebounce(value, 300), {
      initialProps: {value: 'a'},
    });

    rerender({value: 'b'});
    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(result.current).toBe('a');
  });

  it('updates to the latest value once the delay has elapsed', () => {
    const {result, rerender} = renderHook(({value}) => useDebounce(value, 300), {
      initialProps: {value: 'a'},
    });

    rerender({value: 'b'});
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('b');
  });

  it('resets the timer when the value changes again before it fires', () => {
    const {result, rerender} = renderHook(({value}) => useDebounce(value, 300), {
      initialProps: {value: 'a'},
    });

    rerender({value: 'b'});
    act(() => {
      vi.advanceTimersByTime(200);
    });
    rerender({value: 'c'});
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('c');
  });
});
