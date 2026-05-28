const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The original Malayalam dictionary end block we want to target
const targetText = `    volunteerRegister: "ഒരു സാഥി വോളണ്ടിയർ ആകുക",
    volunteerRegisterSub: "പ്രാദേശിക SOS അലേർട്ടുകളോട് പ്രതികരിച്ചും പ്രാദേശിക സ്റ്റോറുകൾ ചേർത്തും നിങ്ങളുടെ കമ്മ്യൂണിറ്റിയെ സഹായിക്കുക.",
    registerBtn: "വോളണ്ടിയർ ആയി രജിസ്റ്റർ ചെയ്യുക",
  },`;

const replacementText = `    volunteerRegister: "ഒരു സാഥി വോളണ്ടിയർ ആകുക",
    volunteerRegisterSub: "പ്രാദേശിക SOS അലേർട്ടുകളോട് പ്രതികരിച്ചും പ്രാദേശിക സ്റ്റോറുകൾ ചേർത്തും നിങ്ങളുടെ കമ്മ്യൂണിറ്റിയെ സഹായിക്കുക.",
    registerBtn: "വോളണ്ടിയർ ആയി രജിസ്റ്റർ ചെയ്യുക",
    postAlertTitle: "ഹൈപ്പർലോക്കൽ അലേർട്ട് പോസ്റ്റ് ചെയ്യുക",
    postAlertSub: "നിങ്ങളുടെ പ്രാദേശിക കമ്മ്യൂണിറ്റിയുമായി പ്രധാനപ്പെട്ട അപ്‌ഡേറ്റുകൾ നേരിട്ട് പങ്കിടുക",
    alertType: "അലേർട്ട് തരം / വിഭാഗം",
    severity: "തീവ്രത",
    postAs: "ഇതായി പോസ്റ്റ് ചെയ്യുക",
    title: "തലക്കെട്ട്",
    description: "വിവരണം",
    locationDetails: "സ്ഥല വിവരങ്ങൾ",
    contactName: "ബന്ധപ്പെടേണ്ട വ്യക്തി",
    contactPhone: "ബന്ധപ്പെടേണ്ട ഫോൺ",
    notes: "നിർദ്ദേശങ്ങൾ / കുറിപ്പുകൾ (ഓപ്ഷണൽ)",
    low: "കുറഞ്ഞത്",
    medium: "മിതമായത്",
    high: "കൂടിയത്",
    publishAlert: "ഹൈപ്പർലോക്കൽ അലേർട്ട് പ്രസിദ്ധീകരിക്കുക",
  },`;

if (content.includes(targetText)) {
  content = content.replace(targetText, replacementText);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated Malayalam translations!');
} else {
  console.error('Target text not found in App.jsx!');
}
