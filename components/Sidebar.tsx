import React from 'react';
import { MessageSquarePlus, MessageSquare, Settings, Trash2, LogOut, LayoutGrid } from 'lucide-react';
import { ChatSession } from '../types';
import { Logo } from './Logo';

interface SidebarProps {
  onNewChat: () => void;
  onOpenSettings: () => void;
  onOpenPromptGuide: () => void;
  onLogout: () => void;
  sessions: ChatSession[];
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string, e: React.MouseEvent) => void;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  onNewChat, 
  onOpenSettings,
  onOpenPromptGuide,
  onLogout,
  sessions, 
  currentChatId, 
  onSelectChat,
  onDeleteChat,
  onCloseMobile
}) => {
  
  const handleAction = (action: () => void) => {
      action();
      if (onCloseMobile) onCloseMobile();
  };

  return (
    <div className="flex flex-col h-full glass-panel text-slate-300">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3">
          <Logo size={32} />
          <span className="text-xl font-bold text-white tracking-wide brand-font">KRATI</span>
      </div>

      {/* New Chat Button */}
      <div className="px-4 mb-2">
        <button 
          onClick={() => handleAction(onNewChat)}
          className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 border border-cyan-500/30 text-cyan-100 rounded-xl transition-all duration-300 group shadow-[0_0_15px_rgba(8,145,178,0.1)]"
        >
          <MessageSquarePlus size={18} className="text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="font-medium text-sm">New Conversation</span>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 space-y-6 py-4 custom-scrollbar">
        
        {/* Main Nav */}
        <div className="space-y-1">
            <button onClick={() => handleAction(onOpenPromptGuide)} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors">
                <LayoutGrid size={18} className="text-slate-500" />
                <span>Templates</span>
            </button>
            <button onClick={() => handleAction(onOpenSettings)} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors">
                <Settings size={18} className="text-slate-500" />
                <span>Settings</span>
            </button>
        </div>

        {/* Recent History */}
        <div>
            <div className="text-[10px] font-bold text-slate-500 px-3 mb-3 uppercase tracking-wider">History</div>
            {sessions.length === 0 ? (
            <div className="px-3 text-sm text-slate-600 italic">
                Start your first chat...
            </div>
            ) : (
                <div className="space-y-1">
                {sessions.map((session) => (
                    <button 
                    key={session.id} 
                    onClick={() => handleAction(() => onSelectChat(session.id))}
                    className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all truncate flex items-center gap-2 group relative border border-transparent
                        ${currentChatId === session.id 
                            ? 'bg-slate-800/80 text-cyan-200 border-slate-700/50 shadow-sm' 
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                        }`}
                    >
                    <MessageSquare size={14} className={currentChatId === session.id ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-500'} />
                    <span className="truncate flex-1 pr-6">{session.title}</span>
                    
                    <div 
                        onClick={(e) => onDeleteChat(session.id, e)}
                        className="absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 hover:text-red-400 text-slate-500 rounded-md transition-all"
                        title="Delete chat"
                    >
                        <Trash2 size={12} />
                    </div>
                    </button>
                ))}
                </div>
            )}
        </div>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800/50 bg-slate-900/30">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white border-2 border-slate-800">
                    JD
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-200">John Doe</span>
                    <span className="text-[10px] text-cyan-500 bg-cyan-500/10 px-1.5 py-0.5 rounded w-fit">Pro Plan</span>
                </div>
            </div>
            <button 
                onClick={onLogout}
                className="p-2 text-slate-500 hover:text-white transition-colors"
                title="Logout"
            >
                <LogOut size={16} />
            </button>
         </div>
      </div>
    </div>
  );
};