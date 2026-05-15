import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Oops! Page not found
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
};
