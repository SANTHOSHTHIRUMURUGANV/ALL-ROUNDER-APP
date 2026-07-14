import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { 
  Bot, X, Send, Mic, MicOff, Sparkles, Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  actions?: { label: string; onClick: () => void }[];
}

export const AIChatbot: React.FC = () => {
  const { 
    language, setRole, addToCart, addBooking, 
    addNotification 
  } = useApp();
  
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', text: t('chatbotIntro'), timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Speech Recognition hook
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        addNotification('Voice Recognition Active 🎙', 'Speak your instruction now.', 'info');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSend(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        const mocks = [
          "book a verified painter",
          "order loaded pizza",
          "switch to partner portal",
          "show me admin bookings"
        ];
        const text = mocks[Math.floor(Math.random() * mocks.length)];
        setInputText(text);
        handleSend(text);
      }, 2500);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const parseIntent = (text: string) => {
    const query = text.toLowerCase();
    
    if (query.includes('painter') || query.includes('painting') || query.includes('நிறம்') || query.includes('रंग')) {
      return {
        reply: "I found a top-rated Painter, Suresh Ramachandran (8 Yrs Exp), nearby in Velachery. Booking consultation charge is ₹350. Confirm now?",
        actions: [
          {
            label: "Book Painter 🏠",
            onClick: () => {
              const bId = addBooking({
                category: 'Painter',
                categoryIcon: '🏠',
                title: 'Domestic Wall Painting',
                providerName: 'Suresh Ramachandran',
                providerPhone: '+91 98765 11111',
                price: 350,
                status: 'accepted'
              });
              confetti();
              addNotification('Painter Assigned 🎨', `Provider Suresh Ramachandran is on the way. ID: ${bId}`, 'success');
              setRole('customer');
            }
          }
        ]
      };
    }

    if (query.includes('pizza') || query.includes('food') || query.includes('உணவு') || query.includes('खाना')) {
      return {
        reply: "Would you like to order our customer favorite 'Cheese Loaded Pizza' from Saravana Bhavan (₹299)?",
        actions: [
          {
            label: "Add to Cart 🍕",
            onClick: () => {
              addToCart({
                id: 'food-pizza',
                name: 'Cheese Loaded Pizza',
                price: 299,
                quantity: 1,
                category: 'Food Delivery'
              });
              setRole('customer');
            }
          }
        ]
      };
    }

    if (query.includes('admin') || query.includes('dashboard')) {
      return {
        reply: "Rerouting you to the **Super Admin Console**.",
        actions: [
          {
            label: "Open Admin Panel 🛡️",
            onClick: () => setRole('admin')
          }
        ]
      };
    }

    if (query.includes('partner') || query.includes('register') || query.includes('work')) {
      return {
        reply: "Opening the **Partner Application Portal** where you can onboard or check jobs.",
        actions: [
          {
            label: "Open Partner Portal 💼",
            onClick: () => setRole('partner')
          }
        ]
      };
    }

    return {
      reply: "I am AllCounter AI. Try asking: 'book a painter', 'order pizza', or 'open partner portal'!"
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const intent = parseIntent(text);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: intent.reply,
        actions: intent.actions,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    }, 700);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* expanded chatbot frame */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 rounded-3xl glass-premium border border-white/10 shadow-2xl flex flex-col overflow-hidden glow-pink-hover animate-in slide-in-from-bottom duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-accent to-fuchsia-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur">
                <Bot className="h-5 w-5 text-white animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-black flex items-center gap-1.5 uppercase tracking-wider">
                  AI Assistant
                  <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-bounce shrink-0" />
                </h4>
                <p className="text-[9px] text-white/70 font-semibold uppercase tracking-widest">AllCounter NLP Engine</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages block */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[300px] min-h-[250px] bg-slate-950/20">
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-900 border border-white/5 text-slate-100 rounded-bl-none shadow-inner'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {msg.actions.map((act, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          act.onClick();
                          setIsOpen(false);
                        }}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-xl btn-pink-gradient text-[10px] uppercase font-black tracking-wide"
                      >
                        <Zap className="h-3 w-3" />
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}
                <span className="text-[8px] text-slate-500 mt-1 px-1">
                  {msg.timestamp.toTimeString().substring(0, 5)}
                </span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick recommendations */}
          <div className="px-4 py-2 bg-slate-950/40 border-t border-white/5 flex items-center space-x-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
            {[
              { label: "Consult Painter 🎨", text: "Verified painter profile" },
              { label: "Order Pizza 🍕", text: "Order Cheese Pizza" },
              { label: "Admin Access 🛡️", text: "Go to Admin Dashboard" },
              { label: "Partner App 💼", text: "Register as a partner" }
            ].map((pill, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(pill.text)}
                className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900 border border-white/5 text-slate-300 hover:border-pink-500 hover:text-pink-400 transition-all shrink-0"
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* User inputs */}
          <div className="p-3 border-t border-white/5 bg-slate-900 flex items-center space-x-2">
            <button
              onClick={toggleListening}
              className={`p-2 rounded-xl border transition-all ${
                isListening
                  ? 'bg-red-500 border-red-500 text-white animate-pulse'
                  : 'bg-slate-950 border-white/5 text-slate-400 hover:text-white'
              }`}
              title="Speak instruction"
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? t('voiceSearch') : t('searchPlaceholder')}
              className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-3 py-2 text-xs outline-none focus:border-pink-500 text-white"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 rounded-xl btn-pink-gradient shadow-md shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

        </div>
      )}

      {/* Floating button trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-gradient-to-tr from-accent to-fuchsia-600 text-white shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-50 hover:shadow-pink-500/30 relative border border-white/10 group cursor-pointer"
      >
        <Bot className="h-7 w-7 text-white" />
        <Sparkles className="absolute top-1 right-1 h-3.5 w-3.5 text-yellow-300 group-hover:animate-spin" />
        <span className="absolute -top-1 -left-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
        </span>
      </button>

    </div>
  );
};
