import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const AIChatBox = ({ contextData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! I'm your AI Tutor. Ask me anything about this roadmap!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://genius-plan-ai-server.onrender.com/api/roadmap/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          context: {
            title: contextData.title,
            description: contextData.description,
          },
        }),
      });

      const data = await res.json();

      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, I'm having trouble connecting right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed z-50 flex flex-col items-end bottom-6 right-6">
     
      {isOpen && (
        <Card className="w-[350px] md:w-[400px] h-[500px] shadow-2xl border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex flex-col mb-4 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <CardHeader className="flex flex-row items-center justify-between p-4 text-white border-b border-slate-100 dark:border-slate-800 bg-cyan-600 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="w-5 h-5" /> AI Tutor
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 text-white hover:bg-cyan-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

         
          <CardContent className="relative flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4 pr-5">
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${
                      msg.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.role === "ai"
                          ? "bg-cyan-100 text-cyan-600"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {msg.role === "ai" ? (
                        <Bot className="w-5 h-5" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-2xl text-sm max-w-[80%] ${
                        msg.role === "ai"
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none"
                          : "bg-cyan-600 text-white rounded-tr-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-tl-none bg-slate-100 dark:bg-slate-800 rounded-2xl">
                      <span className="text-xs text-slate-500">Typing</span>
                      <span className="flex gap-1">
                        <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce"></span>
                        <span className="w-1 h-1 delay-100 rounded-full bg-slate-400 animate-bounce"></span>
                        <span className="w-1 h-1 delay-200 rounded-full bg-slate-400 animate-bounce"></span>
                      </span>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          </CardContent>

          
          <div className="p-3 border-t border-slate-100 dark:border-slate-800">
            <form onSubmit={handleSend} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-cyan-500"
              />
              <Button
                type="submit"
                size="icon"
                disabled={loading || !input.trim()}
                className="text-white bg-cyan-600 hover:bg-cyan-500 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}

      
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center duration-300 rounded-full shadow-lg h-14 w-14 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-500/30 animate-in zoom-in"
        >
          <MessageSquare className="text-white w-7 h-7" />
        </Button>
      )}
    </div>
  );
};

export default AIChatBox;
