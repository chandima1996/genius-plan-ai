import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import RoadmapDisplay from "./RoadmapDisplay";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";

const SharedRoadmap = () => {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await fetch(
          `https://genius-plan-ai-server.onrender.com/api/roadmap/public/${id}`
        );
        if (!res.ok) throw new Error("Roadmap not found");
        const data = await res.json();

        if (data.content) {
          setRoadmap({ _id: data._id, ...data.content });
        } else {
          setRoadmap(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500">
        <p>{error}</p>
        <Link to="/">
          <Button variant="link">Go Home</Button>
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen p-4 bg-slate-50 dark:bg-slate-950 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> GeniusPlan AI
            </Button>
          </Link>
          <div className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-cyan-100 text-cyan-700">
            Read Only View
          </div>
        </div>

        <RoadmapDisplay data={roadmap} />
      </div>
    </div>
  );
};

export default SharedRoadmap;
