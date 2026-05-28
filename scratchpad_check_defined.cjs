const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const components = [
"Activity", "AdminApprovalsModule", "AlertDetailModal", "AlertOctagon", "AlertTriangle", "ArrowLeft", "ArrowRight", "AuthScreen", "Award", "Bell", "CertificateModal", "ChatOverlay", "CheckCircle", "ChevronRight", "Clock", "Code", "CyberCellReportModal", "Database", "DigiLockerStep", "DocTab", "Download", "EarningToast", "FileText", "Fingerprint", "Gift", "Heart", "HeartHandshake", "HomeFeed", "IndianRupee", "KeyRound", "Loader2", "LocationPickerModal", "MapPin", "MessageSquare", "MobileNavButton", "Modal", "ModalHeader", "NavButton", "Navigation", "OnboardServiceModal", "Paperclip", "PaymentModal", "Phone", "PhoneCall", "Plus", "PostAlertModal", "PostOpportunityModal", "PostSurveyModal", "Radio", "RescueModule", "SaathiLogo", "ScanLine", "Send", "Server", "ServiceApprovalQueueModal", "ServicesModule", "ShieldAlert", "ShieldCheck", "Sparkles", "SplashLogoMark", "SplashScreen", "Star", "SurveyApprovalQueueModal", "SurveyModule", "TakeSurveyModal", "User", "Users", "VolunteerModule", "Wallet", "WalletModal", "Wrench", "X"
];

for (const c of components) {
  // check if there's a function declaration, or arrow function, or import
  const defined = content.includes(`function ${c}`) || 
                  content.includes(`const ${c}`) || 
                  content.includes(`let ${c}`) ||
                  content.includes(`var ${c}`) ||
                  content.includes(`${c},`) ||
                  content.includes(` ${c} }`) ||
                  content.includes(`${c} as `);
  if (!defined) {
    console.log(`WARNING: ${c} might not be defined`);
  }
}
