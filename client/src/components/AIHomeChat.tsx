import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Compass, 
  ArrowRight, 
  RotateCcw, 
  Cpu, 
  BrainCircuit, 
  Code2, 
  Bot, 
  Sliders,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { LearnerProfile } from '../types';
import { MasterRoadmap } from '../types';
import { fetchRoadmaps } from '../services/api';
import MorphOrb from './ui/ai-thiking-orb-and-input';

interface AIHomeChatProps {
  onGenerateRoadmap: (
    goal: string,
    profile: LearnerProfile,
    options?: { deferNavigation?: boolean }
  ) => Promise<string>;
  onGenerationComplete: () => void;
  isGenerating: boolean;
  generationStep: string;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  questionIndex?: number;
  options?: Array<{ label: string; value: any; desc?: string }>;
  isProfilePreview?: boolean;
}

interface RetryTarget {
  goal: string;
  profile: LearnerProfile;
  deferNavigation: boolean;
}

const POPULAR_GOALS = [
  { title: 'Build AI Agents and RAG Systems', icon: Bot },
  { title: 'Master DSA for Placements', icon: Cpu },
  { title: 'Learn Robotics and ROS 2', icon: Compass },
  { title: 'Learn Machine Learning', icon: BrainCircuit },
  { title: 'Become a Full-Stack Web Developer', icon: Code2 },
];

const DEFAULT_PROFILE: LearnerProfile = {
  experienceLevel: 'Beginner',
  hoursPerWeek: 10,
  targetWeeks: 8,
  preferredFormat: 'mixed',
  desiredOutcome: 'projects',
};

const ADAPTIVE_QUESTIONS = [
  {
    key: 'experienceLevel',
    question: "What is your current knowledge and experience level?",
    subtext: "We will tailor the starting point and recommended prerequisites to match where you are today.",
    options: [
      { label: 'Absolute Beginner', value: 'Beginner', desc: 'No prior experience in this domain' },
      { label: 'Intermediate', value: 'Intermediate', desc: 'Understand basics; ready for applied concepts' },
      { label: 'Advanced', value: 'Advanced', desc: 'Deep background; fast-track to capstone projects' },
    ],
  },
  {
    key: 'hoursPerWeek',
    question: "How many hours can you realistically dedicate each week?",
    subtext: "We calculate realistic milestones so you stay motivated without burning out.",
    options: [
      { label: '5 hrs / week', value: 5, desc: 'Gentle pace (approx 45 mins/day)' },
      { label: '10 hrs / week', value: 10, desc: 'Recommended steady pace (1.5 hrs/day)' },
      { label: '20 hrs / week', value: 20, desc: 'Intensive immersion (3 hrs/day)' },
      { label: '35+ hrs / week', value: 35, desc: 'Full-time bootcamp sprint' },
    ],
  },
  {
    key: 'targetWeeks',
    question: "What is your target completion timeline or deadline?",
    subtext: "Aggressive deadlines prioritize core skills and mark non-essentials as optional branches.",
    options: [
      { label: '4 Weeks', value: 4, desc: 'High-intensity accelerated sprint' },
      { label: '8 Weeks', value: 8, desc: 'Balanced 2-month deep dive' },
      { label: '12 Weeks', value: 12, desc: 'Comprehensive mastery path' },
      { label: '16+ Weeks', value: 16, desc: 'Flexible self-paced journey' },
    ],
  },
  {
    key: 'preferredFormat',
    question: "What is your preferred learning format?",
    subtext: "We will curate and order the highest-ranked resources based on how you learn best.",
    options: [
      { label: 'Mixed Resources', value: 'mixed', desc: 'Curated mix of docs, videos & projects' },
      { label: 'Hands-on Coding', value: 'hands-on', desc: 'Practical projects & interactive challenges' },
      { label: 'Video Walkthroughs', value: 'videos', desc: 'Deep-dive visual lectures & tutorials' },
      { label: 'Official Docs & Reading', value: 'reading', desc: 'Authoritative documentation & papers' },
    ],
  },
  {
    key: 'desiredOutcome',
    question: "What is your primary intended outcome?",
    subtext: "Your roadmap capstone and assessments will be tuned specifically for this goal.",
    options: [
      { label: 'Build Practical Projects', value: 'projects', desc: 'Create portfolio pieces that work in production' },
      { label: 'Ace Placement / Interviews', value: 'interviews', desc: 'Solve challenging technical rounds & tests' },
      { label: 'Professional Readiness', value: 'job-ready', desc: 'Job-ready skills for software engineer roles' },
      { label: 'Conceptual Mastery', value: 'conceptual', desc: 'Rigorous theoretical & mathematical understanding' },
    ],
  },
];

export const AIHomeChat: React.FC<AIHomeChatProps> = ({
  onGenerateRoadmap,
  onGenerationComplete,
  isGenerating,
  generationStep,
}) => {
  const [goal, setGoal] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [conversationStarted, setConversationStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [popularRoadmaps, setPopularRoadmaps] = useState<MasterRoadmap[]>([]);
  const [popularLoading, setPopularLoading] = useState(true);
  const [popularError, setPopularError] = useState('');
  const [generationError, setGenerationError] = useState('');
  const [retryTarget, setRetryTarget] = useState<RetryTarget | null>(null);
  const pendingOrbReply = useRef<((reply: string) => void) | null>(null);
  const navigateAfterOrb = useRef(false);

  // Accumulated profile
  const [profile, setProfile] = useState<LearnerProfile>(DEFAULT_PROFILE);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const loadPopularRoadmaps = async () => {
    setPopularLoading(true);
    setPopularError('');
    try {
      const roadmaps = await fetchRoadmaps();
      const byTitle = new Map(roadmaps.map(roadmap => [roadmap.canonicalGoal, roadmap]));
      setPopularRoadmaps(
        POPULAR_GOALS.flatMap(({ title }) => {
          const roadmap = byTitle.get(title);
          return roadmap ? [roadmap] : [];
        })
      );
    } catch (err) {
      setPopularError(err instanceof Error ? err.message : 'Could not load popular roadmaps.');
    } finally {
      setPopularLoading(false);
    }
  };

  useEffect(() => {
    void loadPopularRoadmaps();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentQuestionIdx, isGenerating]);

  // Start conversational questionnaire for a goal
  const handleStartGoal = (selectedGoal: string) => {
    if (!selectedGoal.trim()) return;
    setGoal(selectedGoal);
    setConversationStarted(true);
    setProfile(DEFAULT_PROFILE);
    setGenerationError('');

    const initialMessages: ChatMessage[] = [
      {
        id: 'msg-1',
        sender: 'user',
        text: selectedGoal,
      },
      {
        id: 'msg-2',
        sender: 'ai',
        text: `Awesome goal! We'll build a personalized quest map for "${selectedGoal}". Let's tailor the schedule, starting level, and resource preferences with 5 quick adaptive questions.`,
      },
      {
        id: 'msg-3',
        sender: 'ai',
        text: ADAPTIVE_QUESTIONS[0].question,
        questionIndex: 0,
        options: ADAPTIVE_QUESTIONS[0].options,
      },
    ];

    setMessages(initialMessages);
    setCurrentQuestionIdx(0);
  };

  const handleOrbSubmit = (selectedGoal: string) => new Promise<string>((resolve) => {
    navigateAfterOrb.current = false;
    pendingOrbReply.current = resolve;
    handleStartGoal(selectedGoal);
  });

  const handleOrbComplete = () => {
    if (navigateAfterOrb.current) {
      navigateAfterOrb.current = false;
      onGenerationComplete();
    }
  };

  const handleOrbCancel = () => {
    pendingOrbReply.current = null;
    navigateAfterOrb.current = false;
  };

  // Handle user answering an adaptive question
  const handleAnswerQuestion = (val: any, label: string) => {
    const q = ADAPTIVE_QUESTIONS[currentQuestionIdx];
    const key = q.key as keyof LearnerProfile;

    const updatedProfile = { ...profile, [key]: val };
    setProfile(updatedProfile);

    // Add user response message
    const userMsg: ChatMessage = {
      id: `ans-${Date.now()}`,
      sender: 'user',
      text: label,
    };

    const nextIdx = currentQuestionIdx + 1;

    if (nextIdx < ADAPTIVE_QUESTIONS.length) {
      const nextQ = ADAPTIVE_QUESTIONS[nextIdx];
      const aiNextMsg: ChatMessage = {
        id: `q-${Date.now()}`,
        sender: 'ai',
        text: nextQ.question,
        questionIndex: nextIdx,
        options: nextQ.options,
      };

      setMessages(prev => [...prev, userMsg, aiNextMsg]);
      setCurrentQuestionIdx(nextIdx);
    } else {
      // Finished all questions! Show Profile Preview & Generate Action
      const summaryMsg: ChatMessage = {
        id: `summary-${Date.now()}`,
        sender: 'ai',
        text: `Here is your learner blueprint for "${goal}". Review your parameters below, then launch your journey!`,
        isProfilePreview: true,
      };

      setMessages(prev => [...prev, userMsg, summaryMsg]);
      setCurrentQuestionIdx(ADAPTIVE_QUESTIONS.length);
    }
  };

  // Handle skip question
  const handleSkipQuestion = () => {
    const nextIdx = currentQuestionIdx + 1;
    const skipMsg: ChatMessage = {
      id: `skip-${Date.now()}`,
      sender: 'user',
      text: 'Default preference / Skip',
    };

    if (nextIdx < ADAPTIVE_QUESTIONS.length) {
      const nextQ = ADAPTIVE_QUESTIONS[nextIdx];
      const aiNextMsg: ChatMessage = {
        id: `q-${Date.now()}`,
        sender: 'ai',
        text: nextQ.question,
        questionIndex: nextIdx,
        options: nextQ.options,
      };
      setMessages(prev => [...prev, skipMsg, aiNextMsg]);
      setCurrentQuestionIdx(nextIdx);
    } else {
      const summaryMsg: ChatMessage = {
        id: `summary-${Date.now()}`,
        sender: 'ai',
        text: `Here is your personalized learner blueprint. Review below, then generate your quest map!`,
        isProfilePreview: true,
      };
      setMessages(prev => [...prev, skipMsg, summaryMsg]);
      setCurrentQuestionIdx(ADAPTIVE_QUESTIONS.length);
    }
  };

  // Handle free-text chat input
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isGenerating) return;

    if (!conversationStarted) {
      handleStartGoal(inputMessage);
      setInputMessage('');
    } else {
      // In conversational questionnaire: interpret as free-text response to current question
      if (currentQuestionIdx < ADAPTIVE_QUESTIONS.length) {
        handleAnswerQuestion(inputMessage, inputMessage);
      } else {
        // Already at summary
        setMessages(prev => [
          ...prev,
          { id: `user-${Date.now()}`, sender: 'user', text: inputMessage },
          { id: `ai-${Date.now()}`, sender: 'ai', text: `Got it! Ready to generate your custom quest roadmap.` }
        ]);
      }
      setInputMessage('');
    }
  };

  const executeGeneration = async (target: RetryTarget) => {
    setGenerationError('');
    setRetryTarget(target);
    try {
      const response = await onGenerateRoadmap(target.goal, target.profile, {
        deferNavigation: target.deferNavigation,
      });
      setRetryTarget(null);
      if (target.deferNavigation) {
        if (pendingOrbReply.current) {
          navigateAfterOrb.current = true;
          pendingOrbReply.current(response);
        } else {
          onGenerationComplete();
        }
        pendingOrbReply.current = null;
      }
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : 'Roadmap generation failed. Please try again.');
    }
  };

  const handleTriggerGenerate = () => executeGeneration({
    goal,
    profile,
    deferNavigation: true,
  });

  const handlePopularSelect = async (roadmap: MasterRoadmap) => {
    await executeGeneration({
      goal: roadmap.canonicalGoal,
      profile: DEFAULT_PROFILE,
      deferNavigation: false,
    });
  };

  return (
    <div className="home-page">
      <div className="home-layout">
        <section className="home-primary">
          <div className="home-heading">
            <div className="home-eyebrow">
              <Sparkles className="w-4 h-4" />
              <span>AI-powered adaptive learning</span>
            </div>
            <h1>What do you want to learn?</h1>
            <p>Describe a goal to tailor a roadmap to your pace, experience, and ambitions.</p>
          </div>

          <MorphOrb
            onSubmit={handleOrbSubmit}
            onComplete={handleOrbComplete}
            onCancel={handleOrbCancel}
          />

          {isGenerating && (
            <div className="home-generation-status" role="status">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{generationStep || 'Generating your roadmap…'}</span>
            </div>
          )}

          {generationError && (
            <div className="home-error" role="alert">
              <span>{generationError}</span>
              {retryTarget && (
                <button onClick={() => void executeGeneration(retryTarget)} disabled={isGenerating}>
                  Retry
                </button>
              )}
            </div>
          )}

      {/* -------------------------------------------------------------------- */}
      {/* Conversational Adaptive Flow */}
      {/* -------------------------------------------------------------------- */}
      {conversationStarted && (
        <div className="home-onboarding">
          
          {/* Header indicator */}
          <div className="flex items-center justify-between pb-3 border-b border-dark-border">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs text-slate-400 font-medium">Personalizing:</span>
              <span className="text-xs font-semibold text-violet-300">{goal}</span>
            </div>
            <button
              onClick={() => {
                pendingOrbReply.current?.('Profile setup was restarted. Enter your goal again when ready.');
                pendingOrbReply.current = null;
                navigateAfterOrb.current = false;
                setConversationStarted(false);
                setGoal('');
                setMessages([]);
              }}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restart</span>
            </button>
          </div>

          {/* Messages list */}
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 p-[1px] shrink-0 mt-0.5">
                    <div className="w-full h-full bg-dark-panel rounded-[11px] flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-cyan-accent" />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-violet-600 text-white font-medium rounded-tr-none shadow-glow-violet/20'
                      : 'bg-dark-card border border-dark-border text-slate-200 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Options chips if this is the active question */}
                  {msg.options && msg.questionIndex === currentQuestionIdx && (
                    <div className="mt-4 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => handleAnswerQuestion(opt.value, opt.label)}
                            className="flex flex-col text-left p-3 rounded-xl bg-dark-panel border border-dark-border hover:border-violet-500/60 hover:bg-violet-950/20 transition-all text-xs group cursor-pointer"
                          >
                            <span className="font-semibold text-slate-100 group-hover:text-violet-300 flex items-center justify-between">
                              {opt.label}
                              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                            {opt.desc && (
                              <span className="text-[11px] text-slate-400 mt-1">{opt.desc}</span>
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={handleSkipQuestion}
                          className="text-[11px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
                        >
                          Skip / Use recommended default
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Summary Profile Preview Card */}
                  {msg.isProfilePreview && (
                    <div className="mt-4 p-4 rounded-xl bg-dark-panel border border-violet-500/30 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-violet-300 uppercase tracking-wider">
                        <span>Personalized Learner Blueprint</span>
                        <Sliders className="w-3.5 h-3.5" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-dark-card border border-dark-border">
                          <span className="text-[10px] text-slate-400 block uppercase font-medium">Starting Level</span>
                          <span className="font-semibold text-slate-200">{profile.experienceLevel}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-dark-card border border-dark-border">
                          <span className="text-[10px] text-slate-400 block uppercase font-medium">Weekly Commitment</span>
                          <span className="font-semibold text-slate-200">{profile.hoursPerWeek} hrs/week</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-dark-card border border-dark-border">
                          <span className="text-[10px] text-slate-400 block uppercase font-medium">Target Timeline</span>
                          <span className="font-semibold text-slate-200">{profile.targetWeeks} weeks</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-dark-card border border-dark-border">
                          <span className="text-[10px] text-slate-400 block uppercase font-medium">Format</span>
                          <span className="font-semibold text-slate-200 capitalize">{profile.preferredFormat}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={handleTriggerGenerate}
                          disabled={isGenerating}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-glow-violet transition-all cursor-pointer"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>{generationStep || 'Building Quest Map...'}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              <span>Generate My Quest Map</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))}

            {/* Generation loading indicator */}
            {isGenerating && (
              <div className="p-4 rounded-xl bg-dark-card border border-violet-500/40 text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-violet-300 font-semibold text-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-cyan-accent" />
                  <span>{generationStep || 'Generating your personalized roadmap…'}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Waiting for the roadmap service to finish.
                </p>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Bottom input during conversation */}
          {currentQuestionIdx < ADAPTIVE_QUESTIONS.length && (
            <div className="sticky bottom-4 pt-2">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 bg-dark-panel border border-dark-border rounded-xl px-4 py-2.5 focus-within:border-violet-500/60 transition-all"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  placeholder="Or type a custom answer..."
                  className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-none text-xs"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

        </div>
      )}

        </section>

        <aside className="home-popular" aria-labelledby="popular-roadmaps-heading">
          <div className="home-popular-heading">
            <span>Explore a proven path</span>
            <h2 id="popular-roadmaps-heading">Some popular roadmaps</h2>
          </div>

          {popularLoading ? (
            <div className="home-popular-list" aria-label="Loading popular roadmaps">
              {POPULAR_GOALS.map(({ title }) => (
                <div className="home-roadmap-skeleton" key={title} />
              ))}
            </div>
          ) : popularError ? (
            <div className="home-popular-error" role="alert">
              <p>{popularError}</p>
              <button onClick={() => void loadPopularRoadmaps()}>Try again</button>
            </div>
          ) : (
            <div className="home-popular-list">
              {POPULAR_GOALS.map(({ title, icon: Icon }) => {
                const roadmap = popularRoadmaps.find(item => item.canonicalGoal === title);
                if (!roadmap) return null;
                return (
                  <button
                    className="home-roadmap-choice"
                    key={roadmap.id}
                    onClick={() => void handlePopularSelect(roadmap)}
                    disabled={isGenerating}
                  >
                    <span className="home-roadmap-icon"><Icon className="w-4 h-4" /></span>
                    <span className="home-roadmap-label">{roadmap.canonicalGoal}</span>
                    <ArrowRight className="home-roadmap-arrow w-4 h-4" />
                  </button>
                );
              })}
            </div>
          )}

          {!popularLoading && !popularError && popularRoadmaps.length === 0 && (
            <p className="home-popular-empty">No popular roadmaps are available right now.</p>
          )}

          {isGenerating && (
            <div className="home-sidebar-loading" role="status">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{generationStep || 'Building roadmap…'}</span>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
