import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { BsStars } from "react-icons/bs";

const HeroSection = () => {

  const router = useRouter();

  const arrowsData = [
    {
      label: "Daily Habit Builders",
      color: "bg-[#6C19FB]",
      position:
        "md:top-[139px] md:left-[-50px] xl:top-[80px] xl:left-0  flex-row-reverse",
      image: "/images/icons/cursorBlue.svg",
      divStyle: "left-[10px]",
    },
    {
      label: "Goal-Oriented People",
      color: "bg-[#24831F]",
      position: "md:top-[139px] md:right-[-50px]  xl:top-[50px] xl:right-0 2xl:top-[70px]",
      image: "/images/icons/cursorGreen.svg",
      divStyle: "right-[10px]",
    },
    {
      label: "Productivity Enthusiasts",
      color: "bg-[#E87400]",
      position:
        "md:bottom-[-80px] xl:left-[-20px] xl:bottom-[40px] 2xl:left-[80px] flex-row-reverse",
      image: "/images/icons/cursorOrange.svg",
      divStyle: "left-[10px]",
    },
    {
      label: "Self-Improvement Seekers",
      color: "bg-[#CB1B96]",
      position: "md:bottom-[-50px] xl:bottom-[-5px] right-[60px] right-0",
      image: "/images/icons/cursorPink.svg",
      divStyle: "right-[10px]",
    },
  ];

  const handleGetStarted = () => {
    router.push("/auth");
  }

  return (
    <div className="relative h-auto md:min-h-screen flex items-center justify-center bg-white dark:bg-gray-800 px-4">
      <div className="text-center w-[90%] xl:w-[70%] 2xl:w-[80%] py-[10vh] relative">
        {arrowsData.map(({ label, color, position, image, divStyle }, i) => (
          <div
            key={i}
            className={`absolute ${position} hidden lg:flex items-center gap-0 lg:gap-2`}
          >
            <div className={`lg:w-[48px] lg:h-[48px] w-[30] h-[30]`}>
              <img src={image} alt={label} className="w-full h-full" />
            </div>
            <div
              className={`${color} ${divStyle} top-[20px] relative  border-2 border-white text-white px-4 py-2 font-manrope flex items-center justify-between gap-2 rounded-full text-sm md:text-[16px] font-medium`}
            >
              <div>
                <BsStars className="text-white" />
              </div>
              <div className="text-base italic">{label}</div>
            </div>
          </div>
        ))}
        <span className="bg-gradient-to-r mt-4 from-pink-600 to-purple-600  text-[64px] md:text-[72px] xl:text-[86px] text-transparent bg-clip-text pacifico-regular">
          Habit Tracker
        </span>

        <p className="text-[#383838] manrope dark:text-gray-300 font-normal text-[16px] md:text-[20px] leading-[150%] mt-6 md:mt-8 max-w-3xl mx-auto">
          Track your daily routines, stay consistent, and turn small actions
          into life-changing habits. Simple, focused, and designed to help you
          grow—every single day.
        </p>

        <div className="flex justify-center mt-8 md:mt-10">
          <button
            onClick={handleGetStarted}
            className="flex items-center cursor-pointer gap-2 bg-pink-700 hover:bg-pink-800 dark:bg-pink-600 dark:hover:bg-pink-700 text-white px-8 md:px-12 py-3 md:py-4 rounded-full text-[16px] md:text-[18px] font-medium transition-all duration-300 hover:scale-105"
          >
            <BsStars className="text-white text-3xl" />
            Get Started for Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
