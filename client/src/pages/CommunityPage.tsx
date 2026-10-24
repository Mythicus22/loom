import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Search, 
  Hash, 
  Compass, 
  Bot, 
  Flame, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  ThumbsUp, 
  Share2, 
  Bookmark, 
  Filter,
  TrendingUp,
  Code2,
  Cpu,
  Layers,
  HelpCircle,
  MoreVertical,
  Smile
} from 'lucide-react';
import { MasterRoadmap } from '../types';

interface CommunityMessage {
  id: string;
  channelId: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    level: number;
    badge?: string;
    isAiMentor?: boolean;
  };
  text: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  timestamp: string;
  likes: number;
  likedByMe?: boolean;
  repliesCount: number;
  tags?: string[];
}

interface Channel {
  id: string;
  name: string;
  description: string;
  category: 'General' | 'Roadmap Guilds' | 'Project Showcases' | 'Study Rooms';
  memberCount: number;
  unreadCount?: number;
  icon?: any;
}

const CHANNELS: Channel[] = [
  { id: 'ai-agents', name: 'ai-agents-and-rag', description: 'LangGraph, hybrid RAG, evaluations, and multi-agent systems', category: 'Roadmap Guilds', memberCount: 1420, unreadCount: 3, icon: Bot },
  { id: 'fullstack-web', name: 'fullstack-web-dev', description: 'React, Node.js APIs, Next.js, and database modeling', category: 'Roadmap Guilds', memberCount: 2350, icon: Code2 },
  { id: 'dsa-algo', name: 'dsa-placement-prep', description: 'LeetCode patterns, graphs, DP, and interview problem sets', category: 'Roadmap Guilds', memberCount: 3100, unreadCount: 7, icon: Cpu },
  { id: 'robotics', name: 'robotics-ros2-devs', description: 'URDF simulation, LiDAR SLAM, Gazebo, and Nav2 rovers', category: 'Roadmap Guilds', memberCount: 890, icon: Compass },
  { id: 'general-chat', name: 'general-tavern', description: 'Daily standups, quest sharing, and general discussions', category: 'General', memberCount: 4890 },
  { id: 'showcase', name: 'capstone-showcases', description: 'Live project links, demos, and portfolio reviews', category: 'Project Showcases', memberCount: 1980, icon: Award },
  { id: 'study-buddies', name: 'accountability-squads', description: 'Find a peer with identical weekly study commitments', category: 'Study Rooms', memberCount: 940 },
];

const INITIAL_MESSAGES: CommunityMessage[] = [
  {
    id: 'm-1',
    channelId: 'ai-agents',
    author: {
      name: 'Aria Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      role: 'Level 5 Master Developer',
      level: 5,
      badge: 'Agent Architect'
    },
    text: "Just completed the **Autonomous Multi-Agent Capstone** quest! I set up LangGraph with 3 specialized agents: a web searcher, a summarizer, and a critic node that loops back if clarity is under 80%. Here's the state graph setup that made it super reliable:",
    codeSnippet: {
      language: 'python',
      code: `from langgraph.graph import StateGraph, END\n\ndef should_continue(state: AgentState):\n    if state.get("critique_score", 0) >= 0.8:\n        return END\n    return "refine_draft"`
    },
    timestamp: '25m ago',
    likes: 18,
    repliesCount: 4,
    tags: ['LangGraph', 'RAG', 'Level 5']
  },
  {
    id: 'm-2',
    channelId: 'ai-agents',
    author: {
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      role: 'Level 3 Adept Architect',
      level: 3,
      badge: 'RAG Specialist'
    },
    text: "@Aria Chen Love that! Did you use Reciprocal Rank Fusion (RRF) for the searcher node? When I paired BM25 with dense cosine similarity, my retrieval precision leaped noticeably.",
    timestamp: '18m ago',
    likes: 7,
    repliesCount: 1,
  },
  {
    id: 'm-3',
    channelId: 'ai-agents',
    author: {
      name: 'QuestPath AI Mentor',
      avatar: '',
      role: 'Autonomous AI Companion',
      level: 99,
      badge: 'System Verified',
      isAiMentor: true
    },
    text: "💡 **Pro-Tip for RAG Guild Members:** When implementing RRF, keep constant k=60 to avoid disproportionately weighting extreme outlier ranks. You can also test your evaluation metrics automatically using RAGAS for faithfullness before merging to production!",
    timestamp: '12m ago',
    likes: 34,
    repliesCount: 2,
    tags: ['AI Tip', 'Best Practices']
  },
  {
    id: 'm-4',
    channelId: 'ai-agents',
    author: {
      name: 'Devin Kowalski',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
      role: 'Level 2 Apprentice',
      level: 2,
    },
    text: "Quick question for everyone on Level 1 (Structured Outputs with Pydantic): Are you writing custom repair prompts when validation errors occur, or relying on instructor's auto-retry parameters?",
    timestamp: '5m ago',
    likes: 3,
    repliesCount: 6,
    tags: ['Beginner Help', 'Pydantic']
  }
];

interface CommunityPageProps {
  activeRoadmap: MasterRoadmap | null;
  onOpenRoadmap: () => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({
  activeRoadmap,
  onOpenRoadmap,
}) => {
  const [selectedChannelId, setSelectedChannelId] = useState('ai-agents');
  const [messages, setMessages] = useState<CommunityMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  const currentChannel = CHANNELS.find(c => c.id === selectedChannelId) || CHANNELS[0];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg: CommunityMessage = {
      id: `m-${Date.now()}`,
      channelId: selectedChannelId,
      author: {
        name: 'You (Explorer)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        role: 'Level 1 Novice Explorer',
        level: 1,
        badge: 'Quester'
      },
      text: inputText.trim(),
      timestamp: 'Just now',
      likes: 0,
      repliesCount: 0,
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  const handleToggleLike = (msgId: string) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === msgId) {
          const isLiked = msg.likedByMe;
          return {
            ...msg,
            likedByMe: !isLiked,
            likes: isLiked ? msg.likes - 1 : msg.likes + 1,
          };
        }
        return msg;
      })
    );
  };

  const filteredChannels = CHANNELS.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategoryFilter === 'All' || c.category === activeCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const channelMessages = messages.filter(m => m.channelId === selectedChannelId);

  return (
    <div className="flex-1 flex h-[calc(100vh-4rem)] bg-dark-bg text-slate-100 overflow-hidden">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. Left Channel Sidebar */}
      {/* ------------------------------------------------------------- */}
      <aside className="w-72 sm:w-80 bg-dark-panel/90 border-r border-dark-border flex flex-col shrink-0">
        
        {/* Header with Search */}
        <div className="p-4 border-b border-dark-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 p-[1px] flex items-center justify-center">
                <div className="w-full h-full bg-dark-panel rounded-[11px] flex items-center justify-center">
                  <Users className="w-4 h-4 text-cyan-accent" />
                </div>
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight">Guild Community</h2>
                <p className="text-[10px] text-slate-400">14,800+ Active Questers</p>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
              ● Live
            </span>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search guilds or channels..."
              className="w-full bg-dark-card border border-dark-border rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/60 transition-colors"
            />
          </div>
        </div>

        {/* Channel Categories Filter Tabs */}
        <div className="px-3 pt-3 flex items-center gap-1 overflow-x-auto text-[11px] font-medium no-scrollbar">
          {['All', 'Roadmap Guilds', 'General', 'Showcases'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors cursor-pointer ${
                activeCategoryFilter === cat
                  ? 'bg-violet-600/30 text-cyan-300 border border-violet-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-dark-hover'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredChannels.map(channel => {
            const Icon = channel.icon || Hash;
            const isSelected = channel.id === selectedChannelId;
            return (
              <button
                key={channel.id}
                onClick={() => setSelectedChannelId(channel.id)}
                className={`w-full p-2.5 rounded-xl text-left flex items-start gap-3 transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-gradient-to-r from-violet-950/50 via-dark-card to-dark-card border border-violet-500/40 shadow-glow-violet/10'
                    : 'hover:bg-dark-card/60 border border-transparent'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isSelected 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-dark-panel border border-dark-border text-slate-400 group-hover:text-slate-200'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                      #{channel.name}
                    </span>
                    {channel.unreadCount && (
                      <span className="px-1.5 py-0.2 rounded-full bg-violet-600 text-white font-mono text-[9px] font-bold">
                        {channel.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    {channel.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Link to Current User's Roadmap */}
        {activeRoadmap && (
          <div className="p-3 border-t border-dark-border bg-dark-card/40 m-3 rounded-2xl border">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-400">Your Current Quest:</span>
              <span className="text-cyan-accent font-bold font-mono">In Progress</span>
            </div>
            <p className="text-xs font-bold text-white truncate">{activeRoadmap.canonicalGoal}</p>
            <button
              onClick={onOpenRoadmap}
              className="mt-2 w-full py-1.5 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-violet-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Back to Skill Tree</span>
            </button>
          </div>
        )}

      </aside>

      {/* ------------------------------------------------------------- */}
      {/* 2. Main Community Chat Feed */}
      {/* ------------------------------------------------------------- */}
      <section className="flex-1 flex flex-col bg-dark-bg min-w-0">
        
        {/* Channel Banner Header */}
        <div className="px-6 py-3.5 border-b border-dark-border bg-dark-panel/60 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center text-cyan-accent shrink-0">
              <Hash className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-white truncate">
                  #{currentChannel.name}
                </h1>
                <span className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-400 font-mono">
                  {currentChannel.memberCount.toLocaleString()} members
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-xl">
                {currentChannel.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button className="p-2 rounded-xl bg-dark-card border border-dark-border text-slate-400 hover:text-white transition-colors cursor-pointer" title="Channel Info">
              <TrendingUp className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-xl bg-dark-card border border-dark-border text-slate-400 hover:text-white transition-colors cursor-pointer" title="Filter Threads">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Feed Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Welcome Box at top of channel */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-950/30 via-dark-card/60 to-cyan-950/20 border border-violet-500/20 max-w-3xl mb-6">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300">
                <Sparkles className="w-4 h-4 text-cyan-accent" />
              </div>
              <h3 className="font-bold text-sm text-white">Welcome to the #{currentChannel.name} Guild!</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              This guild connects developers actively working on this learning path. Share project snippets, solve blocker bugs, organize code reviews, and earn community XP awards.
            </p>
          </div>

          {/* Render Channel Messages */}
          {channelMessages.map(msg => (
            <div 
              key={msg.id}
              className={`p-4 rounded-2xl border transition-all ${
                msg.author.isAiMentor 
                  ? 'bg-cyan-950/15 border-cyan-500/30 shadow-glow-cyan/5' 
                  : 'bg-dark-card/70 border-dark-border hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {msg.author.avatar ? (
                    <img 
                      src={msg.author.avatar} 
                      alt={msg.author.name}
                      className="w-9 h-9 rounded-xl object-cover border border-dark-border shrink-0" 
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 p-[1px] shrink-0">
                      <div className="w-full h-full bg-dark-panel rounded-[11px] flex items-center justify-center">
                        <Bot className="w-4 h-4 text-cyan-accent" />
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm text-white">
                        {msg.author.name}
                      </span>
                      {msg.author.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          msg.author.isAiMentor
                            ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40'
                            : 'bg-violet-950/60 text-violet-300 border border-violet-500/40'
                        }`}>
                          {msg.author.badge}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500">
                        {msg.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      {msg.author.role}
                    </p>
                  </div>
                </div>

                <button className="text-slate-500 hover:text-slate-300 p-1">
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Message Content */}
              <div className="mt-3 text-xs text-slate-200 leading-relaxed space-y-3 whitespace-pre-wrap">
                <p>{msg.text}</p>

                {msg.codeSnippet && (
                  <div className="rounded-xl bg-dark-bg/90 border border-dark-border p-3 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-sans font-bold">
                      {msg.codeSnippet.language}
                    </div>
                    <pre>{msg.codeSnippet.code}</pre>
                  </div>
                )}

                {msg.tags && (
                  <div className="flex items-center gap-1.5 pt-1">
                    {msg.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded-md bg-dark-panel border border-dark-border text-[10px] text-slate-400 font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Message Reactions and Reply Action Bar */}
              <div className="mt-3.5 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleLike(msg.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      msg.likedByMe
                        ? 'bg-violet-600/30 border-violet-500/50 text-cyan-300 font-bold'
                        : 'bg-dark-panel border-dark-border hover:border-slate-600 text-slate-400'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${msg.likedByMe ? 'text-cyan-accent fill-cyan-accent/20' : ''}`} />
                    <span className="text-[11px]">{msg.likes}</span>
                  </button>

                  <button className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-dark-hover transition-colors cursor-pointer text-slate-400 hover:text-slate-200">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="text-[11px]">{msg.repliesCount} replies</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-1 rounded hover:bg-dark-hover transition-colors text-slate-500 hover:text-slate-300" title="Bookmark message">
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 rounded hover:bg-dark-hover transition-colors text-slate-500 hover:text-slate-300" title="Share thread">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}

        </div>

        {/* Message Input Bottom Bar */}
        <div className="p-4 border-t border-dark-border bg-dark-panel/90 backdrop-blur-md">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-dark-card border border-dark-border rounded-2xl px-4 py-2.5 focus-within:border-violet-500/70 transition-all shadow-lg"
          >
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={`Message #${currentChannel.name}... (Press enter to post)`}
              className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-none text-xs sm:text-sm"
            />
            
            <div className="flex items-center gap-2 shrink-0">
              <button 
                type="button" 
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-dark-hover rounded-lg transition-colors cursor-pointer"
                title="Insert Code Snippet"
                onClick={() => setInputText(prev => prev + ' ```\n// Your code here\n``` ')}
              >
                <Code2 className="w-4 h-4 text-cyan-accent" />
              </button>
              
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white shadow-glow-violet/20 transition-all cursor-pointer"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 px-1">
            <span>Markdown supported (**bold**, `code`, ```blocks```)</span>
            <span>Earn +10 XP for helpful answers in your guild</span>
          </div>
        </div>

      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. Right Sidebar: Guild Leaderboard & Quest Highlights */}
      {/* ------------------------------------------------------------- */}
      <aside className="hidden lg:flex w-72 bg-dark-panel/60 border-l border-dark-border flex-col p-4 space-y-4 shrink-0 overflow-y-auto">
        
        {/* Guild Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-950/40 via-dark-card to-cyan-950/20 border border-violet-500/20">
          <div className="flex items-center gap-2 text-violet-300 font-bold text-xs uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Weekly Guild Challenge</span>
          </div>
          <h4 className="font-bold text-sm text-white mt-1">Multi-Agent Benchmark Sprint</h4>
          <p className="text-[11px] text-slate-400 mt-1">
            Deploy an agent that achieves &gt;85% precision on the RAGAS test suite. Top 3 submissions receive the Grandmaster Sage badge!
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-cyan-300">
            <span>Pool: 2,500 XP</span>
            <span>2 days left</span>
          </div>
        </div>

        {/* Top Contributors / Guild Leaderboard */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Guild Leaders</span>
            </h4>
            <span className="text-[10px] text-violet-400">Weekly XP</span>
          </div>

          <div className="space-y-2">
            {[
              { rank: 1, name: 'Aria Chen', xp: '1,420 XP', level: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' },
              { rank: 2, name: 'Tariq Al-Mansoor', xp: '1,180 XP', level: 4, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
              { rank: 3, name: 'Elena Rostova', xp: '960 XP', level: 4, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
            ].map(leader => (
              <div key={leader.rank} className="p-2.5 rounded-xl bg-dark-card border border-dark-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold font-mono text-[11px] ${
                    leader.rank === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    leader.rank === 2 ? 'bg-slate-400/20 text-slate-200 border border-slate-400/40' :
                    'bg-amber-800/20 text-amber-500 border border-amber-700/40'
                  }`}>
                    #{leader.rank}
                  </span>
                  <img src={leader.avatar} alt={leader.name} className="w-6 h-6 rounded-lg object-cover" />
                  <span className="font-semibold text-slate-200 truncate max-w-[95px]">{leader.name}</span>
                </div>
                <span className="font-mono text-cyan-300 font-bold text-[11px]">{leader.xp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="p-3 rounded-xl bg-dark-card/50 border border-dark-border text-[11px] text-slate-400 space-y-1">
          <div className="font-semibold text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Community Guidelines</span>
          </div>
          <p className="leading-relaxed">
            Be kind, constructive, and avoid spoiling guided assessment answers directly. Encourage peers with hints first!
          </p>
        </div>

      </aside>

    </div>
  );
};
