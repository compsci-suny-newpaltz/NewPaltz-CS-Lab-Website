import { forwardRef } from 'react';

/**
 * FormInput Component
 *
 * A styled form input with label and error state support.
 * Uses the site's rose/orange accent colors.
 *
 * @param {Object} props
 * @param {string} props.label - Input label text
 * @param {string} props.error - Error message to display
 * @param {string} props.helperText - Helper text below input
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.required - Whether field is required
 */
const FormInput = forwardRef(({
  label,
  error,
  helperText,
  className = '',
  required = false,
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-stone-700">
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={`
          px-4 py-3 border rounded-xl shadow-sm
          transition-all duration-200 outline-none
          bg-white text-stone-800 placeholder-stone-400
          ${error
            ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400'
            : 'border-stone-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-300'
          }
          hover:border-stone-300
          disabled:bg-stone-50 disabled:cursor-not-allowed disabled:text-stone-400
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </span>
      )}
      {helperText && !error && (
        <span className="text-xs text-stone-500">{helperText}</span>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

/**
 * FormTextarea Component
 *
 * A styled textarea with the same styling as FormInput.
 */
export const FormTextarea = forwardRef(({
  label,
  error,
  helperText,
  className = '',
  required = false,
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-stone-700">
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          px-4 py-3 border rounded-xl shadow-sm
          transition-all duration-200 outline-none resize-none
          bg-white text-stone-800 placeholder-stone-400
          ${error
            ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400'
            : 'border-stone-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-300'
          }
          hover:border-stone-300
          disabled:bg-stone-50 disabled:cursor-not-allowed disabled:text-stone-400
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </span>
      )}
      {helperText && !error && (
        <span className="text-xs text-stone-500">{helperText}</span>
      )}
    </div>
  );
});

FormTextarea.displayName = 'FormTextarea';

/**
 * FormSelect Component
 *
 * A styled select dropdown with the same styling as FormInput.
 */
export const FormSelect = forwardRef(({
  label,
  error,
  helperText,
  className = '',
  required = false,
  children,
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-stone-700">
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={`
          px-4 py-3 border rounded-xl shadow-sm
          transition-all duration-200 outline-none
          bg-white text-stone-800
          ${error
            ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400'
            : 'border-stone-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-300'
          }
          hover:border-stone-300
          disabled:bg-stone-50 disabled:cursor-not-allowed disabled:text-stone-400
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      {error && (
        <span className="text-xs text-red-500 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </span>
      )}
      {helperText && !error && (
        <span className="text-xs text-stone-500">{helperText}</span>
      )}
    </div>
  );
});

FormSelect.displayName = 'FormSelect';

export default FormInput;
