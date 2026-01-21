import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, BrainCircuit } from "lucide-react";
import { toast } from "sonner";

const QuizModal = ({ topic }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  const startQuiz = async () => {
    setLoading(true);
    setQuestions([]);
    setCurrentQ(0);
    setScore(0);
    setShowResult(false);

    try {
      const res = await fetch("http://localhost:8000/api/roadmap/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setQuestions(data);
    } catch (err) {
      toast.error("Failed to load quiz");
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index) => {
    setSelectedOption(index);
    setIsAnswerChecked(true);

    if (index === questions[currentQ].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswerChecked(false);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={startQuiz}
          className="gap-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
        >
          <BrainCircuit className="w-4 h-4" /> Take Quiz
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="text-center">
            {showResult ? "Quiz Results" : `Quiz: ${topic}`}
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex flex-col items-center py-10">
            <Loader2 className="w-10 h-10 animate-spin text-purple-500 mb-4" />
            <p className="text-slate-500">Generating questions with AI...</p>
          </div>
        )}

        {!loading && !showResult && questions.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between text-sm text-slate-500">
              <span>
                Question {currentQ + 1}/{questions.length}
              </span>
              <span>Score: {score}</span>
            </div>
            <h3 className="text-lg font-semibold">
              {questions[currentQ].question}
            </h3>
            <div className="grid gap-3">
              {questions[currentQ].options.map((opt, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className={`justify-start h-auto py-3 px-4 ${
                    isAnswerChecked
                      ? i === questions[currentQ].correctAnswer
                        ? "bg-green-100 border-green-500 text-green-700"
                        : i === selectedOption
                        ? "bg-red-100 border-red-500 text-red-700"
                        : ""
                      : "hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => !isAnswerChecked && handleAnswer(i)}
                >
                  {opt}
                  {isAnswerChecked &&
                    i === questions[currentQ].correctAnswer && (
                      <CheckCircle className="ml-auto w-4 h-4 text-green-600" />
                    )}
                  {isAnswerChecked &&
                    i === selectedOption &&
                    i !== questions[currentQ].correctAnswer && (
                      <XCircle className="ml-auto w-4 h-4 text-red-600" />
                    )}
                </Button>
              ))}
            </div>
          </div>
        )}

        {!loading && showResult && (
          <div className="text-center py-6 space-y-4">
            <div className="text-5xl font-bold text-purple-600">
              {Math.round((score / questions.length) * 100)}%
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              You got {score} out of {questions.length} correct!
            </p>
            <Button
              onClick={() => setIsOpen(false)}
              className="bg-purple-600 hover:bg-purple-500 text-white w-full"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
