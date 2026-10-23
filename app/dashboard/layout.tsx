"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageProvider } from "@/lib/language-context";
import { DashboardProvider, useDashboard } from "@/lib/dashboard-store";
import {
  LayoutDashboard,
  Camera,
  Database,
  Shuffle,
  FileCheck2,
  Clock,
  Bell,
  ShieldCheck,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Scan Medicines",
      href: "/dashboard/scan",
      icon: Camera,
    },
    {
      name: "Medicine Database",
      href: "/dashboard/medicines",
      icon: Database,
    },
    {
      name: "Interactions Check",
      href: "/dashboard/scan",
      icon: Shuffle,
    },
    {
      name: "Safety Reports",
      href: "/dashboard/reports",
      icon: FileCheck2,
    },
    {
      name: "History",
      href: "/dashboard/reports",
      icon: Clock,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      {/* 1. TOP HEADER BAR */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between z-30 shrink-0">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-md hover:bg-slate-100 text-slate-600 mr-1"
          >
            <Menu size={20} />
          </button>

          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <img
              src="/logo-mark.png"
              alt="DawaLens Logo"
              className="h-8 w-8 object-contain transition-transform group-hover:scale-105"
            />
            <span className="text-xl font-extrabold tracking-tight text-[#0B3558]">
              Dawa<span className="font-medium text-[#0B3558]">Lens</span>
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-2.5 text-xs text-slate-400 pl-3 border-l border-slate-200 ml-2">
            <span className="font-medium text-slate-500">Medication Safety Portal</span>
          </div>
        </div>

        {/* Right: Notifications Bell & User Profile */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
              title="2 Notifications"
            >
              <Bell size={20} />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#F97316] text-[10px] font-bold text-white shadow-xs">
                2
              </span>
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2 font-bold text-slate-900">
                  <span>Notifications</span>
                  <span className="text-[11px] font-normal text-slate-400">2 unread</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-orange-50 border border-orange-100 text-orange-950">
                    <p className="font-semibold text-xs">Potential Interaction Detected</p>
                    <p className="text-[11px] text-orange-800 mt-0.5">Ibuprofen + Aspirin interaction was flagged.</p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-950">
                    <p className="font-semibold text-xs">Scan Completed</p>
                    <p className="text-[11px] text-emerald-800 mt-0.5">Paracetamol 500mg verified against NFI 2024.</p>
                  </div>
                </div>
              </div>
            )}
          </div>


        </div>
      </header>

      {/* 2. BODY: SIDEBAR + MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`fixed md:static inset-y-0 left-0 top-16 md:top-0 z-40 w-60 bg-white border-r border-slate-200 flex flex-col justify-between py-6 px-4 transition-transform duration-200 ease-in-out md:translate-x-0 ${
            isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
        >
          {/* Mobile Drawer Branded Header */}
          <div className="md:hidden flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <img
                src="/logo-mark.png"
                alt="DawaLens Logo"
                className="h-6 w-6 object-contain"
              />
              <span className="font-extrabold text-sm text-[#0B3558]">
                Dawa<span className="font-medium">Lens</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#E0F2FE] text-[#0284C7] shadow-xs font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-[#0284C7]" : "text-slate-500"}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Card: Safe Medicines Banner */}
          <div className="rounded-2xl border border-orange-200/80 bg-[#FFF7ED] p-3.5 text-xs relative overflow-hidden group">
            <div className="flex items-start justify-between mb-2">
              <div className="h-7 w-7 rounded-full bg-[#F97316] text-white flex items-center justify-center shadow-xs">
                <ShieldCheck size={16} />
              </div>
              <ArrowRight size={14} className="text-orange-500 mt-1" />
            </div>

            <p className="font-bold text-slate-900 text-xs leading-tight">
              Safe Medicines.
            </p>
            <p className="font-bold text-slate-900 text-xs leading-tight">
              Healthier You.
            </p>

            <p className="text-[10px] text-slate-500 mt-2 font-medium">
              Check. Understand. Stay Safe.
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
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
