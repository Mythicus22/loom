import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  source: { type: String, default: 'Official' },
  type: { 
    type: String, 
    enum: ['video', 'documentation', 'article', 'interactive', 'project', 'course'],
    default: 'documentation'
  },
  duration: { type: String, default: '30 mins' },
  difficulty: { type: String, default: 'Beginner' },
  description: { type: String, default: '' },
}, { _id: false });

const AssessmentQuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
  explanation: { type: String, default: '' },
}, { _id: false });

const NodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  stageId: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 100 },
  isOptional: { type: Boolean, default: false },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
  prerequisites: [{ type: String }],
  description: { type: String, required: true },
  whyItMatters: { type: String, required: true },
  whatYouWillLearn: [{ type: String }],
  estimatedMinutes: { type: Number, default: 60 },
  resources: [ResourceSchema],
  practicalTask: {
    title: { type: String, default: 'Practical Quest' },
    instructions: { type: String, default: '' },
    acceptanceCriteria: [{ type: String }],
    starterCode: { type: String, default: '' },
    deliverableType: { type: String, default: 'quiz' }, // 'quiz', 'code', 'github_url'
  },
  assessment: {
    type: { type: String, default: 'quiz' },
    questions: [AssessmentQuestionSchema],
  },
}, { _id: false });

const StageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  order: { type: Number, required: true },
  color: { type: String, default: '#8B5CF6' },
}, { _id: false });

const EdgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  source: { type: String, required: true },
  target: { type: String, required: true },
  isOptional: { type: Boolean, default: false },
}, { _id: false });

const MasterRoadmapSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  canonicalGoal: { type: String, required: true },
  aliases: [{ type: String, index: true }],
  domain: { type: String, required: true, index: true },
  difficulty: { type: String, default: 'Intermediate' },
  targetOutcomes: [{ type: String }],
  version: { type: Number, default: 1.0 },
  estimatedHours: { type: Number, default: 40 },
  stages: [StageSchema],
  nodes: [NodeSchema],
  edges: [EdgeSchema],
  tags: [{ type: String }],
  isGenerated: { type: Boolean, default: false },
}, { timestamps: true });

export const MasterRoadmap = mongoose.model('MasterRoadmap', MasterRoadmapSchema);
