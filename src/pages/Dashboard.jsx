import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function DashboardPage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [sendingLink, setSendingLink] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile(user);
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.put("/profile", formData);
      setUser(res.data.user);
      setProfile(res.data.user);
      toast.success("Profile updated successfully");
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetLink = async () => {
    if (!user?.email) {
      toast.warn("No email found for this user");
      return;
    }
    setSendingLink(true);
    try {
      const res = await axiosInstance.post("/auth/forgot-password", {
        email: user.email,
      });
      toast.success(res.data.message || "Password reset link sent");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setSendingLink(false);
    }
  };

  if (!profile)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-green-400 text-xl">
        Loading profile...
      </div>
    );

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200 py-8">
      <div className="bg-gray-800 rounded-2xl shadow-lg p-8 w-80 text-center">
        <h2 className="text-3xl font-bold text-green-400 mb-6">Dashboard</h2>

        <div className="flex flex-col items-center mb-6">
          <h3 className="text-2xl font-semibold text-white">{profile.name}</h3>
          <p className="text-gray-400">{profile.email}</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="w-full py-2 mb-4 bg-green-500 hover:bg-green-600 rounded-lg text-white font-semibold transition"
        >
          Update Profile
        </button>

        <div className="border-t border-gray-600 pt-4">
          <h3 className="text-xl font-semibold mb-3 text-green-400">
            Update Password
          </h3>
          <p className="text-gray-400 mb-4 text-sm">
            Click below to receive a password reset link in your email.
          </p>
          <button
            onClick={handleSendResetLink}
            disabled={sendingLink}
            className="w-full py-2 bg-transparent border border-green-500 text-green-400 hover:bg-green-600 hover:text-white rounded-lg font-semibold transition"
          >
            {sendingLink ? "Sending..." : "Send Reset Link"}
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-80">
            <h3 className="text-2xl font-bold text-green-400 mb-4 text-center">
              Update Profile
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg bg-gray-700 text-white border border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg bg-gray-700 text-white border border-green-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
