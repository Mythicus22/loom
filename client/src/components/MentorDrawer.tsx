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
  Loader2,
  Minus,
  Maximize2
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
  const [isMinimized, setIsMinimized] = useState(false);
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
          title: `AI Learning Mentor`,
          text: `Hi! I'm your AI learning mentor for **${plan?.canonicalGoal || 'your journey'}**.\nAsk me questions about your current quest or pick a quick helper option below for short, focused advice!`,
          suggestedPrompts: [
            '💡 Give me a Hint',
            '🔍 Show a Code Example',
            'Explain this simply',
            'Practical tips for this quest'
          ]
        }
      ]);
    }
  }, [isOpen, currentQuest?.id, plan?.id, messages.length]);

  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isMinimized]);

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

      // Parse JSON if reply text was raw json
      let cleanText = reply.content;
      if (typeof cleanText === 'string' && cleanText.trim().startsWith('{') && cleanText.trim().endsWith('}')) {
        try {
          const parsed = JSON.parse(cleanText.trim());
          cleanText = parsed.chat_response?.answer || parsed.answer || parsed.message || cleanText;
        } catch {
          // ignore
        }
      }

      const aiMsg: MentorMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        title: reply.title,
        text: cleanText,
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
    <div 
      className={`fixed bottom-5 right-5 z-50 w-[92vw] sm:w-[420px] bg-dark-panel/95 backdrop-blur-xl border border-violet-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 shadow-glow-violet/10 ${
        isMinimized ? 'h-[62px]' : 'h-[580px] max-h-[85vh]'
      }`}
    >
      
      {/* Header */}
      <div className="p-3.5 border-b border-dark-border bg-dark-card/70 flex items-center justify-between shrink-0 select-none">
        <div 
          className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
          onClick={() => setIsMinimized(prev => !prev)}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 p-[1px] shrink-0">
            <div className="w-full h-full bg-dark-panel rounded-[11px] flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-accent" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-white truncate">AI Learning Mentor</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              {currentQuest?.title ? `Quest: ${currentQuest.title}` : 'Ready to help'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          <button
            onClick={() => setIsMinimized(prev => !prev)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-hover transition-colors cursor-pointer"
            title={isMinimized ? 'Expand Chat' : 'Minimize Chat'}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-hover transition-colors cursor-pointer"
            title="Close Chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* 3-Tier Progression Bar */}
          <div className="p-2.5 bg-dark-card/50 border-b border-dark-border shrink-0">
            <div className="text-[10px] font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Quick Help Tiers:</span>
              <span className="text-[10px] text-violet-400 font-mono">Instant Advice</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                onClick={() => handleSendPrompt('Give me a quick hint for this quest', 'hint')}
                className={`p-1.5 rounded-lg border font-medium flex items-center justify-center gap-1 transition-all cursor-pointer text-[11px] ${
                  progressionTier === 'hint'
                    ? 'bg-amber-950/50 border-amber-500/50 text-amber-300'
                    : 'bg-dark-panel border-dark-border text-slate-300 hover:border-amber-400/60'
                }`}
              >
                <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
                <span>1. Hint</span>
              </button>

              <button
                onClick={() => handleSendPrompt('Show me a brief code example for this pattern', 'example')}
                className={`p-1.5 rounded-lg border font-medium flex items-center justify-center gap-1 transition-all cursor-pointer text-[11px] ${
                  progressionTier === 'example'
                    ? 'bg-cyan-950/50 border-cyan-500/50 text-cyan-300'
                    : 'bg-dark-panel border-dark-border text-slate-300 hover:border-cyan-400/60'
                }`}
              >
                <Code2 className="w-3 h-3 text-cyan-accent shrink-0" />
                <span>2. Example</span>
              </button>

              <button
                onClick={() => handleSendPrompt('Give me a step-by-step solution walkthrough', 'solution')}
                className={`p-1.5 rounded-lg border font-medium flex items-center justify-center gap-1 transition-all cursor-pointer text-[11px] ${
                  progressionTier === 'solution'
                    ? 'bg-violet-950/50 border-violet-500/50 text-violet-300'
                    : 'bg-dark-panel border-dark-border text-slate-300 hover:border-violet-400/60'
                }`}
              >
                <Wrench className="w-3 h-3 text-violet-400 shrink-0" />
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
          <div className="p-3 border-t border-dark-border bg-dark-card/60 shrink-0">
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
        </>
      )}

    </div>
  );
};
