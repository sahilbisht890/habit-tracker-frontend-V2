import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import axiosInstance from "@/components/axios/axiosInstance";
import endpoints from "@/components/axios/apiRoutes";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [step, setStep] = useState("request");
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post(endpoints.forgotPassword, {
        email: formData.email,
      });
      toast.success("OTP sent to your email");
      setStep("reset");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to send OTP";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.otp || !formData.newPassword) {
      toast.error("All fields are required");
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post(endpoints.resetPassword, {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });
      toast.success("Password reset successfully");
      router.push("/auth");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Reset failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-rose-50 via-white to-orange-50 px-6 py-16 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-md rounded-3xl border border-white/40 bg-white/80 p-8 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
          Forgot Password
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
          {step === "request" ? "Request OTP" : "Reset your password"}
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {step === "request"
            ? "Enter your email to receive a reset OTP."
            : "Enter the OTP and your new password."}
        </p>

        {step === "request" ? (
          <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-rose-500 dark:focus:ring-rose-500/30"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-rose-500 dark:focus:ring-rose-500/30"
            />
            <input
              type="text"
              name="otp"
              placeholder="OTP"
              value={formData.otp}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-rose-500 dark:focus:ring-rose-500/30"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New password"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-rose-500 dark:focus:ring-rose-500/30"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <button
          onClick={() => router.push("/auth")}
          className="mt-6 w-full cursor-pointer rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:brightness-105 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
