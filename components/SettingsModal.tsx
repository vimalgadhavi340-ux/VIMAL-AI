import React, { useEffect, useState } from 'react';
import { X, Sliders, MessageSquare, BookOpen, Zap, HardDrive, Volume2, Mic } from 'lucide-react';
import { ResponseConfig, ResponseTone, ResponseLength, ResponseComplexity } from '../types';
import { getAvailableVoices, speakText } from '../services/ttsService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ResponseConfig;
  onConfigChange: (config: ResponseConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onConfigChange }) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (isOpen) {
      getAvailableVoices().then(setVoices);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const updateConfig = (key: keyof ResponseConfig, value: any) => {
    onConfigChange({ ...config, [key]: value });
  };

  const handlePreviewVoice = (voiceURI: string) => {
    speakText("Hello, I am Lumina. This is my voice.", voiceURI);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Sliders size={20} className="text-indigo-400" />
            </div>
            <div>
                <h2 className="text-lg font-semibold text-white">Settings</h2>
                <p className="text-xs text-zinc-500">Customize your Lumina experience</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Tone Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-zinc-300 font-medium text-sm">
                <MessageSquare size={16} className="text-blue-400" />
                <span>Tone & Personality</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['professional', 'casual', 'witty', 'formal', 'empathetic'] as ResponseTone[]).map((tone) => (
                <button
                  key={tone}
                  onClick={() => updateConfig('tone', tone)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200 capitalize
                    ${config.tone === tone 
                      ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' 
                      : 'bg-zinc-800/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-700'
                    }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          {/* Length Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-zinc-300 font-medium text-sm">
                <Zap size={16} className="text-amber-400" />
                <span>Response Length</span>
            </div>
            <div className="bg-zinc-800/50 p-1 rounded-xl flex">
                {(['concise', 'standard', 'detailed'] as ResponseLength[]).map((len) => (
                    <button
                        key={len}
                        onClick={() => updateConfig('length', len)}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 capitalize
                        ${config.length === len 
                            ? 'bg-zinc-700 text-white shadow-sm' 
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                        {len}
                    </button>
                ))}
            </div>
          </div>

          {/* Complexity Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-zinc-300 font-medium text-sm">
                <BookOpen size={16} className="text-emerald-400" />
                <span>Complexity Level</span>
            </div>
            <div className="space-y-3">
                <input 
                    type="range" 
                    min="0" 
                    max="2" 
                    step="1"
                    value={config.complexity === 'simple' ? 0 : config.complexity === 'standard' ? 1 : 2}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        const complex: ResponseComplexity = val === 0 ? 'simple' : val === 1 ? 'standard' : 'technical';
                        updateConfig('complexity', complex);
                    }}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-zinc-500 font-medium px-1">
                    <span className={config.complexity === 'simple' ? 'text-emerald-400' : ''}>Simple</span>
                    <span className={config.complexity === 'standard' ? 'text-emerald-400' : ''}>Standard</span>
                    <span className={config.complexity === 'technical' ? 'text-emerald-400' : ''}>Technical</span>
                </div>
            </div>
          </div>

          {/* Voice & Audio Section */}
          <div className="space-y-3 pt-4 border-t border-zinc-800">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-300 font-medium text-sm">
                    <Volume2 size={16} className="text-purple-400" />
                    <span>Voice Output</span>
                </div>
                <button
                    onClick={() => updateConfig('textToSpeech', !config.textToSpeech)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${config.textToSpeech ? 'bg-purple-500' : 'bg-zinc-700'}`}
                >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${config.textToSpeech ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
             </div>

             {config.textToSpeech && (
                 <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-200">
                     <select 
                        value={config.voiceURI}
                        onChange={(e) => {
                            updateConfig('voiceURI', e.target.value);
                            handlePreviewVoice(e.target.value);
                        }}
                        className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm rounded-lg p-2.5 focus:border-purple-500 focus:outline-none"
                     >
                        <option value="">Select a voice...</option>
                        {voices.map(voice => (
                            <option key={voice.voiceURI} value={voice.voiceURI}>
                                {voice.name} ({voice.lang})
                            </option>
                        ))}
                     </select>
                     <p className="text-[10px] text-zinc-500">
                        Select your preferred AI voice for response reading.
                     </p>
                 </div>
             )}
          </div>

          {/* Storage Section */}
          <div className="space-y-3 pt-4 border-t border-zinc-800">
             <div className="flex items-center gap-2 text-zinc-300 font-medium text-sm">
                <HardDrive size={16} className="text-pink-400" />
                <span>Storage Limit (Chats)</span>
            </div>
            <div className="space-y-2">
                 <input 
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={config.historyLimit || 20}
                    onChange={(e) => updateConfig('historyLimit', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                 />
                 <div className="flex justify-between text-xs text-zinc-500 font-medium px-1">
                    <span>5</span>
                    <span className="text-pink-400 font-bold">{config.historyLimit || 20} saved chats</span>
                    <span>50</span>
                 </div>
                 <p className="text-[10px] text-zinc-600 pt-1">
                    Older chats will be automatically removed when the limit is reached.
                 </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 flex justify-end">
            <button 
                onClick={onClose}
                className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
            >
                Done
            </button>
        </div>
      </div>
    </div>
  );
};