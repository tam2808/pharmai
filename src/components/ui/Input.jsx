import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/helpers';

/**
 * Input — Component input tái sử dụng, placeholder style (Long Châu style)
 *
 * @param {string} label - Placeholder text
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
          'relative flex items-center rounded-xl border transition-all duration-200 bg-surface',
          'border-border hover:border-text-muted focus-within:border-primary focus-within:shadow-[0_0_0_4px_rgba(14,165,233,0.12)]',
          error && 'border-error focus-within:border-error focus-within:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]'
        )}
      >
        {/* Icon trái */}
        {icon && (
          <span className="pl-4 text-text-muted shrink-0">
            {typeof icon === 'function' ? (() => { const IconComp = icon; return <IconComp size={20} />; })() : icon}
          </span>
        )}

        {/* Input field */}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          placeholder={label || ''}
          className={cn(
            'w-full bg-transparent px-4 py-3.5 text-text-primary text-sm sm:text-base font-medium',
            'outline-none placeholder:text-text-muted/70',
            icon && 'pl-3',
            isPassword && 'pr-12'
          )}
          {...props}
        />

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 text-xs text-error"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
