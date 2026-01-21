import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import HeroSection from "../components/HeroSection";
import Testimonials from "../components/Testimonials";
import { toast } from "sonner";
import { DEMO_ROADMAP } from "../data/demoData";

const HomePage = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/generate");
  };

  const handleViewDemo = () => {
    navigate("/generate", {
      state: { roadmapData: DEMO_ROADMAP, isDemo: true },
    });
    toast.info("Viewing Demo Mode");
  };

  return (
    <div className="w-full flex flex-col items-center">
      <HeroSection
        isSignedIn={isSignedIn}
        onGetStarted={handleGetStarted}
        onViewDemo={handleViewDemo}
      />
      <Testimonials />
    </div>
  );
};

export default HomePage;
