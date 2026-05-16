import {  forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-white dark:bg-gray-800 
            text-gray-900 dark:text-gray-100 outline-none transition-all
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${error
              ? 'border-red-400 focus:ring-red-400'
              : 'border-gray-300 dark:border-gray-600'
            }`}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input