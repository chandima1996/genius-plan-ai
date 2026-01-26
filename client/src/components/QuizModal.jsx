import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, BrainCircuit } from "lucide-react";
import { toast } from "sonner";
import { DEMO_QUIZ } from "../data/demoData"; 

const QuizModal = ({ topic, isDemo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  
  const API_URL = "https://genius-plan-ai-server.onrender.com"; 

  const startQuiz = async () => {
    setLoading(true);
    setQuestions([]);
    setCurrentQ(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    
   
    if (isDemo) {
        setTimeout(() => {
            setQuestions(DEMO_QUIZ); 
            setLoading(false);
        }, 800); 
        return;
    }

    
    try {
      const url = window.location.hostname === "localhost" ? "http://localhost:8000/api/roadmap/quiz" : `${API_URL}/api/roadmap/quiz`;
      
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      
      if(data.error) throw new Error(data.error);
      if (!Array.isArray(data) || data.length === 0) throw new Error("Invalid Data");

      setQuestions(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load quiz");
      setIsOpen(false);
    } finally {
      if (!isDemo) setLoading(false);
    }
  };

  const handleAnswer = (index) => {
    setSelectedOption(index);
    setIsAnswerChecked(true);
    
    if (index === questions[currentQ].correctAnswer) {
        setScore(prev => prev + 1);
    }

    setTimeout(() => {
        if (currentQ < questions.length - 1) {
            setCurrentQ(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswerChecked(false);
        } else {
            setShowResult(true);
        }
    }, 1500);
  };

  const currentQuestionData = questions[currentQ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={startQuiz} className="gap-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20">
            <BrainCircuit className="w-4 h-4" /> {isDemo ? "Demo Quiz" : "Take Quiz"}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">{showResult ? "Quiz Results" : `Quiz: ${topic}`}</DialogTitle>
        </DialogHeader>

        {loading && (
            <div className="flex flex-col items-center py-10">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500 mb-4" />
                <p className="text-slate-500">{isDemo ? "Loading Demo Quiz..." : "Generating Questions..."}</p>
            </div>
        )}

        {!loading && !showResult && questions.length > 0 && currentQuestionData && (
            <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between text-sm font-medium text-slate-500 dark:text-slate-400">
                    <span>Question {currentQ + 1} of {questions.length}</span>
                    <span>Score: {score}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                    {currentQuestionData.question}
                </h3>
                
                <div className="grid gap-3">
                    {currentQuestionData.options.map((opt, i) => (
                        <Button 
                            key={i} 
                            variant="outline" 
                            className={`justify-start h-auto py-3 px-4 text-left whitespace-normal border ${
                                isAnswerChecked 
                                ? i === currentQuestionData.correctAnswer 
                                    ? "bg-green-100 border-green-500 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300" 
                                    : i === selectedOption ? "bg-red-100 border-red-500 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300" : "opacity-50"
                                : "hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                            }`}
                            onClick={() => !isAnswerChecked && handleAnswer(i)}
                        >
                            <span className="mr-3 font-bold text-slate-400">{String.fromCharCode(65 + i)}.</span>
                            {opt}
                            {isAnswerChecked && i === currentQuestionData.correctAnswer && <CheckCircle className="ml-auto w-5 h-5 text-green-600" />}
                            {isAnswerChecked && i === selectedOption && i !== currentQuestionData.correctAnswer && <XCircle className="ml-auto w-5 h-5 text-red-600" />}
                        </Button>
                    ))}
                </div>
            </div>
        )}

        {!loading && showResult && (
            <div className="text-center py-6 space-y-6 animate-in zoom-in-95">
                <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">
                    {Math.round((score / questions.length) * 100)}%
                </div>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                    You answered <span className="font-bold text-slate-900 dark:text-white">{score}</span> correctly!
                </p>
                <Button onClick={() => setIsOpen(false)} className="bg-purple-600 hover:bg-purple-500 text-white w-full">Close</Button>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
