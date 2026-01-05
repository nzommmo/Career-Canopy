// Header.jsx - Dark Theme with User Info
import { useNavigate } from "react-router-dom";
import { Briefcase, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import API from "../../api";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("auth/me/");
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await API.post("auth/logout/");
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      navigate("/");
    }
  };

  const getInitials = () => {
    if (!user) return "?";
    return `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() || user.email?.[0]?.toUpperCase() || "?";
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex lg:flex-row flex-col justify-between lg:items-center items-start">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">
              Career Canopy
            </h1>
            <p className="text-xs text-gray-400">Track your applications</p>
          </div>
        </div>

        {/* User Info and Actions */}
        <div className="flex items-center gap-3 lg:mt-0 mt-6">
          {/* User Profile */}
          {user && (
            <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-800 rounded-md border border-gray-700">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-xs font-semibold text-white">{getInitials()}</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition px-3 py-1.5 rounded-md hover:bg-gray-800 border border-gray-800 hover:border-gray-700"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}