import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { SettingsModal } from './components/SettingsModal';
import { PromptGuideModal } from './components/PromptGuideModal';
import { AuthPage } from './components/AuthPage';
import { Message, UserRole, ModelType, ResponseConfig, ChatSession } from './types';
import { streamChatResponse } from './services/geminiService';
import { getSavedSessions, saveSessions, createSession } from './services/chatStorageService';
import { speakText } from './services/ttsService';
import { Menu, ChevronDown, MessageSquarePlus, Sparkles } from 'lucide-react';
import { ChatInput } from './components/ChatInput';

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // App State
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize sidebar closed on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  );

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPromptGuideOpen, setIsPromptGuideOpen] = useState(false);
  
  const [selectedModel, setSelectedModel] = useState<ModelType>(ModelType.FLASH);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  const [enableSearch, setEnableSearch] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  // Response Config State
  const [responseConfig, setResponseConfig] = useState<ResponseConfig>({
    tone: 'professional',
    length: 'standard',
    complexity: 'standard',
    historyLimit: 20,
    textToSpeech: false,
    voiceURI: ''
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chats on mount
  useEffect(() => {
    const saved = getSavedSessions();
    setChatSessions(saved);
  }, []);

  // Handle Resize to auto-show/hide sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
         if (!isSidebarOpen) setIsSidebarOpen(true);
      } else {
         if (isSidebarOpen) setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Intentionally empty deps to just set up listener

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enforce history limit
  useEffect(() => {
    if (chatSessions.length > responseConfig.historyLimit) {
        const limited = chatSessions.slice(0, responseConfig.historyLimit);
        setChatSessions(limited);
        saveSessions(limited);
    }
  }, [responseConfig.historyLimit, chatSessions.length]);

  // Save current chat session
  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      setChatSessions(prev => {
        const updated = prev.map(session => 
          session.id === currentChatId 
            ? { ...session, messages: messages } 
            : session
        );
        saveSessions(updated);
        return updated;
      });
    }
  }, [messages, currentChatId]);

  const handleSendMessage = async () => {
    if ((!input.trim() && !attachedImage) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: UserRole.USER,
      content: input,
      image: attachedImage || undefined,
      timestamp: new Date(),
    };

    let activeChatId = currentChatId;
    let newMessages = [...messages, userMessage];

    // If starting a new chat, create session first
    if (!activeChatId) {
       const newSession = createSession(chatSessions, userMessage);
       activeChatId = newSession.id;
       setCurrentChatId(newSession.id);
       setChatSessions(prev => {
           const updated = [newSession, ...prev].slice(0, responseConfig.historyLimit);
           saveSessions(updated);
           return updated;
       });
       newMessages = [userMessage]; 
    }

    setMessages(newMessages);
    setInput('');
    setAttachedImage(null);
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: aiMessageId,
        role: UserRole.MODEL,
        content: '',
        timestamp: new Date(),
        isThinking: true,
      },
    ]);

    let fullResponseText = '';

    try {
      const history = newMessages;
      const searchEnabled = selectedModel === ModelType.IMAGEN ? false : enableSearch;

      await streamChatResponse(
        history,
        selectedModel,
        searchEnabled,
        responseConfig,
        (chunk) => {
          fullResponseText += chunk;
          setMessages((prev) => {
            return prev.map((msg) => {
              if (msg.id === aiMessageId) {
                return {
                  ...msg,
                  content: msg.content + chunk,
                  isThinking: false,
                };
              }
              return msg;
            });
          });
        },
        (groundingMetadata) => {
             setMessages((prev) => {
                return prev.map((msg) => {
                    if (msg.id === aiMessageId) {
                        return { ...msg, groundingMetadata }
                    }
                    return msg;
                })
             })
        },
        (base64Image) => {
            setMessages((prev) => {
                return prev.map((msg) => {
                    if (msg.id === aiMessageId) {
                        return {
                            ...msg,
                            generatedImage: base64Image,
                            isThinking: false
                        }
                    }
                    return msg;
                })
            });
        }
      );
      
      if (responseConfig.textToSpeech && fullResponseText) {
          const cleanText = fullResponseText.replace(/[*#_`]/g, '');
          speakText(cleanText, responseConfig.voiceURI);
      }

    } catch (error) {
      console.error("Error generating response:", error);
      setMessages((prev) => {
        return prev.map((msg) => {
          if (msg.id === aiMessageId) {
            return {
              ...msg,
              content: msg.content + "\n\n**Error:** Something went wrong. Please try again.",
              isThinking: false,
            };
          }
          return msg;
        });
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickStart = (text: string) => {
      setInput(text);
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setInput('');
    setAttachedImage(null);
    if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
    }
  };

  const loadChat = (id: string) => {
    const session = chatSessions.find(s => s.id === id);
    if (session) {
        setMessages(session.messages);
        setCurrentChatId(session.id);
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    }
  };

  const deleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = chatSessions.filter(s => s.id !== id);
    setChatSessions(updated);
    saveSessions(updated);
    if (currentChatId === id) {
        startNewChat();
    }
  };

  const getModelDisplayName = (model: ModelType) => {
      if (model === ModelType.FLASH) return "Krati Flash";
      if (model === ModelType.PRO) return "Krati Pro 2.0";
      return "Krati Vision";
  };

  if (!isAuthenticated) {
      return <AuthPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden text-slate-200 selection:bg-cyan-500/30 supports-[height:100dvh]:h-[100dvh]">
      
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={responseConfig}
        onConfigChange={setResponseConfig}
      />

      <PromptGuideModal 
        isOpen={isPromptGuideOpen}
        onClose={() => setIsPromptGuideOpen(false)}
      />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/60 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-[280px] transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
        shadow-2xl md:shadow-none
      `}>
        <Sidebar 
            onNewChat={startNewChat} 
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenPromptGuide={() => setIsPromptGuideOpen(true)}
            onLogout={() => setIsAuthenticated(false)}
            sessions={chatSessions}
            currentChatId={currentChatId}
            onSelectChat={loadChat}
            onDeleteChat={deleteChat}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative w-full min-w-0">
        {/* Header */}
        <header className="h-16 shrink-0 flex items-center justify-between px-4 md:px-6 z-10 sticky top-0 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg active:scale-95 transition-transform"
            >
              <Menu size={24} />
            </button>

            {/* Model Selector Dropdown */}
            <div className="relative">
                <button 
                    onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 text-lg font-bold text-slate-100 hover:bg-slate-800/50 rounded-xl transition-all border border-transparent hover:border-slate-700/50 brand-font tracking-wide"
                >
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent truncate max-w-[150px] md:max-w-none">
                        {getModelDisplayName(selectedModel)}
                    </span>
                    <ChevronDown size={16} className="text-slate-500 flex-shrink-0" />
                </button>
                
                {isModelMenuOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsModelMenuOpen(false)} />
                        <div className="absolute top-full left-0 mt-2 w-64 glass-panel border border-slate-700 rounded-2xl shadow-2xl z-20 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                            <button onClick={() => { setSelectedModel(ModelType.FLASH); setIsModelMenuOpen(false); }} className="w-full text-left px-5 py-3 hover:bg-slate-800/50 flex items-center gap-3 group">
                                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20"><Sparkles size={16} /></div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-200">Krati Flash</span>
                                    <span className="text-xs text-slate-500">Fastest model for everyday tasks</span>
                                </div>
                            </button>
                            <button onClick={() => { setSelectedModel(ModelType.PRO); setIsModelMenuOpen(false); }} className="w-full text-left px-5 py-3 hover:bg-slate-800/50 flex items-center gap-3 group">
                                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20"><Sparkles size={16} /></div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-200">Krati Pro 2.0</span>
                                    <span className="text-xs text-slate-500">Deep reasoning & complex analysis</span>
                                </div>
                            </button>
                            <div className="h-px bg-slate-800 my-1 mx-4" />
                            <button onClick={() => { setSelectedModel(ModelType.IMAGEN); setIsModelMenuOpen(false); }} className="w-full text-left px-5 py-3 hover:bg-slate-800/50 flex items-center gap-3 group">
                                <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 group-hover:bg-pink-500/20"><Sparkles size={16} /></div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-200">Krati Vision</span>
                                    <span className="text-xs text-slate-500">Advanced image generation</span>
                                </div>
                            </button>
                        </div>
                    </>
                )}
            </div>
          </div>
          
          <button
                onClick={startNewChat}
                className="md:hidden p-2 -mr-2 text-slate-400 hover:text-white active:scale-95 transition-transform"
             >
                <MessageSquarePlus size={24} />
          </button>
        </header>

        {/* Chat Area */}
        <ChatArea 
            messages={messages} 
            isLoading={isLoading} 
            bottomRef={messagesEndRef}
            onInputSubmit={(val) => {
                handleQuickStart(val);
            }}
            config={responseConfig}
        />

        {/* Input Area */}
        <div className="shrink-0 p-3 md:p-6 w-full z-10 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent">
          <div className="max-w-3xl mx-auto w-full">
             <ChatInput 
                value={input}
                onChange={setInput}
                onSend={handleSendMessage}
                isLoading={isLoading}
                enableSearch={enableSearch && selectedModel !== ModelType.IMAGEN}
                onToggleSearch={() => setEnableSearch(!enableSearch)}
                attachedImage={attachedImage}
                onAttachImage={setAttachedImage}
                onRemoveImage={() => setAttachedImage(null)}
             />
             <div className="text-center text-[10px] md:text-xs text-slate-500 mt-3 pb-safe-bottom">
                Krati AI can make mistakes. Verify important information.
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;