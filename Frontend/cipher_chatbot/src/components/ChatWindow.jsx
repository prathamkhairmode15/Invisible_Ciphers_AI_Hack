import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { Search, ShieldAlert, Code } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatWindow = ({ chatHistory, isLoading, onQuickAction, username = "Admin" }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatHistory, isLoading]);

  const quickActions = [
    {
      id: 1,
      title: "Plan a Trip",
      desc: "Create a 5-day itinerary for Tokyo",
      icon: Search,
      action: "Create a 5-day travel itinerary for Tokyo, Japan."
    },
    {
      id: 2,
      title: "Explain Concept",
      desc: "Simplify quantum computing",
      icon: Search,
      action: "Explain quantum computing in simple terms for a beginner."
    },
    {
      id: 3,
      title: "Write Code",
      desc: "Python script for web scraping",
      icon: Code,
      action: "Write a simple Python script to scrape data from a webpage."
    }
  ];

  return (
    <div className="flex-1 relative overflow-hidden flex flex-col h-full">
      {chatHistory.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 animate-fade-in relative z-10 w-full max-w-3xl mx-auto h-full pb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-text-main mb-6 tracking-tight drop-shadow-sm">Hey, {username}</h2>
            <p className="text-xl sm:text-2xl text-text-sub font-body">
              What can I secure for you today?
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {quickActions.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onQuickAction && onQuickAction(item.action)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
                  className="flex flex-col items-start p-4 bg-secondary/20 backdrop-blur-md border border-white/5 rounded-2xl text-left hover:bg-secondary/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.1),0_0_15px_rgba(0,255,159,0.05)] hover:border-white/10 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <h3 className="text-sm font-medium text-text-main mb-1">{item.title}</h3>
                  <p className="text-xs text-text-sub leading-relaxed">{item.desc}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 lg:px-8 pt-20 pb-8 custom-scrollbar relative z-10 h-full"
        >
          <div className="max-w-3xl mx-auto space-y-6">
            {chatHistory.map((chat, index) => (
              <MessageBubble
                key={index}
                message={chat.message}
                isAI={chat.isAI}
                riskScore={chat.riskScore}
                isMalicious={chat.isMalicious}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-6 animate-fade-in">
                <div className="flex max-w-[80%] gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center border border-white/5 shadow-sm">
                    <span className="font-display font-bold text-primary text-sm">C</span>
                  </div>
                  <div className="bg-secondary/30 backdrop-blur-md border border-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center shadow-sm h-10">
                    <motion.div className="w-1.5 h-1.5 bg-primary/60 rounded-full" animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} />
                    <motion.div className="w-1.5 h-1.5 bg-primary/60 rounded-full" animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} />
                    <motion.div className="w-1.5 h-1.5 bg-primary/60 rounded-full" animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
