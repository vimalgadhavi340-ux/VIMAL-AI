import { ChatSession } from '../types';

const STORAGE_KEY = 'lumina_chat_history';

export const getSavedSessions = (): ChatSession[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const sessions = JSON.parse(data);
    // Revive Date objects
    return sessions.map((session: any) => ({
      ...session,
      messages: session.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    })).sort((a: ChatSession, b: ChatSession) => b.createdAt - a.createdAt);
  } catch (e) {
    console.error("Failed to load chats", e);
    return [];
  }
};

export const saveSessions = (sessions: ChatSession[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error("Failed to save chats", e);
  }
};

export const createSession = (sessions: ChatSession[], firstMessage: any): ChatSession => {
    const title = firstMessage.content.slice(0, 30) + (firstMessage.content.length > 30 ? '...' : '');
    const newSession: ChatSession = {
        id: Date.now().toString(),
        title: title || 'New Conversation',
        messages: [firstMessage],
        createdAt: Date.now()
    };
    return newSession;
};
