import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AIHomeChat } from './components/AIHomeChat';
import { RoadmapViewPage } from './pages/RoadmapViewPage';
import { ExplorePage } from './pages/ExplorePage';
import { DashboardPage } from './pages/DashboardPage';
import { MasterRoadmap, UserPlan, UserProgress, LearnerProfile, LevelInfo } from './types';
import { 
  fetchActivePlan, 
  matchOrCreateRoadmap, 
  completeNode, 
  submitAssessment, 
  toggleBookmark, 
  toggleStreakFreeze,
  selectUserPlan 
} from './services/api';

export function App() {
  // Simplified executive tabs: home, roadmap, popular, dashboard
  const [currentTab, setCurrentTab] = useState<'home' | 'roadmap' | 'popular' | 'dashboard'>('home');
  const [activeRoadmap, setActiveRoadmap] = useState<MasterRoadmap | null>(null);
  const [activePlan, setActivePlan] = useState<UserPlan | null>(null);
  const [progress, setProgress] = useState<UserProgress>({
    userId: 'default_hero',
    planId: 'default',
    completedNodeIds: [],
    verifiedNodeIds: [],
    bookmarkedResourceIds: [],
    completedResourceIds: [],
    assessmentAttempts: [],
    xp: 0,
    level: 1,
    streakDays: 3,
    streakFrozen: true,
    lastActiveDate: new Date().toISOString().split('T')[0],
    achievements: [],
    dailyQuests: [],
  });

  const [levelInfo, setLevelInfo] = useState<LevelInfo>({
    level: 1,
    title: 'Novice Explorer',
    currentXP: 0,
    minXP: 0,
    nextLevelXP: 300,
    progressPercent: 0,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [bannerAlert, setBannerAlert] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Load initial active plan
  const loadInitialData = async () => {
    try {
      const data = await fetchActivePlan();
      if (data && data.masterRoadmap && data.userPlan) {
        setActiveRoadmap(data.masterRoadmap);
        setActivePlan(data.userPlan);
        if (data.progress) {
          setProgress(data.progress);
          calculateLocalLevel(data.progress.xp || 0);
        }
      }
    } catch (err) {
      console.warn('Initial plan load notice:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const calculateLocalLevel = (xp: number) => {
    const tiers = [
      { level: 1, name: 'Novice Explorer', minXP: 0, maxXP: 300 },
      { level: 2, name: 'Apprentice Quester', minXP: 300, maxXP: 700 },
      { level: 3, name: 'Adept Architect', minXP: 700, maxXP: 1200 },
      { level: 4, name: 'Specialist Vanguard', minXP: 1200, maxXP: 1800 },
      { level: 5, name: 'Master Developer', minXP: 1800, maxXP: 2500 },
      { level: 6, name: 'Grandmaster Sage', minXP: 2500, maxXP: 99999 },
    ];

    for (let i = tiers.length - 1; i >= 0; i--) {
      if (xp >= tiers[i].minXP) {
        const t = tiers[i];
        const nextT = tiers[i + 1];
        const pct = nextT ? Math.round(((xp - t.minXP) / (nextT.minXP - t.minXP)) * 100) : 100;
        setLevelInfo({
          level: t.level,
          title: t.name,
          currentXP: xp,
          minXP: t.minXP,
          nextLevelXP: nextT ? nextT.minXP : t.maxXP,
          progressPercent: pct,
        });
        return;
      }
    }
  };

  // Generate roadmap through conversational flow: Landing Page -> Roadmap
  const handleGenerateRoadmap = async (
    goal: string,
    profile: LearnerProfile,
    options: { deferNavigation?: boolean } = {}
  ): Promise<string> => {
    setIsGenerating(true);
    setGenerationStep('Finding the best roadmap for your goal...');

    try {
      const res = await matchOrCreateRoadmap(goal, profile);
      setGenerationStep('Preparing your personalized quest map...');
      setActiveRoadmap(res.masterRoadmap);
      setActivePlan(res.userPlan);
      setProgress(res.progress);
      calculateLocalLevel(res.progress.xp || 0);

      // Notification banner
      if (res.isReused) {
        setBannerAlert({
          text: `🎯 Reused verified Master Roadmap: "${res.masterRoadmap.canonicalGoal}" personalized for your ${profile.hoursPerWeek}h/wk pace.`,
          type: 'info',
        });
      } else {
        setBannerAlert({
          text: `✨ Brand new Master Roadmap generated, validated & saved to database for "${res.masterRoadmap.canonicalGoal}"!`,
          type: 'success',
        });
      }

      setTimeout(() => setBannerAlert(null), 6000);

      if (!options.deferNavigation) {
        setCurrentTab('roadmap');
      }
      return `Your personalized roadmap for ${res.masterRoadmap.canonicalGoal} is ready.`;
    } catch (err) {
      console.error('Failed to generate roadmap:', err);
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setBannerAlert({ text: `Roadmap generation failed: ${message}`, type: 'error' });
      throw err instanceof Error ? err : new Error(message);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Complete a quest node
  const handleCompleteQuest = async (nodeId: string, xpAward: number) => {
    if (!activePlan) return;
    try {
      const res = await completeNode(activePlan.id, nodeId, xpAward);
      if (res.progress) {
        setProgress(res.progress);
        calculateLocalLevel(res.progress.xp);
      }
      if (res.newAchievements && res.newAchievements.length > 0) {
        setBannerAlert({
          text: `🏆 Achievement Unlocked: ${res.newAchievements[0].title}!`,
          type: 'success',
        });
        setTimeout(() => setBannerAlert(null), 5000);
      }
      return res;
    } catch (err) {
      console.error('Failed to complete quest:', err);
    }
  };

  // Submit assessment
  const handleSubmitAssessment = async (planId: string, nodeId: string, answers: number[], submissionText: string) => {
    const res = await submitAssessment(planId, nodeId, answers, submissionText);
    if (res.progress) {
      setProgress(res.progress);
      calculateLocalLevel(res.progress.xp);
    }
    if (res.newAchievements && res.newAchievements.length > 0) {
      setBannerAlert({
        text: `🏆 Achievement Unlocked: ${res.newAchievements[0].title}!`,
        type: 'success',
      });
      setTimeout(() => setBannerAlert(null), 5000);
    }
    return res;
  };

  // Toggle bookmark
  const handleToggleBookmark = async (resourceId: string) => {
    if (!activePlan) return;
    try {
      const res = await toggleBookmark(activePlan.id, resourceId);
      setProgress(prev => ({
        ...prev,
        bookmarkedResourceIds: res.bookmarkedResourceIds,
      }));
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  // Select another plan
  const handleSelectPlan = async (planId: string) => {
    try {
      await selectUserPlan(planId);
      await loadInitialData();
      setCurrentTab('roadmap');
    } catch (err) {
      console.error('Failed to switch plan:', err);
    }
  };

  // Reset demo
  const handleResetDemo = () => {
    setCurrentTab('home');
    setActiveRoadmap(null);
    setActivePlan(null);
    setProgress({
      userId: 'default_hero',
      planId: 'default',
      completedNodeIds: [],
      verifiedNodeIds: [],
      bookmarkedResourceIds: [],
      completedResourceIds: [],
      assessmentAttempts: [],
      xp: 0,
      level: 1,
      streakDays: 3,
      streakFrozen: true,
      lastActiveDate: new Date().toISOString().split('T')[0],
      achievements: [],
      dailyQuests: [],
    });
    calculateLocalLevel(0);
    setBannerAlert({
      text: 'Demo session reset. Welcome back to the AI chatbot homepage!',
      type: 'info',
    });
    setTimeout(() => setBannerAlert(null), 4000);
  };

  return (
    <div className={`min-h-screen bg-dark-bg text-slate-100 flex flex-col font-sans ${currentTab === 'home' ? 'home-theme' : ''}`}>
      
      {/* Upgraded Clean Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        hasActiveRoadmap={Boolean(activeRoadmap && activePlan)}
        activeRoadmapTitle={activeRoadmap?.canonicalGoal}
        xp={progress.xp}
        level={levelInfo.level}
        streakDays={progress.streakDays}
        streakFrozen={progress.streakFrozen}
      />

      {/* Floating System Notification Alert */}
      {bannerAlert && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
          <div className={`p-4 rounded-xl border shadow-2xl text-xs font-semibold flex items-center gap-2.5 max-w-md ${
            bannerAlert.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : bannerAlert.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
                : 'bg-violet-950/90 border-violet-500/50 text-violet-200'
          }`}>
            <span>{bannerAlert.text}</span>
          </div>
        </div>
      )}

      {/* Main Page Flow: Landing Page -> Roadmap -> Popular / Dashboard */}
      <main className="flex-1 flex flex-col">
        {/* Main Landing Page: AI Chat Onboarding */}
        {currentTab === 'home' && (
          <AIHomeChat
            onGenerateRoadmap={handleGenerateRoadmap}
            onGenerationComplete={() => setCurrentTab('roadmap')}
            isGenerating={isGenerating}
            generationStep={generationStep}
          />
        )}

        {/* Central Roadmap Page: Interactive RPG Skill Tree with Draggable Nodes & Stretching Arrows */}
        {currentTab === 'roadmap' && (
          <RoadmapViewPage
            roadmap={activeRoadmap}
            plan={activePlan}
            progress={progress}
            onCompleteQuest={handleCompleteQuest}
            onSubmitAssessment={handleSubmitAssessment}
            onToggleBookmark={handleToggleBookmark}
            onOpenNewGoal={() => setCurrentTab('home')}
          />
        )}

        {/* Popular Master Roadmaps */}
        {currentTab === 'popular' && (
          <ExplorePage
            onStartRoadmap={(goal) => {
              handleGenerateRoadmap(goal, {
                experienceLevel: 'Beginner',
                hoursPerWeek: 10,
                targetWeeks: 8,
                preferredFormat: 'mixed',
                desiredOutcome: 'projects',
              });
            }}
          />
        )}

        {/* Consolidated Dashboard: Progress, Saved Roadmaps, Streaks, Daily Quests, Trophies & Preferences */}
        {currentTab === 'dashboard' && (
          <DashboardPage
            activePlan={activePlan}
            activeRoadmap={activeRoadmap}
            progress={progress}
            levelInfo={levelInfo}
            onResumeRoadmap={() => setCurrentTab('roadmap')}
            onExploreRoadmaps={() => setCurrentTab('popular')}
            onSelectPlan={handleSelectPlan}
            onUpdateProgress={setProgress}
            onResetDemo={handleResetDemo}
          />
        )}
      </main>

    </div>
  );
}
