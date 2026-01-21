import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, BrainCircuit, Zap, Target, Star } from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";
import Counter from "./Counter";

const HeroSection = ({ onGetStarted, isSignedIn, onViewDemo }) => {
  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 lg:pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <div className="text-center lg:text-left space-y-8 animate-slide-in-left order-2 lg:order-1">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-sm font-medium mb-4">
            <span className="flex h-2 w-2 rounded-full bg-cyan-500 mr-2 animate-pulse"></span>
            Powered by AI
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
            Master Any Skill with <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-purple-500">
              AI Precision
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Stop guessing what to learn next. GeniusPlan AI generates
            personalized, step-by-step learning roadmaps tailored to your goals
            and experience level instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            {isSignedIn ? (
              <Button
                onClick={onGetStarted}
                size="lg"
                className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
              >
                Generate Roadmap <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
                >
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </SignInButton>
            )}

            <Button
              onClick={onViewDemo}
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg rounded-full border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              View Demo
            </Button>
          </div>

          <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-800 mt-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                <Counter end={10} suffix="k+" duration={2000} />
              </h3>
              <p className="text-sm text-slate-500">Users</p>
            </div>
            <div className="text-center lg:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                <Counter end={50} suffix="k+" duration={2500} />
              </h3>
              <p className="text-sm text-slate-500">Roadmaps</p>
            </div>
            <div className="text-center lg:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center lg:justify-start gap-1">
                4.9 <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </h3>
              <p className="text-sm text-slate-500">Rating</p>
            </div>
          </div>
        </div>

        <div className="relative hidden lg:flex justify-center lg:justify-end items-center animate-slide-in-right order-1 lg:order-2">
          <div className="relative w-full max-w-[450px] xl:max-w-[550px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-cyan-500/20 rounded-full blur-[80px] -z-10 animate-pulse" />
            <div className="animate-float">
              <img
                src="/hero-image.jpg"
                alt="AI Learning"
                className="w-full h-auto drop-shadow-2xl z-10 relative transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute -left-6 top-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 animate-float-delay z-20">
              <BrainCircuit className="w-6 h-6 text-purple-500 mb-2" />
              <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-600 rounded mb-1"></div>
              <div className="w-8 h-1.5 bg-slate-200 dark:bg-slate-600 rounded"></div>
            </div>
            <div className="absolute -right-2 bottom-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 animate-float z-20">
              <Target className="w-6 h-6 text-cyan-500 mb-2" />
              <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-600 rounded mb-1"></div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-in-right"
        style={{ animationDelay: "0.5s" }}
      >
        <FeatureCard
          icon={<Zap className="w-6 h-6 text-yellow-500" />}
          title="Instant Generation"
          desc="Get a complete roadmap in seconds powered by Groq & Llama 3."
        />
        <FeatureCard
          icon={<BrainCircuit className="w-6 h-6 text-purple-500" />}
          title="Smart Personalization"
          desc="Tailored to your exact skill level, from beginner to expert."
        />
        <FeatureCard
          icon={<Target className="w-6 h-6 text-cyan-500" />}
          title="Goal Oriented"
          desc="Focuses on what matters most to achieve your learning goals fast."
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:-translate-y-1 group">
    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
      {desc}
    </p>
  </div>
);

export default HeroSection;
