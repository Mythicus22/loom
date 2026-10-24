import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Sparkles, 
  Sliders, 
  Bell, 
  RotateCcw, 
  Save, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { LearnerProfile, UserPlan } from '../types';

interface ProfilePageProps {
  plan: UserPlan | null;
  onUpdateProfile: (updatedProfile: LearnerProfile) => void;
  onResetDemo: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  plan,
  onUpdateProfile,
  onResetDemo,
}) => {
  const [profile, setProfile] = useState<LearnerProfile>({
    experienceLevel: plan?.learnerProfile?.experienceLevel || 'Beginner',
    hoursPerWeek: plan?.learnerProfile?.hoursPerWeek || 10,
    targetWeeks: plan?.learnerProfile?.targetWeeks || 8,
    preferredFormat: plan?.learnerProfile?.preferredFormat || 'mixed',
    desiredOutcome: plan?.learnerProfile?.desiredOutcome || 'projects',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-500/30 text-violet-300 text-xs font-semibold">
          <Settings className="w-3.5 h-3.5" />
          <span>Learner Profile & Preferences</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Profile & Adaptive Settings
        </h1>
        <p className="text-sm text-slate-400">
          Customize how QuestPath tailors your roadmaps, curates resources, and schedules milestones.
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Experience & Pace */}
        <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-violet-400" />
            <span>Learning Style & Experience Baseline</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Experience level */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Experience Baseline</label>
              <select
                value={profile.experienceLevel}
                onChange={e => setProfile({ ...profile, experienceLevel: e.target.value as any })}
                className="w-full bg-dark-panel border border-dark-border rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-violet-500 transition-colors"
              >
                <option value="Beginner">Absolute Beginner (Start with fundamentals)</option>
                <option value="Intermediate">Intermediate (Skip intro, jump into core logic)</option>
                <option value="Advanced">Advanced (Fast-track to master capstone)</option>
              </select>
            </div>

            {/* Preferred format */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Preferred Resource Format</label>
              <select
                value={profile.preferredFormat}
                onChange={e => setProfile({ ...profile, preferredFormat: e.target.value as any })}
                className="w-full bg-dark-panel border border-dark-border rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-violet-500 transition-colors"
              >
                <option value="mixed">Mixed (Curated mix of docs, videos & exercises)</option>
                <option value="hands-on">Hands-on (Code projects & practical tasks)</option>
                <option value="videos">Videos (Visual lectures & recorded walkthroughs)</option>
                <option value="reading">Reading (Official docs & in-depth articles)</option>
              </select>
            </div>

            {/* Target Outcome */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Primary Desired Outcome</label>
              <select
                value={profile.desiredOutcome}
                onChange={e => setProfile({ ...profile, desiredOutcome: e.target.value as any })}
                className="w-full bg-dark-panel border border-dark-border rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-violet-500 transition-colors"
              >
                <option value="projects">Build Working Portfolio Projects</option>
                <option value="interviews">Ace Technical Placement Interviews</option>
                <option value="job-ready">Professional Job Readiness</option>
                <option value="conceptual">Deep Conceptual Mastery</option>
              </select>
            </div>

            {/* Weekly Hours */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Weekly Hours Dedication</label>
              <input
                type="number"
                min={2}
                max={60}
                value={profile.hoursPerWeek}
                onChange={e => setProfile({ ...profile, hoursPerWeek: Number(e.target.value) })}
                className="w-full bg-dark-panel border border-dark-border rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-violet-500 transition-colors font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-2 shadow-glow-violet transition-all cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Preferences Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Profile Preferences</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Account & Demo Reset */}
        <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>Demo Data & Environment Controls</span>
          </h3>

          <p className="text-xs text-slate-400">
            QuestPath runs completely functional with real MongoDB persistence and preloaded master roadmaps. If you want to reset your learner state to test a fresh onboarding run, use the button below.
          </p>

          <button
            type="button"
            onClick={onResetDemo}
            className="px-4 py-2 rounded-xl bg-dark-panel border border-rose-500/40 hover:border-rose-400 text-rose-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Reset Progress & Start Fresh Demo
          </button>
        </div>

      </form>

    </div>
  );
};
