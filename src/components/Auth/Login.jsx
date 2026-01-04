import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Loader2 } from "lucide-react";
import API from "../../api";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLogin, setIsLogin] = useState(true);

  const navigate = useNavigate();

  // Email/password login or signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const endpoint = isLogin ? "auth/login/" : "auth/register/";
      const payload = isLogin ? { username: email, password } : { email, password };

      const res = await API.post(endpoint, payload);

      if (isLogin && res.data.access && res.data.refresh) {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        navigate("/dashboard");
      } else if (!isLogin) {
        alert("Signup successful! Please login.");
        setIsLogin(true);
      } else {
        alert("Login failed");
      }
    } catch (err) {
      console.error(err);
      setErrors(err.response?.data || {});
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse?.credential;
    if (!token) return alert("Google login failed: no token returned");

    setLoading(true);
    try {
      const res = await API.post("auth/google/", { token });

      if (res.status === 200 && res.data.access && res.data.refresh) {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        navigate("/dashboard");
      } else {
        alert("Google login failed: unexpected response");
      }
    } catch (err) {
      console.error(err);
      alert("Google login failed: network or verification error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Career Canopy</h2>
          <p className="text-gray-400">
            {isLogin ? "Welcome back! Sign in to your account" : "Create your account to get started"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-1.5 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            />
            {errors.email && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <span>⚠</span> {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-1.5 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            />
            {errors.password && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <span>⚠</span> {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold flex justify-center items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-800"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-900 px-3 text-gray-500 font-medium">Or continue with</span>
          </div>
        </div>

        {/* Google Login */}
        <div className="w-full ">
          <div className="w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google login failed")}
              useOneTap
              
            />
          </div>
        </div>

        {/* Toggle Login/Signup */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <span className="text-blue-400 font-semibold hover:text-blue-300">Sign up</span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span className="text-blue-400 font-semibold hover:text-blue-300">Sign in</span>
              </>
            )}
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}