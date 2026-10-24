import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  Award, 
  Bot, 
  Sliders, 
  ArrowLeft, 
  Share2, 
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';
import { MasterRoadmap, UserPlan, UserProgress, RoadmapNode } from '../types';
import { SkillTreeCanvas } from '../components/SkillTreeCanvas';
import { QuestDetailDrawer } from '../components/QuestDetailDrawer';
import { AssessmentModal } from '../components/AssessmentModal';

interface RoadmapViewPageProps {
  roadmap: MasterRoadmap | null;
  plan: UserPlan | null;
  progress: UserProgress;
  onCompleteQuest: (nodeId: string, xp: number) => Promise<any>;
  onSubmitAssessment: (planId: string, nodeId: string, answers: number[], submissionText: string) => Promise<any>;
  onToggleBookmark: (resourceId: string) => void;
  onOpenNewGoal: () => void;
  isMentorOpen: boolean;
  onToggleMentor: () => void;
  onOpenMentorWithQuest: (node: RoadmapNode) => void;
}

export const RoadmapViewPage: React.FC<RoadmapViewPageProps> = ({
  roadmap,
  plan,
  progress,
  onCompleteQuest,
  onSubmitAssessment,
  onToggleBookmark,
  onOpenNewGoal,
  isMentorOpen,
  onToggleMentor,
  onOpenMentorWithQuest,
}) => {
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [assessmentNode, setAssessmentNode] = useState<RoadmapNode | null>(null);

  if (!roadmap || !plan) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <Sparkles className="w-12 h-12 text-violet-400 animate-pulse" />
        <h2 className="text-xl font-bold text-white">No active roadmap selected</h2>
        <p className="text-xs text-slate-400">Head to the AI Chat homepage to generate or pick a quest!</p>
        <button
          onClick={onOpenNewGoal}
          className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs shadow-glow-violet cursor-pointer"
        >
          Create New Roadmap
        </button>
      </div>
    );
  }

  const completedCount = progress.completedNodeIds?.length || 0;
  const totalNodesCount = roadmap.nodes?.length || 1;
  const progressPercent = Math.min(100, Math.round((completedCount / totalNodesCount) * 100));

  // Determine current active node
  const activeNode = roadmap.nodes.find(n => n.id === plan.currentQuestId) || roadmap.nodes[0];

  const handleOpenAssessment = (node: RoadmapNode) => {
    setAssessmentNode(node);
    setIsAssessmentOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden relative">
      
      {/* ------------------------------------------------------------------ */}
      {/* A. Roadmap Navigation Header */}
      {/* ------------------------------------------------------------------ */}
      <div className="px-4 sm:px-6 py-3.5 border-b border-dark-border bg-dark-panel/95 backdrop-blur-md z-20 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Title & Goal Summary */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-violet-600/30 text-violet-300 border border-violet-500/40">
                {roadmap.domain}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30">
                Master Roadmap Reusable Architecture
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Pace: {plan.learnerProfile?.hoursPerWeek || 10}h/wk
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{roadmap.canonicalGoal}</span>
            </h1>

            {plan.userGoalRaw && plan.userGoalRaw !== roadmap.canonicalGoal && (
              <p className="text-xs text-slate-400 italic">
                Personalized from goal: "{plan.userGoalRaw}"
              </p>
            )}
          </div>

          {/* Overall Progress & Timeline Badge */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex flex-col text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  {progressPercent}% Complete
                </span>
                <span className="text-[11px] text-slate-400">
                  ({completedCount}/{totalNodesCount} Quests)
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-36 bg-dark-bg rounded-full h-1.5 overflow-hidden mt-1 border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-violet-600 via-cyan-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* B. Central Interactive Quest Map (SkillTreeCanvas) */}
      {/* ------------------------------------------------------------------ */}
      <SkillTreeCanvas
        roadmap={roadmap}
        plan={plan}
        progress={progress}
        selectedNodeId={selectedNode?.id || null}
        onSelectNode={node => setSelectedNode(node)}
      />

      {/* ------------------------------------------------------------------ */}
      {/* C. Quest Detail Drawer (Side panel / drawer) */}
      {/* ------------------------------------------------------------------ */}
      {selectedNode && (
        <QuestDetailDrawer
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          progress={progress}
          onCompleteQuest={onCompleteQuest}
          onOpenAssessment={node => handleOpenAssessment(node)}
          onToggleBookmark={onToggleBookmark}
          onOpenMentorWithQuest={node => onOpenMentorWithQuest(node)}
        />
      )}

      {/* Assessment Modal */}
      {isAssessmentOpen && assessmentNode && (
        <AssessmentModal
          node={assessmentNode}
          onClose={() => {
            setIsAssessmentOpen(false);
            setAssessmentNode(null);
          }}
          onSubmit={async (answers, submissionText) => {
            return await onSubmitAssessment(plan.id, assessmentNode.id, answers, submissionText);
          }}
        />
      )}

    </div>
  );
};
