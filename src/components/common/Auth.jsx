import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { checkAuth, loginUser, registerUser } from "../store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation with Toast
  const validate = () => {
    if (!isLogin && !formData.username.trim()) {
      toast.error("Username is required");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (isLogin) {
        await dispatch(loginUser(formData)).unwrap();
        toast.success("Login Successful!");
        router.push("/"); // Redirect to homepage after login
      } else {
        await dispatch(registerUser(formData)).unwrap();
        toast.success("Please Verify Your Email Before Logging In!");
        setIsLogin(true); // Switch to login page after account creation
      }
    } catch (error) {
      console.error("Auth Error:", error);
      const message =
        error?.message ||
        error?.error ||
        (typeof error === "string" ? error : "Something went wrong");

      toast.error(message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_APP_API_BASE_URL || "http://localhost:5000/api";
      await axios.post(
        `${apiBase}/auth/google-login`,
        {
          idToken: credentialResponse.credential,
        },
        { withCredentials: true }
      );
      await dispatch(checkAuth());
      toast.success("Login Successful!");
      router.push("/");
    } catch (error) {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center authbg px-4">
      {/* Toaster */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-lg text-white">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-200">
            Welcome Back
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
          {isLogin ? "Login to Your Account" : "Create an Account"}
          </h2>
          <p className="mt-2 text-sm text-white/70">
            {isLogin
              ? "Keep your habits consistent across devices."
              : "Start building your streak today."}
          </p>
        </div>
        {/* Google Login Button */}
        <div className="mb-4 flex w-full justify-center">
          <div className="w-full rounded-full flex items-center justify-center ">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log("Login Failed")}
              theme="outline"
              size="large"
              shape="pill"
              text="continue_with"
            />
          </div>
        </div>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-white/20"></div>
          <span className="mx-2 text-xs text-white/60">OR</span>
          <div className="flex-grow border-t border-white/20"></div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 authform">
          {!isLogin && (
            <div>
              <div className="flex items-center rounded-2xl border border-white/20 bg-white/5 px-3 py-2 focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-300/40">
                <User size={18} className="text-white/70 mr-2" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/50 outline-none focus:ring-0 autofill:bg-transparent"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center rounded-2xl border border-white/20 bg-white/5 px-3 py-2 focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-300/40">
              <Mail size={18} className="text-white/70 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full bg-transparent text-sm text-white placeholder:text-white/50 outline-none focus:ring-0 autofill:bg-transparent"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center rounded-2xl border border-white/20 bg-white/5 px-3 py-2 focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-300/40">
              <Lock size={18} className="text-white/70 mr-2" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full bg-transparent text-sm text-white placeholder:text-white/50 outline-none focus:ring-0 autofill:bg-transparent"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading && (
              <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
            )}
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-sm mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            className="text-rose-200 cursor-pointer font-semibold ml-1"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
        {isLogin && (
          <button
            className="mt-3 w-full cursor-pointer text-sm font-semibold text-white/80 transition hover:text-white"
            onClick={() => router.push("/auth/forgot-password")}
            type="button"
          >
            Forgot password?
          </button>
        )}
        {isLogin && (
          <button
            className="mt-4 w-full cursor-pointer rounded-full border border-white/30 bg-white/10 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            onClick={() => router.push("/")}
            type="button"
          >
            Continue to Home
          </button>
        )}
      </div>
    </div>
  );
}
