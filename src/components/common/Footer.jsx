import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { useRouter } from "next/router";

const Footer = () => {
  const router = useRouter();

  const footerLinks = [
    { label: "FAQ", route: "/faq" },
    { label: "DASHBOARD", route: "/dashboard" },
    { label: "LOGIN", route: "/login" },
  ];

  return (
    <footer className="w-full bg-white dark:bg-slate-950">
      <div className="mx-auto flex w-[95%] flex-col justify-between gap-10 px-4 py-14 md:w-[85%] lg:w-[75%]">
        {/* Top Section */}
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          {/* Logo */}
          <div
            className="relative h-[50px] w-[160px] cursor-pointer md:h-[65px] md:w-[220px]"
            onClick={() => router.push("/")}
          >
            <img
              src="/images/logo.svg"
              alt="Habit Tracker Logo"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Contact + Social */}
          <div className="flex flex-col gap-6">
            {/* Email */}
            <div className="flex items-center gap-2 text-[14px] text-slate-700 dark:text-slate-200">
              <IoIosMail className="text-[18px] text-rose-500" />
              <span>sahilbisht380@gmail.com</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-6">
              <p className="text-[14px] text-slate-400">Social</p>
              <div className="flex gap-4 text-[18px] text-rose-500">
                <FaLinkedinIn
                  className="cursor-pointer transition-transform duration-300 hover:scale-110"
                  onClick={() =>
                    window.open(
                      "https://www.linkedin.com/in/sahil-bisht-234b92226",
                      "_blank"
                    )
                  }
                />
                <FaGithub
                  className="cursor-pointer transition-transform duration-300 hover:scale-110"
                  onClick={() =>
                    window.open("https://github.com/sahilbisht890", "_blank")
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-rose-100 pt-6 dark:border-slate-800 lg:flex-row">
          {/* Links */}
          <div className="flex gap-6 text-[14px] text-slate-700 dark:text-slate-200">
            {footerLinks.map((link, index) => (
              <div
                key={index}
                onClick={() => router.push(link.route)}
                className="cursor-pointer transition-all hover:text-rose-500"
              >
                {link.label}
              </div>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-[14px] text-slate-400">
            © 2026 Habit Tracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
};

export default Footer;
