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

  // Sizing mapping
  const width = isSm ? 38 : isLg ? 88 : 64;
  const height = isSm ? 38 : isLg ? 110 : 80;

  if (mode === 'head') {
    return (
      <div className="relative flex items-center justify-center select-none shrink-0 group">
        <svg 
          width={width} 
          height={width} 
          viewBox="15 35 170 110" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
        >
          <defs>
            <radialGradient id="headGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </radialGradient>
            <radialGradient id="faceGrad" cx="45%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="85%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </radialGradient>
            <radialGradient id="redNoseGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="65%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#991b1b" />
            </radialGradient>
            <radialGradient id="bellGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="65%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#a16207" />
            </radialGradient>
            <linearGradient id="propellerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* 3D Take-copter */}
          <g>
            {/* Shaft base suction cup */}
            <path d="M 94,48 Q 100,51 106,48 Z" fill="#d97706" stroke="#0f172a" strokeWidth="1" />
            {/* Shaft */}
            <rect x="98.5" y="32" width="3" height="16" rx="1.5" fill="url(#bellGrad)" stroke="#0f172a" strokeWidth="1" />
            {/* Tilted Spinning Blade */}
            <g style={{ transform: 'rotateX(72deg)', transformOrigin: '100px 30px' }}>
              <g className={isSpinning ? "animate-[spin_0.2s_linear_infinite]" : ""} style={{ transformOrigin: '100px 30px' }}>
                <ellipse cx="100" cy="30" rx="46" ry="7.5" fill="url(#propellerGrad)" stroke="#475569" strokeWidth="0.75" />
                <circle cx="100" cy="30" r="4.5" fill="#facc15" stroke="#0f172a" strokeWidth="0.75" />
              </g>
            </g>
          </g>

          {/* Head Dome */}
          <circle cx="100" cy="92" r="48" fill="url(#headGrad)" stroke="#0f172a" strokeWidth="1.5" />

          {/* Face Panel */}
          <path 
            d="M 60,94 C 60,65 140,65 140,94 C 140,119 60,119 60,94 Z" 
            fill="url(#faceGrad)" 
            stroke="#0f172a" 
            strokeWidth="1.25" 
          />

          {/* Left Eye */}
          <ellipse cx="88" cy="74" rx="11" ry="15" fill="white" stroke="#0f172a" strokeWidth="1.5" />
          <ellipse cx="92.5" cy="78" rx="4.5" ry="7.5" fill="#0f172a" />
          <circle cx="91.5" cy="75" r="1.5" fill="white" />

          {/* Right Eye: Winking */}
          <ellipse cx="112" cy="74" rx="11" ry="15" fill="white" stroke="#0f172a" strokeWidth="1.5" />
          <path d="M 104,74 Q 112,68 120,74" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Nose */}
          <circle cx="100" cy="90" r="8" fill="url(#redNoseGrad)" stroke="#0f172a" strokeWidth="1.5" />
          <circle cx="97.5" cy="87.5" r="2.2" fill="white" />

          {/* Whiskers */}
          {!isSm && (
            <>
              {/* Left whiskers */}
              <line x1="82" y1="96" x2="60" y2="92" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="82" y1="102" x2="57" y2="102" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="82" y1="108" x2="60" y2="112" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
              {/* Right whiskers */}
              <line x1="118" y1="96" x2="140" y2="92" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="118" y1="102" x2="143" y2="102" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="118" y1="108" x2="140" y2="112" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            </>
          )}

          {/* Nose-to-Mouth divider */}
          <line x1="100" y1="98" x2="100" y2="108" stroke="#0f172a" strokeWidth="1.5" />

          {/* Mouth (Happy Smile) */}
          <path d="M 72,108 C 72,136 128,136 128,108 Z" fill="#b91c1c" stroke="#0f172a" strokeWidth="1.5" />
          {/* Tongue */}
          <path d="M 83,122 C 90,111 110,111 117,122 C 112,132 88,132 83,122 Z" fill="#f87171" />

          {/* Red Collar */}
          <path d="M 68,135 Q 100,140 132,135 C 132,135 128,140 100,140 Q 72,140 68,135" fill="#dc2626" stroke="#0f172a" strokeWidth="1.5" />

          {/* Bell */}
          <circle cx="100" cy="144" r="8.5" fill="url(#bellGrad)" stroke="#0f172a" strokeWidth="1.5" />
          <line x1="92" y1="141" x2="108" y2="141" stroke="#0f172a" strokeWidth="1.25" />
          <circle cx="100" cy="146.5" r="2.2" fill="#0f172a" />
          <line x1="100" y1="148.7" x2="100" y2="152.5" stroke="#0f172a" strokeWidth="1.25" />
        </svg>
      </div>
    );
  }

  // Renders the FULL-BODY flying winking Doraemon
  return (
    <div className="relative flex items-center justify-center select-none shrink-0 group hover:scale-105 transition-transform">
      <svg 
        width={width} 
        height={height} 
        viewBox="10 10 180 220" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_8px_20px_rgba(0,160,233,0.4)]"
      >
        <defs>
          <radialGradient id="headGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="60%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </radialGradient>
          <radialGradient id="faceGrad" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="85%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </radialGradient>
          <radialGradient id="redNoseGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="65%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </radialGradient>
          <radialGradient id="bellGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="65%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </radialGradient>
          <linearGradient id="propellerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {/* 3D Take-copter (Propeller) */}
        <g>
          {/* Suction base */}
          <path d="M 94,26 Q 100,29 106,26 Z" fill="#d97706" stroke="#0f172a" strokeWidth="1" />
          {/* Shaft */}
          <rect x="98.5" y="14" width="3" height="12" rx="1" fill="url(#bellGrad)" stroke="#0f172a" strokeWidth="1" />
          {/* Blade */}
          <g style={{ transform: 'rotateX(72deg)', transformOrigin: '100px 12px' }}>
            <g className={isSpinning ? "animate-[spin_0.2s_linear_infinite]" : ""} style={{ transformOrigin: '100px 12px' }}>
              <ellipse cx="100" cy="12" rx="48" ry="8" fill="url(#propellerGrad)" stroke="#475569" strokeWidth="0.75" />
              <circle cx="100" cy="12" r="4.5" fill="#facc15" stroke="#0f172a" strokeWidth="0.75" />
            </g>
          </g>
        </g>

        {/* Red Tail */}
        <circle cx="140" cy="170" r="9" fill="#dc2626" stroke="#0f172a" strokeWidth="1.5" />

        {/* Torso Body */}
        <path 
          d="M 74,124 L 70,182 Q 70,192 100,192 Q 130,192 130,182 L 126,124 Z" 
          fill="url(#headGrad)" 
          stroke="#0f172a" 
          strokeWidth="1.5" 
        />

        {/* White Belly Pouch */}
        <path 
          d="M 78,124 C 78,124 100,132 122,124 C 124,158 76,158 78,124 Z" 
          fill="url(#faceGrad)" 
          stroke="#0f172a" 
          strokeWidth="1.5" 
        />
        {/* Half-Moon Pocket */}
          <path d="M 83,142 C 83,142 100,160 117,142 Z" fill="none" stroke="#0f172a" strokeWidth="1.5" />

        {/* Legs Divider Gap */}
        <path d="M 96,192 L 100,184 L 104,192 Z" fill="#0b1329" stroke="#0b1329" strokeWidth="1" />

        {/* White Feet */}
        <ellipse cx="80" cy="197" rx="18" ry="11" fill="white" stroke="#0f172a" strokeWidth="1.5" />
        <ellipse cx="120" cy="197" rx="18" ry="11" fill="white" stroke="#0f172a" strokeWidth="1.5" />

        {/* Waving Left Arm (Up) */}
        <path 
          d="M 74,136 L 50,116 Q 44,111 38,120 Q 32,128 42,136 L 68,154 Z" 
          fill="url(#headGrad)" 
          stroke="#0f172a" 
          strokeWidth="1.5" 
        />
        {/* Left Hand */}
        <circle cx="42" cy="120" r="9.5" fill="white" stroke="#0f172a" strokeWidth="1.5" />

        {/* Right Arm (Down) */}
        <path 
          d="M 126,138 L 148,152 Q 155,156 160,148 Q 165,140 154,136 L 132,128 Z" 
          fill="url(#headGrad)" 
          stroke="#0f172a" 
          strokeWidth="1.5" 
        />
        {/* Right Hand */}
        <circle cx="155" cy="148" r="9.5" fill="white" stroke="#0f172a" strokeWidth="1.5" />

        {/* Head Dome */}
        <circle cx="100" cy="80" r="50" fill="url(#headGrad)" stroke="#0f172a" strokeWidth="1.5" />

        {/* Face Panel */}
        <path 
          d="M 58,82 C 58,52 142,52 142,82 C 142,108 58,108 58,82 Z" 
          fill="url(#faceGrad)" 
          stroke="#0f172a" 
          strokeWidth="1.25" 
        />

        {/* Left Eye */}
        <ellipse cx="88" cy="62" rx="11" ry="15" fill="white" stroke="#0f172a" strokeWidth="1.5" />
        <ellipse cx="92.5" cy="66" rx="4.5" ry="7.5" fill="#0f172a" />
        <circle cx="91.5" cy="63" r="1.5" fill="white" />

        {/* Right Eye: Winking */}
        <ellipse cx="112" cy="62" rx="11" ry="15" fill="white" stroke="#0f172a" strokeWidth="1.5" />
        <path d="M 104,62 Q 112,56 120,62" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Nose */}
        <circle cx="100" cy="78" r="8.5" fill="url(#redNoseGrad)" stroke="#0f172a" strokeWidth="1.5" />
        <circle cx="97.5" cy="75.5" r="2.5" fill="white" />

        {/* Whiskers */}
        {/* Left Whiskers */}
        <line x1="80" y1="84" x2="56" y2="78" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="80" y1="90" x2="53" y2="90" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="80" y1="96" x2="56" y2="102" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
        {/* Right Whiskers */}
        <line x1="120" y1="84" x2="144" y2="78" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="120" y1="90" x2="147" y2="90" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="120" y1="96" x2="144" y2="102" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />

        {/* Nose-to-Mouth divider */}
        <line x1="100" y1="86.5" x2="100" y2="96.5" stroke="#0f172a" strokeWidth="1.5" />

        {/* Mouth (Happy Smile) */}
        <path d="M 70,96 C 70,125 130,125 130,96 Z" fill="#b91c1c" stroke="#0f172a" strokeWidth="1.5" />
        {/* Tongue */}
        <path d="M 81,111 C 88,100 112,100 119,111 C 114,121 86,121 81,111 Z" fill="#f87171" />

        {/* Red Collar */}
        <path d="M 66,124 Q 100,130 134,124 C 134,124 130,129 100,129 Q 70,129 66,124" fill="#dc2626" stroke="#0f172a" strokeWidth="1.5" />

        {/* Bell */}
        <circle cx="100" cy="133" r="9" fill="url(#bellGrad)" stroke="#0f172a" strokeWidth="1.5" />
        <line x1="91" y1="130" x2="109" y2="130" stroke="#0f172a" strokeWidth="1.25" />
        <circle cx="100" cy="135.5" r="2.2" fill="#0f172a" />
        <line x1="100" y1="137.7" x2="100" y2="141.5" stroke="#0f172a" strokeWidth="1.25" />
      </svg>
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
