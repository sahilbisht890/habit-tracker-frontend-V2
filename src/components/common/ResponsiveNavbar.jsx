import React from "react";
import { useEffect, useState } from "react";
import MobileNavbar from "./MobileNavbar";
import Navbar from "./Navbar";
const ResponsiveNavbar = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="relative">
        <div
          className={`fixed hidden md:block  left-1/2 -translate-x-1/2 z-[1000] transition-all duration-500 ease-in-out
        ${
          !isSticky
            ? "w-[92%] xl:w-[1122px] 3xl:w-[80%] top-[30px]"
            : "w-[97%] top-[10px]"
        }
      `}
        >
          <Navbar/>
        </div>
        <div className="block md:hidden fixed top-0 z-[2000]">
          <MobileNavbar  />
        </div>
      </div>
    </>
  );
};

export default ResponsiveNavbar;
