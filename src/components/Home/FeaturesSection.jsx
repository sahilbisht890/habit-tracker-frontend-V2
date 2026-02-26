import React from "react";
import { motion } from "framer-motion";
import { HiMiniCheck } from "react-icons/hi2";
import HorizontalHeader from "../common/HorizontalHeader";

const FeatureImageComponent = ({ src, alt }) => {
  return (
    <div className="w-full h-full bg-[#FBFBFC] border border-[#E4E5EB] rounded-xl overflow-hidden flex items-center justify-center dark:bg-slate-900 dark:border-slate-700">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-fill"
      />
    </div>
  );
};

export const steps = [
  {
    id: 1,
    title: "Create & Customize Habits",
    description:
      "Easily create daily, weekly, or custom habits and personalize them with categories, colors, and reminders.",
    checklist: [
      "Daily / Weekly habit setup",
      "Custom categories",
      "Smart reminders",
    ],
    component: (
      <FeatureImageComponent
        src="/images/feature/habit-1.webp"
        alt="Create habits"
      />
    ),
  },
  {
    id: 2,
    title: "Track Progress Visually",
    description:
      "Monitor your consistency through beautiful charts, streak counters, and completion statistics.",
    checklist: [
      "Streak tracking",
      "Progress charts",
      "Completion percentage",
    ],
    component: (
      <FeatureImageComponent
        src="/images/feature/habit-2.webp"
        alt="Track progress"
      />
    ),
  },
  {
    id: 3,
    title: "Set Goals & Milestones",
    description:
      "Define long-term goals and break them into achievable milestones to stay motivated.",
    checklist: [
      "Goal setting",
      "Milestone tracking",
      "Performance insights",
    ],
    component: (
      <FeatureImageComponent
        src="/images/feature/habit-3.webp"
        alt="Goals and milestones"
      />
    ),
  },
  {
    id: 4,
    title: "Analytics & Reports",
    description:
      "Get detailed insights into your productivity with weekly and monthly performance reports.",
    checklist: [
      "Weekly reports",
      "Monthly summaries",
      "Habit success rate",
    ],
    component: (
      <FeatureImageComponent
        src="/images/feature/habit-4.webp"
        alt="Analytics reports"
      />
    ),
  },
  {
    id: 5,
    title: "Reminders & Notifications",
    description:
      "Never miss a habit with smart reminders and timely notifications.",
    checklist: [
      "Push notifications",
      "Custom reminder times",
      "Daily alerts",
    ],
    component: (
      <FeatureImageComponent
        src="/images/feature/habit-5.webp"
        alt="Reminders"
      />
    ),
  }
];


const TextComponent = ({ step, index }) => {
  return (
    <div className="md:w-[300px] lg:w-[400px] xl:w-[493px]">
      <div className="flex items-center gap-4">
        <div className="w-[36px] h-[36px] md:hidden rounded-full border border-[#E1DBEE] bg-[#EAEAFF] flex items-center justify-center text-[18px] font-medium dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
          {index + 1}
        </div>
        <h3 className="text-[24px] md:text-[26px] xl:text-[28px] font-light dark:text-white">
          {step.title}
        </h3>
      </div>

      <p className="font-normal text-[#464646] text-[14px] my-4 leading-[160%] xl:text-[16px] dark:text-slate-300">
        {step.description}
      </p>

      <ul className="space-y-4">
        {step.checklist.map((item, i) => (
          <li key={i} className="flex items-center gap-[16px]">
            <div className="h-[30px] w-[30px] rounded-md bg-[#FBFBFC] border border-[#E4E5EB] flex items-center justify-center dark:bg-slate-900 dark:border-slate-700">
              <HiMiniCheck className="text-[16px] text-[#404040] dark:text-rose-300" />
            </div>
            <span className="text-[16px] xl:text-[18px] text-[#404040] dark:text-slate-200">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const subtext = `<p>Build consistency, stay disciplined, and achieve your goals with our powerful habit tracking system.</p>`;

const HabitTrackerFeatures = () => {
  return (
    <div className="bg-white px-4 xl:px-10 pt-0 md:pt-34 pb-14  mx-auto dark:bg-gray-800">
      <HorizontalHeader
        title={`Powerful Features to \n Build Better Habits`}
        subtext={subtext}
      />

      <div className="relative mt-6 md:mt-20 px-4 xl:px-24">
        <div
          className="absolute hidden md:block left-1/2 top-0 h-full w-[2px] bg-[#C1C1C1] transform -translate-x-1/2 z-20 dark:bg-slate-700"
          style={{ height: `calc(100% - 150px)` }}
        />

        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex ${
              index % 2 === 0 ? "flex-col-reverse" : "flex-col"
            } mt-14 md:mt-24 gap-4 md:flex-row justify-between items-center relative`}
          >
            {index % 2 !== 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <TextComponent step={step} index={index} />
                </motion.div>

                <div className="w-[36px] h-[36px] hidden z-[22] md:flex rounded-full border border-[#E1DBEE] bg-[#EAEAFF] items-center justify-center dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
                  {index + 1}
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="w-[358px] h-[214px] md:w-[400px] md:h-[300px] xl:w-[493px] xl:h-[295px]"
                >
                  {step.component}
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="w-[358px] h-[214px] md:w-[400px] md:h-[300px] xl:w-[493px] xl:h-[295px]"
                >
                  {step.component}
                </motion.div>

                <div className="w-[36px] h-[36px] z-[22] hidden md:flex rounded-full border border-[#E1DBEE] bg-[#EAEAFF] items-center justify-center dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
                  {index + 1}
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <TextComponent step={step} index={index} />
                </motion.div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitTrackerFeatures;
