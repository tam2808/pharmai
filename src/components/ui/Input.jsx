import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/helpers';

/**
 * Input — Component input tái sử dụng với floating label
 *
 * @param {string} label - Label text
 * @param {string} error - Error message
 * @param {string} type - Input type
 * @param {ReactNode} icon - Icon bên trái
 * @param {string} className - Custom wrapper classes
 */
const Input = forwardRef(function Input(
  { label, error, type = 'text', icon, className, id, ...props },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);

  const inputId = id || `input-${label?.replace(/\s/g, '-').toLowerCase() || 'field'}`;
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={cn('relative w-full', className)}>
      <div
        className={cn(
          'relative flex items-center rounded-md border transition-all duration-200 bg-surface',
          'border-border focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(11,61,46,0.1)]',
          error && 'border-error focus-within:border-error focus-within:shadow-[0_0_0_3px_rgba(179,38,30,0.1)]'
        )}
      >
        {/* Icon trái */}
        {icon && (
          <span className="pl-3 text-text-secondary shrink-0">{icon}</span>
        )}

        {/* Input field */}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          className={cn(
            'w-full bg-transparent px-3 py-4 text-text-primary text-body',
            'outline-none placeholder-transparent peer',
            icon && 'pl-2',
            isPassword && 'pr-10'
          )}
          placeholder=" "
          {...props}
        />

        {/* Floating label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'absolute left-3 transition-all duration-200 pointer-events-none',
              'text-text-secondary bg-surface px-1',
              'text-xs font-semibold -top-2.5', // floating style (default when placeholder is not shown)
              'peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:top-4', // non-floating style (when placeholder is shown)
              'peer-focus:text-xs peer-focus:font-semibold peer-focus:-top-2.5 peer-focus:text-primary', // focus style
              icon && 'left-10 peer-placeholder-shown:left-10',
              error && 'text-error peer-focus:text-error'
            )}
          >
            {label}
          </label>
        )}

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-text-secondary hover:text-text-primary transition-colors"
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 text-xs text-error animate-in fade-in"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
