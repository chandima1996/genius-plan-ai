import React, { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  ArrowRight,
  Download,
  Loader2,
  Share2,
} from "lucide-react";
import html2pdf from "html2pdf.js";
import AIChatBox from "./AIChatBox";
import QuizModal from "./QuizModal";
import { toast } from "sonner";

const RoadmapDisplay = ({ data, onUpdate, readOnly = false }) => {
  const [localData, setLocalData] = useState(data);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [progress, setProgress] = useState(0);
  const printRef = useRef(null);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  useEffect(() => {
    if (!localData || !localData.weeks) return;
    let total = 0;
    let completed = 0;
    localData.weeks.forEach((week) => {
      week.details.forEach((item) => {
        total++;
        if (item.completed) completed++;
      });
    });
    setProgress(total === 0 ? 0 : Math.round((completed / total) * 100));
  }, [localData]);

  const handleToggle = (weekIndex, itemIndex) => {
    if (readOnly) return;
    const newData = JSON.parse(JSON.stringify(localData));
    const item = newData.weeks[weekIndex].details[itemIndex];
    item.completed = !item.completed;
    setLocalData(newData);
    if (onUpdate) onUpdate(newData);
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    const element = printRef.current;
    const opt = {
      margin: 15,
      filename: `${localData.title}_Plan.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: "avoid-all" },
    };
    element.style.display = "block";
    await html2pdf().set(opt).from(element).save();
    element.style.display = "none";
    setIsGeneratingPdf(false);
  };

  const handleShare = () => {
    if (!localData._id) {
      toast.error("Please save the roadmap first!");
      return;
    }
    const url = `${window.location.origin}/share/${localData._id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link Copied!", {
      description: "Share this link with anyone.",
    });
  };

  if (!localData || !localData.weeks)
    return <div className="text-red-500 text-center p-4">Invalid Data</div>;

  return (
    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700 relative">
      <div className="sticky top-[80px] z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
        <div className="flex justify-between text-sm mb-2 font-medium">
          <span className="text-slate-700 dark:text-slate-300">
            Your Progress
          </span>
          <span className="text-cyan-600 dark:text-cyan-400 font-bold">
            {progress}% Completed
          </span>
        </div>
        <Progress
          value={progress}
          className="h-2 w-full bg-slate-100 dark:bg-slate-800"
          indicatorClassName="bg-cyan-500"
        />
      </div>

      <div className="flex justify-end gap-2">
        {!readOnly && (
          <Button
            onClick={handleShare}
            variant="outline"
            className="border-purple-500 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
          >
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
        )}
        <Button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPdf}
          variant="outline"
          className="border-cyan-500 text-cyan-600 dark:text-cyan-400"
        >
          {isGeneratingPdf ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}{" "}
          Export PDF
        </Button>
      </div>

      <div className="p-4 md:p-8 bg-white/80 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-cyan-100">
            {localData.title}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {localData.description}
          </p>
        </div>

        <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 md:ml-6 space-y-10 pb-10">
          {localData.weeks.map((week, wIndex) => (
            <div key={wIndex} className="relative pl-8 md:pl-12 group">
              <div className="absolute -left-[9px] top-6 bg-white dark:bg-slate-950 p-1 rounded-full border-2 border-slate-300 dark:border-slate-700 group-hover:border-cyan-500 transition-all z-10">
                <div className="w-2.5 h-2.5 bg-slate-400 dark:bg-slate-600 group-hover:bg-cyan-500 rounded-full" />
              </div>
              <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 transition-all shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        {week.topic}
                      </h3>
                      <Badge variant="outline">Week {week.weekNumber}</Badge>
                    </div>

                    {!readOnly && <QuizModal topic={week.topic} />}
                  </div>

                  <div className="space-y-3 mb-4">
                    {week.details.map((item, iIndex) => (
                      <div
                        key={iIndex}
                        className={`flex items-start space-x-3 p-2 rounded transition-colors ${
                          item.completed
                            ? "bg-green-50 dark:bg-green-900/10"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <Checkbox
                          id={`task-${wIndex}-${iIndex}`}
                          checked={item.completed}
                          onCheckedChange={() => handleToggle(wIndex, iIndex)}
                          disabled={readOnly}
                          className="mt-1 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 border-slate-300 dark:border-slate-600"
                        />
                        <label
                          htmlFor={`task-${wIndex}-${iIndex}`}
                          className={`text-sm md:text-base leading-relaxed w-full ${
                            item.completed
                              ? "text-slate-400 line-through"
                              : "text-slate-700 dark:text-slate-200"
                          } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
                        >
                          {item.text}
                        </label>
                      </div>
                    ))}
                  </div>

                  {week.resources?.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex flex-wrap gap-2">
                        {week.resources.map((res, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          >
                            {res}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={printRef}
        style={{
          display: "none",
          padding: "40px",
          backgroundColor: "#ffffff",
          color: "#000000",
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
            borderBottom: "2px solid #333",
            paddingBottom: "20px",
          }}
        >
          <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
            {localData.title}
          </h1>
          <p>{localData.description}</p>
          <div>Progress: {progress}%</div>
        </div>
        {localData.weeks.map((week, w) => (
          <div
            key={w}
            style={{
              marginBottom: "20px",
              padding: "15px",
              border: "1px solid #ddd",
              pageBreakInside: "avoid",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0" }}>{week.topic}</h3>
            <ul>
              {week.details.map((item, i) => (
                <li
                  key={i}
                  style={{
                    color: item.completed ? "#aaa" : "#000",
                    textDecoration: item.completed ? "line-through" : "none",
                  }}
                >
                  {item.completed ? "[x]" : "[ ]"} {item.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {!readOnly && (
        <AIChatBox
          contextData={{
            title: localData.title,
            description: localData.description,
          }}
        />
      )}
    </div>
  );
};

export default RoadmapDisplay;
