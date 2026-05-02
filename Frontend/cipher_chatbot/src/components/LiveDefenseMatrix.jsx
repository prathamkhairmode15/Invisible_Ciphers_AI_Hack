import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const LiveDefenseMatrix = ({ isMalicious }) => {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  
  // Generate random nodes
  useEffect(() => {
    const newNodes = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10, // 10% to 90%
      y: Math.random() * 80 + 10,
      size: Math.random() * 4 + 2,
    }));
    
    const newConnections = [];
    for (let i = 0; i < newNodes.length; i++) {
      // Connect to 2-3 random other nodes
      const numConnections = Math.floor(Math.random() * 2) + 2;
      for (let j = 0; j < numConnections; j++) {
        const targetId = Math.floor(Math.random() * newNodes.length);
        if (targetId !== i) {
          newConnections.push({ source: i, target: targetId });
        }
      }
    }
    
    setNodes(newNodes);
    setConnections(newConnections);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      <div className="absolute inset-0 scanline-effect opacity-30 z-10"></div>
      
      {/* Background Grid */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 159, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 159, 0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      ></div>

      <svg className="w-full h-full absolute inset-0 z-0">
        {/* Connections */}
        {connections.map((conn, idx) => {
          const sourceNode = nodes.find(n => n.id === conn.source);
          const targetNode = nodes.find(n => n.id === conn.target);
          if (!sourceNode || !targetNode) return null;
          
          return (
            <motion.line
              key={`conn-${idx}`}
              x1={`${sourceNode.x}%`}
              y1={`${sourceNode.y}%`}
              x2={`${targetNode.x}%`}
              y2={`${targetNode.y}%`}
              stroke={isMalicious ? 'var(--danger)' : 'var(--primary)'}
              strokeWidth="0.5"
              strokeOpacity={isMalicious ? 0.6 : 0.2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: isMalicious ? 0.6 : 0.2 }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: 'reverse', 
                ease: 'easeInOut',
                delay: Math.random() * 2 
              }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map(node => (
        <motion.div
          key={`node-${node.id}`}
          className={`absolute rounded-full shadow-[0_0_10px_currentColor] ${isMalicious ? 'bg-danger text-danger' : 'bg-primary text-primary'}`}
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: `${node.size}px`,
            height: `${node.size}px`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
            boxShadow: [
              '0 0 5px currentColor',
              '0 0 15px currentColor',
              '0 0 5px currentColor'
            ]
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
      
      {/* Floating Labels */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          className={`px-4 py-1 rounded border backdrop-blur-sm text-xs font-display tracking-widest uppercase
            ${isMalicious 
              ? 'border-danger/50 text-danger bg-danger/10 shadow-[0_0_15px_rgba(255,59,59,0.5)]' 
              : 'border-primary/30 text-primary/70 bg-primary/5 shadow-[0_0_10px_rgba(0,255,159,0.2)]'
            }`}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [0.95, 1, 0.95]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {isMalicious ? '⚠ Threat Detection Running' : 'Neural Firewall Engaged'}
        </motion.div>
      </div>
    </div>
  );
};

export default LiveDefenseMatrix;
