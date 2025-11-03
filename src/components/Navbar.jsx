import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    gsap.to(navRef.current, { y: 0, opacity: 1, duration: 0.4 });
  }, []);

  useEffect(() => {
    if (!mobileMenuRef.current) return;
    if (isOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { y: -10, opacity: 0, display: "block" },
        { y: 0, opacity: 1, duration: 0.25 }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        y: -10,
        opacity: 0,
        duration: 0.2,
        onComplete: () => gsap.set(mobileMenuRef.current, { display: "none" }),
      });
    }
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      ref={navRef}
      className="bg-gray-800 shadow-md w-full transform -translate-y-4 opacity-0"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-green-500">
            NoteVault
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 text-gray-100">
            <Link to="/" className="hover:text-green-400">Home</Link>

            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-green-400">
                  Dashboard
                </Link>
                <Link to="/notes" className="hover:text-green-400">
                  Notes
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-green-400 text-green-400 rounded-lg hover:bg-green-600 hover:text-white transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
              >
                Login / Register
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden text-green-400"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className="md:hidden bg-gray-800 border-t border-green-500 text-center"
        style={{ display: "none" }}
      >
        <div className="flex flex-col px-4 py-3 space-y-3 text-white">
          <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-green-300">
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="hover:text-green-300"
              >
                Dashboard
              </Link>
              <Link
                to="/notes"
                onClick={() => setIsOpen(false)}
                className="hover:text-green-300"
              >
                Notes
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="text-green-400 hover:text-green-300"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/register");
              }}
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
