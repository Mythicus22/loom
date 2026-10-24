import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  CheckCircle2, 
  Award, 
  Play, 
  Sliders, 
  Clock, 
  Calendar, 
  Layers, 
  Trophy, 
  BarChart3, 
  Settings, 
  RotateCcw, 
  BookOpen, 
  ArrowRight,
  User,
  Sparkles,
  Save,
  Check
} from 'lucide-react';
import { MasterRoadmap, UserPlan, UserProgress, LevelInfo, LearnerProfile } from '../types';
import { 
  fetchUserPlans, 
  selectUserPlan, 
  updatePlanSchedule, 
  toggleStreakFreeze,
  fetchUserStats 
} from '../services/api';

interface DashboardPageProps {
  activePlan: UserPlan | null;
  activeRoadmap: MasterRoadmap | null;
  progress: UserProgress;
  levelInfo: LevelInfo;
  onResumeRoadmap: () => void;
  onExploreRoadmaps: () => void;
  onSelectPlan: (planId: string) => void;
  onUpdateProgress: (progress: UserProgress) => void;
  onResetDemo: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  activePlan,
  activeRoadmap,
  progress,
  levelInfo,
  onResumeRoadmap,
  onExploreRoadmaps,
  onSelectPlan,
  onUpdateProgress,
  onResetDemo,
}) => {
  const [activeTab, setActiveTab] = useState<'journeys' | 'analytics' | 'gamification' | 'preferences'>('journeys');
  const [plans, setPlans] = useState<UserPlan[]>([]);
  const [editingPlan, setEditingPlan] = useState<UserPlan | null>(null);
  const [newHours, setNewHours] = useState(10);
  const [newWeeks, setNewWeeks] = useState(8);
  const [isUpdatingSchedule, setIsUpdatingSchedule] = useState(false);
  const [savedPrefSuccess, setSavedPrefSuccess] = useState(false);

  const [profileForm, setProfileForm] = useState<LearnerProfile>({
    experienceLevel: activePlan?.learnerProfile?.experienceLevel || 'Beginner',
    hoursPerWeek: activePlan?.learnerProfile?.hoursPerWeek || 10,
    targetWeeks: activePlan?.learnerProfile?.targetWeeks || 8,
    preferredFormat: activePlan?.learnerProfile?.preferredFormat || 'mixed',
    desiredOutcome: activePlan?.learnerProfile?.desiredOutcome || 'projects',
  });

  const loadPlans = async () => {
    try {
      const data = await fetchUserPlans();
      setPlans(data);
    } catch (err) {
      console.error('Failed to load plans:', err);
    }
  };

  useEffect(() => {
    loadPlans();
  }, [activePlan]);

  const handleToggleFreeze = async () => {
    if (!activePlan) return;
    try {
      const isFrozen = await toggleStreakFreeze(activePlan.id);
      onUpdateProgress({
        ...progress,
        streakFrozen: isFrozen,
      });
    } catch (err) {
      console.error('Failed to toggle freeze:', err);
    }
  };

  const handleOpenScheduleModal = (plan: UserPlan) => {
    setEditingPlan(plan);
    setNewHours(plan.learnerProfile?.hoursPerWeek || 10);
    setNewWeeks(plan.learnerProfile?.targetWeeks || 8);
  };

  const handleSaveSchedule = async () => {
    if (!editingPlan) return;
    setIsUpdatingSchedule(true);
    try {
      await updatePlanSchedule(editingPlan.id, newHours, newWeeks);
      await loadPlans();
      setEditingPlan(null);
    } catch (err) {
      console.error('Failed to update schedule:', err);
    } finally {
      setIsUpdatingSchedule(false);
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    if (activePlan) {
      activePlan.learnerProfile = profileForm;
    }
    setSavedPrefSuccess(true);
    setTimeout(() => setSavedPrefSuccess(false), 2500);
  };

  const completedCount = progress.completedNodeIds?.length || 0;
  const verifiedCount = progress.verifiedNodeIds?.length || 0;
  const totalNodesCount = activeRoadmap?.nodes?.length || 1;
  const progressPercent = Math.min(100, Math.round((completedCount / totalNodesCount) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. Executive Hero Header & Gamification Stats */}
      {/* ------------------------------------------------------------- */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-950/40 via-dark-card to-dark-panel border border-violet-500/30 shadow-glow-violet space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 p-[1.5px] shadow-glow-violet">
              <div className="w-full h-full bg-dark-panel rounded-[14px] flex items-center justify-center font-black text-lg text-cyan-accent">
                {levelInfo.level}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">Learner Dashboard</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-violet-600/30 text-violet-300 border border-violet-500/40">
                  {levelInfo.title}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Track your learning journeys, streak resilience, skill mastery, and achievements.
              </p>
            </div>
          </div>

          {/* Quick Streak Freeze Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-panel border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Flame className="w-4 h-4 fill-amber-400 animate-pulse" />
              <span>{progress.streakDays} Day Streak</span>
            </div>

            <button
              onClick={handleToggleFreeze}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                progress.streakFrozen
                  ? 'bg-cyan-950/40 border-cyan-400 text-cyan-300 shadow-glow-cyan/20'
                  : 'bg-dark-panel border-dark-border text-slate-400 hover:text-white'
              }`}
              title="Equip Streak Freeze Shield to prevent streak break if a day is missed"
            >
              {progress.streakFrozen ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-cyan-accent" />
                  <span>Shield Armed</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-slate-400" />
                  <span>Arm Freeze Shield</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-slate-300">
              Rank: <span className="text-violet-300">{levelInfo.title}</span> (Level {levelInfo.level})
            </span>
            <span className="font-mono text-amber-400 font-bold">
              {progress.xp} XP / {levelInfo.nextLevelXP} XP
            </span>
          </div>
          <div className="w-full bg-dark-bg rounded-full h-2.5 overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 transition-all duration-500 shadow-glow-cyan/50"
              style={{ width: `${levelInfo.progressPercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>{levelInfo.progressPercent}% to Level {levelInfo.level + 1}</span>
            <span>{verifiedCount} Verified Masteries • {completedCount} Quests Cleared</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. Quick Resume Active Journey Widget */}
      {/* ------------------------------------------------------------- */}
      {activePlan && activeRoadmap && (
        <div className="p-5 rounded-2xl bg-dark-card border-2 border-violet-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-glow-violet/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-violet-600 text-white">
                Active Roadmap
              </span>
              <span className="text-xs text-slate-400">
                Pace: {activePlan.schedule?.weeklyHours || 10}h / week
              </span>
            </div>
            <h2 className="text-xl font-black text-white">{activeRoadmap.canonicalGoal}</h2>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>{completedCount} of {totalNodesCount} Quests Cleared</span>
              <span>•</span>
              <span className="text-emerald-400 font-mono font-bold">{progressPercent}% Completed</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleOpenScheduleModal(activePlan)}
              className="px-4 py-2 rounded-xl bg-dark-panel border border-violet-500/40 hover:border-violet-400 text-violet-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-accent" />
              <span>Adjust Pace</span>
            </button>

            <button
              onClick={onResumeRoadmap}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs flex items-center gap-2 shadow-glow-violet transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Resume Quest Map</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. Dashboard Navigation Tabs */}
      {/* ------------------------------------------------------------- */}
      <div className="border-b border-dark-border flex items-center gap-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('journeys')}
          className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'journeys'
              ? 'border-violet-accent text-violet-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4 text-violet-400" />
          <span>Saved Roadmaps ({plans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'analytics'
              ? 'border-violet-accent text-violet-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-cyan-accent" />
          <span>Mastery & Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('gamification')}
          className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'gamification'
              ? 'border-violet-accent text-violet-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Daily Quests & Trophies ({progress.achievements?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'preferences'
              ? 'border-violet-accent text-violet-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Preferences & Environment</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. Tab 1: Saved Roadmaps & Schedules */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'journeys' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Your Saved Roadmaps</h3>
            <button
              onClick={onExploreRoadmaps}
              className="text-xs text-cyan-accent hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Master Roadmap Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map(p => {
              const isActive = p.id === activePlan?.id;
              return (
                <div
                  key={p.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isActive
                      ? 'bg-dark-card border-violet-500/50 shadow-glow-violet/20'
                      : 'bg-dark-panel border-dark-border hover:border-slate-600'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                        isActive ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isActive ? 'Active Quest' : 'Saved Plan'}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        Target: {p.learnerProfile?.targetWeeks || 8} weeks
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-white">{p.canonicalGoal}</h4>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{p.learnerProfile?.hoursPerWeek || 10} hrs / week</span>
                      <span>•</span>
                      <span className="capitalize">{p.learnerProfile?.experienceLevel || 'Beginner'}</span>
                      <span>•</span>
                      <span className="capitalize">{p.learnerProfile?.preferredFormat || 'Mixed'}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-dark-border flex items-center justify-between">
                    <button
                      onClick={() => handleOpenScheduleModal(p)}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5 text-cyan-accent" />
                      <span>Adjust Pace</span>
                    </button>

                    {isActive ? (
                      <button
                        onClick={onResumeRoadmap}
                        className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-glow-violet cursor-pointer"
                      >
                        Open Map
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectPlan(p.id)}
                        className="px-4 py-1.5 rounded-lg bg-dark-card border border-dark-border hover:border-violet-500 text-slate-200 hover:text-white text-xs font-medium cursor-pointer"
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
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. Tab 2: Mastery & Analytics */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Stage breakdown */}
          {activeRoadmap && (
            <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-400" />
                <span>Skill Mastery Breakdown: {activeRoadmap.canonicalGoal}</span>
              </h3>

              <div className="space-y-3">
                {(activeRoadmap.stages || []).map((stage, idx) => {
                  const stageNodes = activeRoadmap.nodes.filter(n => n.stageId === stage.id);
                  const stageCompleted = stageNodes.filter(n => progress.completedNodeIds.includes(n.id)).length;
                  const stagePercent = stageNodes.length > 0 
                    ? Math.round((stageCompleted / stageNodes.length) * 100) 
                    : 0;

                  return (
                    <div key={stage.id} className="p-4 rounded-xl bg-dark-panel border border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }}></span>
                          <span className="font-bold text-white">Stage {idx + 1}: {stage.title}</span>
                        </div>
                        <span className="font-mono text-slate-300">
                          {stageCompleted} / {stageNodes.length} Quests ({stagePercent}%)
                        </span>
                      </div>
                      <div className="w-full bg-dark-bg rounded-full h-2 overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-gradient-to-r from-violet-600 to-cyan-400 transition-all duration-500"
                          style={{ width: `${stagePercent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Assessment history */}
          <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-accent" />
              <span>Assessment & Quiz Verification History</span>
            </h3>

            {progress.assessmentAttempts?.length === 0 ? (
              <p className="text-xs text-slate-400 py-3">
                No quizzes attempted yet. Click on any quest node on your skill tree to verify mastery and earn XP!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-dark-border text-slate-400">
                      <th className="py-2.5 font-semibold">Quest Objective</th>
                      <th className="py-2.5 font-semibold">Status</th>
                      <th className="py-2.5 font-semibold">Score</th>
                      <th className="py-2.5 font-semibold">XP Award</th>
                      <th className="py-2.5 font-semibold">Attempt Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border text-slate-200">
                    {(progress.assessmentAttempts || []).slice(-6).reverse().map((att, idx) => (
                      <tr key={idx} className="hover:bg-dark-hover/50 transition-colors">
                        <td className="py-3 font-medium text-slate-100">{att.nodeId}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            att.passed 
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' 
                              : 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                          }`}>
                            {att.passed ? 'PASSED' : 'RETRY'}
                          </span>
                        </td>
                        <td className="py-3 font-mono">{att.score} / {att.totalQuestions}</td>
                        <td className="py-3 font-mono text-amber-400 font-semibold">+{att.earnedXP} XP</td>
                        <td className="py-3 text-slate-400 text-[11px]">
                          {new Date(att.attemptedAt || Date.now()).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. Tab 3: Daily Quests & Trophies */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'gamification' && (
        <div className="space-y-6">
          {/* Daily Quests */}
          <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-accent" />
                <span>Today's Daily Quest Objectives</span>
              </h3>
              <span className="text-xs font-mono text-amber-400">+160 XP Available</span>
            </div>

            <div className="space-y-2.5">
              {(progress.dailyQuests || []).map((dq, idx) => (
                <div
                  key={dq.id || idx}
                  className="p-3.5 rounded-xl bg-dark-panel border border-dark-border flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`w-4 h-4 ${dq.completed ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className={dq.completed ? 'line-through text-slate-500 font-medium' : 'text-slate-200'}>
                      {dq.title}
                    </span>
                  </div>
                  <span className="text-amber-400 font-mono font-semibold">+{dq.xp} XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trophies Grid */}
          <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Unlocked Trophies & Badges ({progress.achievements?.length || 0})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(progress.achievements || []).map((ach, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-dark-panel border border-violet-500/30 flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-violet-600/20 text-cyan-accent flex items-center justify-center shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">{ach.title}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">{ach.description}</p>
                    <span className="text-[10px] text-violet-400 mt-1 block">
                      Unlocked {new Date(ach.unlockedAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 7. Tab 4: Preferences & Demo Environment */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <form onSubmit={handleSavePreferences} className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-violet-400" />
              <span>Learner Baseline Preferences</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Experience Baseline</label>
                <select
                  value={profileForm.experienceLevel}
                  onChange={e => setProfileForm({ ...profileForm, experienceLevel: e.target.value as any })}
                  className="w-full bg-dark-panel border border-dark-border rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-violet-500"
                >
                  <option value="Beginner">Absolute Beginner (Foundational start)</option>
                  <option value="Intermediate">Intermediate (Skip basic syntax, dive into core logic)</option>
                  <option value="Advanced">Advanced (Fast-track to master capstone)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Preferred Resource Format</label>
                <select
                  value={profileForm.preferredFormat}
                  onChange={e => setProfileForm({ ...profileForm, preferredFormat: e.target.value as any })}
                  className="w-full bg-dark-panel border border-dark-border rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-violet-500"
                >
                  <option value="mixed">Mixed (Curated docs, videos & exercises)</option>
                  <option value="hands-on">Hands-on (Code projects & practical tasks)</option>
                  <option value="videos">Videos (Visual lectures & walkthroughs)</option>
                  <option value="reading">Reading (Official docs & in-depth guides)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-2 shadow-glow-violet transition-all cursor-pointer"
              >
                {savedPrefSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Preferences Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Preferences</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Reset Demo Controls */}
          <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <span>Reset Demo State</span>
            </h3>
            <p className="text-xs text-slate-400">
              Clear your active session and restart a fresh conversational onboarding session from the homepage.
            </p>
            <button
              type="button"
              onClick={onResetDemo}
              className="px-4 py-2 rounded-xl bg-dark-panel border border-rose-500/40 hover:border-rose-400 text-rose-300 hover:text-white text-xs font-semibold cursor-pointer"
            >
              Reset Progress & Return to Onboarding
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Adjust Schedule Modal */}
      {/* ------------------------------------------------------------- */}
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
              <div className="space-y-2">
                <div className="flex justify-between font-semibold text-slate-200">
                  <span>Weekly Time Commitment:</span>
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
                  <span>10h (Steady)</span>
                  <span>40h (Bootcamp)</span>
                </div>
              </div>

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
                disabled={isUpdatingSchedule}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-glow-violet cursor-pointer"
              >
                {isUpdatingSchedule ? 'Recalculating...' : 'Save & Recalculate'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
