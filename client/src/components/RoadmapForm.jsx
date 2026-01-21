import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";

const RoadmapForm = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState("");

  const [durationValue, setDurationValue] = useState("");
  const [durationUnit, setDurationUnit] = useState("Weeks");

  const [level, setLevel] = useState("Beginner");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic || !durationValue) return;

    const fullDuration = `${durationValue} ${durationUnit}`;
    onSubmit({ topic, duration: fullDuration, level });
  };

  return (
    <Card className="w-full bg-white/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 backdrop-blur-sm shadow-xl transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2 text-slate-800 dark:text-slate-200">
          <Sparkles className="w-5 h-5 text-cyan-500" />
          Configurator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Topic
              </label>
              <Input
                placeholder="e.g. React, Python"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 dark:text-white border-slate-200 dark:border-slate-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Duration
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="e.g. 2"
                  value={durationValue}
                  onChange={(e) => setDurationValue(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 dark:text-white border-slate-200 dark:border-slate-800 flex-1"
                  min="1"
                />

                <Select value={durationUnit} onValueChange={setDurationUnit}>
                  <SelectTrigger className="w-[110px] bg-slate-50 dark:bg-slate-950 dark:text-white border-slate-200 dark:border-slate-800">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-950 dark:text-white">
                    <SelectItem value="Days">Days</SelectItem>
                    <SelectItem value="Weeks">Weeks</SelectItem>
                    <SelectItem value="Months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Experience Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                <div
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`cursor-pointer text-center py-2 rounded-md border text-sm font-medium transition-all ${
                    level === lvl
                      ? "bg-cyan-100 dark:bg-cyan-500/20 border-cyan-500 text-cyan-700 dark:text-cyan-400"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-500 hover:border-slate-400"
                  }`}
                >
                  {lvl}
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 h-12 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...
              </>
            ) : (
              "Generate Roadmap"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RoadmapForm;
