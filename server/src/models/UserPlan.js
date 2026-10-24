import mongoose from 'mongoose';

const UserPlanSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, default: 'default_hero', index: true },
  masterRoadmapId: { type: String, required: true, ref: 'MasterRoadmap' },
  canonicalGoal: { type: String, required: true },
  userGoalRaw: { type: String, default: '' },
  learnerProfile: {
    experienceLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    hoursPerWeek: { type: Number, default: 10 },
    targetWeeks: { type: Number, default: 8 },
    preferredFormat: { type: String, enum: ['mixed', 'videos', 'reading', 'hands-on'], default: 'mixed' },
    desiredOutcome: { type: String, enum: ['job-ready', 'projects', 'interviews', 'conceptual'], default: 'projects' },
  },
  schedule: {
    startDate: { type: Date, default: Date.now },
    targetEndDate: { type: Date },
    weeklyHours: { type: Number, default: 10 },
    totalEstimatedHours: { type: Number, default: 40 },
    milestones: [{
      stageId: String,
      stageTitle: String,
      targetWeek: Number,
      estimatedHours: Number,
    }],
  },
  customizations: {
    skippedNodeIds: [{ type: String }],
    priorityNodeIds: [{ type: String }],
    optionalNodeIds: [{ type: String }],
  },
  currentQuestId: { type: String },
  status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
}, { timestamps: true });

export const UserPlan = mongoose.model('UserPlan', UserPlanSchema);
