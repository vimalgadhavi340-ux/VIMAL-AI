import React from 'react';
import { X, Lightbulb, CheckCircle2, ArrowRight, Sparkles, Code, PenTool, BrainCircuit } from 'lucide-react';

interface PromptGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromptGuideModal: React.FC<PromptGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
                <Lightbulb size={20} className="text-amber-400" />
            </div>
            <div>
                <h2 className="text-lg font-semibold text-white">Prompting Guide</h2>
                <p className="text-xs text-zinc-500">Master the art of talking to AI</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
            
            {/* Core Principles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-800">
                    <h3 className="flex items-center gap-2 font-medium text-zinc-200 mb-2">
                        <CheckCircle2 size={16} className="text-green-500" /> Be Specific
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                        Vague prompts give generic answers. Specify the format, length, and style you want.
                    </p>
                </div>
                <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-800">
                    <h3 className="flex items-center gap-2 font-medium text-zinc-200 mb-2">
                        <CheckCircle2 size={16} className="text-green-500" /> Provide Context
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                        Tell the AI who it is (Persona) and who the audience is to get tailored results.
                    </p>
                </div>
                <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-800">
                    <h3 className="flex items-center gap-2 font-medium text-zinc-200 mb-2">
                        <CheckCircle2 size={16} className="text-green-500" /> Use Settings
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                        Use Lumina's Tone and Complexity settings to adjust style without rewriting prompts.
                    </p>
                </div>
            </div>

            {/* The Formula */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">The "CO-STAR" Formula</h3>
                <div className="bg-zinc-950/50 rounded-xl border border-zinc-800 p-5 space-y-3">
                    <div className="grid grid-cols-[80px_1fr] gap-4 text-sm">
                        <span className="font-mono font-bold text-indigo-400">C</span>
                        <span className="text-zinc-300"><strong className="text-white">Context:</strong> Give background information.</span>
                    </div>
                    <div className="grid grid-cols-[80px_1fr] gap-4 text-sm">
                        <span className="font-mono font-bold text-indigo-400">O</span>
                        <span className="text-zinc-300"><strong className="text-white">Objective:</strong> Define the task clearly.</span>
                    </div>
                    <div className="grid grid-cols-[80px_1fr] gap-4 text-sm">
                        <span className="font-mono font-bold text-indigo-400">S</span>
                        <span className="text-zinc-300"><strong className="text-white">Style:</strong> Specify the writing style (or use Settings).</span>
                    </div>
                    <div className="grid grid-cols-[80px_1fr] gap-4 text-sm">
                        <span className="font-mono font-bold text-indigo-400">T</span>
                        <span className="text-zinc-300"><strong className="text-white">Tone:</strong> Set the attitude (Professional, Witty, etc.).</span>
                    </div>
                    <div className="grid grid-cols-[80px_1fr] gap-4 text-sm">
                        <span className="font-mono font-bold text-indigo-400">A</span>
                        <span className="text-zinc-300"><strong className="text-white">Audience:</strong> Who is this for?</span>
                    </div>
                    <div className="grid grid-cols-[80px_1fr] gap-4 text-sm">
                        <span className="font-mono font-bold text-indigo-400">R</span>
                        <span className="text-zinc-300"><strong className="text-white">Response:</strong> Desired format (Table, List, JSON, Markdown).</span>
                    </div>
                </div>
            </div>

            {/* Examples */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Examples by Category</h3>
                
                {/* Creative Writing */}
                <div className="bg-zinc-800/20 rounded-xl border border-zinc-800 overflow-hidden">
                    <div className="px-4 py-2 bg-zinc-800/40 border-b border-zinc-800 flex items-center gap-2">
                        <PenTool size={14} className="text-purple-400" />
                        <span className="text-xs font-semibold text-zinc-300">Creative Writing</span>
                    </div>
                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
                        <div className="p-4 space-y-2">
                            <span className="text-[10px] uppercase font-bold text-red-400">Basic</span>
                            <p className="text-sm text-zinc-400 italic">"Write a story about a robot."</p>
                        </div>
                        <div className="p-4 space-y-2 bg-green-500/5">
                            <span className="text-[10px] uppercase font-bold text-green-400">Better</span>
                            <p className="text-sm text-zinc-200">
                                "Write a short story set in a rainy cyberpunk Tokyo. The protagonist is a sanitation droid who discovers it can feel emotions. The tone should be melancholic but hopeful."
                            </p>
                        </div>
                    </div>
                </div>

                {/* Coding */}
                <div className="bg-zinc-800/20 rounded-xl border border-zinc-800 overflow-hidden">
                    <div className="px-4 py-2 bg-zinc-800/40 border-b border-zinc-800 flex items-center gap-2">
                        <Code size={14} className="text-blue-400" />
                        <span className="text-xs font-semibold text-zinc-300">Coding & Technical</span>
                    </div>
                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
                        <div className="p-4 space-y-2">
                            <span className="text-[10px] uppercase font-bold text-red-400">Basic</span>
                            <p className="text-sm text-zinc-400 italic">"Fix this code."</p>
                        </div>
                        <div className="p-4 space-y-2 bg-green-500/5">
                            <span className="text-[10px] uppercase font-bold text-green-400">Better</span>
                            <p className="text-sm text-zinc-200">
                                "Review this React component for performance issues. It re-renders too often. Explain why it happens and provide the refactored code using useMemo or useCallback."
                            </p>
                        </div>
                    </div>
                </div>

                {/* Analysis */}
                <div className="bg-zinc-800/20 rounded-xl border border-zinc-800 overflow-hidden">
                    <div className="px-4 py-2 bg-zinc-800/40 border-b border-zinc-800 flex items-center gap-2">
                        <BrainCircuit size={14} className="text-pink-400" />
                        <span className="text-xs font-semibold text-zinc-300">Complex Analysis</span>
                    </div>
                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
                        <div className="p-4 space-y-2">
                            <span className="text-[10px] uppercase font-bold text-red-400">Basic</span>
                            <p className="text-sm text-zinc-400 italic">"Explain Quantum Physics."</p>
                        </div>
                        <div className="p-4 space-y-2 bg-green-500/5">
                            <span className="text-[10px] uppercase font-bold text-green-400">Better</span>
                            <p className="text-sm text-zinc-200">
                                "Explain the concept of Quantum Entanglement to a high school student. Use an analogy involving everyday objects. Keep it under 200 words."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 flex justify-end">
            <button 
                onClick={onClose}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold rounded-lg transition-colors border border-zinc-700"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};