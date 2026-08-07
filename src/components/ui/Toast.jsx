import { Toaster } from 'sonner';

/**
 * ToastProvider — Wrapper cho sonner Toaster
 * Style lại theo design tokens, không dùng theme mặc định
 */
export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors={false}
      gap={8}
      toastOptions={{
        className: 'pharmai-toast',
        style: {
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          background: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-hover)',
          borderRadius: '10px',
          padding: '12px 16px',
        },
      }}
    />
  );
}
