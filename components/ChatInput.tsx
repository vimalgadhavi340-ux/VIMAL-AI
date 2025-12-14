import React, { useRef, useEffect, useState } from 'react';
import { Paperclip, X, Search, Mic, MicOff, ArrowUp, Sparkles } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
  enableSearch: boolean;
  onToggleSearch: () => void;
  attachedImage: string | null;
  onAttachImage: (base64: string) => void;
  onRemoveImage: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  value, 
  onChange, 
  onSend, 
  isLoading,
  enableSearch,
  onToggleSearch,
  attachedImage,
  onAttachImage,
  onRemoveImage
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const initialValueRef = useRef<string>('');

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAttachImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        alert("Voice input is not supported in your browser.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      initialValueRef.current = value;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        const prefix = initialValueRef.current ? initialValueRef.current + ' ' : '';
        onChange(prefix + transcript);
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full relative glass rounded-2xl p-2 shadow-2xl border border-slate-700/50 ring-1 ring-white/5 transition-all focus-within:ring-cyan-500/50 focus-within:border-cyan-500/50">
        
        {/* Attachments Preview */}
        {attachedImage && (
            <div className="mb-2 pl-2 pt-2">
               <div className="relative group inline-block">
                   <img 
                      src={attachedImage} 
                      alt="Attachment" 
                      className="h-16 w-16 object-cover rounded-xl border border-slate-600 shadow-lg" 
                   />
                   <button 
                      onClick={onRemoveImage}
                      className="absolute -top-2 -right-2 bg-slate-800 text-slate-400 hover:text-white rounded-full p-1 border border-slate-600 shadow-md"
                   >
                      <X size={12} />
                   </button>
               </div>
            </div>
        )}

        <div className="flex items-end gap-2">
            <div className="flex items-center gap-1 pb-1.5 pl-1">
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 rounded-xl transition-colors"
                    title="Attach image"
                >
                    <Paperclip size={20} />
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                />

                <button
                    onClick={onToggleSearch}
                    className={`p-2.5 rounded-xl transition-colors ${enableSearch ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-blue-400 hover:bg-slate-800/50'}`}
                    title="Toggle Web Search"
                >
                    <Search size={20} />
                </button>
            </div>
            
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Listening..." : "Ask Krati anything..."}
                rows={1}
                className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none resize-none py-3.5 px-2 max-h-[200px] overflow-y-auto leading-relaxed"
                style={{ minHeight: '52px' }}
            />

            <div className="flex items-center gap-2 mb-1.5 pr-1.5">
                 <button 
                    onClick={toggleListening}
                    className={`p-2.5 rounded-xl transition-colors ${isListening ? 'text-red-400 bg-red-500/10 animate-pulse' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                <button
                    onClick={onSend}
                    disabled={(!value.trim() && !attachedImage) || isLoading}
                    className={`p-2.5 rounded-xl transition-all duration-300 shadow-lg ${
                        (!value.trim() && !attachedImage) || isLoading 
                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                        : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white hover:shadow-cyan-500/25 hover:scale-105'
                    }`}
                >
                    {isLoading ? <Sparkles size={20} className="animate-spin" /> : <ArrowUp size={20} strokeWidth={3} />}
                </button>
            </div>
        </div>
      </div>
      
    </div>
  );
};