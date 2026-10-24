import React, { useState } from 'react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Sparkles, 
  HelpCircle, 
  Send, 
  RotateCcw, 
  Loader2,
  Code
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RoadmapNode, AssessmentQuestion } from '../types';

interface AssessmentModalProps {
  node: RoadmapNode | null;
  onClose: () => void;
  onSubmit: (answers: number[], submissionText: string) => Promise<{
    passed: boolean;
    score: number;
    totalQuestions: number;
    scorePercent: number;
    earnedXP: number;
    explanations: any[];
  }>;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  node,
  onClose,
  onSubmit,
}) => {
  const questions: AssessmentQuestion[] = node?.assessment?.questions || [];
  const isQuiz = questions.length > 0;

  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    new Array(questions.length).fill(-1)
  );
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<{
    passed: boolean;
    score: number;
    totalQuestions: number;
    scorePercent: number;
    earnedXP: number;
    explanations: any[];
  } | null>(null);

  if (!node) return null;

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    const updated = [...selectedAnswers];
    updated[qIdx] = optIdx;
    setSelectedAnswers(updated);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await onSubmit(selectedAnswers, submissionText);
      setResults(res);

      if (res.passed) {
        // Fire celebration confetti!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#DADADC', '#A7B8C0', '#34D399', '#C8B27D']
        });
      }
    } catch (err) {
      console.error('Assessment submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers(new Array(questions.length).fill(-1));
    setSubmissionText('');
    setResults(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-dark-panel border border-violet-500/30 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-glow-violet overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-dark-border bg-dark-card/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/40 flex items-center justify-center">
              <Award className="w-4 h-4 text-cyan-accent" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Mastery Assessment: {node.title}
              </h3>
              <p className="text-xs text-slate-400">
                Verify your knowledge to claim <span className="text-amber-400 font-semibold">{node.xp} XP</span> and verified mastery badge
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-hover transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Results Screen */}
          {results && (
            <div className="space-y-5 animate-fadeIn">
              <div className={`p-4 rounded-xl border text-center space-y-2 ${
                results.passed 
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                  : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
              }`}>
                <div className="text-2xl font-black">
                  {results.passed ? '🎉 Quest Mastery Verified!' : '⚡ Keep Going!'}
                </div>
                <p className="text-xs text-slate-300">
                  {results.passed 
                    ? `Congratulations! You scored ${results.score}/${results.totalQuestions} (${results.scorePercent}%) and earned +${results.earnedXP} XP!`
                    : `You scored ${results.score}/${results.totalQuestions}. Review the explanations below and give it another shot!`}
                </p>
              </div>

              {/* Explanations list */}
              {results.explanations && results.explanations.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Question Analysis & Explanations:
                  </h4>
                  {results.explanations.map((exp, idx) => (
                    <div 
                      key={idx}
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        exp.isCorrect 
                          ? 'bg-emerald-950/20 border-emerald-500/30' 
                          : 'bg-rose-950/20 border-rose-500/30'
                      }`}
                    >
                      <div className="flex items-start gap-2 font-semibold">
                        {exp.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <span className="text-slate-100">{exp.question}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 pl-6 leading-relaxed">
                        <strong className="text-cyan-accent">Explanation:</strong> {exp.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Active Questions Form */}
          {!results && (
            <div className="space-y-6">
              
              {/* Quiz questions */}
              {isQuiz && questions.map((q, qIdx) => (
                <div key={q.id} className="space-y-2.5">
                  <div className="text-xs font-bold text-slate-200 flex items-start gap-2">
                    <span className="w-5 h-5 rounded bg-violet-600/30 text-violet-300 text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {qIdx + 1}
                    </span>
                    <span>{q.question}</span>
                  </div>

                  <div className="space-y-1.5 pl-7">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[qIdx] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(qIdx, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center gap-2.5 ${
                            isSelected
                              ? 'bg-violet-600/20 border-violet-500 text-white font-medium shadow-glow-violet/20'
                              : 'bg-dark-card border-dark-border text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-violet-400 bg-violet-600' : 'border-slate-500'
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                          </div>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Practical Task Submission Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-cyan-accent" />
                  <span>Practical Solution / GitHub Repo URL / Notes (Optional)</span>
                </label>
                <textarea
                  value={submissionText}
                  onChange={e => setSubmissionText(e.target.value)}
                  placeholder="Paste your GitHub repository link, code snippet, or reflection here..."
                  rows={3}
                  className="w-full rounded-xl bg-dark-card border border-dark-border p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                />
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-dark-border bg-dark-card/60 flex items-center justify-between gap-3">
          {results ? (
            <>
              {!results.passed && (
                <button
                  onClick={handleRetry}
                  className="px-4 py-2.5 rounded-xl bg-dark-panel border border-slate-600 hover:border-slate-400 text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Quiz</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-glow-violet cursor-pointer ml-auto"
              >
                Done
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || (isQuiz && selectedAnswers.includes(-1))}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-2 shadow-glow-violet transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Grading Quest...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit & Claim XP</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
