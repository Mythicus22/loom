import React from 'react';
import { 
  X, 
  Flame, 
  ShieldCheck, 
  ShieldAlert, 
  Award, 
  Zap, 
  CheckCircle2, 
  Crown, 
  Sparkles, 
  Calendar, 
  HelpCircle,
  Trophy
} from 'lucide-react';
import { UserProgress, LevelInfo } from '../types';

interface StreakAndGamificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  levelInfo: LevelInfo;
  onToggleStreakFreeze: () => void;
}

export const StreakAndGamificationModal: React.FC<StreakAndGamificationModalProps> = ({
  isOpen,
  onClose,
  progress,
  levelInfo,
  onToggleStreakFreeze,
}) => {
  if (!isOpen) return null;

  const achievements = progress.achievements || [];
  const dailyQuests = progress.dailyQuests || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-dark-panel border border-violet-500/30 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-glow-violet overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-dark-border bg-dark-card/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-amber-500 p-[1px]">
              <div className="w-full h-full bg-dark-panel rounded-[10px] flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <span>Hero Stats & Quests</span>
              </h3>
              <p className="text-xs text-slate-400">Level, Daily Quests & Streak Resilience</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-hover transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Level Progress Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-violet-950/40 via-dark-card to-dark-panel border border-violet-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-violet-400">Current Rank</span>
                <h4 className="text-lg font-black text-white">{levelInfo.title}</h4>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-amber-400">{progress.xp} XP Total</span>
                <span className="text-[11px] text-slate-400 block">Next: {levelInfo.nextLevelXP} XP</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="w-full bg-dark-bg rounded-full h-2 overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-violet-600 to-cyan-400 transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Level {levelInfo.level}</span>
                <span>{levelInfo.progressPercent}% to Level {levelInfo.level + 1}</span>
              </div>
            </div>
          </div>

          {/* Streak & Forgiving Recovery System */}
          <div className="p-4 rounded-xl bg-dark-card border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Flame className="w-6 h-6 fill-amber-400 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{progress.streakDays} Day Learning Streak!</h4>
                  <p className="text-[11px] text-slate-400">Practice daily to compound your skills.</p>
                </div>
              </div>

              {/* Streak Freeze Toggle */}
              <button
                onClick={onToggleStreakFreeze}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  progress.streakFrozen
                    ? 'bg-cyan-950/40 border-cyan-400 text-cyan-300 shadow-glow-cyan/20'
                    : 'bg-dark-panel border-dark-border text-slate-400 hover:text-white'
                }`}
                title="Equip Streak Freeze to protect against missed days"
              >
                {progress.streakFrozen ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-cyan-accent" />
                    <span>Shield Armed</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4 text-slate-400" />
                    <span>Arm Shield</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-2.5 rounded-lg bg-dark-bg/60 border border-white/5 text-[11px] text-slate-400">
              🛡️ <strong>Forgiving Recovery:</strong> If life gets busy and you miss a day, your equipped Streak Freeze automatically protects your streak from breaking!
            </div>
          </div>

          {/* Daily Quests Checklist */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-accent" />
                <span>Today's Daily Quests</span>
              </h4>
              <span className="text-[11px] text-amber-400 font-mono">+160 XP Available</span>
            </div>

            <div className="space-y-2">
              {dailyQuests.map((dq, idx) => (
                <div
                  key={dq.id || idx}
                  className="p-3 rounded-xl bg-dark-card border border-dark-border flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
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

          {/* Achievements Trophy Grid */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Unlocked Achievements ({achievements.length})</span>
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {achievements.map((ach, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-dark-card border border-violet-500/30 flex items-start gap-2.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-violet-600/20 text-violet-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-4 h-4 text-cyan-accent" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-100 leading-tight">{ach.title}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-dark-border bg-dark-card/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-glow-violet cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
