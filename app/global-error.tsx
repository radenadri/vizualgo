'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error boundary caught:', error)
  }, [error])

  return (
    <html>
      <body className="bg-white text-neutral-900">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 font-mono">
          <div className="max-w-md text-center">
            <h1 className="mb-4 text-4xl font-bold">Critical Error</h1>
            <p className="mb-6 text-sm text-neutral-500">
              A critical error occurred. Please refresh the page or contact support
              if the problem persists.
            </p>

            {process.env.NODE_ENV === 'development' && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-xs text-neutral-400 hover:text-neutral-600">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 overflow-auto rounded border border-neutral-200 bg-neutral-50 p-4 text-xs">
                  {error.message}
                  {error.digest && `\nDigest: ${error.digest}`}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </details>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={reset}
                type="button"
                className="px-6 py-2 border border-neutral-300 hover:bg-neutral-100 transition-colors text-sm"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  window.location.href = '/'
                }}
                type="button"
                className="px-6 py-2 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-sm"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
