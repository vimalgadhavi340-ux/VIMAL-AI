import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import { Logo } from './Logo';

interface AuthPageProps {
  onLogin: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
        setIsLoading(false);
        onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#020617]">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="w-full max-w-md z-10 p-6">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
            <div className="relative mb-6 flex items-center justify-center">
                {/* Orbital Rings Effect behind Logo */}
                <div className="absolute inset-[-10px] border border-cyan-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-[-20px] border border-purple-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                
                <div className="animate-float">
                    <Logo size={100} animated />
                </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-200 via-white to-purple-200 bg-clip-text text-transparent brand-font tracking-tight">
                KRATI
            </h1>
            <p className="text-slate-400 mt-2 text-sm">Intelligence Reimagined</p>
        </div>

        {/* Card */}
        <div className="glass p-8 rounded-2xl border border-slate-700/50 shadow-2xl backdrop-blur-xl">
            <div className="flex gap-4 mb-8 border-b border-slate-700/50 pb-1">
                <button 
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 pb-3 text-sm font-medium transition-all relative ${isLogin ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Login
                    {isLogin && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-cyan-400 rounded-full" />}
                </button>
                <button 
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 pb-3 text-sm font-medium transition-all relative ${!isLogin ? 'text-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Sign Up
                    {!isLogin && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-purple-400 rounded-full" />}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400 ml-1">Full Name</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-3 text-slate-500" />
                            <input 
                                type="text" 
                                required
                                placeholder="Enter your name" 
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400 ml-1">Email</label>
                    <div className="relative">
                        <Mail size={16} className="absolute left-3 top-3 text-slate-500" />
                        <input 
                            type="email" 
                            required
                            placeholder="hello@example.com" 
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400 ml-1">Password</label>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3 top-3 text-slate-500" />
                        <input 
                            type="password" 
                            required
                            placeholder="••••••••" 
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
            By continuing, you agree to Krati's <a href="#" className="text-cyan-400 hover:underline">Terms of Service</a>
        </p>
      </div>
    </div>
  );
};