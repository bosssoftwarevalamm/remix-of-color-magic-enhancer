import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bot,
  Eye,
  EyeOff,
  Facebook,
  Globe,
  Instagram,
  Languages,
  LockKeyhole,
  Mail,
  MessageCircle,
  Power,
  X,
  Youtube,
} from "lucide-react";
import logoAsset from "../assets/software-vala-logo.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign In | Software Vala" },
      {
        name: "description",
        content:
          "Sign in to your Software Vala account to access the software ecosystem.",
      },
      { property: "og:title", content: "Sign In | Software Vala" },
      {
        property: "og:description",
        content:
          "Sign in to your Software Vala account to access the software ecosystem.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SoftwareValaLogin,
});

const STARS = [
  { top: "8%", left: "12%", size: 2, dur: "3.6s", delay: "0s" },
  { top: "15%", left: "78%", size: 2, dur: "4.4s", delay: "0.8s" },
  { top: "22%", left: "45%", size: 1.5, dur: "5s", delay: "1.4s" },
  { top: "6%", left: "58%", size: 2.5, dur: "3.2s", delay: "0.4s" },
  { top: "30%", left: "8%", size: 1.5, dur: "4.8s", delay: "2s" },
  { top: "12%", left: "92%", size: 1.5, dur: "3.9s", delay: "1s" },
  { top: "38%", left: "88%", size: 2, dur: "5.4s", delay: "0.2s" },
  { top: "26%", left: "30%", size: 1, dur: "4.1s", delay: "1.8s" },
  { top: "48%", left: "5%", size: 1.5, dur: "4.6s", delay: "0.6s" },
  { top: "42%", left: "96%", size: 2, dur: "3.4s", delay: "1.2s" },
  { top: "60%", left: "14%", size: 1, dur: "5.2s", delay: "2.4s" },
  { top: "55%", left: "82%", size: 1.5, dur: "4s", delay: "0.9s" },
];

const DUST = [
  { left: "38%", bottom: "26%", size: 3, dur: "8s", delay: "0s" },
  { left: "46%", bottom: "30%", size: 2, dur: "10s", delay: "1.6s" },
  { left: "54%", bottom: "28%", size: 2.5, dur: "9s", delay: "3s" },
  { left: "60%", bottom: "32%", size: 2, dur: "11s", delay: "0.8s" },
  { left: "42%", bottom: "36%", size: 2, dur: "9.5s", delay: "4.2s" },
  { left: "58%", bottom: "24%", size: 3, dur: "8.6s", delay: "2.4s" },
];

const LANGUAGES = ["English", "हिन्दी", "বাংলা", "मराठी", "தமிழ்", "తెలుగు"];

const WHATSAPP_URL = "https://wa.me/918348838383";

const SOCIAL_LINKS = [
  { label: "WhatsApp", href: WHATSAPP_URL, Icon: MessageCircle },
  { label: "Facebook", href: "https://facebook.com/share/1HpGSvExis", Icon: Facebook },
  { label: "Instagram", href: "https://instagram.com/new_software_vala", Icon: Instagram },
  { label: "YouTube", href: "https://youtube.com/@softwarevala", Icon: Youtube },
  { label: "Email", href: "mailto:hellosoftwarevala@gmail.com", Icon: Mail },
];

const WEBSITE_LINKS = [
  { label: "Online Software", href: "https://softwarevala.net" },
  { label: "Offline Software", href: "https://erpvala.com" },
];

function SoftwareValaLogin() {
  const [lampOn, setLampOn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState("English");
  const [langOpen, setLangOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!langOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [langOpen]);

  return (
    <main
      className={`relative min-h-screen overflow-hidden transition-all duration-700 ${
        lampOn ? "bg-[#07101f]" : "bg-[#02050b]"
      }`}
    >
      {/* Cinematic film grain */}
      <div className="sv-grain z-30" />

      {/* Language selector */}
      <div ref={langRef} className="fixed top-4 right-4 sm:top-6 sm:right-6 z-40">
        <button
          type="button"
          onClick={() => setLangOpen((value) => !value)}
          className="flex items-center gap-2 h-10 px-3 sm:px-4 rounded-full border border-white/10 bg-[#0b1424]/80 backdrop-blur-xl text-white/70 hover:text-white hover:border-white/25 transition-all text-xs sm:text-sm shadow-xl"
          aria-label="Select language"
          aria-expanded={langOpen}
        >
          <Languages size={15} />
          <span>{language}</span>
        </button>
        {langOpen && (
          <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-white/10 bg-[#0b1424]/95 backdrop-blur-xl shadow-2xl overflow-hidden py-1.5">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => {
                  setLanguage(lang);
                  setLangOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs sm:text-sm transition-colors ${
                  language === lang
                    ? "text-white bg-white/[0.07]"
                    : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, transparent 55%, rgba(2,5,11,.55) 100%)",
        }}
      />

      {/* Starfield */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {STARS.map((star, index) => (
          <span
            key={index}
            className="sv-twinkle absolute rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              boxShadow: "0 0 6px 1px rgba(255,255,255,.45)",
              ["--tw-dur" as string]: star.dur,
              ["--tw-delay" as string]: star.delay,
            }}
          />
        ))}
      </div>

      {/* Ambient aurora glow (drifting) */}
      <div
        className={`sv-aurora absolute inset-0 transition-all duration-700 pointer-events-none ${
          lampOn ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(circle at 28% 38%, rgba(255,190,90,.18), transparent 28%), radial-gradient(circle at 70% 50%, rgba(30,100,255,.10), transparent 35%), radial-gradient(circle at 50% 110%, rgba(227,27,35,.06), transparent 45%)",
        }}
      />

      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* LAMP */}
          <div className="order-1 lg:order-1 relative flex items-center justify-center min-h-[340px] sm:min-h-[420px] lg:min-h-[520px]">
            {/* Floor glow */}
            <div
              className={`absolute bottom-10 sm:bottom-16 w-48 sm:w-72 h-16 sm:h-24 rounded-full blur-3xl transition-all duration-700 ${
                lampOn ? "bg-amber-300/20" : "bg-transparent"
              }`}
            />

            {/* Wide ambient halo behind lamp */}
            <div
              className={`sv-halo absolute top-1/3 left-1/2 w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] rounded-full transition-opacity duration-700 pointer-events-none ${
                lampOn ? "" : "!opacity-0"
              }`}
              style={{
                background:
                  "radial-gradient(circle, rgba(255,205,110,.14), rgba(255,180,60,.05) 45%, transparent 70%)",
                filter: "blur(24px)",
              }}
            />

            {/* Rising dust particles in the light */}
            {lampOn && (
              <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
              >
                {DUST.map((mote, index) => (
                  <span
                    key={index}
                    className="sv-dust absolute rounded-full bg-amber-100/70"
                    style={{
                      left: mote.left,
                      bottom: mote.bottom,
                      width: mote.size,
                      height: mote.size,
                      boxShadow: "0 0 5px 1px rgba(255,220,150,.5)",
                      ["--dust-dur" as string]: mote.dur,
                      ["--dust-delay" as string]: mote.delay,
                    }}
                  />
                ))}
              </div>
            )}

            <div className="relative w-[220px] h-[340px] sm:w-[300px] sm:h-[470px]">
              {/* Light cone */}
              <div
                className={`absolute top-12 sm:top-20 left-1/2 -translate-x-1/2 w-[180px] h-[220px] sm:w-[260px] sm:h-[310px] transition-all duration-700 ${
                  lampOn ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  background:
                    "radial-gradient(ellipse at top, rgba(255,211,130,.34), rgba(255,180,60,.08) 42%, transparent 72%)",
                  filter: "blur(8px)",
                }}
              />

              {/* Inner bright core of the cone */}
              <div
                className={`${lampOn ? "sv-flame " : ""}absolute top-20 sm:top-28 left-1/2 -translate-x-1/2 w-[90px] h-[150px] sm:w-[130px] sm:h-[210px] transition-all duration-700 pointer-events-none ${
                  lampOn ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  background:
                    "radial-gradient(ellipse at top, rgba(255,232,170,.30), rgba(255,200,90,.10) 50%, transparent 78%)",
                  filter: "blur(10px)",
                }}
              />

              {/* Bulb — recessed INSIDE the shade, only its glowing rim peeks out */}
              <div
                className={`absolute top-[98px] sm:top-[134px] left-1/2 -translate-x-1/2 w-8 sm:w-11 h-8 sm:h-11 rounded-full transition-all duration-500 ${
                  lampOn
                    ? "bg-[#fff0bd] shadow-[0_0_35px_15px_rgba(255,205,110,.55)]"
                    : "bg-[#303743]"
                }`}
              >
                {/* Bulb hot core */}
                <div
                  className={`${lampOn ? "sv-flame " : ""}absolute inset-[22%] rounded-full transition-opacity duration-500 ${
                    lampOn ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    background:
                      "radial-gradient(circle, #ffffff, rgba(255,244,200,.9) 60%, transparent)",
                  }}
                />
                {/* Glass specular highlight */}
                <div
                  className={`absolute top-[16%] left-[24%] w-[24%] h-[16%] rounded-full bg-white blur-[1px] transition-opacity duration-500 ${
                    lampOn ? "opacity-80" : "opacity-15"
                  }`}
                />
              </div>

              {/* Lampshade — painted OVER the bulb so it reads as sitting inside, like a real lamp */}
              <div
                className={`absolute top-10 sm:top-14 left-1/2 -translate-x-1/2 w-36 sm:w-52 h-20 sm:h-28 transition-all duration-500 ${
                  lampOn ? "drop-shadow-[0_0_35px_rgba(255,196,90,.5)]" : ""
                }`}
              >
                <div
                  className={`absolute inset-0 transition-all duration-500 ${
                    lampOn ? "bg-[#d9a858]" : "bg-[#222a36]"
                  }`}
                  style={{
                    clipPath: "polygon(20% 0, 80% 0, 100% 100%, 0 100%)",
                  }}
                />
                {/* Inner shade walls lit by the bulb inside */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    lampOn ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    clipPath: "polygon(20% 0, 80% 0, 100% 100%, 0 100%)",
                    background:
                      "linear-gradient(to top, rgba(255,226,165,.6) 0%, rgba(255,205,110,.22) 40%, transparent 68%)",
                  }}
                />
                {/* Shade sheen */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    lampOn ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    clipPath: "polygon(20% 0, 80% 0, 100% 100%, 0 100%)",
                    background:
                      "linear-gradient(115deg, rgba(255,255,255,.35) 0%, transparent 32%, transparent 68%, rgba(0,0,0,.22) 100%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 h-2 sm:h-3 bg-black/30" />
                {/* Glowing shade mouth — the lit opening under the shade */}
                <div
                  className={`absolute -bottom-1.5 sm:-bottom-2 left-1/2 -translate-x-1/2 w-[72%] h-3.5 sm:h-5 rounded-[50%] transition-opacity duration-500 ${
                    lampOn ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    background:
                      "radial-gradient(ellipse at center, #fff6d8 0%, rgba(255,216,135,.9) 45%, rgba(255,180,60,.3) 75%, transparent 100%)",
                    filter: "blur(1.5px)",
                  }}
                />
                {/* Hot filament center seen through the opening */}
                <div
                  className={`${lampOn ? "sv-flame " : ""}absolute -bottom-0.5 sm:-bottom-1 left-1/2 -translate-x-1/2 w-[34%] h-2 sm:h-2.5 rounded-[50%] transition-opacity duration-500 ${
                    lampOn ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    background:
                      "radial-gradient(ellipse at center, #ffffff, rgba(255,240,190,.9) 60%, transparent)",
                    filter: "blur(1px)",
                  }}
                />
              </div>

              {/* Stand */}
              <div className="absolute top-[135px] sm:top-[175px] left-1/2 -translate-x-1/2 w-3 sm:w-4 h-44 sm:h-64 rounded-full bg-gradient-to-r from-[#161c25] via-[#707985] to-[#11161d]">
                {/* Stand highlight catching lamp light */}
                <div
                  className={`absolute inset-y-0 left-[30%] w-[2px] rounded-full transition-opacity duration-700 ${
                    lampOn ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(255,215,140,.6), transparent 65%)",
                  }}
                />
              </div>

              {/* Base */}
              <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 w-36 sm:w-48 h-5 sm:h-7 rounded-[50%] bg-gradient-to-b from-[#7c858e] via-[#272e38] to-[#080b10] shadow-2xl">
                <div
                  className={`absolute inset-x-6 top-0 h-[3px] rounded-full transition-opacity duration-700 ${
                    lampOn ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,220,150,.5), transparent)",
                  }}
                />
              </div>

              {/* Switch */}
              <button
                type="button"
                onClick={() => setLampOn((value) => !value)}
                aria-label={lampOn ? "Turn lamp off" : "Turn lamp on"}
                className={`absolute right-2 sm:right-5 top-44 sm:top-64 w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/10 bg-[#111822] text-white/80 hover:text-white hover:scale-110 transition-all duration-300 shadow-xl ${
                  lampOn
                    ? "shadow-[0_0_18px_rgba(255,205,110,.25)] border-amber-200/20"
                    : ""
                }`}
              >
                <Power size={16} className="mx-auto sm:hidden" />
                <Power size={18} className="mx-auto hidden sm:block" />
              </button>
            </div>

            <div className="absolute bottom-0 sm:bottom-2 text-center">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-white/30">
                Software Vala
              </p>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-white/40">
                {lampOn ? "Light is on" : "Turn on the light"}
              </p>
            </div>
          </div>

          {/* LOGIN */}
          <div
            className={`order-2 lg:order-2 w-full max-w-md mx-auto transition-all duration-700 ${
              lampOn
                ? "opacity-100 translate-y-0"
                : "opacity-70 translate-y-1"
            }`}
          >
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-3 mb-5 sm:mb-7">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shadow-lg ring-2 ring-white/10">
                  <img
                    src={logoAsset.url}
                    alt="Software Vala logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-white font-bold text-base sm:text-lg">
                    Software Vala
                  </div>
                  <div className="text-white/35 text-[10px] sm:text-xs">
                    The Name of Trust
                  </div>
                </div>
              </div>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white"
                style={{
                  textShadow: lampOn
                    ? "0 0 40px rgba(255,205,110,.15)"
                    : "none",
                }}
              >
                Welcome back.
              </h1>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-white/45">
                Sign in to continue to your Software Vala account.
              </p>
            </div>

            {/* Glass panel around the form */}
            <div
              className="relative rounded-3xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-7 backdrop-blur-xl transition-all duration-700"
              style={{
                boxShadow: lampOn
                  ? "0 24px 60px -20px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.06), 0 0 60px -30px rgba(255,190,90,.12)"
                  : "0 24px 60px -20px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.06)",
              }}
            >
              {/* Top edge light line */}
              <div
                className="pointer-events-none absolute top-0 left-8 right-8 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent)",
                }}
              />

              <form
                className="space-y-4 sm:space-y-5"
                onSubmit={(e) => e.preventDefault()}
              >
                <div>
                  <label className="block mb-1.5 sm:mb-2 text-xs sm:text-sm text-white/60">
                    Email or username
                  </label>
                  <div className="group relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors group-focus-within:text-amber-200/70"
                    />
                    <input
                      type="text"
                      placeholder="Enter your email"
                      className="w-full h-12 sm:h-14 rounded-2xl border border-white/10 bg-white/[0.045] pl-12 pr-4 text-sm sm:text-base text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-amber-200/30 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(255,205,110,.06),0_0_24px_-6px_rgba(255,190,90,.25)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 sm:mb-2 text-xs sm:text-sm text-white/60">
                    Password
                  </label>
                  <div className="group relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors group-focus-within:text-amber-200/70"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full h-12 sm:h-14 rounded-2xl border border-white/10 bg-white/[0.045] pl-12 pr-12 text-sm sm:text-base text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-amber-200/30 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(255,205,110,.06),0_0_24px_-6px_rgba(255,190,90,.25)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-sm">
                  <label className="flex items-center gap-2 text-white/45 cursor-pointer">
                    <input type="checkbox" className="accent-red-500 w-4 h-4" />
                    Remember me
                  </label>
                  <button
                    type="button"
                    className="text-white/60 hover:text-white transition text-left sm:text-right"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="relative overflow-hidden w-full h-12 sm:h-14 rounded-2xl bg-[#e31b23] hover:bg-[#f1262f] active:scale-[.98] text-white font-semibold text-sm sm:text-base shadow-[0_12px_35px_rgba(227,27,35,.22)] hover:shadow-[0_16px_45px_rgba(227,27,35,.35)] transition-all duration-300"
                >
                  <div className="sv-shine" />
                  <span className="relative">Sign In</span>
                </button>
              </form>
            </div>

            <p className="mt-5 sm:mt-7 text-center text-xs sm:text-sm text-white/35">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-white hover:text-red-400 transition"
              >
                Create account
              </button>
            </p>

            {/* Contact & social links */}
            <div className="mt-6 sm:mt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-white/[0.07]" />
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-white/30">
                  Connect with us
                </span>
                <div className="h-px flex-1 bg-white/[0.07]" />
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-3">
                {WEBSITE_LINKS.map((site) => (
                  <a
                    key={site.href}
                    href={site.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 h-10 sm:h-11 rounded-xl border border-white/10 bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all text-xs sm:text-sm"
                  >
                    <Globe size={14} />
                    {site.label}
                  </a>
                ))}
              </div>

              <div className="flex justify-center gap-2 sm:gap-2.5">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-white/10 bg-white/[0.04] text-white/50 hover:text-white hover:bg-white/[0.09] hover:border-white/25 hover:-translate-y-0.5 transition-all flex items-center justify-center"
                  >
                    <Icon size={17} />
                  </a>
                ))}
              </div>

              <p className="mt-4 text-center text-[10px] sm:text-xs text-white/30">
                The Name of Trust · No Advance Payment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chat with us widget */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3">
        {chatOpen && (
          <div className="w-[260px] sm:w-[300px] rounded-2xl border border-white/10 bg-[#0b1424]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
              <div className="flex items-center gap-2">
                <img
                  src={logoAsset.url}
                  alt="Software Vala"
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div>
                  <div className="text-white text-sm font-semibold leading-tight">
                    Chat with us
                  </div>
                  <div className="text-white/35 text-[10px]">
                    The Name of Trust
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setChatOpen(false);
                  setAiPanelOpen(false);
                }}
                aria-label="Close chat"
                className="text-white/40 hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>

            {aiPanelOpen ? (
              <div className="p-4">
                <div className="rounded-xl bg-white/[0.05] border border-white/[0.07] p-3 text-xs sm:text-sm text-white/70 leading-relaxed">
                  ✨ Welcome to{" "}
                  <span className="text-white font-semibold">
                    SOFTWARE VALA™
                  </span>
                  ! Our AI agent is launching soon. Till then, our team
                  replies instantly on WhatsApp.
                </div>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 h-10 rounded-xl bg-[#e31b23] hover:bg-[#f1262f] text-white text-xs sm:text-sm font-semibold transition-all"
                >
                  <MessageCircle size={15} />
                  Chat on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => setAiPanelOpen(false)}
                  className="mt-2 w-full text-center text-[11px] text-white/40 hover:text-white transition"
                >
                  Back to options
                </button>
              </div>
            ) : (
              <div className="p-2">
                <button
                  type="button"
                  onClick={() => setAiPanelOpen(true)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors text-left"
                >
                  <span className="w-9 h-9 rounded-xl bg-[#e31b23]/15 text-[#ff6b72] flex items-center justify-center shrink-0">
                    <Bot size={17} />
                  </span>
                  <span>
                    <span className="block text-white text-xs sm:text-sm font-medium">
                      AI Agent
                    </span>
                    <span className="block text-white/35 text-[10px] sm:text-xs">
                      Instant automated help
                    </span>
                  </span>
                </button>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors"
                >
                  <span className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                    <MessageCircle size={17} />
                  </span>
                  <span>
                    <span className="block text-white text-xs sm:text-sm font-medium">
                      WhatsApp
                    </span>
                    <span className="block text-white/35 text-[10px] sm:text-xs">
                      +91 83488 38383
                    </span>
                  </span>
                </a>
                <a
                  href="mailto:hellosoftwarevala@gmail.com"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors"
                >
                  <span className="w-9 h-9 rounded-xl bg-amber-400/15 text-amber-300 flex items-center justify-center shrink-0">
                    <Mail size={17} />
                  </span>
                  <span>
                    <span className="block text-white text-xs sm:text-sm font-medium">
                      Email Support
                    </span>
                    <span className="block text-white/35 text-[10px] sm:text-xs break-all">
                      hellosoftwarevala@gmail.com
                    </span>
                  </span>
                </a>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setChatOpen((value) => !value);
            setAiPanelOpen(false);
          }}
          aria-label={chatOpen ? "Close chat" : "Chat with us"}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#e31b23] hover:bg-[#f1262f] text-white shadow-[0_12px_35px_rgba(227,27,35,.35)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
        >
          {chatOpen ? <X size={20} /> : <MessageCircle size={22} />}
        </button>
      </div>
    </main>
  );
}
