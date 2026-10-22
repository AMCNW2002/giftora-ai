import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce values (e.g. search query inputs)
 * Delays updating the debounced value until after the specified delay has elapsed
 * since the last time the value was changed.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
