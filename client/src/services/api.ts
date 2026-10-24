import {
  MasterRoadmap,
  UserPlan,
  UserProgress,
  LevelInfo,
  QuestActivityResponse,
  QuestCompletionDetail,
} from '../types';

const API_BASE = '/api';

export async function fetchRoadmaps(params?: { domain?: string; difficulty?: string; search?: string }): Promise<MasterRoadmap[]> {
  const query = new URLSearchParams();
  if (params?.domain) query.append('domain', params.domain);
  if (params?.difficulty) query.append('difficulty', params.difficulty);
  if (params?.search) query.append('search', params.search);

  const res = await fetch(`${API_BASE}/roadmaps?${query.toString()}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch roadmaps');
  return data.roadmaps;
}

export async function fetchRoadmapById(id: string): Promise<MasterRoadmap> {
  const res = await fetch(`${API_BASE}/roadmaps/${id}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch roadmap');
  return data.roadmap;
}

export async function matchOrCreateRoadmap(goal: string, learnerProfile?: any): Promise<{
  isReused: boolean;
  confidence: number;
  masterRoadmap: MasterRoadmap;
  userPlan: UserPlan;
  progress: UserProgress;
}> {
  const res = await fetch(`${API_BASE}/roadmaps/match-or-create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal, learnerProfile }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to create learning path');
  return data;
}

export async function fetchActivePlan(): Promise<{
  masterRoadmap: MasterRoadmap;
  userPlan: UserPlan;
  progress: UserProgress;
}> {
  const res = await fetch(`${API_BASE}/plans/active`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch active plan');
  return data;
}

export async function fetchUserPlans(): Promise<UserPlan[]> {
  const res = await fetch(`${API_BASE}/plans`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch user plans');
  return data.plans;
}

export async function selectUserPlan(planId: string): Promise<UserPlan> {
  const res = await fetch(`${API_BASE}/plans/${planId}/select`, { method: 'POST' });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to select plan');
  return data.plan;
}

export async function updatePlanSchedule(planId: string, hoursPerWeek: number, targetWeeks: number): Promise<UserPlan> {
  const res = await fetch(`${API_BASE}/plans/${planId}/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hoursPerWeek, targetWeeks }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to update schedule');
  return data.plan;
}

export async function completeNode(planId: string, nodeId: string, xpAward = 100): Promise<{
  alreadyCompleted: boolean;
  earnedXP: number;
  progress: UserProgress;
  levelInfo?: LevelInfo;
  newAchievements?: any[];
}> {
  const res = await fetch(`${API_BASE}/progress/complete-node`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, nodeId, xpAward }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to complete node');
  return data;
}

export async function toggleBookmark(planId: string, resourceId: string): Promise<{
  isBookmarked: boolean;
  bookmarkedResourceIds: string[];
  newAchievements?: any[];
}> {
  const res = await fetch(`${API_BASE}/progress/bookmark`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, resourceId }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to bookmark');
  return data;
}

export async function toggleStreakFreeze(planId: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/progress/streak-freeze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to toggle streak freeze');
  return data.streakFrozen;
}

export async function submitAssessment(
  planId: string,
  nodeId: string,
  answers: number[],
  submissionText = ''
): Promise<{
  passed: boolean;
  score: number;
  totalQuestions: number;
  scorePercent: number;
  earnedXP: number;
  explanations: any[];
  progress: UserProgress;
  newAchievements?: any[];
}> {
  const res = await fetch(`${API_BASE}/assessments/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, nodeId, answers, submissionText }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to submit assessment');
  return data;
}

export async function chatWithMentor(params: {
  sessionId: string;
  userMessage?: string;
  currentQuest?: any;
  userGoal?: string;
  completedNodes?: string[];
  learnerProfile?: any;
  progressionLevel?: 'hint' | 'example' | 'solution' | null;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/mentor/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to chat with mentor');
  return data.reply;
}

export async function fetchUserStats(): Promise<any> {
  const res = await fetch(`${API_BASE}/user/stats`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch user stats');
  return data;
}

export async function fetchQuestActivity(): Promise<QuestActivityResponse> {
  const res = await fetch(`${API_BASE}/activity`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || `Failed to fetch quest activity (${res.status})`);
  }
  if (!Array.isArray(data.activity) || typeof data.endDate !== 'string') {
    throw new Error('The server returned invalid quest activity data');
  }
  return { activity: data.activity, endDate: data.endDate };
}

export async function fetchQuestCompletions(date: string): Promise<QuestCompletionDetail[]> {
  const res = await fetch(`${API_BASE}/activity/${encodeURIComponent(date)}`);
  const data = await res.json();
  if (!res.ok || !data.success || !Array.isArray(data.completions)) {
    throw new Error(data.error || `Failed to fetch quest details (${res.status})`);
  }
  return data.completions;
}
