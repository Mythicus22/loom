import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  Zap, 
  Award, 
  BookOpen, 
  PlayCircle, 
  FileText, 
  Code, 
  Sparkles, 
  Copy, 
  Check, 
  HelpCircle,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { RoadmapNode, Resource, UserProgress } from '../types';

interface QuestDetailDrawerProps {
  node: RoadmapNode | null;
  onClose: () => void;
  progress: UserProgress;
  onCompleteQuest: (nodeId: string, xp: number) => void;
  onOpenAssessment: (node: RoadmapNode) => void;
  onToggleBookmark: (resourceId: string) => void;
  onOpenMentorWithQuest: (node: RoadmapNode) => void;
}

export const QuestDetailDrawer: React.FC<QuestDetailDrawerProps> = ({
  node,
  onClose,
  progress,
  onCompleteQuest,
  onOpenAssessment,
  onToggleBookmark,
  onOpenMentorWithQuest,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);

  if (!node) return null;

  const isCompleted = progress.completedNodeIds?.includes(node.id);
  const isVerified = progress.verifiedNodeIds?.includes(node.id);
  const bookmarkedSet = new Set(progress.bookmarkedResourceIds || []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getFormatIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="w-3.5 h-3.5 text-red-400" />;
      case 'documentation': return <BookOpen className="w-3.5 h-3.5 text-cyan-accent" />;
      case 'interactive': return <Code className="w-3.5 h-3.5 text-violet-400" />;
      case 'article': return <FileText className="w-3.5 h-3.5 text-amber-400" />;
      default: return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] lg:w-[540px] bg-dark-panel border-l border-dark-border shadow-2xl flex flex-col overflow-hidden animate-slideLeft">
      
      {/* Header */}
      <div className="p-5 border-b border-dark-border bg-dark-card/50 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-violet-600/20 text-violet-300 border border-violet-500/30">
              Level {node.level} Quest
            </span>
            <span className="text-amber-400 font-mono text-xs font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              {node.xp} XP Bounty
            </span>
            <span className="text-slate-400 text-xs flex items-center gap-1 ml-1">
              <Clock className="w-3.5 h-3.5" />
              {node.estimatedMinutes} mins
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-white leading-tight">
            {node.title}
          </h2>
          {node.subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{node.subtitle}</p>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-hover transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* Status Callout */}
        {isCompleted && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 text-emerald-300 text-xs">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <div>
              <span className="font-bold">Quest Cleared!</span> {isVerified ? 'Mastery verified through assessment.' : 'Marked completed. Complete assessment for verified badge.'}
            </div>
          </div>
        )}

        {/* Why this quest matters */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Why This Quest Matters
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-dark-card p-3 rounded-xl border border-dark-border">
            {node.whyItMatters}
          </p>
        </div>

        {/* What you will learn */}
        {node.whatYouWillLearn && node.whatYouWillLearn.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Target Abilities & Outcomes
            </h3>
            <ul className="space-y-1.5">
              {node.whatYouWillLearn.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-accent shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Curated Resources */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Curated Learning Resources ({node.resources?.length || 0})
            </h3>
            <span className="text-[11px] text-slate-500">Verified links</span>
          </div>

          <div className="space-y-2">
            {(node.resources || []).map(res => {
              const isBookmarked = bookmarkedSet.has(res.id);
              return (
                <div
                  key={res.id}
                  className="p-3 rounded-xl bg-dark-card border border-dark-border hover:border-slate-600 transition-all text-xs group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5">{getFormatIcon(res.type)}</span>
                      <div>
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-slate-100 hover:text-cyan-accent flex items-center gap-1.5 transition-colors"
                        >
                          <span>{res.title}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-cyan-accent" />
                        </a>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                          <span className="text-violet-400 font-medium">{res.source}</span>
                          <span>•</span>
                          <span>{res.duration}</span>
                          <span>•</span>
                          <span className="capitalize">{res.difficulty}</span>
                        </div>
                        {res.description && (
                          <p className="text-[11px] text-slate-400 mt-1.5 leading-normal">
                            {res.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleBookmark(res.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                        isBookmarked 
                          ? 'text-amber-400 bg-amber-400/10' 
                          : 'text-slate-500 hover:text-slate-300 hover:bg-dark-hover'
                      }`}
                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Resource'}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Practical Quest Challenge */}
        {node.practicalTask && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Practical Challenge: {node.practicalTask.title}
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950/60 text-indigo-300 border border-indigo-500/30">
                Hands-on
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-card border border-dark-border space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed">
                {node.practicalTask.instructions}
              </p>

              {node.practicalTask.acceptanceCriteria?.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 font-semibold block">Acceptance Criteria:</span>
                  {node.practicalTask.acceptanceCriteria.map((crit, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      <span>{crit}</span>
                    </div>
                  ))}
                </div>
              )}

              {node.practicalTask.starterCode && (
                <div className="relative rounded-lg bg-dark-bg p-3 border border-dark-border font-mono text-[11px] text-emerald-300 overflow-x-auto">
                  <button
                    onClick={() => handleCopyCode(node.practicalTask.starterCode || '')}
                    className="absolute top-2 right-2 p-1 rounded bg-dark-panel border border-dark-border text-slate-400 hover:text-white"
                    title="Copy Starter Code"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                  <pre>{node.practicalTask.starterCode}</pre>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-dark-border bg-dark-card/60 flex flex-col sm:flex-row items-center gap-2.5">
        
        {/* Ask AI Mentor button */}
        <button
          onClick={() => onOpenMentorWithQuest(node)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-dark-panel border border-violet-500/40 hover:border-violet-400 text-violet-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-cyan-accent" />
          <span>Ask Mentor</span>
        </button>

        {/* Start Assessment or Mark Complete */}
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
          <button
            onClick={() => onOpenAssessment(node)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-glow-violet transition-all cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>{isVerified ? 'Retake Assessment' : 'Start Assessment (+XP)'}</span>
          </button>

          {!isCompleted && (
            <button
              onClick={() => onCompleteQuest(node.id, node.xp)}
              className="py-2.5 px-3 rounded-xl bg-dark-panel border border-dark-border hover:border-emerald-500 text-slate-300 hover:text-emerald-300 text-xs font-medium transition-all cursor-pointer"
              title="Quick mark completed without quiz"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
