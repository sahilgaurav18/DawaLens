"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

interface GuideTopic {
  id: string;
  category: "basics" | "packaging" | "interactions" | "safety_checks";
  title: string;
  titleHi: string;
  summary: string;
  summaryHi: string;
  content: string[];
  contentHi: string[];
  clinicalTip?: string;
}

const GUIDE_TOPICS: GuideTopic[] = [
  {
    id: "active-ingredients",
    category: "basics",
    title: "1. Understanding Active Ingredients (Salts) vs. Brand Names",
    titleHi: "1. सक्रिय घटक (सॉल्ट) बनाम ब्रांड नाम को समझना",
    summary:
      "A brand name is chosen by a pharmaceutical manufacturer for marketing. The active ingredient (salt) is the chemical molecule responsible for the therapeutic effect.",
    summaryHi:
      "ब्रांड नाम कंपनी द्वारा मार्केटिंग के लिए रखा जाता है। सक्रिय घटक (सॉल्ट) वह वास्तविक दवा अणु है जो बीमारी का इलाज करता है।",
    content: [
      "Every pharmaceutical preparation has two key identities: the trade name (brand name, e.g. Crocin, Calpol, Dolo) and the official chemical entity (International Nonproprietary Name / IP name, e.g. Paracetamol).",
      "Two medicines in completely different boxes and colours may contain the exact same active salt. If taken together, you risk an accidental toxic double dose.",
      "Always check the smaller generic subtitle printed directly beneath the large brand title on the blister strip or bottle label.",
    ],
    contentHi: [
      "प्रत्येक दवा के दो नाम होते हैं: व्यापारिक नाम (ब्रांड नाम, जैसे क्रोसिन, कैलपोल, डोलो) और रासायनिक नाम (जैसे पैरासिटामोल)।",
      "अलग-अलग रंगों और पैकेटों वाली दो दवाइयों में एक ही सक्रिय घटक हो सकता है। दोनों को एक साथ लेने से ओवरडोज का गंभीर खतरा होता है।",
      "हमेशा स्ट्रिप पर बड़े ब्रांड नाम के नीचे छोटे अक्षरों में लिखे सॉल्ट नाम की जांच करें।",
    ],
    clinicalTip:
      "Rule of thumb: Never assume two differently named medicines treat separate issues without verifying their chemical salt formulation.",
  },
  {
    id: "strength-and-form",
    category: "basics",
    title: "2. Understanding Strength and Dosage Form",
    titleHi: "2. दवा की क्षमता (Strength) और खुराक का रूप (Dosage Form)",
    summary:
      "Strength denotes the exact mass (mg, mcg, IU) of the chemical active ingredient per unit. Dosage form dictates the physiological route and absorption rate.",
    summaryHi:
      "दवा की स्ट्रेंथ (mg, mcg) सक्रिय घटक की मात्रा बताती है। खुराक का रूप यह तय करता है कि दवा शरीर में कैसे और कितनी तेजी से अवशोषित होगी।",
    content: [
      "Milligrams (mg) vs Micrograms (mcg): 1 mg is equal to 1,000 mcg. Mixing up units in pediatric or thyroid preparations can lead to tenfold dosing errors.",
      "Dosage forms include Tablets, Capsules, Oral Suspensions, Syrups, Inhalers, and Ointments.",
      "Sustained-Release (SR/ER/CR) tablets must never be crushed or chewed, as doing so releases the entire 24-hour therapeutic dose at once (dose dumping).",
    ],
    contentHi: [
      "मिलीग्राम (mg) बनाम माइक्रोग्राम (mcg): 1 mg में 1,000 mcg होते हैं। बच्चों या थायरॉयड की दवाओं में यूनिट की गलती से खुराक 10 गुना बदल सकती है।",
      "दवा के रूप: टैबलेट, कैप्सूल, सिरप, इनहेलर और मलहम।",
      "सस्टेन्ड-रिलीज़ (SR / ER) टैबलेट को कभी तोड़कर या चबाकर नहीं खाना चाहिए, क्योंकि इससे 24 घंटे की पूरी दवा एक साथ शरीर में घुल जाती है।",
    ],
    clinicalTip:
      "Always consult a pharmacist before splitting or crushing any tablet that is not explicitly scored with a central dividing line.",
  },
  {
    id: "duplicate-ingredients",
    category: "interactions",
    title: "3. Duplicate Ingredients Across Different Brands",
    titleHi: "3. अलग-अलग ब्रांडों में डुप्लिकेट सामग्री (समान सॉल्ट)",
    summary:
      "Duplicate ingredient toxicity is the most prevalent unintentional medication error among patients managing episodic pain, cough, and chronic conditions.",
    summaryHi:
      "बिना जाने एक ही सॉल्ट वाली दो अलग-अलग ब्रांड की दवाएं खा लेना सबसे आम और खतरनाक गलती है।",
    content: [
      "Common scenario: A patient takes 'Crocin 650' for a fever, and also takes 'Combiflam' for back pain, unaware that Combiflam already contains 325mg of Paracetamol alongside Ibuprofen.",
      "Cumulative intake: The adult safe liver threshold for Paracetamol is 4,000mg per 24 hours (or 1,000mg per single dose). Exceeding this causes hepatocellular necrosis and liver injury.",
      "Cold & flu combination syrups often bundle Paracetamol, Phenylephrine, and Chlorpheniramine, creating hidden overlaps with everyday headache pills.",
    ],
    contentHi: [
      "उदाहरण: बुखार के लिए 'क्रोसिन 650' लेना और कमर दर्द के लिए 'कॉम्बीफ्लेम' लेना। कॉम्बीफ्लेम में पहले से ही 325mg पैरासिटामोल मौजूद होता है।",
      "सुरक्षित सीमा: 24 घंटे में पैरासिटामोल की अधिकतम सुरक्षित मात्रा 4,000mg है। इससे अधिक मात्रा लिवर को गंभीर नुकसान पहुंचा सकती है।",
      "खांसी और जुकाम के सिरप में अक्सर पहले से ही दर्द निवारक दवाएं मिली होती हैं।",
    ],
    clinicalTip:
      "DawaLens automatically calculates the combined milligrams across all added medicines and flags cumulative threshold violations.",
  },
  {
    id: "drug-interactions",
    category: "interactions",
    title: "4. What Drug-Drug Interactions (DDI) Mean",
    titleHi: "4. ड्रग-ड्रग इंटरेक्शन का क्या अर्थ है?",
    summary:
      "A drug interaction happens when one substance alters the pharmacological action, absorption, metabolism, or excretion of another concurrent medication.",
    summaryHi:
      "जब एक दवा दूसरी दवा के असर, अवशोषण या बाहर निकलने की प्रक्रिया में रुकावट डालती है, तो उसे ड्रग इंटरेक्शन कहते हैं।",
    content: [
      "Pharmacodynamic interactions: When two medicines amplify each other's adverse effects (e.g., combining Aspirin and Ibuprofen significantly elevates the risk of severe gastrointestinal bleeding and stomach ulcers).",
      "Pharmacokinetic interactions: When one drug blocks liver enzymes (Cytochrome P450) needed to break down another drug, causing dangerous blood concentration spikes.",
      "Absorption barriers: Taking certain antacids or iron supplements at the same time as thyroid hormone or antibiotics can bind the medication in the gut, rendering it ineffective.",
    ],
    contentHi: [
      "हानिकारक प्रभाव बढ़ना: उदाहरण के लिए, एस्पिरिन और इबुप्रोफेन को एक साथ लेने से पेट में अल्सर और ब्लीडिंग का खतरा बहुत बढ़ जाता है।",
      "लिवर में एंजाइम ब्लॉक होना: कुछ दवाएं दूसरी दवाओं को शरीर से बाहर निकलने नहीं देतीं, जिससे उनका स्तर खतरनाक रूप से बढ़ जाता है।",
      "एंटासिड (गैस की दवा) या आयरन की गोलियां कुछ एंटीबायोटिक्स के असर को पेट में ही खत्म कर देती हैं।",
    ],
    clinicalTip:
      "Interactions are not always fatal, but many require spacing the doses hours apart or dose adjustments under a physician's oversight.",
  },
  {
    id: "reading-packaging",
    category: "packaging",
    title: "5. How to Read Medicine Packaging & Blisters",
    titleHi: "5. दवा के पत्ते (Blister Pack) को सही तरीके से कैसे पढ़ें",
    summary:
      "Medicine strips in India and globally follow statutory labeling standards containing composition, batch, expiry, and storage requirements.",
    summaryHi:
      "दवा के पत्तों पर रासायनिक संरचना, बैच नंबर, एक्सपायरी डेट और लाल पट्टी (रेड लाइन) जैसी जरूरी चेतावनियां छपी होती हैं।",
    content: [
      "The Red Vertical Line (Schedule H / H1): Indicates that the medication is a potent prescription drug. It must never be purchased or consumed over-the-counter without a registered doctor's prescription.",
      "Composition Block: Look for 'Each uncoated/film-coated tablet contains:'. This states the exact amount of each active substance.",
      "Expiry Date (EXP): Do not consume medication past the last day of the stated month (e.g. 'EXP 11/2026' expires on Nov 30, 2026). Chemical degradation can reduce potency or form toxic byproducts.",
      "Storage Instructions: 'Store below 25°C, protect from moisture and direct light' is critical in tropical climates to avoid decomposition.",
    ],
    contentHi: [
      "लाल लकीर (रेड लाइन / शेड्यूल H): इसका मतलब है कि यह दवा केवल डॉक्टर के पर्चे पर ही ली जा सकती है, बिना पर्चे के नहीं।",
      "कंपोज़िशन ब्लॉक: 'Each film-coated tablet contains' के आगे लिखी सूची को ध्यान से पढ़ें।",
      "एक्सपायरी डेट: महीने की अंतिम तारीख के बाद दवा का सेवन कभी न करें।",
      "भंडारण: 25°C से कम तापमान और नमी से दूर रखना दवा को खराब होने से बचाता है।",
    ],
    clinicalTip:
      "When scanning with DawaLens, make sure the camera focuses directly on the composition text box and the brand title under good illumination.",
  },
  {
    id: "how-identification-works",
    category: "safety_checks",
    title: "6. How Medicine Identification & AI Verification Works",
    titleHi: "6. दवा पहचान और AI सत्यापन कैसे काम करता है",
    summary:
      "DawaLens combines optical character recognition (OCR) with CDSCO and WHO pharmaceutical knowledge bases, keeping the patient in the loop.",
    summaryHi:
      "दवालेंस इमेज रिकॉग्निशन और आधिकारिक डेटाबेस के जरिए दवा को पढ़ता है, फिर मरीज से विवरण की पुष्टि करवाता है।",
    content: [
      "Step 1 - Label OCR: The image is scanned for high-salience text: brand name, generic title, strength figures, and dosage forms.",
      "Step 2 - Verification Gate (Human in the Loop): The AI proposes candidate details with an OCR confidence rating. It will NEVER assume uncertain data is safe. The user must confirm or correct the details.",
      "Step 3 - Rule Engine Evaluation: Only verified chemical ingredients are checked against our peer-reviewed interaction rule matrices.",
      "Step 4 - Structured Reporting: Clear findings with clinical mechanisms and direct references to official national formularies.",
    ],
    contentHi: [
      "चरण 1 - लेबल पढ़ना: पैकेजिंग से ब्रांड, स्ट्रेंथ और सॉल्ट के अक्षरों को पहचाना जाता है।",
      "चरण 2 - मानवीय सत्यापन: सिस्टम कभी भी अधूरी जानकारी को सही नहीं मानता। यूजर को पैकेज से मिलान करके पुष्टि करनी होती है।",
      "चरण 3 - क्लिनिकल नियम मिलान: केवल सत्यापित सॉल्ट की आधिकारिक डेटाबेस से तुलना की जाती है।",
      "चरण 4 - संरचित रिपोर्ट: वैज्ञानिक संदर्भों के साथ स्पष्ट सुरक्षा परिणाम तैयार होते हैं।",
    ],
    clinicalTip:
      "If packaging is torn, faded, or smudged, do not rely solely on automated OCR. Type the exact chemical name into the verification editor.",
  },
  {
    id: "interpreting-risks",
    category: "safety_checks",
    title: "7. How to Interpret Risk Classifications & Incomplete Checks",
    titleHi: "7. जोखिम वर्गीकरण और अधूरी जांच (Incomplete Check) का मतलब",
    summary:
      "DawaLens uses clear, unexaggerated clinical categories so you know exactly what level of concern exists and what steps to take.",
    summaryHi:
      "दवालेंस आपको स्पष्ट भाषा में बताता है कि चिंता का स्तर क्या है और आपको क्या कदम उठाना चाहिए।",
    content: [
      "High Severity (Potential Risk): Documented contraindication, toxic cumulative dose, or serious adverse event danger. Action: Stop concurrent use and contact a doctor or pharmacist immediately.",
      "Moderate Severity: Pharmacokinetic interaction that may diminish efficacy or increase side-effects. Spacing or monitoring usually recommended.",
      "Advisory: Cautionary notes, such as taking with food or avoiding grapefruit juice.",
      "No Known Issue Found: Means no adverse interaction was found in the specific checks that were completed. It does NOT guarantee that the medicines are completely free of all possible risks.",
      "Verification Incomplete: Indicates essential chemical details or clinical parameters (like renal clearance) were unavailable. Action: Consult your healthcare provider.",
    ],
    contentHi: [
      "उच्च जोखिम (High Severity): गंभीर नुकसान या ओवरडोज का खतरा। तुरंत डॉक्टर या फार्मासिस्ट से संपर्क करें।",
      "मध्यम जोखिम (Moderate Severity): दवा का असर कम होने या साइड इफेक्ट बढ़ने का अंदेशा।",
      "कोई ज्ञात समस्या नहीं (No Known Issue): इसका अर्थ केवल इतना है कि पूरी की गई जांचों में कोई समस्या नहीं मिली। यह 100% सुरक्षा की गारंटी नहीं है।",
      "अधूरी जांच (Incomplete): कोई जरूरी जानकारी गायब थी। डॉक्टर से सलाह लें।",
    ],
    clinicalTip:
      "Never alter prescribed chronic therapy (such as cardiac, hypertension, or diabetes medications) without explicit instruction from your prescribing physician.",
  },
  {
    id: "when-to-contact-doctor",
    category: "basics",
    title: "8. When to Immediately Contact a Pharmacist or Doctor",
    titleHi: "8. डॉक्टर या फार्मासिस्ट से तत्काल कब संपर्क करें",
    summary:
      "Certain warning signs require immediate clinical intervention rather than waiting for an online check.",
    summaryHi:
      "कुछ चेतावनी संकेतों पर बिना देर किए तुरंत अस्पताल या डॉक्टर से मिलना जरूरी होता है।",
    content: [
      "Sudden allergic symptoms: Swelling of the lips, tongue, or throat, hives, or breathing difficulty (anaphylaxis - emergency care required).",
      "Unexplained nausea, yellowing of eyes/skin (jaundice), or severe abdominal pain after taking analgesic combinations (potential liver strain).",
      "Black, tarry stools or vomiting blood after combining pain medications with blood thinners or steroids.",
      "Severe dizziness or fainting after taking new cardiovascular or blood pressure tablets.",
      "Whenever you are prescribed a new medication while already taking 3 or more ongoing regular drugs.",
    ],
    contentHi: [
      "एलर्जी के लक्षण: होंठों या गले में सूजन, सांस लेने में तकलीफ या तेज चकत्ते (तुरंत आपातकालीन चिकित्सा लें)।",
      "आंखों या त्वचा का पीला पड़ना (पीलिया), तेज पेट दर्द या उल्टी।",
      "दर्द निवारक और खून पतला करने वाली दवा साथ लेने के बाद काला मल या खून की उल्टी।",
      "नई दवा लेने के बाद चक्कर आना या बेहोश होना।",
    ],
    clinicalTip:
      "Pharmacists are accessible medication experts in your neighbourhood. Show them your exact blister strips whenever in doubt.",
  },
];

const FAQS = [
  {
    q: "Does DawaLens replace my prescribing doctor or clinical pharmacist?",
    qHi: "क्या दवालेंस मेरे डॉक्टर या फार्मासिस्ट की जगह ले सकता है?",
    a: "No. DawaLens is an informational safety assistance tool. It evaluates visible packaging data against approved CDSCO and WHO interaction matrices to help patients identify common overlaps and contraindications. It does not provide medical diagnoses or modify prescriptions.",
    aHi: "नहीं। दवालेंस केवल सूचनात्मक सुरक्षा उपकरण है। यह आपकी दवाओं के पैकेट को पढ़कर सामान्य गलतियों को पहचानने में मदद करता है। यह डॉक्टर के इलाज या सलाह का विकल्प नहीं है।",
  },
  {
    q: "Why does the tool show 'No Known Issue' instead of '100% Safe'?",
    qHi: "यह 'पूरी तरह सुरक्षित' की जगह 'कोई ज्ञात समस्या नहीं' क्यों दिखाता है?",
    a: "In clinical pharmacovigilance, no combination of pharmaceutical agents can be declared unconditionally safe for every individual biology. Factors like individual kidney function, liver enzymes, genetics, and rare drug allergies cannot be assessed from packaging alone.",
    aHi: "क्लिनिकल विज्ञान में किसी भी दवा के संयोजन को हर व्यक्ति के लिए 100% सुरक्षित नहीं कहा जा सकता। व्यक्तिगत स्वास्थ्य, एलर्जी और किडनी/लिवर की स्थिति पैकेट से नहीं जानी जा सकती।",
  },
  {
    q: "What should I do if a blister strip is damaged and DawaLens cannot read the text?",
    qHi: "यदि दवा का पत्ता फटा हुआ है और सिस्टम उसे नहीं पढ़ पा रहा तो क्या करें?",
    a: "Do not attempt to guess or proceed with unverified data. You can switch to manual entry and type the exact chemical salt printed on the intact portion, or take the physical strip to a registered pharmacist for in-person identification.",
    aHi: "अंदाजा न लगाएं। आप मैन्युअल रूप से सॉल्ट का नाम लिख सकते हैं, या सीधे किसी नजदीकी फार्मासिस्ट को दिखाकर सही नाम पता कर सकते हैं।",
  },
  {
    q: "Are my scanned medication images stored on public servers?",
    qHi: "क्या मेरे द्वारा अपलोड की गई तस्वीरें किसी पब्लिक सर्वर पर सेव होती हैं?",
    a: "No. DawaLens processes packaging images client-side for character recognition and does not retain permanent image copies on external servers. You maintain full privacy over all your medication records.",
    aHi: "नहीं। आपकी तस्वीरें केवल टेक्स्ट पढ़ने के लिए अस्थायी रूप से प्रोसेस होती हैं। आपकी दवाओं का विवरण पूरी तरह से सुरक्षित और गोपनीय रहता है।",
  },
];

export default function MedicineSafetyGuidePage() {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "basics" | "packaging" | "interactions" | "safety_checks"
  >("all");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const filteredTopics = GUIDE_TOPICS.filter((t) =>
    selectedCategory === "all" ? true : t.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header and Clinical Context Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {language === "hi" ? "दवा सुरक्षा मार्गदर्शिका (Medicine Safety Guide)" : "Medicine Safety Guide"}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {language === "hi"
              ? "सक्रिय घटक, डुप्लिकेट सॉल्ट और ड्रग इंटरेक्शन को समझने के लिए क्लिनिकल और व्यावहारिक गाइड। यह सामग्री रोगी शिक्षा के लिए है और चिकित्सा निदान नहीं करती।"
              : "Educational pharmacology guide on active salts, cumulative dosing, blister labeling, and interaction mechanisms. For patient literacy."}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/scan"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded border border-slate-900 transition-colors"
          >
            {language === "hi" ? "दवा सुरक्षा जांचें" : "Run Safety Check"}
          </Link>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 border border-slate-200 rounded text-xs font-medium">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1.5 rounded transition-colors ${
            selectedCategory === "all"
              ? "bg-slate-900 text-white font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {language === "hi" ? "सभी विषय (All Topics)" : "All Topics (8)"}
        </button>
        <button
          onClick={() => setSelectedCategory("basics")}
          className={`px-3 py-1.5 rounded transition-colors ${
            selectedCategory === "basics"
              ? "bg-sky-700 text-white font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {language === "hi" ? "सॉल्ट और खुराक मूल बातें" : "Salts & Dosage Basics"}
        </button>
        <button
          onClick={() => setSelectedCategory("packaging")}
          className={`px-3 py-1.5 rounded transition-colors ${
            selectedCategory === "packaging"
              ? "bg-sky-700 text-white font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {language === "hi" ? "पैकेजिंग और लाल पट्टी" : "Reading Packaging"}
        </button>
        <button
          onClick={() => setSelectedCategory("interactions")}
          className={`px-3 py-1.5 rounded transition-colors ${
            selectedCategory === "interactions"
              ? "bg-sky-700 text-white font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {language === "hi" ? "ड्रग इंटरेक्शन और ओवरडोज" : "Drug Interactions"}
        </button>
        <button
          onClick={() => setSelectedCategory("safety_checks")}
          className={`px-3 py-1.5 rounded transition-colors ${
            selectedCategory === "safety_checks"
              ? "bg-sky-700 text-white font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {language === "hi" ? "सत्यापन और परिणाम" : "Verification & Results"}
        </button>
      </div>

      {/* Topics Grid */}
      <div className="space-y-4">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="bg-white border border-slate-200 rounded-md p-5 shadow-sm space-y-3"
          >
            <div className="border-b border-slate-100 pb-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-sky-700 font-bold block mb-1">
                Category: {topic.category.replace("_", " ")}
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {language === "hi" ? topic.titleHi : topic.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {language === "hi" ? topic.summaryHi : topic.summary}
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              {(language === "hi" ? topic.contentHi : topic.content).map((paragraph, pIdx) => (
                <div key={pIdx} className="flex items-start gap-2">
                  <span className="text-slate-400 font-mono mt-0.5">•</span>
                  <span>{paragraph}</span>
                </div>
              ))}
            </div>

            {topic.clinicalTip && (
              <div className="p-3 bg-sky-50 border border-sky-200 rounded text-xs text-sky-900 flex items-start gap-2">
                <span className="font-mono font-bold uppercase text-[10px] bg-sky-200 text-sky-800 px-1.5 py-0.5 rounded shrink-0">
                  Clinical Insight
                </span>
                <span>{topic.clinicalTip}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Frequently Asked Questions Section (Requirement 9 & 12) */}
      <div className="bg-white border border-slate-200 rounded-md p-6 space-y-4">
        <div className="border-b border-slate-200 pb-3">
          <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold">
            Patient Questions & Answers
          </span>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            {language === "hi"
              ? "अक्सर पूछे जाने वाले सुरक्षा प्रश्न (FAQs)"
              : "Frequently Asked Questions"}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {language === "hi"
              ? "दवालेंस की कार्यप्रणाली और दवा सुरक्षा संबंधी आम जिज्ञासाओं के स्पष्ट उत्तर।"
              : "Clear answers to essential questions regarding automated checks, medical disclaimers, and data protection."}
          </p>
        </div>

        <div className="divide-y divide-slate-200">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="py-3.5">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-900 hover:text-sky-700"
                >
                  <span>{language === "hi" ? faq.qHi : faq.q}</span>
                  <span className="font-mono text-slate-400 ml-3">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed pr-6 bg-slate-50 p-3 rounded border border-slate-200">
                    {language === "hi" ? faq.aHi : faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
