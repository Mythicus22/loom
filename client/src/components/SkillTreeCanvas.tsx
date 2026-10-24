import React, { useState, useRef, useMemo } from 'react';
import { 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Zap, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  ChevronRight, 
  ListTree, 
  GitFork, 
  Award, 
  HelpCircle,
  Eye
} from 'lucide-react';
import { MasterRoadmap, RoadmapNode, UserPlan, UserProgress } from '../types';

interface SkillTreeCanvasProps {
  roadmap: MasterRoadmap;
  plan: UserPlan;
  progress: UserProgress;
  selectedNodeId: string | null;
  onSelectNode: (node: RoadmapNode) => void;
}

export const SkillTreeCanvas: React.FC<SkillTreeCanvasProps> = ({
  roadmap,
  plan,
  progress,
  selectedNodeId,
  onSelectNode,
}) => {
  const [zoom, setZoom] = useState(1);
  const [activeStageFilter, setActiveStageFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'canvas' | 'vertical'>('canvas');

  const containerRef = useRef<HTMLDivElement>(null);

  // Completed & verified nodes
  const completedSet = useMemo(() => new Set(progress.completedNodeIds || []), [progress.completedNodeIds]);
  const verifiedSet = useMemo(() => new Set(progress.verifiedNodeIds || []), [progress.verifiedNodeIds]);

  // Current quest id
  const currentQuestId = plan.currentQuestId || roadmap.nodes[0]?.id;

  // Determine node states
  const getNodeState = (node: RoadmapNode) => {
    const isCompleted = completedSet.has(node.id);
    const isVerified = verifiedSet.has(node.id);
    const isCurrent = node.id === currentQuestId;
    
    // Check if all prerequisites completed
    const prereqs = node.prerequisites || [];
    const allPrereqsMet = prereqs.every(prereqId => completedSet.has(prereqId));

    if (isCompleted) return 'completed';
    if (isCurrent) return 'current';
    if (allPrereqsMet || prereqs.length === 0) return 'available';
    return 'locked';
  };

  // Node position map
  const nodeMap = useMemo(() => {
    const map = new Map<string, RoadmapNode>();
    roadmap.nodes.forEach(n => map.set(n.id, n));
    return map;
  }, [roadmap.nodes]);

  // Filtered nodes
  const displayNodes = useMemo(() => {
    if (activeStageFilter === 'all') return roadmap.nodes;
    return roadmap.nodes.filter(n => n.stageId === activeStageFilter);
  }, [roadmap.nodes, activeStageFilter]);

  // Generate SVG Bezier curve connections
  const renderedConnections = useMemo(() => {
    const lines: Array<{
      id: string;
      d: string;
      isOptional: boolean;
      isActive: boolean;
      isCompleted: boolean;
    }> = [];

    // Derive edges from roadmap edges or prerequisites
    const edgesToDraw = (roadmap.edges && roadmap.edges.length > 0)
      ? roadmap.edges
      : roadmap.nodes.flatMap(target => 
          (target.prerequisites || []).map(sourceId => ({
            id: `edge-${sourceId}-${target.id}`,
            source: sourceId,
            target: target.id,
            isOptional: target.isOptional
          }))
        );

    edgesToDraw.forEach((edge, idx) => {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);

      if (sourceNode && targetNode) {
        // Node dimensions: 220px wide, 90px high
        const startX = sourceNode.position.x + 220;
        const startY = sourceNode.position.y + 45;
        const endX = targetNode.position.x;
        const endY = targetNode.position.y + 45;

        // Smooth cubic Bezier control points
        const deltaX = Math.max(40, (endX - startX) / 2);
        const d = `M ${startX} ${startY} C ${startX + deltaX} ${startY}, ${endX - deltaX} ${endY}, ${endX} ${endY}`;

        const isSourceCompleted = completedSet.has(sourceNode.id);
        const isTargetActive = targetNode.id === currentQuestId;
        const isBothCompleted = isSourceCompleted && completedSet.has(targetNode.id);

        lines.push({
          id: edge.id || `line-${idx}`,
          d,
          isOptional: Boolean(edge.isOptional),
          isActive: isSourceCompleted && isTargetActive,
          isCompleted: isBothCompleted,
        });
      }
    });

    return lines;
  }, [roadmap.edges, roadmap.nodes, nodeMap, completedSet, currentQuestId]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-dark-bg relative select-none">
      
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-dark-border bg-dark-panel/60 backdrop-blur-md z-10">
        
        {/* Stage Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full text-xs">
          <button
            onClick={() => setActiveStageFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
              activeStageFilter === 'all'
                ? 'bg-violet-accent/20 text-violet-300 border border-violet-500/40 shadow-glow-violet/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-dark-hover'
            }`}
          >
            All Stages ({roadmap.stages?.length || 0})
          </button>

          {(roadmap.stages || []).map((stage, idx) => (
            <button
              key={stage.id}
              onClick={() => setActiveStageFilter(stage.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeStageFilter === stage.id
                  ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-dark-hover'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stage.color }}></span>
              <span>Stage {idx + 1}: {stage.title}</span>
            </button>
          ))}
        </div>

        {/* View Mode & Zoom Controls */}
        <div className="flex items-center gap-2">
          {/* Switch View Mode */}
          <div className="flex items-center rounded-lg bg-dark-card border border-dark-border p-0.5 text-xs">
            <button
              onClick={() => setViewMode('canvas')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
                viewMode === 'canvas' ? 'bg-violet-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
              title="RPG Skill Tree Canvas"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Graph</span>
            </button>
            <button
              onClick={() => setViewMode('vertical')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
                viewMode === 'vertical' ? 'bg-violet-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
              title="Vertical Quest Stream"
            >
              <ListTree className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          {/* Zoom controls (only in canvas mode) */}
          {viewMode === 'canvas' && (
            <div className="flex items-center rounded-lg bg-dark-card border border-dark-border p-0.5 text-xs">
              <button
                onClick={() => setZoom(z => Math.max(0.6, z - 0.15))}
                className="p-1.5 text-slate-400 hover:text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-[11px] font-mono text-slate-300">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(z => Math.min(1.5, z + 0.15))}
                className="p-1.5 text-slate-400 hover:text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1.5 text-slate-400 hover:text-white transition-colors ml-0.5"
                title="Fit to Screen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 1. Canvas Graph View (RPG Skill Tree with connected paths) */}
      {/* -------------------------------------------------------------------- */}
      {viewMode === 'canvas' && (
        <div 
          ref={containerRef}
          className="flex-1 w-full h-full overflow-auto quest-grid-pattern relative p-8 cursor-grab active:cursor-grabbing"
        >
          <div 
            style={{ 
              transform: `scale(${zoom})`, 
              transformOrigin: '0 0',
              minWidth: '1600px',
              minHeight: '650px',
            }}
            className="relative transition-transform duration-150 ease-out"
          >
            {/* SVG Connecting Bezier Paths */}
            <svg 
              className="absolute inset-0 pointer-events-none w-full h-full"
              style={{ zIndex: 1 }}
            >
              <defs>
                <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
                <linearGradient id="completedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>

              {renderedConnections.map(line => (
                <g key={line.id}>
                  {/* Subtle glow layer */}
                  <path
                    d={line.d}
                    fill="none"
                    stroke={
                      line.isCompleted
                        ? 'rgba(16, 185, 129, 0.35)'
                        : line.isActive
                        ? 'rgba(139, 92, 246, 0.45)'
                        : 'rgba(255, 255, 255, 0.08)'
                    }
                    strokeWidth={line.isActive ? 5 : 3}
                    strokeDasharray={line.isOptional ? '6 4' : undefined}
                  />
                  {/* Foreground stroke */}
                  <path
                    d={line.d}
                    fill="none"
                    stroke={
                      line.isCompleted
                        ? 'url(#completedGradient)'
                        : line.isActive
                        ? 'url(#activeGradient)'
                        : '#232736'
                    }
                    strokeWidth={line.isActive ? 2.5 : 2}
                    strokeDasharray={line.isOptional ? '6 4' : undefined}
                  />
                </g>
              ))}
            </svg>

            {/* Nodes on Canvas */}
            <div className="relative" style={{ zIndex: 2 }}>
              {displayNodes.map(node => {
                const state = getNodeState(node);
                const isSelected = node.id === selectedNodeId;
                const isCurrent = state === 'current';
                const isCompleted = state === 'completed';
                const isLocked = state === 'locked';

                return (
                  <div
                    key={node.id}
                    onClick={() => onSelectNode(node)}
                    style={{
                      left: `${node.position.x}px`,
                      top: `${node.position.y}px`,
                      width: '220px',
                    }}
                    className={`absolute p-3.5 rounded-2xl cursor-pointer select-none transition-all duration-300 ${
                      isSelected
                        ? 'ring-2 ring-cyan-accent ring-offset-2 ring-offset-dark-bg scale-105 z-20'
                        : 'hover:scale-[1.03] z-10'
                    } ${
                      isCurrent
                        ? 'bg-gradient-to-b from-[#1E1B4B] to-[#11131A] border-2 border-violet-accent shadow-glow-violet active-quest-pulse'
                        : isCompleted
                        ? 'bg-gradient-to-b from-[#064E3B]/40 to-[#11131A] border border-emerald-500/50 shadow-glow-emerald/20'
                        : isLocked
                        ? 'bg-dark-panel/60 border border-dark-border opacity-65 grayscale hover:grayscale-0'
                        : 'bg-dark-card border border-dark-border hover:border-violet-500/50 shadow-lg'
                    }`}
                  >
                    {/* Top Node Pill Header */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        isCurrent
                          ? 'bg-violet-600 text-white font-extrabold shadow-glow-violet'
                          : isCompleted
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : isLocked
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-slate-800/80 text-cyan-300 border border-cyan-500/20'
                      }`}>
                        {isCurrent ? '⚡ Active Quest' : `Level ${node.level}`}
                      </span>

                      <span className="text-[11px] font-mono font-semibold text-amber-400 flex items-center gap-0.5">
                        <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {node.xp} XP
                      </span>
                    </div>

                    {/* Node Title & Subtitle */}
                    <h4 className={`font-bold text-sm tracking-tight leading-snug line-clamp-2 ${
                      isCurrent ? 'text-white' : isCompleted ? 'text-emerald-100' : 'text-slate-200'
                    }`}>
                      {node.title}
                    </h4>
                    
                    {node.subtitle && (
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                        {node.subtitle}
                      </p>
                    )}

                    {/* Bottom Status Row */}
                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                      {isCompleted ? (
                        <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Cleared</span>
                        </div>
                      ) : isCurrent ? (
                        <div className="flex items-center gap-1 text-violet-300 font-semibold animate-pulse">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-accent" />
                          <span>In Progress</span>
                        </div>
                      ) : isLocked ? (
                        <div className="flex items-center gap-1 text-slate-400">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Locked</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-cyan-400">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Unlocked</span>
                        </div>
                      )}

                      {node.isOptional && (
                        <span className="text-[10px] text-purple-400 font-medium">
                          Optional
                        </span>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 2. Vertical Stream List View (Mobile Optimized & Step-by-Step) */}
      {/* -------------------------------------------------------------------- */}
      {viewMode === 'vertical' && (
        <div className="flex-1 w-full overflow-y-auto p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
          <div className="text-xs text-slate-400 mb-2">
            Sequential learning path ordered by milestone dependencies:
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-dark-border">
            {displayNodes.map((node, idx) => {
              const state = getNodeState(node);
              const isSelected = node.id === selectedNodeId;
              const isCurrent = state === 'current';
              const isCompleted = state === 'completed';
              const isLocked = state === 'locked';

              return (
                <div key={node.id} className="relative group">
                  {/* Timeline Dot Indicator */}
                  <div className={`absolute -left-[27px] top-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-400 text-white'
                      : isCurrent
                      ? 'bg-violet-600 border-cyan-400 text-white shadow-glow-violet active-quest-pulse'
                      : isLocked
                      ? 'bg-dark-panel border-dark-border text-slate-500'
                      : 'bg-dark-card border-slate-600 text-slate-300'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <span className="text-[9px] font-bold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Card Container */}
                  <div
                    onClick={() => onSelectNode(node)}
                    className={`p-4 rounded-xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'border-cyan-accent bg-dark-card shadow-glow-cyan/20 scale-[1.01]'
                        : isCurrent
                        ? 'border-violet-accent bg-gradient-to-r from-violet-950/40 to-dark-panel shadow-glow-violet/20'
                        : isCompleted
                        ? 'border-emerald-500/40 bg-dark-panel'
                        : 'border-dark-border bg-dark-panel hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-violet-300 font-semibold">Stage Level {node.level}</span>
                      <span className="text-amber-400 font-mono font-medium flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-amber-400" />
                        {node.xp} XP
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white leading-tight">
                      {node.title}
                    </h4>

                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {node.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-white/5">
                      <span className="text-slate-400">
                        {node.resources?.length || 0} resources • {node.estimatedMinutes} mins
                      </span>
                      <span className="text-cyan-400 flex items-center gap-1 font-medium group-hover:translate-x-1 transition-transform">
                        <span>Inspect Quest</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend Footer */}
      <div className="px-4 py-2 bg-dark-panel/90 border-t border-dark-border flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-3 z-10">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-glow-violet"></span>
            <span className="text-violet-300 font-semibold">Active Quest</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Cleared (Verified)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>Unlocked</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
            <span>Locked</span>
          </span>
        </div>
        <div className="hidden sm:block text-slate-500">
          Click any node to view learning materials, code challenges & quizzes
        </div>
      </div>

    </div>
  );
};
