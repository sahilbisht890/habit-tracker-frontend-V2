import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import Head from "next/head";
import { useRouter } from "next/router";
import Subtext from "../common/CommonSubtext";
import Heading from "../common/CommonHeading";

const faqSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

const FAQCard = ({ content, isOpen, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative w-full overflow-hidden rounded-2xl border border-white/40 bg-white/80 p-4 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.35)] backdrop-blur-lg transition hover:-translate-y-0.5 hover:shadow-[0_25px_55px_-28px_rgba(15,23,42,0.5)] md:rounded-3xl md:p-6"
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 opacity-0 transition group-hover:opacity-100" />
      <div
        className="flex justify-between items-start cursor-pointer"
        onClick={onClick}
      >
        <h3 className="font-semibold font-sans text-left text-[16px] md:text-[20px] text-slate-900">
          {content.question}
        </h3>
        <div className="text-[24px] text-slate-600">
          {isOpen ? <CiCircleMinus /> : <CiCirclePlus />}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-[14px] font-sans text-left text-slate-600 mt-4 leading-[165%]">
              {content.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const faqData = [
  {
    id: 1,
    category: "General",
    question: "What is a Habit Tracker?",
    answer:
      "A habit tracker helps you build and maintain positive routines by tracking daily, weekly, or monthly habits in a structured way.",
  },
  {
    id: 2,
    category: "General",
    question: "How does the Habit Tracker work?",
    answer:
      "You create habits, set frequency goals, and mark them complete daily. The system tracks streaks, progress, and completion rates.",
  },
  {
    id: 3,
    category: "Features",
    question: "Can I track multiple habits at once?",
    answer:
      "Yes, you can create unlimited habits and organize them into categories such as fitness, productivity, learning, or health.",
  },
  {
    id: 4,
    category: "Features",
    question: "Does it support habit streak tracking?",
    answer:
      "Yes, the tracker automatically calculates streaks and shows how consistently you complete your habits.",
  },
  {
    id: 5,
    category: "Features",
    question: "Can I set reminders for my habits?",
    answer:
      "Yes, you can enable daily reminders to stay consistent and never miss a habit.",
  },
  {
    id: 6,
    category: "Account",
    question: "Do I need an account to use the Habit Tracker?",
    answer:
      "You can browse publicly, but creating an account allows you to save habits, track streaks, and sync across devices.",
  },
  {
    id: 7,
    category: "Account",
    question: "Can I edit or delete a habit later?",
    answer:
      "Yes, habits can be edited, paused, or deleted anytime from your dashboard.",
  },
  {
    id: 8,
    category: "Tracking",
    question: "How is progress calculated?",
    answer:
      "Progress is calculated based on completion rate, streak count, and total completed sessions over time.",
  },
  {
    id: 9,
    category: "Tracking",
    question: "Can I track weekly or monthly habits?",
    answer:
      "Yes, you can customize habits to repeat daily, weekly, or on selected days.",
  },
  {
    id: 10,
    category: "Privacy",
    question: "Is my data secure?",
    answer:
      "Yes, all user data is securely stored and protected using modern authentication and encryption practices.",
  },
  {
    id: 11,
    category: "Customization",
    question: "Can I categorize my habits?",
    answer:
      "Yes, you can organize habits into custom categories to keep your dashboard clean and structured.",
  },
  {
    id: 12,
    category: "Analytics",
    question: "Does the Habit Tracker provide insights?",
    answer:
      "Yes, you get visual insights and statistics to understand consistency patterns and improvement areas.",
  },
];

const FAQHeroSection = ({ isHomePage = false }) => {
  const router = useRouter();
  const [openCardId, setOpenCardId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFAQs, setFilteredFAQs] = useState([]);

  const categories = [
    "All",
    "General",
    "Features",
    "Account",
    "Tracking",
    "Privacy",
    "Customization",
    "Analytics",
  ];

  useEffect(() => {
    let result = faqData;

    if (selectedCategory !== "All") {
      result = result.filter((faq) => faq.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
      );
    }

    if (isHomePage) {
      result = result.slice(0, 5);
    }

    setFilteredFAQs(result);
    setOpenCardId(null);
  }, [selectedCategory, searchQuery, isHomePage]);

  const toggleCard = (id) => {
    setOpenCardId(openCardId === id ? null : id);
  };

  const subtext = `<p>
    Find answers to the most common questions about our Habit Tracker and how it helps you stay consistent.
  </p>`;

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema(faqData)),
          }}
        />
      </Head>

      <section
        className={`relative mx-auto w-[96%] md:w-[84%] xl:w-[75%] ${
          isHomePage ? "py-10 md:py-[12vh]" : "py-12 md:py-[18vh]"
        }`}
      >
        <div className="absolute inset-0 -z-10  opacity-90" />
        <div className="absolute -top-6 right-10 -z-10 h-28 w-28 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute -bottom-6 left-10 -z-10 h-28 w-28 rounded-full bg-orange-200/40 blur-3xl" />

        <div className="flex flex-col items-center gap-4 px-4 text-center md:px-10">
          <Heading title="Frequently Asked Questions" />
          <Subtext subtext={subtext} />
        </div>

        {!isHomePage && (
          <div className="mt-8 flex justify-center px-4">
            <div className="flex w-full max-w-3xl items-center rounded-full border border-white/60 bg-white/80 px-6 py-3 shadow-[0_12px_35px_-25px_rgba(15,23,42,0.35)] backdrop-blur-lg">
              <Search className="mr-2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search FAQs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-[14px] text-slate-700 outline-none"
              />
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-col gap-6 px-4 md:px-8">
          {filteredFAQs.map((faq) => (
            <FAQCard
              key={faq.id}
              content={faq}
              isOpen={openCardId === faq.id}
              onClick={() => toggleCard(faq.id)}
            />
          ))}
        </div>

        {isHomePage && (
          <div className="mt-10 text-center">
            <button
              onClick={() => router.push("/FAQ")}
              className="cursor-pointer rounded-full border border-rose-200 bg-white/80 px-6 py-2 text-[14px] font-semibold text-rose-600 shadow-sm transition hover:bg-rose-50"
            >
              View more
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default FAQHeroSection;
