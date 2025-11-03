import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password.trim()) return setMessage("Password cannot be empty.");

    setLoading(true);
    setMessage("");

    try {
      const res = await axiosInstance.post(`/auth/reset-password/${token}`, {
        password,
      });
      setMessage(res.data.message || "Password reset successful.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-900 via-gray-800 to-green-900 text-white px-4">
      <h1 className="text-3xl font-bold mb-6 text-green-400">
        Reset Your Password
      </h1>

      <form
        onSubmit={handleResetPassword}
        className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md"
      >
        <div className="mb-6">
          <label className="block text-left text-sm mb-1">
            Enter New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded transition"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      {message && <p className="mt-4 text-gray-300">{message}</p>}
    </section>
  );
}
