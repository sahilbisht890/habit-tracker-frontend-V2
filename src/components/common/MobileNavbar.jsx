import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, updateMode } from "@/components/store/slices/userSlice";
const navItems = [
  { label: "Home", route: "/" },
  {
    label: "Dashboard",
    route: "/dashboard",
  },
  { label: "FAQs", route: "/FAQ" },
];

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown, setDropdown] = useState({});
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

  const handleNavigation = (route) => {
    router.push(route);
    setIsOpen(false);
  };

  const toggleDropdown = (label) => {
    setDropdown((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleGetStarted = () => {
    router.push("/auth");
    setIsOpen(false);
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
      setIsOpen(false);
      router.push("/");
    } catch (error) {}
  };

  return (
    <>
      <div className="relative">
        {/* Navbar Header */}
        <div className="flex justify-between items-center p-4 mobileNavbar border-b border-white/40 fixed w-full z-[2000] bg-white/80 backdrop-blur-xl">
          <div className="flex items-center space-x-2">
            <img
              onClick={() => handleNavigation("/")}
              src="/images/logo.svg"
              alt="Logo"
              className="w-[165px] h-[47px] cursor-pointer"
            />
          </div>
          {isOpen ? (
            <button onClick={() => setIsOpen(false)} className="cursor-pointer">
              <FiX size={28} />
            </button>
          ) : (
            <button onClick={() => setIsOpen(true)} className="cursor-pointer">
              <FiMenu size={28} />
            </button>
          )}
        </div>

        {/* Overlay Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: "easeInOut" }}
              className="fixed inset-0 top-[60px] z-[1100] bg-white/90 backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-white/90 p-4 pt-6 overflow-y-auto">
                <motion.div
                  className="space-y-5 bg-white/80 mt-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {navItems.map((item, index) => (
                    <div
                      key={index}
                      className="border-b border-rose-100 pb-[16px]"
                    >
                      {item.dropdown ? (
                        <>
                          <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => toggleDropdown(item.label)}
                          >
                            <span className="text-[16px] font-manrope font-medium text-[#282828]">
                              {item.label}
                            </span>
                            <motion.div
                              animate={{
                                rotate: dropdown[item.label] ? 180 : 0,
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <FiChevronDown />
                            </motion.div>
                          </div>
                          <AnimatePresence>
                            {dropdown[item.label] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                  height: "auto",
                                  opacity: 1,
                                  transition: {
                                    height: { duration: 0.3 },
                                    opacity: { duration: 0.2, delay: 0.1 },
                                  },
                                }}
                                exit={{
                                  height: 0,
                                  opacity: 0,
                                  transition: {
                                    height: { duration: 0.2 },
                                    opacity: { duration: 0.1 },
                                  },
                                }}
                                className="overflow-hidden"
                              >
                                <div className="mt-3 text-[#515151] space-y-[10px]">
                                  {item.dropdown.map((subItem, subIndex) => (
                                    <motion.div
                                      key={subIndex}
                                      className="flex items-center gap-2"
                                      onClick={() =>
                                        handleNavigation(subItem.route)
                                      }
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{
                                        opacity: 1,
                                        x: 0,
                                        transition: { delay: subIndex * 0.05 },
                                      }}
                                    >
                                      <div className="flex items-center justify-center h-[28px] w-[28px] rounded-[4px] border-[.54px] border-[#E4E5EB] bg-[#F8F8FF]">
                                        <Image
                                          src={subItem.logo}
                                          alt={subItem.label}
                                          width={16}
                                          height={16}
                                          className="inline-block"
                                        />
                                      </div>
                                      <div className="cursor-pointer text-[14px] font-manrope font-normal text-[#515151]">
                                        {subItem.label}
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <motion.div
                          whileTap={{ scale: 0.98 }}
                          className="cursor-pointer text-[16px] font-manrope font-medium text-[#282828]"
                          onClick={() => handleNavigation(item.route)}
                        >
                          {item.label}
                        </motion.div>
                      )}
                    </div>
                  ))}

                  {/* Buttons */}
                  <motion.div
                    className="mt-10 space-y-3 flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.3 },
                    }}
                  >
                    {!isAuthenticated ? (
                      <motion.button
                        className="w-[283px] h-[44px] rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 text-white font-manrope font-semibold shadow-lg shadow-rose-500/30 cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGetStarted}
                      >
                        Get Started
                      </motion.button>
                    ) : (
                      <motion.div
                        className="w-[283px] rounded-2xl border border-rose-100 bg-white/90 px-4 py-3 text-left shadow-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          {userData?.username || userData?.name || "User"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {userData?.email || "No email"}
                        </p>
                        <button
                          onClick={handleToggleMode}
                          className="mt-3 w-full rounded-full border border-rose-200 bg-rose-50 py-2 text-xs font-semibold text-rose-600"
                        >
                          {isDark ? "Light Mode" : "Dark Mode"}
                        </button>
                        <button
                          onClick={handleLogout}
                          className="mt-2 w-full rounded-full border border-rose-200 bg-white py-2 text-xs font-semibold text-slate-700"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                    <motion.button
                      className="w-[283px] h-[44px] rounded-full border border-rose-200 bg-white/80 text-[#202020] font-manrope font-semibold shadow-sm cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleToggleMode}
                    >
                      {isDark ? "Light Mode" : "Dark Mode"}
                    </motion.button>
                    <motion.button
                      className="border border-rose-200 w-[283px] h-[44px] py-2 rounded-full text-[#202020] font-manrope font-semibold bg-white/80 shadow-sm cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Know More
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default MobileNavbar;
