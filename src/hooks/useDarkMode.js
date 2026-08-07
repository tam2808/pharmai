import { useState, useEffect, useCallback } from 'react';

/**
 * useDarkMode — Quản lý dark mode toggle
 * - Persist preference trong localStorage
 * - Đồng bộ class "dark" trên <html>
 * - Tự detect system preference nếu chưa có preference lưu trữ
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    // Ưu tiên lấy từ localStorage
    const stored = localStorage.getItem('pharmai-theme');
    if (stored) return stored === 'dark';

    // Fallback: system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('pharmai-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  return { isDark, toggle };
}

export default useDarkMode;
