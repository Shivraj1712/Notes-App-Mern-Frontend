import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-gray-900 via-gray-800 to-green-900 px-4">
      <h1 className="text-6xl font-bold text-green-400 mb-4">404</h1>
      <p className="text-xl text-gray-300 mb-6">Page Not Found</p>
      <p className="text-gray-400 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition"
      >
        Go Home
      </Link>
    </section>
  );
}
