'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send, RotateCcw, Mail } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import ReactMarkdown, { type Components } from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const STORAGE_KEY = 'baski-chat-messages';
const LEAD_ID_KEY = 'baski-lead-id';
const LEAD_EMAIL_KEY = 'baski-lead-email';
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

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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

function getStoredLeadId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(LEAD_ID_KEY);
  } catch {
    return null;
  }
}

function getStoredEmail(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(LEAD_EMAIL_KEY);
  } catch {
    return null;
  }
}

export function ChatBubble() {
  const { lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const greeting = lang === 'ka'
    ? 'გამარჯობა! მე ვარ Baski, Irakli-ს AI ასისტენტი. რა გაინტერესებთ მის შესახებ?'
    : "Hey! I'm Baski, Irakli's AI assistant. Ask me anything about his work, projects, or expertise.";

  const emailPrompt = lang === 'ka'
    ? 'სანამ დავიწყებთ, გთხოვთ შეიყვანოთ თქვენი ელ.ფოსტა:'
    : 'Before we start, please enter your email:';

  const emailPlaceholder = lang === 'ka'
    ? 'თქვენი ელ.ფოსტა...'
    : 'your@email.com';

  // Load persisted session on mount
  useEffect(() => {
    setLeadId(getStoredLeadId());
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
    if (open) {
      if (leadId) {
        inputRef.current?.focus();
      } else {
        emailInputRef.current?.focus();
      }
    }
  }, [open, leadId]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setInput('');
    localStorage.removeItem(STORAGE_KEY);
    // Keep leadId — don't re-ask for email
  }, []);

  const fullReset = useCallback(() => {
    setMessages([]);
    setInput('');
    setLeadId(null);
    setEmailInput('');
    setEmailError('');
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEAD_ID_KEY);
    localStorage.removeItem(LEAD_EMAIL_KEY);
  }, []);

  const submitEmail = async () => {
    const email = emailInput.trim().toLowerCase();

    if (!email) {
      setEmailError(lang === 'ka' ? 'გთხოვთ შეიყვანოთ ელ.ფოსტა.' : 'Please enter your email.');
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setEmailError(lang === 'ka' ? 'გთხოვთ შეიყვანოთ ვალიდური ელ.ფოსტა.' : 'Please enter a valid email address.');
      return;
    }

    setEmailError('');
    setEmailSubmitting(true);

    try {
      const res = await fetch('/api/chat/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setEmailError(data.error || 'Something went wrong.');
        return;
      }

      const data = await res.json();
      const newLeadId = data.lead_id;

      // Persist session
      localStorage.setItem(LEAD_ID_KEY, newLeadId);
      localStorage.setItem(LEAD_EMAIL_KEY, email);
      setLeadId(newLeadId);

      // If returning user, load any existing messages from localStorage
      // Otherwise start fresh
      if (!data.returning) {
        setMessages([]);
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      setEmailError(lang === 'ka' ? 'კავშირის შეცდომა. სცადეთ თავიდან.' : 'Connection error. Please try again.');
    } finally {
      setEmailSubmitting(false);
    }
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitEmail();
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || streaming || !leadId) return;

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
        body: JSON.stringify({ messages: newMessages, lead_id: leadId }),
      });

      if (!res.ok) {
        let errorMsg = 'something went wrong. try again.';
        if (res.status === 429) {
          errorMsg = 'slow down a bit! try again in a moment.';
        } else if (res.status === 401) {
          // Session expired — force re-registration
          fullReset();
          return;
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
  const storedEmail = getStoredEmail();

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
              {leadId && storedEmail && (
                <span className="text-[10px] text-[#737373] truncate max-w-[120px]" title={storedEmail}>
                  ({storedEmail})
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {leadId && messages.length > 0 && !streaming && (
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

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[300px] max-h-[380px]">
            {/* Greeting always shown */}
            <div>
              <span className="text-[#D97706]">{'> '}</span>
              <span className="text-[#A3A3A3]">{greeting}</span>
            </div>

            {/* Email gate (shown when no lead_id) */}
            {!leadId && (
              <div>
                <span className="text-[#D97706]">{'> '}</span>
                <span className="text-[#A3A3A3]">{emailPrompt}</span>
              </div>
            )}

            {/* Chat messages (only shown when authenticated) */}
            {leadId && messages.map((msg, i) => (
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

          {/* Input area */}
          <div className="border-t border-[#333] p-2">
            {!leadId ? (
              /* Email input */
              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-[#252525] rounded px-2 py-1.5 border border-[#333] focus-within:border-[#D97706] transition-colors">
                  <Mail className="w-3.5 h-3.5 text-[#D97706] flex-shrink-0" />
                  <input
                    ref={emailInputRef}
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setEmailError('');
                    }}
                    onKeyDown={handleEmailKeyDown}
                    placeholder={emailPlaceholder}
                    className="flex-1 bg-transparent text-[#E5E5E5] placeholder:text-[#737373] outline-none"
                    disabled={emailSubmitting}
                    autoComplete="email"
                  />
                  <button
                    onClick={submitEmail}
                    disabled={emailSubmitting || !emailInput.trim()}
                    className="text-[#D97706] hover:text-[#F59E0B] disabled:text-[#333] transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                {emailError && (
                  <p className="text-[#EF4444] text-[11px] px-1">{emailError}</p>
                )}
                {emailSubmitting && (
                  <p className="text-[#A3A3A3] text-[11px] px-1 animate-pulse">
                    {lang === 'ka' ? 'მიმდინარეობს...' : 'Connecting...'}
                  </p>
                )}
              </div>
            ) : (
              /* Chat input */
              <div className="flex items-center gap-2 bg-[#252525] rounded px-2 py-1.5 border border-[#333] focus-within:border-[#D97706] transition-colors">
                <span className="text-[#D97706]">{'>'}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={lang === 'ka' ? 'დასვით კითხვა...' : 'Ask about Irakli...'}
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
            )}
          </div>
        </div>
      )}

      {/* Floating Bubble */}
      <button
        data-chat-toggle
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
