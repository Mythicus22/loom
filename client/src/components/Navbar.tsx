import React from 'react';
import { 
  Compass, 
  Map, 
  LayoutDashboard, 
  Flame,
  Users
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'roadmap' | 'dashboard' | 'community';
  onSelectTab: (tab: 'home' | 'roadmap' | 'dashboard' | 'community') => void;
  hasActiveRoadmap: boolean;
  activeRoadmapTitle?: string;
  xp: number;
  level: number;
  streakDays: number;
  streakFrozen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  hasActiveRoadmap,
  activeRoadmapTitle,
  xp,
  level,
  streakDays,
  streakFrozen,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-dark-border bg-dark-bg/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Main Brand Logo */}
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

        {/* Focused navigation links */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
          
          {/* Active Roadmap Pill (Contextual when a roadmap is loaded) */}
          {hasActiveRoadmap && (
            <button
              onClick={() => onSelectTab('roadmap')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                currentTab === 'roadmap'
                  ? 'bg-violet-accent/20 text-violet-300 border border-violet-500/50 shadow-glow-violet/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-dark-hover'
              }`}
            >
              <Map className="w-4 h-4 text-cyan-accent" />
              <span>Roadmap</span>
            </button>
          )}

          {/* Dashboard */}
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-violet-accent/20 text-violet-300 border border-violet-500/50 shadow-glow-violet/20 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-dark-hover'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-cyan-accent" />
            <span>Dashboard</span>
          </button>

          {/* Community */}
          <button
            onClick={() => onSelectTab('community')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              currentTab === 'community'
                ? 'bg-violet-accent/20 text-violet-300 border border-violet-500/50 shadow-glow-violet/20 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-dark-hover'
            }`}
          >
            <Users className="w-4 h-4 text-cyan-accent" />
            <span>Community</span>
          </button>

        </nav>

        {/* Right Corner: Quick Hero Stat Pill */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-panel border border-violet-500/30 hover:border-violet-400 transition-all text-xs cursor-pointer"
            title="View Dashboard & Rank Stats"
          >
            <div className="w-5 h-5 rounded-md bg-violet-600/30 border border-violet-500/40 flex items-center justify-center font-bold text-violet-300">
              {level}
            </div>
            <span className="font-mono font-semibold text-slate-200 hidden sm:inline">{xp} XP</span>
            <div className="flex items-center gap-1 text-amber-400 pl-1 border-l border-dark-border">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-semibold">{streakDays}d</span>
            </div>
          </button>
        </div>

      </div>
    </header>
  );
};
