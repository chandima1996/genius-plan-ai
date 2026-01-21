import React, { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import RoadmapForm from "./components/RoadmapForm";
import RoadmapDisplay from "./components/RoadmapDisplay";
import HistorySheet from "./components/HistorySheet";
import HeroSection from "./components/HeroSection";
import Testimonials from "./components/Testimonials";
import { ModeToggle } from "./components/ModeToggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { DEMO_ROADMAP } from "./data/demoData";

function Dashboard() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const { user } = useUser();

  const handleLoadHistory = (data) => {
    if (!data) return;
    setRoadmap(data);
    setShowForm(false);
    setIsDemo(false);
    setTimeout(
      () =>
        document
          .getElementById("roadmap-section")
          ?.scrollIntoView({ behavior: "smooth" }),
      100
    );
  };

  const handleCreateNew = () => {
    setRoadmap(null);
    setShowForm(true);
    setIsDemo(false);
    setTimeout(
      () =>
        document
          .getElementById("form-section")
          ?.scrollIntoView({ behavior: "smooth" }),
      100
    );
  };

  const scrollToForm = () =>
    document
      .getElementById("form-section")
      ?.scrollIntoView({ behavior: "smooth" });

  const handleViewDemo = () => {
    setIsDemo(true);
    setRoadmap(DEMO_ROADMAP);
    setShowForm(false);
    setTimeout(
      () =>
        document
          .getElementById("roadmap-section")
          ?.scrollIntoView({ behavior: "smooth" }),
      100
    );
    toast.info("Viewing Demo", {
      description: "Sign in to save progress!",
      duration: 3000,
    });
  };

  const handleUpdateRoadmap = async (updatedContent) => {
    if (isDemo || !roadmap._id) return;
    setRoadmap((prev) => ({ ...prev, ...updatedContent }));
    try {
      await fetch("http://localhost:8000/api/roadmap/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roadmapId: roadmap._id,
          content: updatedContent,
        }),
      });
    } catch (err) {
      console.error("Auto-save failed:", err);
      toast.error("Auto-save failed");
    }
  };

  const generateRoadmap = async (formData) => {
    if (!user) {
      toast.error("Sign In Required");
      return;
    }
    setLoading(true);
    setError("");
    setIsDemo(false);

    try {
      const res = await fetch("http://localhost:8000/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const saveRes = await fetch("http://localhost:8000/api/roadmap/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          roadmapData: data,
          ...formData,
        }),
      });
      const savedDoc = await saveRes.json();

      const uiData = { _id: savedDoc._id, ...savedDoc.content };
      setRoadmap(uiData);
      setShowForm(false);
      toast.success("Ready!", { description: "Start learning!" });
    } catch (err) {
      setError(err.message || "Failed");
      toast.error("Error", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryDataTransform = (doc) => {
    if (doc.content) {
      handleLoadHistory({ _id: doc._id, ...doc.content });
    } else {
      handleLoadHistory(doc);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 overflow-x-hidden">
      <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-grid-black/[0.05] dark:bg-grid-white/[0.05]" />
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-300 dark:bg-cyan-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      <div className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 transition-all">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
          <div
            className="text-xl font-bold flex items-center gap-2 cursor-pointer hover:opacity-80"
            onClick={() => window.location.reload()}
          >
            <span className="text-2xl">✨</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500">
              GeniusPlan.AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <SignedIn>
              <HistorySheet onLoadRoadmap={handleHistoryDataTransform} />
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="default" className="bg-cyan-600 text-white">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>

      <main className="w-full flex flex-col items-center">
        <SignedOut>
          <HeroSection isSignedIn={false} onViewDemo={handleViewDemo} />
          {isDemo && roadmap && (
            <div
              id="roadmap-section"
              className="w-full max-w-4xl px-4 py-12 animate-in fade-in zoom-in-95 duration-500"
            >
              <div className="text-center mb-8 p-6 bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-200 rounded-2xl">
                <p className="text-cyan-800 dark:text-cyan-200 font-bold">
                  Demo Mode
                </p>
              </div>
              <RoadmapDisplay data={roadmap} />
            </div>
          )}
          <Testimonials />
        </SignedOut>

        <SignedIn>
          <HeroSection
            isSignedIn={true}
            onGetStarted={scrollToForm}
            onViewDemo={handleViewDemo}
          />
          <div
            id="form-section"
            className="w-full max-w-4xl px-4 py-20 scroll-mt-24"
          >
            {!isDemo && (
              <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-5">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  Create Your Path
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Welcome,{" "}
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                    {user?.firstName}
                  </span>
                  .
                </p>
              </div>
            )}

            {showForm && (
              <div className="animate-in fade-in slide-in-from-bottom-5">
                <RoadmapForm onSubmit={generateRoadmap} isLoading={loading} />
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-100 text-red-500 rounded-lg text-center">
                {error}
              </div>
            )}

            {!showForm && roadmap && (
              <div
                id="roadmap-section"
                className="animate-in fade-in zoom-in-95 duration-500 mt-10 scroll-mt-28"
              >
                {isDemo && (
                  <div className="mb-6 p-4 bg-yellow-100 text-yellow-800 text-center rounded-lg">
                    Demo Mode.
                  </div>
                )}
                <Button
                  onClick={handleCreateNew}
                  variant="ghost"
                  className="mb-6 text-slate-500 hover:text-cyan-600 group"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />{" "}
                  Create New
                </Button>
                <RoadmapDisplay data={roadmap} onUpdate={handleUpdateRoadmap} />
              </div>
            )}
          </div>
        </SignedIn>
      </main>

      <footer className="w-full py-8 mt-auto border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 text-sm bg-white dark:bg-slate-950">
        <p>© 2024 GeniusPlan AI.</p>
      </footer>
    </div>
  );
}

export default Dashboard;
