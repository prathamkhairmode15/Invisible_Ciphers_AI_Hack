import React from 'react';
import { Home, MessageSquare, Plus, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import AttackSimulator from './AttackSimulator';

const Sidebar = () => {
  const recentChats = [
    { id: 1, title: 'Trip to Tokyo itinerary', time: '2 hours ago' },
    { id: 2, title: 'Explain Quantum Computing', time: 'Yesterday' },
    { id: 3, title: 'Python web scraper script', time: 'Yesterday' },
    { id: 4, title: 'Ideas for living room decor', time: 'Previous 7 Days' },
    { id: 5, title: 'Healthy dinner recipes', time: 'Previous 7 Days' },
  ];

  return (
    <aside className="w-64 sm:w-72 bg-secondary/30 backdrop-blur-2xl border-r border-white/5 flex flex-col h-screen z-20 relative">
      {/* Top Logo & New Chat */}
      <div className="p-4 border-b border-white/5">
        <button className="w-full flex items-center justify-between gap-2 bg-white/5 hover:bg-white/10 text-text-main px-4 py-2.5 rounded-xl border border-white/10 transition-all shadow-sm hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
          <span className="font-medium text-sm">New Chat</span>
          <Plus size={18} />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
        <div className="mb-6 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-primary bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(0,255,159,0.05)] text-sm font-medium">
            <Home size={18} className="drop-shadow-[0_0_5px_rgba(0,255,159,0.5)]" />
            Home
          </button>
        </div>

        <div className="mb-2 px-3 text-xs font-medium text-text-sub uppercase tracking-wider">
          Recent
        </div>
        <div className="space-y-1">
          {recentChats.map((chat) => (
            <button
              key={chat.id}
              className="w-full flex flex-col items-start px-3 py-2.5 rounded-xl text-text-sub hover:text-text-main hover:bg-white/5 transition-all text-sm group"
            >
              <div className="flex items-center gap-3 w-full">
                <MessageSquare size={16} className="shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="truncate w-full text-left">{chat.title}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-8">
          <AttackSimulator />
        </div>
      </div>

      {/* Settings / Bottom */}
      <div className="p-4 border-t border-white/5">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-sub hover:text-text-main hover:bg-white/5 transition-all text-sm font-medium">
          <Settings size={18} />
          Settings
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
