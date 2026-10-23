"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.logo": "DawaLens",
    "nav.home": "Home",
    "nav.howItWorks": "How It Works",
    "nav.safety": "Safety & Data Sources",
    "nav.about": "About Us",
    "nav.faq": "FAQ",
    "nav.signIn": "Sign In",
    "nav.scanMedicine": "Scan a Medicine",
    
    // Hero
    "hero.eyebrow": "AI-Assisted Medication Safety",
    "hero.title1": "Your Medicines.",
    "hero.title2": "Your Safety.",
    "hero.title3": "Your Peace of Mind.",
    "hero.subtitle": "Understand your medicines and check for potential medication risks with AI-assisted identification and evidence-based safety checks.",
    "hero.btnScan": "Scan a Medicine",
    "hero.btnHow": "How It Works",
    "hero.ticker": "Clear information. Evidence-based checks. Better-informed decisions.",
    
    // Trust
    "trust.eyebrow": "Verified Standards",
    "trust.heading": "Medication Safety, Made Easier",
    "trust.p1": "AI-Assisted Identification",
    "trust.p1.desc": "Instant optical recognition of packaging, brand names & active salts.",
    "trust.p2": "Evidence-Based Safety Checks",
    "trust.p2.desc": "Deterministic validation against verified clinical reference databases.",
    "trust.p3": "Transparent Data Sources",
    "trust.p3.desc": "Every rule, conflict, and guidance backed by cited medical references.",
    "trust.p4": "English & Hindi Support",
    "trust.p4.desc": "Bilingual accessibility designed for widespread patient clarity.",

    // Problem
    "problem.eyebrow": "The Challenge",
    "problem.heading": "Taking Multiple Medicines? Know What to Check.",
    "problem.p1": "Managing multiple medicines can be confusing. Similar packaging, difficult-to-read labels and duplicate ingredients can make it harder to understand potential medication risks.",
    "problem.p2": "DawaLens helps you identify your medicines, review their details and understand potential concerns through clear, accessible information.",
    "problem.stat1.val": "40%+",
    "problem.stat1.lbl": "Patients on 3+ concurrent prescriptions",
    "problem.stat2.val": "1 in 5",
    "problem.stat2.lbl": "Experience duplicate active ingredient risks",

    // How It Works
    "how.eyebrow": "Simple Workflow",
    "how.heading": "Three Simple Steps to Better Medication Awareness",
    "how.step1.num": "01",
    "how.step1.title": "Scan Your Medicines",
    "how.step1.desc": "Upload a photo or capture an image of your medicine packaging.",
    "how.step2.num": "02",
    "how.step2.title": "Verify the Details",
    "how.step2.desc": "Review medicine names, active ingredients, strength and dosage form. Correct any errors before continuing.",
    "how.step3.num": "03",
    "how.step3.title": "Understand Potential Risks",
    "how.step3.desc": "Receive a structured report explaining detected concerns, supporting evidence and appropriate next steps.",

    // Features
    "features.eyebrow": "Key Capabilities",
    "features.heading": "Everything You Need to Understand Your Medicines",
    "features.f1.title": "AI-Powered Medicine Identification",
    "features.f1.desc": "Extract medicine details from packaging images and review the information before proceeding.",
    "features.f2.title": "Drug Interaction Checks",
    "features.f2.desc": "Identify potential concerns between selected medicines using reviewed interaction rules.",
    "features.f3.title": "Duplicate Ingredient Detection",
    "features.f3.desc": "Recognize configured duplicate-ingredient risks across different medicine products.",
    "features.f4.title": "Transparent Safety Reports",
    "features.f4.desc": "Understand what was checked, which findings were detected and where the supporting evidence comes from.",
    "features.f5.title": "Simple, Accessible Explanations",
    "features.f5.desc": "Get clear information designed to make complex medicine details easier to understand.",
    "features.f6.title": "English & Hindi Support",
    "features.f6.desc": "Explore medication-safety information in your preferred language.",

    // Safety and Transparency
    "safety.eyebrow": "Safety & Data Sources",
    "safety.heading": "AI Helps Identify. Verified Rules Check.",
    "safety.callout": "Medication safety deserves more than a guess.",
    "safety.desc": "DawaLens combines AI-assisted medicine identification with structured medicine data and deterministic safety checks to provide understandable, evidence-based information.",
    "safety.b1": "Review and confirm medicine details.",
    "safety.b2": "Check supported medication risks.",
    "safety.b3": "Explore sources behind reported findings.",
    "safety.b4": "Understand when information is missing or a check is incomplete.",

    // Safety Results
    "results.eyebrow": "Clinical Outcomes",
    "results.heading": "Clear Results. No False Reassurance.",
    "results.r1.title": "Risk Detected",
    "results.r1.desc": "A potential concern was identified by a configured safety rule. Review the explanation and recommended next steps.",
    "results.r2.title": "No Known Issue Found in Completed Checks",
    "results.r2.desc": "No matching issue was found in the checks performed. This does not guarantee that the medicines are safe.",
    "results.r3.title": "Verification Incomplete",
    "results.r3.desc": "Some medicine details or required checks could not be verified. Retry the check or consult a pharmacist.",

    // Audience
    "audience.eyebrow": "Who Can Use DawaLens?",
    "audience.heading": "Medication Information for Everyone Who Cares",
    "audience.a1.title": "Patients",
    "audience.a1.desc": "Understand your medicines and potential concerns when taking multiple medications.",
    "audience.a2.title": "Family Caregivers",
    "audience.a2.desc": "Help loved ones review medicine information and recognize potential medication-related concerns.",
    "audience.a3.title": "Pharmacists & Healthcare Support Staff",
    "audience.a3.desc": "Access structured medicine information to support professional review and informed discussions.",

    // FAQ
    "faq.eyebrow": "Common Inquiries",
    "faq.heading": "Frequently Asked Questions",
    "faq.q1": "What is DawaLens?",
    "faq.a1": "DawaLens is an AI-assisted medication-safety website that helps identify medicines from packaging and check for supported potential risks.",
    "faq.q2": "How does DawaLens work?",
    "faq.a2": "Upload medicine images, review the extracted details and run a safety check against available reviewed reference data.",
    "faq.q3": "Can DawaLens detect duplicate ingredients?",
    "faq.a3": "It can identify configured duplicate-ingredient concerns among selected medicines when the relevant ingredients are recognized.",
    "faq.q4": "Does DawaLens guarantee medication safety?",
    "faq.a4": "No. Results depend on medicine identification, available reference data and the checks completed.",
    "faq.q5": "Can I use DawaLens in Hindi?",
    "faq.a5": "Yes. DawaLens is designed to offer its core experience in English and Hindi.",
    "faq.q6": "What should I do if a warning appears?",
    "faq.a6": "Discuss the finding with a qualified doctor or pharmacist. Do not change prescribed medication based solely on the website's result.",

    // CTA
    "cta.heading": "Make Every Medicine Check More Informed.",
    "cta.sub": "Understand your medicines. Discover potential concerns. Make informed decisions with clearer medication information.",
    "cta.btn": "Scan a Medicine",
    "cta.note": "Your health matters. Understanding your medicines is a step toward greater awareness.",

    // Footer
    "footer.tagline": "Understand your medicines. Make informed decisions.",
    "footer.disclaimer": "Medical Disclaimer: DawaLens provides informational medication-safety assistance. It does not diagnose conditions, prescribe treatment or replace a qualified doctor or pharmacist. A result with no detected issue does not guarantee safety. Consult a healthcare professional about medication concerns.",
    "footer.rights": "© 2026 DawaLens. All rights reserved.",
    "footer.status": "Deterministic Safety Engine v2.4 Active"
  },
  hi: {
    // Navigation
    "nav.logo": "DawaLens",
    "nav.home": "होम",
    "nav.howItWorks": "यह कैसे काम करता है",
    "nav.safety": "सुरक्षा और डेटा स्रोत",
    "nav.about": "हमारे बारे में",
    "nav.faq": "अक्सर पूछे जाने वाले सवाल",
    "nav.signIn": "साइन इन",
    "nav.scanMedicine": "दवा स्कैन करें",
    
    // Hero
    "hero.eyebrow": "एआई-सहायक दवा सुरक्षा",
    "hero.title1": "आपकी दवाएं।",
    "hero.title2": "आपकी सुरक्षा।",
    "hero.title3": "आपका मानसिक सुकून।",
    "hero.subtitle": "एआई-सहायक पहचान और साक्ष्य-आधारित सुरक्षा जांच के साथ अपनी दवाओं को समझें और संभावित दवा जोखिमों की जांच करें।",
    "hero.btnScan": "दवा स्कैन करें",
    "hero.btnHow": "यह कैसे काम करता है",
    "hero.ticker": "स्पष्ट जानकारी। साक्ष्य-आधारित जांच। बेहतर निर्णय।",

    // Trust
    "trust.eyebrow": "प्रमाणित मानक",
    "trust.heading": "दवा सुरक्षा, अब और भी आसान",
    "trust.p1": "एआई-सहायक पहचान",
    "trust.p1.desc": "पैकेजिंग, ब्रांड नाम और सक्रिय साल्ट की त्वरित ऑप्टिकल पहचान।",
    "trust.p2": "साक्ष्य-आधारित सुरक्षा जांच",
    "trust.p2.desc": "सत्यापित क्लिनिकल संदर्भ डेटाबेस के साथ पुख्ता सत्यापन।",
    "trust.p3": "पारदर्शी डेटा स्रोत",
    "trust.p3.desc": "प्रत्येक नियम, टकराव और मार्गदर्शन उद्धृत चिकित्सा संदर्भों पर आधारित।",
    "trust.p4": "अंग्रेजी और हिंदी समर्थन",
    "trust.p4.desc": "मरीजों की स्पष्ट समझ के लिए व्यापक द्विभाषी पहुंच।",

    // Problem
    "problem.eyebrow": "दवाओं की उलझन",
    "problem.heading": "एक साथ कई दवाएं ले रहे हैं? जानिए क्या जांचना जरूरी है।",
    "problem.p1": "एक साथ कई दवाएं संभालना अक्सर भ्रमित करने वाला हो सकता है। एक जैसी पैकेजिंग, छोटे अक्षरों में छपे लेबल और डुप्लिकेट घटक संभावित दवा जोखिमों को समझना कठिन बना देते हैं।",
    "problem.p2": "दवा लेंस (DawaLens) आपको अपनी दवाओं की पहचान करने, उनके विवरण की समीक्षा करने और स्पष्ट जानकारी के माध्यम से संभावित चिंताओं को समझने में मदद करता है।",
    "problem.stat1.val": "40%+",
    "problem.stat1.lbl": "मरीज जो एक साथ 3 या अधिक दवाएं ले रहे हैं",
    "problem.stat2.val": "1 में से 5",
    "problem.stat2.lbl": "अनजाने में डुप्लिकेट सक्रिय साल्ट के जोखिम में हैं",

    // How It Works
    "how.eyebrow": "सरल तीन चरण",
    "how.heading": "बेहतर दवा जागरूकता के तीन आसान कदम",
    "how.step1.num": "01",
    "how.step1.title": "अपनी दवाएं स्कैन करें",
    "how.step1.desc": "अपनी दवा की पैकेजिंग की फोटो अपलोड करें या कैप्चर करें।",
    "how.step2.num": "02",
    "how.step2.title": "विवरण सत्यापित करें",
    "how.step2.desc": "दवा के नाम, सक्रिय सामग्री, क्षमता और खुराक के प्रकार की समीक्षा करें। आगे बढ़ने से पहले किसी भी त्रुटि को सुधारें।",
    "how.step3.num": "03",
    "how.step3.title": "संभावित जोखिमों को समझें",
    "how.step3.desc": "पाए गए जोखिमों, साक्ष्य और उचित अगले कदमों की व्याख्या करने वाली संरचित रिपोर्ट प्राप्त करें।",

    // Features
    "features.eyebrow": "मुख्य विशेषताएं",
    "features.heading": "अपनी दवाओं को समझने के लिए हर आवश्यक साधन",
    "features.f1.title": "एआई-संचालित दवा पहचान",
    "features.f1.desc": "पैकेजिंग छवियों से दवा का विवरण निकालें और आगे बढ़ने से पहले जानकारी की समीक्षा करें।",
    "features.f2.title": "दवा परस्पर क्रिया (इंटरैक्शन) जांच",
    "features.f2.desc": "समीक्षित इंटरैक्शन नियमों का उपयोग करके चयनित दवाओं के बीच संभावित चिंताओं की पहचान करें।",
    "features.f3.title": "डुप्लिकेट घटक (सामग्री) पहचान",
    "features.f3.desc": "विभिन्न दवा उत्पादों में सक्रिय तत्वों के दोहराव के जोखिम को पहचानें।",
    "features.f4.title": "पारदर्शी सुरक्षा रिपोर्ट",
    "features.f4.desc": "समझें कि क्या जांचा गया, कौन से निष्कर्ष मिले और सहायक साक्ष्य कहां से आते हैं।",
    "features.f5.title": "सरल और सुलभ विवरण",
    "features.f5.desc": "जटिल चिकित्सा विवरणों को समझने में आसान बनाने के लिए तैयार की गई स्पष्ट जानकारी प्राप्त करें।",
    "features.f6.title": "अंग्रेजी और हिंदी समर्थन",
    "features.f6.desc": "अपनी पसंदीदा भाषा में दवा सुरक्षा जानकारी प्राप्त करें।",

    // Safety and Transparency
    "safety.eyebrow": "सुरक्षा और डेटा स्रोत",
    "safety.heading": "एआई पहचान में मदद करता है। सत्यापित नियम जांचते हैं।",
    "safety.callout": "दवा सुरक्षा केवल एक अनुमान से कहीं अधिक की हकदार है।",
    "safety.desc": "दवा लेंस समझने योग्य, साक्ष्य-आधारित जानकारी प्रदान करने के लिए संरचित दवा डेटा और पुख्ता सुरक्षा नियमों के साथ एआई-सहायक दवा पहचान को जोड़ता है।",
    "safety.b1": "दवा विवरण की समीक्षा और पुष्टि करें।",
    "safety.b2": "समर्थित दवा जोखिमों की जांच करें।",
    "safety.b3": "रिपोर्ट किए गए निष्कर्षों के स्रोतों को जानें।",
    "safety.b4": "समझें कि कब जानकारी गायब है या जांच अधूरी है।",

    // Safety Results
    "results.eyebrow": "स्पष्ट परिणाम",
    "results.heading": "स्पष्ट परिणाम। कोई झूठा आश्वासन नहीं।",
    "results.r1.title": "जोखिम पाया गया",
    "results.r1.desc": "एक निर्धारित सुरक्षा नियम द्वारा संभावित चिंता की पहचान की गई। व्याख्या और अनुशंसित अगले कदमों की समीक्षा करें।",
    "results.r2.title": "पूर्ण जांच में कोई ज्ञात समस्या नहीं मिली",
    "results.r2.desc": "की गई जांच में कोई मेल खाती समस्या नहीं मिली। यह गारंटी नहीं देता कि दवाएं पूर्णतः सुरक्षित हैं।",
    "results.r3.title": "सत्यापन अधूरा",
    "results.r3.desc": "दवा के कुछ विवरण या आवश्यक जांच सत्यापित नहीं की जा सकीं। पुनः प्रयास करें या फार्मासिस्ट से परामर्श लें।",

    // Audience
    "audience.eyebrow": "दवा लेंस किसके लिए है?",
    "audience.heading": "हर उस व्यक्ति के लिए दवा जानकारी जो परवाह करता है",
    "audience.a1.title": "मरीज (Patients)",
    "audience.a1.desc": "अपनी दवाओं और एक साथ कई दवाएं लेते समय होने वाली संभावित चिंताओं को समझें।",
    "audience.a2.title": "परिवार के देखभालकर्ता (Caregivers)",
    "audience.a2.desc": "अपने प्रियजनों की दवाओं के विवरण की समीक्षा करने और दवा संबंधी संभावित जोखिमों को पहचानने में मदद करें।",
    "audience.a3.title": "फार्मासिस्ट और स्वास्थ्य सेवा कर्मी",
    "audience.a3.desc": "पेशेवर समीक्षा और सूचित चर्चाओं का समर्थन करने के लिए संरचित दवा जानकारी प्राप्त करें।",

    // FAQ
    "faq.eyebrow": "अक्सर पूछे जाने वाले सवाल",
    "faq.heading": "अक्सर पूछे जाने वाले सवाल (FAQ)",
    "faq.q1": "दवा लेंस (DawaLens) क्या है?",
    "faq.a1": "दवा लेंस एक एआई-सहायक दवा-सुरक्षा वेबसाइट है जो पैकेजिंग से दवाओं की पहचान करने और समर्थित संभावित जोखिमों की जांच करने में मदद करती है।",
    "faq.q2": "दवा लेंस कैसे काम करता है?",
    "faq.a2": "दवा की तस्वीरें अपलोड करें, प्राप्त विवरण की समीक्षा करें और उपलब्ध समीक्षित संदर्भ डेटा के विरुद्ध सुरक्षा जांच चलाएं।",
    "faq.q3": "क्या दवा लेंस डुप्लिकेट सामग्री का पता लगा सकता है?",
    "faq.a3": "हां, यह संबंधित सक्रिय साल्ट पहचाने जाने पर चयनित दवाओं में डुप्लिकेट सामग्री के जोखिम की पहचान कर सकता है।",
    "faq.q4": "क्या दवा लेंस दवा सुरक्षा की गारंटी देता है?",
    "faq.a4": "नहीं। परिणाम दवा की पहचान, उपलब्ध संदर्भ डेटा और पूरी की गई जांचों पर निर्भर करते हैं।",
    "faq.q5": "क्या मैं दवा लेंस को हिंदी में उपयोग कर सकता हूँ?",
    "faq.a5": "हां। दवा लेंस को अंग्रेजी और हिंदी दोनों में अपना मूल अनुभव प्रदान करने के लिए डिज़ाइन किया गया है।",
    "faq.q6": "यदि कोई चेतावनी दिखाई दे तो मुझे क्या करना चाहिए?",
    "faq.a6": "किसी योग्य डॉक्टर या फार्मासिस्ट से निष्कर्ष पर चर्चा करें। केवल वेबसाइट के परिणाम के आधार पर निर्धारित दवा में बदलाव न करें।",

    // CTA
    "cta.heading": "हर दवा जांच को अधिक जागरूक बनाएं।",
    "cta.sub": "अपनी दवाओं को समझें। संभावित चिंताओं को पहचानें। स्पष्ट दवा जानकारी के साथ बेहतर निर्णय लें।",
    "cta.btn": "दवा स्कैन करें",
    "cta.note": "आपका स्वास्थ्य महत्वपूर्ण है। अपनी दवाओं को समझना बेहतर जागरूकता की दिशा में एक कदम है।",

    // Footer
    "footer.tagline": "अपनी दवाओं को समझें। सूचित निर्णय लें।",
    "footer.disclaimer": "चिकित्सा अस्वीकरण: दवा लेंस (DawaLens) सूचनात्मक दवा-सुरक्षा सहायता प्रदान करता है। यह किसी बीमारी का निदान नहीं करता, उपचार नहीं लिखता या किसी योग्य डॉक्टर या फार्मासिस्ट का स्थान नहीं लेता है। किसी समस्या का न मिलना सुरक्षा की गारंटी नहीं है। दवाओं से संबंधित चिंताओं के लिए हमेशा स्वास्थ्य विशेषज्ञ से परामर्श लें।",
    "footer.rights": "© 2026 DawaLens. सर्वाधिकार सुरक्षित।",
    "footer.status": "निश्चयात्मक सुरक्षा इंजन v2.4 सक्रिय"
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
