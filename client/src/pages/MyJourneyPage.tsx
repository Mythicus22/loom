import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Sliders, 
  MapPin, 
  ArrowRight, 
  Play, 
  Sparkles, 
  Zap,
  RotateCcw,
  Layers,
  ChevronRight
} from 'lucide-react';
import { UserPlan, MasterRoadmap, UserProgress } from '../types';
import { fetchUserPlans, selectUserPlan, updatePlanSchedule } from '../services/api';

interface MyJourneyPageProps {
  activePlan: UserPlan | null;
  progress: UserProgress;
  onSelectPlan: (planId: string) => void;
  onOpenRoadmap: () => void;
}

export const MyJourneyPage: React.FC<MyJourneyPageProps> = ({
  activePlan,
  progress,
  onSelectPlan,
  onOpenRoadmap,
}) => {
  const [plans, setPlans] = useState<UserPlan[]>([]);
  const [editingPlan, setEditingPlan] = useState<UserPlan | null>(null);
  const [newHours, setNewHours] = useState(10);
  const [newWeeks, setNewWeeks] = useState(8);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadPlans = async () => {
    try {
      const data = await fetchUserPlans();
      setPlans(data);
    } catch (err) {
      console.error('Failed to load user plans:', err);
    }
  };

  useEffect(() => {
    loadPlans();
  }, [activePlan]);

  const handleOpenScheduleModal = (plan: UserPlan) => {
    setEditingPlan(plan);
    setNewHours(plan.learnerProfile?.hoursPerWeek || 10);
    setNewWeeks(plan.learnerProfile?.targetWeeks || 8);
  };

  const handleSaveSchedule = async () => {
    if (!editingPlan) return;
    setIsUpdating(true);
    try {
      await updatePlanSchedule(editingPlan.id, newHours, newWeeks);
      await loadPlans();
      setEditingPlan(null);
    } catch (err) {
      console.error('Failed to update schedule:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Personal Learning Journey</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          My Active & Saved Journeys
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Manage your personalized roadmaps. Adjust your weekly time commitment or deadline anytime — QuestPath will recalculate your milestones while preserving every completed quest.
        </p>
      </div>

      {/* Active Roadmap Hero Card */}
      {activePlan && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-950/60 via-dark-card to-dark-panel border-2 border-violet-500/40 shadow-glow-violet space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-violet-600 text-white shadow-glow-violet">
                Currently Active Journey
              </span>
              <h2 className="text-2xl font-black text-white">{activePlan.canonicalGoal}</h2>
              {activePlan.userGoalRaw && (
                <p className="text-xs text-slate-300 italic">"{activePlan.userGoalRaw}"</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenScheduleModal(activePlan)}
                className="px-3.5 py-2 rounded-xl bg-dark-panel border border-violet-500/40 hover:border-violet-400 text-violet-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-accent" />
                <span>Adjust Schedule</span>
              </button>

              <button
                onClick={onOpenRoadmap}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 shadow-glow-violet transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Continue Quest</span>
              </button>
            </div>
          </div>

          {/* Schedule stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-dark-card border border-dark-border">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Commitment</span>
              <span className="text-slate-100 font-bold">{activePlan.schedule?.weeklyHours || 10} hrs / week</span>
            </div>
            <div className="p-3 rounded-xl bg-dark-card border border-dark-border">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target Deadline</span>
              <span className="text-slate-100 font-bold">
                {activePlan.schedule?.targetEndDate 
                  ? new Date(activePlan.schedule.targetEndDate).toLocaleDateString()
                  : `${activePlan.learnerProfile?.targetWeeks || 8} weeks`}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-dark-card border border-dark-border">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Estimated Workload</span>
              <span className="text-slate-100 font-bold">~{activePlan.schedule?.totalEstimatedHours || 50} hours</span>
            </div>
            <div className="p-3 rounded-xl bg-dark-card border border-dark-border">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Quests Completed</span>
              <span className="text-emerald-400 font-bold">{progress.completedNodeIds?.length || 0} Cleared</span>
            </div>
          </div>

          {/* Milestones timeline overview */}
          {activePlan.schedule?.milestones && activePlan.schedule.milestones.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-xs uppercase font-bold text-slate-400">Milestone Timeline</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {activePlan.schedule.milestones.map((m, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-dark-panel border border-dark-border flex items-center justify-between">
                    <div>
                      <span className="text-violet-300 font-semibold block">{m.stageTitle}</span>
                      <span className="text-[11px] text-slate-400">Target: Week {m.targetWeek}</span>
                    </div>
                    <span className="text-slate-400 text-[11px] font-mono">~{m.estimatedHours}h</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* All Saved Plans */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>All Roadmaps in Your Library</span>
          <span className="text-xs font-mono text-slate-400">({plans.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map(p => {
            const isActive = p.id === activePlan?.id;
            return (
              <div
                key={p.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-dark-card border-violet-500/50 shadow-glow-violet/20'
                    : 'bg-dark-panel border-dark-border hover:border-slate-600'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      isActive ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isActive ? 'Active' : 'Saved'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Created {new Date(p.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-white">{p.canonicalGoal}</h4>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{p.learnerProfile?.hoursPerWeek || 10}h / week</span>
                    <span>•</span>
                    <span>{p.learnerProfile?.targetWeeks || 8} weeks target</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-dark-border flex items-center justify-between">
                  <button
                    onClick={() => handleOpenScheduleModal(p)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Schedule</span>
                  </button>

                  {!isActive && (
                    <button
                      onClick={() => onSelectPlan(p.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-dark-card border border-dark-border hover:border-violet-500 text-slate-200 hover:text-white text-xs font-medium transition-all cursor-pointer"
                    >
                      Make Active
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Adjust Schedule Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-dark-panel border border-violet-500/40 rounded-2xl max-w-md w-full p-6 shadow-glow-violet space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Adjust Learning Pace</h3>
              <p className="text-xs text-slate-400">
                Update availability for "{editingPlan.canonicalGoal}". Completed quest milestones remain saved.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Hours per week */}
              <div className="space-y-2">
                <div className="flex justify-between font-semibold text-slate-200">
                  <span>Weekly Time Availability:</span>
                  <span className="text-cyan-accent font-mono">{newHours} hrs / week</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={40}
                  step={1}
                  value={newHours}
                  onChange={e => setNewHours(Number(e.target.value))}
                  className="w-full accent-violet-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>3h (Casual)</span>
                  <span>10h (Balanced)</span>
                  <span>40h (Bootcamp)</span>
                </div>
              </div>

              {/* Target Weeks */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between font-semibold text-slate-200">
                  <span>Target Deadline / Timeline:</span>
                  <span className="text-violet-300 font-mono">{newWeeks} weeks</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={24}
                  step={1}
                  value={newWeeks}
                  onChange={e => setNewWeeks(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>2w (Sprint)</span>
                  <span>8w (2 Months)</span>
                  <span>24w (Semester)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingPlan(null)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSchedule}
                disabled={isUpdating}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-glow-violet transition-all cursor-pointer"
              >
                {isUpdating ? 'Recalculating...' : 'Save & Recalculate'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
