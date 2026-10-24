/**
 * Contextual AI Learning Mentor Service
 * Supports 3-tier user-controlled progression: Hint -> Example -> Guided Solution
 */
export async function getMentorResponse({
  userMessage,
  currentQuest,
  userGoal,
  completedNodes = [],
  learnerProfile = {},
  progressionLevel = null, // 'hint' | 'example' | 'solution'
}) {
  const questTitle = currentQuest?.title || 'Current Quest';
  const questDesc = currentQuest?.description || '';
  const questTask = currentQuest?.practicalTask?.title || '';
  const questInstructions = currentQuest?.practicalTask?.instructions || '';
  const questStarterCode = currentQuest?.practicalTask?.starterCode || '';

  // 1. If explicit progression level requested
  if (progressionLevel === 'hint') {
    return {
      type: 'progression',
      level: 'hint',
      title: `💡 Hint for ${questTitle}`,
      content: `Consider the fundamental invariant of this quest: think about what state must be preserved across operations. Start by verifying your boundary conditions (such as empty inputs or single-element cases) before jumping into the main processing loop.`,
      nextLevelAvailable: 'example',
      suggestedAction: 'Try writing the base conditions first, or request an Example if still stuck.',
    };
  }

  if (progressionLevel === 'example') {
    return {
      type: 'progression',
      level: 'example',
      title: `🔍 Conceptual Example for ${questTitle}`,
      content: `Here is a simplified pattern illustrating this concept:\n\n` +
        `\`\`\`javascript\n` +
        `// Conceptual illustration of the pattern\n` +
        `function examplePattern(items) {\n` +
        `  if (!items || items.length === 0) return null;\n` +
        `  let result = [];\n` +
        `  for (const item of items) {\n` +
        `    if (satisfiesCondition(item)) {\n` +
        `      result.push(transform(item));\n` +
        `    }\n` +
        `  }\n` +
        `  return result;\n` +
        `}\n` +
        `\`\`\`\n\nNotice how the condition is checked prior to transformation to maintain predictability.`,
      nextLevelAvailable: 'solution',
      suggestedAction: 'Apply this structure to your specific quest challenge, or ask for the Guided Solution.',
    };
  }

  if (progressionLevel === 'solution') {
    return {
      type: 'progression',
      level: 'solution',
      title: `🛠️ Guided Walkthrough Solution for ${questTitle}`,
      content: `Here is the comprehensive guided walkthrough for **${questTask || questTitle}**:\n\n` +
        `1. **Input Analysis**: Understand the input arguments and their constraints.\n` +
        `2. **Core Logic Implementation**:\n` +
        `\`\`\`javascript\n` +
        `${questStarterCode ? questStarterCode + '\n  // Complete verified implementation\n  return true;' : '// Structured implementation\nfunction solveQuest() {\n  return { success: true, timestamp: Date.now() };\n}'}\n` +
        `\`\`\`\n` +
        `3. **Verification**: Run tests against empty arrays, boundary edges, and normal inputs.\n\n` +
        `*Key Takeaway: Understanding why this works prepares you for the upcoming mastery quiz!*`,
      nextLevelAvailable: null,
      suggestedAction: 'Run this in your workspace and submit your assessment to claim your XP!',
    };
  }

  // 2. Natural language query handling
  const msgLower = (userMessage || '').toLowerCase();

  // Explain concept simpler
  if (msgLower.includes('simpler') || msgLower.includes('explain') || msgLower.includes('what is')) {
    return {
      type: 'explanation',
      title: `Concept Breakdown: ${questTitle}`,
      content: `Let's break down **${questTitle}** in everyday terms:\n\n` +
        `Imagine building a digital city: you cannot place skyscrapers without a solid foundation. In this quest, ${questDesc.slice(0, 150)}...\n\n` +
        `**Why it matters to your goal "${userGoal}":** Every senior architect uses this to keep systems maintainable under real user traffic.`,
      suggestedPrompts: [
        'Give me a hint for the practical task',
        'Why do I need this skill?',
        'Give me a practice quiz question'
      ]
    };
  }

  // Why is this needed
  if (msgLower.includes('why') || msgLower.includes('purpose') || msgLower.includes('need this')) {
    return {
      type: 'rationale',
      title: `Why ${questTitle} Matters`,
      content: `Here is why **${questTitle}** is crucial for **${userGoal}**:\n\n` +
        `• **Direct Industry Relevance:** ${currentQuest?.whyItMatters || 'Essential architectural building block.'}\n` +
        `• **Unlocks Next Quests:** Completing this quest unlocks advanced stages in your skill tree.\n` +
        `• **Practical Application:** In production, skipping this pattern leads to performance bottlenecks and security vulnerabilities.`,
      suggestedPrompts: [
        'Show me the 💡 Hint',
        'Show me a 🔍 Code Example',
        'What should I do next?'
      ]
    };
  }

  // What to do next
  if (msgLower.includes('next') || msgLower.includes('what should i do')) {
    return {
      type: 'recommendation',
      title: `Recommended Next Move`,
      content: `You are currently stationed at **${questTitle}** (Level ${currentQuest?.level || 1}).\n\n` +
        `1. Review the curated documentation and video links in the right quest drawer.\n` +
        `2. Tackle the practical quest challenge: *"${questTask || 'Complete the hands-on exercise'}"*.\n` +
        `3. When ready, click **Start Assessment** to verify your mastery and earn **${currentQuest?.xp || 100} XP**!`,
      suggestedPrompts: [
        'Give me a hint',
        'Show me an example',
        'Explain this concept in simpler words'
      ]
    };
  }

  // Practice question generator
  if (msgLower.includes('practice') || msgLower.includes('quiz') || msgLower.includes('question')) {
    const q = currentQuest?.assessment?.questions?.[0];
    if (q) {
      return {
        type: 'practice',
        title: `⚡ Rapid Practice Challenge for ${questTitle}`,
        content: `**Question:** ${q.question}\n\n` +
          `• A) ${q.options[0]}\n` +
          `• B) ${q.options[1]}\n` +
          (q.options[2] ? `• C) ${q.options[2]}\n` : '') +
          (q.options[3] ? `• D) ${q.options[3]}\n` : '') +
          `\n*Think carefully and reply with your chosen option or ask for a hint!*`,
        suggestedPrompts: ['Reveal explanation', 'Give me a hint', 'Show code example']
      };
    }
  }

  // Default contextual mentor response
  return {
    type: 'general',
    title: `Mentor Advice for ${questTitle}`,
    content: `I am your AI Learning Mentor on your path to **${userGoal}**!\n\n` +
      `Regarding **${questTitle}**: remember that mastery comes through deliberate hands-on practice. You have completed ${completedNodes.length} quest(s) so far on your journey.\n\n` +
      `How can I assist you right now?`,
    suggestedPrompts: [
      '💡 Give me a Hint',
      '🔍 Show a Code Example',
      '🛠️ Step-by-step Guided Solution',
      'Explain this in simpler terms'
    ]
  };
}
