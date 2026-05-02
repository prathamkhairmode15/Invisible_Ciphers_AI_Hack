import React from 'react';
import { motion } from 'framer-motion';

const FluidShape = () => {
  return (
    <div className="relative w-64 h-64 mx-auto mb-10 flex justify-center items-center">
      {/* Background soft glow */}
      <motion.div 
        className="absolute w-48 h-48 bg-primary/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Foreground cyan glow */}
      <motion.div 
        className="absolute w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.5, 0.2],
          x: [0, 20, 0],
          y: [0, -20, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main abstract fluid blob */}
      <motion.div
        className="relative w-32 h-32 backdrop-blur-md border border-white/10"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 255, 159, 0.1), rgba(0, 200, 255, 0.1))',
          boxShadow: 'inset 0 0 20px rgba(255,255,255,0.05), 0 0 30px rgba(0,255,159,0.2)'
        }}
        animate={{
          borderRadius: [
            "60% 40% 30% 70% / 60% 30% 70% 40%",
            "30% 70% 70% 30% / 30% 30% 70% 70%",
            "60% 40% 30% 70% / 60% 30% 70% 40%"
          ],
          rotate: [0, 90, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Sparkles */}
      <motion.div
        className="absolute w-1 h-1 bg-white rounded-full"
        style={{ top: '20%', left: '30%', boxShadow: '0 0 5px white' }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
      />
      <motion.div
        className="absolute w-1.5 h-1.5 bg-primary rounded-full"
        style={{ bottom: '25%', right: '25%', boxShadow: '0 0 5px var(--primary)' }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
      />
    </div>
  );
};

export default FluidShape;
