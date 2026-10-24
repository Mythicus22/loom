const LYZR_CHAT_URL = 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/';
const REQUEST_TIMEOUT_MS = 30_000;

export async function getMentorResponse({
  userId,
  sessionId,
  userMessage,
  currentQuest,
  userGoal,
  completedNodes = [],
  learnerProfile = {},
  progressionLevel = null,
}) {
  const apiKey = process.env.LYZR_API_KEY;
  const agentId = process.env.LYZR_AGENT_ID;

  if (!apiKey || !agentId) {
    throw new Error('Mentor is not configured. Set LYZR_API_KEY and LYZR_AGENT_ID in the backend environment.');
  }
  if (
    typeof sessionId !== 'string' ||
    !sessionId.trim() ||
    typeof userMessage !== 'string' ||
    !userMessage.trim()
  ) {
    throw new Error('A session ID and message are required to chat with the mentor.');
  }

  const context = {
    goal: userGoal || '',
    quest: currentQuest
      ? {
          title: currentQuest.title,
          description: currentQuest.description,
          whyItMatters: currentQuest.whyItMatters,
          level: currentQuest.level,
          practicalTask: currentQuest.practicalTask
            ? {
                title: currentQuest.practicalTask.title,
                instructions: currentQuest.practicalTask.instructions,
                acceptanceCriteria: currentQuest.practicalTask.acceptanceCriteria,
                starterCode: currentQuest.practicalTask.starterCode,
              }
            : undefined,
        }
      : null,
    learnerProfile,
    completedNodes,
    helpTier: progressionLevel || 'standard',
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    let response;
    try {
      response = await fetch(LYZR_CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          user_id: userId,
          agent_id: agentId,
          session_id: sessionId,
          message: `Learner context:\n${JSON.stringify(context)}\n\nLearner message:\n${userMessage}`,
        }),
        signal: controller.signal,
      });
    } catch {
      if (controller.signal.aborted) {
        throw new Error('Mentor request timed out. Please try again.');
      }
      throw new Error('Unable to reach the mentor service. Please try again.');
    }

    if (!response.ok) {
      throw new Error(`Mentor service returned HTTP ${response.status}. Please check the backend credentials and try again.`);
    }

    let data;
    try {
      data = await response.json();
    } catch {
      if (controller.signal.aborted) {
        throw new Error('Mentor request timed out. Please try again.');
      }
      throw new Error('Mentor service returned an invalid response.');
    }

    if (typeof data?.response !== 'string' || !data.response.trim()) {
      throw new Error('Mentor service response did not include a reply.');
    }

    const questTitle = currentQuest?.title || 'Current Quest';
    return {
      type: 'general',
      title: progressionLevel
        ? `${progressionLevel[0].toUpperCase()}${progressionLevel.slice(1)} for ${questTitle}`
        : `Mentor Advice for ${questTitle}`,
      content: data.response,
      level: progressionLevel,
      suggestedPrompts: [
        '💡 Give me a Hint',
        '🔍 Show a Code Example',
        '🛠️ Step-by-step Guided Solution',
        'Explain this in simpler terms',
      ],
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
