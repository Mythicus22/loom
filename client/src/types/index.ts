export interface Resource {
  id: string;
  title: string;
  url: string;
  source: string;
  type: 'video' | 'documentation' | 'article' | 'interactive' | 'project' | 'course';
  duration: string;
  difficulty: string;
  description: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PracticalTask {
  title: string;
  instructions: string;
  acceptanceCriteria: string[];
  starterCode?: string;
  deliverableType: 'quiz' | 'code' | 'github_url' | 'reflection';
}

export interface RoadmapNode {
  id: string;
  stageId: string;
  title: string;
  subtitle?: string;
  level: number;
  xp: number;
  isOptional: boolean;
  position: { x: number; y: number };
  prerequisites: string[];
  description: string;
  whyItMatters: string;
  whatYouWillLearn: string[];
  estimatedMinutes: number;
  resources: Resource[];
  practicalTask: PracticalTask;
  assessment?: {
    type: string;
    questions: AssessmentQuestion[];
  };
}

export interface Stage {
  id: string;
  title: string;
  description: string;
  order: number;
  color: string;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  isOptional?: boolean;
}

export interface MasterRoadmap {
  id: string;
  canonicalGoal: string;
  aliases: string[];
  domain: string;
  difficulty: string;
  targetOutcomes: string[];
  version: number;
  estimatedHours: number;
  stages: Stage[];
  nodes: RoadmapNode[];
  edges: Edge[];
  tags: string[];
  isGenerated?: boolean;
}

export interface LearnerProfile {
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  hoursPerWeek: number;
  targetWeeks: number;
  preferredFormat: 'mixed' | 'videos' | 'reading' | 'hands-on';
  desiredOutcome: 'job-ready' | 'projects' | 'interviews' | 'conceptual';
}

export interface Milestone {
  stageId: string;
  stageTitle: string;
  targetWeek: number;
  estimatedHours: number;
}

export interface UserPlan {
  id: string;
  userId: string;
  masterRoadmapId: string;
  canonicalGoal: string;
  userGoalRaw?: string;
  learnerProfile: LearnerProfile;
  schedule: {
    startDate: string;
    targetEndDate: string;
    weeklyHours: number;
    totalEstimatedHours: number;
    milestones: Milestone[];
  };
  customizations: {
    skippedNodeIds: string[];
    priorityNodeIds: string[];
    optionalNodeIds: string[];
  };
  currentQuestId: string;
  status: 'active' | 'completed' | 'paused';
  createdAt?: string;
  updatedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
}

export interface AssessmentAttempt {
  nodeId: string;
  passed: boolean;
  score: number;
  totalQuestions: number;
  answers: number[];
  feedback: string;
  earnedXP: number;
  attemptedAt: string;
}

export interface UserProgress {
  userId: string;
  planId: string;
  completedNodeIds: string[];
  verifiedNodeIds: string[];
  bookmarkedResourceIds: string[];
  completedResourceIds: string[];
  assessmentAttempts: AssessmentAttempt[];
  xp: number;
  level: number;
  streakDays: number;
  streakFrozen: boolean;
  lastActiveDate: string;
  achievements: Achievement[];
  dailyQuests: DailyQuest[];
}

export interface QuestActivityDay {
  date: string;
  count: number;
}

export interface QuestActivityResponse {
  activity: QuestActivityDay[];
  endDate: string;
}

export interface QuestCompletionDetail {
  nodeId: string;
  nodeTitle: string;
  roadmapName: string;
  completedAt: string;
}

export interface LevelInfo {
  level: number;
  title: string;
  currentXP: number;
  minXP: number;
  nextLevelXP: number;
  progressPercent: number;
}
