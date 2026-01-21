import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Sahan Perera",
    role: "Frontend Dev",
    text: "This tool saved me months of planning! The React roadmap was spot on.",
    rating: 5,
  },
  {
    name: "Nimali Silva",
    role: "Student",
    text: "Finally, a structured way to learn Python. Love the clean UI!",
    rating: 5,
  },
  {
    name: "Kamal Dias",
    role: "Full Stack Dev",
    text: "Generated a perfect MERN stack path for my internship preparation.",
    rating: 4,
  },
  {
    name: "Dilshan K.",
    role: "Tech Lead",
    text: "Impressive AI accuracy. I recommend this to all my juniors.",
    rating: 5,
  },
  {
    name: "Ayesha R.",
    role: "UX Designer",
    text: "The interface is beautiful and the roadmaps are very detailed.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <div className="w-full py-20 overflow-hidden bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
      <div className="text-center mb-10 px-4">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Trusted by Learners
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          See what our community has to say about GeniusPlan AI.
        </p>
      </div>

      <div className="relative w-full">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10" />

        <div className="animate-scroll flex gap-6 px-4">
          {[...reviews, ...reviews].map((review, index) => (
            <Card
              key={index}
              className="min-w-[300px] max-w-[300px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 transition-colors shadow-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700">
                    <AvatarFallback className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300">
                      {review.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {review.name}
                    </p>
                    <p className="text-xs text-slate-500">{review.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
