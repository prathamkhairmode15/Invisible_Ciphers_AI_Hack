import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Loader2, Image as ImageIcon, FileText, FileCode, FileType2, Mic, ShieldAlert, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InputBox = ({ onSendMessage, onClearChat, onStop, isLoading, isDisabled }) => {
  const [message, setMessage] = useState('');
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const attachRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (attachRef.current && !attachRef.current.contains(event.target)) {
        setIsAttachOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            currentTranscript += transcript + ' ';
          }
        }
        if (currentTranscript) {
          setMessage(prev => prev + currentTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isDisabled) return;
    if (message.trim() || attachedFile) {
      onSendMessage(message, attachedFile);
      setMessage('');
      setAttachedFile(null);
      setIsAttachOpen(false);
      if (isRecording) {
        recognitionRef.current?.stop();
        setIsRecording(false);
      }
    }
  };

  const handleFileSelect = (e) => {
    if (isDisabled) return;
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
      setIsAttachOpen(false);
    }
  };

  const triggerFileSelect = (type) => {
    if (isDisabled) return;
    let accept = '*/*';
    if (type === 'image') accept = 'image/*';
    if (type === 'doc') accept = '.doc,.docx,.txt';
    if (type === 'pdf') accept = '.pdf';
    if (type === 'code') accept = '.js,.py,.html,.css,.json,.jsx,.ts,.tsx';
    
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('accept', accept);
      fileInputRef.current.click();
    }
  };

  const toggleRecording = () => {
    if (isDisabled) return;
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setMessage('');
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const attachmentOptions = [
    { id: 'image', label: 'Upload Image', icon: ImageIcon, color: 'text-blue-400' },
    { id: 'doc', label: 'Upload Document', icon: FileText, color: 'text-purple-400' },
    { id: 'pdf', label: 'Upload PDF', icon: FileType2, color: 'text-red-400' },
    { id: 'code', label: 'Upload Code', icon: FileCode, color: 'text-yellow-400' }
  ];

  if (isDisabled) {
    return (
      <div className="p-4 bg-transparent max-w-4xl mx-auto w-full relative z-20">
        <div className="relative flex flex-col items-center justify-center gap-2 bg-danger/10 backdrop-blur-xl border border-danger/30 rounded-[24px] p-6 shadow-lg transition-all duration-300">
          <ShieldAlert size={24} className="text-danger animate-pulse" />
          <h3 className="text-danger font-display font-bold uppercase tracking-widest text-sm text-center">Security Lockdown</h3>
          <p className="text-danger/80 text-xs font-mono text-center max-w-md">
            You have exceeded the maximum allowed security violations (5/5) in the last hour. Input is temporarily disabled. Cooldown active.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 relative z-10 bg-gradient-to-t from-background via-background/90 to-transparent pt-4 pb-6">
      
      <AnimatePresence>
        {attachedFile && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="mb-3"
          >
            <div className="inline-flex items-center gap-3 bg-secondary/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                {attachedFile.type.includes('image') ? <ImageIcon size={16} className="text-blue-400" /> :
                 attachedFile.type.includes('pdf') ? <FileType2 size={16} className="text-red-400" /> :
                 <FileText size={16} className="text-purple-400" />}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text-main max-w-[200px] truncate">{attachedFile.name}</span>
                <span className="text-[10px] text-text-sub font-mono uppercase tracking-wider">
                  {(attachedFile.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <button
                onClick={removeAttachment}
                className="ml-2 w-6 h-6 rounded-full bg-white/5 hover:bg-danger/20 hover:text-danger text-text-sub flex items-center justify-center transition-colors"
                title="Remove attachment"
              >
                <X size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="relative group">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          className="hidden" 
        />
        
        <div className={`absolute -inset-0.5 rounded-[28px] blur-sm transition-opacity duration-500 ${isRecording ? 'bg-gradient-to-r from-danger/50 to-red-400/50 opacity-100 animate-pulse' : 'bg-gradient-to-r from-primary/30 to-cyan-400/30 opacity-0 group-focus-within:opacity-100'}`}></div>

        <div className="relative flex items-center gap-2 bg-secondary/80 backdrop-blur-xl border border-white/10 rounded-[24px] p-2 shadow-lg transition-all duration-300">
          
          <div className="relative" ref={attachRef}>
            <button
              type="button"
              onClick={() => setIsAttachOpen(!isAttachOpen)}
              className={`p-3 transition-colors rounded-xl ${isAttachOpen ? 'bg-white/10 text-text-main' : 'text-text-sub hover:text-text-main hover:bg-white/5'}`}
              title="Attach File"
            >
              <Paperclip size={20} className={isAttachOpen ? 'text-primary' : ''} />
            </button>

            <AnimatePresence>
              {isAttachOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-0 mb-3 w-48 bg-secondary/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden"
                >
                  <div className="p-2 flex flex-col gap-1">
                    {attachmentOptions.map(option => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => triggerFileSelect(option.id)}
                          className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-sm text-text-main group/btn"
                        >
                          <div className={`p-1.5 rounded-lg bg-white/5 group-hover/btn:bg-white/10 ${option.color}`}>
                            <Icon size={16} />
                          </div>
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? "Listening..." : "Ask securely… your input is protected"}
            className={`flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-text-main placeholder:text-text-sub/50 resize-none h-[44px] py-3 px-2 font-body text-[15px] custom-scrollbar ${isRecording ? 'text-danger placeholder:text-danger/50' : ''}`}
            disabled={isLoading}
            rows={1}
          />
          
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-3 transition-colors rounded-xl flex items-center justify-center ${isRecording ? 'text-danger bg-danger/10 animate-pulse' : 'text-text-sub hover:text-text-main hover:bg-white/5'}`}
            title="Voice Input"
          >
            <Mic size={20} />
          </button>

          <button
            type={isLoading ? "button" : "submit"}
            onClick={isLoading ? onStop : undefined}
            disabled={(!message.trim() && !attachedFile && !isLoading)}
            className={`p-3 rounded-2xl transition-all transform flex items-center justify-center min-w-[44px] ${
              (message.trim() || attachedFile || isLoading)
                ? (isLoading ? 'bg-danger text-white hover:scale-105 animate-pulse' : 'bg-primary text-secondary hover:shadow-[0_4px_15px_rgba(0,255,159,0.3)] hover:scale-105 active:scale-95')
                : 'bg-white/5 text-text-sub cursor-not-allowed opacity-50'
            }`}
            title={isLoading ? "Stop Generation" : "Send Message"}
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </form>

      <div className="flex items-center justify-center mt-3">
        <p className="text-xs font-body text-text-sub/60">
          Protected by Cipher AI Shield
        </p>
      </div>
    </div>
  );
};

export default InputBox;
