import { useRouter } from "next/router";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 px-6 py-20 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-2xl flex-col items-center rounded-3xl border border-white/40 bg-white/80 p-10 text-center shadow-[0_18px_45px_-30px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
          404 Error
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
          This page slipped your streak.
        </h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          The page you are looking for doesn’t exist or was moved.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <button
            onClick={() => router.push("/")}
            className="w-full cursor-pointer rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:brightness-105 sm:w-auto"
          >
            Back to Home
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full cursor-pointer rounded-full border border-rose-200 bg-rose-50 px-5 py-2 text-sm font-semibold text-rose-600 transition hover:brightness-105 sm:w-auto dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
