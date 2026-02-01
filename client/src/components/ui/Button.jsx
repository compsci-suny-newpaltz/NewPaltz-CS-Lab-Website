import { forwardRef } from 'react';

/**
 * Button Component
 *
 * A styled button with multiple variants and sizes.
 * Uses the site's rose/orange accent colors.
 *
 * @param {Object} props
 * @param {string} props.variant - Button style variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 * @param {string} props.size - Button size: 'sm' | 'md' | 'lg'
 * @param {boolean} props.loading - Show loading spinner
 * @param {boolean} props.fullWidth - Take full width of container
 * @param {React.ReactNode} props.leftIcon - Icon to show on left
 * @param {React.ReactNode} props.rightIcon - Icon to show on right
 */
const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}, ref) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-xl
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-rose-400 to-orange-400
      text-white shadow-md
      hover:from-rose-500 hover:to-orange-500 hover:shadow-lg
      focus:ring-rose-300
      active:scale-[0.98]
    `,
    secondary: `
      bg-gradient-to-r from-rose-100 to-orange-100
      text-rose-700 shadow-sm
      hover:from-rose-200 hover:to-orange-200 hover:shadow
      focus:ring-rose-200
      active:scale-[0.98]
    `,
    outline: `
      border-2 border-rose-300 bg-transparent
      text-rose-600
      hover:bg-rose-50 hover:border-rose-400
      focus:ring-rose-200
      active:scale-[0.98]
    `,
    ghost: `
      bg-transparent text-stone-600
      hover:bg-stone-100 hover:text-stone-900
      focus:ring-stone-200
      active:scale-[0.98]
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600
      text-white shadow-md
      hover:from-red-600 hover:to-red-700 hover:shadow-lg
      focus:ring-red-300
      active:scale-[0.98]
    `
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
