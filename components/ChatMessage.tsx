import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { UserRole, Message, ResponseConfig } from '../types';
import { Bot, Globe, Copy, Check, Download, Volume2, Square, Sparkles, User } from 'lucide-react';
import { speakText, stopSpeaking } from '../services/ttsService';

interface ChatMessageProps {
  message: Message;
  config?: ResponseConfig;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, config }) => {
  const isUser = message.role === UserRole.USER;
  const [copied, setCopied] = React.useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `krati-generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSpeak = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const cleanText = message.content.replace(/[*#_`]/g, '');
      speakText(cleanText, config?.voiceURI || '');
      const estimatedDuration = (cleanText.length / 15) * 1000; 
      setTimeout(() => setIsPlaying(false), estimatedDuration + 1000);
    }
  };

  return (
    <div className={`w-full py-6 px-4 md:px-10 hover:bg-slate-900/20 transition-colors`}>
      <div className={`max-w-4xl mx-auto flex gap-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
        
        {!isUser && (
          <div className="flex-shrink-0 flex flex-col relative items-end pt-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
               <Sparkles size={20} className="text-white fill-white" />
            </div>
          </div>
        )}

        <div className={`relative max-w-[85%] md:max-w-[75%] ${isUser ? '' : 'flex-1'}`}>
          <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
             
             {/* Text Content */}
             <div className={`
                prose prose-invert prose-slate max-w-none leading-7 text-[15px] md:text-base
                ${isUser 
                    ? 'bg-slate-800/80 border border-slate-700 text-slate-100 px-6 py-4 rounded-2xl rounded-tr-sm shadow-md' 
                    : 'text-slate-300'
                }
             `}>
                {/* User Image Attachment */}
                {message.image && (
                     <div className="mb-4">
                         <img 
                            src={message.image} 
                            alt="User uploaded" 
                            className="max-w-xs rounded-xl border border-slate-700 shadow-md"
                         />
                     </div>
                 )}

                {/* AI Generated Image */}
                {message.generatedImage && (
                     <div className="mb-4 relative group/image inline-block">
                         <img 
                            src={message.generatedImage} 
                            alt="AI Generated" 
                            className="max-w-sm rounded-xl border border-slate-700 shadow-2xl"
                         />
                         <button
                            onClick={() => handleDownloadImage(message.generatedImage!)}
                            className="absolute bottom-2 right-2 p-2 bg-black/60 hover:bg-black/80 text-white rounded-lg opacity-0 group-hover/image:opacity-100 transition-opacity backdrop-blur-sm"
                            title="Download Image"
                         >
                            <Download size={16} />
                         </button>
                     </div>
                 )}

                 {message.isThinking ? (
                   <div className="flex items-center gap-2 h-6 text-cyan-400">
                     <span className="text-sm font-medium animate-pulse">Krati is thinking</span>
                     <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                     <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                     <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                   </div>
                 ) : (
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({node, className, children, ...props}) {
                                const match = /language-(\w+)/.exec(className || '')
                                const isInline = !match && !String(children).includes('\n');
                                
                                return isInline ? (
                                    <code className="bg-slate-800/80 text-cyan-200 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-700/50" {...props}>
                                        {children}
                                    </code>
                                ) : (
                                    <div className="relative group/code my-5 rounded-xl overflow-hidden bg-[#0d1117] border border-slate-800 shadow-lg">
                                        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 text-xs text-slate-400 font-mono border-b border-slate-800">
                                            <span>{match ? match[1] : 'code'}</span>
                                        </div>
                                        <div className="p-5 overflow-x-auto text-sm font-mono leading-relaxed text-slate-300">
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        </div>
                                    </div>
                                )
                            },
                            ul: ({children}) => <ul className="list-disc pl-6 space-y-2 my-4 text-slate-300">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal pl-6 space-y-2 my-4 text-slate-300">{children}</ol>,
                            p: ({children}) => <p className="mb-4 last:mb-0 leading-7">{children}</p>,
                            h1: ({children}) => <h1 className="text-2xl font-bold text-slate-100 mb-4 mt-6">{children}</h1>,
                            h2: ({children}) => <h2 className="text-xl font-bold text-slate-100 mb-3 mt-5">{children}</h2>,
                            h3: ({children}) => <h3 className="text-lg font-bold text-slate-100 mb-2 mt-4">{children}</h3>,
                            blockquote: ({children}) => <blockquote className="border-l-4 border-cyan-500/50 pl-4 italic text-slate-400 my-4">{children}</blockquote>,
                            a: ({href, children}) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4">{children}</a>,
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                 )}
             </div>

             {/* Grounding Sources for AI */}
             {message.groundingMetadata?.groundingChunks && message.groundingMetadata.groundingChunks.length > 0 && (
                 <div className="mt-3 flex flex-wrap gap-2">
                     {message.groundingMetadata.groundingChunks.map((chunk, idx) => {
                         if (chunk.web) {
                             return (
                                 <a 
                                    key={idx} 
                                    href={chunk.web.uri} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-full text-xs text-cyan-300 transition-all"
                                 >
                                     <Globe size={12} />
                                     <span className="truncate max-w-[150px]">{chunk.web.title}</span>
                                 </a>
                             )
                         }
                         return null;
                     })}
                 </div>
             )}

             {/* AI Actions */}
             {!isUser && !message.isThinking && (
                  <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={handleCopy}
                        className="p-1.5 text-slate-500 hover:text-slate-300 rounded-md transition-colors"
                        title="Copy"
                      >
                          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      </button>
                      <button 
                        onClick={handleSpeak}
                        className={`p-1.5 rounded-md transition-colors ${isPlaying ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                        title="Read Aloud"
                      >
                          {isPlaying ? <Square size={14} className="fill-current" /> : <Volume2 size={14} />}
                      </button>
                  </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};