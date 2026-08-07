import { useState, useEffect } from 'react';

/**
 * useDebounce — debounce một giá trị sau delay ms
 * Dùng cho search input: chỉ gọi API sau khi user ngừng gõ 400ms
 *
 * @param {any} value - Giá trị cần debounce
 * @param {number} delay - Thời gian debounce (ms), mặc định 400ms
 * @returns {any} Giá trị đã debounce
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
