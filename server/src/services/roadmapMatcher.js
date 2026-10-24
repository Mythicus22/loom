import { MasterRoadmap } from '../models/MasterRoadmap.js';

/**
 * Normalizes goal text for comparison
 */
export function normalizeGoal(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim();
}

/**
 * Calculates string/token overlap similarity score (0 to 1)
 */
function calculateTokenOverlap(input, target) {
  const inputTokens = new Set(input.split(/\s+/).filter(t => t.length > 2));
  const targetTokens = new Set(target.split(/\s+/).filter(t => t.length > 2));
  
  if (inputTokens.size === 0 || targetTokens.size === 0) return 0;
  
  let matchCount = 0;
  for (const token of inputTokens) {
    if (targetTokens.has(token)) {
      matchCount++;
    } else {
      for (const t of targetTokens) {
        if (t.includes(token) || token.includes(t)) {
          matchCount += 0.7;
          break;
        }
      }
    }
  }

  return matchCount / Math.max(inputTokens.size, targetTokens.size);
}

/**
 * Finds the best matching existing Master Roadmap in the database
 */
export async function findBestMasterRoadmap(userGoal) {
  const normalized = normalizeGoal(userGoal);
  const roadmaps = await MasterRoadmap.find({});

  let bestMatch = null;
  let highestScore = 0;

  for (const rm of roadmaps) {
    let score = 0;

    // 1. Direct canonical check
    const canonicalNorm = normalizeGoal(rm.canonicalGoal);
    if (normalized === canonicalNorm || normalized.includes(canonicalNorm) || canonicalNorm.includes(normalized)) {
      score = Math.max(score, 0.95);
    }

    // 2. Direct alias match
    for (const alias of rm.aliases || []) {
      const aliasNorm = normalizeGoal(alias);
      if (normalized === aliasNorm) {
        score = Math.max(score, 0.98);
        break;
      }
      if (normalized.includes(aliasNorm) || aliasNorm.includes(normalized)) {
        score = Math.max(score, 0.9);
      }
      const tokenScore = calculateTokenOverlap(normalized, aliasNorm);
      if (tokenScore > score) {
        score = tokenScore;
      }
    }

    // 3. Domain and tags overlap
    for (const tag of rm.tags || []) {
      if (normalized.includes(normalizeGoal(tag))) {
        score += 0.15;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = rm;
    }
  }

  // Return match if threshold satisfied
  if (highestScore >= 0.55 && bestMatch) {
    return {
      match: bestMatch,
      confidence: Math.min(highestScore, 1.0),
      isReused: true,
    };
  }

  return {
    match: null,
    confidence: highestScore,
    isReused: false,
  };
}

/**
 * Personalizes a Master Roadmap for a specific learner's profile
 */
export function personalizePlanSchedule(masterRoadmap, learnerProfile) {
  const hoursPerWeek = Math.max(learnerProfile.hoursPerWeek || 10, 2);
  const userWeeks = learnerProfile.targetWeeks || 8;
  const experienceLevel = learnerProfile.experienceLevel || 'Beginner';
  
  const totalHours = masterRoadmap.estimatedHours || 50;
  // Calculate recommended weeks based on pace
  const calculatedWeeks = Math.ceil(totalHours / hoursPerWeek);
  const finalWeeks = Math.min(Math.max(calculatedWeeks, 2), 52);

  const startDate = new Date();
  const targetEndDate = new Date();
  targetEndDate.setDate(startDate.getDate() + (finalWeeks * 7));

  // Determine starting node and skipped nodes based on experience
  const skippedNodeIds = [];
  const priorityNodeIds = [];
  const optionalNodeIds = [];

  const nodes = masterRoadmap.nodes || [];
  
  // If user is intermediate/advanced, suggest testing out of introductory level 1 nodes
  if (experienceLevel === 'Intermediate' && nodes.length > 2) {
    // suggest first node as tested out/skip
    skippedNodeIds.push(nodes[0].id);
  } else if (experienceLevel === 'Advanced' && nodes.length > 3) {
    skippedNodeIds.push(nodes[0].id);
    if (nodes[1]) skippedNodeIds.push(nodes[1].id);
  }

  // If user has very tight deadline (< 6 weeks), mark non-essential nodes as optional
  const isTightDeadline = userWeeks <= 4;
  for (const node of nodes) {
    if (node.isOptional || (isTightDeadline && node.level >= 4)) {
      optionalNodeIds.push(node.id);
    } else {
      priorityNodeIds.push(node.id);
    }
  }

  // First non-skipped node becomes active quest
  const availableNodes = nodes.filter(n => !skippedNodeIds.includes(n.id));
  const startingQuestId = availableNodes[0]?.id || nodes[0]?.id;

  // Milestone schedule per stage
  const stages = masterRoadmap.stages || [];
  const weeksPerStage = Math.max(1, Math.floor(finalWeeks / Math.max(stages.length, 1)));
  
  const milestones = stages.map((st, idx) => ({
    stageId: st.id,
    stageTitle: st.title,
    targetWeek: (idx + 1) * weeksPerStage,
    estimatedHours: Math.round(totalHours / stages.length),
  }));

  return {
    startDate,
    targetEndDate,
    weeklyHours: hoursPerWeek,
    totalEstimatedHours: totalHours,
    calculatedWeeks: finalWeeks,
    startingQuestId,
    skippedNodeIds,
    priorityNodeIds,
    optionalNodeIds,
    milestones,
  };
}
