import Link from "next/link";
import {
  Building2,
  Calendar,
  QrCode,
  ArrowRight,
  Zap,
  Search,
  BellRing,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { useTheme } from "@/lib/themeContext";
import StatusBadge from "@/components/StatusBadge";

const FEATURES = [
  {
    icon: Search,
    label: "Browse & filter",
    desc: "Search rooms, courts, and equipment by type, name, or availability in seconds.",
  },
  {
    icon: Clock,
    label: "Smart scheduling",
    desc: "Hourly slots with automatic double-booking and capacity checks — no clashes.",
  },
  {
    icon: QrCode,
    label: "QR check-in",
    desc: "Every booking gets a unique QR code — scan it at the QR scanner on arrival to check in.",
  },
  {
    icon: BellRing,
    label: "Live notifications",
    desc: "Get notified on bookings, check-ins, cancellations, and campus announcements.",
  },
];

const STEPS = [
  {
    step: "1",
    icon: Building2,
    label: "Find a facility",
    desc: "Browse available rooms, courts, and equipment by type or search by name.",
  },
  {
    step: "2",
    icon: Calendar,
    label: "Pick a slot",
    desc: "Choose your date and hourly time slot. Conflicts are blocked automatically.",
  },
  {
    step: "3",
    icon: QrCode,
    label: "Check in",
    desc: "Show your QR code to the scanner within 15 minutes of your slot start time to check in.",
  },
];

export default function HomePage() {
  const { dark } = useTheme();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero — two-column on large screens */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: dark ? "#0f172a" : "#f0fdf4" }}
        />
        {/* Flat decorative shapes — no blur/gradient, just layered geometry */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary-100/60 dark:bg-primary-900/30 pointer-events-none" />
        <div className="absolute top-1/2 -left-16 w-44 h-44 rounded-3xl bg-primary-100/50 dark:bg-primary-900/25 rotate-12 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-24 h-24 rounded-2xl bg-amber-100/60 dark:bg-amber-900/20 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left: copy */}
            <div className="text-center lg:text-left">
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border ${
                  dark
                    ? "bg-primary-900/40 text-primary-300 border-primary-700"
                    : "bg-primary-100 text-primary-800 border-transparent"
                }`}
              >
                <Zap size={14} className={dark ? "text-primary-400" : "text-primary-600"} />
                Smart Campus Facility Booking
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6"
                style={{ color: dark ? "#e2e8f0" : "#0f172a" }}
              >
                Book campus facilities{" "}
                <span className="inline-block relative group cursor-default">
                  <span className="text-primary-500 transition duration-300 group-hover:text-primary-400">
                    effortlessly
                  </span>
                  <span className="absolute -bottom-1.5 left-0 h-1 w-0 group-hover:w-full bg-primary-300 rounded-full transition-all duration-300 delay-75" />
                  <span className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-primary-500 rounded-full transition-all duration-300" />
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-500 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Reserve rooms, courts, and equipment in seconds. Scan your QR
                code at the QR scanner to check in, manage your bookings, and
                stay updated — all in one place.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-8 py-3.5 bg-primary-600 text-white rounded-xl font-semibold text-base hover:bg-primary-700 transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Get Started <ArrowRight size={18} />
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-8 py-3.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold text-base hover:border-primary-400 dark:hover:border-primary-500 hover:text-primary-700 dark:hover:text-primary-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  Create Account
                </Link>
              </div>
            </div>

            {/* Right: visual preview card (decorative — mirrors a real booking card) */}
            <div className="hidden lg:flex justify-center">
              <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 shadow-md p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
                      <Building2 size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Discussion Room C</p>
                      <p className="text-xs text-gray-400">Room · up to 8 people</p>
                    </div>
                  </div>
                  <StatusBadge status="booked" />
                </div>
                <div className="space-y-2 mb-4 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-gray-400" />
                    <span>Today · 14:00 – 15:00</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={13} className="text-gray-400" />
                    <span>Check-in window: 14:00 – 14:15</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 py-2.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-semibold">
                  <QrCode size={14} /> Scan QR to check in
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
              Everything you need to book on campus
            </h2>
            <p className="text-gray-500">
              One system for students and admins — facilities, bookings, check-ins, and notifications.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-primary-200 dark:hover:border-primary-700 transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5">{label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-primary-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map(({ step, icon: Icon, label, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary-600 flex items-center justify-center">
                    <Icon size={24} className="text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 rounded-full text-xs font-bold text-white flex items-center justify-center">
                    {step}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
              <Building2 size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900">
              Flexi<span className="text-primary-600">Book</span>
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Smart Campus Facility Booking System — built for students and staff.
          </p>
        </div>
      </footer>
    </div>
  );
}
