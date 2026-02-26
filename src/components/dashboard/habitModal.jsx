"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const HabitModal = ({
  type = "create", // create | update | edit (progress)
  habitDetails = {},
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    dailyGoal: "",
    unit: "",
    progress: 0,
  });

  const [errors, setErrors] = useState({});

  // Prefill data
  useEffect(() => {
    if (habitDetails && (type === "update" || type === "edit")) {
      setFormData({
        name: habitDetails.name || "",
        dailyGoal: habitDetails.dailyGoal || "",
        unit: habitDetails.unit || "",
        progress: habitDetails.progress || 0,
      });
    } else {
      setFormData({
        name: "",
        dailyGoal: "",
        unit: "",
        progress: 0,
      });
    }
  }, [habitDetails, type]);

  // ESC close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim() && type !== "edit") {
      newErrors.name = "Habit name is required";
    }

    if (!formData.dailyGoal && type !== "edit") {
      newErrors.dailyGoal = "Daily goal is required";
    }

    if (!formData.unit.trim() && type !== "edit") {
      newErrors.unit = "Unit is required";
    }

    if (type === "edit") {
      if (formData.progress < 0) {
        newErrors.progress = "Progress cannot be negative";
      }

      if (formData.progress > habitDetails.dailyGoal) {
        newErrors.progress = "Progress cannot exceed daily goal";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.type === "number" ? Number(e.target.value) : e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      // Handle submission error if needed
      console.log("Submission error:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/90 p-6 shadow-[0_24px_60px_-18px_rgba(15,23,42,0.65)] ring-1 ring-black/5 backdrop-blur-xl dark:border-white/5 dark:bg-slate-900/90">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4">
          <div className="space-y-2">
            <span className="inline-flex items-center rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-300">
              {type === "create"
                ? "New Habit"
                : type === "update"
                  ? "Edit Habit"
                  : "Progress"}
            </span>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {type === "create"
                ? "Create a new habit"
                : type === "update"
                  ? "Refine your habit"
                  : "Log today's progress"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {type === "create"
                ? "Set the goal and unit to keep daily tracking simple."
                : type === "update"
                  ? "Update the habit details without losing your streak."
                  : "How far did you get today? You can edit this later."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer rounded-full border border-slate-200 bg-white/80 p-2 text-slate-500 transition hover:text-slate-700 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          {type !== "edit" && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Habit Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Morning walk"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200 disabled:cursor-not-allowed disabled:bg-slate-100/70 dark:border-slate-700 dark:bg-slate-900/70 dark:text-white dark:focus:border-rose-500 dark:focus:ring-rose-500/30"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
          )}

          {/* Daily Goal */}
          {type !== "edit" && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Daily Goal
              </label>
              <input
                type="number"
                name="dailyGoal"
                min={1}
                value={formData.dailyGoal}
                onChange={handleChange}
                placeholder="e.g., 5"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200 disabled:cursor-not-allowed disabled:bg-slate-100/70 dark:border-slate-700 dark:bg-slate-900/70 dark:text-white dark:focus:border-rose-500 dark:focus:ring-rose-500/30"
              />
              {errors.dailyGoal && (
                <p className="text-red-500 text-xs mt-1">{errors.dailyGoal}</p>
              )}
            </div>
          )}

          {/* Unit */}
          {type !== "edit" && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Unit
              </label>
              <input
                name="unit"
                list="habit-unit-options"
                value={formData.unit}
                onChange={handleChange}
                placeholder="e.g., minutes"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200 disabled:cursor-not-allowed disabled:bg-slate-100/70 dark:border-slate-700 dark:bg-slate-900/70 dark:text-white dark:focus:border-rose-500 dark:focus:ring-rose-500/30"
              />
              <datalist id="habit-unit-options">
                <option value="minutes" />
                <option value="hours" />
                <option value="steps" />
                <option value="reps" />
                <option value="pages" />
                <option value="glasses" />
                <option value="sessions" />
                <option value="tasks" />
              </datalist>
              {errors.unit && (
                <p className="text-red-500 text-xs mt-1">{errors.unit}</p>
              )}
            </div>
          )}

          {/* Progress */}
          {type === "edit" && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Progress
              </label>
              <input
                type="number"
                name="progress"
                min={0}
                value={formData.progress}
                onChange={handleChange}
                placeholder={`0-${habitDetails.dailyGoal || 0}`}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-white dark:focus:border-rose-500 dark:focus:ring-rose-500/30"
              />
              {errors.progress && (
                <p className="text-red-500 text-xs mt-1">{errors.progress}</p>
              )}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading && (
              <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
            )}
            {loading
              ? "Saving..."
              : type === "create"
                ? "Create Habit"
                : type === "update"
                  ? "Update Habit"
                  : "Update Progress"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HabitModal;
