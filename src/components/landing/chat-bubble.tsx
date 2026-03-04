'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send, RotateCcw } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import ReactMarkdown, { type Components } from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const STORAGE_KEY = 'baski-chat-messages';
const MAX_INPUT_LENGTH = 500;

// Terminal-themed markdown components for assistant messages
const mdComponents: Components = {
  p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
  strong: ({ children }) => <span className="text-[#D4D4D4] font-semibold">{children}</span>,
  em: ({ children }) => <span className="italic text-[#E5E5E5]">{children}</span>,
  ul: ({ children }) => <ul className="ml-3 mb-1.5 space-y-0.5">{children}</ul>,
  ol: ({ children }) => <ol className="ml-3 mb-1.5 space-y-0.5 list-decimal">{children}</ol>,
  li: ({ children }) => (
    <li className="flex gap-1.5">
      <span className="text-[#A3A3A3] flex-shrink-0">-</span>
      <span>{children}</span>
    </li>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#D97706] hover:text-[#F59E0B] underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="bg-[#333] text-[#E5E5E5] px-1 py-0.5 rounded text-[10px]">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="bg-[#252525] border border-[#333] rounded p-2 my-1.5 overflow-x-auto text-[10px]">{children}</pre>
  ),
};

function loadMessages(): Message[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Corrupted data — ignore
  }
  return [];
}

function saveMessages(messages: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Storage full or unavailable — ignore
  }
}

export function ChatBubble() {
  const { lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const greeting = lang === 'ka'
    ? 'გამარჯობა! მე ვარ ბასკი, ირაკლის AI ასისტენტი. რა გაინტერესებთ მის შესახებ?'
    : "hey! i'm baski, irakli's AI assistant. ask me anything about his work, projects, or expertise.";

  // Load messages from localStorage on mount
  useEffect(() => {
    setMessages(loadMessages());
    setHydrated(true);
  }, []);

  // Persist messages to localStorage on change (after hydration)
  useEffect(() => {
    if (hydrated) {
      saveMessages(messages);
    }
  }, [messages, hydrated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setInput('');
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    const withPlaceholder = [...newMessages, { role: 'assistant' as const, content: '' }];
    setMessages(withPlaceholder);
    setInput('');
    setStreaming(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        let errorMsg = 'something went wrong. try again.';
        if (res.status === 429) {
          errorMsg = 'slow down a bit! try again in a moment.';
        } else {
          try {
            const data = await res.json();
            errorMsg = data.error || errorMsg;
          } catch {
            // couldn't parse JSON — use default
          }
        }
        setMessages([...newMessages, { role: 'assistant', content: errorMsg }]);
        return;
      }

      if (!res.body) {
        setMessages([...newMessages, { role: 'assistant', content: 'no response received.' }]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });
        const updated = [...newMessages, { role: 'assistant' as const, content: accumulated }];
        setMessages(updated);
      }

      accumulated += decoder.decode();
      if (!accumulated) {
        accumulated = 'no response generated.';
      }

      setMessages([...newMessages, { role: 'assistant', content: accumulated }]);
    } catch {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'connection error. please try again.' },
      ]);
    } finally {
      setStreaming(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_INPUT_LENGTH) {
      setInput(value);
    }
  };

  const charsRemaining = MAX_INPUT_LENGTH - input.length;
  const showCharCount = charsRemaining <= 50;

  return (
    <>
      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[340px] sm:w-[400px] max-h-[520px] flex flex-col rounded-lg border border-[#333] bg-[#1A1A1A] overflow-hidden shadow-2xl shadow-black/50 font-mono animate-fade-in text-[13px]">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#252525] border-b border-[#333]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-[#C75050]" />
                <div className="w-2 h-2 rounded-full bg-[#C9A644]" />
                <div className="w-2 h-2 rounded-full bg-[#4AC75A]" />
              </div>
              <span className="text-xs text-[#A3A3A3]">~/baski</span>
            </div>
            <div className="flex items-center gap-1.5">
              {messages.length > 0 && !streaming && (
                <button
                  onClick={resetChat}
                  className="text-[#737373] hover:text-[#E5E5E5] transition-colors p-0.5"
                  title="Clear chat"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-[#737373] hover:text-[#E5E5E5] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[300px] max-h-[380px]">
            {/* Greeting */}
            <div>
              <span className="text-[#D97706]">{'> '}</span>
              <span className="text-[#A3A3A3]">{greeting}</span>
            </div>

            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === 'user' ? (
                  <div>
                    <span className="text-[#22C55E]">{'visitor> '}</span>
                    <span className="text-[#E5E5E5]">{msg.content}</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-[#D97706]">{'> '}</span>
                    <span className="text-[#A3A3A3] inline">
                      <ReactMarkdown components={mdComponents}>
                        {msg.content}
                      </ReactMarkdown>
                      {streaming && i === messages.length - 1 && (
                        <span className="inline-block w-1.5 h-3 bg-[#D97706] ml-0.5 animate-pulse align-middle" />
                      )}
                    </span>
                  </div>
                )}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[#333] p-2">
            <div className="flex items-center gap-2 bg-[#252525] rounded px-2 py-1.5 border border-[#333] focus-within:border-[#D97706] transition-colors">
              <span className="text-[#D97706]">{'>'}</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={lang === 'ka' ? 'დასვით კითხვა...' : 'ask about irakli...'}
                className="flex-1 bg-transparent text-[#E5E5E5] placeholder:text-[#737373] outline-none"
                readOnly={streaming}
                maxLength={MAX_INPUT_LENGTH}
              />
              {showCharCount && (
                <span className={`text-[10px] tabular-nums ${charsRemaining <= 10 ? 'text-[#EF4444]' : 'text-[#737373]'}`}>
                  {charsRemaining}
                </span>
              )}
              <button
                onClick={sendMessage}
                disabled={streaming || !input.trim()}
                className="text-[#D97706] hover:text-[#F59E0B] disabled:text-[#333] transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bubble */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 sm:right-6 z-50 w-12 h-12 rounded-full bg-[#D97706] hover:bg-[#F59E0B] text-[#1A1A1A] flex items-center justify-center shadow-lg shadow-black/30 transition-all hover:scale-105"
      >
        {open ? (
          <X className="w-5 h-5" />
        ) : (
          <MessageSquare className="w-5 h-5" />
        )}
      </button>
    </>
  );
}
