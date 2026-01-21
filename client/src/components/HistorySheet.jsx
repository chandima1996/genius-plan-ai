import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  History,
  ChevronRight,
  Loader2,
  Calendar,
  Clock,
  BarChart,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { Badge } from "@/components/ui/badge";

const HistorySheet = ({ onLoadRoadmap }) => {
  const { user } = useUser();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://genius-plan-ai-server.onrender.com/api/roadmap/user/${user.id}`
      );
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (item) => {
    onLoadRoadmap(item.content || item);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          onClick={fetchHistory}
          className="bg-transparent border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400"
        >
          <History className="w-4 h-4 mr-2" /> History
        </Button>
      </SheetTrigger>

      <SheetContent className="w-[400px] sm:w-[500px] overflow-y-auto bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-l-slate-200 dark:border-l-slate-800">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
            My Learning Paths
          </SheetTitle>
          <SheetDescription className="text-slate-500 dark:text-slate-400">
            Review your previously generated roadmaps.
          </SheetDescription>
        </SheetHeader>

        <div className="pb-10 space-y-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
          ) : history.length === 0 ? (
            <p className="py-10 italic text-center text-slate-500">
              No saved roadmaps yet. Create one!
            </p>
          ) : (
            history.map((item) => (
              <div
                key={item._id}
                onClick={() => handleClick(item)}
                className="p-4 transition-all duration-200 border cursor-pointer group border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-base font-bold transition-colors text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                    {item.topic}
                  </h4>

                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    {item.level}
                  </Badge>
                </div>

                <p className="mb-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                  {item.description ||
                    "No description available for this roadmap."}
                </p>

                <div className="flex items-center gap-4 pt-2 mt-2 text-xs border-t text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800/50">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.duration}
                  </span>
                  <span className="flex items-center gap-1 ml-auto">
                    <Calendar className="w-3 h-3" />{" "}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HistorySheet;
