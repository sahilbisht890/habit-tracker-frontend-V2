import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { ChevronDown, Moon, Sun, UserRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, updateMode } from "@/components/store/slices/userSlice";
import logo from "../../../public/images/logo.svg";

const Navbar = () => {
  const [activeRoute, setActiveRoute] = useState("Home");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { userData, isAuthenticated } = useSelector((state) => state.user);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (userData && typeof userData.mode !== "undefined") {
      setIsDark(userData.mode === "dark");
      return;
    }
    setIsDark(document.documentElement.classList.contains("dark"));
  }, [userData]);

  const navItems = [
    { label: "Home", route: "/" },
    {
      label: "Dashboard",
      route: "/dashboard",
    },
    { label: "FAQs", route: "/FAQ" },
  ];

  const handleClick = (item) => {
    setActiveRoute(item.label);

    if (item.dropdown) {
      // Toggle dropdown if clicked item has dropdown
      setOpenDropdown(openDropdown === item.label ? null : item.label);
    } else {
      // Navigate if it's a regular link
      router.push(item.route);
      setOpenDropdown(null); // Close any open dropdown
    }
  };

  const handleSubItemClick = (subItem) => {
    setActiveRoute(subItem.label);
    router.push(subItem.route);
    setOpenDropdown(null); // Close dropdown after selection
  };

  useEffect(() => {
    const pathSegment = router.pathname.split("/")[1];
    const matchedItem = navItems.find((item) => {
      const itemSegment = item.route.split("/")[1];
      return itemSegment === pathSegment;
    });

    if (matchedItem) {
      setActiveRoute(matchedItem.label);
    } else {
      setActiveRoute("");
    }
  }, [router.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setOpenDropdown(null);
      }
      if (!event.target.closest(".profile-container")) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleGetStarted = () => {
    router.push("/auth");
  };
  const handleToggleMode = async () => {
    const nextMode = isDark ? "light" : "dark";
    if (!userData || typeof userData.mode === "undefined") {
      const root = document.documentElement;
      const body = document.body;
      const isDarkNext = nextMode === "dark";
      root.classList.toggle("dark", isDarkNext);
      body.classList.toggle("dark", isDarkNext);
      root.setAttribute("data-theme", isDarkNext ? "dark" : "light");
      localStorage.setItem("theme", nextMode);
      setIsDark(nextMode === "dark");
      return;
    }
    try {
      await dispatch(updateMode(nextMode)).unwrap();
    } catch (error) {}
  };
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      setOpenProfile(false);
      router.push("/");
    } catch (error) {}
  };
  return (
    <>
      <nav className="hidden md:flex items-center justify-between md:px-1 xl:px-4 md:py-2 xl:py-3 rounded-2xl border border-rose-100 bg-white/80 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.4)] backdrop-blur-xl relative z-50 dark:border-white/20 dark:bg-slate-900/70">
        <div className="flex items-center md:gap-4 xl:gap-24">
<div className="relative flex justify-center items-center w-[100px] h-[30px] md:w-[130px] md:h-[40px] xl:w-[140px] xl:h-[40px]">
  <Image
    src={logo}
    alt="Logo"
    fill
    priority
    onClick={() => router.push("/")}
    className="cursor-pointer object-contain object-center"
  />
</div>

          <ul className="hidden md:flex items-center md:gap-4 xl:gap-16 md:text-[12px] xl:text-[16px] font-medium dropdown-container">
            {navItems.map((item, index) => (
              <li key={index} className="relative">
                <div
                  onClick={() => handleClick(item)}
                  className={`cursor-pointer font-manrope flex items-center gap-1 transition ${
                    item.label === activeRoute
                      ? "font-semibold text-rose-600 dark:text-white"
                      : "text-[#3F3F3F] hover:text-rose-500 dark:text-white/80 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                  {item.dropdown && (
                    <motion.span
                      animate={{
                        rotate: openDropdown === item.label ? 180 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={16} />
                    </motion.span>
                  )}
                </div>

                {/* Animated Dropdown */}
                {item.dropdown && (
                  <AnimatePresence>
                    {openDropdown === item.label && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-[40px] left-0 flex flex-col bg-white/95 border border-rose-100 rounded-2xl shadow-[0_18px_45px_-30px_rgba(244,63,94,0.35)] mt-2 z-50 w-[263px] h-[152px] backdrop-blur-xl"
                      >
                        {item.dropdown.map((sub, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => handleSubItemClick(sub)}
                            className={`p-[20px]  flex-1  ${
                              i === 0
                                ? "border-b-[1.02px] border-[#ECECEC] rounded-t-lg"
                                : "rounded-b-lg"
                            } font-manrope items-center flex gap-4 hover:bg-rose-50 cursor-pointer`}
                          >
                            <div className="h-[36px] w-[36px] rounded-[8px] border border-rose-100 bg-rose-50 flex items-center justify-center">
                              <Image
                                src={sub.logo}
                                alt={sub.label}
                                width={20}
                                height={20}
                                className="inline-block"
                              />
                            </div>
                            <div className="text-[#3F3F3F] text-[16px] font-manrope font-normal">
                              {sub.label}
                            </div>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleMode}
            className="cursor-pointer rounded-full border border-rose-100 bg-white/80 p-2 text-rose-500 shadow-sm transition hover:bg-rose-50"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {!isAuthenticated ? (
            <button
              onClick={handleGetStarted}
              suppressHydrationWarning
              className="cursor-pointer rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:brightness-105 md:text-[12px] xl:text-[16px] md:w-auto md:h-auto xl:w-[175px] xl:h-[44px]"
            >
              Get Started
            </button>
          ) : (
            <div className="relative profile-container">
              <button
                onClick={() => setOpenProfile((prev) => !prev)}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-rose-100 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-rose-50 hover:shadow-md dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:hover:bg-slate-800 dark:hover:border-white/20"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 dark:bg-rose-500/20">
                  <UserRound size={18} />
                </span>
                <span className="hidden xl:inline">
                  {userData?.username || userData?.name || "Account"}
                </span>
              </button>

              <AnimatePresence>
                {openProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-64 rounded-2xl border border-rose-100 bg-white/95 p-4 shadow-[0_18px_45px_-30px_rgba(244,63,94,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90"
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {userData?.username || userData?.name || "User"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {userData?.email || "No email"}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="mt-4 w-full cursor-pointer rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:brightness-105 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
