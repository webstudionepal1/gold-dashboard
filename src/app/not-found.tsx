import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center px-4">
      <div className="max-w-lg w-full space-y-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Oops! Page not found
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
