import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Award, 
  CheckCircle2, 
  Flame, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Trophy, 
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { MasterRoadmap, UserPlan, UserProgress, LevelInfo } from '../types';
import { fetchUserStats } from '../services/api';

interface ProgressPageProps {
  roadmap: MasterRoadmap | null;
  plan: UserPlan | null;
  progress: UserProgress;
  levelInfo: LevelInfo;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  roadmap,
  plan,
  progress,
  levelInfo,
}) => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchUserStats().then(setStats).catch(console.error);
  }, [progress]);

  const completedCount = progress.completedNodeIds?.length || 0;
  const verifiedCount = progress.verifiedNodeIds?.length || 0;
  const totalNodesCount = roadmap?.nodes?.length || 1;
  const progressPercent = Math.min(100, Math.round((completedCount / totalNodesCount) * 100));

  const attempts = progress.assessmentAttempts || [];
  const achievements = progress.achievements || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Learning Analytics & Verified Mastery</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Hero Progression & Mastery
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Detailed breakdown of your completed milestones, quiz performance, earned XP velocity, and unlocked trophies.
        </p>
      </div>

      {/* Top Key Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Total XP & Rank */}
        <div className="p-4 rounded-2xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Level {levelInfo.level}</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{progress.xp} XP</div>
          <span className="text-[11px] text-violet-400 font-medium">{levelInfo.title}</span>
        </div>

        {/* Current Streak */}
        <div className="p-4 rounded-2xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Daily Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{progress.streakDays} Days</div>
          <span className="text-[11px] text-slate-400">
            {progress.streakFrozen ? '🛡️ Shield Equipped' : 'Active Streak'}
          </span>
        </div>

        {/* Overall Completion */}
        <div className="p-4 rounded-2xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Roadmap Completion</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{progressPercent}%</div>
          <span className="text-[11px] text-slate-400">
            {completedCount} of {totalNodesCount} Quests Cleared
          </span>
        </div>

        {/* Verified Mastery */}
        <div className="p-4 rounded-2xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Verified Mastery</span>
            <Award className="w-4 h-4 text-cyan-accent" />
          </div>
          <div className="text-2xl font-black text-cyan-accent">{verifiedCount} Quests</div>
          <span className="text-[11px] text-slate-400">Validated by Assessment</span>
        </div>

      </div>

      {/* Stage Breakdown Progress */}
      {roadmap && (
        <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-violet-400" />
              <span>Skills & Stages Breakdown: {roadmap.canonicalGoal}</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              ~{roadmap.estimatedHours} hrs total
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {(roadmap.stages || []).map((stage, idx) => {
              const stageNodes = roadmap.nodes.filter(n => n.stageId === stage.id);
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
                      {stageCompleted} / {stageNodes.length} completed ({stagePercent}%)
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

      {/* Assessment History Table */}
      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-accent" />
          <span>Recent Assessment Performance</span>
        </h3>

        {attempts.length === 0 ? (
          <p className="text-xs text-slate-400 py-4">
            No assessment attempts yet. Click on any quest node on the map and choose "Start Assessment" to verify your mastery!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-dark-border text-slate-400">
                  <th className="py-2.5 font-semibold">Quest Node</th>
                  <th className="py-2.5 font-semibold">Result</th>
                  <th className="py-2.5 font-semibold">Score</th>
                  <th className="py-2.5 font-semibold">XP Award</th>
                  <th className="py-2.5 font-semibold">Attempt Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border text-slate-200">
                {attempts.slice(-6).reverse().map((att, idx) => (
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

      {/* Achievements Showcase */}
      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Trophies & Badges Collection</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {achievements.map((ach, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-dark-panel border border-violet-500/30 flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-600/20 text-cyan-accent flex items-center justify-center shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-white text-xs">{ach.title}</h5>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{ach.description}</p>
                <span className="text-[10px] text-violet-400 mt-1 block">
                  Unlocked {new Date(ach.unlockedAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
