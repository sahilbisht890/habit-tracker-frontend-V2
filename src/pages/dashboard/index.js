import Dashboard from "@/components/dashboard";
import RootLayout from "@/components/Layout/rootlayout";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const DashboardPage = () => {
  const router = useRouter();
  const { isAuthenticated, authChecking } = useSelector((state) => state.user);

  useEffect(() => {
    if (!authChecking && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [authChecking, isAuthenticated, router]);

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-orange-50">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/60 bg-white/80 px-10 py-12 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-400 border-t-transparent" />
          <p className="text-sm font-semibold text-slate-600">
            Checking your session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <RootLayout>
      <Dashboard />
    </RootLayout>
  );
};

export default DashboardPage;
