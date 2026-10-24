import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
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
  Eye,
  GripHorizontal,
  RotateCcw,
  Move
} from 'lucide-react';
import { MasterRoadmap, RoadmapNode, UserPlan, UserProgress } from '../types';

interface SkillTreeCanvasProps {
  roadmap: MasterRoadmap;
  plan: UserPlan;
  progress: UserProgress;
  selectedNodeId: string | null;
  onSelectNode: (node: RoadmapNode) => void;
}

const NODE_WIDTH = 230;
const NODE_HEIGHT = 100;

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

  // Dynamic node positions state for dragging & stretching arrows
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [isDraggingNodeId, setIsDraggingNodeId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragInfoRef = useRef<{
    nodeId: string;
    startMouseX: number;
    startMouseY: number;
    startNodeX: number;
    startNodeY: number;
    hasMoved: boolean;
  } | null>(null);

  // Initialize or reset node positions when roadmap changes with comfortable spacious spacing
  const computeSpacedPositions = useCallback(() => {
    const posMap: Record<string, { x: number; y: number }> = {};
    const SPACING_X_RATIO = 1.45; // Expand horizontal spacing from legacy 220px to ~320px
    const SPACING_Y_RATIO = 1.35; // Expand vertical branch spacing

    roadmap.nodes.forEach((n, idx) => {
      if (n.position && typeof n.position.x === 'number' && typeof n.position.y === 'number') {
        // Generously space out preloaded node coordinates
        posMap[n.id] = {
          x: Math.round(100 + (n.position.x - 100) * SPACING_X_RATIO),
          y: Math.round(120 + (n.position.y - 120) * SPACING_Y_RATIO),
        };
      } else {
        // Fallback staggered layout with generous padding
        posMap[n.id] = {
          x: 100 + (idx % 3) * 380,
          y: 120 + Math.floor(idx / 3) * 220,
        };
      }
    });
    return posMap;
  }, [roadmap.nodes]);

  useEffect(() => {
    setNodePositions(computeSpacedPositions());
  }, [roadmap.id, computeSpacedPositions]);

  // Reset positions to spacious default
  const handleResetPositions = () => {
    setNodePositions(computeSpacedPositions());
    setZoom(1);
  };

  // Completed & verified nodes
  const completedSet = useMemo(() => new Set(progress.completedNodeIds || []), [progress.completedNodeIds]);
  const verifiedSet = useMemo(() => new Set(progress.verifiedNodeIds || []), [progress.verifiedNodeIds]);

  // Current quest id
  const currentQuestId = plan.currentQuestId || roadmap.nodes[0]?.id;

  // Determine node states
  const getNodeState = useCallback((node: RoadmapNode) => {
    const isCompleted = completedSet.has(node.id);
    const isCurrent = node.id === currentQuestId;
    
    // Check if all prerequisites completed
    const prereqs = node.prerequisites || [];
    const allPrereqsMet = prereqs.every(prereqId => completedSet.has(prereqId));

    if (isCompleted) return 'completed';
    if (isCurrent) return 'current';
    if (allPrereqsMet || prereqs.length === 0) return 'available';
    return 'locked';
  }, [completedSet, currentQuestId]);

  // Node lookup map
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

  // Drag handlers for moving nodes
  const handleNodeMouseDown = (e: React.MouseEvent, node: RoadmapNode) => {
    // Only handle primary left click
    if (e.button !== 0) return;
    e.stopPropagation();

    const currentPos = nodePositions[node.id] || node.position;
    dragInfoRef.current = {
      nodeId: node.id,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startNodeX: currentPos.x,
      startNodeY: currentPos.y,
      hasMoved: false,
    };
    setIsDraggingNodeId(node.id);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragInfoRef.current) return;
      const { startMouseX, startMouseY, startNodeX, startNodeY } = dragInfoRef.current;
      const dx = (moveEvent.clientX - startMouseX) / zoom;
      const dy = (moveEvent.clientY - startMouseY) / zoom;

      if (Math.hypot(dx, dy) > 4) {
        dragInfoRef.current.hasMoved = true;
      }

      setNodePositions(prev => ({
        ...prev,
        [node.id]: {
          x: Math.max(20, Math.round(startNodeX + dx)),
          y: Math.max(20, Math.round(startNodeY + dy)),
        },
      }));
    };

    const handleMouseUp = () => {
      const info = dragInfoRef.current;
      dragInfoRef.current = null;
      setIsDraggingNodeId(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      // If user merely clicked without moving, open node detail
      if (info && !info.hasMoved) {
        onSelectNode(node);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Generate dynamic Bezier curves with arrows that stretch as nodes move
  const renderedConnections = useMemo(() => {
    const lines: Array<{
      id: string;
      d: string;
      isOptional: boolean;
      isActive: boolean;
      isCompleted: boolean;
      markerType: 'completed' | 'active' | 'default' | 'optional';
    }> = [];

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
        const posSource = nodePositions[sourceNode.id] || sourceNode.position;
        const posTarget = nodePositions[targetNode.id] || targetNode.position;

        const isSourceCompleted = completedSet.has(sourceNode.id);
        const isTargetActive = targetNode.id === currentQuestId;
        const isBothCompleted = isSourceCompleted && completedSet.has(targetNode.id);

        // Center points
        const cxSource = posSource.x + NODE_WIDTH / 2;
        const cySource = posSource.y + NODE_HEIGHT / 2;
        const cxTarget = posTarget.x + NODE_WIDTH / 2;
        const cyTarget = posTarget.y + NODE_HEIGHT / 2;

        let startX: number;
        let startY: number;
        let endX: number;
        let endY: number;
        let cp1x: number;
        let cp1y: number;
        let cp2x: number;
        let cp2y: number;

        // Determine orientation relative to each other for professional connection ports
        const dx = cxTarget - cxSource;
        const dy = cyTarget - cySource;

        if (Math.abs(dx) >= Math.abs(dy)) {
          // Horizontal primary flow
          if (dx > 0) {
            // Source is left of Target
            startX = posSource.x + NODE_WIDTH;
            startY = cySource;
            endX = posTarget.x - 7; // offset slightly for arrow head
            endY = cyTarget;
          } else {
            // Source is right of Target
            startX = posSource.x;
            startY = cySource;
            endX = posTarget.x + NODE_WIDTH + 7;
            endY = cyTarget;
          }
          const deltaX = Math.max(50, Math.abs(endX - startX) * 0.45);
          cp1x = dx > 0 ? startX + deltaX : startX - deltaX;
          cp1y = startY;
          cp2x = dx > 0 ? endX - deltaX : endX + deltaX;
          cp2y = endY;
        } else {
          // Vertical primary flow
          if (dy > 0) {
            // Source is above Target
            startX = cxSource;
            startY = posSource.y + NODE_HEIGHT;
            endX = cxTarget;
            endY = posTarget.y - 7;
          } else {
            // Source is below Target
            startX = cxSource;
            startY = posSource.y;
            endX = cxTarget;
            endY = posTarget.y + NODE_HEIGHT + 7;
          }
          const deltaY = Math.max(40, Math.abs(endY - startY) * 0.45);
          cp1x = startX;
          cp1y = dy > 0 ? startY + deltaY : startY - deltaY;
          cp2x = endX;
          cp2y = dy > 0 ? endY - deltaY : endY + deltaY;
        }

        const d = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;

        let markerType: 'completed' | 'active' | 'default' | 'optional' = 'default';
        if (isBothCompleted) markerType = 'completed';
        else if (isTargetActive) markerType = 'active';
        else if (edge.isOptional) markerType = 'optional';

        lines.push({
          id: edge.id || `line-${idx}`,
          d,
          isOptional: Boolean(edge.isOptional),
          isActive: isSourceCompleted && isTargetActive,
          isCompleted: isBothCompleted,
          markerType,
        });
      }
    });

    return lines;
  }, [roadmap.edges, roadmap.nodes, nodeMap, nodePositions, completedSet, currentQuestId]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-dark-bg relative select-none">
      
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-2.5 border-b border-dark-border bg-dark-panel/85 backdrop-blur-md z-10">
        
        {/* Stage Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full text-xs">
          <button
            onClick={() => setActiveStageFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
              activeStageFilter === 'all'
                ? 'bg-violet-accent/20 text-violet-300 border border-violet-500/40 shadow-glow-violet/20 font-bold'
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
                  ? 'bg-cyan-950/50 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-dark-hover'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stage.color }}></span>
              <span>Stage {idx + 1}: {stage.title}</span>
            </button>
          ))}
        </div>

        {/* View Mode, Layout Reset & Zoom Controls */}
        <div className="flex items-center gap-2">
          
          {/* Draggable hint indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-dark-card border border-dark-border text-[11px] text-slate-400">
            <Move className="w-3 h-3 text-cyan-accent" />
            <span>Drag nodes freely</span>
          </div>

          {/* Reset positions */}
          <button
            onClick={handleResetPositions}
            className="p-1.5 rounded-lg bg-dark-card border border-dark-border hover:border-slate-500 text-slate-400 hover:text-white text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title="Reset Nodes to Default Layout"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Reset Layout</span>
          </button>

          {/* Switch View Mode */}
          <div className="flex items-center rounded-lg bg-dark-card border border-dark-border p-0.5 text-xs">
            <button
              onClick={() => setViewMode('canvas')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'canvas' ? 'bg-violet-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
              title="Interactive RPG Skill Tree Graph"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Graph</span>
            </button>
            <button
              onClick={() => setViewMode('vertical')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'vertical' ? 'bg-violet-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
              title="Vertical Quest Stream"
            >
              <ListTree className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          {/* Zoom controls */}
          {viewMode === 'canvas' && (
            <div className="flex items-center rounded-lg bg-dark-card border border-dark-border p-0.5 text-xs">
              <button
                onClick={() => setZoom(z => Math.max(0.5, Number((z - 0.15).toFixed(2))))}
                className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-[11px] font-mono text-slate-300">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(z => Math.min(1.6, Number((z + 0.15).toFixed(2))))}
                className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1.5 text-slate-400 hover:text-white transition-colors ml-0.5 cursor-pointer"
                title="Reset Zoom to 100%"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 1. Canvas Graph View (Draggable RPG Skill Tree with Dynamic Arrows) */}
      {/* -------------------------------------------------------------------- */}
      {viewMode === 'canvas' && (
        <div 
          ref={containerRef}
          className="flex-1 w-full h-full overflow-auto quest-grid-pattern relative p-8"
        >
          <div 
            style={{ 
              transform: `scale(${zoom})`, 
              transformOrigin: '0 0',
              minWidth: '2800px',
              minHeight: '1100px',
            }}
            className="relative"
          >
            {/* SVG Connecting Curves with Directional Arrowheads */}
            <svg 
              className="absolute inset-0 pointer-events-none w-full h-full overflow-visible"
              style={{ zIndex: 1 }}
            >
              <defs>
                {/* Arrowhead Markers */}
                <marker 
                  id="arrow-completed" 
                  viewBox="0 0 10 10" 
                  refX="7" 
                  refY="5" 
                  markerWidth="6" 
                  markerHeight="6" 
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10B981" />
                </marker>

                <marker 
                  id="arrow-active" 
                  viewBox="0 0 10 10" 
                  refX="7" 
                  refY="5" 
                  markerWidth="6" 
                  markerHeight="6" 
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#DADADC" />
                </marker>

                <marker 
                  id="arrow-default" 
                  viewBox="0 0 10 10" 
                  refX="7" 
                  refY="5" 
                  markerWidth="6" 
                  markerHeight="6" 
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#4B5563" />
                </marker>

                <marker 
                  id="arrow-optional" 
                  viewBox="0 0 10 10" 
                  refX="7" 
                  refY="5" 
                  markerWidth="6" 
                  markerHeight="6" 
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#8B8B90" />
                </marker>

                {/* Linear Gradients for Paths */}
                <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#B8B8BC" />
                </linearGradient>
                <linearGradient id="completedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#83C9A9" />
                </linearGradient>
              </defs>

              {renderedConnections.map(line => (
                <g key={line.id}>
                  {/* Subtle Glow Layer */}
                  <path
                    d={line.d}
                    fill="none"
                    stroke={
                      line.isCompleted
                        ? 'rgba(16, 185, 129, 0.35)'
                        : line.isActive
                        ? 'rgba(237, 237, 237, 0.18)'
                        : 'rgba(255, 255, 255, 0.04)'
                    }
                    strokeWidth={line.isActive ? 5 : 3.5}
                    strokeDasharray={line.isOptional ? '6 4' : undefined}
                  />

                  {/* Main Stroke with Directional Arrowhead markerEnd */}
                  <path
                    d={line.d}
                    fill="none"
                    stroke={
                      line.isCompleted
                        ? 'url(#completedGradient)'
                        : line.isActive
                        ? 'url(#activeGradient)'
                        : '#374151'
                    }
                    strokeWidth={line.isActive ? 2.5 : 2}
                    strokeDasharray={line.isOptional ? '6 4' : undefined}
                    markerEnd={`url(#arrow-${line.markerType})`}
                  />
                </g>
              ))}
            </svg>

            {/* Draggable Quest Nodes */}
            <div className="relative" style={{ zIndex: 2 }}>
              {displayNodes.map(node => {
                const pos = nodePositions[node.id] || node.position;
                const state = getNodeState(node);
                const isSelected = node.id === selectedNodeId;
                const isCurrent = state === 'current';
                const isCompleted = state === 'completed';
                const isLocked = state === 'locked';
                const isDragging = isDraggingNodeId === node.id;

                return (
                  <div
                    key={node.id}
                    onMouseDown={e => handleNodeMouseDown(e, node)}
                    style={{
                      left: `${pos.x}px`,
                      top: `${pos.y}px`,
                      width: `${NODE_WIDTH}px`,
                      height: `${NODE_HEIGHT}px`,
                    }}
                    className={`absolute p-3 rounded-2xl select-none transition-shadow duration-200 group flex flex-col justify-between ${
                      isDragging
                        ? 'cursor-grabbing shadow-2xl ring-2 ring-cyan-400 z-30 scale-105 opacity-95'
                        : 'cursor-grab hover:scale-[1.02] z-10'
                    } ${
                      isSelected
                        ? 'ring-2 ring-cyan-accent ring-offset-2 ring-offset-dark-bg z-20'
                        : ''
                    } ${
                      isCurrent
                        ? 'bg-gradient-to-b from-[#28282B] via-[#171719] to-[#101012] border-2 border-violet-accent shadow-glow-violet active-quest-pulse'
                        : isCompleted
                        ? 'bg-gradient-to-b from-[#064E3B]/30 via-[#171719] to-[#101012] border border-emerald-500/40 shadow-glow-emerald/20'
                        : isLocked
                        ? 'bg-dark-panel/80 border border-dark-border opacity-70 grayscale hover:grayscale-0'
                        : 'bg-dark-card border border-dark-border hover:border-violet-500/50 shadow-lg'
                    }`}
                  >
                    {/* Node Header Row: Level + Drag Handle + XP */}
                    <div className="flex items-center justify-between">
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

                      {/* Grip handle indicating Draggable */}
                      <div className="flex items-center gap-1.5">
                        <span title="Drag to move node">
                          <GripHorizontal className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-amber-400 flex items-center gap-0.5">
                          <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {node.xp} XP
                        </span>
                      </div>
                    </div>

                    {/* Node Title & Subtitle */}
                    <div>
                      <h4 className={`font-bold text-xs tracking-tight leading-snug line-clamp-2 ${
                        isCurrent ? 'text-white' : isCompleted ? 'text-emerald-100' : 'text-slate-200'
                      }`}>
                        {node.title}
                      </h4>
                    </div>

                    {/* Bottom Status Row */}
                    <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px]">
                      {isCompleted ? (
                        <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Cleared</span>
                        </div>
                      ) : isCurrent ? (
                        <div className="flex items-center gap-1 text-violet-300 font-semibold animate-pulse">
                          <Sparkles className="w-3 h-3 text-cyan-accent" />
                          <span>In Progress</span>
                        </div>
                      ) : isLocked ? (
                        <div className="flex items-center gap-1 text-slate-400">
                          <Lock className="w-3 h-3" />
                          <span>Locked</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-cyan-400">
                          <Eye className="w-3 h-3" />
                          <span>Unlocked</span>
                        </div>
                      )}

                      {node.isOptional && (
                        <span className="text-[9px] text-purple-400 font-medium">
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
      {/* 2. Vertical Stream List View (Sequential / Mobile friendly) */}
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
        <div className="text-slate-500 hidden sm:block">
          💡 Click and drag any node to reposition — directional arrows stretch automatically
        </div>
      </div>

    </div>
  );
};
