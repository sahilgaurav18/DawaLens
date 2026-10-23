"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageProvider, useLanguage } from "@/lib/language-context";
import { DashboardProvider, useDashboard } from "@/lib/dashboard-store";
import {
  LayoutDashboard,
  Scan,
  Pill,
  FileCheck2,
  BookOpen,
  ShieldAlert,
  Settings,
  HelpCircle,
  Bell,
  Menu,
  X,
  Volume2,
  VolumeX,
  LogOut,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  User,
} from "lucide-react";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const { notifications, markNotificationRead, clearAllNotifications, isSpeaking, stopSpeaking } = useDashboard();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navigationItems = [
    {
      name: language === "hi" ? "डैशबोर्ड होम" : "Dashboard Home",
      href: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: language === "hi" ? "दवा स्कैन करें" : "Scan Medicines",
      href: "/dashboard/scan",
      icon: Scan,
      badge: "Core",
    },
    {
      name: language === "hi" ? "मेरी दवाएं" : "My Medicines",
      href: "/dashboard/medicines",
      icon: Pill,
    },
    {
      name: language === "hi" ? "सुरक्षा रिपोर्ट" : "Safety Reports",
      href: "/dashboard/reports",
      icon: FileCheck2,
    },
    {
      name: language === "hi" ? "सुरक्षा गाइड" : "Safety Guide",
      href: "/dashboard/guide",
      icon: BookOpen,
    },
    {
      name: language === "hi" ? "रेफरेंस डेटा व नियम" : "Admin & Reference Rules",
      href: "/dashboard/admin",
      icon: ShieldAlert,
    },
    {
      name: language === "hi" ? "सेटिंग्स व गोपनीयता" : "Settings & Privacy",
      href: "/dashboard/settings",
      icon: Settings,
    },
    {
      name: language === "hi" ? "सहायता व नियम" : "Help & Support",
      href: "/dashboard/help",
      icon: HelpCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Critical Safety Banner */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-[11px] font-mono flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 max-w-4xl truncate">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">
            {language === "hi"
              ? "महत्वपूर्ण: दवा लेंस केवल समर्थित जोखिमों की जांच करता है। परिणाम मिलने का अर्थ यह नहीं है कि दवाएं 100% सुरक्षित हैं।"
              : "Safety Protocol: DawaLens checks only supported interaction and duplicate rules. A completed check does not guarantee complete medication safety. Always consult your doctor."}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 shrink-0 text-slate-400">
          <span>Engine: CDSCO / WHO v2.4</span>
          <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
            <span>Public Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0">
          {/* Logo Brand Header */}
          <div className="h-16 px-6 flex items-center border-b border-slate-200 gap-3">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <img src="/logo-mark.png" alt="DawaLens Logo" className="h-8 w-auto object-contain" />
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Dawa<span className="font-normal text-slate-700">Lens</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-800 bg-cyan-100 px-1.5 py-0.2 rounded ml-1.5 font-semibold">
                  Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-800 font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User & Clinical Support Box */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/70">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">Patient Account</p>
                <p className="text-[10px] text-slate-500 font-mono truncate">Local Secure Session</p>
              </div>
            </div>
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center justify-between pt-2 border-t border-slate-200"
            >
              <span>Return to Landing Page</span>
              <LogOut className="w-3.5 h-3.5" />
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto min-w-0">
          {/* Top Navbar */}
          <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-slate-100 text-slate-600"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-base font-bold text-slate-900 capitalize hidden sm:block">
                {pathname === "/dashboard"
                  ? (language === "hi" ? "डैशबोर्ड होम" : "Dashboard Home")
                  : pathname.split("/")[2]?.replace("-", " ") || "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Web Speech Audio Status Control */}
              {isSpeaking && (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold animate-pulse cursor-pointer border border-rose-300"
                  title="Stop audio narration"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop Voice</span>
                </button>
              )}

              {/* Language Switcher */}
              <div className="flex items-center border border-slate-200 rounded-lg p-0.5 text-xs font-medium bg-slate-50">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    language === "en" ? "bg-white text-slate-900 font-bold shadow-xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    language === "hi" ? "bg-white text-slate-900 font-bold shadow-xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  हिंदी
                </button>
              </div>

              {/* Notifications Dropdown Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 relative cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Drawer */}
                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white shadow-xl z-50 p-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        Notifications ({unreadCount} New)
                      </span>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={clearAllNotifications}
                          className="text-[11px] text-cyan-700 hover:underline font-semibold"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="space-y-2.5 max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-500 py-4 text-center">No notifications</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-3 rounded-lg border text-xs transition-colors cursor-pointer ${
                              n.read ? "bg-white border-slate-100 opacity-70" : "bg-cyan-50/50 border-cyan-200"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-900">{n.title}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed mb-2">{n.message}</p>
                            <Link
                              href={n.targetUrl}
                              onClick={() => setIsNotifOpen(false)}
                              className="text-[11px] font-semibold text-cyan-800 hover:underline inline-flex items-center gap-1"
                            >
                              <span>Inspect Record</span>
                              <ChevronRight className="w-3 h-3" />
                            </Link>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Scan CTA */}
              <Link
                href="/dashboard/scan"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Scan className="w-3.5 h-3.5" />
                <span>{language === "hi" ? "स्कैन शुरू करें" : "New Scan"}</span>
              </Link>
            </div>
          </header>

          {/* Child Page Content */}
          <main className="flex-1 p-6 lg:p-8 max-w-[1300px] w-full mx-auto">{children}</main>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex">
          <div className="w-72 bg-white h-full flex flex-col p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <img src="/logo-mark.png" alt="DawaLens Logo" className="h-7 w-auto object-contain" />
                <span className="font-bold text-lg text-slate-900">DawaLens</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(false)}
                className="p-1 rounded-md text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileNavOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${
                      isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-200">
              <Link
                href="/"
                onClick={() => setIsMobileNavOpen(false)}
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center justify-between"
              >
                <span>Landing Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <DashboardProvider>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </DashboardProvider>
    </LanguageProvider>
  );
}
