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
          message: `Learner context:
${JSON.stringify(context)}

Learner message:
${userMessage}

Important instruction:
Provide a concise, direct, short and to-the-point answer. Do NOT output raw schemas or boilerplate JSON wrappers; provide clear, human-readable guidance in under 3-4 concise sentences or focused steps.`,
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

    let cleanContent = data.response.trim();
    let dynamicFollowups = null;

    // Check if the response is JSON-encoded or contains a JSON block
    const jsonMatch = cleanContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, cleanContent];
    const candidateJson = jsonMatch[1] ? jsonMatch[1].trim() : cleanContent;

    if (candidateJson.startsWith('{') && candidateJson.endsWith('}')) {
      try {
        const parsed = JSON.parse(candidateJson);
        if (parsed.chat_response) {
          if (typeof parsed.chat_response === 'string') {
            cleanContent = parsed.chat_response;
          } else if (parsed.chat_response.answer) {
            cleanContent = parsed.chat_response.answer;
            if (Array.isArray(parsed.chat_response.suggested_followups)) {
              dynamicFollowups = parsed.chat_response.suggested_followups;
            }
          }
        } else if (parsed.answer) {
          cleanContent = parsed.answer;
        } else if (parsed.message) {
          cleanContent = parsed.message;
        }
      } catch {
        // Leave as string if not valid JSON
      }
    }

    const questTitle = currentQuest?.title || 'Current Quest';
    return {
      type: 'general',
      title: progressionLevel
        ? `${progressionLevel[0].toUpperCase()}${progressionLevel.slice(1)} for ${questTitle}`
        : `Mentor Advice for ${questTitle}`,
      content: cleanContent,
      level: progressionLevel,
      suggestedPrompts: dynamicFollowups && dynamicFollowups.length > 0
        ? dynamicFollowups
        : [
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
