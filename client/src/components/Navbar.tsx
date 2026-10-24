import React from 'react';
import { 
  Compass, 
  Map, 
  Flame, 
  Award, 
  Sparkles, 
  PlusCircle, 
  User, 
  ShieldCheck, 
  BookOpen, 
  BarChart3,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'roadmap' | 'explore' | 'journey' | 'progress' | 'profile';
  onSelectTab: (tab: 'home' | 'roadmap' | 'explore' | 'journey' | 'progress' | 'profile') => void;
  xp: number;
  level: number;
  streakDays: number;
  streakFrozen: boolean;
  onOpenGamificationModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  xp,
  level,
  streakDays,
  streakFrozen,
  onOpenGamificationModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-dark-border bg-dark-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 p-[1.5px] shadow-glow-violet transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-dark-panel rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-cyan-accent group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                QuestPath
              </span>
              <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-violet-accent/20 text-violet-300 border border-violet-500/30">
                AI RPG
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Adaptive Learning Roadmaps</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all ${
              currentTab === 'home'
                ? 'bg-violet-accent/15 text-violet-300 border border-violet-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-dark-hover'
            }`}
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>AI Chat</span>
          </button>

          <button
            onClick={() => onSelectTab('roadmap')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all ${
              currentTab === 'roadmap'
                ? 'bg-violet-accent/15 text-violet-300 border border-violet-500/30 shadow-glow-violet/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-dark-hover'
            }`}
          >
            <Map className="w-4 h-4 text-cyan-accent" />
            <span>Active Quest Map</span>
          </button>

          <button
            onClick={() => onSelectTab('explore')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all ${
              currentTab === 'explore'
                ? 'bg-violet-accent/15 text-violet-300 border border-violet-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-dark-hover'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Explore Roadmaps</span>
          </button>

          <button
            onClick={() => onSelectTab('journey')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all ${
              currentTab === 'journey'
                ? 'bg-violet-accent/15 text-violet-300 border border-violet-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-dark-hover'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>My Journey</span>
          </button>

          <button
            onClick={() => onSelectTab('progress')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all ${
              currentTab === 'progress'
                ? 'bg-violet-accent/15 text-violet-300 border border-violet-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-dark-hover'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Progress</span>
          </button>
        </nav>

        {/* Gamification Status & Profile */}
        <div className="flex items-center gap-3">
          
          {/* Streak indicator */}
          <button
            onClick={onOpenGamificationModal}
            title={`Current streak: ${streakDays} days. ${streakFrozen ? 'Streak Freeze Active!' : 'Streak active.'}`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-dark-panel border border-amber-500/30 hover:border-amber-400/60 transition-all text-xs font-semibold text-amber-400 group cursor-pointer"
          >
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform animate-pulse" />
            <span>{streakDays}d</span>
            {streakFrozen && (
              <span title="Streak Freeze Shield Equipped">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-accent" />
              </span>
            )}
          </button>

          {/* Level & XP pill */}
          <button
            onClick={onOpenGamificationModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-panel border border-violet-500/30 hover:border-violet-400 transition-all text-xs cursor-pointer"
          >
            <div className="w-5 h-5 rounded-md bg-violet-600/30 border border-violet-500/40 flex items-center justify-center font-bold text-violet-300">
              {level}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Level {level}</span>
              <span className="font-semibold text-slate-200">{xp} XP</span>
            </div>
          </button>

          {/* Quick "New Quest" Button */}
          <button
            onClick={() => onSelectTab('home')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-xs transition-all shadow-glow-violet/30 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Goal</span>
          </button>

          {/* Profile Avatar / Settings */}
          <button
            onClick={() => onSelectTab('profile')}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
              currentTab === 'profile'
                ? 'border-violet-accent bg-violet-600/20 text-violet-300'
                : 'border-dark-border bg-dark-panel text-slate-300 hover:border-slate-600 hover:text-white'
            }`}
            title="Profile & Preferences"
          >
            <User className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-dark-border bg-dark-panel/90 text-xs">
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center gap-0.5 ${currentTab === 'home' ? 'text-violet-400 font-bold' : 'text-slate-400'}`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Chat</span>
        </button>
        <button
          onClick={() => onSelectTab('roadmap')}
          className={`flex flex-col items-center gap-0.5 ${currentTab === 'roadmap' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          <Map className="w-4 h-4" />
          <span>Quest Map</span>
        </button>
        <button
          onClick={() => onSelectTab('explore')}
          className={`flex flex-col items-center gap-0.5 ${currentTab === 'explore' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Explore</span>
        </button>
        <button
          onClick={() => onSelectTab('journey')}
          className={`flex flex-col items-center gap-0.5 ${currentTab === 'journey' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Journey</span>
        </button>
        <button
          onClick={() => onSelectTab('progress')}
          className={`flex flex-col items-center gap-0.5 ${currentTab === 'progress' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Stats</span>
        </button>
      </div>
    </header>
  );
};
