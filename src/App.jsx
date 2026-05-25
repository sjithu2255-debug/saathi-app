import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  AlertTriangle, HeartHandshake, Wrench, FileText, 
  Bell, MapPin, User, ShieldAlert, 
  Clock, Star, ChevronRight, Activity, 
  Database, Server, Code, CheckCircle, Radio, 
  Navigation, Users, PhoneCall, Sparkles, Loader2,
  MessageSquare, Send, X, AlertOctagon, Award, Download,
  Phone, ArrowRight, ArrowLeft, Fingerprint, KeyRound, ScanLine,
  Paperclip, Image as ImageIcon, Wallet, TrendingUp, IndianRupee,
  Gift, Zap, ArrowDownToLine, ArrowUpRight
} from 'lucide-react';

// --- BRAND ---
const BRAND = {
  name: 'Saathi',
  tagline: 'Your community companion',
};

function SaathiLogo({ size = 32, showWordmark = false, variant = 'default' }) {
  // Stable ID per instance — avoid regenerating on every render
  const id = useMemo(() => `lg${Math.random().toString(36).slice(2, 7)}`, []);
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        <defs>
          <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id={`${id}-shield`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <linearGradient id={`${id}-heart`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill={`url(#${id}-grad)`} />
        <rect x="2" y="2" width="60" height="60" rx="12" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
        <path d="M 32 14 L 18 18 L 18 32 Q 18 42 32 50 L 32 14 Z" fill={`url(#${id}-shield)`} opacity="0.95" />
        <path d="M 32 22 Q 32 18 36 18 Q 44 18 44 26 Q 44 34 32 44 Q 32 32 32 22 Z" fill={`url(#${id}-heart)`} opacity="0.95" />
        <circle cx="32" cy="32" r="4" fill="white" />
        <circle cx="32" cy="32" r="2" fill="#1e293b" />
      </svg>
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className="font-bold text-xl tracking-tight text-slate-900">{BRAND.name}</span>
          {variant === 'full' && (
            <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">{BRAND.tagline}</span>
          )}
        </div>
      )}
    </div>
  );
}

// --- SHARED UTILITIES ---
const REGEX = {
  phone: /(\+?\d{1,3}[\s-]?)?(\(?\d{3,5}\)?[\s-]?)?\d{3,5}[\s-]?\d{4,6}/,
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  aadhaar: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,
  address: /\b(house no|flat no|street|road|lane|sector|nagar|colony|apartment)\b/i,
  indianMobile: /^[6-9]\d{9}$/,
};

// Generic modal shell — eliminates 5 copies of the same overlay JSX
function Modal({ children, onClose, maxWidth = 'max-w-md', zIndex = 'z-[200]' }) {
  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center ${zIndex} p-4 overflow-y-auto`}>
      <div className={`bg-white rounded-2xl shadow-2xl ${maxWidth} w-full max-h-[90vh] flex flex-col overflow-hidden my-8`}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ icon, title, subtitle, gradient = 'from-orange-600 to-emerald-600', onClose }) {
  return (
    <div className={`bg-gradient-to-r ${gradient} text-white p-4 flex items-center justify-between shrink-0`}>
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <h3 className="font-bold">{title}</h3>
          {subtitle && <p className="text-[11px] text-white/90">{subtitle}</p>}
        </div>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
          <X size={20} />
        </button>
      )}
    </div>
  );
}

// --- MOCK DATA ---
const MOCK_USER = {
  name: "Jithu Sreekumar",
  role: "Citizen",
  location: "Alappuzha, Kerala",
  bloodGroup: "A+",
  volunteerHours: 24,
};

const MOCK_CONTACTS = [
  { name: "Dad", phone: "+91 98765 43210" },
  { name: "Ramesh (Brother)", phone: "+91 98765 43211" }
];

const MOCK_ALERTS = [
  { id: 1, type: "Medical Emergency", distance: "0.5 km", time: "2 mins ago", status: "Active", severity: "high" },
  { id: 2, type: "Missing Person", distance: "2.1 km", time: "1 hour ago", status: "Active", severity: "medium" },
  { id: 3, type: "Water Logging", distance: "1.2 km", time: "3 hours ago", status: "Resolved", severity: "low" },
];

const MOCK_VOLUNTEER = [
  { id: 1, title: "Blood Donation Camp", org: "Red Cross Society", orgVerified: true, date: "Tomorrow, 10 AM", lat: 28.6139, lng: 77.2090, tags: ["Medical", "Urgent"], description: "Donate blood to save lives" },
  { id: 2, title: "Lake Cleanup Drive", org: "EcoWarriors", orgVerified: true, date: "Sunday, 7 AM", lat: 28.5355, lng: 77.3910, tags: ["Environment"], description: "Help clean local water body" },
  { id: 3, title: "Food Distribution", org: "Helping Hands NGO", orgVerified: true, date: "Today, 6 PM", lat: 28.7041, lng: 77.1025, tags: ["Community"], description: "Distribute meals to homeless" },
  { id: 4, title: "Tree Plantation", org: "Green India Foundation", orgVerified: true, date: "Saturday, 8 AM", lat: 11.0168, lng: 76.9558, tags: ["Environment"], description: "Plant native saplings" },
  { id: 5, title: "Coding for Kids", org: "TechForAll", orgVerified: true, date: "Next Week", lat: 12.9716, lng: 77.5946, tags: ["Education"], description: "Teach kids programming basics" },
];

const MOCK_SERVICES = [
  { id: 1, category: "Ambulance", name: "City Life Support", rating: 4.8, lat: 28.6139, lng: 77.2090, registeredAt: "Connaught Place", verified: true, available: true },
  { id: 2, category: "Electrician", name: "Ravi Electricals", rating: 4.5, lat: 28.6200, lng: 77.2100, registeredAt: "Karol Bagh", verified: true, available: true },
  { id: 3, category: "Plumber", name: "QuickFix Plumbing", rating: 4.2, lat: 28.5355, lng: 77.3910, registeredAt: "Noida Sector 18", verified: false, available: false },
  { id: 4, category: "Ambulance", name: "MediCare Express", rating: 4.7, lat: 11.0168, lng: 76.9558, registeredAt: "Coimbatore Central", verified: true, available: true },
  { id: 5, category: "Electrician", name: "PowerFix Solutions", rating: 4.3, lat: 12.9716, lng: 77.5946, registeredAt: "Bangalore HSR", verified: true, available: true },
  { id: 6, category: "Carpenter", name: "WoodCraft Studio", rating: 4.6, lat: 28.7041, lng: 77.1025, registeredAt: "North Delhi", verified: true, available: true },
];

const MOCK_SURVEYS = [
  { id: 1, title: "Ward 42 Road Quality Assessment", authority: "City Corporation", expires: "2 days left", responses: 450 },
  { id: 2, title: "Post-Monsoon Health Check", authority: "Health Dept", expires: "5 days left", responses: 1200 },
];

const MOCK_RESPONDERS = [
  { id: 'r1', name: 'Rahul S.', type: 'Volunteer', distance: '0.8 km', color: 'green' },
  { id: 'r2', name: 'City Hospital', type: 'Ambulance', distance: '2.5 km', color: 'blue' }
];

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'sos', title: 'SOS Alert Nearby', body: 'Medical emergency 0.5 km away. Tap to respond.', time: '2 mins ago', unread: true },
  { id: 2, type: 'volunteer', title: 'New Volunteer Match', body: 'Blood Donation Camp tomorrow matches your profile.', time: '1 hr ago', unread: true },
  { id: 3, type: 'survey', title: 'Survey Closing Soon', body: 'Ward 42 Road Quality Assessment expires in 2 days.', time: '3 hrs ago', unread: true },
  { id: 4, type: 'service', title: 'Service Booking Confirmed', body: 'Ravi Electricals confirmed your booking for tomorrow 10 AM.', time: 'Yesterday', unread: false },
  { id: 5, type: 'civic', title: 'Civic Impact Milestone', body: 'You have crossed 24 volunteer hours. Certificate available.', time: '2 days ago', unread: false },
];

const ROLE_DESCRIPTIONS = {
  Citizen: 'Access SOS, services, surveys, and volunteer opportunities.',
  Volunteer: 'Respond to SOS, onboard services, post surveys with approval.',
  NGO: 'Post volunteer drives, manage events, access analytics.',
  ServiceProvider: 'Manage your listing, availability, bookings, and reviews.',
  Admin: 'Full access: all NGO & Volunteer powers, plus city-wide moderation.'
};

const can = {
  postOpportunity: (role) => role === 'NGO' || role === 'Admin',
  onboardService: (role) => ['Volunteer', 'NGO', 'Admin'].includes(role),
  postSurvey: (role) => ['Volunteer', 'Admin'].includes(role),
  approveContent: (role) => role === 'Admin',
  manageOwnService: (role) => role === 'ServiceProvider',
  manageServices: (role) => role === 'Admin',
  moderateContent: (role) => role === 'Admin',
  respondToSOS: (role) => ['Volunteer', 'NGO', 'Admin'].includes(role),
  viewAnalytics: (role) => ['NGO', 'Admin'].includes(role),
  verifyOrgs: (role) => role === 'Admin',
};

// --- REWARDS & REVENUE MODEL ---
const PRICING = {
  serviceRegistration: 100,    // Shop owner pays ₹100 to be listed
  premiumBoost: 500,           // SP pays ₹500 to be featured in top of search
  ngoSubscription: 200,        // NGO pays ₹200/month to post opportunities
};

const COMMISSION_RATE = 0.10; // 10% to the referring/onboarding volunteer

// Micro-task rewards (no referral needed — direct payment for action)
const MICRO_REWARDS = {
  takeGovSurvey: 5,            // ₹5 for completing a verified govt survey
  takeExitPoll: 2,             // ₹2 for exit polls
  verifyLocation: 10,          // ₹10 for verifying a service location
  reportIncident: 5,           // ₹5 for a confirmed hyperlocal alert
  respondSOS: 50,              // ₹50 for confirmed SOS response
};

const PAYOUT_MIN = 100;        // ₹100 minimum withdrawal

// Calculate commission for a given action
const calculateCommission = (basePrice) => Math.round(basePrice * COMMISSION_RATE);

// Format INR currency
const formatINR = (amount) => `₹${amount.toLocaleString('en-IN')}`;

const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const formatDistance = (km) => {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
};

// --- AI INTEGRATION (Anthropic Claude API) ---
const generateAIContent = async (prompt) => {
  const RETRIES = 3;
  let delay = 1000;
  for (let i = 0; i < RETRIES; i++) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      const text = (data.content || [])
        .filter(item => item.type === "text")
        .map(item => item.text)
        .join("\n");
      return text || "No response generated.";
    } catch (error) {
      if (i === RETRIES - 1) throw new Error("Failed to connect to AI service.");
      await new Promise(res => setTimeout(res, delay));
      delay *= 2;
    }
  }
};

// Clipboard fallback for execCommand environments
const copyToClipboard = async (text) => {
  if (navigator.clipboard?.writeText) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) {}
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    return true;
  } catch (e) {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
};

// Render an SVG node to a high-DPI canvas — used for cert exports
const svgToCanvas = async (svgEl, width = 1000, height = 700, scale = 2) => {
  const svgData = new XMLSerializer().serializeToString(svgEl);
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
};

// Trigger a blob download
const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

// --- MAIN APP ---
export default function SaathiApp() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authedUser, setAuthedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [liveLocation, setLiveLocation] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [userRole, setUserRole] = useState(MOCK_USER.role);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [showCertificate, setShowCertificate] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle');
  const [resolvedLocation, setResolvedLocation] = useState(MOCK_USER.location);
  const [locationError, setLocationError] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Wallet — lifted to root so all modules can credit/debit
  const [walletBalance, setWalletBalance] = useState(245); // demo starting balance
  const [walletTxns, setWalletTxns] = useState([
    { id: 1, type: 'credit', source: 'commission', amount: 10, description: 'Onboarded Mullakkal Stores', date: '2 days ago' },
    { id: 2, type: 'credit', source: 'micro', amount: 5, description: 'Completed Govt Health Survey', date: '3 days ago' },
    { id: 3, type: 'credit', source: 'micro', amount: 50, description: 'SOS Response - Medical Emergency', date: '5 days ago' },
    { id: 4, type: 'credit', source: 'commission', amount: 10, description: 'Onboarded QuickFix Plumbing', date: '1 week ago' },
    { id: 5, type: 'debit', source: 'payout', amount: 100, description: 'UPI Payout to *****1234', date: '2 weeks ago' },
    { id: 6, type: 'credit', source: 'micro', amount: 10, description: 'Verified service location', date: '3 weeks ago' },
  ]);
  const [showWallet, setShowWallet] = useState(false);

  const addWalletTxn = useCallback((txn) => {
    setWalletTxns(prev => [{ ...txn, id: Date.now(), date: 'just now' }, ...prev]);
    setWalletBalance(prev => txn.type === 'credit' ? prev + txn.amount : prev - txn.amount);
  }, []);

  // Quick credit helper for common cases
  const creditCommission = useCallback((basePrice, description) => {
    const amount = calculateCommission(basePrice);
    addWalletTxn({ type: 'credit', source: 'commission', amount, description });
    return amount;
  }, [addWalletTxn]);

  const creditMicro = useCallback((amount, description) => {
    addWalletTxn({ type: 'credit', source: 'micro', amount, description });
    return amount;
  }, [addWalletTxn]);

  // Earning toast — shows briefly when wallet is credited
  const [earningToast, setEarningToast] = useState(null);
  const showEarning = useCallback((amount, source = 'commission') => {
    setEarningToast({ amount, source });
  }, []);

  // Fetch live location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      setLocationError('Geolocation is not supported in this browser.');
      return;
    }

    // Detect iframe sandbox — common in preview environments
    const inIframe = window.self !== window.top;

    setLocationStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        setUserCoords(coords);
        setLocationStatus('granted');
        setLocationError('');
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&zoom=10`,
            { headers: { 'Accept-Language': 'en' } }
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || '';
            const state = addr.state || addr.region || '';
            const locName = [city, state].filter(Boolean).join(', ') || 'Unknown location';
            setResolvedLocation(locName);
          }
        } catch (e) {
          setResolvedLocation(`${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)}`);
        }
      },
      (error) => {
        let msg = 'Could not fetch your location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = inIframe
            ? 'Location blocked: this preview runs in a sandboxed iframe where geolocation is disabled. Open the app in a new tab, or set your location manually below.'
            : 'Permission denied. Allow location access in your browser settings, or set it manually.';
          setLocationStatus('denied');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Your device could not determine your position. Try again or set manually.';
          setLocationStatus('unavailable');
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Try again or set manually.';
          setLocationStatus('unavailable');
        } else {
          setLocationStatus('unavailable');
        }
        setLocationError(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const requestLocationAgain = useCallback(() => {
    setLocationStatus('requesting');
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLocationStatus('granted');
      },
      () => {
        setLocationStatus('denied');
        setShowLocationPicker(true);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const setManualLocation = useCallback((locName, lat, lng) => {
    setUserCoords({ lat, lng, accuracy: 0 });
    setResolvedLocation(locName);
    setLocationStatus('manual');
    setLocationError('');
    setShowLocationPicker(false);
  }, []);

  // SOS GPS tracking
  useEffect(() => {
    let interval;
    if (isSOSActive) {
      let currentLat = userCoords?.lat ?? 11.0168;
      let currentLng = userCoords?.lng ?? 76.9558;
      setLiveLocation({ lat: currentLat.toFixed(5), lng: currentLng.toFixed(5) });
      interval = setInterval(() => {
        currentLat += (Math.random() - 0.5) * 0.0001;
        currentLng += (Math.random() - 0.5) * 0.0001;
        setLiveLocation({ lat: currentLat.toFixed(5), lng: currentLng.toFixed(5) });
      }, 2000);
    } else {
      setLiveLocation(null);
    }
    return () => clearInterval(interval);
  }, [isSOSActive, userCoords]);

  // Demo notification (15s delay, auto-hide after 8s)
  useEffect(() => {
    const showTimer = setTimeout(() => setShowNotification(true), 15000);
    const hideTimer = setTimeout(() => setShowNotification(false), 23000);
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, []);

  const unreadCount = useMemo(() => notifications.filter(n => n.unread).length, [notifications]);
  const markAllRead = useCallback(() => setNotifications(prev => prev.map(n => ({ ...n, unread: false }))), []);
  const markOneRead = useCallback((id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n)), []);

  // Close dropdowns on outside click — single listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('[data-dropdown]')) {
        setShowNotifPanel(false);
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = useCallback(() => {
    setIsAuthenticated(false);
    setAuthedUser(null);
    setShowProfileMenu(false);
  }, []);

  const handleViewOnMap = useCallback(() => {
    setActiveTab('rescue');
    setIsSOSActive(prev => prev || true);
    setShowNotification(false);
    setTimeout(() => {
      document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeFeed isSOSActive={isSOSActive} setIsSOSActive={setIsSOSActive} liveLocation={liveLocation} onViewCertificate={() => setShowCertificate(true)} userRole={userRole} walletBalance={walletBalance} onOpenWallet={() => setShowWallet(true)} />;
      case 'rescue': return <RescueModule isSOSActive={isSOSActive} setIsSOSActive={setIsSOSActive} liveLocation={liveLocation} onOpenChat={setActiveChatUser} userCoords={userCoords} locationStatus={locationStatus} />;
      case 'volunteer': return <VolunteerModule userCoords={userCoords} userRole={userRole} locationStatus={locationStatus} />;
      case 'services': return <ServicesModule userCoords={userCoords} locationStatus={locationStatus} userRole={userRole} onCommission={creditCommission} onShowEarning={showEarning} />;
      case 'survey': return <SurveyModule userRole={userRole} userCoords={userCoords} onMicroReward={creditMicro} onShowEarning={showEarning} />;
      case 'architecture': return <ArchitectureDocs />;
      default: return <HomeFeed isSOSActive={isSOSActive} setIsSOSActive={setIsSOSActive} liveLocation={liveLocation} onViewCertificate={() => setShowCertificate(true)} userRole={userRole} walletBalance={walletBalance} onOpenWallet={() => setShowWallet(true)} />;
    }
  };

  // Show auth screen until logged in
  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

  if (!isAuthenticated) {
    return <AuthScreen onSuccess={(user) => {
      setAuthedUser(user);
      setIsAuthenticated(true);
    }} />;
  }

  // Merge authed user data with mock template for display
  const displayUser = { ...MOCK_USER, ...(authedUser || {}) };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <SaathiLogo size={36} showWordmark={true} />
          </div>
          
          <button 
            onClick={() => {
              if (locationStatus === 'denied' || locationStatus === 'unavailable') {
                setShowLocationPicker(true);
              } else if (locationStatus === 'granted' || locationStatus === 'manual') {
                setShowLocationPicker(true);
              }
            }}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              locationStatus === 'granted' ? 'bg-green-50 text-green-700 hover:bg-green-100' :
              locationStatus === 'manual' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' :
              locationStatus === 'requesting' ? 'bg-blue-50 text-blue-700' :
              locationStatus === 'denied' || locationStatus === 'unavailable' ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 cursor-pointer' :
              'bg-slate-100 text-slate-600'
            }`}
            title={
              locationStatus === 'granted' && userCoords ? `GPS: ${userCoords.lat.toFixed(5)}, ${userCoords.lng.toFixed(5)} (±${Math.round(userCoords.accuracy)}m)` :
              locationStatus === 'manual' ? 'Manually set — click to change' :
              locationStatus === 'denied' ? 'Click to set location manually' :
              locationStatus === 'requesting' ? 'Fetching location...' : ''
            }
          >
            {locationStatus === 'requesting' ? (
              <Loader2 size={16} className="text-blue-600 animate-spin" />
            ) : locationStatus === 'granted' ? (
              <div className="relative">
                <MapPin size={16} className="text-green-600" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white animate-pulse"></span>
              </div>
            ) : locationStatus === 'manual' ? (
              <MapPin size={16} className="text-blue-600" />
            ) : locationStatus === 'denied' || locationStatus === 'unavailable' ? (
              <AlertTriangle size={16} className="text-orange-600" />
            ) : (
              <MapPin size={16} className="text-blue-600" />
            )}
            <span className="truncate max-w-[120px] sm:max-w-xs">
              {locationStatus === 'requesting' ? 'Locating...' :
               locationStatus === 'denied' || locationStatus === 'unavailable' ? 'Set Location' :
               resolvedLocation}
            </span>
          </button>

          <div className="flex items-center space-x-2">
            {/* Wallet — visible to Volunteer/NGO/Admin */}
            {['Volunteer', 'NGO', 'Admin'].includes(userRole) && (
              <button
                onClick={() => setShowWallet(true)}
                title={`Wallet: ${formatINR(walletBalance)}`}
                className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 hover:from-amber-100 hover:to-orange-100 transition-colors"
              >
                <Wallet size={16} className="text-amber-600" />
                <span className="text-xs font-bold text-amber-700 hidden sm:inline">{formatINR(walletBalance)}</span>
              </button>
            )}

            <div className="relative" data-dropdown>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifPanel(!showNotifPanel);
                  setShowProfileMenu(false);
                }}
                className={`relative p-2 rounded-full transition-colors ${showNotifPanel ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifPanel && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                  <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Notifications</h4>
                      <p className="text-[10px] text-slate-500">{unreadCount} unread</p>
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-orange-600 font-semibold hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notif => {
                      const icons = {
                        sos: <ShieldAlert size={16} className="text-red-600" />,
                        volunteer: <HeartHandshake size={16} className="text-green-600" />,
                        survey: <FileText size={16} className="text-blue-600" />,
                        service: <Wrench size={16} className="text-orange-600" />,
                        civic: <Star size={16} className="text-amber-500" />
                      };
                      const bgs = {
                        sos: 'bg-red-100', volunteer: 'bg-green-100', survey: 'bg-blue-100', service: 'bg-orange-100', civic: 'bg-amber-100'
                      };
                      return (
                        <button
                          key={notif.id}
                          onClick={() => markOneRead(notif.id)}
                          className={`w-full text-left p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 ${notif.unread ? 'bg-orange-50/30' : ''}`}
                        >
                          <div className={`w-8 h-8 ${bgs[notif.type]} rounded-full flex items-center justify-center shrink-0`}>
                            {icons[notif.type]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h5 className={`text-sm ${notif.unread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{notif.title}</h5>
                              {notif.unread && <span className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 shrink-0"></span>}
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{notif.body}</p>
                            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                              <Clock size={10} /> {notif.time}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" data-dropdown>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifPanel(false);
                }}
                className={`flex items-center gap-2 p-1 pr-2 rounded-full transition-colors ${showProfileMenu ? 'bg-orange-50' : 'hover:bg-slate-100'}`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white shadow-sm">
                  {displayUser.name.charAt(0)}
                </div>
                <span className="hidden sm:block text-xs font-semibold text-slate-700">{userRole}</span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                  <div className="p-4 bg-gradient-to-br from-orange-500 via-orange-600 to-emerald-600 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xl font-bold border-2 border-white/30">
                        {displayUser.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{displayUser.name}</h4>
                        <p className="text-[11px] text-white/90">{displayUser.location}</p>
                        <p className="text-[10px] text-white/75 mt-0.5">Blood: {displayUser.bloodGroup}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <div className="text-[10px] font-bold text-slate-400 mb-1 px-2 uppercase tracking-wider">Switch Role</div>
                    {['Citizen', 'Volunteer', 'NGO', 'ServiceProvider', 'Admin'].map(role => (
                      <button 
                        key={role}
                        onClick={() => {
                          setUserRole(role);
                          setShowProfileMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors flex items-start justify-between gap-2 ${userRole === role ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-50 text-slate-700'}`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{role}</span>
                            {userRole === role && <CheckCircle size={12} className="text-orange-600 shrink-0" />}
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{ROLE_DESCRIPTIONS[role]}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 p-2">
                    <button 
                      onClick={() => {
                        setActiveTab('architecture');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Code size={14}/> Tech Specs
                    </button>
                    <button 
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft size={14}/> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 scroll-smooth">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
          <aside className="hidden md:flex flex-col w-64 shrink-0 space-y-2">
            <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Activity size={20}/>} label="Dashboard" />
            <NavButton active={activeTab === 'rescue'} onClick={() => setActiveTab('rescue')} icon={<ShieldAlert size={20}/>} label="Emergency Rescue" color="red" />
            <NavButton active={activeTab === 'volunteer'} onClick={() => setActiveTab('volunteer')} icon={<HeartHandshake size={20}/>} label="Volunteering" color="green" />
            <NavButton active={activeTab === 'services'} onClick={() => setActiveTab('services')} icon={<Wrench size={20}/>} label="Local Services" color="orange" />
            <NavButton active={activeTab === 'survey'} onClick={() => setActiveTab('survey')} icon={<FileText size={20}/>} label="Civic Surveys" color="blue" />
            
            <div className={`mt-8 p-4 rounded-xl border ${
              userRole === 'Admin' 
                ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200' 
                : 'bg-gradient-to-br from-orange-50 to-emerald-50 border-orange-100'
            }`}>
              <div className="flex items-center gap-1.5 mb-1">
                <h4 className={`font-semibold text-sm ${userRole === 'Admin' ? 'text-purple-800' : 'text-orange-800'}`}>
                  Role: {userRole}
                </h4>
                {userRole === 'Admin' && (
                  <span className="text-[9px] font-bold bg-purple-600 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Super
                  </span>
                )}
              </div>
              <p className={`text-xs mb-3 ${userRole === 'Admin' ? 'text-purple-700' : 'text-orange-600'}`}>
                {userRole === 'Admin' ? 'Full platform access enabled.' : 'RBAC customized dashboard view.'}
              </p>
              <div className={`w-full h-1.5 rounded-full overflow-hidden ${userRole === 'Admin' ? 'bg-purple-200' : 'bg-orange-200'}`}>
                <div className={`h-full ${userRole === 'Admin' ? 'bg-purple-600 w-full' : 'bg-gradient-to-r from-orange-500 to-emerald-600 w-2/3'}`}></div>
              </div>
              <p className={`text-[10px] mt-2 text-right ${userRole === 'Admin' ? 'text-purple-500' : 'text-orange-500'}`}>
                {userRole === 'Admin' ? 'All permissions granted' : 'Profile 66% complete'}
              </p>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {locationError && (locationStatus === 'denied' || locationStatus === 'unavailable') && (
              <div className="mb-4 bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-start gap-3">
                <div className="bg-orange-100 p-1.5 rounded-lg text-orange-600 shrink-0">
                  <AlertTriangle size={16} />
                </div>
                <div className="flex-1 text-xs">
                  <p className="font-bold text-orange-900 mb-0.5">Location unavailable</p>
                  <p className="text-orange-700">{locationError}</p>
                </div>
                <button
                  onClick={() => setShowLocationPicker(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shrink-0"
                >
                  Set Manually
                </button>
              </div>
            )}
            {renderContent()}
          </div>
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
        <div className="flex justify-around items-center h-16">
          <MobileNavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Activity size={22}/>} label="Home" />
          <MobileNavButton active={activeTab === 'rescue'} onClick={() => setActiveTab('rescue')} icon={<ShieldAlert size={22}/>} label="SOS" color="text-red-600" />
          <MobileNavButton active={activeTab === 'volunteer'} onClick={() => setActiveTab('volunteer')} icon={<HeartHandshake size={22}/>} label="Volunteer" />
          <MobileNavButton active={activeTab === 'services'} onClick={() => setActiveTab('services')} icon={<Wrench size={22}/>} label="Services" />
          <MobileNavButton active={activeTab === 'survey'} onClick={() => setActiveTab('survey')} icon={<FileText size={22}/>} label="Surveys" />
        </div>
      </nav>

      {showNotification && (
        <div className="fixed top-20 right-4 max-w-sm w-full bg-white rounded-xl shadow-2xl border-l-4 border-red-500 p-4 z-50 flex items-start gap-3">
          <div className="bg-red-100 p-2 rounded-full text-red-600 shrink-0">
            <Radio size={20} className="animate-pulse" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-900 text-sm">Live Location Shared</h4>
            <p className="text-xs text-slate-600 mt-1">A nearby citizen has triggered an SOS and shared their live location.</p>
            <div className="mt-2 flex gap-2">
              <button 
                onClick={handleViewOnMap}
                className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors"
              >
                <Navigation size={12} /> View on Map
              </button>
              <button className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg font-medium transition-colors" onClick={() => setShowNotification(false)}>Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {activeChatUser && (
        <ChatOverlay user={activeChatUser} onClose={() => setActiveChatUser(null)} />
      )}

      {showCertificate && (
        <CertificateModal user={displayUser} onClose={() => setShowCertificate(false)} />
      )}

      {showLocationPicker && (
        <LocationPickerModal
          currentLocation={resolvedLocation}
          onSelect={setManualLocation}
          onRetryGPS={requestLocationAgain}
          locationStatus={locationStatus}
          onClose={() => setShowLocationPicker(false)}
        />
      )}

      {showWallet && (
        <WalletModal
          balance={walletBalance}
          transactions={walletTxns}
          onPayout={(amount) => addWalletTxn({ type: 'debit', source: 'payout', amount, description: 'UPI Payout to *****1234' })}
          onClose={() => setShowWallet(false)}
        />
      )}

      {earningToast && (
        <EarningToast
          amount={earningToast.amount}
          source={earningToast.source}
          onDone={() => setEarningToast(null)}
        />
      )}
    </div>
  );
}

// --- HOME ---
function HomeFeed({ isSOSActive, setIsSOSActive, liveLocation, onViewCertificate, userRole, walletBalance, onOpenWallet }) {
  const showWalletCard = ['Volunteer', 'NGO', 'Admin'].includes(userRole);

  return (
    <div className="space-y-6">
      {showWalletCard && (
        <button
          onClick={onOpenWallet}
          className="w-full bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-5 text-white shadow-xl text-left relative overflow-hidden hover:shadow-2xl transition-shadow"
        >
          <div className="absolute -right-6 -top-6 opacity-10">
            <Wallet size={120} />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/80 font-semibold">Rewards Wallet</p>
              <div className="flex items-baseline gap-0.5 mt-1">
                <IndianRupee size={22} className="text-white/90" strokeWidth={2.5} />
                <span className="text-3xl font-black">{walletBalance.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-xs text-white/80 mt-1 flex items-center gap-1">
                <Sparkles size={12} /> Tap to view earnings & withdraw
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Wallet size={24} />
            </div>
          </div>
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between items-start transition-all duration-300 ${isSOSActive ? 'bg-red-600 shadow-red-500/40' : 'bg-slate-900'} text-white shadow-xl min-h-[180px]`}>
          <div className="absolute -right-10 -top-10 opacity-10">
            <ShieldAlert size={150} />
          </div>
          <div className="w-full relative z-10">
            <h2 className="text-2xl font-bold mb-1">{isSOSActive ? 'SOS Broadcast Active' : 'Emergency Assistance'}</h2>
            {isSOSActive ? (
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2 text-red-100 bg-red-700/50 p-2 rounded-lg backdrop-blur-sm">
                  <Radio size={16} className="animate-pulse text-white" />
                  <div className="text-xs font-mono font-medium">
                    Lat: {liveLocation?.lat} | Lng: {liveLocation?.lng}
                  </div>
                </div>
                <p className="text-xs text-red-50 flex items-center gap-1.5">
                  <Users size={14} /> Notifying {MOCK_CONTACTS.length} contacts & nearby volunteers...
                </p>
              </div>
            ) : (
              <p className="text-white/80 text-sm max-w-xs">
                Trigger a hyperlocal alert to nearby volunteers and share your live location instantly.
              </p>
            )}
          </div>
          <button 
            onClick={() => setIsSOSActive(!isSOSActive)}
            className={`mt-4 px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all z-10 w-full sm:w-auto ${isSOSActive ? 'bg-white text-red-600 hover:bg-red-50 shadow-lg' : 'bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/20 flex items-center justify-center gap-2'}`}
          >
            {isSOSActive ? 'STOP BROADCAST' : <><AlertTriangle size={18} /> TRIGGER SOS</>}
          </button>
        </div>

        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-emerald-600 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between min-h-[180px]">
          <div>
            <h2 className="text-xl font-bold mb-1">Your Civic Impact</h2>
            <div className="flex items-center gap-4 mt-3">
              <div className="text-center">
                <div className="text-3xl font-black">{MOCK_USER.volunteerHours}</div>
                <div className="text-xs text-white/80 uppercase tracking-wider font-semibold">Hours</div>
              </div>
              <div className="w-px h-10 bg-white/30"></div>
              <div className="text-center">
                <div className="text-3xl font-black">3</div>
                <div className="text-xs text-white/80 uppercase tracking-wider font-semibold">Missions</div>
              </div>
            </div>
          </div>
          <button 
            onClick={onViewCertificate}
            className="mt-4 text-xs font-semibold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg self-start backdrop-blur-sm transition-colors flex items-center gap-1.5"
          >
            <Award size={14} /> View Certificate
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Activity size={18} className="text-orange-600"/> Hyperlocal Feed
          </h3>
          <button className="text-sm text-orange-600 font-medium hover:underline">View Map</button>
        </div>
        <div className="space-y-3">
          {MOCK_ALERTS.map(alert => (
            <div key={alert.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-orange-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${alert.severity === 'high' ? 'bg-red-100 text-red-600' : alert.severity === 'medium' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{alert.type}</h4>
                  <div className="flex items-center text-xs text-slate-500 mt-1 gap-2">
                    <span className="flex items-center"><MapPin size={12} className="mr-0.5"/> {alert.distance}</span>
                    <span>•</span>
                    <span className="flex items-center"><Clock size={12} className="mr-0.5"/> {alert.time}</span>
                  </div>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- RESCUE ---
function RescueModule({ isSOSActive, setIsSOSActive, liveLocation, onOpenChat, userCoords, locationStatus }) {
  const [customIncident, setCustomIncident] = useState("");
  const [aiAdvice, setAiAdvice] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const mapLat = userCoords?.lat ?? 11.0168;
  const mapLng = userCoords?.lng ?? 76.9558;
  const bboxDelta = 0.01;
  const bbox = `${mapLng - bboxDelta}%2C${mapLat - bboxDelta}%2C${mapLng + bboxDelta}%2C${mapLat + bboxDelta}`;

  const handleAnalyzeEmergency = async () => {
    if (!customIncident.trim()) return;
    setIsAnalyzing(true);
    try {
      const prompt = `You are a calm, professional emergency response AI. A user has reported: "${customIncident}". Provide 3 very brief, critical immediate actionable first-aid or safety steps they should take while waiting for responders. Format as a short numbered list. Be concise.`;
      const advice = await generateAIContent(prompt);
      setAiAdvice(advice);
    } catch (e) {
      setAiAdvice("Failed to get AI advice. Please focus on immediate safety and wait for responders.");
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-slate-900">Emergency & Rescue</h2>
        {isSOSActive ? (
          <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-red-200">
            <Radio size={14} className="animate-pulse" /> Broadcasting Location
          </span>
        ) : (
          <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">Standby</span>
        )}
      </div>

      <div className={`w-full h-72 rounded-2xl relative overflow-hidden border-2 transition-colors duration-300 ${isSOSActive ? 'border-red-400' : 'border-slate-300'} shadow-inner bg-slate-100`}>
        <iframe
          title="Map"
          width="100%"
          height="100%"
          style={{ border: 0, position: 'absolute', zIndex: 0 }}
          loading="lazy"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${mapLat}%2C${mapLng}`}
        ></iframe>

        {locationStatus === 'granted' && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md border border-green-200 text-xs font-semibold text-green-700 flex items-center gap-1.5 z-20">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Live GPS Active
          </div>
        )}
        {locationStatus === 'denied' && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md border border-orange-200 text-xs font-semibold text-orange-700 flex items-center gap-1.5 z-20">
            <AlertTriangle size={12} />
            Using fallback location
          </div>
        )}

        {isSOSActive && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-10">
            <div className="absolute w-24 h-24 bg-red-500/40 rounded-full animate-ping"></div>
            <div className="absolute w-12 h-12 bg-red-500/60 rounded-full animate-pulse"></div>
            <div className="relative w-5 h-5 bg-red-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center z-10">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <div className="absolute top-6 whitespace-nowrap bg-white px-3 py-1 rounded-lg shadow-lg border border-slate-200 text-xs font-bold text-slate-800 z-20 flex flex-col items-center">
              <span>You are here</span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">{liveLocation?.lat}, {liveLocation?.lng}</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <AlertTriangle size={18} className="text-orange-500"/> Describe Emergency (AI Triage)
        </h3>
        <div className="flex flex-col md:flex-row gap-3">
          <textarea 
            placeholder="E.g., 'Snake bite on the leg, person is feeling dizzy...'"
            value={customIncident}
            onChange={(e) => setCustomIncident(e.target.value)}
            className="flex-1 p-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none h-16"
          />
          <button 
            onClick={handleAnalyzeEmergency}
            disabled={isAnalyzing || !customIncident.trim()}
            className="md:w-48 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
          >
            {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {isAnalyzing ? "Analyzing..." : "Get AI Advice"}
          </button>
        </div>
        {aiAdvice && (
          <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-lg text-sm text-purple-900">
            <h4 className="font-bold mb-2 flex items-center gap-1 text-purple-700"><Sparkles size={14}/> Immediate AI Guidance:</h4>
            <div className="whitespace-pre-wrap text-xs leading-relaxed">{aiAdvice}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <PhoneCall size={18} className="text-orange-500"/> Emergency Contacts
          </h3>
          <div className="space-y-3">
            {MOCK_CONTACTS.map((contact, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <h4 className="font-medium text-sm text-slate-900">{contact.name}</h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{contact.phone}</p>
                </div>
                {isSOSActive ? (
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                    <CheckCircle size={10} /> Notified
                  </span>
                ) : (
                  <button className="text-slate-400 hover:text-orange-600"><PhoneCall size={16} /></button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Users size={18} className="text-green-500"/> Nearby Responders
          </h3>
          <div className="space-y-3">
            {MOCK_RESPONDERS.map(responder => {
              const colorStyles = {
                green: 'border-green-500 bg-green-50',
                blue: 'border-blue-500 bg-blue-50'
              };
              const btnStyles = {
                green: 'bg-green-100 text-green-700 hover:bg-green-200',
                blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              };
              return (
                <div key={responder.id} className={`border-l-4 ${colorStyles[responder.color]} pl-3 py-2 rounded-r-lg flex justify-between items-center`}>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{responder.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{responder.type} • {responder.distance} away</p>
                  </div>
                  <button 
                    onClick={() => onOpenChat(responder)}
                    className={`${btnStyles[responder.color]} p-2 rounded-full transition-colors`}
                  >
                    <MessageSquare size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- VOLUNTEER ---
function VolunteerModule({ userCoords, userRole, locationStatus }) {
  const [opportunities, setOpportunities] = useState(MOCK_VOLUNTEER);
  const [showPostForm, setShowPostForm] = useState(false);
  const [radiusKm, setRadiusKm] = useState(50);

  const isAdmin = userRole === 'Admin';
  const canPost = can.postOpportunity(userRole);

  // Memoized: only recomputes when source data, location, or radius changes
  const filtered = useMemo(() => {
    if (!userCoords) {
      return opportunities.map(j => ({ ...j, distanceKm: null }));
    }
    return opportunities
      .map(j => ({ ...j, distanceKm: haversineKm(userCoords.lat, userCoords.lng, j.lat, j.lng) }))
      .filter(j => j.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [opportunities, userCoords, radiusKm]);

  const handlePost = useCallback((newJob) => {
    setOpportunities(prev => [{ ...newJob, id: Date.now(), orgVerified: true }, ...prev]);
    setShowPostForm(false);
  }, []);

  const handleDelete = useCallback((id) => {
    if (!isAdmin) return;
    setOpportunities(prev => prev.filter(j => j.id !== id));
  }, [isAdmin]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Volunteering</h2>
          <p className="text-sm text-slate-500">
            {userCoords ? 'Opportunities near your live location.' : 'Enable location to see nearby opportunities.'}
          </p>
        </div>
        <div className="flex gap-2">
          {canPost ? (
            <button 
              onClick={() => setShowPostForm(true)}
              className={`text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors ${
                isAdmin ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              <HeartHandshake size={16} /> Post Opportunity
              {isAdmin && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded ml-1">ADMIN</span>}
            </button>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800 flex items-center gap-2">
              <ShieldAlert size={14} className="shrink-0" />
              <span>Only verified NGOs and Admins can post</span>
            </div>
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-lg text-white">
            <ShieldAlert size={16} />
          </div>
          <div className="flex-1 text-xs">
            <p className="font-bold text-purple-900">Admin Mode Active</p>
            <p className="text-purple-700">You can post, moderate, and delete any opportunity across the platform.</p>
          </div>
        </div>
      )}

      {userCoords && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 shrink-0">
            <MapPin size={16} className="text-orange-600" />
            Within
          </div>
          <input
            type="range"
            min="1"
            max="500"
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="flex-1 accent-green-600"
          />
          <div className="text-sm font-bold text-green-700 min-w-[70px] text-right">{radiusKm} km</div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center">
          <HeartHandshake size={32} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm text-slate-500">No opportunities within {radiusKm} km.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(job => (
            <div key={job.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col relative">
              {isAdmin && (
                <button
                  onClick={() => handleDelete(job.id)}
                  title="Remove this opportunity"
                  className="absolute top-3 right-3 z-10 bg-white border border-red-200 text-red-600 hover:bg-red-50 p-1.5 rounded-lg shadow-sm transition-colors"
                >
                  <X size={14} />
                </button>
              )}
              <div className="h-2 bg-green-500 w-full"></div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2">{job.title}</h3>
                <div className="flex items-center gap-1 mb-3">
                  <p className="text-sm font-medium text-slate-600">{job.org}</p>
                  {job.orgVerified && <CheckCircle size={14} className="text-blue-500" />}
                </div>
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center text-xs text-slate-500">
                    <Clock size={14} className="mr-2 text-slate-400" /> {job.date}
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <MapPin size={14} className="mr-2 text-slate-400" /> 
                    {job.distanceKm !== null ? `${formatDistance(job.distanceKm)} away` : 'Distance unavailable'}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {job.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-600 px-2 py-1 rounded">{tag}</span>
                    ))}
                  </div>
                  <button className="text-sm font-semibold text-green-600 hover:text-green-700">Apply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showPostForm && (
        <PostOpportunityModal 
          userCoords={userCoords}
          userRole={userRole}
          onPost={handlePost}
          onClose={() => setShowPostForm(false)}
        />
      )}
    </div>
  );
}

function PostOpportunityModal({ userCoords, userRole, onPost, onClose }) {
  const isAdmin = userRole === 'Admin';
  const [form, setForm] = useState({
    title: '',
    org: isAdmin ? 'City Administration' : 'Helping Hands NGO',
    date: '',
    description: '',
    tags: 'Community',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!form.title.trim() || !form.date.trim()) {
      alert('Please fill in title and date');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      onPost({
        title: form.title,
        org: form.org,
        date: form.date,
        description: form.description,
        lat: userCoords?.lat ?? 11.0168,
        lng: userCoords?.lng ?? 76.9558,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      setSubmitting(false);
    }, 600);
  };

  const headerGrad = isAdmin ? 'from-purple-600 to-indigo-600' : 'from-green-600 to-emerald-600';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className={`bg-gradient-to-r ${headerGrad} text-white p-4 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            {isAdmin ? <ShieldAlert size={20} /> : <HeartHandshake size={20} />}
            <h3 className="font-bold">{isAdmin ? 'Admin: Post Opportunity' : 'Post Volunteer Opportunity'}</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {isAdmin ? (
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 text-xs text-purple-900 flex items-start gap-2">
              <ShieldAlert size={14} className="text-purple-600 shrink-0 mt-0.5" />
              <div><strong>Admin Override:</strong> Posting as administrator.</div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-900 flex items-start gap-2">
              <CheckCircle size={14} className="text-blue-600 shrink-0 mt-0.5" />
              <div><strong>NGO Verified:</strong> Helping Hands NGO • Reg. No. NGO-2019-DLH-4521</div>
            </div>
          )}

          {isAdmin && (
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Organization Name *</label>
              <input
                type="text"
                value={form.org}
                onChange={(e) => setForm({ ...form, org: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Opportunity Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Senior Citizen Health Camp"
              className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Date & Time *</label>
            <input
              type="text"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              placeholder="e.g. Saturday, 9 AM"
              className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
              className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Tags (comma separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Location (Auto)</div>
            <div className="text-xs text-slate-700 font-mono">
              {userCoords ? `${userCoords.lat.toFixed(5)}, ${userCoords.lng.toFixed(5)}` : 'Using default location'}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 flex gap-2">
          <button onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`flex-1 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${
              isAdmin ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {submitting ? <><Loader2 size={14} className="animate-spin" /> Posting...</> : 'Post Opportunity'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- SERVICES ---
function ServicesModule({ userCoords, locationStatus, userRole, onCommission, onShowEarning }) {
  const [services, setServices] = useState(MOCK_SERVICES);
  const [radiusKm, setRadiusKm] = useState(20);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showOnboard, setShowOnboard] = useState(false);
  const [showApprovalQueue, setShowApprovalQueue] = useState(false);
  const [pendingOnboarding, setPendingOnboarding] = useState(null); // service data waiting for payment
  const [showPayment, setShowPayment] = useState(false);
  const isAdmin = userRole === 'Admin';
  const canOnboard = can.onboardService(userRole);
  const isVolunteer = userRole === 'Volunteer';

  const pendingCount = useMemo(() => services.filter(s => s.status === 'pending').length, [services]);

  const categories = useMemo(
    () => ['All', ...new Set(services.filter(s => s.status === 'approved').map(s => s.category))],
    [services]
  );

  const toggleVerified = useCallback((id) =>
    setServices(prev => prev.map(s => s.id === id ? { ...s, verified: !s.verified } : s)), []);
  const toggleAvailable = useCallback((id) =>
    setServices(prev => prev.map(s => s.id === id ? { ...s, available: !s.available } : s)), []);
  const removeService = useCallback((id) =>
    setServices(prev => prev.filter(s => s.id !== id)), []);
  const approveService = useCallback((id) =>
    setServices(prev => prev.map(s => s.id === id ? { ...s, status: 'approved', verified: true } : s)), []);
  const rejectService = useCallback((id) =>
    setServices(prev => prev.filter(s => s.id !== id)), []);

  const handleOnboard = useCallback((newService) => {
    // Hold the service data, open payment flow
    setPendingOnboarding(newService);
    setShowOnboard(false);
    setShowPayment(true);
  }, []);

  const handlePaymentSuccess = useCallback(() => {
    if (!pendingOnboarding) return;
    setServices(prev => [{
      ...pendingOnboarding,
      id: Date.now(),
      status: 'pending',
      verified: false,
      available: true,
      rating: 0,
      lat: userCoords?.lat ?? 9.4981,
      lng: userCoords?.lng ?? 76.3388,
      paid: true,
      paidAmount: PRICING.serviceRegistration,
    }, ...prev]);

    // Credit commission to the onboarding user (Volunteer/NGO/Admin)
    if (isVolunteer || userRole === 'NGO') {
      const commission = onCommission?.(PRICING.serviceRegistration, `Onboarded ${pendingOnboarding.name}`);
      if (commission) onShowEarning?.(commission, 'commission');
    }

    setPendingOnboarding(null);
    setShowPayment(false);
  }, [pendingOnboarding, userCoords, isVolunteer, userRole, onCommission, onShowEarning]);

  // Only show approved services in the main list
  const filtered = useMemo(() => {
    const enriched = services
      .filter(s => s.status === 'approved')
      .map(s => ({
        ...s,
        distanceKm: userCoords ? haversineKm(userCoords.lat, userCoords.lng, s.lat, s.lng) : null
      }));
    return enriched
      .filter(s => categoryFilter === 'All' || s.category === categoryFilter)
      .filter(s => !userCoords || s.distanceKm <= radiusKm)
      .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  }, [services, userCoords, radiusKm, categoryFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Local Services</h2>
          <p className="text-sm text-slate-500">
            {userCoords ? 'Services auto-fetched based on your live location.' : 'Enable location for proximity-based results.'}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {canOnboard && (
            <button
              onClick={() => setShowOnboard(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
              <Wrench size={16} /> Onboard Service
            </button>
          )}
          {isAdmin && pendingCount > 0 && (
            <button
              onClick={() => setShowApprovalQueue(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm relative"
            >
              <ShieldAlert size={16} /> Review Queue
              <span className="bg-yellow-400 text-purple-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pendingCount}</span>
            </button>
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-lg text-white">
            <ShieldAlert size={16} />
          </div>
          <div className="flex-1 text-xs">
            <p className="font-bold text-purple-900">Admin Service Management</p>
            <p className="text-purple-700">Approve onboardings, verify providers, toggle availability, or remove services.</p>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
        {userCoords && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 shrink-0">
              <MapPin size={16} className="text-orange-600" />
              Radius
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="flex-1 accent-orange-600"
            />
            <div className="text-sm font-bold text-orange-700 min-w-[70px] text-right">{radiusKm} km</div>
          </div>
        )}
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                categoryFilter === cat ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center">
          <Wrench size={32} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm text-slate-500">No services within {radiusKm} km.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(service => (
            <div key={service.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-orange-300 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                  <Wrench size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-slate-900 truncate">{service.name}</h4>
                    {service.verified && <CheckCircle size={14} className="text-blue-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 mb-1">{service.category} • Registered in {service.registeredAt}</p>
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <span className="flex items-center text-amber-500 font-medium">
                      <Star size={12} className="mr-0.5 fill-current" /> {service.rating || 'New'}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-medium">
                      {service.distanceKm !== null ? formatDistance(service.distanceKm) + ' away' : 'Location unknown'}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className={`font-medium ${service.available ? 'text-green-600' : 'text-red-500'}`}>
                      {service.available ? 'Available' : 'Busy'}
                    </span>
                  </div>
                </div>
              </div>

              {isAdmin && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2 flex-wrap">
                  <button
                    onClick={() => toggleVerified(service.id)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider transition-colors ${
                      service.verified ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {service.verified ? '✓ Verified' : 'Unverified'}
                  </button>
                  <button
                    onClick={() => toggleAvailable(service.id)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider transition-colors ${
                      service.available ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {service.available ? '● Available' : '○ Busy'}
                  </button>
                  <button
                    onClick={() => removeService(service.id)}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-red-50 text-red-600 hover:bg-red-100 transition-colors ml-auto"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showOnboard && (
        <OnboardServiceModal
          userCoords={userCoords}
          userRole={userRole}
          onSubmit={handleOnboard}
          onClose={() => setShowOnboard(false)}
        />
      )}

      {showPayment && pendingOnboarding && (
        <PaymentModal
          amount={PRICING.serviceRegistration}
          description={`Service registration: ${pendingOnboarding.name}`}
          payer={pendingOnboarding.ownerName}
          onSuccess={handlePaymentSuccess}
          onClose={() => { setShowPayment(false); setPendingOnboarding(null); }}
        />
      )}

      {showApprovalQueue && (
        <ServiceApprovalQueueModal
          services={services.filter(s => s.status === 'pending')}
          onApprove={approveService}
          onReject={rejectService}
          onClose={() => setShowApprovalQueue(false)}
        />
      )}
    </div>
  );
}

function OnboardServiceModal({ userCoords, userRole, onSubmit, onClose }) {
  const [form, setForm] = useState({
    name: '',
    category: 'Electrician',
    ownerName: '',
    ownerPhone: '',
    registeredAt: '',
    description: '',
  });
  const [shopDoc, setShopDoc] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  const isVolunteer = userRole === 'Volunteer';
  const headerGrad = isVolunteer ? 'from-green-600 to-emerald-600' : 'from-orange-600 to-orange-700';

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File must be under 5MB');
      return;
    }
    if (!['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      alert('Only PDF, JPG, or PNG allowed');
      return;
    }
    setShopDoc({ name: file.name, size: file.size, type: file.type });
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.ownerName.trim() || !form.ownerPhone.trim() || !shopDoc) {
      alert('Please fill all required fields and upload shop registration document');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      onSubmit({
        ...form,
        shopDoc,
        onboardedBy: userRole,
        onboardedAt: new Date().toISOString(),
      });
      setSubmitting(false);
    }, 800);
  };

  return (
    <Modal onClose={onClose} maxWidth="max-w-lg">
      <ModalHeader
        icon={<Wrench size={20} />}
        title="Onboard New Service"
        subtitle="Submitted for Admin approval"
        gradient={headerGrad}
        onClose={onClose}
      />

      <div className="p-5 overflow-y-auto space-y-4">
        {isVolunteer && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white shrink-0">
              <Gift size={18} />
            </div>
            <div className="flex-1 text-xs">
              <p className="font-bold text-amber-900">You'll earn {formatINR(calculateCommission(PRICING.serviceRegistration))} commission</p>
              <p className="text-amber-700 mt-0.5">Shop pays {formatINR(PRICING.serviceRegistration)} for listing • 10% to your wallet on approval</p>
            </div>
          </div>
        )}

        {isVolunteer && (
          <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-xs text-green-900 flex items-start gap-2">
            <HeartHandshake size={14} className="text-green-600 shrink-0 mt-0.5" />
            <div><strong>Volunteer Onboarding:</strong> You're helping register a local business. They'll be visible after Admin approval.</div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Service Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Suresh Electricals"
              className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 outline-none bg-white"
            >
              {['Ambulance', 'Electrician', 'Plumber', 'Carpenter', 'Mechanic', 'Pharmacy', 'Other'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1 block">Owner Name *</label>
          <input
            type="text"
            value={form.ownerName}
            onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
            placeholder="Full name of business owner"
            className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1 block">Owner Phone *</label>
          <input
            type="tel"
            value={form.ownerPhone}
            onChange={(e) => setForm({ ...form, ownerPhone: e.target.value })}
            placeholder="+91 98765 43210"
            className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1 block">Area / Locality</label>
          <input
            type="text"
            value={form.registeredAt}
            onChange={(e) => setForm({ ...form, registeredAt: e.target.value })}
            placeholder="e.g. Mullakkal"
            className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        {/* Shop registration document — REQUIRED */}
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1 block flex items-center gap-1">
            Shop Registration Document *
            <span className="text-red-500">required</span>
          </label>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFile}
            className="hidden"
          />
          {shopDoc ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded text-green-700">
                <FileText size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">{shopDoc.name}</p>
                <p className="text-[10px] text-slate-500">{(shopDoc.size / 1024).toFixed(0)} KB</p>
              </div>
              <button
                onClick={() => { setShopDoc(null); if (fileRef.current) fileRef.current.value = ''; }}
                className="text-red-500 hover:bg-red-50 p-1 rounded"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-300 hover:border-orange-400 hover:bg-orange-50 rounded-lg p-4 flex flex-col items-center gap-1 transition-colors"
            >
              <FileText size={20} className="text-slate-400" />
              <p className="text-xs font-semibold text-slate-700">Upload Shop Registration</p>
              <p className="text-[10px] text-slate-500">PDF, JPG, or PNG • Max 5 MB</p>
            </button>
          )}
          <p className="text-[10px] text-slate-500 mt-1">Trade license, GST cert, or municipal registration accepted</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Location (Auto)</div>
          <div className="text-xs text-slate-700 font-mono">
            {userCoords ? `${userCoords.lat.toFixed(5)}, ${userCoords.lng.toFixed(5)}` : 'Using default location'}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 flex gap-2">
        <button onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-lg transition-colors">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting || !shopDoc}
          className={`flex-1 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 bg-gradient-to-r ${headerGrad} hover:opacity-95`}
        >
          {submitting ? <><Loader2 size={14} className="animate-spin" /> Submitting...</> : 'Submit for Approval'}
        </button>
      </div>
    </Modal>
  );
}

function ServiceApprovalQueueModal({ services, onApprove, onReject, onClose }) {
  return (
    <Modal onClose={onClose} maxWidth="max-w-2xl">
      <ModalHeader
        icon={<ShieldAlert size={20} />}
        title="Service Approval Queue"
        subtitle={`${services.length} pending review`}
        gradient="from-purple-600 to-indigo-700"
        onClose={onClose}
      />

      <div className="p-5 overflow-y-auto flex-1 space-y-3">
        {services.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500">
            <CheckCircle size={32} className="mx-auto text-green-500 mb-2" />
            All caught up! No pending services.
          </div>
        ) : services.map(service => (
          <div key={service.id} className="bg-white border-2 border-purple-100 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                <Wrench size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900">{service.name}</h4>
                <p className="text-xs text-slate-500">{service.category} • {service.registeredAt || 'Location pending'}</p>
                <p className="text-xs text-slate-600 mt-1">Owner: <span className="font-semibold">{service.ownerName}</span> • {service.ownerPhone}</p>
              </div>
              <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded font-bold uppercase tracking-wider shrink-0">
                Pending
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-3">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Onboarding Info</div>
              <div className="text-xs space-y-1 text-slate-700">
                <p><strong>Onboarded by:</strong> {service.onboardedBy}</p>
                <p><strong>Submitted:</strong> {new Date(service.onboardedAt).toLocaleString()}</p>
                {service.description && <p><strong>Description:</strong> {service.description}</p>}
              </div>
            </div>

            {service.shopDoc && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3 flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded text-blue-700">
                  <FileText size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">{service.shopDoc.name}</p>
                  <p className="text-[10px] text-slate-500">Shop registration • {(service.shopDoc.size / 1024).toFixed(0)} KB</p>
                </div>
                <button className="text-blue-600 hover:bg-blue-100 px-2 py-1 rounded text-xs font-semibold">View</button>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => onReject(service.id)}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold py-2 rounded-lg transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => onApprove(service.id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <CheckCircle size={12} /> Approve & Verify
              </button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

// --- SURVEY ---
function SurveyModule({ userRole, userCoords, onMicroReward, onShowEarning }) {
  const [surveys, setSurveys] = useState(MOCK_SURVEYS);
  const [insights, setInsights] = useState({});
  const [loadingSurveyId, setLoadingSurveyId] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showApprovalQueue, setShowApprovalQueue] = useState(false);
  const [takingSurvey, setTakingSurvey] = useState(null);

  const canPost = can.postSurvey(userRole);
  const isAdmin = userRole === 'Admin';
  const canEarn = ['Volunteer', 'NGO', 'Admin'].includes(userRole);
  const pendingCount = useMemo(() => surveys.filter(s => s.status === 'pending').length, [surveys]);
  const visibleSurveys = useMemo(() => surveys.filter(s => s.status === 'approved'), [surveys]);

  const handlePostSurvey = useCallback((newSurvey) => {
    setSurveys(prev => [{
      ...newSurvey,
      id: Date.now(),
      status: userRole === 'Admin' ? 'approved' : 'pending',
      responses: 0,
      expires: '7 days left',
      postedBy: userRole,
    }, ...prev]);
    setShowPostForm(false);
  }, [userRole]);

  const approveSurvey = useCallback((id) =>
    setSurveys(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' } : s)), []);
  const rejectSurvey = useCallback((id) =>
    setSurveys(prev => prev.filter(s => s.id !== id)), []);

  const submitSurveyResponse = useCallback((survey) => {
    setSurveys(prev => prev.map(s => s.id === survey.id ? { ...s, responses: s.responses + 1 } : s));
    // Credit micro reward
    if (canEarn) {
      const reward = survey.requiresVerification ? MICRO_REWARDS.takeGovSurvey : MICRO_REWARDS.takeExitPoll;
      onMicroReward?.(reward, `Completed: ${survey.title}`);
      onShowEarning?.(reward, 'micro');
    }
    setTakingSurvey(null);
  }, [canEarn, onMicroReward, onShowEarning]);

  const generateInsights = async (survey) => {
    setLoadingSurveyId(survey.id);
    try {
      const prompt = `Act as an AI civic analyst. For a local survey titled "${survey.title}" by "${survey.authority}" with ${survey.responses} responses, generate a 2-sentence plausible summary of what citizens are saying. Concise and professional.`;
      const result = await generateAIContent(prompt);
      setInsights(prev => ({ ...prev, [survey.id]: result }));
    } catch (e) {
      setInsights(prev => ({ ...prev, [survey.id]: "Failed to generate AI insights." }));
    }
    setLoadingSurveyId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Civic Surveys</h2>
          <p className="text-sm text-slate-500">Participate in geo-targeted polls and verified government surveys.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {canPost && (
            <button
              onClick={() => setShowPostForm(true)}
              className={`text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm ${
                isAdmin ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              <FileText size={16} /> Post Survey
            </button>
          )}
          {isAdmin && pendingCount > 0 && (
            <button
              onClick={() => setShowApprovalQueue(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm relative"
            >
              <ShieldAlert size={16} /> Review Queue
              <span className="bg-yellow-400 text-purple-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pendingCount}</span>
            </button>
          )}
        </div>
      </div>

      {!canPost && userRole === 'Citizen' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800 flex items-center gap-2">
          <ShieldAlert size={14} className="shrink-0" />
          <span>Volunteers can post surveys (with local authority approval). Admins can post directly.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleSurveys.map(survey => (
          <div key={survey.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3 gap-2">
              <div className="flex flex-wrap gap-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                  survey.type === 'Government' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {survey.type || 'Active Poll'}
                </span>
                {survey.requiresVerification && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-red-100 text-red-700 flex items-center gap-1">
                    <ShieldAlert size={9} /> Verified
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 flex items-center shrink-0">
                <Clock size={12} className="mr-1" /> {survey.expires}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">{survey.title}</h3>
            <p className="text-sm text-slate-500 mb-1">By {survey.authority}</p>
            {survey.requiresVerification && (
              <p className="text-[10px] text-red-600 mb-3 flex items-center gap-1">
                <AlertOctagon size={10} /> Photo verification required when submitting
              </p>
            )}

            {insights[survey.id] && (
              <div className="mb-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-900">
                <div className="font-bold flex items-center gap-1 mb-1 text-indigo-700"><Sparkles size={12} /> AI Quick Insight:</div>
                {insights[survey.id]}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-xs font-medium text-slate-500">{survey.responses.toLocaleString()} responses</span>
              <div className="flex gap-2">
                <button
                  onClick={() => generateInsights(survey)}
                  disabled={loadingSurveyId === survey.id}
                  className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  {loadingSurveyId === survey.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  AI Insights
                </button>
                <button
                  onClick={() => setTakingSurvey(survey)}
                  className="bg-orange-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Take Survey
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showPostForm && (
        <PostSurveyModal userRole={userRole} onSubmit={handlePostSurvey} onClose={() => setShowPostForm(false)} />
      )}

      {showApprovalQueue && (
        <SurveyApprovalQueueModal
          surveys={surveys.filter(s => s.status === 'pending')}
          onApprove={approveSurvey}
          onReject={rejectSurvey}
          onClose={() => setShowApprovalQueue(false)}
        />
      )}

      {takingSurvey && (
        <TakeSurveyModal
          survey={takingSurvey}
          canEarn={canEarn}
          onSubmit={() => submitSurveyResponse(takingSurvey)}
          onClose={() => setTakingSurvey(null)}
        />
      )}
    </div>
  );
}

function PostSurveyModal({ userRole, onSubmit, onClose }) {
  const [form, setForm] = useState({
    title: '',
    authority: '',
    type: 'Exit Poll',
    questions: '',
  });
  const [authorityDoc, setAuthorityDoc] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);
  const isAdmin = userRole === 'Admin';
  const isGovType = form.type === 'Government';

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('File must be under 5MB'); return; }
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      alert('Only PDF, JPG, or PNG allowed'); return;
    }
    setAuthorityDoc({ name: file.name, size: file.size, type: file.type });
  };

  const requiresAuthorityDoc = !isAdmin || isGovType;
  const canSubmit = form.title.trim() && form.authority.trim() && (!requiresAuthorityDoc || authorityDoc);

  const handleSubmit = () => {
    if (!canSubmit) {
      alert('Please fill all required fields' + (requiresAuthorityDoc ? ' and upload authority document' : ''));
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      onSubmit({
        title: form.title,
        authority: form.authority,
        type: form.type,
        requiresVerification: isGovType,
        authorityDoc,
        submittedAt: new Date().toISOString(),
      });
      setSubmitting(false);
    }, 800);
  };

  const headerGrad = isAdmin ? 'from-purple-600 to-indigo-600' : 'from-green-600 to-emerald-600';

  return (
    <Modal onClose={onClose} maxWidth="max-w-lg">
      <ModalHeader
        icon={<FileText size={20} />}
        title={isAdmin ? 'Admin: Post Survey' : 'Post Civic Survey'}
        subtitle={isAdmin ? 'Direct publish (no approval needed)' : 'Submitted for Admin approval'}
        gradient={headerGrad}
        onClose={onClose}
      />

      <div className="p-5 overflow-y-auto space-y-4">
        {!isAdmin && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-900 flex items-start gap-2">
            <ShieldAlert size={14} className="text-blue-600 shrink-0 mt-0.5" />
            <div><strong>Volunteer Survey Submission:</strong> Surveys require Admin approval before going live. For Government surveys, photo verification of responders is mandatory.</div>
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1 block">Survey Type *</label>
          <div className="grid grid-cols-2 gap-2">
            {['Exit Poll', 'Government'].map(t => (
              <button
                key={t}
                onClick={() => setForm({ ...form, type: t })}
                className={`p-3 rounded-lg border-2 transition-colors text-left ${
                  form.type === t
                    ? (t === 'Government' ? 'border-blue-500 bg-blue-50' : 'border-orange-500 bg-orange-50')
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`text-xs font-bold ${form.type === t ? (t === 'Government' ? 'text-blue-700' : 'text-orange-700') : 'text-slate-700'}`}>
                  {t}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {t === 'Government' ? 'Photo verification required' : 'No verification needed'}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1 block">Survey Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Water Supply Quality Survey"
            className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1 block">Authority / Organization *</label>
          <input
            type="text"
            value={form.authority}
            onChange={(e) => setForm({ ...form, authority: e.target.value })}
            placeholder={isGovType ? 'e.g. Kerala Water Authority' : 'e.g. Local Volunteers Group'}
            className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1 block">Survey Questions (brief)</label>
          <textarea
            value={form.questions}
            onChange={(e) => setForm({ ...form, questions: e.target.value })}
            rows="3"
            placeholder="List 2-3 sample questions..."
            className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none"
          />
        </div>

        {requiresAuthorityDoc && (
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block flex items-center gap-1">
              Local Authority Approval Document *
              <span className="text-red-500">required</span>
            </label>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFile}
              className="hidden"
            />
            {authorityDoc ? (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded text-green-700"><FileText size={18} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">{authorityDoc.name}</p>
                  <p className="text-[10px] text-slate-500">{(authorityDoc.size / 1024).toFixed(0)} KB</p>
                </div>
                <button
                  onClick={() => { setAuthorityDoc(null); if (fileRef.current) fileRef.current.value = ''; }}
                  className="text-red-500 hover:bg-red-50 p-1 rounded"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-300 hover:border-orange-400 hover:bg-orange-50 rounded-lg p-4 flex flex-col items-center gap-1 transition-colors"
              >
                <FileText size={20} className="text-slate-400" />
                <p className="text-xs font-semibold text-slate-700">Upload Authority Letter / Permission</p>
                <p className="text-[10px] text-slate-500">PDF, JPG, or PNG • Max 5 MB</p>
              </button>
            )}
            <p className="text-[10px] text-slate-500 mt-1">
              Letter from ward office, municipality, or relevant authority approving the survey
            </p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 flex gap-2">
        <button onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-lg transition-colors">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className={`flex-1 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 bg-gradient-to-r ${headerGrad}`}
        >
          {submitting ? <><Loader2 size={14} className="animate-spin" /> Submitting...</> : (isAdmin ? 'Publish Now' : 'Submit for Approval')}
        </button>
      </div>
    </Modal>
  );
}

function SurveyApprovalQueueModal({ surveys, onApprove, onReject, onClose }) {
  return (
    <Modal onClose={onClose} maxWidth="max-w-2xl">
      <ModalHeader
        icon={<ShieldAlert size={20} />}
        title="Survey Approval Queue"
        subtitle={`${surveys.length} pending review`}
        gradient="from-purple-600 to-indigo-700"
        onClose={onClose}
      />

      <div className="p-5 overflow-y-auto flex-1 space-y-3">
        {surveys.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500">
            <CheckCircle size={32} className="mx-auto text-green-500 mb-2" />
            All caught up!
          </div>
        ) : surveys.map(survey => (
          <div key={survey.id} className="bg-white border-2 border-purple-100 rounded-xl p-4">
            <div className="flex items-start justify-between mb-3 gap-2">
              <div className="flex-1">
                <div className="flex gap-1 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                    survey.type === 'Government' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                  }`}>{survey.type}</span>
                  {survey.requiresVerification && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-red-100 text-red-700">
                      Photo Verify
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-slate-900">{survey.title}</h4>
                <p className="text-xs text-slate-500">By {survey.authority}</p>
                <p className="text-xs text-slate-600 mt-1">Submitted by: <strong>{survey.postedBy}</strong></p>
              </div>
            </div>

            {survey.authorityDoc && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3 flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded text-blue-700"><FileText size={16} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">{survey.authorityDoc.name}</p>
                  <p className="text-[10px] text-slate-500">Authority approval • {(survey.authorityDoc.size / 1024).toFixed(0)} KB</p>
                </div>
                <button className="text-blue-600 hover:bg-blue-100 px-2 py-1 rounded text-xs font-semibold">View PDF</button>
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={() => onReject(survey.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold py-2 rounded-lg transition-colors">
                Reject
              </button>
              <button onClick={() => onApprove(survey.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
                <CheckCircle size={12} /> Approve & Publish
              </button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function TakeSurveyModal({ survey, canEarn, onSubmit, onClose }) {
  // step: questions | consent | camera | submitting | done
  const [step, setStep] = useState('questions');
  const [answers, setAnswers] = useState({ q1: '', q2: '' });
  const [photoData, setPhotoData] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const needsPhoto = survey.requiresVerification;

  const startCamera = useCallback(async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (e) {
      setCameraError('Camera access denied or unavailable. Allow camera permission and try again.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (step === 'camera') startCamera();
    return stopCamera;
  }, [step, startCamera, stopCamera]);

  // Auto-advance from submitting → done → onSubmit
  useEffect(() => {
    if (step !== 'submitting') return;
    const t1 = setTimeout(() => setStep('done'), 1000);
    return () => clearTimeout(t1);
  }, [step]);

  useEffect(() => {
    if (step !== 'done') return;
    const t = setTimeout(() => onSubmit(), 1200);
    return () => clearTimeout(t);
  }, [step, onSubmit]);

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    setPhotoData(canvas.toDataURL('image/jpeg', 0.85));
    stopCamera();
  };

  const retakePhoto = () => {
    setPhotoData(null);
    startCamera();
  };

  const canProceedFromQuestions = answers.q1.trim() && answers.q2.trim();
  const handleClose = () => { stopCamera(); onClose(); };

  return (
    <Modal onClose={handleClose} maxWidth="max-w-md">
      <ModalHeader
        icon={<FileText size={20} />}
        title={survey.title}
        subtitle={`By ${survey.authority}`}
        gradient={survey.type === 'Government' ? 'from-blue-600 to-indigo-700' : 'from-orange-600 to-orange-700'}
        onClose={handleClose}
      />

      {step === 'questions' && (
        <>
          <div className="p-5 overflow-y-auto space-y-4">
            {canEarn && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white shrink-0">
                  <Gift size={18} />
                </div>
                <div className="flex-1 text-xs">
                  <p className="font-bold text-amber-900">
                    Earn {formatINR(survey.requiresVerification ? MICRO_REWARDS.takeGovSurvey : MICRO_REWARDS.takeExitPoll)} for completing
                  </p>
                  <p className="text-amber-700 mt-0.5">Credited to your wallet on submit</p>
                </div>
              </div>
            )}

            {needsPhoto && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-900 flex items-start gap-2">
                <ShieldAlert size={14} className="text-red-600 shrink-0 mt-0.5" />
                <div><strong>Verified Government Survey:</strong> A photo of you will be required to submit. This prevents duplicate or fake responses.</div>
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-slate-800 mb-2 block">
                1. How would you rate the current service quality? *
              </label>
              <div className="grid grid-cols-5 gap-1">
                {['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'].map((opt, i) => (
                  <button
                    key={opt}
                    onClick={() => setAnswers({ ...answers, q1: opt })}
                    className={`p-2 text-[10px] rounded-lg border-2 transition-colors text-center ${
                      answers.q1 === opt ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-0.5">
                <span>Very Poor</span><span>Excellent</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-800 mb-2 block">
                2. Your suggestions or concerns *
              </label>
              <textarea
                value={answers.q2}
                onChange={(e) => setAnswers({ ...answers, q2: e.target.value })}
                rows="4"
                placeholder="Share your thoughts..."
                className="w-full p-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none"
              />
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 flex gap-2">
            <button onClick={handleClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              onClick={() => setStep(needsPhoto ? 'consent' : 'submitting')}
              disabled={!canProceedFromQuestions}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
            >
              {needsPhoto ? <>Next: Photo Verify <ArrowRight size={14} /></> : 'Submit'}
            </button>
          </div>
        </>
      )}

      {step === 'consent' && (
        <div className="p-5 space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-3">
              <ShieldAlert size={28} className="text-red-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Photo Verification Required</h3>
            <p className="text-xs text-slate-500">This is a verified government survey.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-700 space-y-2">
            <p><strong>Why we need your photo:</strong></p>
            <ul className="space-y-1.5 ml-1">
              <li className="flex gap-2">
                <CheckCircle size={12} className="text-green-600 shrink-0 mt-0.5" />
                <span>Prevents duplicate responses and fake submissions</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle size={12} className="text-green-600 shrink-0 mt-0.5" />
                <span>Helps officials trust the data for policy decisions</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle size={12} className="text-green-600 shrink-0 mt-0.5" />
                <span>Photo is encrypted and only visible to authorized admin</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle size={12} className="text-green-600 shrink-0 mt-0.5" />
                <span>Survey poster sees aggregated data only — not individual photos</span>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[11px] text-amber-900">
            By proceeding, you consent to a one-time photo capture stored alongside your anonymous response for verification.
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep('questions')} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-lg">
              Back
            </button>
            <button onClick={() => setStep('camera')} className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1">
              I Consent <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {step === 'camera' && (
        <div className="p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-center">Capture Verification Photo</h3>
          
          <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-[4/3]">
            {!photoData ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
                {cameraError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white text-center bg-slate-900">
                    <AlertOctagon size={32} className="text-red-400 mb-2" />
                    <p className="text-xs">{cameraError}</p>
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-56 border-4 border-white/60 rounded-full"></div>
                    </div>
                    <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-[10px] bg-black/50 px-2 py-1 rounded">
                      Center your face inside the oval
                    </p>
                  </>
                )}
              </>
            ) : (
              <img src={photoData} alt="Captured" className="w-full h-full object-cover" />
            )}
          </div>

          {!photoData ? (
            <div className="flex gap-2">
              <button onClick={() => setStep('consent')} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-lg">
                Back
              </button>
              <button
                onClick={capturePhoto}
                disabled={!!cameraError}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-50 flex items-center justify-center gap-1"
              >
                <ScanLine size={14} /> Capture
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={retakePhoto} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-lg">
                Retake
              </button>
              <button onClick={() => setStep('submitting')} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1">
                <CheckCircle size={14} /> Submit
              </button>
            </div>
          )}
        </div>
      )}

      {step === 'submitting' && (
        <div className="p-12 flex flex-col items-center text-center">
          <Loader2 size={32} className="text-orange-600 animate-spin mb-3" />
          <p className="font-semibold text-slate-700">Submitting response...</p>
          <p className="text-xs text-slate-500 mt-1">Encrypting and verifying</p>
        </div>
      )}

      {step === 'done' && (
        <div className="p-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <p className="font-bold text-slate-900">Thank you!</p>
          <p className="text-xs text-slate-500 mt-1">Your response has been recorded.</p>
        </div>
      )}
    </Modal>
  );
}

// --- ARCHITECTURE ---
function ArchitectureDocs() {
  const [docTab, setDocTab] = useState('schema');

  const schemaCode = `// Prisma Schema (schema.prisma)

model User {
  id            String   @id @default(cuid())
  name          String
  phone         String   @unique
  role          Role     @default(CITIZEN)
  location      Json?
  createdAt     DateTime @default(now())
  
  sosAlerts     SOSAlert[]
  volunteerJobs VolunteerApplication[]
}

model SOSAlert {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  type        AlertType
  severity    Severity
  location    Json
  status      Status   @default(ACTIVE)
  createdAt   DateTime @default(now())
}

enum Role { CITIZEN VOLUNTEER NGO ADMIN }
enum AlertType { MEDICAL FIRE ACCIDENT MISSING OTHER }
enum Severity { LOW MEDIUM HIGH CRITICAL }
enum Status { ACTIVE RESOLVED CANCELLED }`;

  const apiCode = `// REST API ENDPOINTS (NestJS / Express)

POST   /api/auth/register
POST   /api/auth/login

POST   /api/sos/trigger
PATCH  /api/sos/:id/location
POST   /api/sos/:id/respond
GET    /api/sos/nearby

GET    /api/volunteer/opportunities?lat=&lng=&r=
POST   /api/volunteer/apply/:id

GET    /api/services?category=&lat=&lng=
POST   /api/services/:id/book

WS     /ws/chat
WS     /ws/sos-broadcast`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Code size={24} className="text-purple-600" /> Developer Specs
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          <DocTab active={docTab === 'schema'} onClick={() => setDocTab('schema')} icon={<Database size={16}/>} label="PostgreSQL Schema" />
          <DocTab active={docTab === 'api'} onClick={() => setDocTab('api')} icon={<Server size={16}/>} label="REST APIs" />
        </div>
        <div className="p-0 bg-slate-900 text-slate-300 font-mono text-xs overflow-x-auto">
          <pre className="p-6 whitespace-pre">{docTab === 'schema' ? schemaCode : apiCode}</pre>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-3">
            <Server size={20} />
          </div>
          <h4 className="font-bold text-slate-900 mb-1">Backend Stack</h4>
          <p className="text-xs text-slate-500">NestJS, PostgreSQL, Redis, Socket.io, PostGIS.</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-3">
            <Code size={20} />
          </div>
          <h4 className="font-bold text-slate-900 mb-1">Frontend Stack</h4>
          <p className="text-xs text-slate-500">React Native, Next.js, Tailwind CSS, Mapbox.</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-3">
            <Sparkles size={20} />
          </div>
          <h4 className="font-bold text-slate-900 mb-1">AI Layer</h4>
          <p className="text-xs text-slate-500">Anthropic Claude for triage, moderation, insights.</p>
        </div>
      </div>
    </div>
  );
}

// --- UTILITY COMPONENTS ---
function NavButton({ icon, label, active, onClick, color = 'orange' }) {
  const activeClasses = {
    orange: 'bg-orange-50 text-orange-700',
    red: 'bg-red-50 text-red-700',
    green: 'bg-green-50 text-green-700',
    blue: 'bg-blue-50 text-blue-700'
  };
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ${active ? activeClasses[color] : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
    >
      <div className={`${active ? '' : 'text-slate-400'}`}>{icon}</div>
      {label}
    </button>
  );
}

function MobileNavButton({ icon, label, active, onClick, color = '' }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${active ? (color || 'text-orange-600') : 'text-slate-400 hover:text-slate-600'}`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function DocTab({ label, icon, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
    >
      {icon} {label}
    </button>
  );
}

// --- CERTIFICATE ---
function CertificateModal({ user, onClose }) {
  const certRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [jsPDFLoaded, setJsPDFLoaded] = useState(false);

  // Stable per-render values
  const certId = useMemo(
    () => `SA-${Date.now().toString(36).toUpperCase().slice(-6)}-${user.name.split(' ').map(n => n[0]).join('')}`,
    [user.name]
  );
  const issueDate = useMemo(
    () => new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    []
  );

  // Load jsPDF dynamically — single attempt, idempotent
  useEffect(() => {
    if (window.jspdf) { setJsPDFLoaded(true); return; }
    const existing = document.querySelector('script[data-jspdf]');
    if (existing) {
      existing.addEventListener('load', () => setJsPDFLoaded(true), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.dataset.jspdf = 'true';
    script.onload = () => setJsPDFLoaded(true);
    document.body.appendChild(script);
  }, []);

  const filename = `Saathi_Certificate_${user.name.replace(/\s+/g, '_')}`;

  const downloadPDF = useCallback(async () => {
    if (!jsPDFLoaded || !window.jspdf) return;
    setIsDownloading(true);
    try {
      const svgEl = certRef.current?.querySelector('svg');
      if (!svgEl) throw new Error('Certificate not ready');
      const canvas = await svgToCanvas(svgEl);
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, 297, 210);
      pdf.save(`${filename}.pdf`);
    } catch (e) {
      console.error('PDF failed:', e);
    } finally {
      setIsDownloading(false);
    }
  }, [jsPDFLoaded, filename]);

  const downloadPNG = useCallback(async () => {
    setIsDownloading(true);
    try {
      const svgEl = certRef.current?.querySelector('svg');
      if (!svgEl) throw new Error('Certificate not ready');
      const canvas = await svgToCanvas(svgEl);
      canvas.toBlob((blob) => downloadBlob(blob, `${filename}.png`), 'image/png');
    } catch (e) {
      console.error('PNG failed:', e);
    } finally {
      setIsDownloading(false);
    }
  }, [filename]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200] p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden my-8">
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award size={22} />
            <div>
              <h3 className="font-bold">Certificate of Civic Impact</h3>
              <p className="text-[11px] text-white/90">Issued by Saathi</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 bg-slate-100 overflow-x-auto">
          <div ref={certRef} className="mx-auto" style={{ maxWidth: '1000px' }}>
            <svg viewBox="0 0 1000 700" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', borderRadius: '8px' }}>
              <defs>
                <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fffbeb" />
                  <stop offset="100%" stopColor="#fef3c7" />
                </linearGradient>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>
                <radialGradient id="sealGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </radialGradient>
                <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              <rect width="1000" height="700" fill="url(#bgGrad)" />

              <g opacity="0.15" fill="#92400e">
                <circle cx="60" cy="60" r="40" />
                <circle cx="60" cy="60" r="25" fill="#fef3c7" />
                <circle cx="940" cy="60" r="40" />
                <circle cx="940" cy="60" r="25" fill="#fef3c7" />
                <circle cx="60" cy="640" r="40" />
                <circle cx="60" cy="640" r="25" fill="#fef3c7" />
                <circle cx="940" cy="640" r="40" />
                <circle cx="940" cy="640" r="25" fill="#fef3c7" />
              </g>

              <rect x="30" y="30" width="940" height="640" fill="none" stroke="url(#goldGrad)" strokeWidth="4" rx="8" />
              <rect x="45" y="45" width="910" height="610" fill="none" stroke="#d97706" strokeWidth="1" rx="4" opacity="0.6" />

              <g transform="translate(500, 90)">
                <path d="M -120,0 Q -60,-15 0,0 Q 60,-15 120,0" stroke="#d97706" strokeWidth="2" fill="none" />
                <circle cx="0" cy="0" r="4" fill="#d97706" />
              </g>

              <g transform="translate(500, 130)">
                <rect x="-30" y="-18" width="60" height="36" rx="8" fill="url(#brandGrad)" />
                <text x="0" y="38" textAnchor="middle" fill="#1e293b" fontSize="14" fontWeight="bold" letterSpacing="3" fontFamily="Arial, sans-serif">SAATHI</text>
              </g>

              <text x="500" y="220" textAnchor="middle" fill="#78350f" fontSize="42" fontFamily="Georgia, serif" fontWeight="bold">Certificate of</text>
              <text x="500" y="270" textAnchor="middle" fill="#b45309" fontSize="52" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="bold">Civic Impact</text>

              <line x1="350" y1="295" x2="650" y2="295" stroke="#d97706" strokeWidth="2" />
              <circle cx="500" cy="295" r="4" fill="#d97706" />

              <text x="500" y="335" textAnchor="middle" fill="#78350f" fontSize="16" fontFamily="Georgia, serif" fontStyle="italic" letterSpacing="3">— PROUDLY PRESENTED TO —</text>

              <text x="500" y="400" textAnchor="middle" fill="#1e293b" fontSize="54" fontFamily="Georgia, serif" fontWeight="bold">{user.name}</text>
              <line x1="250" y1="420" x2="750" y2="420" stroke="#d97706" strokeWidth="1.5" />

              <text x="500" y="465" textAnchor="middle" fill="#475569" fontSize="16" fontFamily="Georgia, serif">in recognition of outstanding contribution to community welfare,</text>
              <text x="500" y="488" textAnchor="middle" fill="#475569" fontSize="16" fontFamily="Georgia, serif">demonstrating selfless service through volunteering, emergency response,</text>
              <text x="500" y="511" textAnchor="middle" fill="#475569" fontSize="16" fontFamily="Georgia, serif">and civic engagement in {user.location}.</text>

              <g transform="translate(180, 550)">
                <rect x="0" y="0" width="180" height="70" rx="8" fill="white" stroke="#d97706" strokeWidth="1.5" />
                <text x="90" y="28" textAnchor="middle" fill="#b45309" fontSize="28" fontWeight="bold" fontFamily="Georgia, serif">{user.volunteerHours}</text>
                <text x="90" y="52" textAnchor="middle" fill="#78350f" fontSize="11" fontFamily="Arial, sans-serif" letterSpacing="1.5">SERVICE HOURS</text>
              </g>
              <g transform="translate(410, 550)">
                <rect x="0" y="0" width="180" height="70" rx="8" fill="white" stroke="#d97706" strokeWidth="1.5" />
                <text x="90" y="28" textAnchor="middle" fill="#b45309" fontSize="28" fontWeight="bold" fontFamily="Georgia, serif">3</text>
                <text x="90" y="52" textAnchor="middle" fill="#78350f" fontSize="11" fontFamily="Arial, sans-serif" letterSpacing="1.5">MISSIONS COMPLETED</text>
              </g>
              <g transform="translate(640, 550)">
                <rect x="0" y="0" width="180" height="70" rx="8" fill="white" stroke="#d97706" strokeWidth="1.5" />
                <text x="90" y="28" textAnchor="middle" fill="#b45309" fontSize="28" fontWeight="bold" fontFamily="Georgia, serif">47</text>
                <text x="90" y="52" textAnchor="middle" fill="#78350f" fontSize="11" fontFamily="Arial, sans-serif" letterSpacing="1.5">LIVES IMPACTED</text>
              </g>

              <g transform="translate(150, 650)">
                <line x1="0" y1="0" x2="180" y2="0" stroke="#78350f" strokeWidth="1" />
                <text x="90" y="18" textAnchor="middle" fill="#78350f" fontSize="11" fontFamily="Georgia, serif" fontStyle="italic">Date of Issue</text>
                <text x="90" y="-8" textAnchor="middle" fill="#1e293b" fontSize="13" fontFamily="Georgia, serif" fontWeight="bold">{issueDate}</text>
              </g>
              <g transform="translate(670, 650)">
                <line x1="0" y1="0" x2="180" y2="0" stroke="#78350f" strokeWidth="1" />
                <text x="90" y="18" textAnchor="middle" fill="#78350f" fontSize="11" fontFamily="Georgia, serif" fontStyle="italic">Authorized Signatory</text>
                <text x="90" y="-8" textAnchor="middle" fill="#1e293b" fontSize="14" fontStyle="italic">A. Sharma, Director</text>
              </g>

              <g transform="translate(500, 640)">
                <circle cx="0" cy="0" r="40" fill="url(#sealGrad)" stroke="#92400e" strokeWidth="2" />
                <circle cx="0" cy="0" r="34" fill="none" stroke="#fef3c7" strokeWidth="1" />
                <g fill="#fffbeb">
                  <polygon points="0,-20 4,-6 18,-6 7,3 11,17 0,9 -11,17 -7,3 -18,-6 -4,-6" />
                </g>
                <path d="M -15,30 L -25,55 L -15,50 L -10,55 Z" fill="url(#ribbonGrad)" />
                <path d="M 15,30 L 25,55 L 15,50 L 10,55 Z" fill="url(#ribbonGrad)" />
              </g>

              <text x="500" y="685" textAnchor="middle" fill="#92400e" fontSize="9" fontFamily="Courier New, monospace" letterSpacing="1">CERTIFICATE ID: {certId}  •  VERIFY AT SAATHI.IN/VERIFY</text>
            </svg>
          </div>
        </div>

        <div className="bg-white border-t border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <p className="font-semibold text-slate-700">Certificate ID: <span className="font-mono">{certId}</span></p>
            <p className="mt-0.5">Verifiable at saathi.in/verify</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={downloadPNG}
              disabled={isDownloading}
              className="flex-1 sm:flex-initial bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download size={14} /> PNG
            </button>
            <button
              onClick={downloadPDF}
              disabled={isDownloading || !jsPDFLoaded}
              className="flex-1 sm:flex-initial bg-gradient-to-r from-orange-600 to-emerald-600 hover:from-orange-700 hover:to-emerald-700 text-white text-sm font-semibold py-2.5 px-5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
            >
              {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              {isDownloading ? 'Generating...' : !jsPDFLoaded ? 'Loading PDF...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CHAT ---
function ChatOverlay({ user, onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'other', text: `Hi, this is ${user.name}. I received your SOS and am heading towards your location. Are you safe?` }
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [pendingPII, setPendingPII] = useState(null);
  const [sexualStrikes, setSexualStrikes] = useState(0);
  const [banInfo, setBanInfo] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState(null);
  const [sharingLocation, setSharingLocation] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const STRIKE_THRESHOLD = 2;

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const detectPII = useCallback((text) => {
    const detected = [];
    const digitsOnly = text.replace(/\D/g, '');
    if (REGEX.phone.test(text) && digitsOnly.length >= 10) detected.push('phone number');
    if (REGEX.email.test(text)) detected.push('email address');
    if (REGEX.aadhaar.test(text)) detected.push('Aadhaar number');
    if (REGEX.address.test(text)) detected.push('address');
    return detected;
  }, []);

  const submitMessage = (msg) => {
    setMessages(prev => [...prev, { id: Date.now(), sender: 'me', ...msg }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'other', text: "Noted. I'll be there in 2 mins. Stay calm." }]);
    }, 3000);
  };

  const processModeration = async (userText) => {
    setIsSending(true);
    try {
      const prompt = `You are a chat moderator. Classify this message strictly into ONE category. Respond with ONLY the category name:
- "SAFE" — acceptable
- "SEXUAL" — sexual content or harassment
- "ABUSE" — abusive language, hate, threats
- "SPAM" — promotional spam

Message: "${userText}"`;

      const aiResponse = (await generateAIContent(prompt)).trim().toUpperCase();

      if (aiResponse.includes("SEXUAL")) {
        const newStrikes = sexualStrikes + 1;
        setSexualStrikes(newStrikes);

        if (newStrikes >= STRIKE_THRESHOLD) {
          const banUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
          const chatLog = [...messages, { sender: 'me', text: userText, flagged: true }];
          setBanInfo({ until: banUntil, reason: 'Repeated sexual content violations', chatLog });
          setMessages(prev => [...prev, {
            id: Date.now(), sender: 'system', severity: 'ban',
            text: `Account suspended for 24 hours. Multiple sexual content violations detected.`
          }]);
        } else {
          setMessages(prev => [...prev, {
            id: Date.now(), sender: 'system', severity: 'warning',
            text: `Warning ${newStrikes}/${STRIKE_THRESHOLD}: Sexual content not allowed. One more violation = 24-hour ban.`
          }]);
        }
      } else if (aiResponse.includes("ABUSE") || aiResponse.includes("SPAM")) {
        setMessages(prev => [...prev, {
          id: Date.now(), sender: 'system',
          text: `Message blocked: ${aiResponse.includes("ABUSE") ? "Abusive content" : "Spam"}`
        }]);
      } else {
        submitMessage({ text: userText });
      }
    } catch (e) {
      submitMessage({ text: userText });
    } finally {
      setIsSending(false);
    }
  };

  const handleSend = async () => {
    if (banInfo) return;
    // Send attachment if pending
    if (pendingAttachment) {
      const att = pendingAttachment;
      setPendingAttachment(null);
      const inputText = input.trim();
      setInput("");
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'me',
        text: inputText,
        attachment: att,
      }]);
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'other', text: "Got it, thanks." }]);
      }, 3000);
      return;
    }

    if (!input.trim()) return;
    const userText = input.trim();
    setInput("");
    const piiDetected = detectPII(userText);
    if (piiDetected.length > 0) {
      setPendingPII({ text: userText, detected: piiDetected });
      return;
    }
    await processModeration(userText);
  };

  const confirmPIIShare = async () => {
    const { text } = pendingPII;
    setPendingPII(null);
    await processModeration(text);
  };

  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be under 10 MB');
      return;
    }
    const isImage = file.type.startsWith('image/');
    if (isImage) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPendingAttachment({
          name: file.name,
          size: file.size,
          type: 'image',
          mime: file.type,
          dataUrl: ev.target.result,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setPendingAttachment({
        name: file.name,
        size: file.size,
        type: 'document',
        mime: file.type,
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const shareLocation = async () => {
    if (banInfo) return;
    setSharingLocation(true);
    if (!navigator.geolocation) {
      setMessages(prev => [...prev, {
        id: Date.now(), sender: 'system',
        text: 'Geolocation not supported on this device.'
      }]);
      setSharingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: 'me',
          locationShare: {
            lat,
            lng,
            accuracy: Math.round(pos.coords.accuracy),
            sharedAt: new Date().toLocaleTimeString(),
          },
        }]);
        setSharingLocation(false);
        setTimeout(() => {
          setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'other', text: 'Got your location. Heading there now.' }]);
        }, 2500);
      },
      () => {
        setMessages(prev => [...prev, {
          id: Date.now(), sender: 'system',
          text: 'Could not get location. Check permissions.'
        }]);
        setSharingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="fixed bottom-0 md:bottom-6 md:right-6 w-full md:w-96 h-[80vh] md:h-[500px] bg-white md:rounded-2xl shadow-2xl flex flex-col z-[100] border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-sm">{user.name}</h4>
            <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <ShieldAlert size={10} /> AI Moderation Active
              {sexualStrikes > 0 && !banInfo && (
                <span className="ml-1 bg-orange-500/30 text-orange-200 px-1.5 rounded">
                  {sexualStrikes}/{STRIKE_THRESHOLD} strikes
                </span>
              )}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}`}>
            {msg.sender === 'system' ? (
              <div className={`text-xs py-2 px-4 rounded-lg flex items-center gap-2 border max-w-[90%] text-center ${
                msg.severity === 'ban' ? 'bg-red-600 text-white border-red-700 font-semibold' :
                msg.severity === 'warning' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                'bg-red-50 text-red-600 border-red-100'
              }`}>
                <AlertOctagon size={14} className="shrink-0" /> {msg.text}
              </div>
            ) : (
              <div className={`max-w-[85%] flex flex-col gap-1 ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                {/* Location share bubble */}
                {msg.locationShare && (
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${msg.locationShare.lat}&mlon=${msg.locationShare.lng}#map=16/${msg.locationShare.lat}/${msg.locationShare.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`rounded-2xl overflow-hidden border-2 transition-shadow hover:shadow-md w-64 ${
                      msg.sender === 'me' ? 'border-orange-300' : 'border-slate-200'
                    }`}
                  >
                    <div className="bg-slate-100 h-24 relative overflow-hidden">
                      <iframe
                        title="loc"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${msg.locationShare.lng - 0.005}%2C${msg.locationShare.lat - 0.005}%2C${msg.locationShare.lng + 0.005}%2C${msg.locationShare.lat + 0.005}&layer=mapnik&marker=${msg.locationShare.lat}%2C${msg.locationShare.lng}`}
                        className="w-full h-full pointer-events-none"
                        loading="lazy"
                      />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-lg"></div>
                      </div>
                    </div>
                    <div className={`p-2.5 ${msg.sender === 'me' ? 'bg-orange-600 text-white' : 'bg-white text-slate-800'}`}>
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <MapPin size={12} /> Live Location Shared
                      </div>
                      <div className={`text-[10px] mt-0.5 font-mono ${msg.sender === 'me' ? 'text-orange-100' : 'text-slate-500'}`}>
                        {msg.locationShare.lat.toFixed(4)}, {msg.locationShare.lng.toFixed(4)} • ±{msg.locationShare.accuracy}m
                      </div>
                      <div className={`text-[10px] mt-0.5 ${msg.sender === 'me' ? 'text-orange-100' : 'text-slate-500'}`}>
                        Tap to open in maps
                      </div>
                    </div>
                  </a>
                )}

                {/* Attachment bubble */}
                {msg.attachment && (
                  <div className={`rounded-2xl overflow-hidden ${msg.sender === 'me' ? 'bg-orange-600' : 'bg-white border border-slate-200'}`}>
                    {msg.attachment.type === 'image' ? (
                      <img src={msg.attachment.dataUrl} alt={msg.attachment.name} className="max-w-[240px] max-h-[200px] object-cover" />
                    ) : (
                      <div className={`p-3 flex items-center gap-3 min-w-[200px] ${msg.sender === 'me' ? 'text-white' : 'text-slate-800'}`}>
                        <div className={`p-2 rounded ${msg.sender === 'me' ? 'bg-orange-700' : 'bg-slate-100'}`}>
                          <FileText size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate">{msg.attachment.name}</p>
                          <p className={`text-[10px] ${msg.sender === 'me' ? 'text-orange-100' : 'text-slate-500'}`}>
                            {formatFileSize(msg.attachment.size)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Text bubble */}
                {msg.text && (
                  <div className={`rounded-2xl px-4 py-2 text-sm ${
                    msg.sender === 'me' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {(isSending || sharingLocation) && (
          <div className="flex justify-end">
            <div className="bg-orange-600/50 text-white max-w-[80%] rounded-2xl rounded-tr-none px-4 py-2 text-sm flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              {sharingLocation ? 'Getting location...' : 'Verifying...'}
            </div>
          </div>
        )}

        {banInfo && (
          <div className="bg-white border-2 border-red-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-red-100 p-2 rounded-full text-red-600 shrink-0">
                <AlertOctagon size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 text-sm">24-Hour Suspension</h4>
                <p className="text-xs text-slate-600 mt-1">{banInfo.reason}</p>
              </div>
            </div>
            <button
              onClick={() => setShowReportModal(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <ShieldAlert size={14} /> Report to Cyber Cell
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {pendingPII && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
            <div className="bg-orange-50 border-b border-orange-100 p-4 flex items-start gap-3">
              <div className="bg-orange-100 p-2 rounded-full text-orange-600 shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Personal Information Detected</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Contains: <span className="font-semibold text-orange-700">{pendingPII.detected.join(', ')}</span>
                </p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-slate-700 mb-3">Sharing personal info can be misused. Do you still want to send?</p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-slate-700 break-words">{pendingPII.text}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setPendingPII(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-lg">
                  Cancel
                </button>
                <button onClick={confirmPIIShare} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold py-2.5 rounded-lg">
                  Send Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <CyberCellReportModal
          chatLog={banInfo.chatLog}
          reason={banInfo.reason}
          offender={user.name}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Attachment preview row */}
      {pendingAttachment && (
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          {pendingAttachment.type === 'image' ? (
            <img src={pendingAttachment.dataUrl} alt="" className="w-12 h-12 object-cover rounded" />
          ) : (
            <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center text-slate-600">
              <FileText size={20} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">{pendingAttachment.name}</p>
            <p className="text-[10px] text-slate-500">{formatFileSize(pendingAttachment.size)} • Ready to send</p>
          </div>
          <button onClick={() => setPendingAttachment(null)} className="text-slate-400 hover:text-red-500 p-1">
            <X size={14} />
          </button>
        </div>
      )}

      <div className="p-3 bg-white border-t border-slate-200">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={handleFilePick}
          className="hidden"
        />
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending || !!banInfo}
            title="Attach file"
            className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors disabled:opacity-50 shrink-0"
          >
            <Paperclip size={18} />
          </button>
          <button
            onClick={shareLocation}
            disabled={isSending || sharingLocation || !!banInfo}
            title="Share location"
            className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors disabled:opacity-50 shrink-0"
          >
            <MapPin size={18} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={banInfo ? "Chat suspended for 24 hours" : pendingAttachment ? "Add a caption..." : "Type a message..."}
            className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none disabled:opacity-50 min-w-0"
            disabled={isSending || !!banInfo}
          />
          <button
            onClick={handleSend}
            disabled={(!input.trim() && !pendingAttachment) || isSending || !!banInfo}
            className="bg-orange-600 text-white p-2.5 rounded-full hover:bg-orange-700 disabled:opacity-50 transition-colors shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CyberCellReportModal({ chatLog, reason, offender, onClose }) {
  const CYBER_CELL_EMAIL = "cybercrime@nciipc.gov.in";
  const [copied, setCopied] = useState(false);

  const transcript = chatLog
    .filter(m => m.sender !== 'system' || m.severity)
    .map(m => {
      const label = m.sender === 'me' ? 'Complainant' : m.sender === 'system' ? '[SYSTEM]' : offender;
      const flag = m.flagged ? ' [FLAGGED BY AI]' : '';
      return `${label}${flag}: ${m.text}`;
    }).join('\n');

  const reportBody = `CYBER CRIME COMPLAINT — Saathi App
=====================================
Incident Type: ${reason}
Reported At: ${new Date().toLocaleString()}
Offender: ${offender}
Action: 24-hour automated suspension

--- CHAT TRANSCRIPT ---
${transcript}
--- END ---`;

  const handleCopy = async () => {
    const ok = await copyToClipboard(reportBody);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Cyber Crime Report — ${reason}`);
    const body = encodeURIComponent(reportBody);
    window.open(`mailto:${CYBER_CELL_EMAIL}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert size={20} />
            <h3 className="font-bold">Report to Cyber Cell</h3>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4">
            <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Reporting To</div>
            <div className="font-mono text-sm text-slate-900">{CYBER_CELL_EMAIL}</div>
          </div>
          <div className="bg-slate-900 text-slate-200 rounded-lg p-4 text-[11px] font-mono leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap">
            {reportBody}
          </div>
        </div>
        <div className="p-4 border-t border-slate-200 flex gap-2">
          <button onClick={handleCopy} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2">
            {copied ? <><CheckCircle size={14} /> Copied</> : 'Copy Report'}
          </button>
          <button onClick={handleEmail} className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2">
            <Send size={14} /> Email Report
          </button>
        </div>
      </div>
    </div>
  );
}

// --- SPLASH SCREEN ---
function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('enter'); // enter | hold | exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 800);
    const t2 = setTimeout(() => setPhase('exit'), 2200);
    const t3 = setTimeout(() => onDone(), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-gradient-to-br from-orange-500 via-orange-600 to-emerald-600 transition-opacity duration-500 ${
        phase === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <style>{`
        @keyframes splashLogo {
          0% { transform: scale(0.5) rotate(-12deg); opacity: 0; }
          60% { transform: scale(1.08) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes splashText {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes splashTagline {
          0% { transform: translateY(12px); opacity: 0; letter-spacing: 0.2em; }
          100% { transform: translateY(0); opacity: 0.85; letter-spacing: 0.4em; }
        }
        @keyframes splashDot {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1); }
        }
        .splash-logo { animation: splashLogo 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .splash-name { animation: splashText 0.7s ease-out 0.5s both; }
        .splash-tagline { animation: splashTagline 0.9s ease-out 0.8s both; }
        .splash-dot { animation: splashDot 1.4s ease-in-out infinite; }
      `}</style>

      {/* Soft radial glow behind logo */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/20 rounded-full blur-3xl"></div>
      </div>

      {/* Logo */}
      <div className="splash-logo relative z-10 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-2 shadow-2xl border border-white/20">
          <SplashLogoMark size={140} />
        </div>
      </div>

      {/* Name */}
      <h1 className="splash-name text-white text-6xl font-black tracking-tight relative z-10 drop-shadow-lg">
        Saathi
      </h1>

      {/* Tagline */}
      <p className="splash-tagline text-white text-sm uppercase font-semibold mt-3 relative z-10">
        Your community companion
      </p>

      {/* Loading dots */}
      <div className="absolute bottom-12 flex gap-1.5">
        <span className="splash-dot w-2 h-2 bg-white rounded-full" style={{ animationDelay: '0s' }}></span>
        <span className="splash-dot w-2 h-2 bg-white rounded-full" style={{ animationDelay: '0.2s' }}></span>
        <span className="splash-dot w-2 h-2 bg-white rounded-full" style={{ animationDelay: '0.4s' }}></span>
      </div>

      {/* Bottom credit */}
      <p className="absolute bottom-4 text-white/60 text-[10px] uppercase tracking-widest font-semibold">
        Made for India 🇮🇳
      </p>
    </div>
  );
}

// Larger, more detailed logo mark for splash & auth screens
function SplashLogoMark({ size = 140 }) {
  const id = useMemo(() => `splash${Math.random().toString(36).slice(2, 7)}`, []);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id={`${id}-shield`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id={`${id}-heart`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <radialGradient id={`${id}-center`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fef3c7" />
        </radialGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill={`url(#${id}-grad)`} />
      <rect x="2" y="2" width="60" height="60" rx="12" fill="none" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
      <path d="M 32 14 L 18 18 L 18 32 Q 18 42 32 50 L 32 14 Z" fill={`url(#${id}-shield)`} />
      <path d="M 32 22 Q 32 18 36 18 Q 44 18 44 26 Q 44 34 32 44 Q 32 32 32 22 Z" fill={`url(#${id}-heart)`} />
      <circle cx="32" cy="32" r="5" fill={`url(#${id}-center)`} stroke="#1e293b" strokeWidth="0.5" />
      <circle cx="32" cy="32" r="2.5" fill="#1e293b" />
    </svg>
  );
}

// --- AUTH SCREEN ---
const DEMO_USER_PROFILE = {
  name: 'Jithu Sreekumar',
  location: 'Alappuzha, Kerala',
  bloodGroup: 'A+',
  role: 'Citizen',
  volunteerHours: 24,
};
const DEFAULT_OTP = '000000';

function AuthScreen({ onSuccess }) {
  const [screen, setScreen] = useState('landing');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [signupData, setSignupData] = useState({
    name: '', bloodGroup: '', email: '', idVerified: false, idType: null, idNumber: null, idDocument: null
  });
  const otpRefs = useRef([]);

  const isValidPhone = useCallback((p) => REGEX.indianMobile.test(p.replace(/\D/g, '')), []);

  const handleOtpChange = useCallback((idx, val) => {
    if (val.length > 1) {
      const digits = val.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = ['', '', '', '', '', ''];
      digits.forEach((d, i) => { newOtp[i] = d; });
      setOtp(newOtp);
      otpRefs.current[Math.min(digits.length, 5)]?.focus();
      return;
    }
    if (!/^\d?$/.test(val)) return;
    setOtp(prev => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
    setOtpError('');
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  }, []);

  const handleOtpKeyDown = useCallback((idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  }, [otp]);

  const verifyOtp = useCallback((afterScreen) => {
    setIsProcessing(true);
    setTimeout(() => {
      if (otp.join('') === DEFAULT_OTP) {
        setOtpError('');
        if (afterScreen === 'signin') {
          onSuccess({ ...DEMO_USER_PROFILE, phone: '+91 ' + phone });
        } else {
          setScreen('signup-details');
        }
      } else {
        setOtpError('Invalid OTP. Hint: try 000000 for demo.');
      }
      setIsProcessing(false);
    }, 800);
  }, [otp, phone, onSuccess]);

  const handleGoogleSignIn = useCallback(() => {
    setIsProcessing(true);
    setTimeout(() => {
      onSuccess({ ...DEMO_USER_PROFILE, email: 'jithu.sreekumar@gmail.com' });
    }, 1200);
  }, [onSuccess]);

  const completeSignup = useCallback(() => {
    setIsProcessing(true);
    setTimeout(() => {
      onSuccess({
        ...DEMO_USER_PROFILE,
        name: signupData.name || DEMO_USER_PROFILE.name,
        phone: '+91 ' + phone,
        email: signupData.email,
        bloodGroup: signupData.bloodGroup || 'A+',
        volunteerHours: 0,
        idType: signupData.idType,
        idNumber: signupData.idNumber,
      });
    }, 1000);
  }, [phone, signupData, onSuccess]);

  // Brand panel (left side on desktop) — large logo with name + tagline stacked below
  const BrandPanel = () => (
    <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-orange-500 via-orange-600 to-emerald-600 text-white p-10 md:w-1/2 relative overflow-hidden">
      <div className="absolute -right-20 -top-20 opacity-10">
        <SplashLogoMark size={400} />
      </div>

      <div className="relative z-10 flex flex-col items-start">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/20 mb-5">
          <SplashLogoMark size={96} />
        </div>
        <h1 className="text-6xl font-black tracking-tight leading-none">Saathi</h1>
        <p className="text-sm uppercase font-semibold tracking-[0.3em] text-white/90 mt-3">
          Your community companion
        </p>
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex items-start gap-3">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h3 className="font-bold">Emergency in seconds</h3>
            <p className="text-sm text-white/80">One-tap SOS shares live GPS with responders.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
            <HeartHandshake size={20} />
          </div>
          <div>
            <h3 className="font-bold">Volunteer locally</h3>
            <p className="text-sm text-white/80">Discover verified opportunities near you.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
            <Wrench size={20} />
          </div>
          <div>
            <h3 className="font-bold">Hyperlocal services</h3>
            <p className="text-sm text-white/80">Find trusted help — auto-fetched by location.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <BrandPanel />

      <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo header — large logo on top, name and tagline stacked */}
          <div className="md:hidden mb-8 flex flex-col items-center text-center">
            <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-emerald-600 rounded-3xl p-2 shadow-xl mb-4">
              <SplashLogoMark size={88} />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Saathi</h1>
            <p className="text-[10px] uppercase font-semibold tracking-[0.3em] text-slate-500 mt-2">
              Your community companion
            </p>
          </div>

          {screen === 'landing' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Welcome</h2>
                <p className="text-sm text-slate-500 mt-1">Sign in or create your Saathi account to continue.</p>
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={isProcessing}
                className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                Continue with Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs text-slate-400 font-medium uppercase">or</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              <button
                onClick={() => setScreen('signin-phone')}
                className="w-full bg-gradient-to-r from-orange-600 to-emerald-600 hover:from-orange-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Phone size={18} /> Sign in with Phone
              </button>

              <button
                onClick={() => setScreen('signup-phone')}
                className="w-full bg-white border-2 border-orange-200 hover:bg-orange-50 text-orange-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                Create New Account <ArrowRight size={16} />
              </button>

              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                By continuing, you agree to Saathi's Terms of Service and Privacy Policy.
                Your data stays in India and is encrypted end-to-end.
              </p>
            </div>
          )}

          {(screen === 'signin-phone' || screen === 'signup-phone') && (
            <div className="space-y-5 animate-in fade-in">
              <button onClick={() => setScreen('landing')} className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
                <ArrowLeft size={14} /> Back
              </button>

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {screen === 'signin-phone' ? 'Sign In' : 'Create Account'}
                </h2>
                <p className="text-sm text-slate-500 mt-1">Enter your phone number to receive an OTP.</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block">Phone Number</label>
                <div className="flex gap-2">
                  <div className="bg-slate-100 px-3 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 flex items-center">
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    className="flex-1 p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    autoFocus
                  />
                </div>
                {phone && !isValidPhone(phone) && (
                  <p className="text-xs text-red-500 mt-1">Enter a valid 10-digit Indian mobile number</p>
                )}
              </div>

              <button
                onClick={() => {
                  setOtp(['', '', '', '', '', '']);
                  setOtpError('');
                  setScreen(screen === 'signin-phone' ? 'signin-otp' : 'signup-otp');
                  setTimeout(() => otpRefs.current[0]?.focus(), 100);
                }}
                disabled={!isValidPhone(phone)}
                className="w-full bg-gradient-to-r from-orange-600 to-emerald-600 hover:from-orange-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send OTP <ArrowRight size={16} />
              </button>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-900 flex items-start gap-2">
                <KeyRound size={14} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Demo mode:</strong> Use OTP <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono">000000</code> to proceed.
                </div>
              </div>
            </div>
          )}

          {(screen === 'signin-otp' || screen === 'signup-otp') && (
            <div className="space-y-5 animate-in fade-in">
              <button 
                onClick={() => setScreen(screen === 'signin-otp' ? 'signin-phone' : 'signup-phone')} 
                className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
              >
                <ArrowLeft size={14} /> Change number
              </button>

              <div>
                <h2 className="text-2xl font-bold text-slate-900">Verify OTP</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Sent to <span className="font-semibold text-slate-700">+91 {phone}</span>
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block">Enter 6-digit OTP</label>
                <div className="flex gap-2 justify-between">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => otpRefs.current[idx] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength="6"
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 focus:ring-2 focus:ring-orange-500 outline-none transition-colors ${
                        otpError ? 'border-red-300 bg-red-50' : digit ? 'border-orange-400 bg-orange-50' : 'border-slate-200'
                      }`}
                    />
                  ))}
                </div>
                {otpError && <p className="text-xs text-red-500 mt-2 flex items-center gap-1"><AlertOctagon size={12} /> {otpError}</p>}
              </div>

              <button
                onClick={() => verifyOtp(screen === 'signin-otp' ? 'signin' : 'signup')}
                disabled={otp.join('').length !== 6 || isProcessing}
                className="w-full bg-gradient-to-r from-orange-600 to-emerald-600 hover:from-orange-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
              >
                {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : <>Verify & Continue <ArrowRight size={16} /></>}
              </button>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Didn't receive?</span>
                <button className="text-orange-600 font-semibold hover:underline">Resend OTP</button>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-900 flex items-start gap-2">
                <KeyRound size={14} className="text-blue-600 shrink-0 mt-0.5" />
                <div>Demo OTP: <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono font-bold">000000</code></div>
              </div>
            </div>
          )}

          {screen === 'signup-details' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="bg-green-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle size={10}/> Phone verified</span>
                <ChevronRight size={12} />
                <span className="font-semibold text-slate-700">Profile</span>
                <ChevronRight size={12} />
                <span>ID Verification</span>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900">Your Profile</h2>
                <p className="text-sm text-slate-500 mt-1">Help responders reach you faster.</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Full Name *</label>
                <input
                  type="text"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  placeholder="Jithu Sreekumar"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Email (optional)</label>
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Blood Group *</label>
                <div className="grid grid-cols-4 gap-2">
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <button
                      key={bg}
                      onClick={() => setSignupData({ ...signupData, bloodGroup: bg })}
                      className={`py-2 rounded-lg text-sm font-bold transition-colors ${
                        signupData.bloodGroup === bg 
                          ? 'bg-red-600 text-white' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setScreen('signup-digilocker')}
                disabled={!signupData.name || !signupData.bloodGroup}
                className="w-full bg-gradient-to-r from-orange-600 to-emerald-600 hover:from-orange-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
              >
                Continue to ID Verification <ArrowRight size={16} />
              </button>
            </div>
          )}

          {screen === 'signup-digilocker' && (
            <DigiLockerStep
              onComplete={(idData) => {
                setSignupData(prev => ({ ...prev, ...idData, idVerified: true }));
                completeSignup();
              }}
              onBack={() => setScreen('signup-details')}
              isCompleting={isProcessing}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function DigiLockerStep({ onComplete, onBack, isCompleting }) {
  // State: idle | connecting | choosing | fetching | success
  const [state, setState] = useState('idle');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const availableDocs = [
    { id: 'aadhaar', name: 'Aadhaar Card', issuer: 'UIDAI', icon: '🆔', number: 'XXXX XXXX 4521' },
    { id: 'pan', name: 'PAN Card', issuer: 'Income Tax Dept', icon: '💳', number: 'ABCDE1234F' },
    { id: 'driving', name: 'Driving License', issuer: 'Transport Dept', icon: '🚗', number: 'KL07 20180001234' },
    { id: 'voter', name: 'Voter ID', issuer: 'Election Commission', icon: '🗳️', number: 'ABC1234567' },
  ];

  const handleConnect = () => {
    setState('connecting');
    setTimeout(() => setState('choosing'), 1500);
  };

  const handleSelectDoc = (doc) => {
    setSelectedDoc(doc);
    setState('fetching');
    setTimeout(() => setState('success'), 2000);
  };

  const handleProceed = () => {
    onComplete({
      idType: selectedDoc.name,
      idNumber: selectedDoc.number,
      idDocument: selectedDoc.id,
    });
  };

  return (
    <div className="space-y-5 animate-in fade-in">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="bg-green-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle size={10}/> Phone</span>
        <ChevronRight size={12} />
        <span className="bg-green-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle size={10}/> Profile</span>
        <ChevronRight size={12} />
        <span className="font-semibold text-slate-700">ID Verification</span>
      </div>

      {state !== 'success' && (
        <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
          <ArrowLeft size={14} /> Back
        </button>
      )}

      <div>
        <h2 className="text-2xl font-bold text-slate-900">Verify Your Identity</h2>
        <p className="text-sm text-slate-500 mt-1">Required to ensure trust in emergency responses.</p>
      </div>

      {state === 'idle' && (
        <>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                DL
              </div>
              <div>
                <h3 className="font-bold text-slate-900">DigiLocker</h3>
                <p className="text-[11px] text-slate-600">Government of India • Trusted Identity</p>
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Fetch your government-issued ID directly from DigiLocker. Your documents stay encrypted and never leave the secure channel.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle size={14} className="text-green-600 shrink-0" />
              <span>Aadhaar, PAN, Driving License, Voter ID supported</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle size={14} className="text-green-600 shrink-0" />
              <span>Documents are auto-verified by issuing authority</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle size={14} className="text-green-600 shrink-0" />
              <span>Encrypted via Meri Pehchaan SSO</span>
            </div>
          </div>

          <button
            onClick={handleConnect}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Fingerprint size={18} /> Connect with DigiLocker
          </button>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2">
            <ShieldAlert size={14} className="text-amber-600 shrink-0 mt-0.5" />
            <div>ID verification is mandatory for Saathi to prevent misuse of SOS and protect verified responders.</div>
          </div>
        </>
      )}

      {state === 'connecting' && (
        <div className="py-12 flex flex-col items-center text-center">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              DL
            </div>
            <div className="absolute inset-0 rounded-2xl border-4 border-blue-400 animate-ping"></div>
          </div>
          <p className="mt-6 font-semibold text-slate-700">Connecting to DigiLocker...</p>
          <p className="text-xs text-slate-500 mt-1">Redirecting via Meri Pehchaan SSO</p>
        </div>
      )}

      {state === 'choosing' && (
        <>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-900 flex items-center gap-2">
            <CheckCircle size={14} className="text-green-600" />
            Connected to DigiLocker. Select a document to fetch.
          </div>
          <div className="space-y-2">
            {availableDocs.map(doc => (
              <button
                key={doc.id}
                onClick={() => handleSelectDoc(doc)}
                className="w-full bg-white border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl p-4 flex items-center gap-3 transition-colors text-left"
              >
                <div className="text-3xl">{doc.icon}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">{doc.name}</h4>
                  <p className="text-xs text-slate-500">{doc.issuer}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{doc.number}</p>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
              </button>
            ))}
          </div>
        </>
      )}

      {state === 'fetching' && (
        <div className="py-12 flex flex-col items-center text-center">
          <div className="relative w-32 h-40 bg-white border-2 border-slate-200 rounded-lg shadow-md overflow-hidden">
            <div className="p-2">
              <div className="text-2xl text-center mb-1">{selectedDoc.icon}</div>
              <div className="h-1.5 bg-slate-200 rounded mb-1"></div>
              <div className="h-1.5 bg-slate-200 rounded mb-1 w-3/4"></div>
              <div className="h-1.5 bg-slate-200 rounded w-1/2"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/40 to-transparent animate-pulse">
              <div className="h-1 bg-blue-500 absolute w-full" style={{ animation: 'scan 2s linear infinite' }}></div>
            </div>
            <style>{`
              @keyframes scan {
                0% { top: 0; }
                100% { top: 100%; }
              }
            `}</style>
          </div>
          <p className="mt-6 font-semibold text-slate-700 flex items-center gap-2">
            <ScanLine size={16} className="text-blue-600 animate-pulse" />
            Fetching {selectedDoc.name}...
          </p>
          <p className="text-xs text-slate-500 mt-1">Verifying with {selectedDoc.issuer}</p>
        </div>
      )}

      {state === 'success' && (
        <>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-md">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">ID Verified</h3>
                <p className="text-xs text-green-700">Successfully fetched from DigiLocker</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Document</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedDoc.icon}</span>
                <div>
                  <div className="font-bold text-sm text-slate-900">{selectedDoc.name}</div>
                  <div className="text-xs font-mono text-slate-600">{selectedDoc.number}</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleProceed}
            disabled={isCompleting}
            className="w-full bg-gradient-to-r from-orange-600 to-emerald-600 hover:from-orange-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
          >
            {isCompleting ? <><Loader2 size={16} className="animate-spin" /> Setting up your account...</> : <>Complete Registration <ArrowRight size={16} /></>}
          </button>
        </>
      )}
    </div>
  );
}
