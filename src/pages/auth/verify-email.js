import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import axiosInstance from "@/components/axios/axiosInstance";
import endpoints from "@/components/axios/apiRoutes";
import { checkAuth } from "@/components/store/slices/userSlice";

const VerifyEmailPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, authChecking, userData } = useSelector(
    (state) => state.user
  );
  const [loading, setLoading] = useState(false);

  

  const handleVerify = async (e) => {
    e.preventDefault();
    const token = router.query?.token;
    if (!token) {
      toast.error("Verification token missing");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post(endpoints.verifyEmail, { token });
      toast.success("Email verified successfully");
      router.push("/auth");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Verification failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (authChecking) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br flex justify-center items-center from-rose-50 via-white to-orange-50 px-6 py-16 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-md rounded-3xl border border-white/40 bg-white/80 p-8 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
          Verify Email
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
          Confirm your email address
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {userData?.email
            ? `We will verify ${userData.email} using the link token.`
            : "We will verify your email using the link token."}
        </p>

        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <button
            type="submit"
            disabled={loading || !router.query?.token}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
