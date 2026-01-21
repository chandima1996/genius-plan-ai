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
          `http://localhost:8000/api/roadmap/public/${id}`
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
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  if (error)
    return (
      <div className="h-screen flex flex-col items-center justify-center text-red-500">
        <p>{error}</p>
        <Link to="/">
          <Button variant="link">Go Home</Button>
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> GeniusPlan AI
            </Button>
          </Link>
          <div className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-bold uppercase">
            Read Only View
          </div>
        </div>

        <RoadmapDisplay data={roadmap} />
      </div>
    </div>
  );
};

export default SharedRoadmap;
