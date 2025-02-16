'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from 'ai/react';
import { useAuth } from '../../lib/contexts/AuthContext';
import { useTaskData } from '../../lib/contexts/TaskDataContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'morpheus';
  timestamp: Date;
  isTyping?: boolean;
}

export default function MorpheusChat() {
  const { user } = useAuth();
  const { tasks } = useTaskData();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [localMessages, setLocalMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to the Matrix. I\'ve been expecting you.',
      sender: 'morpheus',
      timestamp: new Date(),
    }
  ]);
  const [currentTypingMessage, setCurrentTypingMessage] = useState<string>('');
  const [isTypingComplete, setIsTypingComplete] = useState(true);
  const [isAITyping, setIsAITyping] = useState(false);
  
  const { messages: aiMessages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/anthropic/chat',
    body: {
      userId: user?.uid,
      userTasks: tasks,
      currentTime: new Date().toISOString(),
    },
    onFinish: (message) => {
      console.log('Finished message:', message);
      setIsAITyping(false);
    },
    onError: (error) => {
      console.error('Error:', error);
      setIsAITyping(false);
      setLocalMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "I apologize, but I encountered an error. Please try again.",
        sender: 'morpheus',
        timestamp: new Date(),
      }]);
    }
  });

  // Update local messages when AI messages change
  useEffect(() => {
    if (aiMessages.length > 0) {
      const lastMessage = aiMessages[aiMessages.length - 1];
      
      if (lastMessage.role === 'assistant') {
        const messageText = lastMessage.content.trim();
        setIsTypingComplete(false);
        
        // Set first character immediately
        setCurrentTypingMessage(messageText[0] || '');
        
        let currentIndex = 1; // Start from second character
        const randomDelays = Array.from({ length: messageText.length - 1 }, () => 
          Math.random() * 30 + 20 // Random delay between 20-50ms for each character
        );
        
        const typeNextCharacter = () => {
          if (currentIndex < messageText.length) {
            setCurrentTypingMessage(messageText.slice(0, currentIndex + 1));
            currentIndex++;
            
            // Add slightly longer pause for punctuation
            const delay = messageText[currentIndex - 1]?.match(/[.,!?]/) 
              ? randomDelays[currentIndex - 1] + 200
              : randomDelays[currentIndex - 1];
              
            setTimeout(typeNextCharacter, delay);
          } else {
            setIsTypingComplete(true);
            setLocalMessages(prev => [...prev, {
              id: Date.now().toString(),
              text: messageText,
              sender: 'morpheus',
              timestamp: new Date(),
            }]);
            setCurrentTypingMessage('');
          }
        };
        
        if (messageText.length > 1) {
          setTimeout(typeNextCharacter, 50); // Start typing the rest after a short delay
        } else {
          setIsTypingComplete(true);
          setLocalMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: messageText,
            sender: 'morpheus',
            timestamp: new Date(),
          }]);
          setCurrentTypingMessage('');
        }
      } else if (lastMessage.role === 'user' && lastMessage.content.trim().length > 0) {
        // Handle user messages as before
        setLocalMessages(prev => {
          const isDuplicate = prev.some(m => 
            m.sender === 'user' && 
            m.text === lastMessage.content.trim() &&
            Date.now() - m.timestamp.getTime() < 1000
          );
          
          if (!isDuplicate) {
            return [...prev, {
              id: Date.now().toString(),
              text: lastMessage.content.trim(),
              sender: 'user',
              timestamp: new Date(),
            }];
          }
          return prev;
        });
      }
    }
  }, [aiMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  const handleLocalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsAITyping(true);
    try {
      await handleSubmit(e);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsAITyping(false);
      setLocalMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "I apologize, but I encountered an error. Please try again.",
        sender: 'morpheus',
        timestamp: new Date(),
      }]);
    }
  };

  return (
    <div className="w-full">
      {/* Level Display */}
      <motion.div 
        className="mb-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-block px-4 py-2 bg-black/50 rounded-xl border border-[#78A892]/20">
          <h2 className="text-sm font-mono text-[#78A892]">LEVEL 1: INITIATE</h2>
          <div className="w-full bg-black/50 h-2 rounded-full mt-2">
            <motion.div 
              className="bg-[#78A892] h-2 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "25%" }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Chat Container */}
      <div className="bg-black/50 rounded-xl border border-[#78A892]/20 relative overflow-hidden">
        {/* Matrix-style scanline effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="scanline"></div>
        </div>

        {/* Chat Header */}
        <div className="border-b border-[#78A892]/20 p-4 flex items-center gap-4 relative">
          <motion.div 
            className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-[#78A892]/30"
            animate={{ 
              boxShadow: ['0 0 10px #78A892', '0 0 20px #78A892', '0 0 10px #78A892'] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute inset-0 bg-[#78A892]/10"></div>
            <div className="w-full h-full bg-black/70 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-[#78A892]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M8 10l3 3-3 3" />
                <line x1="13" y1="16" x2="17" y2="16" />
              </svg>
            </div>
          </motion.div>
          <div>
            <h1 className="text-xl font-semibold text-[#78A892] font-mono">System Terminal</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#78A892] rounded-full animate-pulse"></span>
              <p className="text-sm text-[#78A892]/70 font-mono">Connected</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[300px] sm:h-[400px] overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4 font-mono scrollbar-thin scrollbar-thumb-[#78A892]/20 scrollbar-track-transparent">
          <AnimatePresence>
            {localMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[80%] p-2 sm:p-3 rounded-xl ${
                    message.sender === 'user'
                      ? 'bg-[#78A892]/10 text-[#78A892] border border-[#78A892]/20'
                      : 'bg-black/70 text-[#78A892] border border-[#78A892]/20'
                  }`}
                >
                  <p className="text-xs sm:text-sm whitespace-pre-wrap">
                    {message.text}
                  </p>
                  <span className="text-[10px] sm:text-xs text-[#78A892]/50 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Typing Animation */}
          {!isTypingComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-black/70 text-[#78A892] border border-[#78A892]/20 p-3 rounded-xl">
                <p className="text-sm whitespace-pre-wrap">
                  {currentTypingMessage}
                  <motion.span
                    animate={{ opacity: [0, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-2 h-4 ml-1 bg-[#78A892] relative -top-px"
                  />
                </p>
                <span className="text-xs text-[#78A892]/50 mt-1 block">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          )}
          
          {isAITyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-black/70 text-[#78A892] border border-[#78A892]/20 p-3 rounded-xl">
                <div className="flex items-center font-mono">
                  <span className="text-[#78A892] opacity-70">{'>'}</span>
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ 
                      duration: 0.5, 
                      repeat: Infinity, 
                      repeatType: "reverse",
                      ease: "linear"
                    }}
                    className="w-2 h-4 ml-2 bg-[#78A892] inline-block"
                  />
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleLocalSubmit} className="border-t border-[#78A892]/20 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Enter your message..."
              disabled={isLoading}
              className="flex-1 bg-black/50 border border-[#78A892]/20 rounded-xl px-4 py-2 text-[#78A892] placeholder-[#78A892]/40 focus:outline-none focus:border-[#78A892]/50 font-mono transition-colors duration-200 disabled:opacity-50"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
              className="px-6 py-2 bg-[#78A892] text-black rounded-xl font-mono hover:bg-[#5C8B75] transition-all duration-300 disabled:opacity-50"
            >
              Send
            </motion.button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .scanline {
          width: 100%;
          height: 100px;
          position: absolute;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(120, 168, 146, 0.05),
            transparent
          );
          animation: scanline 6s linear infinite;
        }

        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </div>
  );
} 