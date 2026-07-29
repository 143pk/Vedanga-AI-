import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LandingPage } from "./components/LandingPage";
import { OtpAuth } from "./components/OtpAuth";
import { Header } from "./components/Header";
import { BottomBarNav } from "./components/BottomBarNav";
import { GuruChat } from "./components/GuruChat";
import { KundliView } from "./components/KundliView";
import { HoroscopeView } from "./components/HoroscopeView";
import { LearningView } from "./components/LearningView";
import { ProfileModal } from "./components/ProfileModal";
import { ActiveTab, UserProfile } from "./types";

export default function App() {
  const [viewState, setViewState] = useState<"landing" | "auth" | "app">("landing");
  const [activeTab, setActiveTab] = useState<ActiveTab>("chat");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Load saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("vedanga_user") || localStorage.getItem("astroguru_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.email) {
          setUser(parsed);
          setViewState("app");
        }
      } catch (err) {
        console.error("Failed to parse saved user", err);
      }
    }
  }, []);

  const handleLoginComplete = (newUser: UserProfile) => {
    setUser(newUser);
    localStorage.setItem("vedanga_user", JSON.stringify(newUser));
    setViewState("app");
  };

  const handleLogout = () => {
    if (user?.email) {
      localStorage.removeItem(`vedanga_sub_${user.email}`);
      fetch("/api/payment/reset-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      }).catch(() => {});
    }
    localStorage.removeItem("vedanga_user");
    localStorage.removeItem("astroguru_user");
    localStorage.clear();
    setUser(null);
    setViewState("landing");
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem("vedanga_user", JSON.stringify(updatedUser));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <AnimatePresence mode="wait">
        {/* 1. Landing Page */}
        {viewState === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <LandingPage onStart={() => setViewState("auth")} />
          </motion.div>
        )}

        {/* 2. OTP Based Email Login & Onboarding */}
        {viewState === "auth" && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <OtpAuth
              onLoginComplete={handleLoginComplete}
              onBackToLanding={() => setViewState("landing")}
            />
          </motion.div>
        )}

        {/* 3. Main App View */}
        {viewState === "app" && user && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen flex flex-col bg-slate-950"
          >
            <Header
              user={user}
              onOpenProfile={() => setIsProfileOpen(true)}
              onLogout={handleLogout}
            />

            <main className="flex-1 pb-16 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full"
                >
                  {activeTab === "chat" && <GuruChat user={user} onUpdateUser={handleUpdateUser} />}
                  {activeTab === "kundli" && <KundliView user={user} />}
                  {activeTab === "horoscope" && <HoroscopeView user={user} />}
                  {activeTab === "learning" && <LearningView user={user} />}
                </motion.div>
              </AnimatePresence>
            </main>

            <BottomBarNav
              activeTab={activeTab}
              onSelectTab={(tab) => setActiveTab(tab)}
            />

            <ProfileModal
              user={user}
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
              onUpdateUser={handleUpdateUser}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
