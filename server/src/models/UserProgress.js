import mongoose from 'mongoose';

const AssessmentAttemptSchema = new mongoose.Schema({
  nodeId: { type: String, required: true },
  passed: { type: Boolean, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  answers: [{ type: Number }],
  feedback: { type: String, default: '' },
  earnedXP: { type: Number, default: 0 },
  attemptedAt: { type: Date, default: Date.now },
}, { _id: false });

const AchievementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'award' },
  unlockedAt: { type: Date, default: Date.now },
}, { _id: false });

const DailyQuestSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  xp: { type: Number, default: 50 },
  completed: { type: Boolean, default: false },
}, { _id: false });

const CompletionEventSchema = new mongoose.Schema({
  nodeId: { type: String, required: true },
  nodeTitle: { type: String, required: true },
  roadmapName: { type: String, required: true },
  completedAt: { type: Date, required: true },
}, { _id: false });

const UserProgressSchema = new mongoose.Schema({
  userId: { type: String, default: 'default_hero', index: true },
  planId: { type: String, required: true, index: true },
  completedNodeIds: [{ type: String }],
  completionEvents: { type: [CompletionEventSchema], default: [] },
  verifiedNodeIds: [{ type: String }],
  bookmarkedResourceIds: [{ type: String }],
  completedResourceIds: [{ type: String }],
  assessmentAttempts: [AssessmentAttemptSchema],
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streakDays: { type: Number, default: 3 },
  streakFrozen: { type: Boolean, default: false },
  lastActiveDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  achievements: [AchievementSchema],
  dailyQuests: [DailyQuestSchema],
}, { timestamps: true });

export const UserProgress = mongoose.model('UserProgress', UserProgressSchema);
