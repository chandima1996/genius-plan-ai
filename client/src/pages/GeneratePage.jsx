import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";
import RoadmapForm from "../components/RoadmapForm";
import RoadmapDisplay from "../components/RoadmapDisplay";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const GeneratePage = () => {
  const { user } = useUser();
  const location = useLocation();

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    if (location.state?.roadmapData) {
      setRoadmap(location.state.roadmapData);
      setShowForm(false);
    }
  }, [location]);

  const handleCreateNew = () => {
    setRoadmap(null);
    setShowForm(true);
  };

  const handleUpdateRoadmap = async (updatedContent) => {
    if (!roadmap?._id) return;
    setRoadmap((prev) => ({ ...prev, ...updatedContent }));
    try {
      await fetch("http://localhost:8000/api/roadmap/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roadmapId: roadmap._id,
          content: updatedContent,
        }),
      });
    } catch (err) {
      toast.error("Auto-save failed");
    }
  };

  const generateRoadmap = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const saveRes = await fetch("http://localhost:8000/api/roadmap/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          roadmapData: data,
          ...formData,
        }),
      });
      const savedDoc = await saveRes.json();

      const uiData = { _id: savedDoc._id, ...savedDoc.content };
      setRoadmap(uiData);
      setShowForm(false);
      toast.success("Ready!", { description: "Start learning!" });
    } catch (err) {
      toast.error("Error", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-5">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
          {showForm ? "Generate New Roadmap" : "Your Learning Path"}
        </h2>
        {showForm && (
          <p className="text-slate-600 dark:text-slate-400">
            Enter a topic below and let AI create a structured plan for you.
          </p>
        )}
      </div>

      {showForm && (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
          <RoadmapForm onSubmit={generateRoadmap} isLoading={loading} />
        </div>
      )}

      {!showForm && roadmap && (
        <div className="animate-in fade-in zoom-in-95 duration-500">
          <Button
            onClick={handleCreateNew}
            variant="ghost"
            className="mb-6 text-slate-500 hover:text-cyan-600 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Create New
          </Button>
          <RoadmapDisplay data={roadmap} onUpdate={handleUpdateRoadmap} />
        </div>
      )}
    </div>
  );
};

export default GeneratePage;
