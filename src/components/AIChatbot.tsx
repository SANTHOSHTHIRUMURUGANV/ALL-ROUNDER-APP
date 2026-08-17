import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { 
  Bot, X, Send, Mic, MicOff, Sparkles, Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

const DoraemonAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg'; isSpinning?: boolean; mode?: 'head' | 'full' }> = ({ 
  size = 'md', 
  isSpinning = true,
  mode = 'head'
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  if (mode === 'head') {
    const headSize = isSm ? 'h-9 w-9' : isLg ? 'h-20 w-20' : 'h-14 w-14';
    const shaftHeight = isSm ? 'h-2' : isLg ? 'h-4.5' : 'h-3.5';
    const propellerSize = isSm ? 32 : isLg ? 76 : 52;

    return (
      <div className="relative flex flex-col items-center select-none shrink-0 group">
        <div className="absolute -top-7 flex flex-col items-center z-20">
          <div
            className="relative flex items-center justify-center rounded-full border border-slate-300/80 bg-[radial-gradient(circle_at_center,#fff_10%,#e5e7eb_55%,#b7c2cd_100%)] shadow-[0_8px_16px_rgba(0,0,0,0.18)]"
            style={{
              width: propellerSize,
              height: propellerSize,
              transform: 'rotateX(68deg) rotateY(12deg)',
              transformStyle: 'preserve-3d',
              perspective: '200px',
            }}
          >
            <div
              className={`absolute inset-0 rounded-full ${isSpinning ? 'animate-[spin_0.5s_linear_infinite]' : ''}`}
              style={{
                background: 'conic-gradient(from 0deg, rgba(255,255,255,0.9) 0deg, rgba(148,163,184,0.25) 55deg, rgba(255,255,255,0.8) 180deg, rgba(148,163,184,0.3) 290deg, rgba(255,255,255,0.9) 360deg)',
              }}
            />
            {[0, 90, 180, 270].map((angle) => (
              <span
                key={angle}
                className="absolute left-1/2 top-1/2 h-[55%] w-[18%] rounded-full bg-[linear-gradient(180deg,#ffffff_0%,#dfe7ee_100%)] shadow-[inset_0_2px_4px_rgba(148,163,184,0.5)] border border-slate-300/70"
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-10px)`,
                  transformOrigin: 'center center',
                }}
              />
            ))}
            <div className="absolute h-3 w-3 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fef9c3_0%,#facc15_45%,#b45309_100%)] border border-yellow-355 shadow-[0_2px_6px_rgba(0,0,0,0.2)]" />
          </div>

          <div className={`w-[2.5px] bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-600 shadow-sm ${shaftHeight}`} />
          <div className="h-1 w-2.5 rounded-full bg-yellow-600 mt-[-1px] border border-black/10 shadow-sm" />
        </div>

        <div className={`relative rounded-[44%] bg-[radial-gradient(circle_at_35%_35%,#00b8ff_0%,#1ba4de_52%,#005d8e_100%)] border border-black/20 flex items-center justify-center overflow-hidden shadow-[0_14px_22px_rgba(0,0,0,0.24),inset_0_-10px_12px_rgba(0,0,0,0.18)] ${headSize}`}>
          <div className="absolute bottom-[2%] w-[88%] h-[82%] rounded-[45%] bg-[radial-gradient(circle_at_40%_30%,#ffffff_60%,#eef3f8_90%,#dfe6ef_100%)] border border-black/5 flex flex-col items-center pt-[6%] shadow-[inset_0_-3px_5px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.15)]">
            <div className="flex gap-[0.5px] justify-center z-15">
              <div className="h-4.5 w-3.5 bg-white border border-slate-400 rounded-full flex items-center justify-center relative shadow-[0_0.5px_1px_rgba(0,0,0,0.1)]">
                <div className="h-2 w-1.5 bg-slate-900 rounded-full absolute bottom-1 left-[3px] flex items-center justify-center">
                  <div className="h-0.5 w-0.5 bg-white rounded-full absolute top-[1px]" />
                </div>
              </div>
              <div className="h-4.5 w-3.5 bg-white border border-slate-400 rounded-full flex items-center justify-center relative shadow-[0_0.5px_1px_rgba(0,0,0,0.1)]">
                <svg className="w-full h-full absolute inset-0 text-slate-800" viewBox="0 0 14 18" fill="none">
                  <path d="M2.5 9.5C3.5 7.5 7.5 7.5 8.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            <div className="h-3 w-3 rounded-full bg-[radial-gradient(circle_at_35%_35%,#ff4d4d_0%,#e60012_70%,#80000a_100%)] mt-[-2px] z-20 shadow-md relative flex items-center justify-center">
              <div className="absolute top-[1.5px] left-[1.5px] h-[2.5px] w-[2.5px] rounded-full bg-white/90" />
            </div>

            {!isSm && (
              <>
                <div className="absolute top-[52%] left-1.5 w-3.5 h-[1px] bg-slate-900/60 rotate-12 rounded" />
                <div className="absolute top-[58%] left-1 w-4 h-[1px] bg-slate-900/60 rounded" />
                <div className="absolute top-[64%] left-1.5 w-3.5 h-[1px] bg-slate-900/60 -rotate-12 rounded" />

                <div className="absolute top-[52%] right-1.5 w-3.5 h-[1px] bg-slate-900/60 -rotate-12 rounded" />
                <div className="absolute top-[58%] right-1 w-4 h-[1px] bg-slate-900/60 rounded" />
                <div className="absolute top-[64%] right-1.5 w-3.5 h-[1px] bg-slate-900/60 rotate-12 rounded" />
              </>
            )}

            {!isSm ? (
              <div className="w-[28px] h-[16px] bg-[#990000] border border-black/10 rounded-b-full mt-[1px] relative overflow-hidden flex flex-col items-center shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.5)] z-10">
                <div className="absolute bottom-[-1px] w-[22px] h-[9px] bg-[radial-gradient(circle_at_50%_0%,#ff8080_0%,#e60012_90%)] rounded-full border-t border-red-300 shadow-sm" />
              </div>
            ) : (
              <div className="w-4 h-2 border-b-2 border-slate-700 rounded-b-full mt-[1px] z-10" />
            )}
          </div>

          <div className="absolute bottom-0 w-full h-[14%] bg-gradient-to-r from-red-600 to-[#e60012] flex items-center justify-center z-30 shadow-[inset_0_-1px_2px_rgba(0,0,0,0.3)]">
            <div className="h-3.5 w-3.5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff176_0%,#fbc02d_65%,#f57f17_100%)] border border-black/20 flex flex-col items-center justify-start pt-[1px] relative shadow-md">
              <div className="absolute top-[1px] left-[1px] h-[1px] w-[1px] bg-white rounded-full" />
              <div className="w-1.5 h-1 rounded-full bg-slate-900 flex items-center justify-center mt-[1px]">
                <div className="w-[1px] h-1.5 bg-slate-900 mt-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renders the FULL-BODY flying winking Doraemon
  return (
    <div className="relative flex flex-col items-center select-none shrink-0 group w-20 h-28 hover:scale-105 transition-transform">
      {/* 3D Take-Copter */}
      <div className="absolute top-0 flex flex-col items-center z-30">
        <div
          className="relative flex items-center justify-center rounded-full border border-slate-350 bg-[radial-gradient(ellipse_at_center,#ffffff_30%,#e2e8f0_90%)] shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
          style={{
            width: 48,
            height: 48,
            transform: 'rotateX(68deg) rotateY(12deg)',
            transformStyle: 'preserve-3d',
            perspective: '200px',
          }}
        >
          <div
            className={`absolute inset-0 rounded-full ${isSpinning ? 'animate-[spin_0.5s_linear_infinite]' : ''}`}
            style={{
              background: 'conic-gradient(from 0deg, rgba(255,255,255,0.9) 0deg, rgba(148,163,184,0.25) 55deg, rgba(255,255,255,0.8) 180deg, rgba(148,163,184,0.3) 290deg, rgba(255,255,255,0.9) 360deg)',
            }}
          />
          {[0, 90, 180, 270].map((angle) => (
            <span
              key={angle}
              className="absolute left-1/2 top-1/2 h-[55%] w-[18%] rounded-full bg-[linear-gradient(180deg,#ffffff_0%,#dfe7ee_100%)] shadow-[inset_0_2px_4px_rgba(148,163,184,0.5)] border border-slate-300/70"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-10px)`,
                transformOrigin: 'center center',
              }}
            />
          ))}
          <div className="absolute h-3 w-3 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fef9c3_0%,#facc15_45%,#b45309_100%)] border border-yellow-300" />
        </div>

        <div className="w-[2.5px] h-4.5 bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-600 shadow-sm" />
        <div className="h-1 w-2.5 rounded-full bg-yellow-600 mt-[-1px] border border-black/10 shadow-sm" />
      </div>

      {/* Head */}
      <div className="absolute top-4 w-16 h-16 rounded-[44%] bg-[radial-gradient(circle_at_35%_35%,#00b8ff_0%,#1ba4de_52%,#005d8e_100%)] border border-black/20 flex items-center justify-center overflow-hidden shadow-[0_4px_8px_rgba(0,0,0,0.2),inset_0_-4px_6px_rgba(0,0,0,0.18)] z-20">
        <div className="absolute bottom-[2%] w-[88%] h-[82%] rounded-[45%] bg-[radial-gradient(circle_at_40%_30%,#ffffff_60%,#eef3f8_90%,#dfe6ef_100%)] border border-black/5 flex flex-col items-center pt-[6%] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.15)]">
          <div className="flex gap-[0.5px] justify-center z-15">
            <div className="h-4.5 w-3.5 bg-white border border-slate-400 rounded-full flex items-center justify-center relative">
              <div className="h-2 w-1.5 bg-slate-900 rounded-full absolute bottom-1 left-[3px] flex items-center justify-center">
                <div className="h-0.5 w-0.5 bg-white rounded-full absolute top-[1px]" />
              </div>
            </div>
            <div className="h-4.5 w-3.5 bg-white border border-slate-400 rounded-full flex items-center justify-center relative shadow-[0_0.5px_1px_rgba(0,0,0,0.1)]">
              <svg className="w-full h-full absolute inset-0 text-slate-800" viewBox="0 0 14 18" fill="none">
                <path d="M2.5 9.5C3.5 7.5 7.5 7.5 8.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="h-3 w-3 rounded-full bg-[radial-gradient(circle_at_35%_35%,#ff4d4d_0%,#e60012_70%,#80000a_100%)] mt-[-2px] z-20 shadow-md relative flex items-center justify-center">
            <div className="absolute top-[1.5px] left-[1.5px] h-[2.5px] w-[2.5px] rounded-full bg-white/90" />
          </div>
          <div className="absolute top-[52%] left-1.5 w-3.5 h-[1px] bg-slate-900/60 rotate-12 rounded" />
          <div className="absolute top-[58%] left-1 w-4 h-[1px] bg-slate-900/60 rounded" />
          <div className="absolute top-[64%] left-1.5 w-3.5 h-[1px] bg-slate-900/60 -rotate-12 rounded" />

          <div className="absolute top-[52%] right-1.5 w-3.5 h-[1px] bg-slate-900/60 -rotate-12 rounded" />
          <div className="absolute top-[58%] right-1 w-4 h-[1px] bg-slate-900/60 rounded" />
          <div className="absolute top-[64%] right-1.5 w-3.5 h-[1px] bg-slate-900/60 rotate-12 rounded" />

          {!isSm ? (
            <div className="w-[28px] h-[16px] bg-[#990000] border border-black/10 rounded-b-full mt-[1px] relative overflow-hidden flex flex-col items-center shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.5)] z-10">
              <div className="absolute bottom-[-1px] w-[22px] h-[9px] bg-[radial-gradient(circle_at_50%_0%,#ff8080_0%,#e60012_90%)] rounded-full border-t border-red-300 shadow-sm" />
            </div>
          ) : (
            <div className="w-4 h-2 border-b-2 border-slate-700 rounded-b-full mt-[1px] z-10" />
          )}
        </div>

        <div className="absolute bottom-0 w-full h-[14%] bg-gradient-to-r from-red-600 to-[#e60012] flex items-center justify-center z-30 shadow-[inset_0_-1px_2px_rgba(0,0,0,0.3)]">
          <div className="h-3.5 w-3.5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff176_0%,#fbc02d_65%,#f57f17_100%)] border border-black/20 flex flex-col items-center justify-start pt-[1px] relative shadow-md">
            <div className="absolute top-[1px] left-[1px] h-[1px] w-[1px] bg-white rounded-full" />
            <div className="w-1.5 h-1 rounded-full bg-slate-900 flex items-center justify-center mt-[1px]">
              <div className="w-[1px] h-1.5 bg-slate-900 mt-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Waving Left Arm */}
      <div className="absolute left-[-4px] top-[74px] w-4.5 h-7 rounded-full bg-[#009fe3] border border-black/15 shadow-sm -rotate-45 origin-bottom z-15 flex items-start justify-center">
        <div className="w-4.5 h-4.5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#ffffff_60%,#e2e8f0_100%)] border border-slate-300 shadow-md absolute -top-2.5" />
      </div>

      {/* Torso Body */}
      <div className="absolute top-[72px] w-12 h-12 rounded-full bg-[radial-gradient(circle_at_35%_35%,#00b8ff_0%,#009fe3_60%,#005d8e_100%)] border border-black/20 flex items-center justify-center z-10 shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
        <div className="absolute bottom-[3px] w-[75%] h-[68%] rounded-full bg-white flex flex-col items-center justify-center border border-black/5 shadow-inner">
          <div className="w-[24px] h-[12px] border-b border-l border-r border-slate-400 rounded-b-full mt-2" />
        </div>
      </div>

      {/* Right Arm */}
      <div className="absolute right-[-4px] top-[78px] w-4.5 h-7 rounded-full bg-[#009fe3] border border-black/15 shadow-sm rotate-[35deg] origin-top z-15 flex items-end justify-center">
        <div className="w-4.5 h-4.5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#ffffff_60%,#e2e8f0_100%)] border border-slate-300 shadow-md absolute -bottom-2.5" />
      </div>

      {/* Tail */}
      <div className="absolute bottom-8 right-2 w-4 h-4 rounded-full bg-[#e60012] border border-black/10 shadow-sm z-5 animate-pulse" />

      {/* Feet */}
      <div className="absolute bottom-2.5 flex gap-[1px] justify-center w-full z-15">
        <div className="w-6 h-5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#ffffff_60%,#e2e8f0_100%)] border border-slate-300 shadow-md" />
        <div className="w-6 h-5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#ffffff_60%,#e2e8f0_100%)] border border-slate-300 shadow-md" />
      </div>
    </div>
  );
};

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
    { id: '1', sender: 'bot', text: "Hello! I am Doraemon, your Take-Copter enabled AI Assistant! 🚁 How can I help you today?", timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    
    // 1. Painter
    if (query.includes('painter') || query.includes('painting') || query.includes('நிறம்') || query.includes('रंग')) {
      return {
        reply: "I found our top-rated Painter, Suresh Ramachandran (8 Yrs Exp, 94% repeat clients), nearby in Velachery. Estimated consultation visit charge is ₹350. Confirm now?",
        actions: [
          {
            label: "Book Painter 🎨",
            onClick: () => {
              const bId = addBooking({
                category: 'Painter',
                categoryIcon: '🎨',
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

    // 2. AC not cooling / AC service
    if (query.includes('ac') || query.includes('cooling') || query.includes('cool') || query.includes('குளிர்ச்சி') || query.includes('ठंडा')) {
      return {
        reply: "It looks like your AC filter is blocked or coolant is low. I recommend booking our AC Technician Rajesh Kumar (₹199 service visit charge). Confirm slot?",
        actions: [
          {
            label: "Book AC Repair ❄️",
            onClick: () => {
              const bId = addBooking({
                category: 'AC Service',
                categoryIcon: '❄️',
                title: 'AC Condenser Cleaning & Topup',
                providerName: 'Rajesh Kumar',
                providerPhone: '+91 98765 22222',
                price: 199,
                status: 'accepted'
              });
              confetti();
              addNotification('AC Repair Assigned ❄️', `AC Specialist Rajesh Kumar is starting now. ID: ${bId}`, 'success');
              setRole('customer');
            }
          }
        ]
      };
    }

    // 3. Cheapest Electrician
    if (query.includes('electrician') || query.includes('cheap') || query.includes('மலிவான') || query.includes('सस्ता')) {
      if (query.includes('electrician') || query.includes('wire') || query.includes('மின்சார')) {
        return {
          reply: "The cheapest electrician nearby is Rajesh Kumar (₹199/visit charge, 1.2 km away). Confirm booking?",
          actions: [
            {
              label: "Book Rajesh (Electrician) ⚡",
              onClick: () => {
                const bId = addBooking({
                  category: 'Electrician',
                  categoryIcon: '⚡',
                  title: 'Home Wiring Service',
                  providerName: 'Rajesh Kumar',
                  providerPhone: '+91 98765 22222',
                  price: 199,
                  status: 'accepted'
                });
                confetti();
                addNotification('Electrician Assigned ⚡', `Rajesh Kumar is dispatched. ID: ${bId}`, 'success');
                setRole('customer');
              }
            }
          ]
        };
      }
    }

    // 4. Female beautician
    if (query.includes('beautician') || query.includes('female') || query.includes('பெண்') || query.includes('महिला')) {
      return {
        reply: "I found our certified female beautician, Anjali Sharma (6 Yrs Exp, Glow Beauty Studio), located 1.8 km away. Her fee is ₹499/visit. Schedule now?",
        actions: [
          {
            label: "Book Anjali (Beautician) 💇",
            onClick: () => {
              const bId = addBooking({
                category: 'Beautician',
                categoryIcon: '💇',
                title: 'Bridal Glow Facial Package',
                providerName: 'Anjali Sharma',
                providerPhone: '+91 98765 33333',
                price: 499,
                status: 'accepted'
              });
              confetti();
              addNotification('Beautician Booked 💇', `Anjali Sharma is scheduled. ID: ${bId}`, 'success');
              setRole('customer');
            }
          }
        ]
      };
    }

    // 5. Plumber
    if (query.includes('plumber') || query.includes('leak') || query.includes('குழாய்') || query.includes('नल')) {
      return {
        reply: "I found Plumber Rohan Verma (4 Yrs Exp, Tambaram Plumbers). His visit fee is ₹199. Book now?",
        actions: [
          {
            label: "Book Plumber 🚰",
            onClick: () => {
              const bId = addBooking({
                category: 'Plumber',
                categoryIcon: '🚰',
                title: 'Emergency Leakage Repair',
                providerName: 'Rohan Verma',
                providerPhone: '+91 98765 44444',
                price: 199,
                status: 'accepted'
              });
              confetti();
              addNotification('Plumber Assigned 🚰', `Rohan Verma is dispatched. ID: ${bId}`, 'success');
              setRole('customer');
            }
          }
        ]
      };
    }

    // 6. Food Delivery / Pizza
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

    // 7. General Admin Command
    if (query.includes('admin') || query.includes('dashboard') || query.includes('fraud') || query.includes('security')) {
      return {
        reply: "Rerouting you to the **Super Admin Console** to monitor KYC verifications and AI fraud logs.",
        actions: [
          {
            label: "Open Admin Panel 🛡️",
            onClick: () => setRole('admin')
          }
        ]
      };
    }

    // 8. General Partner Command
    if (query.includes('partner') || query.includes('register') || query.includes('work') || query.includes('merchant')) {
      return {
        reply: "Opening the **Partner Application Portal** to review earnings predictions, pricing suggestions, and onboarding registers.",
        actions: [
          {
            label: "Open Partner Portal 💼",
            onClick: () => setRole('partner')
          }
        ]
      };
    }

    return {
      reply: "I am Doraemon, your Take-Copter enabled AI Assistant! 🚁 Try asking: 'I need a painter tomorrow morning', 'My AC is not cooling', 'Find the cheapest electrician near me', or 'Find a female beautician'!"
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
        <div className="mb-4 w-80 sm:w-96 rounded-3xl glass-premium border border-white/10 shadow-2xl flex flex-col overflow-hidden glow-cyan-hover animate-in slide-in-from-bottom duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 flex items-center justify-center pt-2">
                <DoraemonAvatar size="sm" isSpinning={true} />
              </div>
              <div>
                <h4 className="text-xs font-black flex items-center gap-1.5 uppercase tracking-wider">
                  Doraemon (AI Assistant)
                  <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-bounce shrink-0" />
                </h4>
                <p className="text-[9px] text-white/70 font-semibold uppercase tracking-widest">Take-Copter Enabled</p>
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
                    ? 'bg-gradient-to-r from-cyan-400 to-indigo-500 text-white rounded-br-none shadow-md'
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
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-xl btn-cyan-gradient text-[10px] uppercase font-black tracking-wide"
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
                className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900 border border-white/5 text-slate-300 hover:border-cyan-400 hover:text-cyan-400 transition-all shrink-0"
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
              className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 rounded-xl btn-cyan-gradient shadow-md shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

        </div>
      )}

      {/* Floating button trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="transition-all hover:scale-110 active:scale-95 z-50 relative group cursor-pointer filter drop-shadow-[0_8px_16px_rgba(0,160,233,0.35)]"
      >
        <DoraemonAvatar mode="full" isSpinning={true} />
        <span className="absolute top-2 left-2 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
        </span>
      </button>

    </div>
  );
};
