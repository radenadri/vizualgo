import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 font-mono bg-white text-neutral-900">
      <div className="max-w-md text-center">
        <h1 className="mb-2 text-6xl font-bold">404</h1>
        <p className="mb-2 text-lg">Page Not Found</p>
        <p className="mb-8 text-sm text-neutral-500">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-block px-6 py-2 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-sm"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
