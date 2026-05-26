"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function MentorPromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const pathname = usePathname();

  const allowedPaths = [
    "/", // Landing page
    "/home",
    "/courses",
    "/explore",
    // Add more user-facing pages here
  ];

  // Check if current path is allowed
  const shouldShowModal =
    allowedPaths.includes(pathname) ||
    pathname.startsWith("/user") ||
    (!pathname.includes("/partner") &&
      !pathname.includes("/admin") &&
      !pathname.includes("/dashboard"));

  useEffect(() => {
    if (!shouldShowModal) return;

    setIsMounted(true);
    const timer = setTimeout(() => setIsOpen(true), 1000);
    return () => clearTimeout(timer);
  }, [shouldShowModal]);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // Fixed: was 1000000 (too slow)
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`; // Prevent layout shift
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isMounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-transparent shadow-2xl">
        {/* Transparent Upper Section - Only Image Visible */}
        <div className="relative h-80 bg-transparent">
          {/* Subtle dark gradient overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-10" />

          {/* Image */}
          <div className="absolute top-5 -right-8 z-20 pointer-events-none">
            <Image
              src="/partner.png"
              alt="Partner Illustration"
              width={450}
              height={450}
              className="drop-shadow-2xl"
              priority
            />
          </div>

          {/* Text Content - Now clearly visible */}
          <div className="relative z-30 pt-10 px-2 text-white">
            <h1 className="text-5xl md:text-5xl font-bold tracking-tighter leading-none mb-4 drop-shadow-2xl">
              Become a<br />
              <span className="text-6xl bg-gradient-to-r from-blue-400 via-red-400 to-blue-400 bg-clip-text text-transparent">
                Partner
              </span>
            </h1>

            <p className="text-xl md:text-2xl font-medium text-white/90 mb-3 drop-shadow-md">
              Shape the future.
              <br />
            </p>

            <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 bg-white/10 backdrop-blur-md border border-white/20 px-5  py-3 rounded-2xl mb-6">
              Share your expertise.
            </div>
          </div>
        </div>

        {/* White Content Area */}
        <div className="relative bg-white rounded-b-3xl pt-1 pb-1 px-6 text-center">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute -top-75 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg text-gray-500 hover:text-gray-900 hover:scale-105 transition-all"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6L18 18"
              />
            </svg>
          </button>

          {/* Top Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 rounded-t-3xl overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / 20) * 100}%` }}
            />
          </div>

          <div className="pt-6">
            <p className="text-gray-600 text-[15px] leading-relaxed">
              Join our platform as a partner and guide the next generation of
              professionals.
              <span className="block mt-2 text-sm font-medium text-gray-500">
                ✨ Earn respect · Expand your network · Create impact
              </span>
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/partner/login"
                onClick={handleClose}
                className="group relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-2 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10">Become a Partner Now →</span>
              </Link>

              <button
                onClick={handleClose}
                className="w-full py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all border border-gray-200"
              >
                Maybe Later · <span className="font-mono">{timeLeft}s</span>
              </button>
            </div>

            <p className="mt-6 text-xs text-gray-400 flex items-center justify-center gap-1.5">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Offer auto-closes in {timeLeft}s
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
