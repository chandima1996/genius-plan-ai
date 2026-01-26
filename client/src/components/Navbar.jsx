import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";
import HistorySheet from "./HistorySheet";
import { Sparkles, PlusCircle } from "lucide-react";

const Navbar = ({ onLoadHistory }) => {
  const navigate = useNavigate();

  const handleHistorySelect = (data) => {
    navigate("/generate", { state: { roadmapData: data } });
    if (onLoadHistory) onLoadHistory(data);
  };

  return (
    <div className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 transition-all">
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold flex items-center gap-2 cursor-pointer hover:opacity-80"
        >
          <img src="./logo.svg" alt="logo-image" className="w-7 h-7" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500">
            GeniusPlan.AI
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <ModeToggle />

          <SignedIn>
            <Link to="/generate">
              <Button
                variant="default"
                size="sm"
                className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2 hidden md:flex"
              >
                <PlusCircle className="w-4 h-4" /> Generate
              </Button>
            </Link>

            <HistorySheet
              onLoadRoadmap={(handleHistoryDataTransform) => {
                const doc = handleHistoryDataTransform;
                const data = doc.content
                  ? { _id: doc._id, ...doc.content }
                  : doc;
                handleHistorySelect(data);
              }}
            />

            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button
                variant="default"
                className="bg-cyan-600 text-white hover:bg-cyan-500"
              >
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
