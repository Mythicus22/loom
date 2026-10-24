import express from 'express';
import { MasterRoadmap } from '../models/MasterRoadmap.js';
import { UserPlan } from '../models/UserPlan.js';
import { UserProgress } from '../models/UserProgress.js';
import { findBestMasterRoadmap, personalizePlanSchedule } from '../services/roadmapMatcher.js';
import { generateAndSaveMasterRoadmap } from '../services/roadmapGenerator.js';
import { getMentorResponse } from '../services/mentorService.js';
import { 
  calculateLevel, 
  updateStreak, 
  checkNewAchievements, 
  getDefaultDailyQuests,
  ALL_ACHIEVEMENTS 
} from '../services/gamificationService.js';

const router = express.Router();
const DEFAULT_USER_ID = 'default_hero';

// -------------------------------------------------------------
// 1. Master Roadmaps: List & Search
// -------------------------------------------------------------
router.get('/roadmaps', async (req, res) => {
  try {
    const { domain, difficulty, search } = req.query;
    const filter = {};

    if (domain && domain !== 'All') {
      filter.domain = domain;
    }
    if (difficulty && difficulty !== 'All') {
      filter.difficulty = new RegExp(difficulty, 'i');
    }
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { canonicalGoal: searchRegex },
        { aliases: searchRegex },
        { domain: searchRegex },
        { tags: searchRegex },
      ];
    }

    const roadmaps = await MasterRoadmap.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: roadmaps.length, roadmaps });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/roadmaps/:id', async (req, res) => {
  try {
    const roadmap = await MasterRoadmap.findOne({ id: req.params.id });
    if (!roadmap) {
      return res.status(404).json({ success: false, error: 'Master roadmap not found' });
    }
    res.json({ success: true, roadmap });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 2. Goal Matching & Plan Generation (The Core Principle)
// -------------------------------------------------------------
router.post('/roadmaps/match-or-create', async (req, res) => {
  try {
    const { goal, learnerProfile = {} } = req.body;
    if (!goal || !goal.trim()) {
      return res.status(400).json({ success: false, error: 'Learning goal is required' });
    }

    const defaultProfile = {
      experienceLevel: learnerProfile.experienceLevel || 'Beginner',
      hoursPerWeek: Number(learnerProfile.hoursPerWeek) || 10,
      targetWeeks: Number(learnerProfile.targetWeeks) || 8,
      preferredFormat: learnerProfile.preferredFormat || 'mixed',
      desiredOutcome: learnerProfile.desiredOutcome || 'projects',
    };

    // Step A: Search for existing matching master roadmap
    const matchResult = await findBestMasterRoadmap(goal);
    let masterRoadmap = matchResult.match;
    let isReused = matchResult.isReused;

    // Step B: If no match exists, generate new validated master roadmap
    if (!masterRoadmap) {
      masterRoadmap = await generateAndSaveMasterRoadmap(goal);
      isReused = false;
    }

    // Step C: Personalize schedule and parameters for this individual learner
    const personalizedSchedule = personalizePlanSchedule(masterRoadmap, defaultProfile);

    // Step D: Create or update UserPlan
    const planId = `plan-${masterRoadmap.id}-${Date.now().toString().slice(-6)}`;
    
    // Set previous plans to paused
    await UserPlan.updateMany({ userId: DEFAULT_USER_ID }, { status: 'paused' });

    const userPlan = await UserPlan.create({
      id: planId,
      userId: DEFAULT_USER_ID,
      masterRoadmapId: masterRoadmap.id,
      canonicalGoal: masterRoadmap.canonicalGoal,
      userGoalRaw: goal,
      learnerProfile: defaultProfile,
      schedule: {
        startDate: personalizedSchedule.startDate,
        targetEndDate: personalizedSchedule.targetEndDate,
        weeklyHours: personalizedSchedule.weeklyHours,
        totalEstimatedHours: personalizedSchedule.totalEstimatedHours,
        milestones: personalizedSchedule.milestones,
      },
      customizations: {
        skippedNodeIds: personalizedSchedule.skippedNodeIds,
        priorityNodeIds: personalizedSchedule.priorityNodeIds,
        optionalNodeIds: personalizedSchedule.optionalNodeIds,
      },
      currentQuestId: personalizedSchedule.startingQuestId,
      status: 'active',
    });

    // Step E: Ensure user progress record exists
    let progress = await UserProgress.findOne({ userId: DEFAULT_USER_ID, planId });
    if (!progress) {
      progress = await UserProgress.create({
        userId: DEFAULT_USER_ID,
        planId,
        completedNodeIds: personalizedSchedule.skippedNodeIds || [],
        verifiedNodeIds: [],
        bookmarkedResourceIds: [],
        completedResourceIds: [],
        assessmentAttempts: [],
        xp: personalizedSchedule.skippedNodeIds.length * 50,
        level: 1,
        streakDays: 3,
        streakFrozen: true,
        achievements: [
          { ...ALL_ACHIEVEMENTS[0], unlockedAt: new Date() } // Starter quest motivation
        ],
        dailyQuests: getDefaultDailyQuests(),
      });
    }

    res.json({
      success: true,
      isReused,
      confidence: matchResult.confidence,
      masterRoadmap,
      userPlan,
      progress,
    });
  } catch (err) {
    console.error('Error in match-or-create:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 3. User Active Plan & Progress
// -------------------------------------------------------------
router.get('/plans/active', async (req, res) => {
  try {
    let activePlan = await UserPlan.findOne({ userId: DEFAULT_USER_ID, status: 'active' }).sort({ updatedAt: -1 });
    
    // If no active plan, find most recent plan
    if (!activePlan) {
      activePlan = await UserPlan.findOne({ userId: DEFAULT_USER_ID }).sort({ updatedAt: -1 });
    }

    // If still no plan, pick the first master roadmap and create default plan
    if (!activePlan) {
      const firstRoadmap = await MasterRoadmap.findOne({});
      if (firstRoadmap) {
        const schedule = personalizePlanSchedule(firstRoadmap, {
          experienceLevel: 'Beginner',
          hoursPerWeek: 10,
          targetWeeks: 8,
          preferredFormat: 'mixed',
          desiredOutcome: 'projects',
        });
        activePlan = await UserPlan.create({
          id: `plan-${firstRoadmap.id}-default`,
          userId: DEFAULT_USER_ID,
          masterRoadmapId: firstRoadmap.id,
          canonicalGoal: firstRoadmap.canonicalGoal,
          userGoalRaw: firstRoadmap.canonicalGoal,
          schedule,
          currentQuestId: firstRoadmap.nodes[0]?.id,
          status: 'active',
        });
      }
    }

    if (!activePlan) {
      return res.status(404).json({ success: false, error: 'No roadmap available' });
    }

    const masterRoadmap = await MasterRoadmap.findOne({ id: activePlan.masterRoadmapId });
    let progress = await UserProgress.findOne({ userId: DEFAULT_USER_ID, planId: activePlan.id });
    
    if (!progress) {
      progress = await UserProgress.create({
        userId: DEFAULT_USER_ID,
        planId: activePlan.id,
        completedNodeIds: [],
        verifiedNodeIds: [],
        bookmarkedResourceIds: [],
        xp: 0,
        level: 1,
        streakDays: 3,
        streakFrozen: true,
        dailyQuests: getDefaultDailyQuests(),
      });
    }

    res.json({
      success: true,
      masterRoadmap,
      userPlan: activePlan,
      progress,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 4. My Journey: List Plans & Adjust Schedule
// -------------------------------------------------------------
router.get('/plans', async (req, res) => {
  try {
    const plans = await UserPlan.find({ userId: DEFAULT_USER_ID }).sort({ updatedAt: -1 });
    res.json({ success: true, plans });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/plans/:id/select', async (req, res) => {
  try {
    await UserPlan.updateMany({ userId: DEFAULT_USER_ID }, { status: 'paused' });
    const plan = await UserPlan.findOneAndUpdate(
      { id: req.params.id, userId: DEFAULT_USER_ID },
      { status: 'active' },
      { new: true }
    );
    res.json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/plans/:id/schedule', async (req, res) => {
  try {
    const { hoursPerWeek, targetWeeks } = req.body;
    const plan = await UserPlan.findOne({ id: req.params.id, userId: DEFAULT_USER_ID });
    if (!plan) {
      return res.status(404).json({ success: false, error: 'Plan not found' });
    }

    const masterRoadmap = await MasterRoadmap.findOne({ id: plan.masterRoadmapId });
    if (!masterRoadmap) {
      return res.status(404).json({ success: false, error: 'Master roadmap not found' });
    }

    // Update profile
    if (hoursPerWeek) plan.learnerProfile.hoursPerWeek = Number(hoursPerWeek);
    if (targetWeeks) plan.learnerProfile.targetWeeks = Number(targetWeeks);

    // Recalculate schedule WITHOUT erasing completed progress
    const updatedSchedule = personalizePlanSchedule(masterRoadmap, plan.learnerProfile);
    plan.schedule.targetEndDate = updatedSchedule.targetEndDate;
    plan.schedule.weeklyHours = updatedSchedule.weeklyHours;
    plan.schedule.milestones = updatedSchedule.milestones;

    await plan.save();
    res.json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 5. Progress, Quest Completion & Gamification
// -------------------------------------------------------------
router.post('/progress/complete-node', async (req, res) => {
  try {
    const { planId, nodeId, xpAward = 100 } = req.body;
    let progress = await UserProgress.findOne({ userId: DEFAULT_USER_ID, planId });
    if (!progress) {
      return res.status(404).json({ success: false, error: 'Progress record not found' });
    }

    const wasCompleted = progress.completedNodeIds.includes(nodeId);
    if (!wasCompleted) {
      progress.completedNodeIds.push(nodeId);
      progress.xp += Number(xpAward);
      
      // Update level
      const levelInfo = calculateLevel(progress.xp);
      progress.level = levelInfo.level;

      // Update streak
      updateStreak(progress);

      // Check achievements
      const newAchievements = checkNewAchievements(progress, 'node_completed', { nodeId });
      if (newAchievements.length > 0) {
        progress.achievements.push(...newAchievements);
      }

      await progress.save();

      // Update current quest in UserPlan to next available
      const plan = await UserPlan.findOne({ id: planId });
      if (plan) {
        const masterRoadmap = await MasterRoadmap.findOne({ id: plan.masterRoadmapId });
        if (masterRoadmap) {
          const nextNode = masterRoadmap.nodes.find(n => !progress.completedNodeIds.includes(n.id));
          if (nextNode) {
            plan.currentQuestId = nextNode.id;
            await plan.save();
          }
        }
      }

      return res.json({
        success: true,
        alreadyCompleted: false,
        earnedXP: xpAward,
        progress,
        newAchievements,
        levelInfo,
      });
    }

    res.json({ success: true, alreadyCompleted: true, progress });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/progress/bookmark', async (req, res) => {
  try {
    const { planId, resourceId } = req.body;
    let progress = await UserProgress.findOne({ userId: DEFAULT_USER_ID, planId });
    if (!progress) {
      return res.status(404).json({ success: false, error: 'Progress record not found' });
    }

    const idx = progress.bookmarkedResourceIds.indexOf(resourceId);
    let isBookmarked = false;
    if (idx >= 0) {
      progress.bookmarkedResourceIds.splice(idx, 1);
    } else {
      progress.bookmarkedResourceIds.push(resourceId);
      isBookmarked = true;
    }

    const newAchievements = checkNewAchievements(progress, 'bookmark');
    if (newAchievements.length > 0) {
      progress.achievements.push(...newAchievements);
    }

    await progress.save();
    res.json({ success: true, isBookmarked, bookmarkedResourceIds: progress.bookmarkedResourceIds, newAchievements });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/progress/streak-freeze', async (req, res) => {
  try {
    const { planId } = req.body;
    let progress = await UserProgress.findOne({ userId: DEFAULT_USER_ID, planId });
    if (!progress) {
      return res.status(404).json({ success: false, error: 'Progress record not found' });
    }

    progress.streakFrozen = !progress.streakFrozen;
    await progress.save();
    res.json({ success: true, streakFrozen: progress.streakFrozen });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 6. Assessments & Verified Mastery
// -------------------------------------------------------------
router.post('/assessments/submit', async (req, res) => {
  try {
    const { planId, nodeId, answers = [], submissionText = '' } = req.body;

    const plan = await UserPlan.findOne({ id: planId, userId: DEFAULT_USER_ID });
    if (!plan) return res.status(404).json({ success: false, error: 'Plan not found' });

    const roadmap = await MasterRoadmap.findOne({ id: plan.masterRoadmapId });
    const node = roadmap?.nodes?.find(n => n.id === nodeId);
    if (!node) return res.status(404).json({ success: false, error: 'Node not found' });

    let progress = await UserProgress.findOne({ userId: DEFAULT_USER_ID, planId });
    if (!progress) return res.status(404).json({ success: false, error: 'Progress not found' });

    const questions = node.assessment?.questions || [];
    let correctCount = 0;
    const explanations = [];

    if (questions.length > 0) {
      questions.forEach((q, idx) => {
        const userAnswer = answers[idx];
        const isCorrect = userAnswer === q.correctIndex;
        if (isCorrect) correctCount++;
        explanations.push({
          questionId: q.id,
          question: q.question,
          userAnswer,
          correctAnswer: q.correctIndex,
          isCorrect,
          explanation: q.explanation,
        });
      });
    } else {
      // Practical task submission
      correctCount = 1;
    }

    const totalQuestions = Math.max(questions.length, 1);
    const scorePercent = Math.round((correctCount / totalQuestions) * 100);
    const passed = scorePercent >= 60 || Boolean(submissionText.trim());

    const earnedXP = passed ? (node.xp || 100) : 25;

    // Record attempt
    progress.assessmentAttempts.push({
      nodeId,
      passed,
      score: correctCount,
      totalQuestions,
      answers,
      feedback: passed ? 'Excellently executed!' : 'Review the recommended hints and retry to earn full XP.',
      earnedXP,
      attemptedAt: new Date(),
    });

    if (passed) {
      if (!progress.completedNodeIds.includes(nodeId)) {
        progress.completedNodeIds.push(nodeId);
      }
      if (!progress.verifiedNodeIds.includes(nodeId)) {
        progress.verifiedNodeIds.push(nodeId);
      }
      progress.xp += earnedXP;
      const levelInfo = calculateLevel(progress.xp);
      progress.level = levelInfo.level;
    }

    // Check achievements
    const newAchievements = checkNewAchievements(progress, 'assessment', {
      score: correctCount,
      total: totalQuestions,
      passed,
    });
    if (newAchievements.length > 0) {
      progress.achievements.push(...newAchievements);
    }

    await progress.save();

    res.json({
      success: true,
      passed,
      score: correctCount,
      totalQuestions,
      scorePercent,
      earnedXP,
      explanations,
      progress,
      newAchievements,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 7. Contextual AI Learning Mentor
// -------------------------------------------------------------
router.post('/mentor/chat', async (req, res) => {
  try {
    const { sessionId, userMessage, currentQuest, userGoal, completedNodes, learnerProfile, progressionLevel } = req.body;
    
    const reply = await getMentorResponse({
      userId: DEFAULT_USER_ID,
      sessionId,
      userMessage,
      currentQuest,
      userGoal,
      completedNodes,
      learnerProfile,
      progressionLevel,
    });

    res.json({ success: true, reply });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 8. Stats & Profile Summary
// -------------------------------------------------------------
router.get('/user/stats', async (req, res) => {
  try {
    const activePlan = await UserPlan.findOne({ userId: DEFAULT_USER_ID, status: 'active' });
    let progress = null;
    if (activePlan) {
      progress = await UserProgress.findOne({ userId: DEFAULT_USER_ID, planId: activePlan.id });
    }

    const xp = progress?.xp || 0;
    const levelInfo = calculateLevel(xp);

    res.json({
      success: true,
      user: {
        id: DEFAULT_USER_ID,
        name: 'Quest Explorer',
        avatar: '🧙‍♂️',
      },
      levelInfo,
      streak: {
        days: progress?.streakDays || 3,
        frozen: progress?.streakFrozen || false,
      },
      completedQuestsCount: progress?.completedNodeIds?.length || 0,
      verifiedQuestsCount: progress?.verifiedNodeIds?.length || 0,
      achievements: progress?.achievements || [],
      dailyQuests: progress?.dailyQuests || getDefaultDailyQuests(),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
