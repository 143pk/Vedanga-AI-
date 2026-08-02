import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LandingPage } from "./components/LandingPage";
import { Header } from "./components/Header";
import { BottomBarNav } from "./components/BottomBarNav";
import { GuruChat } from "./components/GuruChat";
import { KundliView } from "./components/KundliView";
import { HoroscopeView } from "./components/HoroscopeView";
import { KundliMatchingView } from "./components/KundliMatchingView";
import { LearningView } from "./components/LearningView";
import { ProfileModal } from "./components/ProfileModal";
import { ActiveTab, UserProfile } from "./types";
import { saveUserProfileToFirestore, getUserProfileFromFirestore } from "./lib/firebase";

const DEFAULT_USER: UserProfile = {
  id: "seeker_default",
  email: "seeker@vedanga.ai",
  name: "Seeker",
  dob: "1995-01-01",
  tob: "08:30",
  pob: "New Delhi, India (28.6139° N, 77.2090° E)",
  gender: "Male",
};

export default function App() {
  const [viewState, setViewState] = useState<"landing" | "app">(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.startsWith("/learn") || path.startsWith("/article") || (hash && hash.length > 1)) {
        return "app";
      }
    }
    return "landing";
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>("chat");
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Handle initial URL route / hash and back/forward navigation
  useEffect(() => {
    const syncRouteWithTab = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      if (path.startsWith("/learn") || path.startsWith("/article")) {
        setActiveTab("learning");
        setViewState("app");
      } else if (hash === "#chat") {
        setActiveTab("chat");
        setViewState("app");
      } else if (hash === "#kundli") {
        setActiveTab("kundli");
        setViewState("app");
      } else if (hash === "#horoscope") {
        setActiveTab("horoscope");
        setViewState("app");
      } else if (hash === "#matching") {
        setActiveTab("matching");
        setViewState("app");
      } else if (hash === "#learning") {
        setActiveTab("learning");
        setViewState("app");
      }
    };

    syncRouteWithTab();
    window.addEventListener("popstate", syncRouteWithTab);
    window.addEventListener("hashchange", syncRouteWithTab);
    return () => {
      window.removeEventListener("popstate", syncRouteWithTab);
      window.removeEventListener("hashchange", syncRouteWithTab);
    };
  }, []);

  const handleStartApp = (tab: ActiveTab = "chat", initialPrompt?: string) => {
    if (initialPrompt) {
      localStorage.setItem("vedanga_chat_prefill", initialPrompt);
    }
    setActiveTab(tab);
    setViewState("app");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoHome = () => {
    setViewState("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // Load saved session on mount if available
  useEffect(() => {
    const savedUser = localStorage.getItem("vedanga_user") || localStorage.getItem("astroguru_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.email) {
          setUser(parsed);

          // Sync from Firebase Firestore
          getUserProfileFromFirestore(parsed.email)
            .then((remoteUser) => {
              if (remoteUser) {
                setUser(remoteUser);
                localStorage.setItem("vedanga_user", JSON.stringify(remoteUser));
              }
            })
            .catch((err) => console.error("Firebase profile fetch failed:", err));
        }
      } catch (err) {
        console.error("Failed to parse saved user", err);
      }
    }
  }, []);

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem("vedanga_user", JSON.stringify(updatedUser));

    // Update user profile in Firebase Firestore
    saveUserProfileToFirestore(updatedUser).catch((err) =>
      console.error("Error updating user in Firebase Firestore:", err)
    );
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
            <LandingPage onStart={handleStartApp} />
          </motion.div>
        )}

        {/* 2. Main App View */}
        {viewState === "app" && (
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
              onGoHome={handleGoHome}
            />

            <main className="flex-1 pb-16">
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
                  {activeTab === "matching" && <KundliMatchingView user={user} />}
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
