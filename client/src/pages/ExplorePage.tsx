import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  Layers, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  X,
  Compass
} from 'lucide-react';
import { MasterRoadmap, LearnerProfile } from '../types';
import { fetchRoadmaps } from '../services/api';

interface ExplorePageProps {
  onStartRoadmap: (goal: string) => void;
}

const CATEGORIES = [
  'All',
  'Web Development',
  'AI/ML',
  'Data Structures & Algorithms',
  'Robotics & Hardware',
  'Quantum Computing',
];

export const ExplorePage: React.FC<ExplorePageProps> = ({ onStartRoadmap }) => {
  const [roadmaps, setRoadmaps] = useState<MasterRoadmap[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [previewRoadmap, setPreviewRoadmap] = useState<MasterRoadmap | null>(null);

  const loadRoadmaps = async () => {
    setIsLoading(true);
    try {
      const data = await fetchRoadmaps({
        domain: selectedCategory !== 'All' ? selectedCategory : undefined,
        difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
        search: searchQuery.trim() || undefined,
      });
      setRoadmaps(data);
    } catch (err) {
      console.error('Failed to fetch roadmaps:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmaps();
  }, [selectedCategory, selectedDifficulty]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadRoadmaps();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Shared Master Roadmap Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore Master Roadmaps
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Browse verified, community-reusable learning roadmaps. When you choose a roadmap, QuestPath personalizes its schedule, pace, and starting level to fit your exact goals.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search roadmaps by title, skill, or tag..."
            className="w-full bg-dark-panel border border-dark-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer font-medium ${
                selectedCategory === cat
                  ? 'bg-violet-600 text-white shadow-glow-violet/30'
                  : 'bg-dark-panel border border-dark-border text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Grid of Master Roadmaps */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-64 rounded-2xl bg-dark-card border border-dark-border animate-pulse"></div>
          ))}
        </div>
      ) : roadmaps.length === 0 ? (
        <div className="text-center py-16 bg-dark-card rounded-2xl border border-dark-border space-y-3">
          <Compass className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No matching master roadmaps found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You can type any novel goal in the AI Chat homepage and our engine will create, validate, and save a brand-new master roadmap!
          </p>
          <button
            onClick={() => onStartRoadmap(searchQuery || 'Become a Full-Stack Web Developer')}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-glow-violet cursor-pointer"
          >
            Generate New Roadmap with AI
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map(rm => (
            <div
              key={rm.id}
              className="group p-5 rounded-2xl bg-dark-card border border-dark-border hover:border-violet-500/50 hover:shadow-glow-violet/20 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Domain & Difficulty Badges */}
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-violet-950/60 text-violet-300 font-semibold border border-violet-500/20 text-[11px]">
                    {rm.domain}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    v{rm.version.toFixed(1)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-accent transition-colors leading-snug">
                  {rm.canonicalGoal}
                </h3>

                {/* Stages Pills */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Stages</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(rm.stages || []).map((st, idx) => (
                      <span
                        key={st.id}
                        className="px-2 py-0.5 rounded text-[10px] bg-dark-panel border border-white/5 text-slate-300"
                      >
                        {idx + 1}. {st.title}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Target Outcomes */}
                {rm.targetOutcomes && rm.targetOutcomes.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Key Outcomes</span>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {rm.targetOutcomes.slice(0, 2).map((oc, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300 line-clamp-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                          <span>{oc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom Actions & Stats */}
              <div className="pt-4 mt-4 border-t border-dark-border flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 text-slate-400 font-medium text-[11px]">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-violet-400" />
                    <span>{rm.nodes?.length || 0} Quests</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-accent" />
                    <span>~{rm.estimatedHours} hrs</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPreviewRoadmap(rm)}
                    className="p-2 rounded-lg bg-dark-panel hover:bg-dark-hover border border-dark-border text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Preview Quests"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onStartRoadmap(rm.canonicalGoal)}
                    className="px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-glow-violet/30 transition-all cursor-pointer"
                  >
                    <span>Start</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Preview Roadmap Modal */}
      {previewRoadmap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-dark-panel border border-dark-border rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-dark-border bg-dark-card/50 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-violet-400">{previewRoadmap.domain}</span>
                <h3 className="text-lg font-bold text-white">{previewRoadmap.canonicalGoal}</h3>
              </div>
              <button
                onClick={() => setPreviewRoadmap(null)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-300 uppercase text-[11px] tracking-wider mb-2">
                  Roadmap Quest Breakdown ({previewRoadmap.nodes?.length} Quests)
                </h4>
                <div className="space-y-2">
                  {previewRoadmap.nodes?.map((node, idx) => (
                    <div key={node.id} className="p-3 rounded-xl bg-dark-card border border-dark-border flex items-center justify-between">
                      <div>
                        <span className="text-violet-300 font-bold block">{idx + 1}. {node.title}</span>
                        <span className="text-slate-400 text-[11px]">{node.subtitle || node.description.slice(0, 90)}...</span>
                      </div>
                      <span className="text-amber-400 font-mono font-semibold shrink-0 ml-3">+{node.xp} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-dark-border bg-dark-card/50 flex justify-end gap-2">
              <button
                onClick={() => setPreviewRoadmap(null)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const goal = previewRoadmap.canonicalGoal;
                  setPreviewRoadmap(null);
                  onStartRoadmap(goal);
                }}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-glow-violet cursor-pointer"
              >
                Personalize & Start Journey
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
