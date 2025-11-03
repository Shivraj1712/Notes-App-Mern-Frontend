import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const { token, user } = res.data;
      login(user, token);
      navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axiosInstance.post("/auth/forgot-password", {
        email: forgotEmail,
      });
      setMessage(res.data.message || "Password reset link sent to email");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-green-400 text-center">
          {showForgot ? "Forgot Password" : "Login"}
        </h2>
        {showForgot ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your registered email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:border-green-400 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <p
              onClick={() => setShowForgot(false)}
              className="text-sm text-green-400 hover:underline text-center cursor-pointer"
            >
              Back to Login
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:border-green-400 outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:border-green-400 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p
              onClick={() => setShowForgot(true)}
              className="text-sm text-green-400 hover:underline text-center cursor-pointer"
            >
              Forgot Password?
            </p>
            <p className="text-sm text-center text-gray-400">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-green-400 hover:underline cursor-pointer"
              >
                Register
              </span>
            </p>
          </form>
        )}
        {message && (
          <p className="text-center text-sm mt-4 text-green-400">{message}</p>
        )}
      </div>
    </div>
  );
}
