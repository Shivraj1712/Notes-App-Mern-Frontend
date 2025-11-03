import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-green-400 text-lg">
        Loading...
      </div>
    );

  const title = user ? `Welcome, ${user.name}` : "Welcome to NoteVault";
  const subtitle = user
    ? "Manage your notes easily."
    : "Capture, organize, and secure your notes.";

  return (
    <section className="h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-gray-900 via-gray-800 to-green-900 px-4">
      <h1 className="text-5xl font-bold mb-4 text-green-400">{title}</h1>
      <p className="text-lg text-gray-300 mb-8">{subtitle}</p>

      {user ? (
        <Link
          to="/notes"
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition"
        >
          View Notes
        </Link>
      ) : (
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 border border-green-400 text-green-400 hover:bg-green-600 hover:text-white font-semibold rounded-lg shadow-md transition"
          >
            Register
          </Link>
        </div>
      )}
    </section>
  );
}
