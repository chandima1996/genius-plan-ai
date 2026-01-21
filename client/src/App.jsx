import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import GeneratePage from "./pages/GeneratePage";
import SharedRoadmap from "./components/SharedRoadmap";

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 overflow-x-hidden">
      <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-grid-black/[0.05] dark:bg-grid-white/[0.05]" />
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-300 dark:bg-cyan-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/generate" element={<GeneratePage />} />
        <Route path="/share/:id" element={<SharedRoadmap />} />
      </Routes>

      <footer className="w-full py-8 mt-auto border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm bg-white/50 dark:bg-slate-950/50 backdrop-blur">
        <p>© 2024 GeniusPlan AI. Built with MERN + Llama 3.</p>
      </footer>

      <Toaster position="top-center" richColors theme="system" />
    </div>
  );
}

export default App;
