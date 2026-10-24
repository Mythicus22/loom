import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Compass, 
  Clock, 
  Target, 
  BookOpen, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  Layers, 
  Cpu, 
  BrainCircuit, 
  Code2, 
  Bot, 
  Database,
  Sliders,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { LearnerProfile } from '../types';

interface AIHomeChatProps {
  onGenerateRoadmap: (goal: string, profile: LearnerProfile) => Promise<void>;
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

const SUGGESTED_GOALS = [
  { label: 'Become a Full-Stack Developer', icon: Code2, desc: 'React, Node.js, DBs & Cloud' },
  { label: 'Learn Machine Learning', icon: BrainCircuit, desc: 'Python, PyTorch, Math & MLOps' },
  { label: 'Master DSA for Placements', icon: Cpu, desc: 'LeetCode patterns, Trees & DP' },
  { label: 'Build AI Agents', icon: Bot, desc: 'RAG, Vector DBs & LangGraph' },
  { label: 'Learn Robotics and ROS 2', icon: Compass, desc: 'Kinematics, Gazebo & Nav2' },
];

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
  isGenerating,
  generationStep,
}) => {
  const [goal, setGoal] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [conversationStarted, setConversationStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  // Accumulated profile
  const [profile, setProfile] = useState<LearnerProfile>({
    experienceLevel: 'Beginner',
    hoursPerWeek: 10,
    targetWeeks: 8,
    preferredFormat: 'mixed',
    desiredOutcome: 'projects',
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentQuestionIdx, isGenerating]);

  // Start conversational questionnaire for a goal
  const handleStartGoal = (selectedGoal: string) => {
    if (!selectedGoal.trim()) return;
    setGoal(selectedGoal);
    setConversationStarted(true);

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

  const handleTriggerGenerate = () => {
    onGenerateRoadmap(goal, profile);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* -------------------------------------------------------------------- */}
      {/* Initial Landing State (before goal is entered) */}
      {/* -------------------------------------------------------------------- */}
      {!conversationStarted && (
        <div className="flex-1 flex flex-col justify-center items-center text-center my-auto space-y-8 animate-fadeIn">
          
          {/* Logo badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/40 border border-violet-500/30 text-violet-300 text-xs font-semibold shadow-glow-violet/20 animate-pulse-slow">
            <Sparkles className="w-4 h-4 text-cyan-accent" />
            <span>AI-Powered Adaptive Learning Engine</span>
          </div>

          {/* Prominent Greeting */}
          <div className="space-y-3 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              What do you want to learn?
            </h1>
            <p className="text-base sm:text-lg text-slate-400 font-normal max-w-xl mx-auto">
              Tell us your goal. We'll build a personalized, gamified quest map that fits your schedule, experience, and ambitions.
            </p>
          </div>

          {/* Central Large Chat Input */}
          <div className="w-full max-w-2xl">
            <form 
              onSubmit={handleSendMessage}
              className="relative rounded-2xl p-[1.5px] bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 shadow-glow-violet transition-all focus-within:shadow-glow-cyan"
            >
              <div className="flex items-center bg-dark-panel rounded-[14px] px-4 py-3.5 gap-3">
                <Sparkles className="w-5 h-5 text-violet-400 shrink-0" />
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  placeholder="e.g. Master Machine Learning in 2 months, Learn ROS 2, Full-Stack Web Dev..."
                  className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-none text-base"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm flex items-center gap-2 transition-all shadow-glow-violet/30 cursor-pointer"
                >
                  <span>Build Path</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-2">
              <span>💡 Reusable master roadmaps personalized to your schedule</span>
              <span>RPG skill tree visualization</span>
            </div>
          </div>

          {/* Suggested Goal Chips */}
          <div className="w-full max-w-2xl pt-4">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-3 text-center">
              Or Choose a Popular Master Quest
            </div>
            <div className="flex flex-wrap gap-2.5 justify-center">
              {SUGGESTED_GOALS.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleStartGoal(item.label)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-dark-card border border-dark-border hover:border-violet-500/50 hover:bg-dark-hover transition-all text-xs font-medium text-slate-300 hover:text-white group cursor-pointer"
                  >
                    <IconComponent className="w-3.5 h-3.5 text-cyan-accent group-hover:scale-110 transition-transform" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* Conversational Adaptive Flow */}
      {/* -------------------------------------------------------------------- */}
      {conversationStarted && (
        <div className="flex-1 flex flex-col justify-start space-y-6 max-w-3xl mx-auto w-full">
          
          {/* Header indicator */}
          <div className="flex items-center justify-between pb-3 border-b border-dark-border">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs text-slate-400 font-medium">Personalizing:</span>
              <span className="text-xs font-semibold text-violet-300">{goal}</span>
            </div>
            <button
              onClick={() => {
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
              <div className="p-4 rounded-xl bg-dark-card border border-violet-500/40 text-center space-y-3 animate-pulse">
                <div className="flex items-center justify-center gap-2 text-violet-300 font-semibold text-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-cyan-accent" />
                  <span>{generationStep || 'Generating personalized skill tree...'}</span>
                </div>
                <div className="w-full bg-dark-panel rounded-full h-1.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400 animate-shimmer" style={{ width: '80%' }}></div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Checking shared master roadmaps • Personalizing schedule • Preparing RPG quests
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

    </div>
  );
};
