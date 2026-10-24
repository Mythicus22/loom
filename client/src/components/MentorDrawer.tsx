import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Lightbulb, 
  Code2, 
  Wrench, 
  HelpCircle, 
  ChevronRight, 
  Bot, 
  RotateCcw,
  Loader2
} from 'lucide-react';
import { RoadmapNode, UserPlan } from '../types';
import { chatWithMentor } from '../services/api';

interface MentorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentQuest: RoadmapNode | null;
  plan: UserPlan | null;
  completedNodeIds: string[];
}

interface MentorMessage {
  id: string;
  sender: 'ai' | 'user';
  title?: string;
  text: string;
  levelBadge?: string;
  suggestedPrompts?: string[];
}

export const MentorDrawer: React.FC<MentorDrawerProps> = ({
  isOpen,
  onClose,
  currentQuest,
  plan,
  completedNodeIds,
}) => {
  const [messages, setMessages] = useState<MentorMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progressionTier, setProgressionTier] = useState<'hint' | 'example' | 'solution' | null>(null);
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef(sessionId);
  const contextKey = `${plan?.id || ''}:${currentQuest?.id || ''}`;
  const previousContextKey = useRef(contextKey);

  useEffect(() => {
    if (previousContextKey.current !== contextKey) {
      previousContextKey.current = contextKey;
      const nextSessionId = crypto.randomUUID();
      sessionIdRef.current = nextSessionId;
      setSessionId(nextSessionId);
      setMessages([]);
      setProgressionTier(null);
      setIsLoading(false);
    }
  }, [contextKey]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'init-1',
          sender: 'ai',
          title: `AI Learning Mentor: ${currentQuest?.title || 'Active Quest'}`,
          text: `Greetings! I am your AI mentor for **${plan?.canonicalGoal || 'your journey'}**.\n\nI have complete context on your current quest, completed nodes, and resources. How can I guide you? Use the 3-tier helper below or ask any question!`,
          suggestedPrompts: [
            '💡 Give me a Hint',
            '🔍 Show a Code Example',
            'Explain this in simpler terms',
            'Why is this skill needed in industry?'
          ]
        }
      ]);
    }
  }, [isOpen, currentQuest?.id, plan?.id, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendPrompt = async (text: string, progressionLevel?: 'hint' | 'example' | 'solution') => {
    if (!text.trim() || isLoading) return;

    const userMsg: MentorMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
    };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    const requestSessionId = sessionId;

    try {
      const reply = await chatWithMentor({
        sessionId: requestSessionId,
        userMessage: text,
        currentQuest,
        userGoal: plan?.canonicalGoal,
        completedNodes: completedNodeIds,
        learnerProfile: plan?.learnerProfile,
        progressionLevel: progressionLevel || null,
      });

      const aiMsg: MentorMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        title: reply.title,
        text: reply.content,
        levelBadge: reply.level,
        suggestedPrompts: reply.suggestedPrompts,
      };

      if (sessionIdRef.current === requestSessionId) {
        setMessages(prev => [...prev, aiMsg]);
      }
      if (sessionIdRef.current === requestSessionId && progressionLevel) {
        setProgressionTier(progressionLevel);
      }
    } catch (err: any) {
      if (sessionIdRef.current === requestSessionId) {
        setMessages(prev => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: 'ai',
            title: 'Connection Issue',
            text: 'Apologies, could not connect to mentor server. Please try again.',
          }
        ]);
      }
    } finally {
      if (sessionIdRef.current === requestSessionId) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-dark-panel border-l border-violet-500/30 shadow-2xl flex flex-col overflow-hidden animate-slideLeft">
      
      {/* Header */}
      <div className="p-4 border-b border-dark-border bg-dark-card/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 p-[1px]">
            <div className="w-full h-full bg-dark-panel rounded-[11px] flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-accent" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">AI Learning Mentor</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[260px]">
              Scoped to: {currentQuest?.title || 'Current Quest'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-hover transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 3-Tier Progression Bar */}
      <div className="p-3 bg-dark-card/80 border-b border-dark-border">
        <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
          <span>User-Controlled Help Progression:</span>
          <span className="text-[10px] text-violet-400">Step-by-step</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          <button
            onClick={() => handleSendPrompt('Give me a hint for this quest', 'hint')}
            className={`p-2 rounded-lg border font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              progressionTier === 'hint'
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                : 'bg-dark-panel border-dark-border text-slate-300 hover:border-amber-400/60'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>1. Hint</span>
          </button>

          <button
            onClick={() => handleSendPrompt('Show me a code example for this pattern', 'example')}
            className={`p-2 rounded-lg border font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              progressionTier === 'example'
                ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300'
                : 'bg-dark-panel border-dark-border text-slate-300 hover:border-cyan-400/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-accent" />
            <span>2. Example</span>
          </button>

          <button
            onClick={() => handleSendPrompt('Give me the complete guided walkthrough solution', 'solution')}
            className={`p-2 rounded-lg border font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              progressionTier === 'solution'
                ? 'bg-violet-950/40 border-violet-500/50 text-violet-300'
                : 'bg-dark-panel border-dark-border text-slate-300 hover:border-violet-400/60'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-violet-400" />
            <span>3. Solution</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
          >
            <div
              className={`max-w-[90%] rounded-2xl p-3.5 leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-violet-600 text-white rounded-tr-none'
                  : 'bg-dark-card border border-dark-border text-slate-200 rounded-tl-none space-y-2'
              }`}
            >
              {msg.title && (
                <div className="font-bold text-violet-300 border-b border-white/10 pb-1.5 flex items-center justify-between">
                  <span>{msg.title}</span>
                  {msg.levelBadge && (
                    <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-violet-600/30 text-cyan-300 font-mono">
                      {msg.levelBadge}
                    </span>
                  )}
                </div>
              )}
              <p>{msg.text}</p>
            </div>

            {/* Suggested prompts buttons */}
            {msg.suggestedPrompts && (
              <div className="flex flex-wrap gap-1.5 pt-1 max-w-[90%]">
                {msg.suggestedPrompts.map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSendPrompt(prompt)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-dark-panel border border-dark-border hover:border-violet-500/60 text-slate-400 hover:text-violet-300 transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-3 bg-dark-card rounded-2xl w-fit">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-accent" />
            <span>Consulting mentor knowledge base...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="p-3 border-t border-dark-border bg-dark-card/60">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendPrompt(inputMessage);
          }}
          className="flex items-center gap-2 bg-dark-panel border border-dark-border rounded-xl px-3 py-2 focus-within:border-violet-500 transition-colors"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="Ask mentor a question..."
            className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-none text-xs"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};
