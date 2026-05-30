import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  AlertTriangle, HeartHandshake, Wrench, FileText,
  Bell, MapPin, User, ShieldAlert, ShieldCheck,
  Clock, Star, ChevronRight, Activity,
  Database, Server, Code, CheckCircle, Radio,
  Navigation, Users, PhoneCall, Sparkles, Loader2,
  MessageSquare, Send, X, AlertOctagon, Award, Download,
  Phone, ArrowRight, ArrowLeft, Fingerprint, KeyRound, ScanLine,
  Paperclip, Image as ImageIcon, Wallet, TrendingUp, IndianRupee,
  Gift, Zap, ArrowDownToLine, ArrowUpRight, Plus, Sun, Moon, Heart, Menu
} from 'lucide-react';
import logoUrl from './assets/logo.png';

// --- BRAND ---
const BRAND = {
  name: 'Saathi',
  tagline: 'Your community companion',
};

function SaathiLogo({ size = 32, showWordmark = false, variant = 'default' }) {
  return (
    <div className="flex items-center gap-2">
      <img
        src={logoUrl}
        alt="Saathi Logo"
        style={{
          width: size,
          height: size,
          filter: 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.6)) drop-shadow(0 0 20px rgba(245, 158, 11, 0.4))'
        }}
        className="flex-shrink-0"
      />

      {showWordmark && (
        <div className="hidden sm:flex flex-col leading-none">
          <span className="font-bold text-xl tracking-tight text-[#f97316]">{BRAND.name}</span>
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

const LANGUAGES = {
  en: { name: 'English', nativeName: 'English' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी' },
  bn: { name: 'Bengali', nativeName: 'বাংলা' },
  mr: { name: 'Marathi', nativeName: 'मराठी' },
  te: { name: 'Telugu', nativeName: 'తెలుగు' },
  ta: { name: 'Tamil', nativeName: 'தமிழ்' },
  gu: { name: 'Gujarati', nativeName: 'ગુજરાતી' },
  ur: { name: 'Urdu', nativeName: 'اردو' },
  kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  ml: { name: 'Malayalam', nativeName: 'മലയാളം' },
  pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' }
};

const TRANSLATIONS = {
  en: {
    dashboard: "Dashboard",
    rescue: "Emergency Rescue",
    volunteer: "Volunteering",
    services: "Local Services",
    surveys: "Civic Surveys",
    activeSOS: "SOS Broadcast Active",
    emergencyAssist: "Emergency Assistance",
    triggerSOS: "TRIGGER SOS",
    stopBroadcast: "STOP BROADCAST",
    hyperlocalFeed: "Hyperlocal Feed",
    viewMap: "View Map",
    wallet: "Rewards Wallet",
    walletSub: "Tap to view earnings & withdraw",
    volunteerRegister: "Become a Saathi Volunteer",
    volunteerRegisterSub: "Help your community by responding to local SOS alerts, verifying service locations, and onboarding local shops.",
    registerBtn: "Register as a Volunteer",
    postAlertTitle: "Post Hyperlocal Alert",
    postAlertSub: "Share important updates directly with your local community",
    alertType: "Alert Type / Category",
    severity: "Severity",
    postAs: "Post As",
    title: "Title",
    description: "Description",
    locationDetails: "Location Details",
    contactName: "Contact Name",
    contactPhone: "Contact Phone",
    notes: "Instructions / Notes (Optional)",
    low: "Low",
    medium: "Medium",
    high: "High",
    publishAlert: "Publish Hyperlocal Alert",
    emergencySOS: "Emergency SOS",
    bloodHelp: "Blood Help",
    broadcastingLoc: "Broadcasting Location",
    standby: "Standby",
    liveGPS: "Live GPS Active",
    manualLoc: "Manual Location Set",
    fallbackLoc: "Using fallback location",
    youAreHere: "You are here",
    describeEmergency: "Describe Emergency (AI Triage)",
    emergencyPlaceholder: "E.g., 'Snake bite on the leg, person is feeling dizzy...'",
    analyzing: "Analyzing...",
    getAIAdvice: "Get AI Advice",
    aiGuidance: "Immediate AI Guidance:",
    emergencyContacts: "Emergency Contacts",
    notified: "Notified",
    nearbyResponders: "Nearby Responders",
    approvals: "Approvals",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    rescue: "आपातकालीन बचाव",
    volunteer: "स्वयंसेवा",
    services: "स्थानीय सेवाएं",
    surveys: "नागरिक सर्वेक्षण",
    activeSOS: "एसओएस प्रसारण सक्रिय",
    emergencyAssist: "आपातकालीन सहायता",
    triggerSOS: "एसओएस ट्रिगर करें",
    stopBroadcast: "प्रसारण रोकें",
    hyperlocalFeed: "हाइपरलोकल फीड",
    viewMap: "मानचित्र देखें",
    wallet: "पुरस्कार वॉलेट",
    walletSub: "कमाई देखने और निकालने के लिए टैप करें",
    volunteerRegister: "साथी स्वयंसेवक बनें",
    volunteerRegisterSub: "स्थानीय एसओएस अलर्ट का जवाब देकर, सेवा स्थानों की पुष्टि करके और स्थानीय दुकानों को जोड़कर अपने समुदाय की सहायता करें।",
    registerBtn: "स्वयंसेवक के रूप में पंजीकरण करें",
    postAlertTitle: "हाइपरलोकल अलर्ट पोस्ट करें",
    postAlertSub: "अपने स्थानीय समुदाय के साथ सीधे महत्वपूर्ण अपडेट साझा करें",
    alertType: "अलर्ट प्रकार / श्रेणी",
    severity: "तीव्रता",
    postAs: "इस रूप में पोस्ट करें",
    title: "शीर्षक",
    description: "विवरण",
    locationDetails: "स्थान विवरण",
    contactName: "संपर्क नाम",
    contactPhone: "संपर्क फोन",
    notes: "निर्देश / नोट्स (वैकल्पिक)",
    low: "निम्न",
    medium: "मध्यम",
    high: "उच्च",
    publishAlert: "हाइपरलोकल अलर्ट प्रकाशित करें",
  },
  ml: {
    dashboard: "ഡാഷ്‌ബോർഡ്",
    rescue: "അടിയന്തിര രക്ഷാപ്രവർത്തനം",
    volunteer: "വോളണ്ടിയറിംഗ്",
    services: "പ്രാദേശിക സേവനങ്ങൾ",
    surveys: "സിവിക് സർവേകൾ",
    activeSOS: "SOS ബ്രോഡ്കാസ്റ്റ് സജീവം",
    emergencyAssist: "അടിയന്തിര സഹായം",
    triggerSOS: "SOS ട്രിഗർ ചെയ്യുക",
    stopBroadcast: "ബ്രോਡകാസ്റ്റ് നിർത്തുക",
    hyperlocalFeed: "ഹൈപ്പർലോക്കൽ ഫീഡ്",
    viewMap: "മാപ്പ് കാണുക",
    wallet: "റിവാർഡ് വാലറ്റ്",
    walletSub: "വരുമാനം കാണാനും പിൻവലിക്കാനും ടാപ്പ് ചെയ്യുക",
    volunteerRegister: "ഒരു സാഥി വോളണ്ടിയർ ആകുക",
    volunteerRegisterSub: "പ്രാദേശിക SOS അലേർട്ടുകളോട് പ്രതികരിച്ചും പ്രാദേശിക സ്റ്റോറുകൾ ചേർത്തും നിങ്ങളുടെ കമ്മ్యూണിറ്റിയെ സഹായിക്കുക.",
    registerBtn: "വോളണ്ടിയർ ആയി രജിസ്റ്റർ ചെയ്യുക",
  },
  ta: {
    dashboard: "டாஷ்போர்டு",
    rescue: "அவசரகால மீட்பு",
    volunteer: "தன்னார்வத் தொண்டு",
    services: "உள்ளூர் சேவைகள்",
    surveys: "குடிமை ஆய்வுகள்",
    activeSOS: "SOS ஒளிபரப்பு செயலில் உள்ளது",
    emergencyAssist: "அவசர உதவி",
    triggerSOS: "SOS தூண்டவும்",
    stopBroadcast: "ஒளிபரப்பை நிறுத்து",
    hyperlocalFeed: "ஹைப்பர்லோகல் ஃபீட்",
    viewMap: "வரைபடத்தைக் காண்க",
    wallet: "ரிவார்ட்ஸ் வாலட்",
    walletSub: "வருவாயைக் காண & திரும்பப் பெற தட்டவும்",
    volunteerRegister: "சாதி தன்னார்வலராகுங்கள்",
    volunteerRegisterSub: "உள்ளூர் SOS விழிப்பூட்டல்களுக்குப் பதிலளிப்பதன் மூலமும் உள்ளூர் கடைகளை இணைப்பதன் மூலமும் உங்கள் சமூகத்திற்கு உதவுங்கள்.",
    registerBtn: "தன்னார்வலராக பதிவு செய்யவும்",
  },
  bn: {
    dashboard: "ড্যাশবোর্ড",
    rescue: "জরুরী উদ্ধার",
    volunteer: "স্বেচ্ছাসেবা",
    services: "স্থানীয় পরিষেবা",
    surveys: "নাগরিক জরিপ",
    activeSOS: "SOS ব্রডকাস্ট সক্রিয়",
    emergencyAssist: "জরুরী সহায়তা",
    triggerSOS: "SOS ট্রিগার করুন",
    stopBroadcast: "ব্রডকাস্ট বন্ধ করুন",
    hyperlocalFeed: "হাইপারলোকাল ফিড",
    viewMap: "ম্যাপ দেখুন",
    wallet: "পুরস্কার ওয়ালেট",
    walletSub: "উপার্জন দেখতে এবং তুলতে ট্যাপ করুন",
    volunteerRegister: "সাথী স্বেচ্ছাসেবক হন",
    volunteerRegisterSub: "স্থানীয় SOS অ্যালার্টের প্রতিক্রিয়া জানিয়ে এবং স্থানীয় দোকানগুলি অনবোর্ড করে আপনার সম্প্রদায়কে সহায়তা করুন।",
    registerBtn: "স্বেচ্ছাসেবক হিসাবে নিবন্ধন করুন",
  },
  mr: {
    dashboard: "डॅशबोर्ड",
    rescue: "आणीबाणी बचाव",
    volunteer: "स्वयंसेवा",
    services: "स्थानिक सेवा",
    surveys: "नागरी सर्वेक्षण",
    activeSOS: "SOS प्रसारण सक्रिय",
    emergencyAssist: "आणीबाणी मदत",
    triggerSOS: "SOS ट्रिगर करा",
    stopBroadcast: "प्रसारण थांबवा",
    hyperlocalFeed: "हायपरलोकल फीड",
    viewMap: "नकाशा पहा",
    wallet: "रिवॉर्ड्स वॉलेट",
    walletSub: "कमाई पाहण्यासाठी आणि काढण्यासाठी टॅप करा",
    volunteerRegister: "साथी स्वयंसेवक बना",
    volunteerRegisterSub: "स्थानिक SOS अलर्टना प्रतिसाद देऊन आणि स्थानिक दुकाने ऑनबोर्ड करून तुमच्या समुदायाला मदत करा।",
    registerBtn: "स्वयंसेवक म्हणून नोंदणी करा",
  },
  te: {
    dashboard: "డాష్‌బోర్డ్",
    rescue: "అత్యవసర రక్షణ",
    volunteer: "স্বচ্ছந்த సేవ",
    services: "స్థానిక సేవలు",
    surveys: "పౌర సర్వేలు",
    activeSOS: "SOS ప్రసారం యాక్టివ్‌గా ఉంది",
    emergencyAssist: "అత్యవసర సహాయం",
    triggerSOS: "SOS ని యాక్టివేట్ చేయి",
    stopBroadcast: "ಪ್ರಸಾರ ಪ್ರಸಾರವನ್ನು ನಿಲ್ಲಿಸಿ",
    hyperlocalFeed: "హైపర్‌లోకల్ ఫీడ్",
    viewMap: "మ్యాప్ చూడండి",
    wallet: "రివార్డ్స్ వాలెట్",
    walletSub: "సంపాదనను వీక్షించడానికి & విత్‌డ్రా చేయడానికి నొక్కండి",
    volunteerRegister: "సాథీ వాలంటీర్ అవ్వండి",
    volunteerRegisterSub: "స్థానిక SOS హెచ్చరికలకు ప్రతిస్పందించడం ద్వారా మరియు స్థానిక దుకాణాలను ఆన్‌బోర్డ్ చేయడం ద్వారా మీ కమ్యూనిటీకి సహాయం చేయండి.",
    registerBtn: "ವಾಲಂಟೀರ್‌గా నమోదు చేసుకోండి",
  },
  gu: {
    dashboard: "ડેશબોર્ડ",
    rescue: "ઇમરજન્સી બચાવ",
    volunteer: "સ્વયંસેવા",
    services: "સ્થાનિક સેવાઓ",
    surveys: "નાગરિક સર્વેક્ષણ",
    activeSOS: "SOS પ્રસારણ સક્રિય",
    emergencyAssist: "ઇમરજન્સી સહાય",
    triggerSOS: "SOS ટ્રિગર કરો",
    stopBroadcast: "પ્રસારણ બંધ કરો",
    hyperlocalFeed: "હાઇપરલોકલ ફીડ",
    viewMap: "નકશો જુઓ",
    wallet: "રિવોર્ડ્સ વોલેટ",
    walletSub: "કમાણી જોવા અને ઉપાડવા માટે ટેપ કરો",
    volunteerRegister: "સાથી સ્વયંસેવક બનો",
    volunteerRegisterSub: "સ્થાનિક SOS ચેતવણીઓનો જવાબ આપીને અને સ્થાનિક દુકાનો ઓનબોર્ડ કરીને તમારા સમુદાયને મદદ કરો.",
    registerBtn: "સ્વયંસેવક તરીકે નોંધણી કરો",
  },
  ur: {
    dashboard: "ڈیش بورڈ",
    rescue: "ہنگامی بچاؤ",
    volunteer: "رضاکارانہ خدمت",
    services: "مقامی خدمات",
    surveys: "شہری سروے",
    activeSOS: "SOS نشریات فعال ہے",
    emergencyAssist: "ہنگامی مدد",
    triggerSOS: "SOS چالو کریں",
    stopBroadcast: "نشریات روکیں",
    hyperlocalFeed: "ہائپر لوکل فیڈ",
    viewMap: "نقشہ دیکھیں",
    wallet: "انعامات والیٹ",
    walletSub: "کمائی دیکھنے اور نکالنے کے لیے تھپتھپائیں",
    volunteerRegister: "ساتھی رضاکار بنیں",
    volunteerRegisterSub: "مقامی SOS الرٹس کا جواب دے کر اور مقامی دکانوں کو شامل کر کے اپنے معاشرے کی مدد کریں۔",
    registerBtn: "رضاکار کے طور پر رجسٹر کریں",
  },
  kn: {
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    rescue: "ತುರ್ತು ರಕ್ಷಣೆ",
    volunteer: "ಸ್ವಯಂಸೇವಕ ಸೇವೆ",
    services: "ಸ್ಥಳೀಯ ಸೇವೆಗಳು",
    surveys: "ನಾಗರಿಕ ಸಮೀಕ್ಷೆಗಳು",
    activeSOS: "SOS ಪ್ರಸಾರ ಸಕ್ರಿಯವಾಗಿದೆ",
    emergencyAssist: "ತುರ್ತು ಸಹಾಯ",
    triggerSOS: "SOS ಪ್ರಚೋದಿಸಿ",
    stopBroadcast: "ಪ್ರಸಾರ ನಿಲ್ಲಿಸಿ",
    hyperlocalFeed: "ಹೈಪರ್ಲೋಕಲ್ ಫೀಡ್",
    viewMap: "ನಕ್ಷೆ ನೋಡಿ",
    wallet: "ರಿವಾರ್ಡ್ಸ್ ವಾಲೆಟ್",
    walletSub: "ಗಳಿಕೆಯನ್ನು ವೀಕ್ಷಿಸಲು ಮತ್ತು ಹಿಂಪಡೆಯಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
    volunteerRegister: "ಸಾಥಿ ಸ್ವಯಂಸೇವಕರಾಗಿ",
    volunteerRegisterSub: "ಸ್ಥಳೀಯ SOS ಎಚ್ಚರಿಕೆಗಳಿಗೆ ಪ್ರತಿಕ್ರಿಯಿಸುವ ಮೂಲಕ ಮತ್ತು ಸ್ಥಳೀಯ ಮಳಿಗೆಗಳನ್ನು ಆನ್‌ಬೋರ್ಡ್ ಮಾಡುವ ಮೂಲಕ ನಿಮ್ಮชุมದಾಯಕ್ಕೆ ಸಹಾಯ ಮಾಡಿ.",
    registerBtn: "ಸ್ವಯಂಸೇವಕರಾಗಿ ನೋಂದಾಯಿಸಿ",
  },
  pa: {
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    rescue: "ਐਮਰਜੈਂਸੀ ਬਚਾਅ",
    volunteer: "ਵਲੰਟੀਅਰਿੰਗ",
    services: "ਸਥਾਨਕ ਸੇਵਾਵਾਂ",
    surveys: "ਨਾਗਰਿਕ ਸਰਵੇਖਣ",
    activeSOS: "SOS ਪ੍ਰਸਾਰਣ ਸਰਗਰਮ",
    emergencyAssist: "ਐਮਰਜੈਂਸੀ ਸਹਾਇਤਾ",
    triggerSOS: "SOS ਚਾਲੂ ਕਰੋ",
    stopBroadcast: "ਪ੍ਰਸਾਰਣ ਰੋਕੋ",
    hyperlocalFeed: "ਹਾਇਪਰਲੋਕਲ ਫੀਡ",
    viewMap: "ਨਕਸ਼ਾ ਦੇਖੋ",
    wallet: "ਇਨਾਮ ਵਾਲਿਟ",
    walletSub: "ਕਮਾਈ ਦੇਖਣ ਅਤੇ ਕਢਵਾਉਣ ਲਈ ਟੈਪ ਕਰੋ",
    volunteerRegister: "ਸਾਥੀ ਵਲੰਟੀਅਰ ਬਣੋ",
    volunteerRegisterSub: "ਸਥਾਨਕ SOS ਅਲਰਟਾਂ ਦਾ ਜਵਾਬ ਦੇ ਕੇ ਅਤੇ ਸਥਾਨਕ ਦੁਕਾਨਾਂ ਨੂੰ ਆਨਬੋਰਡ ਕਰਕੇ ਆਪਣੇ ਭਾਈਚਾਰੇ ਦੀ ਮਦਦ ਕਰੋ।",
    registerBtn: "ਵਲੰਟੀਅਰ ਵਜੋਂ ਰਜਿਸਟਰ ਕਰੋ",
  }
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
  {
    id: 1,
    type: "Medical Emergency",
    title: "Urgent A+ Blood Needed",
    description: "Emergency blood requirement raised for a patient undergoing surgery at Alappuzha General Hospital.",
    location: "Alappuzha General Hospital (Blood Bank Wing)",
    contactName: "Dr. Sreekumar (Emergency Coordinator)",
    contactPhone: "+91 98765 43210",
    notes: "Please confirm your availability and recent donation history. If you are eligible and within 5km, please reach the hospital wings or contact the coordinator immediately.",
    distance: "0.5 km",
    time: "2 mins ago",
    status: "Active",
    severity: "high"
  },
  {
    id: 2,
    type: "Missing Person",
    title: "Missing Child: 12yo Rahul",
    description: "A 12-year-old child named Rahul has been reported missing. He was last seen near the Central Park playing area.",
    location: "Central Park and surrounding neighborhood (Coimbatore)",
    contactName: "Ramesh (Father / Guardian)",
    contactPhone: "+91 98765 43211",
    notes: "Rahul is wearing a blue t-shirt and white shoes. He is about 4'5\" tall, light-brown hair. If you have any leads, please contact the guardian or call 112 directly.",
    distance: "2.1 km",
    time: "1 hour ago",
    status: "Active",
    severity: "medium"
  },
  {
    id: 3,
    type: "Water Logging",
    title: "Water Logging NH66 Bypass",
    description: "Severe flooding reported near Ambalappuzha junction. Traffic advised to take alternative routes.",
    location: "NH66 Bypass Road, near Ambalappuzha junction",
    contactName: "Traffic Control Wing",
    contactPhone: "+91 484 233 4455",
    notes: "Cars and two-wheelers are strongly advised to take alternative bypass roads. Pedestrians should avoid walking near open storm drains.",
    distance: "1.2 km",
    time: "3 hours ago",
    status: "Resolved",
    severity: "low"
  },
];

const MOCK_VOLUNTEER = [
  { id: 1, title: "Blood Donation Camp", org: "Red Cross Society", orgVerified: true, date: "Tomorrow, 10 AM", lat: 28.6139, lng: 77.2090, tags: ["Medical", "Urgent"], description: "Donate blood to save lives" },
  { id: 2, title: "Lake Cleanup Drive", org: "EcoWarriors", orgVerified: true, date: "Sunday, 7 AM", lat: 28.5355, lng: 77.3910, tags: ["Environment"], description: "Help clean local water body" },
  { id: 3, title: "Food Distribution", org: "Helping Hands NGO", orgVerified: true, date: "Today, 6 PM", lat: 28.7041, lng: 77.1025, tags: ["Community"], description: "Distribute meals to homeless" },
  { id: 4, title: "Tree Plantation", org: "Green India Foundation", orgVerified: true, date: "Saturday, 8 AM", lat: 11.0168, lng: 76.9558, tags: ["Environment"], description: "Plant native saplings" },
  { id: 5, title: "Coding for Kids", org: "TechForAll", orgVerified: true, date: "Next Week", lat: 12.9716, lng: 77.5946, tags: ["Education"], description: "Teach kids programming basics" },
];

const MOCK_SERVICES = [
  { id: 1, category: "Ambulance", name: "City Life Support", rating: 4.8, lat: 28.6139, lng: 77.2090, registeredAt: "Connaught Place", verified: true, available: true, status: 'approved' },
  { id: 2, category: "Electrician", name: "Ravi Electricals", rating: 4.5, lat: 28.6200, lng: 77.2100, registeredAt: "Karol Bagh", verified: true, available: true, status: 'approved' },
  { id: 3, category: "Plumber", name: "QuickFix Plumbing", rating: 4.2, lat: 28.5355, lng: 77.3910, registeredAt: "Noida Sector 18", verified: false, available: false, status: 'approved' },
  { id: 4, category: "Ambulance", name: "MediCare Express", rating: 4.7, lat: 11.0168, lng: 76.9558, registeredAt: "Coimbatore Central", verified: true, available: true, status: 'approved' },
  { id: 5, category: "Electrician", name: "PowerFix Solutions", rating: 4.3, lat: 12.9716, lng: 77.5946, registeredAt: "Bangalore HSR", verified: true, available: true, status: 'approved' },
  { id: 6, category: "Carpenter", name: "WoodCraft Studio", rating: 4.6, lat: 28.7041, lng: 77.1025, registeredAt: "North Delhi", verified: true, available: true, status: 'approved' },
  { id: 7, category: "Plumber", name: "Kuttanad Plumbing Works", rating: 4.4, lat: 9.5000, lng: 76.3400, registeredAt: "Alappuzha Town", verified: true, available: true, status: 'approved' },
  { id: 8, category: "Electrician", name: "Kerala Power Solutions", rating: 4.8, lat: 9.4800, lng: 76.3300, registeredAt: "Ambalappuzha", verified: true, available: true, status: 'approved' },
  { id: 9, category: "Towing", name: "Highway Recovery", rating: 4.1, lat: 9.4950, lng: 76.3350, registeredAt: "NH66 Alappuzha", verified: false, available: true, status: 'approved' },
  { id: 10, category: "Ambulance", name: "CareLine Medical", rating: 4.9, lat: 9.4900, lng: 76.3500, registeredAt: "Medical College Area", verified: true, available: true, status: 'approved' },
];

const MOCK_SURVEYS = [
  { id: 1, title: "Ward 42 Road Quality Assessment", authority: "City Corporation", expires: "2 days left", responses: 450, status: 'approved' },
  { id: 2, title: "Post-Monsoon Health Check", authority: "Health Dept", expires: "5 days left", responses: 1200, status: 'approved' },
  { id: 3, title: "Canal Cleaning Initiative Feedback", authority: "Alappuzha Municipality", expires: "3 days left", responses: 850, status: 'approved' },
  { id: 4, title: "Public Transport Efficiency", authority: "KSRTC", expires: "1 week left", responses: 2300, status: 'approved' },
  { id: 5, title: "Waste Management Survey", authority: "Pollution Control Board", expires: "Tomorrow", responses: 3120, status: 'approved' },
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
  HealthcareWorker: 'Post hyperlocal health & medical alerts (ASHA, Doctor, Blood Bank, Hospital).',
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
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const formatDistance = (km) => {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
};

// --- AI INTEGRATION (Mock Simulation) ---
// Since this is a frontend-only app, we mock the AI responses to avoid CORS errors and API key leaks.
const generateAIContent = async (prompt) => {
  await new Promise(res => setTimeout(res, 1200)); // Simulate network latency

  const lowerPrompt = prompt.toLowerCase();

  // 1. Chat Moderation
  if (lowerPrompt.includes("chat moderator")) {
    if (lowerPrompt.match(/\b(sex|kiss|fuck)\b/)) return "SEXUAL";
    if (lowerPrompt.match(/\b(kill|hate|stupid|idiot|die|abuse)\b/)) return "ABUSE";
    if (lowerPrompt.match(/\b(buy|sell|discount|promo|cheap)\b/)) return "SPAM";
    return "SAFE";
  }

  // 2. Survey Insights
  if (lowerPrompt.includes("civic analyst")) {
    return "Citizens are generally concerned about the current state of infrastructure and are demanding quicker resolutions. Many have noted that recent improvements are a step in the right direction, but more consistent maintenance is required.";
  }

  // 3. Emergency Advice
  if (lowerPrompt.includes("emergency response ai")) {
    if (lowerPrompt.match(/fire|burn/)) {
      return "1. Evacuate the area immediately using the stairs, not elevators.\n2. Call the fire department (101).\n3. If caught in smoke, drop to the floor and crawl to safety.";
    }
    if (lowerPrompt.match(/accident|crash|bleeding|hurt/)) {
      return "1. Ensure the area is safe before approaching the victim.\n2. Do not move the person unless there is immediate danger.\n3. Apply direct pressure to any bleeding wounds with a clean cloth.";
    }
    return "1. Stay calm and ensure you are in a safe location.\n2. Call emergency services immediately.\n3. Do not intervene unless you are trained in first aid.";
  }

  return "No response generated.";
};

// Clipboard fallback for execCommand environments
const copyToClipboard = async (text) => {
  if (navigator.clipboard?.writeText) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) { }
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
// --- MISSING COMPONENTS ---
function EarningToast({ amount, source, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-emerald-950/90 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/30 flex items-center gap-2 shadow-lg z-50">
      <Award size={16} className="text-emerald-500" />
      <span className="font-bold text-sm">+{amount}</span>
      <span className="text-xs text-emerald-500/80">for {source}</span>
    </div>
  );
}

function PaymentModal({ amount, description, payer, onSuccess, onCancel }) {
  return (
    <Modal onClose={onCancel}>
      <ModalHeader icon={<IndianRupee size={20} />} title="Payment Required" subtitle={description} />
      <div className="p-6 space-y-4">
        <p className="text-sm text-slate-600">Please pay ₹{amount} to proceed with {description}. Payer: {payer}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={() => onSuccess()} className="flex-1 py-2 bg-rose-600 text-white rounded-xl shadow-md hover:bg-rose-700 transition-colors">Pay Now</button>
        </div>
      </div>
    </Modal>
  );
}

// --- MAIN APP ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#f8d7da', color: '#721c24', fontFamily: 'monospace', minHeight: '100vh' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Something went wrong.</h1>
          <p style={{ marginTop: '10px' }}>{this.state.error && this.state.error.toString()}</p>
          <pre style={{ marginTop: '20px', whiteSpace: 'pre-wrap', fontSize: '12px' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function AppWrapper() {
  return (
    <ErrorBoundary>
      <SaathiApp />
    </ErrorBoundary>
  );
}

function SaathiApp() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authedUser, setAuthedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [liveLocation, setLiveLocation] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [userRole, setUserRole] = useState(MOCK_USER.role);
  const [volunteerApplicationStatus, setVolunteerApplicationStatus] = useState('idle'); // idle | pending | approved | rejected
  const [volunteerRequests, setVolunteerRequests] = useState([
    { id: 1, name: "Amit Sharma", phone: "+91 98765 43220", email: "amit.sharma@example.com", status: "pending", date: "1 day ago", idType: "Aadhaar Card", idNumber: "XXXX XXXX 8892" },
    { id: 2, name: "Priya Patel", phone: "+91 98765 43221", email: "priya.patel@example.com", status: "pending", date: "2 hours ago", idType: "PAN Card", idNumber: "ABCDE5678G" },
  ]);
  const [bloodRequests, setBloodRequests] = useState([
    {
      id: 1,
      patientName: "K. R. Vijayan",
      bloodType: "O+",
      unitsNeeded: 3,
      hospital: "Alappuzha General Hospital (Ward 5)",
      doctorContact: "+91 94472 12345",
      approvalLetter: "req_cert_vijayan.pdf",
      requestorName: "Jithu Sreekumar",
      requestorPhone: "+91 98765 43210",
      status: "approved",
      responses: [
        { name: "Rahul S.", phone: "+91 94460 54321", status: "pledged" }
      ],
      date: "1 day ago",
      distance: "1.2 km"
    },
    {
      id: 2,
      patientName: "Amina Beevi",
      bloodType: "B-",
      unitsNeeded: 2,
      hospital: "Medical College Hospital, Alappuzha (ICU Wing)",
      doctorContact: "+91 98450 98765",
      approvalLetter: "doc_cert_amina.png",
      requestorName: "Salim Khan",
      requestorPhone: "+91 98765 88888",
      status: "pending",
      responses: [],
      date: "Just now",
      distance: "3.4 km"
    }
  ]);
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
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(null);
  const [securityScore, setSecurityScore] = useState(100);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [keyPair, setKeyPair] = useState(null);
  const [keyFingerprint, setKeyFingerprint] = useState('');
  const [lastSignedHash, setLastSignedHash] = useState('');
  const [isGPSManipulated, setIsGPSManipulated] = useState(false);
  const [gpsTelemetryScore, setGpsTelemetryScore] = useState(100);
  const [gpsLogs, setGpsLogs] = useState([]);
  const countdownTimerRef = useRef(null);
  const displayUser = authedUser || MOCK_USER;

  // Active DevTools open detection logic
  useEffect(() => {
    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      if (widthThreshold || heightThreshold) {
        setIsDevToolsOpen(true);
        setSecurityScore(prev => Math.max(60, prev - 10));
      } else {
        setIsDevToolsOpen(false);
      }
    };
    window.addEventListener('resize', checkDevTools);
    const interval = setInterval(checkDevTools, 2000);
    checkDevTools();
    return () => {
      window.removeEventListener('resize', checkDevTools);
      clearInterval(interval);
    };
  }, []);

  // WebCrypto Key Manager for Local Reports/Rewards attestation
  const generateUserKeys = async () => {
    try {
      const keys = await window.crypto.subtle.generateKey(
        { name: "ECDSA", namedCurve: "P-256" },
        true,
        ["sign", "verify"]
      );
      const pubExported = await window.crypto.subtle.exportKey("spki", keys.publicKey);
      const hashBuffer = await window.crypto.subtle.digest("SHA-256", pubExported);
      const fingerprint = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .slice(0, 8)
        .toUpperCase();

      setKeyPair(keys);
      setKeyFingerprint(fingerprint);
      return { keys, fingerprint };
    } catch (e) {
      console.error("Cryptographic keypair generation failed:", e);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !keyPair) {
      generateUserKeys();
    }
  }, [isAuthenticated]);

  const signActionPayload = useCallback(async (actionType, payloadData) => {
    if (!keyPair) return '';
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify({ action: actionType, payload: payloadData, timestamp: Date.now() }));
      const signature = await window.crypto.subtle.sign(
        { name: "ECDSA", hash: { name: "SHA-256" } },
        keyPair.privateKey,
        data
      );
      const signatureArray = Array.from(new Uint8Array(signature));
      const signatureHex = signatureArray
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      const truncatedSig = signatureHex.slice(0, 16).toUpperCase();
      setLastSignedHash(truncatedSig);
      return signatureHex;
    } catch (e) {
      console.error("Payload signature failure:", e);
      return '';
    }
  }, [keyPair]);

  const userCoordsRef = useRef(null);
  useEffect(() => {
    userCoordsRef.current = userCoords;
  }, [userCoords]);

  // Geolocation Anti-Spoof Attestation
  const updateGPSAttestation = useCallback((newCoords) => {
    if (!newCoords) return;
    const isStaticOrZeroAccuracy = newCoords.accuracy === 0;
    let isImpossibleVelocity = false;
    const prevCoords = userCoordsRef.current;
    if (prevCoords) {
      const dist = haversineKm(prevCoords.lat, prevCoords.lng, newCoords.lat, newCoords.lng);
      if (dist > 150) {
        isImpossibleVelocity = true;
      }

    }

    if (isStaticOrZeroAccuracy || isImpossibleVelocity) {
      setIsGPSManipulated(true);
      setGpsTelemetryScore(50);
      setSecurityScore(prev => Math.max(50, prev - 25));
    } else {
      setIsGPSManipulated(false);
      setGpsTelemetryScore(100);
      setSecurityScore(100);
    }
  }, []);

  // Wallet — lifted to root so all modules can credit/debit
  const [walletBalance, setWalletBalance] = useState(245); // demo starting balance
  const [walletTxns, setWalletTxns] = useState([
    { id: 1, type: 'credit', source: 'commission', amount: 10, description: 'Onboarded Mullakkal Stores', date: '2 days ago', sig: 'SIG_A392F8_E52B' },
    { id: 2, type: 'credit', source: 'micro', amount: 5, description: 'Completed Govt Health Survey', date: '3 days ago', sig: 'SIG_A392F8_F012' },
    { id: 3, type: 'credit', source: 'micro', amount: 50, description: 'SOS Response - Medical Emergency', date: '5 days ago', sig: 'SIG_A392F8_A889' },
    { id: 4, type: 'credit', source: 'commission', amount: 10, description: 'Onboarded QuickFix Plumbing', date: '1 week ago', sig: 'SIG_A392F8_C445' },
    { id: 5, type: 'debit', source: 'payout', amount: 100, description: 'UPI Payout to *****1234', date: '2 weeks ago', sig: 'SIG_A392F8_D708' },
    { id: 6, type: 'credit', source: 'micro', amount: 10, description: 'Verified service location', date: '3 weeks ago', sig: 'SIG_A392F8_B112' },
  ]);
  const [showWallet, setShowWallet] = useState(false);
  const [services, setServices] = useState(MOCK_SERVICES);
  const [surveys, setSurveys] = useState(MOCK_SURVEYS);
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [showPostAlertModal, setShowPostAlertModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [healthcareSubRole, setHealthcareSubRole] = useState('ASHA'); // ASHA | Bloodbank | Doctor | Hospital

  const addWalletTxn = useCallback((txn) => {
    signActionPayload(txn.type === 'credit' ? 'REWARDS_CREDIT' : 'REWARDS_DEBIT', txn);
    setWalletTxns(prev => [
      {
        ...txn,
        id: Date.now(),
        date: 'just now',
        sig: `SIG_${keyFingerprint || 'SYS'}_${Math.random().toString(36).substring(3, 7).toUpperCase()}`
      },
      ...prev
    ]);
    setWalletBalance(prev => txn.type === 'credit' ? prev + txn.amount : prev - txn.amount);
  }, [keyFingerprint, signActionPayload]);

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
    // Detect iframe sandbox — common in preview environments
    const inIframe = window.self !== window.top;
    if (inIframe) {
      // In sandbox preview, immediately enter manual mode to avoid flickering geolocation errors
      setLocationStatus('manual');
      setLocationError('');
      return;
    }

    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      setLocationError('Geolocation is not supported in this browser.');
      return;
    }

    setLocationStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        setUserCoords(coords);
        updateGPSAttestation(coords);
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
  }, [updateGPSAttestation]);

  const requestLocationAgain = useCallback(() => {
    setLocationStatus('requesting');
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        setUserCoords(coords);
        updateGPSAttestation(coords);
        setLocationStatus('granted');
      },
      () => {
        setLocationStatus('denied');
        setShowLocationPicker(true);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [updateGPSAttestation]);

  const setManualLocation = useCallback((locName, lat, lng) => {
    const coords = { lat, lng, accuracy: 0 };
    setUserCoords(coords);
    updateGPSAttestation(coords);
    setResolvedLocation(locName);
    setLocationStatus('manual');
    setLocationError('');
    setShowLocationPicker(false);
  }, [updateGPSAttestation]);

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

  const startSOSCountdown = useCallback(() => {
    if (isSOSActive) {
      setIsSOSActive(false);
      return;
    }
    if (sosCountdown !== null) return;
    setSosCountdown(5);
    const interval = setInterval(() => {
      setSosCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsSOSActive(true);
          setActiveTab('rescue');
          // Cryptographically sign the SOS activation payload
          signActionPayload('SOS_ACTIVATE', { timestamp: Date.now() });
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    countdownTimerRef.current = interval;
  }, [isSOSActive, sosCountdown, signActionPayload]);

  const cancelSOSCountdown = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setSosCountdown(null);
  }, []);

  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  const t = useCallback((key) => {
    return TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS['en'][key];
  }, [currentLanguage]);

  const pendingApprovalsCount = useMemo(() => {
    return volunteerRequests.filter(r => r.status === 'pending').length +
      services.filter(s => s.status === 'pending').length +
      surveys.filter(s => s.status === 'pending').length +
      (bloodRequests || []).filter(r => r.status === 'pending').length;
  }, [volunteerRequests, services, surveys, bloodRequests]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeFeed t={t} isDarkMode={isDarkMode} startSOSCountdown={startSOSCountdown} isSOSActive={isSOSActive} setIsSOSActive={setIsSOSActive} liveLocation={liveLocation} onViewCertificate={() => setShowCertificate(true)} userRole={userRole} walletBalance={walletBalance} onOpenWallet={() => setShowWallet(true)} volunteerApplicationStatus={volunteerApplicationStatus} setVolunteerApplicationStatus={setVolunteerApplicationStatus} setVolunteerRequests={setVolunteerRequests} displayUser={displayUser} services={services} setActiveTab={setActiveTab} volunteerRequests={volunteerRequests} surveys={surveys} alerts={alerts} onOpenPostAlert={() => { setEditingAlert(null); setShowPostAlertModal(true); }} bloodRequests={bloodRequests} onEditAlert={(alert) => { setEditingAlert(alert); setShowPostAlertModal(true); }} onRemoveAlert={(id) => setAlerts(prev => prev.filter(a => a.id !== id))} />;
      case 'rescue': return <RescueModule t={t} isDarkMode={isDarkMode} isSOSActive={isSOSActive} setIsSOSActive={setIsSOSActive} liveLocation={liveLocation} onOpenChat={setActiveChatUser} userCoords={userCoords} locationStatus={locationStatus} bloodRequests={bloodRequests} setBloodRequests={setBloodRequests} userRole={userRole} addWalletTxn={addWalletTxn} creditMicro={creditMicro} showEarning={showEarning} keyFingerprint={keyFingerprint} signActionPayload={signActionPayload} />;
      case 'volunteer': return <VolunteerModule userCoords={userCoords} userRole={userRole} locationStatus={locationStatus} />;
      case 'services': return <ServicesModule userCoords={userCoords} locationStatus={locationStatus} userRole={userRole} onCommission={creditCommission} onShowEarning={showEarning} services={services} setServices={setServices} />;
      case 'survey': return <SurveyModule userRole={userRole} userCoords={userCoords} onMicroReward={creditMicro} onShowEarning={showEarning} surveys={surveys} setSurveys={setSurveys} />;
      case 'admin-approvals': return <AdminApprovalsModule volunteerRequests={volunteerRequests} setVolunteerRequests={setVolunteerRequests} services={services} setServices={setServices} surveys={surveys} setSurveys={setSurveys} userRole={userRole} setUserRole={setUserRole} setVolunteerApplicationStatus={setVolunteerApplicationStatus} displayUser={displayUser} addWalletTxn={addWalletTxn} bloodRequests={bloodRequests} setBloodRequests={setBloodRequests} creditMicro={creditMicro} showEarning={showEarning} />;
      default: return <HomeFeed t={t} startSOSCountdown={startSOSCountdown} isSOSActive={isSOSActive} setIsSOSActive={setIsSOSActive} liveLocation={liveLocation} onViewCertificate={() => setShowCertificate(true)} userRole={userRole} walletBalance={walletBalance} onOpenWallet={() => setShowWallet(true)} volunteerApplicationStatus={volunteerApplicationStatus} setVolunteerApplicationStatus={setVolunteerApplicationStatus} setVolunteerRequests={setVolunteerRequests} displayUser={displayUser} services={services} setActiveTab={setActiveTab} volunteerRequests={volunteerRequests} surveys={surveys} alerts={alerts} onOpenPostAlert={() => { setEditingAlert(null); setShowPostAlertModal(true); }} bloodRequests={bloodRequests} onEditAlert={(alert) => { setEditingAlert(alert); setShowPostAlertModal(true); }} onRemoveAlert={(id) => setAlerts(prev => prev.filter(a => a.id !== id))} />;
    }
  };

  // Show auth screen until logged in
  if (showSplash) {
    return <SplashScreen isDarkMode={isDarkMode} onDone={() => setShowSplash(false)} />;
  }

  if (!isAuthenticated) {
    return <AuthScreen isDarkMode={isDarkMode} currentLanguage={currentLanguage} setCurrentLanguage={setCurrentLanguage} onSuccess={(user) => {
      setAuthedUser(user);
      setIsAuthenticated(true);

      if (user.registerAsVolunteer) {
        setUserRole('Citizen');
        setVolunteerApplicationStatus('pending');
        setVolunteerRequests(prev => [
          {
            id: Date.now(),
            name: user.name || "Jithu Sreekumar",
            phone: user.phone || "+91 98765 43210",
            email: user.email || "",
            status: "pending",
            date: "Just now",
            idType: user.idType || "Aadhaar Card",
            idNumber: user.idNumber || "XXXX XXXX 4521"
          },
          ...prev
        ]);
      } else {
        setUserRole(user.role || 'Citizen');
        setVolunteerApplicationStatus('idle');
      }
    }} />;
  }

  return (
    <div className={`flex flex-col h-screen font-sans overflow-hidden relative transition-colors ${isDarkMode ? 'bg-[#070913] text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      {!isDarkMode && (
        <style>{`
          /* Convert hardcoded dark backgrounds to light */
          .bg-slate-950,
          div[class*="bg-slate-950"],
          section[class*="bg-slate-950"],
          span[class*="bg-slate-950"] {
            background-color: #ffffff !important;
            color: #1e293b !important;
          }

          .bg-slate-900,
          div[class*="bg-slate-900"],
          aside[class*="bg-slate-900"],
          span[class*="bg-slate-900"] {
            background-color: #f8fafc !important;
            color: #1e293b !important;
          }

          .bg-slate-800,
          div[class*="bg-slate-800"],
          button[class*="bg-slate-800"],
          span[class*="bg-slate-800"] {
            background-color: #f1f5f9 !important;
            color: #0f172a !important;
          }

          /* NavButton Active States Mapping */
          .bg-orange-950\\/40, div[class*="bg-orange-950"], button[class*="bg-orange-950"] {
            background-color: #fff7ed !important;
            color: #ea580c !important;
          }
          .bg-emerald-950\\/40, div[class*="bg-emerald-950"], button[class*="bg-emerald-950"] {
            background-color: #ecfdf5 !important;
            color: #059669 !important;
          }
          .bg-red-950\\/40, .bg-red-950\\/30, div[class*="bg-red-950"], button[class*="bg-red-950"] {
            background-color: #fef2f2 !important;
            color: #dc2626 !important;
          }
          .bg-blue-950\\/40, div[class*="bg-blue-950"], button[class*="bg-blue-950"] {
            background-color: #eff6ff !important;
            color: #2563eb !important;
          }
          .bg-purple-950\\/40, .bg-purple-950\\/10, div[class*="bg-purple-950"], button[class*="bg-purple-950"] {
            background-color: #faf5ff !important;
            color: #9333ea !important;
          }

          /* Convert dark borders to light */
          .border-slate-800,
          .border-slate-700,
          .border-slate-850,
          div[class*="border-slate-800"],
          div[class*="border-slate-700"],
          div[class*="border-slate-850"] {
            border-color: #e2e8f0 !important;
          }

          /* Convert muted light text to darker text */
          .text-slate-200,
          .text-slate-300,
          .text-slate-400,
          span[class*="text-slate-200"],
          span[class*="text-slate-300"],
          span[class*="text-slate-400"],
          div[class*="text-slate-200"],
          div[class*="text-slate-300"],
          div[class*="text-slate-400"],
          p[class*="text-slate-300"],
          p[class*="text-slate-400"] {
            color: #475569 !important;
          }

          /* Hover states for dark items */
          .hover\\:bg-slate-900:hover,
          .hover\\:bg-slate-800:hover,
          .hover\\:bg-slate-900\\/60:hover,
          button[class*="hover:bg-slate-900"]:hover,
          button[class*="hover:bg-slate-800"]:hover {
            background-color: #e2e8f0 !important;
            color: #0f172a !important;
          }
          
          .glass-panel {
            background-color: rgba(255, 255, 255, 0.9) !important;
            border-color: #e2e8f0 !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
          }
        `}</style>
      )}
      {isDarkMode && (
      <style>{`
        /* Premium, cohesive dark theme overrides globally */
        body, html {
          background-color: #070913 !important;
          color: #f1f5f9 !important;
        }

        /* Force dark theme for all white background elements */
        .bg-white,
        .bg-slate-50,
        .modal-content,
        div[class*="bg-white"],
        nav[class*="bg-white"],
        header[class*="bg-white"] {
          background-color: #0b0f19 !important;
          color: #e2e8f0 !important;
        }

        /* Make card and element borders dark and clean */
        .border-slate-200,
        .border-slate-300,
        .border-slate-100,
        .border-slate-250,
        .border-dashed {
          border-color: #1e293b !important;
        }

        /* Form inputs, textareas, selects look stunning in dark mode */
        input, select, textarea,
        input[class*="bg-white"],
        select[class*="bg-white"],
        textarea[class*="bg-white"] {
          background-color: #0d1527 !important;
          color: #f8fafc !important;
          border-color: #1e293b !important;
        }

        /* Correct all dark slate text colors to look premium bright slate-white */
        .text-slate-900,
        .text-slate-800,
        .text-slate-700,
        .text-slate-600,
        h2, h3, h4, h5, h6 {
          color: #f1f5f9 !important;
        }

        /* Muted helper text should be readable but secondary */
        .text-slate-500,
        .text-slate-400 {
          color: #94a3b8 !important;
        }

        /* Secondary cards or inner widgets should have a slightly different dark background */
        .bg-slate-50,
        .bg-slate-100,
        div[class*="bg-slate-50"],
        div[class*="bg-slate-100"] {
          background-color: #0e1726 !important;
        }

        /* Buttons and hover states should look premium */
        button[class*="hover:bg-slate-50"]:hover,
        button[class*="hover:bg-slate-100"]:hover,
        .hover\:bg-slate-50:hover,
        .hover\:bg-slate-100:hover {
          background-color: #1e293b !important;
        }

        /* Text selections inside chat and lists */
        .bg-white .text-slate-800,
        .bg-white .text-slate-700 {
          color: #f1f5f9 !important;
        }

        /* Pinned badges and alerts */
        .bg-orange-950\/40, .bg-emerald-950\/40, .bg-blue-950\/40, .bg-red-950\/40 {
          border-color: rgba(249, 115, 22, 0.15) !important;
        }

        /* Premium Grey Theme for Hyperlocal Feed Cards (#0f172a) */
        .hyperlocal-card {
          background-color: #0f172a !important; /* Deep Slate Grey */
          background-image: none !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hyperlocal-card-blood {
          border: 1px solid rgba(244, 63, 94, 0.4) !important; /* Soft rose border */
          box-shadow: 0 0 15px rgba(244, 63, 94, 0.08);
        }
        .hyperlocal-card-blood:hover {
          border-color: rgba(244, 63, 94, 0.9) !important; /* Glowing rose/red */
          box-shadow: 0 0 25px rgba(244, 63, 94, 0.25);
          transform: translateY(-2px);
        }

        .hyperlocal-card-high {
          border: 1px solid rgba(239, 68, 68, 0.3) !important; /* Soft red border */
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.05);
        }
        .hyperlocal-card-high:hover {
          border-color: rgba(239, 68, 68, 0.8) !important; /* Glowing high red */
          box-shadow: 0 0 25px rgba(239, 68, 68, 0.2);
          transform: translateY(-2px);
        }

        .hyperlocal-card-medium {
          border: 1px solid rgba(249, 115, 22, 0.3) !important; /* Soft orange border */
          box-shadow: 0 0 15px rgba(249, 115, 22, 0.05);
        }
        .hyperlocal-card-medium:hover {
          border-color: rgba(249, 115, 22, 0.8) !important; /* Glowing medium orange */
          box-shadow: 0 0 25px rgba(249, 115, 22, 0.2);
          transform: translateY(-2px);
        }

        .hyperlocal-card-low {
          border: 1px solid rgba(148, 163, 184, 0.2) !important; /* Soft slate/grey border */
          box-shadow: 0 0 15px rgba(148, 163, 184, 0.02);
        }
        .hyperlocal-card-low:hover {
          border-color: rgba(148, 163, 184, 0.6) !important; /* Glowing low grey */
          box-shadow: 0 0 20px rgba(148, 163, 184, 0.15);
          transform: translateY(-2px);
        }

        /* Premium Slate Grey Theme for Volunteer Panel (#0f172a) */
        .volunteer-register-card {
          background-color: #0f172a !important; /* Cohesive deep slate-grey */
          background-image: none !important;
          border: 1px solid rgba(16, 185, 129, 0.3) !important; /* Soft emerald/green border */
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.05);
          transition: all 0.3s ease;
        }
        .volunteer-register-card:hover {
          border-color: rgba(16, 185, 129, 0.7) !important; /* Glowing green border */
          box-shadow: 0 0 25px rgba(16, 185, 129, 0.15);
        }
      `}</style>
      )}

      {/* Background Holographic Grid */}
      <div className="absolute inset-0 hologram-grid opacity-10 pointer-events-none"></div>

      {/* SECURE SANDBOX FLAG FOR DETECTED DEVTOOLS */}
      {isDevToolsOpen && (
        <div className="bg-red-950/90 backdrop-blur border-b border-red-500/30 px-4 py-1.5 text-center text-xs font-black text-red-200 flex items-center justify-center gap-2 relative z-[999] animate-pulse">
          <ShieldAlert size={14} className="animate-bounce" />
          <span>[SECURE SANDBOX ACTIVE: READ-ONLY AUDIT MODE DETECTED]</span>
        </div>
      )}

      <header className={`backdrop-blur-md shadow-2xl border-b sticky top-0 z-50 ${isDarkMode ? 'bg-[#0b0f19]/80 border-slate-800/80' : 'bg-white/90 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isAuthenticated && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`hidden md:flex p-2 -ml-2 rounded-xl transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
              >
                <Menu size={24} />
              </button>
            )}
            <SaathiLogo size={36} showWordmark={false} />
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="relative" data-dropdown>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLanguageMenu(!showLanguageMenu);
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-orange-950/40 hover:bg-orange-900/60 text-orange-400 transition-all border border-orange-500/20 cursor-pointer"
              >
                <span className="hidden sm:inline">{LANGUAGES[currentLanguage]?.nativeName || 'English'}</span>
                <span className="sm:hidden">{LANGUAGES[currentLanguage]?.nativeName.slice(0, 2).toUpperCase() || 'EN'}</span>
                <ChevronRight size={12} className={`transform transition-transform ${showLanguageMenu ? 'rotate-90' : ''}`} />
              </button>
              {showLanguageMenu && (
                <div className="absolute left-0 mt-2 w-36 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-1">
                    {Object.keys(LANGUAGES).map(langCode => (
                      <button
                        key={langCode}
                        onClick={() => {
                          setCurrentLanguage(langCode);
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between ${currentLanguage === langCode ? 'bg-orange-950/50 text-orange-400 font-bold border border-orange-500/10' : 'hover:bg-slate-800 text-slate-300'}`}
                      >
                        <span>{LANGUAGES[langCode].nativeName}</span>
                        {currentLanguage === langCode && <CheckCircle size={10} className="text-orange-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors duration-200 border cursor-default select-none pointer-events-none ${locationStatus === 'granted' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' :
              locationStatus === 'manual' ? 'bg-blue-950/40 text-blue-400 border-blue-500/20' :
                locationStatus === 'requesting' ? 'bg-blue-950/40 text-blue-400 border-blue-500/20' :
                  locationStatus === 'denied' || locationStatus === 'unavailable' ? 'bg-orange-950/40 text-orange-400 border-orange-500/20' :
                    'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            title={
              locationStatus === 'granted' && userCoords ? `GPS: ${userCoords.lat.toFixed(5)}, ${userCoords.lng.toFixed(5)} (±${Math.round(userCoords.accuracy)}m)` :
                locationStatus === 'manual' ? 'Manually set' :
                  locationStatus === 'denied' ? 'Location access blocked' :
                    locationStatus === 'requesting' ? 'Fetching location...' : ''
            }
          >
            {locationStatus === 'requesting' ? (
              <Loader2 size={14} className="text-blue-400 animate-spin" />
            ) : locationStatus === 'granted' ? (
              <div className="relative">
                <MapPin size={14} className="text-emerald-400" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-slate-900 animate-pulse"></span>
              </div>
            ) : locationStatus === 'manual' ? (
              <MapPin size={14} className="text-blue-400" />
            ) : locationStatus === 'denied' || locationStatus === 'unavailable' ? (
              <AlertTriangle size={14} className="text-orange-400 animate-pulse" />
            ) : (
              <MapPin size={14} className="text-slate-400" />
            )}
            <span className="truncate max-w-[70px] sm:max-w-xs">
              {locationStatus === 'requesting' ? 'Locating...' :
                locationStatus === 'denied' || locationStatus === 'unavailable' ? 'Location Disabled' :
                  resolvedLocation}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Real-time System Integrity Badge */}
            <div className="relative group cursor-default" data-dropdown>
              <div
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black transition-all border ${securityScore >= 90
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20 pulse-glow-success'
                  : 'bg-red-950/40 text-red-400 border-red-500/20 animate-pulse'
                  }`}
              >
                <Fingerprint size={13} className="animate-pulse" />
                <span className="hidden sm:inline">SECURE: {securityScore}%</span>
              </div>

              <div className="absolute right-0 mt-2 w-80 bg-slate-950/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-800/80 z-[300] hidden group-hover:block transition-all">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className={securityScore >= 90 ? 'text-emerald-400 animate-pulse' : 'text-red-400'} />
                    <span className="font-black text-xs text-white">Client Integrity Shield</span>
                  </div>
                  <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">ACTIVE</span>
                </div>

                <div className="space-y-2 text-[11px] text-slate-300">
                  <div className="flex justify-between items-center">
                    <span>Cryptographic Keypair:</span>
                    <span className="font-mono text-emerald-400 font-bold">{keyFingerprint ? `ACTIVE (${keyFingerprint})` : 'MOCKED/SYSTEM'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>DevTools Audit Mode:</span>
                    <span className={isDevToolsOpen ? 'text-red-400 font-bold animate-pulse' : 'text-emerald-400 font-bold'}>
                      {isDevToolsOpen ? 'FLAGGED (READ-ONLY)' : 'SAFE (SECURE)'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>GPS Telemetry Score:</span>
                    <span className={isGPSManipulated ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {gpsTelemetryScore}% ({isGPSManipulated ? 'SPROOFED' : 'VERIFIED'})
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Active Attestation Seal:</span>
                    <span className="font-mono text-[9px] text-slate-400 truncate max-w-[140px]">{lastSignedHash || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet — visible to Volunteer/NGO/Admin */}
            {['Volunteer', 'NGO', 'Admin'].includes(userRole) && (
              <button
                onClick={() => setShowWallet(true)}
                title={`Wallet: ${formatINR(walletBalance)}`}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950 border border-amber-500/20 hover:border-amber-400 transition-colors cursor-pointer"
              >
                <Wallet size={14} className="text-amber-400" />
                <span className="text-xs font-bold text-amber-500 hidden sm:inline">{formatINR(walletBalance)}</span>
              </button>
            )}
            <div className="relative" data-dropdown>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifPanel(!showNotifPanel);
                  setShowProfileMenu(false);
                }}
                className={`relative p-2 rounded-full transition-colors cursor-pointer ${showNotifPanel ? 'bg-orange-950/40 text-orange-400 border border-orange-500/20' : 'text-slate-400 hover:bg-slate-900'}`}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full border border-slate-900 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifPanel && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-950">
                    <div>
                      <h4 className="font-bold text-xs text-white">Notifications</h4>
                      <p className="text-[10px] text-slate-500">{unreadCount} unread</p>
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-orange-400 font-semibold hover:underline cursor-pointer">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto bg-slate-900">
                    {notifications.map(notif => {
                      const icons = {
                        sos: <ShieldAlert size={14} className="text-red-400" />,
                        volunteer: <HeartHandshake size={14} className="text-green-400" />,
                        survey: <FileText size={14} className="text-blue-400" />,
                        service: <Wrench size={14} className="text-orange-400" />,
                        civic: <Star size={14} className="text-amber-400" />
                      };
                      const bgs = {
                        sos: 'bg-red-950/40 border border-red-500/10',
                        volunteer: 'bg-green-950/40 border border-green-500/10',
                        survey: 'bg-blue-950/40 border border-blue-500/10',
                        service: 'bg-orange-950/40 border border-orange-500/10',
                        civic: 'bg-amber-950/40 border border-amber-500/10'
                      };
                      return (
                        <button
                          key={notif.id}
                          onClick={() => markOneRead(notif.id)}
                          className={`w-full text-left p-3 border-b border-slate-800/40 hover:bg-slate-850 transition-colors flex gap-3 ${notif.unread ? 'bg-orange-950/10' : ''}`}
                        >
                          <div className={`w-8 h-8 ${bgs[notif.type]} rounded-full flex items-center justify-center shrink-0`}>
                            {icons[notif.type]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h5 className={`text-xs ${notif.unread ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>{notif.title}</h5>
                              {notif.unread && <span className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 shrink-0 animate-pulse"></span>}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{notif.body}</p>
                            <p className="text-[9px] text-slate-500 mt-1 flex items-center gap-1">
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
                className={`flex items-center gap-2 p-1 pr-2 rounded-full transition-colors cursor-pointer ${showProfileMenu ? 'bg-slate-900 border border-slate-800' : 'hover:bg-slate-900'}`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-black border border-slate-800 shadow-sm">
                  {displayUser.name.charAt(0)}
                </div>
                <span className="hidden sm:block text-[10px] font-black text-slate-300 tracking-wider uppercase">{userRole === 'HealthcareWorker' ? 'Healthcare' : userRole}</span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 rounded-2xl shadow-2xl border border-slate-850 z-50 overflow-hidden">
                  <div className="p-4 bg-gradient-to-br from-orange-500/90 via-orange-650/90 to-emerald-650/90 backdrop-blur-md text-white border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-lg font-black border border-white/30">
                        {displayUser.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs truncate">{displayUser.name}</h4>
                        <p className="text-[10px] text-white/95 mt-0.5 truncate">{displayUser.location}</p>
                        <p className="text-[9px] text-white/80 mt-0.5">Blood: {displayUser.bloodGroup} • Key: <span className="font-mono text-amber-300 font-bold">{keyFingerprint || 'GENERATING'}</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 bg-slate-900">
                    <div className="text-[9px] font-black text-slate-500 mb-1.5 px-2 uppercase tracking-widest">Switch Profile Role</div>
                    <div className="space-y-1">
                      {['Citizen', 'Volunteer', 'NGO', 'ServiceProvider', 'HealthcareWorker', 'Admin'].map(role => (
                        <button
                          key={role}
                          onClick={() => {
                            setUserRole(role);
                            setShowProfileMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-start justify-between gap-2 cursor-pointer ${userRole === role ? 'bg-orange-950/40 text-orange-400 border border-orange-500/10' : 'hover:bg-slate-800 text-slate-400'}`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold">{role === 'HealthcareWorker' ? 'Healthcare Worker' : role}</span>
                              {userRole === role && <CheckCircle size={10} className="text-orange-500 shrink-0" />}
                            </div>
                            <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">{ROLE_DESCRIPTIONS[role]}</p>
                          </div>
                        </button>
                      ))}
                    </div>

                    {userRole === 'HealthcareWorker' && (
                      <div className="mt-2.5 p-2 bg-slate-950 rounded-xl border border-slate-850">
                        <div className="text-[9px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Specialty Option</div>
                        <div className="grid grid-cols-2 gap-1">
                          {['ASHA', 'Bloodbank', 'Doctor', 'Hospital'].map(sub => (
                            <button
                              key={sub}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setHealthcareSubRole(sub);
                              }}
                              className={`px-2 py-1.5 rounded-lg text-[9px] font-extrabold text-left transition-all cursor-pointer ${healthcareSubRole === sub
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                                }`}
                            >
                              {sub === 'Bloodbank' ? 'Blood Bank' : sub}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-800 p-2 bg-slate-950">
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-950/30 rounded-lg transition-colors flex items-center gap-2 cursor-pointer font-bold"
                    >
                      <ArrowLeft size={12} /> Sign Out Securely
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 scroll-smooth relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
          {isSidebarOpen && (
          <aside className="hidden md:flex flex-col w-64 shrink-0 space-y-2">
            <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Activity size={20} />} label={t('dashboard')} />
            <NavButton active={activeTab === 'rescue'} onClick={() => setActiveTab('rescue')} icon={<ShieldAlert size={20} />} label={t('rescue')} color="red" />
            <NavButton active={activeTab === 'volunteer'} onClick={() => setActiveTab('volunteer')} icon={<HeartHandshake size={20} />} label={t('volunteer')} color="green" />
            <NavButton active={activeTab === 'services'} onClick={() => setActiveTab('services')} icon={<Wrench size={20} />} label={t('services')} color="orange" />
            <NavButton active={activeTab === 'survey'} onClick={() => setActiveTab('survey')} icon={<FileText size={20} />} label={t('surveys')} color="blue" />
            {['Admin', 'Volunteer'].includes(userRole) && (
              <NavButton
                active={activeTab === 'admin-approvals'}
                onClick={() => setActiveTab('admin-approvals')}
                icon={<ShieldCheck size={20} />}
                label={t('approvals')}
                color="purple"
                badge={pendingApprovalsCount}
              />
            )}

            <div className={`mt-8 p-4 rounded-xl border glass-panel ${userRole === 'Admin'
              ? 'border-purple-500/20 bg-purple-950/10'
              : 'border-slate-800 bg-slate-900/30'
              }`}>
              <div className="flex items-center gap-1.5 mb-1">
                <h4 className={`font-black text-xs uppercase tracking-wider ${userRole === 'Admin' ? 'text-purple-400' : 'text-orange-400'}`}>
                  Role: {userRole}
                </h4>
                {userRole === 'Admin' && (
                  <span className="text-[8px] font-black bg-purple-600 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Super
                  </span>
                )}
              </div>
              <p className="text-[11px] mb-3 text-slate-400 leading-relaxed">
                {userRole === 'Admin' ? 'Attestation moderation interface enabled.' : 'Role-based access customized view.'}
              </p>
              <div className="w-full h-1 bg-slate-850 rounded-full overflow-hidden">
                <div className={`h-full ${userRole === 'Admin' ? 'bg-purple-600 w-full' : 'bg-gradient-to-r from-orange-500 to-emerald-600 w-2/3'}`}></div>
              </div>
              <p className="text-[9px] mt-2 text-right text-slate-500">
                {userRole === 'Admin' ? 'All capabilities signed' : 'Cryptographic keys active'}
              </p>
            </div>
          </aside>
          )}

          <div className="flex-1 min-w-0">
            {locationError && (locationStatus === 'denied' || locationStatus === 'unavailable') && (
              <div className="mb-4 bg-orange-950/20 border border-orange-500/20 rounded-xl p-3 flex items-start gap-3 glass-panel">
                <div className="bg-orange-900/20 p-1.5 rounded-lg text-orange-400 shrink-0">
                  <AlertTriangle size={16} />
                </div>
                <div className="flex-1 text-xs">
                  <p className="font-extrabold text-orange-300 mb-0.5">Location Access Warning</p>
                  <p className="text-orange-400/90 leading-relaxed">{locationError}</p>
                </div>
                <button
                  onClick={() => setShowLocationPicker(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer"
                >
                  Set Manually
                </button>
              </div>
            )}
            {renderContent()}
          </div>
        </div>
      </main>

      <nav className={`md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-md border-t z-[150] pb-safe ${isDarkMode ? 'bg-[#0b0f19]/95 border-slate-800' : 'bg-white/95 border-slate-200'}`}>
        <div className="flex justify-around items-center h-16 pb-1">
          <MobileNavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Activity size={22} />} label={t('dashboard')} />
          <MobileNavButton active={activeTab === 'rescue'} onClick={() => setActiveTab('rescue')} icon={<ShieldAlert size={22} />} label={t('rescue')} color="text-red-500" />
          <MobileNavButton active={activeTab === 'volunteer'} onClick={() => setActiveTab('volunteer')} icon={<HeartHandshake size={22} />} label={t('volunteer')} />
          <MobileNavButton active={activeTab === 'services'} onClick={() => setActiveTab('services')} icon={<Wrench size={22} />} label={t('services')} />
          {['Admin', 'Volunteer'].includes(userRole) ? (
            <MobileNavButton active={activeTab === 'admin-approvals'} onClick={() => setActiveTab('admin-approvals')} icon={<ShieldCheck size={22} />} label={t('approvals')} color="text-purple-400" badge={pendingApprovalsCount} />
          ) : (
            <MobileNavButton active={activeTab === 'survey'} onClick={() => setActiveTab('survey')} icon={<FileText size={22} />} label={t('surveys')} />
          )}
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

      {showPostAlertModal && (
        <PostAlertModal
          userRole={userRole}
          healthcareSubRole={healthcareSubRole}
          currentLocation={resolvedLocation}
          editAlert={editingAlert}
          onPost={(newAlert) => {
            setAlerts(prev => {
              const existingIndex = prev.findIndex(a => a.id === newAlert.id);
              if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = newAlert;
                return updated;
              }
              return [newAlert, ...prev];
            });
            setShowPostAlertModal(false);
            setEditingAlert(null);
          }}
          onClose={() => { setShowPostAlertModal(false); setEditingAlert(null); }}
          t={t}
        />
      )}




      {earningToast && (
        <EarningToast
          amount={earningToast.amount}
          source={earningToast.source}
          onDone={() => setEarningToast(null)}
        />
      )}

      {/* Floating SOS button */}
      {isAuthenticated && (
        <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-[150] flex flex-col items-end gap-2">
          {isSOSActive ? (
            <button
              type="button"
              onClick={() => setIsSOSActive(false)}
              className="flex items-center gap-2 bg-white text-red-600 border-2 border-red-500 hover:bg-red-50 font-bold px-4 py-3 rounded-full shadow-2xl transition-all animate-bounce text-xs uppercase tracking-wider"
            >
              <span className="w-3 h-3 bg-red-600 rounded-full animate-ping"></span>
              {t('stopBroadcast')}
            </button>
          ) : (
            <button
              type="button"
              onClick={startSOSCountdown}
              disabled={sosCountdown !== null}
              className="flex items-center gap-2.5 px-4 py-3 md:px-5 md:py-3.5 bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95 text-white rounded-full shadow-2xl transition-all relative group cursor-pointer"
              title={t('triggerSOS')}
            >
              <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25 group-hover:opacity-40"></div>
              <ShieldAlert size={18} className="relative z-10 animate-pulse" />
              <span className="text-xs md:text-sm font-black tracking-wider relative z-10 uppercase">SOS HELP</span>
            </button>
          )}
        </div>
      )}

      {/* Full-screen countdown overlay */}
      {sosCountdown !== null && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center z-[300] animate-in fade-in duration-200">
          <div className="text-center space-y-6 max-w-sm px-6">
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-75"></div>
              <div className="absolute inset-2 rounded-full border-2 border-red-600/50 bg-red-50 flex items-center justify-center shadow-inner">
                <span className="text-5xl font-black text-red-600 animate-pulse">{sosCountdown}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white tracking-tight">TRIGGERING SOS</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Broadcasting emergency alert to nearby volunteers & contacts in {sosCountdown} seconds...
              </p>
            </div>

            <button
              type="button"
              onClick={cancelSOSCountdown}
              className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 px-6 rounded-full text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
            >
              <X size={16} /> Cancel Trigger
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- LOCATION PICKER MODAL ---
function LocationPickerModal({ currentLocation, onSelect, onRetryGPS, locationStatus, onClose }) {
  const [typedLocation, setTypedLocation] = useState('');

  const presetLocations = [
    { name: "Alappuzha, Kerala", lat: 9.4981, lng: 76.3388 },
    { name: "Coimbatore, Tamil Nadu", lat: 11.0168, lng: 76.9558 },
    { name: "Bangalore, Karnataka", lat: 12.9716, lng: 77.5946 },
    { name: "Mumbai, Maharashtra", lat: 19.0760, lng: 72.8777 },
    { name: "New Delhi, Delhi", lat: 28.6139, lng: 77.2090 },
    { name: "Kochi, Kerala", lat: 9.9312, lng: 76.2673 },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!typedLocation.trim()) return;
    onSelect(typedLocation.trim(), 20.5937, 78.9629);
  };

  return (
    <Modal onClose={onClose}>
      <ModalHeader
        icon={<MapPin size={22} className="text-white" />}
        title="Set Location"
        subtitle="Set your location manually or detect via GPS"
        gradient="from-orange-500 to-emerald-600"
        onClose={onClose}
      />
      <div className="p-5 overflow-y-auto space-y-4 text-sm text-slate-700">
        <div>
          <button
            type="button"
            onClick={onRetryGPS}
            disabled={locationStatus === 'requesting'}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/10"
          >
            {locationStatus === 'requesting' ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Detecting Location...
              </>
            ) : (
              <>
                <MapPin size={16} /> Detect My Location (GPS)
              </>
            )}
          </button>
          {locationStatus === 'granted' && (
            <p className="text-[10px] text-green-600 font-semibold mt-1.5 text-center">✓ GPS location detected successfully</p>
          )}
        </div>

        <div className="relative flex items-center gap-2 py-2">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Or select city</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {presetLocations.map((loc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelect(loc.name, loc.lat, loc.lng)}
              className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${currentLocation === loc.name
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
            >
              {loc.name}
            </button>
          ))}
        </div>

        <div className="relative flex items-center gap-2 py-2">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Or type custom</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Type your city or area name..."
            value={typedLocation}
            onChange={(e) => setTypedLocation(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
          />
          <button
            type="submit"
            disabled={!typedLocation.trim()}
            className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white font-bold py-2 rounded-xl text-xs transition-colors"
          >
            Confirm Typed Location
          </button>
        </form>
      </div>
    </Modal>
  );
}

// --- POST ALERT MODAL ---
function PostAlertModal({ userRole, healthcareSubRole, currentLocation, onPost, onClose, t, editAlert = null }) {
  const [title, setTitle] = useState(editAlert ? (editAlert.title || '') : '');
  const [type, setType] = useState(editAlert ? editAlert.type : (userRole === 'HealthcareWorker' ? `${healthcareSubRole === 'Bloodbank' ? 'Blood Bank' : healthcareSubRole} Update` : 'General Update'));
  const [description, setDescription] = useState(editAlert ? editAlert.description : '');
  const [location, setLocation] = useState(editAlert ? editAlert.location : (currentLocation || ''));
  const [contactName, setContactName] = useState('Saathi Volunteer');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [notes, setNotes] = useState('');
  const [severity, setSeverity] = useState(editAlert ? editAlert.severity : 'medium'); // low | medium | high

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onPost({
      id: editAlert ? editAlert.id : Date.now(),
      type,
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      notes: notes.trim(),
      distance: '0.1 km',
      time: 'Just now',
      status: 'Active',
      severity,
      postedByRole: userRole,
      postedBySubRole: userRole === 'HealthcareWorker' ? healthcareSubRole : null,
    });
  };

  const volunteerCategories = ['General Update', 'Traffic Incident', 'Power Outage', 'Water Supply', 'Lost & Found', 'Community Drive'];
  const healthcareCategories = {
    ASHA: ['ASHA Health Alert', 'Immunization Camp', 'Hygiene Drive', 'Mother & Child Care'],
    Bloodbank: ['Blood Requirement', 'Blood Donation Camp', 'Stock Availability'],
    Doctor: ['OPD Schedule', 'Specialty Consultation', 'Health Camp', 'Telemedicine Available'],
    Hospital: ['Bed Availability', 'Emergency Ward Info', 'Vaccination Drive', 'General Announcement']
  };

  const categories = userRole === 'HealthcareWorker'
    ? (healthcareCategories[healthcareSubRole] || ['Medical Alert'])
    : volunteerCategories;

  // Sync category selection when subrole changes or on mount
  useEffect(() => {
    if (categories.length > 0) {
      setType(categories[0]);
    }
  }, [healthcareSubRole, userRole]);

  return (
    <Modal onClose={onClose}>
      <ModalHeader
        icon={<Activity size={22} className="text-white" />}
        title={t ? t('postAlertTitle') : "Post Hyperlocal Alert"}
        subtitle={t ? t('postAlertSub') : "Share important updates directly with your local community"}
        gradient="from-orange-500 to-emerald-600"
        onClose={onClose}
      />
      <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-sm text-slate-700 max-h-[75vh]">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t ? t('alertType') : "Alert Type / Category"}</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setType(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${type === cat
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t ? t('severity') : "Severity"}</label>
            <div className="flex border border-slate-200 rounded-xl overflow-hidden">
              {['low', 'medium', 'high'].map(sev => (
                <button
                  type="button"
                  key={sev}
                  onClick={() => setSeverity(sev)}
                  className={`flex-1 py-2 text-xs font-extrabold uppercase transition-all ${severity === sev
                    ? sev === 'high' ? 'bg-red-500 text-white' : sev === 'medium' ? 'bg-orange-500 text-white' : 'bg-slate-500 text-white'
                    : 'bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                >
                  {t ? t(sev) : sev}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t ? t('postAs') : "Post As"}</label>
            <div className="py-2 px-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600">
              {userRole === 'HealthcareWorker' ? `${healthcareSubRole === 'Bloodbank' ? 'Blood Bank' : healthcareSubRole} (Healthcare)` : userRole}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t ? t('title') : "Title"}</label>
          <input
            type="text"
            required
            placeholder="e.g. A+ Blood Urgently Required"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t ? t('description') : "Description"}</label>
          <textarea
            required
            placeholder="Provide detail about what is needed or what is happening..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t ? t('locationDetails') : "Location Details"}</label>
          <input
            type="text"
            required
            placeholder="e.g. Alappuzha General Hospital"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t ? t('contactName') : "Contact Name"}</label>
            <input
              type="text"
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t ? t('contactPhone') : "Contact Phone"}</label>
            <input
              type="text"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t ? t('notes') : "Instructions / Notes (Optional)"}</label>
          <textarea
            placeholder="Add specific instructions for volunteers or community members..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-orange-500/10 text-xs uppercase tracking-wider mt-2"
        >
          {t ? t('publishAlert') : "Publish Hyperlocal Alert"}
        </button>
      </form>
    </Modal>
  );
}

// --- WALLET MODAL ---
function WalletModal({ balance, transactions, onPayout, onClose }) {
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleRedeem = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    const amt = parseFloat(amount);
    if (!upiId) {
      setErrorMessage('Please enter your UPI ID');
      return;
    }
    if (!upiId.includes('@')) {
      setErrorMessage('Please enter a valid UPI ID (e.g. name@upi)');
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      setErrorMessage('Please enter a valid amount');
      return;
    }
    if (amt > balance) {
      setErrorMessage('Amount exceeds your current balance');
      return;
    }

    setIsLoading(true);
    setStatus('loading');

    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      onPayout(amt);
      setStatus('success');
      setAmount('');
      setUpiId('');
    }, 2000);
  };

  return (
    <Modal onClose={onClose}>
      <ModalHeader
        icon={<Wallet size={20} />}
        title="Redeem Rewards"
        subtitle="Withdraw your earnings instantly via UPI"
        gradient="from-amber-500 to-orange-600"
        onClose={onClose}
      />
      <div className="p-5 overflow-y-auto space-y-5">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Available Balance</p>
            <div className="flex items-baseline gap-0.5 mt-1 text-slate-900">
              <span className="text-xl font-bold">₹</span>
              <span className="text-3xl font-black">{balance}</span>
            </div>
          </div>
          <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-600">
            <Wallet size={20} />
          </div>
        </div>

        {status === 'success' ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center space-y-3 animate-in fade-in duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto">
              <CheckCircle size={28} />
            </div>
            <div>
              <h4 className="font-bold text-green-950">Redemption Successful!</h4>
              <p className="text-xs text-green-700 mt-1">The amount has been debited and will reflect in your UPI account shortly.</p>
            </div>
            <button
              onClick={() => setStatus('idle')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl text-xs transition-colors"
            >
              Redeem More
            </button>
          </div>
        ) : (
          <form onSubmit={handleRedeem} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">UPI ID</label>
              <input
                type="text"
                placeholder="e.g. user@okhdfcbank"
                value={upiId}
                disabled={status === 'loading'}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Amount (₹)</label>
              <input
                type="number"
                placeholder="Enter amount to withdraw"
                value={amount}
                disabled={status === 'loading'}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
            {errorMessage && (
              <p className="text-xs text-red-600 font-semibold">{errorMessage}</p>
            )}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-500/10"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Processing Payout...
                </>
              ) : (
                'Confirm Redemption'
              )}
            </button>
          </form>
        )}

        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Transaction History</h4>
          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
            {transactions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No transactions yet.</p>
            ) : (
              transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{tx.description}</p>
                    <p className="text-[10px] text-slate-400">{tx.date}</p>
                  </div>
                  <span className={`text-xs font-bold shrink-0 ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function AlertDetailModal({ alert, isSOSActive, onTriggerSOS, onClose }) {
  if (!alert) return null;

  const handleCall = () => {
    window.open("tel:112", "_self");
  };

  return (
    <Modal onClose={onClose} maxWidth="max-w-md">
      <ModalHeader
        icon={<AlertOctagon size={22} className="animate-pulse text-white" />}
        title={alert.title || alert.type}
        subtitle={`Severity: ${alert.severity.toUpperCase()} • ${alert.time}`}
        gradient={alert.severity === 'high' ? 'from-red-600 to-rose-700' : 'from-orange-500 to-amber-600'}
        onClose={onClose}
      />
      <div className="p-5 overflow-y-auto space-y-4 text-sm text-slate-700">
        <div className="flex gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${alert.severity === 'high' ? 'bg-red-100 text-red-700' :
            alert.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
              'bg-slate-100 text-slate-700'
            }`}>
            {alert.severity} Severity
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${alert.status === 'Active' ? 'bg-emerald-100 text-emerald-700 animate-pulse' : 'bg-slate-100 text-slate-700'
            }`}>
            {alert.status}
          </span>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="font-semibold text-slate-900 mb-1">Alert Details</p>
          <p className="text-xs leading-relaxed text-slate-600">{alert.description}</p>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-start gap-2.5">
            <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Location / Venue</p>
              <p className="text-xs text-slate-800 font-medium">{alert.location || 'Nearby'} ({alert.distance})</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Users size={16} className="text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Key Contact</p>
              <p className="text-xs text-slate-800 font-medium">{alert.contactName || 'Saathi Control Room'}</p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{alert.contactPhone || '112'}</p>
            </div>
          </div>
        </div>

        {alert.notes && (
          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3.5 text-xs text-amber-900">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <AlertTriangle size={14} className="text-amber-600" />
              Volunteer Instructions
            </div>
            <p className="text-amber-800 leading-relaxed">{alert.notes}</p>
          </div>
        )}

        <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCall}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-red-600/10 flex items-center justify-center gap-2 group text-xs uppercase tracking-wider"
            >
              <PhoneCall size={16} className="group-hover:scale-110 transition-transform" />
              Call 112
            </button>

            <button
              type="button"
              onClick={onTriggerSOS}
              disabled={isSOSActive}
              className={`flex-1 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group text-xs uppercase tracking-wider ${isSOSActive
                ? 'bg-emerald-50 text-emerald-700 cursor-not-allowed border border-emerald-200'
                : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-md shadow-orange-500/10'
                }`}
            >
              <Radio size={16} className={`${isSOSActive ? '' : 'animate-pulse group-hover:scale-110'} transition-transform`} />
              {isSOSActive ? "Broadcast Active" : "Trigger SOS"}
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl transition-colors text-xs uppercase tracking-wider"
          >
            Close Details
          </button>
        </div>
      </div>
    </Modal>
  );
}

// --- HOME ---
function HomeFeed({
  t,
  isDarkMode,
  startSOSCountdown,
  isSOSActive,
  setIsSOSActive,
  liveLocation,
  onViewCertificate,
  userRole,
  walletBalance,
  onOpenWallet,
  volunteerApplicationStatus,
  setVolunteerApplicationStatus,
  setVolunteerRequests,
  displayUser,
  services,
  setActiveTab,
  volunteerRequests,
  surveys,
  alerts,
  onOpenPostAlert,
  bloodRequests = [],
  onEditAlert,
  onRemoveAlert
}) {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const showWalletCard = ['Volunteer'].includes(userRole);

  const combinedAlerts = useMemo(() => {
    // Transform approved blood requests into alert-like structure for the hyperlocal feed
    const bloodAlerts = (bloodRequests || [])
      .filter(req => req.status === 'approved')
      .map(req => ({
        id: `blood-${req.id}`,
        type: "Blood Attestation",
        title: `VERIFIED: ${req.bloodType} Blood Required`,
        description: `Clinical Requisition: ${req.unitsNeeded} units of ${req.bloodType} blood needed at ${req.hospital} for patient ${req.patientName}. Requested by ${req.requestorName}.`,
        location: req.hospital,
        contactName: req.requestorName,
        contactPhone: req.requestorPhone,
        notes: `Clinical Requisition verified by Saathi. Verification Document: ${req.approvalLetter}`,
        distance: req.distance || '1.2 km',
        time: req.date || 'Just now',
        status: 'Active',
        severity: 'high',
        isBloodAttestation: true,
        postedByRole: 'HealthcareWorker',
        postedBySubRole: 'Bloodbank'
      }));

    return [...bloodAlerts, ...(alerts || [])];
  }, [alerts, bloodRequests]);

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
              <p className="text-[11px] uppercase tracking-widest text-white/80 font-semibold">{t('wallet')}</p>
              <div className="flex items-baseline gap-0.5 mt-1">
                <IndianRupee size={22} className="text-white/90" strokeWidth={2.5} />
                <span className="text-3xl font-black">{walletBalance.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-xs text-white/80 mt-1 flex items-center gap-1">
                <Sparkles size={12} /> {t('walletSub')}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Wallet size={24} />
            </div>
          </div>
        </button>
      )}

      {/* Hyperlocal Feed moved UP */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Activity size={18} className="text-orange-600" /> {t('hyperlocalFeed')}
          </h3>
          <div className="flex items-center gap-2">
            {(userRole === 'Volunteer' || userRole === 'HealthcareWorker' || userRole === 'Admin') && (
              <button
                type="button"
                onClick={onOpenPostAlert}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-1.5 px-3 rounded-xl text-xs flex items-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Plus size={12} /> Post Alert
              </button>
            )}
            <button className="text-sm text-orange-600 font-medium hover:underline">{t('viewMap')}</button>
          </div>
        </div>
        <div className="space-y-4">
          {(combinedAlerts || []).map(alert => {
            const isHigh = alert.severity === 'high';
            const isMedium = alert.severity === 'medium';
            const isBlood = alert.isBloodAttestation;
            return (
              <div
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden group ${
                  isDarkMode
                    ? `hyperlocal-card ${isBlood ? 'hyperlocal-card-blood' : isHigh ? 'hyperlocal-card-high' : isMedium ? 'hyperlocal-card-medium' : 'hyperlocal-card-low'}`
                    : `${isBlood ? 'bg-rose-50 border-rose-200 hover:shadow-md' : isHigh ? 'bg-red-50 border-red-200 hover:shadow-md' : isMedium ? 'bg-orange-50 border-orange-200 hover:shadow-md' : 'bg-white border-slate-200 hover:shadow-md'}`
                }`}
              >
                <div className={`absolute top-0 left-0 w-1.5 h-full ${isBlood ? 'bg-rose-500' : isHigh ? 'bg-red-500' : isMedium ? 'bg-orange-500' : 'bg-slate-400'
                  }`} />

                <div className="flex items-start gap-4">
                  <div className={`p-3.5 rounded-xl shrink-0 relative ${
                    isDarkMode
                      ? (isBlood ? 'bg-rose-950/60 text-rose-400 border border-rose-500/20'
                         : isHigh ? 'bg-red-950/60 text-red-400 border border-red-500/20'
                         : isMedium ? 'bg-orange-950/60 text-orange-400 border border-orange-500/20'
                         : 'bg-slate-800 text-slate-300 border border-slate-700')
                      : (isBlood ? 'bg-rose-100 text-rose-600 border border-rose-200'
                         : isHigh ? 'bg-red-100 text-red-600 border border-red-200'
                         : isMedium ? 'bg-orange-100 text-orange-600 border border-orange-200'
                         : 'bg-slate-100 text-slate-600 border border-slate-200')
                  }`}>
                    {isBlood ? (
                      <Heart size={22} className="text-rose-500 animate-pulse fill-rose-500" />
                    ) : (
                      <AlertTriangle size={22} className={isHigh ? 'animate-pulse' : ''} />
                    )}
                    {alert.status === 'Active' && (
                      <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white animate-ping ${isBlood ? 'bg-rose-500' : isHigh ? 'bg-red-500' : 'bg-orange-500'
                        }`} />
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={`font-extrabold text-sm tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                        {alert.title || alert.type}
                      </h4>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isDarkMode
                          ? (isBlood ? 'bg-rose-950/80 text-rose-300' : isHigh ? 'bg-red-950/80 text-red-300' : isMedium ? 'bg-orange-950/80 text-orange-300' : 'bg-slate-800 text-slate-300')
                          : (isBlood ? 'bg-rose-200 text-rose-700' : isHigh ? 'bg-red-200 text-red-700' : isMedium ? 'bg-orange-200 text-orange-700' : 'bg-slate-200 text-slate-700')
                      }`}>
                        {alert.type}
                      </span>
                      {alert.postedByRole && (
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${alert.isBloodAttestation
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                          : alert.postedByRole === 'HealthcareWorker'
                            ? alert.postedBySubRole === 'ASHA' ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30' :
                              alert.postedBySubRole === 'Bloodbank' ? 'bg-red-950/60 text-red-300 border border-red-500/30' :
                                alert.postedBySubRole === 'Doctor' ? 'bg-blue-950/60 text-blue-300 border border-blue-200' :
                                  'bg-indigo-950/60 text-indigo-300 border border-indigo-500/30'
                            : alert.postedByRole === 'Volunteer' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' :
                              'bg-purple-950/60 text-purple-300 border border-purple-500/30'
                          }`}>
                          {alert.isBloodAttestation ? <Heart size={10} className="text-rose-400 fill-rose-400" /> : <ShieldCheck size={10} />}
                          {alert.isBloodAttestation
                            ? 'Verified Blood Request'
                            : alert.postedByRole === 'HealthcareWorker'
                              ? alert.postedBySubRole === 'Bloodbank' ? 'Blood Bank' : `${alert.postedBySubRole} (Health)`
                              : alert.postedByRole}
                        </span>
                      )}
                    </div>

                    <p className={`text-xs line-clamp-2 leading-relaxed max-w-xl ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {alert.description}
                    </p>

                    <div className="flex items-center text-[11px] text-slate-400 mt-2 gap-3">
                      <span className="flex items-center gap-1 font-medium"><MapPin size={12} className={isBlood ? 'text-rose-400' : isHigh ? 'text-red-500' : 'text-slate-400'} /> {alert.location || 'Nearby'} ({alert.distance})</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium"><Clock size={12} /> {alert.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end shrink-0 sm:self-center gap-3">
                  {userRole === 'Admin' && (
                    <div className="flex gap-2 mr-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); onEditAlert && onEditAlert(alert); }}
                        className="text-xs bg-slate-800 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-colors font-medium border border-slate-700 hover:border-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onRemoveAlert && onRemoveAlert(alert.id); }}
                        className="text-xs bg-slate-800 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg transition-colors font-medium border border-slate-700 hover:border-rose-500"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-xs font-bold text-orange-500 group-hover:translate-x-1 transition-transform duration-200">
                    View & Action
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between items-start transition-all duration-300 ${isSOSActive ? 'bg-red-600 shadow-red-500/40' : 'bg-slate-900'} text-white shadow-xl min-h-[180px]`}>
          <div className="absolute -right-10 -top-10 opacity-10">
            <ShieldAlert size={150} />
          </div>
          <div className="w-full relative z-10">
            <h2 className="text-2xl font-bold mb-1">{isSOSActive ? t('activeSOS') : t('emergencyAssist')}</h2>
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
            onClick={isSOSActive ? () => setIsSOSActive(false) : startSOSCountdown}
            className={`mt-4 px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all z-10 w-full sm:w-auto ${isSOSActive ? 'bg-white text-red-600 hover:bg-red-50 shadow-lg' : 'bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/20 flex items-center justify-center gap-2'}`}
          >
            {isSOSActive ? t('stopBroadcast') : <><AlertTriangle size={18} /> {t('triggerSOS')}</>}
          </button>
        </div>

        {userRole === 'Admin' ? (
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between min-h-[180px]">
            <div>
              <h2 className="text-xl font-bold mb-1">Platform Analytics</h2>
              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div>
                  <div className="text-2xl font-black">{1420 + (volunteerRequests ? volunteerRequests.length : 0)}</div>
                  <div className="text-[10px] text-white/80 uppercase tracking-wider font-semibold">Total Users</div>
                </div>
                <div className="border-l border-white/20">
                  <div className="text-2xl font-black">{services ? services.filter(s => s.status === 'approved').length : 4}</div>
                  <div className="text-[10px] text-white/80 uppercase tracking-wider font-semibold">Services</div>
                </div>
                <div className="border-l border-white/20">
                  <div className="text-2xl font-black">{isSOSActive ? 1 : 0}</div>
                  <div className="text-[10px] text-white/80 uppercase tracking-wider font-semibold">Active SOS</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('admin-approvals')}
              className="mt-4 text-xs font-semibold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg self-start backdrop-blur-sm transition-colors flex items-center gap-1.5 animate-pulse"
            >
              <ShieldCheck size={14} /> Manage Approvals ({(volunteerRequests ? volunteerRequests.filter(r => r.status === 'pending').length : 0) + (services ? services.filter(s => s.status === 'pending').length : 0) + (surveys ? surveys.filter(s => s.status === 'pending').length : 0)})
            </button>
          </div>
        ) : userRole === 'NGO' ? (
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between min-h-[180px]">
            <div>
              <h2 className="text-xl font-bold mb-1">NGO Impact Dashboard</h2>
              <div className="flex items-center gap-4 mt-3">
                <div className="text-center">
                  <div className="text-3xl font-black">5</div>
                  <div className="text-xs text-white/80 uppercase tracking-wider font-semibold">Active Drives</div>
                </div>
                <div className="w-px h-10 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-3xl font-black">142</div>
                  <div className="text-xs text-white/80 uppercase tracking-wider font-semibold">Participants</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('volunteer')}
              className="mt-4 text-xs font-semibold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg self-start backdrop-blur-sm transition-colors flex items-center gap-1.5"
            >
              <HeartHandshake size={14} /> Manage Drives
            </button>
          </div>
        ) : userRole === 'ServiceProvider' ? (
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between min-h-[180px]">
            <div>
              <h2 className="text-xl font-bold mb-1">Business Dashboard</h2>
              <div className="flex items-center gap-4 mt-3">
                <div className="text-center">
                  <div className="text-3xl font-black">4.8 ★</div>
                  <div className="text-xs text-white/80 uppercase tracking-wider font-semibold">Rating</div>
                </div>
                <div className="w-px h-10 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-3xl font-black">28</div>
                  <div className="text-xs text-white/80 uppercase tracking-wider font-semibold">Bookings</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('services')}
              className="mt-4 text-xs font-semibold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg self-start backdrop-blur-sm transition-colors flex items-center gap-1.5"
            >
              <Wrench size={14} /> View Service Dashboard
            </button>
          </div>
        ) : (
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
        )}
      </div>

      {userRole === 'Citizen' && (
        <div className="mt-4">
          {volunteerApplicationStatus === 'idle' && (
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex flex-col justify-between min-h-[180px] animate-in slide-in-from-bottom duration-300">
              <div>
                <div className="flex items-center gap-2 mb-2 text-emerald-400">
                  <HeartHandshake size={20} />
                  <h3 className="font-black text-xl">{t('volunteerRegister')}</h3>
                </div>
                <p className="text-emerald-500 text-sm font-medium leading-relaxed max-w-md">
                  {t('volunteerRegisterSub')}
                </p>
              </div>
              <button
                onClick={() => {
                  setVolunteerApplicationStatus('pending');
                  setVolunteerRequests(prev => [
                    {
                      id: Date.now(),
                      name: displayUser?.name || "Jithu Sreekumar",
                      phone: displayUser?.phone || "+91 98765 43210",
                      email: displayUser?.email || "jithu@gmail.com",
                      status: "pending",
                      date: "Just now",
                      idType: displayUser?.idType || "Aadhaar Card",
                      idNumber: displayUser?.idNumber || "XXXX XXXX 4521"
                    },
                    ...prev
                  ]);
                }}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-5 rounded-xl text-xs self-start transition-all shadow-sm flex items-center gap-1.5"
              >
                <HeartHandshake size={14} /> {t('registerBtn')}
              </button>
            </div>
          )}

          {volunteerApplicationStatus === 'pending' && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[180px] animate-in fade-in duration-300">
              <div>
                <div className="flex items-center gap-2 mb-2 text-amber-800">
                  <Clock size={20} className="animate-spin" />
                  <h3 className="font-bold text-lg">Volunteer Registration Pending</h3>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed max-w-md">
                  Thank you for applying to be a Saathi Volunteer! Your application has been submitted to the platform administrators for ID and profile verification. You will be notified as soon as it is approved.
                </p>
              </div>
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg self-start">
                <Clock size={12} className="animate-spin" /> Waiting for Admin Approval
              </div>
            </div>
          )}

          {volunteerApplicationStatus === 'rejected' && (
            <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[180px] animate-in fade-in duration-300">
              <div>
                <div className="flex items-center gap-2 mb-2 text-red-800">
                  <X size={20} />
                  <h3 className="font-bold text-lg">Volunteer Registration Rejected</h3>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed max-w-md">
                  Unfortunately, your volunteer application could not be approved at this time. Please check that your details and verification ID are correct.
                </p>
              </div>
              <button
                onClick={() => setVolunteerApplicationStatus('idle')}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl text-xs self-start transition-all shadow-sm"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      {selectedAlert && (
        <AlertDetailModal
          alert={selectedAlert}
          isSOSActive={isSOSActive}
          onTriggerSOS={() => {
            startSOSCountdown();
            setSelectedAlert(null);
          }}
          onClose={() => setSelectedAlert(null)}
        />
      )}
    </div>
  );
}

// --- RESCUE ---
function RescueModule({
  t,
  isDarkMode,
  isSOSActive,
  setIsSOSActive,
  liveLocation,
  onOpenChat,
  userCoords,
  locationStatus,
  bloodRequests = [],
  setBloodRequests,
  userRole,
  addWalletTxn,
  creditMicro,
  showEarning,
  keyFingerprint,
  signActionPayload
}) {
  const [subModule, setSubModule] = useState('sos'); // 'sos' | 'blood'
  const [customIncident, setCustomIncident] = useState("");
  const [aiAdvice, setAiAdvice] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Blood specific local states
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRequestForPledge, setSelectedRequestForPledge] = useState(null);

  // New request form state
  const [patientName, setPatientName] = useState("");
  const [bloodType, setBloodType] = useState("O+");
  const [unitsNeeded, setUnitsNeeded] = useState(2);
  const [hospital, setHospital] = useState("");
  const [doctorContact, setDoctorContact] = useState("");
  const [requestorPhone, setRequestorPhone] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Pledge form state
  const [pledgeName, setPledgeName] = useState("");
  const [pledgePhone, setPledgePhone] = useState("");
  const [isSubmittingPledge, setIsSubmittingPledge] = useState(false);
  const [pledgeError, setPledgeError] = useState("");

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

  // Simulate file upload
  const handleSimulateUpload = () => {
    if (!patientName.trim()) {
      setFormError("Please enter the patient name first before uploading.");
      return;
    }
    setFormError("");
    setUploadedFile({
      name: `requisition_slip_${patientName.toLowerCase().replace(/\s+/g, '_') || 'patient'}.pdf`,
      size: "1.4 MB",
      type: "application/pdf"
    });
  };

  const handleCreateBloodRequest = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");

    if (!patientName.trim() || !hospital.trim() || !doctorContact.trim() || !requestorPhone.trim()) {
      setFormError("Please fill out all required fields.");
      return;
    }

    if (!uploadedFile) {
      setFormError("Please upload/attach the doctor's requisition slip.");
      return;
    }

    // Basic phone validation
    const phoneRegex = /^[6-9]\d{9}$|^(\+91)?\s?[6-9]\d{9}$/;
    if (!phoneRegex.test(doctorContact)) {
      setFormError("Please enter a valid 10-digit doctor's contact number.");
      return;
    }
    if (!phoneRegex.test(requestorPhone)) {
      setFormError("Please enter a valid 10-digit requestor contact number.");
      return;
    }

    setIsSubmittingRequest(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    const newRequest = {
      id: Date.now(),
      patientName,
      bloodType,
      unitsNeeded: parseInt(unitsNeeded),
      hospital,
      doctorContact,
      approvalLetter: uploadedFile.name,
      requestorName: "Jithu Sreekumar",
      requestorPhone,
      status: "pending",
      responses: [],
      date: "Just now",
      distance: "0.4 km"
    };

    // Attest & Sign with WebCrypto
    if (signActionPayload) {
      await signActionPayload('BLOOD_REQUEST_SUBMIT', newRequest);
    }

    setBloodRequests(prev => [newRequest, ...prev]);
    setIsSubmittingRequest(false);
    setSuccessMsg("Your blood request has been successfully submitted and is under verification by Saathi Volunteers/Admins!");

    // Reset form
    setPatientName("");
    setBloodType("O+");
    setUnitsNeeded(2);
    setHospital("");
    setDoctorContact("");
    setRequestorPhone("");
    setUploadedFile(null);

    setTimeout(() => {
      setShowRequestModal(false);
      setSuccessMsg("");
    }, 3000);
  };

  const handlePledgeBlood = async (e) => {
    e.preventDefault();
    setPledgeError("");

    if (!pledgeName.trim() || !pledgePhone.trim()) {
      setPledgeError("Please enter your name and contact details.");
      return;
    }

    setIsSubmittingPledge(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const pledge = {
      name: pledgeName,
      phone: pledgePhone,
      status: "pledged"
    };

    setBloodRequests(prev => prev.map(req => {
      if (req.id === selectedRequestForPledge.id) {
        return {
          ...req,
          responses: [...req.responses, pledge]
        };
      }
      return req;
    }));

    // Micro-reward if volunteer
    if (['Volunteer', 'Admin'].includes(userRole) && creditMicro) {
      creditMicro(50, `Pledged blood donation for ${selectedRequestForPledge.patientName}`);
      if (showEarning) showEarning(50, 'micro');
    }

    setIsSubmittingPledge(false);
    setSelectedRequestForPledge(null);
    setPledgeName("");
    setPledgePhone("");
  };

  const activeVerifiedRequests = (bloodRequests || []).filter(r => r.status === 'approved');
  const userPendingRequests = (bloodRequests || []).filter(r => r.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex border-b border-slate-800/80 p-1 bg-slate-950/40 rounded-xl max-w-sm">
        <button
          onClick={() => setSubModule('sos')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${subModule === 'sos'
            ? 'bg-red-950/80 border border-red-500/30 text-red-400'
            : 'text-slate-400 hover:text-slate-200'
            }`}
        >
          <Radio size={14} className={subModule === 'sos' ? 'animate-pulse' : ''} />
          {t('emergencySOS')}
        </button>
        <button
          onClick={() => setSubModule('blood')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${subModule === 'blood'
            ? 'bg-rose-950/80 border border-rose-500/30 text-rose-400'
            : 'text-slate-400 hover:text-slate-200'
            }`}
        >
          <HeartHandshake size={14} className={subModule === 'blood' ? 'animate-pulse' : ''} />
          {t('bloodHelp')}
        </button>
      </div>

      {subModule === 'sos' ? (
        <>
          <div className="flex items-center justify-between mb-2">
            <h2 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t('rescue')}</h2>
            {isSOSActive ? (
              <span className="bg-red-950/90 text-red-400 text-xs font-black px-3.5 py-1.5 rounded-full flex items-center gap-1.5 border border-red-500/30 pulse-glow-sos gpu-stabilized">
                <Radio size={14} className="animate-pulse" /> {t('broadcastingLoc')}
              </span>
            ) : (
              <span className="bg-slate-900/50 border border-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1">{t('standby')}</span>
            )}
          </div>

          <div className={`w-full h-72 rounded-2xl relative overflow-hidden border transition-colors duration-300 ${isSOSActive ? 'border-red-500/40' : 'border-slate-800'} shadow-xl bg-slate-950`}>
            <iframe
              title="Map"
              width="100%"
              height="100%"
              style={{ border: 0, position: 'absolute', zIndex: 0, opacity: 0.8 }}
              loading="lazy"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${mapLat}%2C${mapLng}`}
            ></iframe>

            {(locationStatus === 'granted' || locationStatus === 'manual' || locationStatus === 'denied' || locationStatus === 'unavailable') && (
              <div
                className={`absolute top-3 left-3 bg-slate-950/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md text-xs font-semibold flex items-center gap-1.5 z-20 transition-all duration-300 ${locationStatus === 'granted'
                  ? 'border border-emerald-500/20 text-emerald-400'
                  : locationStatus === 'manual'
                    ? 'border border-blue-500/20 text-blue-400'
                    : 'border border-orange-500/20 text-orange-400'
                  }`}
              >
                {locationStatus === 'granted' ? (
                  <>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    {t('liveGPS')}
                  </>
                ) : locationStatus === 'manual' ? (
                  <>
                    <MapPin size={12} className="text-blue-400" />
                    {t('manualLoc')}
                  </>
                ) : (
                  <>
                    <AlertTriangle size={12} className="text-orange-400 animate-pulse" />
                    {t('fallbackLoc')}
                  </>
                )}
              </div>
            )}

            {isSOSActive && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-10">
                <div className="absolute w-24 h-24 bg-red-500/30 rounded-full animate-ping"></div>
                <div className="absolute w-12 h-12 bg-red-500/50 rounded-full animate-pulse"></div>
                <div className="relative w-5 h-5 bg-red-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center z-10">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
                <div className="absolute top-6 whitespace-nowrap bg-slate-950 border border-red-500/20 px-3 py-1 rounded-lg shadow-lg text-xs font-bold text-red-400 z-20 flex flex-col items-center">
                  <span>{t('youAreHere')}</span>
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5">{liveLocation?.lat}, {liveLocation?.lng}</span>
                </div>
              </div>
            )}
          </div>

          <div className={`p-5 rounded-2xl shadow-xl border relative overflow-hidden glass-panel ${isDarkMode ? 'bg-slate-900/40 border-slate-800/80 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>
            <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              <AlertTriangle size={18} className="text-orange-500" /> {t('describeEmergency')}
            </h3>
            <div className="flex flex-col md:flex-row gap-3">
              <textarea
                placeholder={t('emergencyPlaceholder')}
                value={customIncident}
                onChange={(e) => setCustomIncident(e.target.value)}
                className="flex-1 p-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-200 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none h-16"
              />
              <button
                onClick={handleAnalyzeEmergency}
                disabled={isAnalyzing || !customIncident.trim()}
                className="md:w-48 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-xl text-sm font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition-all btn-premium-interactive cursor-pointer"
              >
                {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {isAnalyzing ? t('analyzing') : t('getAIAdvice')}
              </button>
            </div>
            {aiAdvice && (
              <div className="mt-4 p-4 bg-purple-950/20 border border-purple-500/20 rounded-xl text-sm text-purple-200">
                <h4 className="font-bold mb-2 flex items-center gap-1 text-purple-400"><Sparkles size={14} /> {t('aiGuidance')}</h4>
                <div className="whitespace-pre-wrap text-xs leading-relaxed">{aiAdvice}</div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-5 rounded-2xl shadow-xl border glass-panel ${isDarkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200'}`}>
              <h3 className={`font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <PhoneCall size={18} className="text-orange-500" /> {t('emergencyContacts')}
              </h3>
              <div className="space-y-3">
                {MOCK_CONTACTS.map((contact, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                    <div>
                      <h4 className="font-bold text-sm text-slate-200">{contact.name}</h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{contact.phone}</p>
                    </div>
                    {isSOSActive ? (
                      <span className="text-[10px] bg-green-950 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                        <CheckCircle size={10} /> {t('notified')}
                      </span>
                    ) : (
                      <button className="text-slate-500 hover:text-orange-400 cursor-pointer"><PhoneCall size={16} /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-5 rounded-2xl shadow-xl border glass-panel ${isDarkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200'}`}>
              <h3 className={`font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <Users size={18} className="text-green-500" /> {t('nearbyResponders')}
              </h3>
              <div className="space-y-3">
                {MOCK_RESPONDERS.map(responder => {
                  const colorStyles = {
                    green: 'border-green-500/20 bg-green-950/10 text-slate-200',
                    blue: 'border-blue-500/20 bg-blue-950/10 text-slate-200'
                  };
                  const btnStyles = {
                    green: 'bg-green-950 text-green-400 border border-green-500/20 hover:bg-green-900/30',
                    blue: 'bg-blue-950 text-blue-400 border border-blue-500/20 hover:bg-blue-900/30'
                  };
                  return (
                    <div key={responder.id} className={`border-l-4 ${responder.color === 'green' ? 'border-l-emerald-500' : 'border-l-blue-500'} ${colorStyles[responder.color]} pl-3 py-2 rounded-r-xl flex justify-between items-center`}>
                      <div>
                        <h4 className="font-bold text-sm text-slate-200">{responder.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{responder.type} • {responder.distance} away</p>
                      </div>
                      <button
                        onClick={() => onOpenChat(responder)}
                        className={`${btnStyles[responder.color]} p-2 rounded-full transition-colors cursor-pointer`}
                      >
                        <MessageSquare size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* BLOOD HELP SUBMODULE */
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-rose-950/15 border border-rose-500/20 rounded-2xl p-5 relative overflow-hidden glass-panel">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <HeartHandshake size={20} className="text-rose-500" /> Saathi Blood Assist Network
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                Connect patients requiring urgent blood donations with nearby verified citizens and volunteers. All requests require doctor verification.
              </p>
            </div>
            <button
              onClick={() => setShowRequestModal(true)}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-rose-500/10 hover:shadow-rose-500/25 btn-premium-interactive cursor-pointer relative z-10"
            >
              <Plus size={16} /> Raise Request
            </button>
          </div>

          {/* Pending Verification Warnings for Current User */}
          {userPendingRequests.length > 0 && (
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
                <Clock size={14} className="animate-spin" /> Blood Requests Pending Audit
              </h4>
              <div className="space-y-2">
                {userPendingRequests.map(req => (
                  <div key={req.id} className="text-xs text-slate-300 flex justify-between items-center bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
                    <div>
                      <span className="font-bold text-white">{req.patientName}</span> ({req.bloodType}) • {req.hospital}
                    </div>
                    <span className="text-[9px] bg-amber-950 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                      Under Review
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Verified Requests Grid */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-widest flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Active verified blood requirements
            </h3>

            {activeVerifiedRequests.length === 0 ? (
              <div className="bg-slate-900/20 border border-slate-800/80 border-dashed rounded-2xl p-12 text-center text-slate-500 glass-panel">
                <HeartHandshake size={48} className="mx-auto text-slate-700 mb-3" />
                <p className="font-bold text-slate-400 text-sm">No active blood requests in your area</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Create a request if you have an emergency, or stay on standby to donate.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeVerifiedRequests.map(req => {
                  const pledgedUnits = req.responses.length;
                  const percentComplete = Math.min(100, Math.round((pledgedUnits / req.unitsNeeded) * 100));
                  const isCompleted = pledgedUnits >= req.unitsNeeded;

                  return (
                    <div key={req.id} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-xl glass-panel relative overflow-hidden flex flex-col justify-between">
                      {/* Top Corner Glow Accents */}
                      <div className="absolute -top-12 -right-12 w-28 h-28 bg-rose-500/5 rounded-full blur-2xl"></div>

                      <div className="space-y-3.5">
                        <div className="flex items-start justify-between gap-3 relative z-10">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-rose-950/80 border border-rose-500/30 text-rose-500 rounded-xl flex items-center justify-center font-black text-xl shadow-inner animate-pulse">
                              {req.bloodType}
                            </div>
                            <div>
                              <h4 className="font-black text-white text-base leading-tight">{req.patientName}</h4>
                              <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">{req.hospital}</p>
                            </div>
                          </div>
                          <span className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800 font-mono">
                            {req.distance} away
                          </span>
                        </div>

                        {/* Verification details and clinic tags */}
                        <div className="flex flex-wrap gap-2 text-[10px]">
                          <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1 font-bold">
                            <ShieldCheck size={11} /> Dr. Verified ({req.doctorContact})
                          </span>
                          <span className="bg-slate-950/60 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                            <Clock size={11} /> {req.date}
                          </span>
                        </div>

                        {/* Progress Bar (Pledges) */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-400">Donation Progress</span>
                            <span className={isCompleted ? 'text-emerald-400' : 'text-rose-400'}>
                              {pledgedUnits} of {req.unitsNeeded} units pledged ({percentComplete}%)
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className={`h-full transition-all duration-500 ${isCompleted ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-rose-500 to-red-500 animate-pulse'}`}
                              style={{ width: `${percentComplete}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Pledges List */}
                        {req.responses.length > 0 && (
                          <div className="space-y-1 bg-slate-950/30 p-2.5 border border-slate-800/40 rounded-xl">
                            <p className="text-[9px] uppercase font-black text-slate-500 tracking-wider">Current Pledges</p>
                            <div className="space-y-1">
                              {req.responses.map((resp, i) => (
                                <div key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                                  <span className="font-bold text-white">{resp.name}</span> pledged to donate
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="mt-5 border-t border-slate-800/40 pt-4 flex gap-2">
                        <button
                          onClick={() => onOpenChat({ name: req.requestorName, phone: req.requestorPhone, type: 'Blood Requestor' })}
                          className="flex-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-black py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <MessageSquare size={13} /> Chat Requestor
                        </button>

                        {isCompleted ? (
                          <div className="flex-1 bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 text-xs font-black py-2.5 rounded-xl flex items-center justify-center gap-1 select-none">
                            <CheckCircle size={13} /> Ready / Fulfilled
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedRequestForPledge(req)}
                            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black py-2.5 rounded-xl transition-all shadow-md shadow-rose-500/10 hover:shadow-rose-500/20 btn-premium-interactive cursor-pointer flex items-center justify-center gap-1"
                          >
                            <HeartHandshake size={13} /> Pledge Donation
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* RAISE BLOOD REQUEST MODAL */}
      {showRequestModal && (
        <Modal onClose={() => setShowRequestModal(false)} maxWidth="max-w-lg">
          <ModalHeader
            icon={<HeartHandshake size={20} className="text-rose-500 animate-pulse" />}
            title="Create Blood Request Nodes"
            subtitle="Clinical Requisition Registry Form"
            gradient="from-rose-950 to-slate-950 border-b border-rose-500/20"
            onClose={() => setShowRequestModal(false)}
          />
          <form onSubmit={handleCreateBloodRequest} className="p-6 space-y-4 overflow-y-auto bg-slate-950 text-slate-200">
            {formError && (
              <div className="p-3 bg-red-950/50 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl flex items-center gap-1.5 animate-shake">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-1.5">
                <CheckCircle size={14} className="shrink-0 animate-bounce" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Patient Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="E.g., K. R. Vijayan"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Blood Type</label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-rose-500 outline-none cursor-pointer"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Units Needed</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={unitsNeeded}
                    onChange={(e) => setUnitsNeeded(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Hospital Delivery Location</label>
              <input
                type="text"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                placeholder="E.g. Alappuzha General Hospital (Ward 5)"
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Doctor's Contact number</label>
                <input
                  type="tel"
                  value={doctorContact}
                  onChange={(e) => setDoctorContact(e.target.value)}
                  placeholder="10-digit Mobile Number"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Requestor Phone</label>
                <input
                  type="tel"
                  value={requestorPhone}
                  onChange={(e) => setRequestorPhone(e.target.value)}
                  placeholder="10-digit Mobile Number"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                  required
                />
              </div>
            </div>

            {/* Simulated Attachment Upload */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Attach Doctor's Requisition/Approval Letter <span className="text-red-500">*</span>
              </label>

              {uploadedFile ? (
                <div className="p-3 bg-slate-900 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-white truncate max-w-[200px]">{uploadedFile.name}</p>
                      <p className="text-[9px] text-slate-500">{uploadedFile.size}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-1 rounded hover:bg-red-950/20 transition-all cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div
                  onClick={handleSimulateUpload}
                  className="border-2 border-dashed border-slate-800 hover:border-rose-500/30 rounded-2xl p-5 text-center cursor-pointer transition-all bg-slate-950"
                >
                  <Paperclip size={24} className="mx-auto text-slate-500 mb-2 hover:text-rose-400 transition-colors" />
                  <p className="text-xs font-bold text-slate-400">Simulate Requisition Slip Attachment</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">PDF or Image scan from official hospital letterhead required.</p>
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="attest"
                className="mt-0.5 rounded bg-slate-900 border-slate-800 text-rose-600 focus:ring-rose-500 cursor-pointer"
                required
              />
              <label htmlFor="attest" className="text-[10px] text-slate-400 leading-normal select-none cursor-pointer">
                I attest that this is a verified medical emergency, and the uploaded requisition letter is a genuine clinical slip signed by a registered practitioner.
              </label>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800/40">
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-black py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingRequest}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black py-2.5 rounded-xl transition-all shadow-md shadow-rose-500/10 hover:shadow-rose-500/20 flex items-center justify-center gap-1.5 cursor-pointer btn-premium-interactive"
              >
                {isSubmittingRequest ? <Loader2 size={14} className="animate-spin" /> : <HeartHandshake size={14} />}
                {isSubmittingRequest ? "Signing & Submitting..." : "Attest & Submit"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* PLEDGE DONATION MODAL */}
      {selectedRequestForPledge && (
        <Modal onClose={() => setSelectedRequestForPledge(null)} maxWidth="max-w-md">
          <ModalHeader
            icon={<HeartHandshake size={20} className="text-rose-400" />}
            title={`Pledge Donation: ${selectedRequestForPledge.bloodType}`}
            subtitle={`Beneficiary: ${selectedRequestForPledge.patientName}`}
            gradient="from-rose-950 to-slate-950 border-b border-rose-500/20"
            onClose={() => setSelectedRequestForPledge(null)}
          />
          <form onSubmit={handlePledgeBlood} className="p-6 space-y-4 bg-slate-950 text-slate-200">
            <div className="bg-slate-900/50 border border-rose-500/20 p-4 rounded-xl space-y-2">
              <p className="text-xs text-slate-300 leading-relaxed">
                By pledging, you represent that you are an eligible donor (18-65 years, &gt;45kg, with no recent infections or donations within 90 days) and will travel to the delivery hospital:
              </p>
              <p className="text-xs text-white font-bold uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={12} className="text-rose-500" /> {selectedRequestForPledge.hospital}
              </p>
            </div>

            {pledgeError && (
              <div className="p-2.5 bg-red-950/50 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl flex items-center gap-1.5 animate-shake">
                <AlertTriangle size={12} />
                <span>{pledgeError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Your Full Name</label>
              <input
                type="text"
                value={pledgeName}
                onChange={(e) => setPledgeName(e.target.value)}
                placeholder="E.g., Ramesh Kumar"
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Your Phone number</label>
              <input
                type="tel"
                value={pledgePhone}
                onChange={(e) => setPledgePhone(e.target.value)}
                placeholder="E.g. +91 94460 XXXXX"
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                required
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800/40">
              <button
                type="button"
                onClick={() => setSelectedRequestForPledge(null)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-black py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingPledge}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black py-2.5 rounded-xl transition-all shadow-md shadow-rose-500/10 hover:shadow-rose-500/20 flex items-center justify-center gap-1.5 cursor-pointer btn-premium-interactive"
              >
                {isSubmittingPledge ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                {isSubmittingPledge ? "Submitting..." : "Confirm Pledge"}
              </button>
            </div>
          </form>
        </Modal>
      )}
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
              className={`text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors ${isAdmin ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'
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
            className={`flex-1 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${isAdmin ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'
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
function ServicesModule({ userCoords, locationStatus, userRole, onCommission, onShowEarning, services, setServices }) {

  // Dynamically fetch (mock) local services based on map suggestions (user location)
  useEffect(() => {
    if (userCoords) {
      const dynamicServices = [
        { id: 'd1', category: "Ambulance", name: "Local Fast Response", rating: 4.8, lat: userCoords.lat + 0.015, lng: userCoords.lng + 0.012, registeredAt: "Nearby Area", verified: true, available: true, status: 'approved' },
        { id: 'd2', category: "Plumber", name: "QuickFix Local Plumber", rating: 4.5, lat: userCoords.lat - 0.01, lng: userCoords.lng + 0.02, registeredAt: "Nearby Area", verified: true, available: true, status: 'approved' },
        { id: 'd3', category: "Electrician", name: "City Power Solutions", rating: 4.7, lat: userCoords.lat + 0.02, lng: userCoords.lng - 0.01, registeredAt: "Nearby Area", verified: true, available: true, status: 'approved' },
        { id: 'd4', category: "Tow Truck", name: "Express Auto Recovery", rating: 4.3, lat: userCoords.lat - 0.015, lng: userCoords.lng - 0.015, registeredAt: "Nearby Area", verified: false, available: true, status: 'approved' },
      ];
      setServices(prev => {
        if (prev.some(s => s.id === 'd1')) return prev;
        return [...dynamicServices, ...prev];
      });
    }
  }, [userCoords]);
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
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${categoryFilter === cat ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider transition-colors ${service.verified ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {service.verified ? '✓ Verified' : 'Unverified'}
                  </button>
                  <button
                    onClick={() => toggleAvailable(service.id)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider transition-colors ${service.available ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
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
function SurveyModule({ userRole, userCoords, onMicroReward, onShowEarning, surveys, setSurveys }) {

  // Dynamically fetch (mock) local surveys based on map suggestions (user location)
  useEffect(() => {
    if (userCoords) {
      const dynamicSurveys = [
        { id: 'ds1', title: "Local Ward Infrastructure Feedback", authority: "Municipal Council", expires: "3 days left", responses: 840, status: 'approved' },
        { id: 'ds2', title: "Community Safety Assessment", authority: "Local Police Dept", expires: "1 week left", responses: 1250, status: 'approved' }
      ];
      setSurveys(prev => {
        if (prev.some(s => s.id === 'ds1')) return prev;
        return [...dynamicSurveys, ...prev];
      });
    }
  }, [userCoords]);
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
              className={`text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm ${isAdmin ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'
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
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${survey.type === 'Government' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
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
                className={`p-3 rounded-lg border-2 transition-colors text-left ${form.type === t
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
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${survey.type === 'Government' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
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
                    className={`p-2 text-[10px] rounded-lg border-2 transition-colors text-center ${answers.q1 === opt ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold' : 'border-slate-200 hover:border-slate-300'
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

// --- ADMIN APPROVALS ---
function AdminApprovalsModule({
  volunteerRequests,
  setVolunteerRequests,
  services,
  setServices,
  surveys,
  setSurveys,
  userRole,
  setUserRole,
  setVolunteerApplicationStatus,
  displayUser,
  addWalletTxn,
  bloodRequests = [],
  setBloodRequests,
  creditMicro,
  showEarning
}) {
  const [subTab, setSubTab] = useState('volunteers');
  const [selectedDocPreview, setSelectedDocPreview] = useState(null); // for inspecting requisition slips

  const pendingVolunteers = volunteerRequests.filter(r => r.status === 'pending');
  const pendingServices = services.filter(s => s.status === 'pending');
  const pendingSurveys = surveys.filter(s => s.status === 'pending');
  const pendingBlood = (bloodRequests || []).filter(r => r.status === 'pending');

  const handleApproveVolunteer = (id, name) => {
    setVolunteerRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    if (name === displayUser.name) {
      setUserRole('Volunteer');
      setVolunteerApplicationStatus('approved');
    }
  };

  const handleRejectVolunteer = (id, name) => {
    setVolunteerRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    if (name === displayUser.name) {
      setVolunteerApplicationStatus('rejected');
    }
  };

  const handleApproveService = (id, name, onboardedBy) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, status: 'approved', verified: true } : s));
    // Reward the volunteer who onboarded the service
    if (onboardedBy && onboardedBy.toLowerCase().includes('volunteer')) {
      addWalletTxn({
        type: 'credit',
        source: 'commission',
        amount: 25,
        description: `Commission: Onboarded ${name} (Approved)`
      });
    }
  };

  const handleRejectService = (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const handleApproveSurvey = (id) => {
    setSurveys(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' } : s));
  };

  const handleRejectSurvey = (id) => {
    setSurveys(prev => prev.filter(s => s.id !== id));
  };

  const handleApproveBlood = (id, patientName) => {
    setBloodRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    // Reward the volunteer who verified the blood request
    if (userRole === 'Volunteer' && creditMicro) {
      creditMicro(25, `Audit: Verified blood request for ${patientName}`);
      if (showEarning) showEarning(25, 'micro');
    }
  };

  const handleRejectBlood = (id) => {
    setBloodRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0b0f19]/80 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden glass-panel">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ShieldCheck size={22} className="text-purple-400" /> Saathi Approvals Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Verify and audit volunteer registrations, service listings, civic surveys, and high-priority blood requests to maintain platform integrity.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto">
        <button
          onClick={() => setSubTab('volunteers')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider whitespace-nowrap border-b-2 transition-all ${subTab === 'volunteers'
            ? 'border-purple-500 text-purple-400 font-bold'
            : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
        >
          <HeartHandshake size={14} />
          Volunteer Requests
          {pendingVolunteers.length > 0 && (
            <span className="bg-purple-950 text-purple-400 border border-purple-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {pendingVolunteers.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setSubTab('services')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider whitespace-nowrap border-b-2 transition-all ${subTab === 'services'
            ? 'border-purple-500 text-purple-400 font-bold'
            : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
        >
          <Wrench size={14} />
          Service Listings
          {pendingServices.length > 0 && (
            <span className="bg-purple-950 text-purple-400 border border-purple-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {pendingServices.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setSubTab('surveys')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider whitespace-nowrap border-b-2 transition-all ${subTab === 'surveys'
            ? 'border-purple-500 text-purple-400 font-bold'
            : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
        >
          <FileText size={14} />
          Civic Surveys
          {pendingSurveys.length > 0 && (
            <span className="bg-purple-950 text-purple-400 border border-purple-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {pendingSurveys.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setSubTab('blood')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider whitespace-nowrap border-b-2 transition-all ${subTab === 'blood'
            ? 'border-purple-500 text-purple-400 font-bold'
            : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
        >
          <HeartHandshake size={14} className="text-rose-500 animate-pulse" />
          Blood Requests
          {pendingBlood.length > 0 && (
            <span className="bg-rose-950 text-rose-400 border border-rose-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
              {pendingBlood.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-4">
        {subTab === 'volunteers' && (
          <div className="space-y-3">
            {pendingVolunteers.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500">
                <CheckCircle size={36} className="mx-auto text-green-500 mb-2" />
                <p className="text-sm font-medium">No pending volunteer registrations.</p>
              </div>
            ) : (
              pendingVolunteers.map(req => (
                <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm transition-all hover:border-purple-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                        <User size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{req.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{req.email || "No email provided"} • {req.phone}</p>
                        <div className="mt-3 bg-slate-50 border border-slate-100 rounded-lg p-2.5 space-y-1">
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Identity Proof (DigiLocker)</p>
                          <p className="text-xs text-slate-700"><strong>Type:</strong> {req.idType || "Aadhaar Card"}</p>
                          <p className="text-xs text-slate-700"><strong>ID Number:</strong> {req.idNumber || "XXXX XXXX 8892"}</p>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                      Pending
                    </span>
                  </div>
                  <div className="flex gap-3 mt-4 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => handleRejectVolunteer(req.id, req.name)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold py-2 rounded-xl transition-all"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApproveVolunteer(req.id, req.name)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded-xl transition-all shadow-sm"
                    >
                      Approve Volunteer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {subTab === 'services' && (
          <div className="space-y-3">
            {pendingServices.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500">
                <CheckCircle size={36} className="mx-auto text-green-500 mb-2" />
                <p className="text-sm font-medium">No pending service listings.</p>
              </div>
            ) : (
              pendingServices.map(service => (
                <div key={service.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm transition-all hover:border-purple-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                        <Wrench size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{service.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{service.category} • Onboarded by {service.onboardedBy || 'Volunteer'}</p>
                        <p className="text-xs text-slate-600 mt-2"><strong>Owner:</strong> {service.ownerName} ({service.ownerPhone})</p>
                        {service.description && (
                          <p className="text-xs text-slate-600 mt-1 italic">"{service.description}"</p>
                        )}
                        {service.shopDoc && (
                          <div className="mt-3 bg-blue-50/50 border border-blue-100 rounded-lg p-2.5 flex items-center gap-2">
                            <FileText size={16} className="text-blue-600 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-800 truncate">{service.shopDoc.name}</p>
                              <p className="text-[10px] text-slate-500">Shop verification • {(service.shopDoc.size / 1024).toFixed(0)} KB</p>
                            </div>
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Verified Doc</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                      Pending Approval
                    </span>
                  </div>
                  <div className="flex gap-3 mt-4 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => handleRejectService(service.id)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold py-2 rounded-xl transition-all"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApproveService(service.id, service.name, service.onboardedBy)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded-xl transition-all shadow-sm"
                    >
                      Approve Listing
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {subTab === 'surveys' && (
          <div className="space-y-3">
            {pendingSurveys.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500">
                <CheckCircle size={36} className="mx-auto text-green-500 mb-2" />
                <p className="text-sm font-medium">No pending civic surveys.</p>
              </div>
            ) : (
              pendingSurveys.map(survey => (
                <div key={survey.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm transition-all hover:border-purple-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <FileText size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{survey.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Authority: {survey.authority} • Expires: {survey.expires}</p>
                        {survey.rewardAmount && (
                          <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                            <Sparkles size={10} /> Reward: ₹{survey.rewardAmount}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                      Pending Review
                    </span>
                  </div>
                  <div className="flex gap-3 mt-4 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => handleRejectSurvey(survey.id)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold py-2 rounded-xl transition-all"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApproveSurvey(survey.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded-xl transition-all shadow-sm"
                    >
                      Approve Survey
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {subTab === 'blood' && (
          <div className="space-y-3">
            {pendingBlood.length === 0 ? (
              <div className="bg-[#0b0f19]/20 border border-slate-800/80 border-dashed rounded-2xl p-12 text-center text-slate-500 glass-panel">
                <CheckCircle size={36} className="mx-auto text-emerald-500 mb-3 animate-pulse" />
                <p className="font-bold text-slate-400 text-sm">No pending blood requests to verify</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">All submitted requirements have been successfully audited and updated.</p>
              </div>
            ) : (
              pendingBlood.map(req => (
                <div key={req.id} className="bg-[#0b0f19]/60 border border-slate-850 rounded-2xl p-5 shadow-xl glass-panel relative overflow-hidden transition-all hover:border-purple-500/20">
                  <div className="absolute -top-12 -right-12 w-28 h-28 bg-rose-500/5 rounded-full blur-2xl"></div>

                  <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-rose-950/80 border border-rose-500/30 text-rose-500 rounded-xl flex items-center justify-center font-black text-lg animate-pulse shrink-0">
                        {req.bloodType}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-black text-white text-base leading-tight">Patient: {req.patientName}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{req.hospital}</p>
                        <p className="text-xs text-slate-400">
                          <strong>Units Required:</strong> {req.unitsNeeded} units
                        </p>
                        <p className="text-[11px] text-slate-500 font-semibold mt-1">
                          Raised by: {req.requestorName} • Phone: {req.requestorPhone}
                        </p>

                        {/* Clinical requisition preview area */}
                        <div className="mt-3 bg-slate-950/80 border border-slate-900 rounded-xl p-3 max-w-sm space-y-2.5 relative">
                          <p className="text-[9px] uppercase font-black text-slate-500 tracking-wider">Clinical Requisition slip</p>
                          <div className="flex items-center gap-2">
                            <FileText size={18} className="text-rose-500 shrink-0 animate-pulse" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-extrabold text-slate-300 truncate">{req.approvalLetter}</p>
                              <p className="text-[9px] text-slate-500">Official Practitioner Requisition Attested</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedDocPreview(req)}
                            className="w-full text-center py-2 bg-slate-900 hover:bg-slate-850 text-[10px] text-purple-400 hover:text-purple-300 rounded-lg transition-colors font-black uppercase tracking-wider cursor-pointer border border-slate-800"
                          >
                            Inspect Attested Slip
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 text-right">
                      <span className="text-[10px] bg-amber-950/60 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse">
                        Awaiting Verification
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                        <Phone size={10} /> Doctor Contact: {req.doctorContact}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-5 border-t border-slate-800/40 pt-4">
                    <button
                      onClick={() => handleRejectBlood(req.id)}
                      className="flex-1 bg-slate-950 hover:bg-red-950/20 border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-400 text-xs font-black py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Reject Request
                    </button>

                    <button
                      onClick={() => {
                        // Phone lines secure simulator
                        alert(`Contact verified! Practitioner confirmed clinical case details, hospital bed assignment, and signature authenticity.`);
                      }}
                      className="bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-black py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Phone size={14} className="text-emerald-400" /> Dial Doctor
                    </button>

                    <button
                      onClick={() => handleApproveBlood(req.id, req.patientName)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-1.5 btn-premium-interactive"
                    >
                      <CheckCircle size={14} /> Approve & Publish
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* DETAILED DOCUMENT INSPECTION MODAL */}
      {selectedDocPreview && (
        <Modal onClose={() => setSelectedDocPreview(null)} maxWidth="max-w-md" zIndex="z-[300]">
          <ModalHeader
            icon={<ShieldCheck size={20} className="text-purple-400" />}
            title="Inspect Requisition Slip"
            subtitle="Saathi Decentralized Verification Hub"
            gradient="from-purple-950 to-slate-950 border-b border-purple-500/20"
            onClose={() => setSelectedDocPreview(null)}
          />
          <div className="p-6 space-y-4 bg-slate-950 text-slate-200">
            {/* Holographic Watermark Letterhead slip */}
            <div className="border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden bg-slate-900/60 holo-watermark security-scanner security-scanner-green">
              {/* Top Banner of Hospital */}
              <div className="text-center border-b border-slate-800/60 pb-3 mb-3">
                <h4 className="text-xs font-black text-white tracking-widest uppercase">General Hospital Requisition Slip</h4>
                <p className="text-[8px] text-slate-400">Government Registry Node • Kerala Department of Health</p>
              </div>

              <div className="space-y-2 text-[10px] text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold uppercase">Patient:</span>
                  <span className="font-extrabold text-white">{selectedDocPreview.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold uppercase">Required Blood:</span>
                  <span className="font-extrabold text-rose-500">{selectedDocPreview.bloodType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold uppercase">Quantity Required:</span>
                  <span className="font-extrabold text-white">{selectedDocPreview.unitsNeeded} Units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold uppercase">Hospital / Wing:</span>
                  <span className="font-extrabold text-white truncate max-w-[150px]">{selectedDocPreview.hospital}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold uppercase">Verify Doctor:</span>
                  <span className="font-extrabold text-emerald-400">Verified ({selectedDocPreview.doctorContact})</span>
                </div>
              </div>

              {/* Holographic digital stamp seal */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-850 pt-3">
                <div className="flex flex-col">
                  <span className="text-[7px] text-slate-500 uppercase tracking-widest font-black">Cryptographic Attestation</span>
                  <span className="font-mono text-[8px] text-slate-400">SAATHI_ECDSA_P256_VERIFIED</span>
                </div>
                <div className="w-12 h-12 rounded-full border border-purple-500/20 bg-purple-950/40 flex items-center justify-center text-[10px] font-black text-purple-400 uppercase tracking-widest rotate-12">
                  SECURE
                </div>
              </div>
            </div>

            <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl text-xs text-purple-200 leading-normal flex items-start gap-2">
              <ShieldCheck size={16} className="text-purple-400 shrink-0 mt-0.5" />
              <span>
                Verify that the practitioner contact matches the clinical database registration before publishing the request. Once approved, the alert becomes instantly active for nearby users.
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedDocPreview(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-black py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
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
          <DocTab active={docTab === 'schema'} onClick={() => setDocTab('schema')} icon={<Database size={16} />} label="PostgreSQL Schema" />
          <DocTab active={docTab === 'api'} onClick={() => setDocTab('api')} icon={<Server size={16} />} label="REST APIs" />
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
function NavButton({ icon, label, active, onClick, color = 'orange', badge }) {
  const activeClasses = {
    orange: 'bg-orange-950/40 text-orange-400 border border-orange-500/20 glass-glow-amber font-extrabold',
    red: 'bg-red-950/40 text-red-400 border border-red-500/20 glass-glow-red font-extrabold',
    green: 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 glass-glow-emerald font-extrabold',
    blue: 'bg-blue-950/40 text-blue-400 border border-blue-500/20 font-extrabold',
    purple: 'bg-purple-950/40 text-purple-400 border border-purple-500/20 glass-glow-purple font-extrabold'
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer ${active ? activeClasses[color] : 'text-slate-400 hover:bg-slate-900/60 hover:text-white border border-transparent'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`${active ? '' : 'text-slate-500'}`}>{icon}</div>
        {label}
      </div>
      {badge > 0 && (
        <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 animate-pulse">
          {badge}
        </span>
      )}
    </button>
  );
}

function MobileNavButton({ icon, label, active, onClick, color = '', badge }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors relative ${active ? (color || 'text-orange-500') : 'text-slate-500 hover:text-slate-300'}`}
    >
      <div className="relative">
        {icon}
        {badge > 0 && (
          <span className="absolute -top-1.5 -right-2.5 bg-purple-600 text-white text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse border border-white">
            {badge}
          </span>
        )}
      </div>
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
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[200] p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden my-8 glass-panel-heavy holo-watermark relative">

        {/* Holographic glowing lines */}
        <div className="absolute inset-0 hologram-grid pointer-events-none opacity-20"></div>

        <div className="bg-gradient-to-r from-orange-600/90 via-amber-600/90 to-emerald-600/90 backdrop-blur-sm text-white p-4 flex items-center justify-between border-b border-white/10 z-10 relative">
          <div className="flex items-center gap-2">
            <Award size={22} className="text-amber-300 animate-pulse" />
            <div>
              <h3 className="font-black text-sm tracking-tight">Certificate of Civic Impact</h3>
              <p className="text-[10px] text-white/80">Secured via WebCrypto Local Signatures</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 bg-slate-950/60 overflow-x-auto relative z-10">
          <div ref={certRef} className="mx-auto" style={{ maxWidth: '1000px' }}>
            <svg viewBox="0 0 1000 700" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', borderRadius: '8px' }}>
              <defs>
                <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0b0f19" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
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

              {/* Dynamic decorative grid inside SVG */}
              <g opacity="0.05" stroke="#ffffff" strokeWidth="0.5">
                <path d="M 0,100 L 1000,100 M 0,200 L 1000,200 M 0,300 L 1000,300 M 0,400 L 1000,400 M 0,500 L 1000,500 M 0,600 L 1000,600" />
                <path d="M 100,0 L 100,700 M 200,0 L 200,700 M 300,0 L 300,700 M 400,0 L 400,700 M 500,0 L 500,700 M 600,0 L 600,700 M 700,0 L 700,700 M 800,0 L 800,700 M 900,0 L 900,700" />
              </g>

              <g opacity="0.4" fill="#fbbf24">
                <circle cx="60" cy="60" r="40" opacity="0.1" />
                <circle cx="60" cy="60" r="25" fill="#0f172a" stroke="#fbbf24" strokeWidth="1" />
                <circle cx="940" cy="60" r="40" opacity="0.1" />
                <circle cx="940" cy="60" r="25" fill="#0f172a" stroke="#fbbf24" strokeWidth="1" />
                <circle cx="60" cy="640" r="40" opacity="0.1" />
                <circle cx="60" cy="640" r="25" fill="#0f172a" stroke="#fbbf24" strokeWidth="1" />
                <circle cx="940" cy="640" r="40" opacity="0.1" />
                <circle cx="940" cy="640" r="25" fill="#0f172a" stroke="#fbbf24" strokeWidth="1" />
              </g>

              <rect x="30" y="30" width="940" height="640" fill="none" stroke="url(#goldGrad)" strokeWidth="4" rx="8" />
              <rect x="45" y="45" width="910" height="610" fill="none" stroke="#fbbf24" strokeWidth="1" rx="4" opacity="0.2" />

              <g transform="translate(500, 90)">
                <path d="M -120,0 Q -60,-15 0,0 Q 60,-15 120,0" stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0.8" />
                <circle cx="0" cy="0" r="4" fill="#fbbf24" />
              </g>

              <g transform="translate(500, 130)">
                <rect x="-30" y="-18" width="60" height="36" rx="8" fill="url(#brandGrad)" />
                <text x="0" y="38" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold" letterSpacing="3" fontFamily="Arial, sans-serif">SAATHI</text>
              </g>

              <text x="500" y="220" textAnchor="middle" fill="#f8fafc" fontSize="42" fontFamily="Georgia, serif" fontWeight="bold">Certificate of</text>
              <text x="500" y="270" textAnchor="middle" fill="#fbbf24" fontSize="52" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="bold">Civic Impact</text>

              <line x1="350" y1="295" x2="650" y2="295" stroke="url(#goldGrad)" strokeWidth="2" />
              <circle cx="500" cy="295" r="4" fill="#fbbf24" />

              <text x="500" y="335" textAnchor="middle" fill="#fbbf24" fontSize="14" fontFamily="Georgia, serif" fontStyle="italic" letterSpacing="3">— PROUDLY PRESENTED TO —</text>

              <text x="500" y="400" textAnchor="middle" fill="#ffffff" fontSize="54" fontFamily="Georgia, serif" fontWeight="bold">{user.name}</text>
              <line x1="250" y1="420" x2="750" y2="420" stroke="#f59e0b" strokeWidth="1.5" opacity="0.5" />

              <text x="500" y="465" textAnchor="middle" fill="#94a3b8" fontSize="16" fontFamily="Georgia, serif">in recognition of outstanding contribution to community welfare,</text>
              <text x="500" y="488" textAnchor="middle" fill="#94a3b8" fontSize="16" fontFamily="Georgia, serif">demonstrating selfless service through volunteering, emergency response,</text>
              <text x="500" y="511" textAnchor="middle" fill="#94a3b8" fontSize="16" fontFamily="Georgia, serif">and civic engagement in {user.location}.</text>

              <g transform="translate(180, 550)">
                <rect x="0" y="0" width="180" height="70" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" opacity="0.8" />
                <text x="90" y="28" textAnchor="middle" fill="#fbbf24" fontSize="28" fontWeight="bold" fontFamily="Georgia, serif">{user.volunteerHours}</text>
                <text x="90" y="52" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="Arial, sans-serif" letterSpacing="1.5">SERVICE HOURS</text>
              </g>
              <g transform="translate(410, 550)">
                <rect x="0" y="0" width="180" height="70" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" opacity="0.8" />
                <text x="90" y="28" textAnchor="middle" fill="#fbbf24" fontSize="28" fontWeight="bold" fontFamily="Georgia, serif">3</text>
                <text x="90" y="52" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="Arial, sans-serif" letterSpacing="1.5">MISSIONS COMPLETED</text>
              </g>
              <g transform="translate(640, 550)">
                <rect x="0" y="0" width="180" height="70" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" opacity="0.8" />
                <text x="90" y="28" textAnchor="middle" fill="#fbbf24" fontSize="28" fontWeight="bold" fontFamily="Georgia, serif">47</text>
                <text x="90" y="52" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="Arial, sans-serif" letterSpacing="1.5">LIVES IMPACTED</text>
              </g>

              <g transform="translate(150, 650)">
                <line x1="0" y1="0" x2="180" y2="0" stroke="#475569" strokeWidth="1" />
                <text x="90" y="18" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Georgia, serif" fontStyle="italic">Date of Issue</text>
                <text x="90" y="-8" textAnchor="middle" fill="#ffffff" fontSize="13" fontFamily="Georgia, serif" fontWeight="bold">{issueDate}</text>
              </g>
              <g transform="translate(670, 650)">
                <line x1="0" y1="0" x2="180" y2="0" stroke="#475569" strokeWidth="1" />
                <text x="90" y="18" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Georgia, serif" fontStyle="italic">Authorized Signatory</text>
                <text x="90" y="-8" textAnchor="middle" fill="#ffffff" fontSize="14" fontStyle="italic">A. Sharma, Director</text>
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

              <text x="500" y="685" textAnchor="middle" fill="#fbbf24" fontSize="9" fontFamily="Courier New, monospace" letterSpacing="1">
                CERTIFICATE ID: {certId}  •  CRYPTOGRAPHIC INTEGRITY: {user.keyFingerprint ? `VERIFIED [ECDSA_${user.keyFingerprint}]` : 'SYS_SECURE_VERIFIED'}
              </text>
            </svg>
          </div>
        </div>

        <div className="bg-slate-900 border-t border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            <p className="font-bold text-slate-200">Certificate ID: <span className="font-mono text-amber-400">{certId}</span></p>
            <p className="mt-0.5 text-[10px] text-slate-500">Cryptographically signed key: <span className="font-mono text-emerald-400">{user.keyFingerprint || 'SYS_ACTIVE'}</span></p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={downloadPNG}
              disabled={isDownloading}
              className="flex-1 sm:flex-initial bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 px-4 rounded-xl transition-all border border-slate-700/50 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download size={14} /> PNG Image
            </button>
            <button
              onClick={downloadPDF}
              disabled={isDownloading || !jsPDFLoaded}
              className="flex-1 sm:flex-initial bg-gradient-to-r from-orange-600 to-emerald-600 hover:from-orange-700 hover:to-emerald-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-orange-500/10"
            >
              {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              {isDownloading ? 'Generating...' : !jsPDFLoaded ? 'Loading PDF...' : 'Download Secure PDF'}
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
              <div className={`text-xs py-2 px-4 rounded-lg flex items-center gap-2 border max-w-[90%] text-center ${msg.severity === 'ban' ? 'bg-red-600 text-white border-red-700 font-semibold' :
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
                    className={`rounded-2xl overflow-hidden border-2 transition-shadow hover:shadow-md w-64 ${msg.sender === 'me' ? 'border-orange-300' : 'border-slate-200'
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
                  <div className={`rounded-2xl px-4 py-2 text-sm ${msg.sender === 'me' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
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
function SplashScreen({ onDone, isDarkMode }) {
  const [phase, setPhase] = useState('enter'); // enter | hold | exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 800);
    const t2 = setTimeout(() => setPhase('exit'), 2200);
    const t3 = setTimeout(() => onDone(), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[1000] flex flex-col items-center justify-center transition-all duration-500 ${isDarkMode ? 'bg-[#070913] text-slate-200' : 'bg-slate-50 text-slate-800'} ${phase === 'exit' ? 'opacity-0' : 'opacity-100'
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

      {/* Radial soft glow behind logo */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Logo */}
      <div className="splash-logo relative z-10 mb-8">
        <SplashLogoMark size={140} />
      </div>

      {/* Name */}
      <h1 className="splash-name text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400 text-6xl font-black tracking-tight relative z-10 drop-shadow-2xl">
        Saathi
      </h1>

      {/* Tagline */}
      <p className="splash-tagline text-slate-400 text-xs uppercase font-extrabold mt-4 relative z-10 tracking-[0.4em] text-center">
        Your community companion
      </p>

      {/* Loading dots */}
      <div className="absolute bottom-16 flex gap-1.5">
        <span className="splash-dot w-2 h-2 bg-orange-500 rounded-full" style={{ animationDelay: '0s' }}></span>
        <span className="splash-dot w-2 h-2 bg-amber-400 rounded-full" style={{ animationDelay: '0.2s' }}></span>
        <span className="splash-dot w-2 h-2 bg-emerald-500 rounded-full" style={{ animationDelay: '0.4s' }}></span>
      </div>

      {/* Bottom credit */}
      <p className="absolute bottom-6 text-slate-600 text-[10px] uppercase tracking-widest font-bold">
        Secure & Sandboxed • Made in India 🇮🇳
      </p>
    </div>
  );
}

// Larger, more detailed logo mark for splash & auth screens
function SplashLogoMark({ size = 140 }) {
  return (
    <img
      src={logoUrl}
      alt="Saathi Logo"
      style={{
        width: size,
        height: size,
        filter: 'drop-shadow(0 0 25px rgba(16, 185, 129, 0.7)) drop-shadow(0 0 45px rgba(245, 158, 11, 0.5))'
      }}
      className="flex-shrink-0 animate-pulse-slow"
    />
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

function AuthScreen({ onSuccess, isDarkMode, currentLanguage, setCurrentLanguage }) {
  const [screen, setScreen] = useState('landing');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
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
        registerAsVolunteer: signupData.registerAsVolunteer || false,
      });
    }, 1000);
  }, [phone, signupData, onSuccess]);

  // Brand panel (left side on desktop) — premium glassmorphic dark panel
  const brandPanel = (
    <div className="hidden md:flex flex-col justify-between bg-[#0b0f19] text-white p-12 md:w-1/2 relative overflow-hidden border-r border-slate-800">
      <div className="absolute inset-0 hologram-grid pointer-events-none opacity-20"></div>

      {/* Radial soft glow */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-start">
        <div className="mb-6">
          <SplashLogoMark size={96} />
        </div>
        <h1 className="text-6xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400 drop-shadow-lg">Saathi</h1>
        <p className="text-xs uppercase font-extrabold tracking-[0.4em] text-slate-400 mt-4">
          Your community companion
        </p>
      </div>

      <div className="relative z-10 space-y-5">
        <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/40 backdrop-blur border border-slate-800/40">
          <div className="bg-red-500/10 p-2.5 rounded-xl text-red-400 shrink-0">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-100">Emergency in seconds</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">One-tap SOS shares cryptographically sealed GPS telemetry with local volunteers & responders.</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/40 backdrop-blur border border-slate-800/40">
          <div className="bg-green-500/10 p-2.5 rounded-xl text-green-400 shrink-0">
            <HeartHandshake size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-100">Volunteer locally</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">Discover verified civic opportunities and blood drives near you. Earn rewards securely.</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/40 backdrop-blur border border-slate-800/40">
          <div className="bg-orange-500/10 p-2.5 rounded-xl text-orange-400 shrink-0">
            <Wrench size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-100">Hyperlocal services</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">Access ambulance and utility providers. Locations verified via telemetry tracking.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors ${isDarkMode ? 'bg-[#070913] text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      {brandPanel}

      <div className={`flex-1 flex items-center justify-center p-4 md:p-8 relative overflow-hidden transition-colors ${isDarkMode ? 'bg-[#070913]' : 'bg-slate-50'}`}>
        
        <div className="absolute top-6 right-6 z-50" data-dropdown>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowLanguageMenu(!showLanguageMenu);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-orange-950/40 hover:bg-orange-900/60 text-orange-400 transition-all border border-orange-500/20 cursor-pointer shadow-lg backdrop-blur"
          >
            <span className="hidden sm:inline">{LANGUAGES[currentLanguage]?.nativeName || 'English'}</span>
            <span className="sm:hidden">{LANGUAGES[currentLanguage]?.nativeName.slice(0, 2).toUpperCase() || 'EN'}</span>
            <ChevronRight size={12} className={`transform transition-transform ${showLanguageMenu ? 'rotate-90' : ''}`} />
          </button>
          {showLanguageMenu && (
            <div className={`absolute right-0 mt-2 w-36 border rounded-xl shadow-2xl z-50 overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="p-1">
                {Object.keys(LANGUAGES).map(langCode => (
                  <button
                    key={langCode}
                    onClick={() => {
                      setCurrentLanguage(langCode);
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between ${currentLanguage === langCode ? 'bg-orange-950/50 text-orange-400 font-bold border border-orange-500/10' : isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}
                  >
                    <span>{LANGUAGES[langCode].nativeName}</span>
                    {currentLanguage === langCode && <CheckCircle size={10} className="text-orange-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Background micro grid */}
        <div className="absolute inset-0 hologram-grid opacity-10 pointer-events-none"></div>

        <div className={`w-full max-w-md backdrop-blur-md rounded-2xl p-6 sm:p-8 relative z-10 shadow-2xl border ${isDarkMode ? 'bg-slate-900/30 border-slate-800/80' : 'bg-white/80 border-slate-200/80'}`}>

          {/* Mobile logo header */}
          <div className="md:hidden mb-8 flex flex-col items-center text-center">
            <div className="mb-4">
              <SplashLogoMark size={88} />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-emerald-400">Saathi</h1>
            <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-slate-400 mt-2">
              Your community companion
            </p>
          </div>

          {screen === 'landing' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-2xl font-black text-white">Welcome</h2>
                <p className="text-xs text-slate-400 mt-1">Sign in or create your Saathi account securely.</p>
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={isProcessing}
                className="w-full bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-200 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors disabled:opacity-50 btn-premium-interactive cursor-pointer text-sm"
              >
                {isProcessing ? (
                  <Loader2 size={18} className="animate-spin text-emerald-400" />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
                Continue with Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-800"></div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-slate-800"></div>
              </div>

              <button
                onClick={() => setScreen('signin-phone')}
                className="w-full bg-gradient-to-r from-orange-600 to-emerald-600 hover:from-orange-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/10 btn-premium-interactive cursor-pointer text-sm"
              >
                <Phone size={18} /> Sign in with Phone
              </button>

              <button
                onClick={() => setScreen('signup-phone')}
                className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-orange-500/40 text-orange-400 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm"
              >
                Create New Account <ArrowRight size={16} />
              </button>

              <p className="text-[10px] text-slate-500 text-center leading-relaxed mt-4">
                By continuing, you agree to Saathi's Terms and Privacy Policy. All connection channels are cryptographically signed to block intercepts.
              </p>
            </div>
          )}

          {(screen === 'signin-phone' || screen === 'signup-phone') && (
            <div className="space-y-5 animate-in fade-in">
              <button onClick={() => setScreen('landing')} className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1">
                <ArrowLeft size={14} /> Back to landing
              </button>

              <div>
                <h2 className="text-xl font-bold text-white">
                  {screen === 'signin-phone' ? 'Sign In' : 'Create Account'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">Enter your phone number to receive an OTP.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Phone Number</label>
                <div className="flex gap-2">
                  <div className="bg-slate-950 px-3 py-3 rounded-xl border border-slate-800 text-sm font-extrabold text-slate-300 flex items-center shrink-0">
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-orange-500/70 focus:outline-none"
                    autoFocus
                  />
                </div>
                {phone && !isValidPhone(phone) && (
                  <p className="text-xs text-red-400">Enter a valid 10-digit mobile number</p>
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
                className="w-full bg-gradient-to-r from-orange-600 to-emerald-600 hover:from-orange-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
              >
                Send Secure OTP <ArrowRight size={16} />
              </button>

              <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3.5 text-xs text-emerald-400 flex items-start gap-2">
                <KeyRound size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Demo Mode:</strong> Use OTP <code className="bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/20 font-mono text-white">000000</code> to verify.
                </div>
              </div>
            </div>
          )}

          {(screen === 'signin-otp' || screen === 'signup-otp') && (
            <div className="space-y-5 animate-in fade-in">
              <button
                onClick={() => setScreen(screen === 'signin-otp' ? 'signin-phone' : 'signup-phone')}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
              >
                <ArrowLeft size={14} /> Change number
              </button>

              <div>
                <h2 className="text-xl font-black text-white">Verify Security Token</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Sent via encrypted channel to <span className="font-bold text-slate-200">+91 {phone}</span>
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">6-Digit Verification Token</label>
                <div className="flex gap-2 justify-between">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => otpRefs.current[idx] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength="6"
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-10 h-12 sm:w-12 sm:h-12 text-center bg-slate-950 border border-slate-800 rounded-xl text-lg font-black text-white focus:border-orange-500 focus:outline-none transition-colors"
                    />
                  ))}
                </div>
                {otpError && <p className="text-xs text-red-400 font-bold mt-1 text-center">{otpError}</p>}
              </div>

              <button
                onClick={() => verifyOtp(screen === 'signin-otp' ? 'signin' : 'signup')}
                disabled={otp.some(d => !d) || isProcessing}
                className="w-full bg-gradient-to-r from-orange-600 to-emerald-600 hover:from-orange-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer text-sm"
              >
                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Fingerprint size={16} />}
                {isProcessing ? 'Verifying...' : 'Submit Verification Token'}
              </button>
            </div>
          )}

          {screen === 'signup-details' && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h2 className="text-xl font-black text-white">Complete Profile</h2>
                <p className="text-xs text-slate-400 mt-1">Setup your high-trust citizen profile.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Full Name (As on ID)</label>
                  <input
                    type="text"
                    required
                    placeholder="Jithu Sreekumar"
                    value={signupData.name}
                    onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-orange-500/70 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Blood Group</label>
                    <select
                      value={signupData.bloodGroup}
                      onChange={(e) => setSignupData(prev => ({ ...prev, bloodGroup: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-orange-500/70 focus:outline-none"
                    >
                      <option value="">Select Group</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Special Role</label>
                    <select
                      value={signupData.role || 'Citizen'}
                      onChange={(e) => setSignupData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-orange-500/70 focus:outline-none"
                    >
                      <option value="Citizen">Citizen</option>
                      <option value="ServiceProvider">Service Provider</option>
                      <option value="NGO">NGO Partner</option>
                      <option value="HealthcareWorker">Healthcare Worker</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Email Address</label>
                  <input
                    type="email"
                    placeholder="jithu@example.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-orange-500/70 focus:outline-none"
                  />
                </div>

                <div className="flex items-start gap-3 bg-gradient-to-r from-emerald-950/40 to-slate-900/40 p-4 rounded-xl border border-emerald-500/40 mt-4 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:border-emerald-500/60 transition-colors">
                  <input
                    type="checkbox"
                    id="registerAsVolunteer"
                    checked={signupData.registerAsVolunteer || false}
                    onChange={(e) => setSignupData(prev => ({ ...prev, registerAsVolunteer: e.target.checked }))}
                    className="w-5 h-5 mt-0.5 text-emerald-500 border-emerald-700/50 rounded bg-slate-950 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div>
                    <label htmlFor="registerAsVolunteer" className="text-sm font-black text-emerald-400 cursor-pointer select-none block">
                      Register as a Volunteer
                    </label>
                    <p className="text-xs text-slate-400 mt-1 cursor-pointer select-none" onClick={() => setSignupData(prev => ({ ...prev, registerAsVolunteer: !prev.registerAsVolunteer }))}>
                      Requires Admin approval. Unlock SOS rescue and earning opportunities.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setScreen('signup-digilocker')}
                disabled={!signupData.name || !signupData.bloodGroup}
                className="w-full bg-gradient-to-r from-orange-600 to-emerald-600 hover:from-orange-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer text-sm"
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
    <div className="space-y-5 animate-in fade-in text-slate-200">
      <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-500">
        <span className="bg-emerald-950 text-emerald-400 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-500/20"><CheckCircle size={10} /> Phone verified</span>
        <ChevronRight size={10} className="text-slate-700" />
        <span className="bg-emerald-950 text-emerald-400 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-500/20"><CheckCircle size={10} /> Profile setup</span>
        <ChevronRight size={10} className="text-slate-700" />
        <span className="text-orange-400 font-extrabold">ID Verification</span>
      </div>

      {state !== 'success' && (
        <button onClick={onBack} className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1">
          <ArrowLeft size={14} /> Back
        </button>
      )}

      <div>
        <h2 className="text-xl font-black text-white">Government Identity Verification</h2>
        <p className="text-xs text-slate-400 mt-1">UIDAI & Meri Pehchaan integrated node.</p>
      </div>

      {state === 'idle' && (
        <>
          <div className="bg-slate-950/80 border border-blue-500/20 rounded-2xl p-5 relative overflow-hidden glass-panel">
            {/* Soft background blue glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>

            <div className="flex items-center gap-3.5 mb-3.5 relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-500/10">
                DL
              </div>
              <div>
                <h3 className="font-bold text-white">DigiLocker</h3>
                <p className="text-[11px] text-slate-400">Government of India • Trusted Identity</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fetch your government-issued ID directly from DigiLocker. Your documents stay encrypted and never leave the secure channel.
            </p>
          </div>

          <button
            onClick={handleConnect}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Fingerprint size={18} /> Connect with DigiLocker
          </button>

          <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-400 flex items-start gap-2">
            <ShieldAlert size={14} className="text-amber-500 shrink-0 mt-0.5" />
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
