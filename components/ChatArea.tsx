import React from 'react';
import { ChatMessage } from './ChatMessage';
import { Message, ResponseConfig } from '../types';
import { Code, PenTool, BrainCircuit, Image as ImageIcon } from 'lucide-react';
import { Logo } from './Logo';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  bottomRef: React.RefObject<HTMLDivElement>;
  onInputSubmit: (val: string) => void;
  config?: ResponseConfig;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, bottomRef, config, onInputSubmit }) => {
  if (messages.length === 0) {
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500 overflow-y-auto custom-scrollbar">
        
        <div className="mb-8 relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full" />
            <div className="animate-float">
                <Logo size={80} animated />
            </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2 brand-font">Hello, I'm Krati</h2>
        <p className="text-slate-400 max-w-md mb-10 text-lg">Your intelligent companion for creativity, analysis, and problem solving.</p>

        {/* Quick Start Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
            <button 
                onClick={() => onInputSubmit("Write a python script to analyze a CSV file and plot the data.")}
                className="p-4 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 hover:border-cyan-500/50 rounded-xl text-left transition-all group"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:text-blue-300">
                        <Code size={20} />
                    </div>
                    <span className="font-semibold text-slate-200">Write Code</span>
                </div>
                <p className="text-sm text-slate-500">Generate a Python script to analyze CSV data</p>
            </button>

            <button 
                onClick={() => onInputSubmit("Create a digital art prompt for a cyberpunk city with neon lights.")}
                className="p-4 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 hover:border-purple-500/50 rounded-xl text-left transition-all group"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 group-hover:text-purple-300">
                        <ImageIcon size={20} />
                    </div>
                    <span className="font-semibold text-slate-200">Generate Art</span>
                </div>
                <p className="text-sm text-slate-500">Create a prompt for a cyberpunk city image</p>
            </button>

            <button 
                onClick={() => onInputSubmit("Explain the theory of relativity in simple terms to a 5 year old.")}
                className="p-4 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 hover:border-emerald-500/50 rounded-xl text-left transition-all group"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:text-emerald-300">
                        <BrainCircuit size={20} />
                    </div>
                    <span className="font-semibold text-slate-200">Explain Complex Topics</span>
                </div>
                <p className="text-sm text-slate-500">Explain relativity to a 5 year old</p>
            </button>

            <button 
                onClick={() => onInputSubmit("Draft a professional email to reschedule a project meeting.")}
                className="p-4 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 hover:border-amber-500/50 rounded-xl text-left transition-all group"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 group-hover:text-amber-300">
                        <PenTool size={20} />
                    </div>
                    <span className="font-semibold text-slate-200">Draft Content</span>
                </div>
                <p className="text-sm text-slate-500">Write an email to reschedule a meeting</p>
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto scroll-smooth w-full p-4 md:p-0 custom-scrollbar">
      <div className="flex flex-col w-full pb-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} config={config} />
        ))}
        <div ref={bottomRef} className="h-32" /> 
      </div>
    </div>
  );
};