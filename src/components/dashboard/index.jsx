"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createHabit,
  deleteHabit,
  fetchHabits,
  updateHabit,
} from "../store/slices/habitSlice";
import {
  addTrackedHabit,
  deleteTrackedHabit,
  fetchTrackedHabits,
  updateTrackedProgress,
} from "../store/slices/habitTrackerSlice";
import { Plus, Pencil, Trash2, CheckCircle2, Circle } from "lucide-react";
import dayjs from "dayjs";
import HabitModal from "./habitModal";
import toast from "react-hot-toast";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [selectedTracked, setSelectedTracked] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const { habits, loading: habitsLoading, error: habitsError } = useSelector(
    (state) => state.habit
  );
  const {
    items: trackedHabits,
    loading: trackedLoading,
    error: trackedError,
    currentDate,
  } = useSelector((state) => state.habitTracker);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(null);
  const [hasLoadedHabits, setHasLoadedHabits] = useState(false);
  const [progressDrafts, setProgressDrafts] = useState({});
  const [progressSaving, setProgressSaving] = useState({});
  const [progressCommitTimers, setProgressCommitTimers] = useState({});

  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  useEffect(() => {
    if (!hasLoadedHabits) {
      dispatch(fetchHabits());
      setHasLoadedHabits(true);
    }
  }, [dispatch, hasLoadedHabits]);

  useEffect(() => {
    if (currentDate !== selectedDate) {
      dispatch(fetchTrackedHabits(selectedDate));
    }
  }, [dispatch, currentDate, selectedDate]);

  const completedCount = useMemo(() => {
    return trackedHabits?.filter((h) => h.status === "complete").length || 0;
  }, [trackedHabits]);

  const totalCount = trackedHabits?.length || 0;

  const resolveTrackedHabit = (item) => {
    if (!item) return null;
    if (item.habit) return item.habit;
    if (item.habitId && typeof item.habitId === "object") return item.habitId;
    return item;
  };

  const resolveTrackedHabitId = (item) => {
    if (!item) return null;
    return (
      item.id ||
      null
    );
  };

  const isHabitTracked = (habitId) => {
    return trackedHabits?.some(
      (item) => resolveTrackedHabitId(item) === habitId
    );
  };

  const handleHabitSubmit = async (formData) => {
    setModalLoading(true);
    try {
      if (modalType === "create") {
        const response = await dispatch(createHabit(formData)).unwrap();
        toast.success(response?.message || "Habit created");
        dispatch(fetchHabits());
      }

      if (modalType === "update") {
        const habitId = selectedHabit?._id || selectedHabit?.id;
        const response = await dispatch(
          updateHabit({
            id: habitId,
            data: formData,
          })
        ).unwrap();
        toast.success(response?.message || "Habit updated");
        dispatch(fetchHabits());
      }

      if (modalType === "edit") {
        const habitMeta = resolveTrackedHabit(selectedTracked);
        const habitId = resolveTrackedHabitId(selectedTracked);
        await dispatch(
          updateTrackedProgress({
            id: selectedTracked?._id || selectedTracked?.id,
            habitId,
            progress: formData.progress,
            status:
              formData.progress === (habitMeta?.dailyGoal || 0)
                ? "complete"
                : "incomplete",
          })
        ).unwrap();
        toast.success("Progress updated");
        dispatch(fetchTrackedHabits(selectedDate));
      }
    } catch (error) {
      console.error("Habit submit error:", error);
      const message = error?.message || "Operation failed";
      toast.error(message);
      throw message;
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditHabit = (habit) => {
    setSelectedHabit(habit);
    setModalType("update");
    setModalOpen(true);
  };

  const handleDeleteClick = (item, type) => {
    if (type === "habit") {
      setSelectedHabit(item);
    } else {
      setSelectedTracked(item);
    }
    setDeleteType(type);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (deleteType === "habit") {
        const habitId = selectedHabit?._id || selectedHabit?.id;
        await dispatch(deleteHabit(habitId)).unwrap();
        toast.success("Habit deleted");
        dispatch(fetchHabits());
        dispatch(fetchTrackedHabits(selectedDate));
      } else {
        const habitId = resolveTrackedHabitId(selectedTracked);
        console.log('selectedTracked',selectedTracked)
        await dispatch(
          deleteTrackedHabit({ habitTrackerId : selectedTracked?.id })
        ).unwrap();
        toast.success("Tracked habit removed");
        dispatch(fetchTrackedHabits(selectedDate));
      }
      setDeleteOpen(false);
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleNewHabitClick = () => {
    setSelectedHabit(null);
    setModalType("create");
    setModalOpen(true);
  };

  const handleAddToDate = async (habit) => {
    const habitId = habit._id || habit.id;
    if (isHabitTracked(habitId)) {
      toast("This habit is already added for the selected date.");
      return;
    }

    try {
      await dispatch(
        addTrackedHabit({
          habitId,
          date: selectedDate,
        })
      ).unwrap();
      toast.success("Habit added for this date");
      dispatch(fetchTrackedHabits(selectedDate));
    } catch (error) {
      toast.error("Failed to add habit");
    }
  };

  const normalizeId = (value) => {
    if (!value) return null;
    if (typeof value === "object") return value._id || value.id || null;
    return value;
  };

  const getTrackedHabitId = (item) => normalizeId(item?._id || item?.id || item);
  const getHabitIdForTracked = (habitMeta, item) =>
    normalizeId(habitMeta || item?.habitId || item?.habit);

  const handleProgressChange = (trackedId, value) => {
    setProgressDrafts((prev) => ({
      ...prev,
      [trackedId]: value,
    }));
  };

  const handleProgressCommit = async (item, dailyGoal, progressOverride, forceComplete = false) => {
    const trackedId = getTrackedHabitId(item);
    if (!trackedId) return;
    const habitMeta = resolveTrackedHabit(item) || {};
    const habitId = getHabitIdForTracked(habitMeta, item);
    const progress =
      typeof progressOverride === "number"
        ? progressOverride
        : progressDrafts[trackedId] ?? (item?.progress ?? 0);

    setProgressSaving((prev) => ({ ...prev, [trackedId]: true }));
    try {
      await dispatch(
        updateTrackedProgress({
          id: trackedId,
          habitId,
          progress,
          status:
            forceComplete || progress === (dailyGoal || 0)
              ? "complete"
              : "incomplete",
        })
      ).unwrap();
      // Delay refresh slightly to avoid UI jump during rapid slider updates
      const timer = setTimeout(() => {
        dispatch(fetchTrackedHabits(selectedDate));
        setProgressCommitTimers((prev) => {
          const next = { ...prev };
          delete next[trackedId];
          return next;
        });
      }, 350);
      setProgressCommitTimers((prev) => {
        if (prev[trackedId]) clearTimeout(prev[trackedId]);
        return { ...prev, [trackedId]: timer };
      });
    } catch (error) {
      toast.error("Failed to update progress");
    } finally {
      setProgressSaving((prev) => ({ ...prev, [trackedId]: false }));
    }
  };

  return (
    <>
      <HabitModal
        type={modalType}
        habitDetails={selectedHabit}
        isOpen={modalOpen}
        onSubmit={handleHabitSubmit}
        onClose={() => setModalOpen(false)}
        loading={modalLoading}
      />

      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDeleteOpen(false)}
          />

          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-red-600">
              {deleteType === "habit" ? "Delete Habit" : "Remove Tracked Habit"}
            </h2>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to remove{" "}
              <span className="font-semibold">
                {deleteType === "habit"
                  ? `"${selectedHabit?.name}"`
                  : `"${resolveTrackedHabit(selectedTracked)?.name || "habit"}"`}
              </span>
              ?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteOpen(false)}
                className="cursor-pointer rounded-lg border px-4 py-2"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirm}
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 pb-16 pt-[18vh] dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-7xl space-y-8 px-6">
          {/* Header */}
          <div className="flex flex-col gap-6 rounded-3xl border border-white/40 bg-white/70 p-6 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-white/5 dark:bg-slate-900/70 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-500">
                Habit Control Center
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl">
                Build streaks with intention
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Track consistency, spot wins, and keep momentum alive.
              </p>
            </div>

            <div className="flex items-center gap-4">
                <button
                  onClick={handleNewHabitClick}
                  className="flex cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:brightness-105"
                >
                  <Plus size={18} />
                  New Habit
                </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow-[0_12px_35px_-25px_rgba(15,23,42,0.45)] backdrop-blur-lg dark:border-white/10 dark:bg-slate-900/70">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Tracked Habits
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                {totalCount}
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                For {dayjs(selectedDate).format("MMM D, YYYY")}
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-6 shadow-[0_12px_35px_-25px_rgba(5,150,105,0.45)] dark:border-white/10 dark:from-emerald-950/50 dark:via-slate-900 dark:to-slate-900">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600/80 dark:text-emerald-300">
                Completed
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-emerald-600 dark:text-emerald-400">
                {completedCount}
              </h2>
              <p className="mt-2 text-sm text-emerald-700/70 dark:text-emerald-200/70">
                Celebrate every finish.
              </p>
            </div>

            <div className="rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-orange-50 p-6 shadow-[0_12px_35px_-25px_rgba(244,63,94,0.4)] dark:border-white/10 dark:from-rose-950/50 dark:via-slate-900 dark:to-slate-900">
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-500/90 dark:text-rose-300">
                Completion Rate
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-rose-500">
                {totalCount === 0
                  ? "0%"
                  : `${Math.round((completedCount / totalCount) * 100)}%`}
              </h2>
              <p className="mt-2 text-sm text-rose-700/70 dark:text-rose-200/70">
                Consistency compounds.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            {/* Left Panel: Habit Library */}
            <div className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.4)] backdrop-blur-lg dark:border-white/10 dark:bg-slate-900/70">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Habit Library
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Create, edit, and add habits to a day.
                  </p>
                </div>
                <button
                  onClick={handleNewHabitClick}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:brightness-105"
                >
                  <Plus size={14} />
                  New Habit
                </button>
              </div>

              {habitsLoading && (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-400 border-t-transparent" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Loading habits...
                  </p>
                </div>
              )}

              {habitsError && (
                <div className="mt-6 rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-600">
                  {habitsError}
                </div>
              )}

              {!habitsLoading && habits?.length === 0 && (
                <div className="mt-8 rounded-2xl border border-dashed border-rose-200 bg-white/70 p-10 text-center text-slate-500 shadow-[0_10px_25px_-18px_rgba(244,63,94,0.3)] dark:border-rose-500/30 dark:bg-slate-900/60">
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    No habits yet
                  </p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Create a habit and start tracking it today.
                  </p>
                  <button
                    onClick={handleNewHabitClick}
                    className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-rose-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:brightness-105"
                  >
                    <Plus size={14} />
                    Create your first habit
                  </button>
                </div>
              )}

              <div className="mt-6 grid max-h-[520px] gap-4 overflow-y-auto pr-2">
                {habits?.map((habit) => (
                  <div
                    key={habit._id || habit.id}
                    className="group rounded-2xl border border-rose-100/70 bg-gradient-to-br from-white via-rose-50/70 to-orange-50/70 p-4 transition hover:border-rose-200 hover:shadow-[0_16px_45px_-30px_rgba(244,63,94,0.45)] dark:border-white/10 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-950"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                          {habit.name}
                        </h4>
                        <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white/70 px-3 py-1 text-[11px] font-semibold text-rose-600 shadow-sm dark:border-rose-900/40 dark:bg-slate-900/60 dark:text-rose-200">
                          Goal: {habit.dailyGoal} {habit.unit}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddToDate(habit)}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:brightness-105"
                      >
                        <Plus size={12} />
                        Add to {dayjs(selectedDate).format("MMM D")}
                      </button>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        onClick={() => handleEditHabit(habit)}
                        className="cursor-pointer rounded-full border border-slate-200 bg-white/80 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(habit, "habit")}
                        className="cursor-pointer rounded-full border border-red-200/70 bg-red-50/80 p-2 text-red-500 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/60"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel: Tracked Habits by Date */}
            <div className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.4)] backdrop-blur-lg dark:border-white/10 dark:bg-slate-900/70">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Habits for the day
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Track and update progress for the selected date.
                  </p>
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-rose-500 dark:focus:ring-rose-500/30"
                />
              </div>

              {trackedLoading && (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-400 border-t-transparent" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Loading tracked habits...
                  </p>
                </div>
              )}

              {trackedError && (
                <div className="mt-6 rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-600">
                  {trackedError}
                </div>
              )}

              {!trackedLoading && trackedHabits?.length === 0 && (
                <div className="mt-8 rounded-2xl border border-dashed border-rose-200 bg-white/70 p-10 text-center text-slate-500 shadow-[0_10px_25px_-18px_rgba(244,63,94,0.3)] dark:border-rose-500/30 dark:bg-slate-900/60">
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    No habits tracked for this date
                  </p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Add habits from the left panel to get started.
                  </p>
                </div>
              )}

              <div className="mt-6 grid max-h-[520px] gap-4 overflow-y-auto pr-2">
                {(trackedHabits || []).filter(Boolean).map((item) => {
                  const habitMeta = resolveTrackedHabit(item) || {};
                  const progress = item.progress ?? 0;
                  const dailyGoal = habitMeta.dailyGoal || 0;
                  const trackedId = getTrackedHabitId(item);
                  const displayProgress =
                    progressDrafts[trackedId] ?? progress;
                  const isComplete =
                    dailyGoal > 0 && displayProgress >= dailyGoal;
                  const progressPercent = dailyGoal
                    ? Math.round((displayProgress / dailyGoal) * 100)
                    : 0;
                  const clampedPercent = Math.min(
                    100,
                    Math.max(0, progressPercent)
                  );
                  return (
                    <div
                      key={trackedId}
                      className={`group rounded-2xl border p-4 transition hover:shadow-[0_16px_45px_-30px_rgba(15,23,42,0.35)] ${
                        isComplete
                          ? "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/60 dark:border-white/10 dark:from-emerald-950/30 dark:via-slate-900 dark:to-emerald-950/20"
                          : "border-slate-200/60 bg-white/70 hover:border-rose-200 dark:border-white/10 dark:bg-slate-900/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                            {habitMeta.name || "Habit"}
                          </h4>
                          <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 text-[11px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                            {displayProgress} / {dailyGoal} {habitMeta.unit || ""}
                          </div>
                        </div>
                        <div
                          className="relative flex h-11 w-11 items-center justify-center rounded-full p-[2px] shadow-sm"
                          style={{
                            background: isComplete
                              ? "conic-gradient(#10b981 0deg 360deg)"
                              : `conic-gradient(#f43f5e 0deg ${
                                  clampedPercent * 3.6
                                }deg, rgba(226,232,240,0.6) ${
                                  clampedPercent * 3.6
                                }deg 360deg)`,
                          }}
                        >
                          <div
                            className={`flex h-full w-full items-center justify-center rounded-full border text-[11px] font-semibold ${
                              isComplete
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/30 dark:text-emerald-200"
                                : "border-white/70 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                            }`}
                          >
                            {isComplete ? (
                              <CheckCircle2 size={16} />
                            ) : (
                              <span>{clampedPercent}%</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="mt-3 flex items-center gap-3">
                          <input
                            type="range"
                            min={0}
                            max={dailyGoal}
                            step={1}
                            value={displayProgress}
                            disabled={!dailyGoal || progressSaving[trackedId]}
                            onChange={(e) =>
                              handleProgressChange(
                                trackedId,
                                Number(e.target.value)
                              )
                            }
                            onMouseUp={() =>
                              handleProgressCommit(item, dailyGoal)
                            }
                            onTouchEnd={() =>
                              handleProgressCommit(item, dailyGoal)
                            }
                            onBlur={() =>
                              handleProgressCommit(item, dailyGoal)
                            }
                            className={`h-2 w-full cursor-pointer accent-rose-500 disabled:cursor-not-allowed ${
                              isComplete ? "accent-emerald-500" : ""
                            }`}
                          />
                          <span className="min-w-[64px] text-right text-xs text-slate-500 dark:text-slate-400">
                            {displayProgress} {habitMeta.unit || ""}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (!dailyGoal) return;
                              handleProgressChange(trackedId, dailyGoal);
                              handleProgressCommit(
                                item,
                                dailyGoal,
                                dailyGoal,
                                true
                              );
                            }}
                            disabled={!dailyGoal || progressSaving[trackedId]}
                            className="inline-flex cursor-pointer items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 p-2 text-emerald-600 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 dark:border-emerald-900/40 dark:bg-emerald-900/30 dark:text-emerald-300"
                            title="Mark as done"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end gap-2">
                        <button
                          onClick={() => handleDeleteClick(item, "tracked")}
                          className="cursor-pointer rounded-full border border-red-200/70 bg-red-50/80 p-2 text-red-500 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/60"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
