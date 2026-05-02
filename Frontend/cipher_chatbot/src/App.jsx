import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import InputBox from './components/InputBox';
import AlertBanner from './components/AlertBanner';
import Auth from './components/Auth';
import { streamChat } from './api/chatService';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('cipher-theme') || 'dark';
  });
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(() => localStorage.getItem('cipher-user') || null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cipher-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Store user in local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('cipher-user', user);
    } else {
      localStorage.removeItem('cipher-user');
    }
  }, [user]);

  const [userStatus, setUserStatus] = useState({ strikes: 0, max_strikes: 5, locked: false });

  const fetchStatus = async () => {
    if (!user) return;
    try {
      const res = await fetch('http://localhost:5000/api/user/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user })
      });
      if (res.ok) {
        const data = await res.json();
        setUserStatus(data);
      }
    } catch (err) {}
  };

  const triggerStatusRefresh = () => {
    fetchStatus();
  };

  // Poll for user status
  useEffect(() => {
    if (!user) return;
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Check every 5s
    return () => clearInterval(interval);
  }, [user]);

  // Clear history on initial mount (refresh)
  useEffect(() => {
    const initSession = async () => {
      if (!user) return;
      try {
        await fetch('http://localhost:5000/api/clear', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: user })
        });
      } catch (error) {
        console.error("Failed to initialize session:", error);
      }
    };
    initSession();
  }, [user]);


  const handleSendMessage = async (userMessage, attachedFile = null) => {
    const newUserMessage = {
      message: userMessage,
      isAI: false,
      timestamp: new Date().toISOString(),
      file: attachedFile ? { name: attachedFile.name, type: attachedFile.type } : null
    };
    
    setChatHistory(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    setAlert(null);

    // Add a placeholder for the AI response
    const aiPlaceholder = {
      message: '',
      isAI: true,
      timestamp: new Date().toISOString(),
      isLoading: true,
    };
    setChatHistory(prev => [...prev, aiPlaceholder]);

    try {
      await streamChat(
        userMessage,
        attachedFile,
        user, // Pass username to streamChat
        (chunk) => {
          setChatHistory(prev => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            if (lastIndex >= 0 && updated[lastIndex].isAI) {
              updated[lastIndex] = {
                ...updated[lastIndex],
                message: updated[lastIndex].message + chunk,
                isLoading: false
              };
            }
            return updated;
          });
        },
        (finalData) => {
          setChatHistory(prev => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            const userIndex = updated.length - 2;
            
            if (lastIndex >= 0 && updated[lastIndex].isAI) {
              updated[lastIndex] = {
                ...updated[lastIndex],
                riskScore: finalData.risk_score,
                isMalicious: finalData.is_malicious
              };
              
              if (finalData.account_locked) {
                updated[lastIndex].message = `[ACCOUNT LOCKED] ${finalData.chunk || "You have exceeded security limits."}`;
              } else if (finalData.output_blocked && !updated[lastIndex].message.includes("SECURITY BREACH")) {
                updated[lastIndex].message += `\n\n[SECURITY BREACH DETECTED] Content purged for your safety.`;
              }
            }
            
            if (userIndex >= 0 && !updated[userIndex].isAI) {
              updated[userIndex] = {
                ...updated[userIndex],
                riskScore: finalData.risk_score,
                isMalicious: finalData.is_malicious
              };
            }
            
            return updated;
          });
          setIsLoading(false);
          // Trigger immediate token refresh
          if (finalData.is_malicious) {
            triggerStatusRefresh();
          }
        },
        (error) => {
          console.error("Stream error:", error);
          setChatHistory(prev => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            if (lastIndex >= 0 && updated[lastIndex].isAI) {
              updated[lastIndex] = {
                ...updated[lastIndex],
                message: "Error: Failed to connect to security engine.",
                isError: true,
                isLoading: false
              };
            }
            return updated;
          });
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Failed to start stream:", error);
      setIsLoading(false);
    }
  };

  const handleStopGeneration = async () => {
    try {
      await fetch('http://localhost:5000/api/stop', { method: 'POST' });
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to stop generation:", error);
    }
  };

  const clearChat = async () => {
    try {
      await fetch('http://localhost:5000/api/clear', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user })
      });
      setChatHistory([]);
      setAlert(null);
    } catch (error) {
      console.error("Failed to clear history:", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setChatHistory([]);
  };

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <div className="flex h-screen bg-dark-gradient text-slate-200 overflow-hidden relative">
      {/* Sidebar - Responsive handling */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-30`}>
        <Sidebar />
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        <Header 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          username={user}
          onLogout={handleLogout}
          userStatus={userStatus}
        />
        
        <div className="flex-1 flex overflow-hidden relative">
          <div className="flex-1 flex flex-col min-w-0 relative max-w-4xl mx-auto w-full">
            <ChatWindow 
              chatHistory={chatHistory} 
              isLoading={isLoading}
              onQuickAction={handleSendMessage}
              username={user}
            />
            
            <InputBox 
              onSendMessage={handleSendMessage} 
              onClearChat={clearChat}
              onStop={handleStopGeneration}
              isLoading={isLoading}
              isDisabled={userStatus.locked}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
