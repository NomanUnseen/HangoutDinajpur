import kantajiImg from '../assets/images/kantaji_temple_dinajpur_1791465433019.jpg';
import ramsagarImg from '../assets/images/ramsagar_lake_dinajpur_1791465448567.jpg';
import rajbariImg from '../assets/images/dinajpur_rajbari_palace_1791465460012.jpg';

export type Language = 'bn' | 'en';

export interface Upazila {
  id: string;
  nameBn: string;
  nameEn: string;
  points: string;
  textX: number;
  textY: number;
  subY: number;
  markY: number;
}

export interface TouristSpot {
  id: string;
  nameBn: string;
  nameEn: string;
  upazilaId: string;
  upazilaBn: string;
  upazilaEn: string;
  category: 'Historical' | 'Nature' | 'Religious' | 'Resort/Park' | 'Industry';
  categoryBn: string;
  categoryEn: string;
  lat: number;
  lng: number;
  descriptionBn: string;
  descriptionEn: string;
  defaultImage?: string;
}

export interface MapTheme {
  id: string;
  nameBn: string;
  nameEn: string;
  topHalfColor: string;
  bottomHalfColor: string;
  visitedFillStart: string;
  visitedFillEnd: string;
  visitedStroke: string;
  unvisitedFill: string;
  unvisitedStroke: string;
  canvasBg: string;
  textColor: string;
  subTextColor: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  isDark?: boolean;
}

export const KANTAJI_IMAGE = kantajiImg;
export const RAMSAGAR_IMAGE = ramsagarImg;
export const RAJBARI_IMAGE = rajbariImg;

export const MAP_THEMES: MapTheme[] = [
  {
    id: 'emerald',
    nameBn: 'সবুজ বাংলা',
    nameEn: 'Emerald Heritage',
    topHalfColor: '#e8ece9',
    bottomHalfColor: '#136f50',
    visitedFillStart: '#10b981',
    visitedFillEnd: '#047857',
    visitedStroke: '#065f46',
    unvisitedFill: '#e2e8f0',
    unvisitedStroke: '#94a3b8',
    canvasBg: '#f8faf9',
    textColor: '#1e293b',
    subTextColor: '#64748b',
    accentColor: '#059669',
    badgeBg: 'bg-emerald-50 border-emerald-200',
    badgeText: 'text-emerald-800',
  },
  {
    id: 'royal',
    nameBn: 'নীল আকাশ',
    nameEn: 'Royal Indigo',
    topHalfColor: '#1e293b',
    bottomHalfColor: '#3b82f6',
    visitedFillStart: '#3b82f6',
    visitedFillEnd: '#1d4ed8',
    visitedStroke: '#1e40af',
    unvisitedFill: '#e2e8f0',
    unvisitedStroke: '#94a3b8',
    canvasBg: '#f8fafc',
    textColor: '#1e293b',
    subTextColor: '#64748b',
    accentColor: '#2563eb',
    badgeBg: 'bg-blue-50 border-blue-200',
    badgeText: 'text-blue-800',
  },
  {
    id: 'terracotta',
    nameBn: 'কান্তজিউ টেরাকোটা',
    nameEn: 'Kantaji Terracotta',
    topHalfColor: '#f5ebe6',
    bottomHalfColor: '#e05d44',
    visitedFillStart: '#ea580c',
    visitedFillEnd: '#be123c',
    visitedStroke: '#9a3412',
    unvisitedFill: '#f1e9e4',
    unvisitedStroke: '#bcaaa4',
    canvasBg: '#fffaf5',
    textColor: '#292524',
    subTextColor: '#78716c',
    accentColor: '#ea580c',
    badgeBg: 'bg-orange-50 border-orange-200',
    badgeText: 'text-orange-800',
  },
  {
    id: 'azure',
    nameBn: 'রামসাগর নীল',
    nameEn: 'Ramsagar Azure',
    topHalfColor: '#e0f2fe',
    bottomHalfColor: '#0284c7',
    visitedFillStart: '#0ea5e9',
    visitedFillEnd: '#0369a1',
    visitedStroke: '#075985',
    unvisitedFill: '#e2e8f0',
    unvisitedStroke: '#94a3b8',
    canvasBg: '#f0f9ff',
    textColor: '#0f172a',
    subTextColor: '#64748b',
    accentColor: '#0284c7',
    badgeBg: 'bg-sky-50 border-sky-200',
    badgeText: 'text-sky-800',
  },
  {
    id: 'midnight',
    nameBn: 'ডার্ক এডিশন',
    nameEn: 'Midnight Emerald',
    topHalfColor: '#0f172a',
    bottomHalfColor: '#10b981',
    visitedFillStart: '#10b981',
    visitedFillEnd: '#059669',
    visitedStroke: '#34d399',
    unvisitedFill: '#1e293b',
    unvisitedStroke: '#475569',
    canvasBg: '#0f172a',
    textColor: '#f8fafc',
    subTextColor: '#94a3b8',
    accentColor: '#10b981',
    badgeBg: 'bg-slate-800 border-slate-700',
    badgeText: 'text-emerald-400',
    isDark: true,
  },
];

export const UPAZILAS: Upazila[] = [
  {
    id: 'sadar',
    nameBn: 'দিনাজপুর সদর',
    nameEn: 'Dinajpur Sadar',
    points: '170,240 300,235 310,310 270,360 180,330',
    textX: 235,
    textY: 290,
    subY: 305,
    markY: 325,
  },
  {
    id: 'kaharole',
    nameBn: 'কাহারোল',
    nameEn: 'Kaharole',
    points: '185,150 315,150 325,180 300,235 210,240 170,200',
    textX: 245,
    textY: 190,
    subY: 205,
    markY: 225,
  },
  {
    id: 'biral',
    nameBn: 'বিরল',
    nameEn: 'Biral',
    points: '60,200 140,230 170,240 180,330 110,350 45,280',
    textX: 110,
    textY: 280,
    subY: 295,
    markY: 315,
  },
  {
    id: 'nawabganj',
    nameBn: 'নবাবগঞ্জ',
    nameEn: 'Nawabganj',
    points: '395,435 465,400 480,470 410,510 370,470',
    textX: 425,
    textY: 460,
    subY: 475,
    markY: 495,
  },
  {
    id: 'ghoraghat',
    nameBn: 'ঘোড়াঘাট',
    nameEn: 'Ghoraghat',
    points: '340,520 410,510 440,560 380,600 330,580',
    textX: 380,
    textY: 555,
    subY: 570,
    markY: 588,
  },
  {
    id: 'hakimpur',
    nameBn: 'হাকিমপুর',
    nameEn: 'Hakimpur',
    points: '230,490 340,520 330,580 250,585 210,540',
    textX: 280,
    textY: 540,
    subY: 555,
    markY: 572,
  },
  {
    id: 'parbatipur',
    nameBn: 'পার্বতীপুর',
    nameEn: 'Parbatipur',
    points: '405,250 480,260 490,345 425,370 380,340',
    textX: 435,
    textY: 305,
    subY: 320,
    markY: 340,
  },
  {
    id: 'birganj',
    nameBn: 'বীরগঞ্জ',
    nameEn: 'Birganj',
    points: '190,40 310,35 340,110 315,150 200,140 160,80',
    textX: 245,
    textY: 90,
    subY: 105,
    markY: 125,
  },
  {
    id: 'birampur',
    nameBn: 'বিরামপুর',
    nameEn: 'Birampur',
    points: '200,400 260,390 300,430 370,470 340,520 230,490',
    textX: 285,
    textY: 455,
    subY: 470,
    markY: 490,
  },
  {
    id: 'bochaganj',
    nameBn: 'বোচাগঞ্জ',
    nameEn: 'Bochaganj',
    points: '70,110 160,80 185,150 140,230 60,200 50,140',
    textX: 115,
    textY: 155,
    subY: 170,
    markY: 190,
  },
  {
    id: 'khansama',
    nameBn: 'খানসামা',
    nameEn: 'Khansama',
    points: '315,150 340,110 420,120 440,190 355,210 325,180',
    textX: 375,
    textY: 160,
    subY: 175,
    markY: 195,
  },
  {
    id: 'chirirbandar',
    nameBn: 'চিরিরবন্দর',
    nameEn: 'Chirirbandar',
    points: '300,235 355,210 405,250 380,340 310,310',
    textX: 350,
    textY: 275,
    subY: 290,
    markY: 310,
  },
  {
    id: 'fulbari',
    nameBn: 'ফুলবাড়ী',
    nameEn: 'Fulbari',
    points: '270,360 380,340 425,370 395,435 300,430 260,390',
    textX: 340,
    textY: 390,
    subY: 405,
    markY: 420,
  },
];

export const SPOTS: TouristSpot[] = [
  // Kaharole (Featured first for Kantaji Temple prominence, plus all 29 verified spots)
  {
    id: 'kantaji-temple',
    nameBn: 'কান্তজিউ মন্দির (কান্তনগর মন্দির)',
    nameEn: 'Kantaji Temple (Kantanagar Temple)',
    upazilaId: 'kaharole',
    upazilaBn: 'কাহারোল',
    upazilaEn: 'Kaharole',
    category: 'Historical',
    categoryBn: 'ঐতিহাসিক স্থাপত্য',
    categoryEn: 'Historical Architecture',
    lat: 25.79055139404537,
    lng: 88.66712010147214,
    descriptionBn:
      '১৭০৪ সালে মহারাজা প্রাণনাথ কর্তৃক নির্মিত বাংলাদেশের সর্বোৎকৃষ্ট টেরাকোটা শিল্পমণ্ডিত ঐতিহাসিক নবরত্ন মন্দির। এর দেয়ালে রামায়ণ ও মহাভারতের কাহিনী পোড়ামাটির ফলকে নিখুঁতভাবে ফুটিয়ে তোলা হয়েছে।',
    descriptionEn:
      'Built in 1704 by Maharaja Pran Nath, Kantaji Temple is Bangladesh’s finest late-medieval terracotta temple featuring thousands of intricate mythological and floral plaques.',
    defaultImage: KANTAJI_IMAGE,
  },
  {
    id: 'sukh-sagar',
    nameBn: 'সুখ সাগর',
    nameEn: 'Sukh Sagar',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    upazilaEn: 'Dinajpur Sadar',
    category: 'Nature',
    categoryBn: 'প্রকৃতি ও জলাশয়',
    categoryEn: 'Nature & Lake',
    lat: 25.64627623013882,
    lng: 88.65994073399968,
    descriptionBn:
      'দিনাজপুর শহরের সন্নিকটে অবস্থিত এক নয়নাভিরাম ঐতিহাসিক জলাশয় ও দিঘি। শান্ত স্নিগ্ধ পরিবেশ, সবুজ গাছপালা এবং পাখিদের কলকাকলি ভ্রমণপিপাসুদের মুগ্ধ করে।',
    descriptionEn:
      'A picturesque historic water tank near Dinajpur town surrounded by lush greenery, tranquil walking paths, and migratory birds.',
  },
  {
    id: 'dinajpur-rajbari',
    nameBn: 'দিনাজপুর রাজবাড়ি',
    nameEn: 'Dinajpur Rajbari',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    upazilaEn: 'Dinajpur Sadar',
    category: 'Historical',
    categoryBn: 'ঐতিহাসিক প্রাসাদ',
    categoryEn: 'Historical Palace',
    lat: 25.64893759138725,
    lng: 88.66382978701144,
    descriptionBn:
      'উত্তরবঙ্গের রাজকীয় ইতিহাসের জীবন্ত সাক্ষী। কুমার মহল, আয়না মহল, রানী মহল ও প্রাচীন কারুকার্যময় প্রাসাদ চত্বর আপনাকে ফিরিয়ে নিয়ে যাবে শতবর্ষ আগের রাজত্বকালে।',
    descriptionEn:
      'Living witness to northern Bengal’s royal heritage, featuring Kumar Mahal, Aina Mahal, Rani Mahal, and grand courtyards dating back centuries.',
    defaultImage: RAJBARI_IMAGE,
  },
  {
    id: 'ramsagar',
    nameBn: 'রামসাগর জাতীয় উদ্যান',
    nameEn: 'Ramsagar National Park',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    upazilaEn: 'Dinajpur Sadar',
    category: 'Nature',
    categoryBn: 'জাতীয় উদ্যান ও দিঘি',
    categoryEn: 'National Park & Lake',
    lat: 25.55331525144556,
    lng: 88.62367616634857,
    descriptionBn:
      'বাংলাদেশের মানবসৃষ্ট সর্ববৃহৎ ঐতিহাসিক দিঘি ও জাতীয় উদ্যান। রাজা রামনাথ কর্তৃক খননকৃত এই বিশাল জলাশয়ের চারপাশে সবুজ বনানী, মিনি চিড়িয়াখানা এবং পিকনিক স্পট রয়েছে।',
    descriptionEn:
      'The largest man-made historic water reservoir in Bangladesh, excavated under Raja Ram Nath, surrounded by scenic forest trails and picnic spots.',
    defaultImage: RAMSAGAR_IMAGE,
  },
  {
    id: 'nayabad-masjid',
    nameBn: 'নয়াবাদ মসজিদ',
    nameEn: 'Nayabad Masjid',
    upazilaId: 'kaharole',
    upazilaBn: 'কাহারোল',
    upazilaEn: 'Kaharole',
    category: 'Religious',
    categoryBn: 'ঐতিহাসিক মসজিদ',
    categoryEn: 'Historic Mosque',
    lat: 25.78210905918981,
    lng: 88.65895447303386,
    descriptionBn:
      'ঢেপা নদীর তীরে ১৭৯৩ সালে নির্মিত তিন গম্বুজবিশিষ্ট টেরাকোটা অলংকৃত প্রাচীন মসজিদ। কান্তজিউ মন্দিরের নির্মাতা কারিগরদের হাতে গড়া এক অনন্য স্থাপত্য নিদর্শন।',
    descriptionEn:
      'Built in 1793 along the Dhepa River by artisans who worked on Kantaji Temple, this three-domed mosque features exquisite terracotta plaques.',
  },
  {
    id: 'gor-e-shahid',
    nameBn: 'গোর-এ-শহীদ বড় ময়দান (এশিয়ার বৃহত্তম ঈদগাহ)',
    nameEn: 'Gor-e-Shahid Boro Maidan (Grand Eidgah)',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    upazilaEn: 'Dinajpur Sadar',
    category: 'Religious',
    categoryBn: 'ঐতিহাসিক ময়দান ও ঈদগাহ',
    categoryEn: 'Grand Eidgah & Landmark',
    lat: 25.621954185076603,
    lng: 88.63336019817271,
    descriptionBn:
      'দক্ষিণ এশিয়ার অন্যতম বৃহত্তম ঈদগাহ মিনার ও ঐতিহাসিক বিশাল সবুজ ময়দান। ৫২ গম্বুজের সুউচ্চ মিনার এবং বিকেলের খোলা হাওয়া উপভোগের সেরা জায়গা।',
    descriptionEn:
      'One of South Asia’s largest Eidgah grounds featuring a majestic 52-domed minaret complex and an expansive green park in the heart of Dinajpur.',
  },
  {
    id: 'mohonpur-rubber-dam',
    nameBn: 'মোহনপুর রাবার ড্যাম',
    nameEn: 'Mohonpur Rubber Dam',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    upazilaEn: 'Dinajpur Sadar',
    category: 'Nature',
    categoryBn: 'প্রকৃতি ও নদী ড্যাম',
    categoryEn: 'River Dam & Nature',
    lat: 25.546055468139315,
    lng: 88.78341226441913,
    descriptionBn:
      'আত্রাই নদীর বুকে নির্মিত দেশের অন্যতম বৃহত্তম রাবার ড্যাম প্রকল্প। নদীর তীরবর্তী মনোরম বাতাস ও জলের কলতান উপভোগের দারুণ স্থান।',
    descriptionEn:
      'One of Bangladesh’s largest rubber dam projects on the Atrai River, popular for riverside breezes, sunset views, and boat rides.',
  },
  {
    id: 'grand-dadu-bari',
    nameBn: 'দ্য গ্র্যান্ড দাদু বাড়ি পার্ক অ্যান্ড রিসোর্ট',
    nameEn: 'The Grand Dadu Bari Park & Resort',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    upazilaEn: 'Dinajpur Sadar',
    category: 'Resort/Park',
    categoryBn: 'রিসোর্ট ও বিনোদন পার্ক',
    categoryEn: 'Resort & Amusement Park',
    lat: 25.717177298711857,
    lng: 88.66611953784997,
    descriptionBn:
      'পরিবার-পরিজন নিয়ে অবকাশ যাপনের আধুনিক ইকো পার্ক ও রিসোর্ট। সুন্দর সাজানো কটেজ, সুইমিং পুল এবং শিশুদের রাইড রয়েছে।',
    descriptionEn:
      'Modern family eco-resort and amusement park featuring landscaped gardens, cottages, swimming facilities, and rides.',
  },
  {
    id: 'gouripur-sluice-gate',
    nameBn: 'গৌরীপুর স্লুইস গেট',
    nameEn: 'Gouripur Sluice Gate',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    upazilaEn: 'Dinajpur Sadar',
    category: 'Nature',
    categoryBn: 'প্রকৃতি ও জলাশয়',
    categoryEn: 'Riverside & Nature',
    lat: 25.543867345763637,
    lng: 88.5905340612469,
    descriptionBn:
      'নদীর শান্ত স্রোত ও বিস্তীর্ণ পল্লী প্রকৃতির সান্নিধ্য পেতে তরুণদের অন্যতম পছন্দের সান্ধ্যকালীন আড্ডাস্থল।',
    descriptionEn:
      'A serene rural water gate surrounded by green fields and gentle river currents, ideal for evening hangouts.',
  },
  {
    id: 'tikrir-math',
    nameBn: 'টিকরীর মাঠ / টিকলীর মাঠ',
    nameEn: 'Tikrir Math / Tiklir Math',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    upazilaEn: 'Dinajpur Sadar',
    category: 'Nature',
    categoryBn: 'সবুজ প্রান্তর',
    categoryEn: 'Open Meadow',
    lat: 25.582035585799108,
    lng: 88.6081698062472,
    descriptionBn:
      'দিগন্তজোড়া সবুজ ঘাসের খোলা প্রান্তর। বিকেলের সোনালী রোদ আর খোলা আকাশের নিচে সময় কাটানোর অপূর্ব জায়গা।',
    descriptionEn:
      'Horizon-wide green meadow offering peaceful golden-hour sunsets and open skies away from city bustle.',
  },
  {
    id: 'chehel-gazi-mazar',
    nameBn: 'চেহেল গাজী মাজার ও মসজিদ',
    nameEn: 'Chehel Gazi Mazar & Masjid',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    upazilaEn: 'Dinajpur Sadar',
    category: 'Religious',
    categoryBn: 'ঐতিহাসিক দরগাহ',
    categoryEn: 'Historic Shrine & Mosque',
    lat: 25.670865904290107,
    lng: 88.66115215410035,
    descriptionBn:
      'সুলতানি আমলের ঐতিহাসিক মাজার ও প্রাচীন মসজিদ। ৪০ জন গাজীর স্মৃতিবিজড়িত এই স্থানটি দিনাজপুরের অন্যতম প্রাচীন ধর্মীয় নিদর্শন।',
    descriptionEn:
      'Sultanate-era shrine and historic mosque commemorating forty saint-warriors, flanked by ancient ponds and sal trees.',
  },
  {
    id: 'matasagar',
    nameBn: 'মাতাসাগর দিঘি',
    nameEn: 'Matasagar Lake',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    upazilaEn: 'Dinajpur Sadar',
    category: 'Nature',
    categoryBn: 'প্রকৃতি ও জলাশয়',
    categoryEn: 'Historic Lake',
    lat: 25.602114,
    lng: 88.630121,
    descriptionBn:
      'রাজবাড়ির অদূরে অবস্থিত আরেকটি ঐতিহাসিক বিশাল দিঘি। এর শান্ত জলরাশি ও উঁচু পাড় ভ্রমণকারীদের মনে প্রশান্তি এনে দেয়।',
    descriptionEn:
      'Another historic royal reservoir in Dinajpur Sadar known for its high wooded embankments and calm waters.',
  },
  {
    id: 'dinajpur-shishu-park',
    nameBn: 'দিনাজপুর শিশু পার্ক',
    nameEn: 'Dinajpur Shishu Park',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    upazilaEn: 'Dinajpur Sadar',
    category: 'Resort/Park',
    categoryBn: 'বিনোদন পার্ক',
    categoryEn: 'Children & Family Park',
    lat: 25.625102,
    lng: 88.638012,
    descriptionBn:
      'শিশু-কিশোর ও পরিবারের সাথে আনন্দময় সময় কাটানোর জন্য শহরের অন্যতম জনপ্রিয় বিনোদন কেন্দ্র।',
    descriptionEn:
      'Popular urban recreational park in Dinajpur town featuring rides and green spaces for children and families.',
  },
  {
    id: 'jibon-mohol',
    nameBn: 'জীবন মহল পার্ক',
    nameEn: 'Jibon Mohol Park',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    upazilaEn: 'Dinajpur Sadar',
    category: 'Resort/Park',
    categoryBn: 'রিসোর্ট ও পার্ক',
    categoryEn: 'Resort & Park',
    lat: 25.631021,
    lng: 88.629102,
    descriptionBn:
      'শৈল্পিক ভাস্কর্য, বাগান ও বিনোদন রাইডে সাজানো মনোরম পিকনিক ও ভ্রমণ স্পট।',
    descriptionEn:
      'Scenic recreational park and picnic venue featuring gardens, sculptures, and family attractions.',
  },
  {
    id: 'kanchan-bridge',
    nameBn: 'কাঞ্চন ব্রিজ ও পুনর্ভবা নদী',
    nameEn: 'Kanchan Bridge & Punarbhaba River',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    upazilaEn: 'Dinajpur Sadar',
    category: 'Nature',
    categoryBn: 'নদী ও সূর্যাস্ত ভিউ',
    categoryEn: 'River & Sunset View',
    lat: 25.6449011,
    lng: 88.6627166,
    descriptionBn:
      'ঐতিহাসিক পুনর্ভবা নদীর ওপর নির্মিত কাঞ্চন ব্রিজ। বিকেলের সূর্যাস্ত এবং নদীর তীরের স্নিগ্ধ বাতাস উপভোগের চমৎকার স্থান।',
    descriptionEn:
      'Iconic bridge spanning the historic Punarbhaba River, offering panoramic sunset views over the riverbanks.',
  },
  {
    id: 'promodtori',
    nameBn: 'প্রমোদতরী পার্ক',
    nameEn: 'Promodtori Park',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    upazilaEn: 'Dinajpur Sadar',
    category: 'Resort/Park',
    categoryBn: 'রিসোর্ট ও পার্ক',
    categoryEn: 'Amusement Park',
    lat: 25.606394690894213,
    lng: 88.62352303816546,
    descriptionBn:
      'রামসাগর রোডে অবস্থিত আধুনিক বিনোদন পার্ক ও বোট রাইডিং স্পট।',
    descriptionEn:
      'Leisure and boating park located along Ramsagar Road, popular for family outings.',
  },
  // Biral
  {
    id: 'chachal-resort',
    nameBn: 'চাচাই রিসোর্ট / চঞ্চল রিসোর্ট',
    nameEn: 'Chachal Resort',
    upazilaId: 'biral',
    upazilaBn: 'বিরল',
    upazilaEn: 'Biral',
    category: 'Resort/Park',
    categoryBn: 'ইকো রিসোর্ট',
    categoryEn: 'Eco Resort',
    lat: 25.64458003371477,
    lng: 88.54991360371184,
    descriptionBn:
      'বিরল উপজেলায় প্রাকৃতিক পরিবেশে গড়ে ওঠা ছিমছাম ও মনোরম অবকাশ যাপন কেন্দ্র।',
    descriptionEn:
      'Tranquil countryside resort in Biral Upazila surrounded by ponds, litchi orchards, and lush gardens.',
  },
  {
    id: 'dhormopur-salbon',
    nameBn: 'ধর্মপুর শালবন',
    nameEn: 'Dhormopur Salbon',
    upazilaId: 'biral',
    upazilaBn: 'বিরল',
    upazilaEn: 'Biral',
    category: 'Nature',
    categoryBn: 'প্রাকৃতিক শালবন',
    categoryEn: 'Natural Sal Forest',
    lat: 25.53595735151229,
    lng: 88.54282989317129,
    descriptionBn:
      'বিরলের প্রাচীন ও ঘন প্রাকৃতিক শালবন। নির্জন বনের মেঠোপথ ও পাখির ডাক প্রকৃতিপ্রেমীদের টানে।',
    descriptionEn:
      'Ancient deciduous Sal forest in Biral offering shaded woodland trails and rich biodiversity.',
  },
  {
    id: 'birol-land-port',
    nameBn: 'বিরল স্থলবন্দর',
    nameEn: 'Birol Land Port',
    upazilaId: 'biral',
    upazilaBn: 'বিরল',
    upazilaEn: 'Biral',
    category: 'Industry',
    categoryBn: 'স্থলবন্দর ও সীমান্ত',
    categoryEn: 'Land Port & Border',
    lat: 25.645882971169073,
    lng: 88.46335796687369,
    descriptionBn:
      'বাংলাদেশ-ভারত রেল ও বাণিজ্য সীমান্ত পয়েন্ট। গ্রামীণ সৌন্দর্যে ঘেরা ঐতিহাসিক রেলপথ ও স্থলবন্দর।',
    descriptionEn:
      'Historic cross-border railway and trade port connecting Dinajpur’s Biral Upazila with West Bengal.',
  },
  // Nawabganj
  {
    id: 'sitakot-vihara',
    nameBn: 'সীতাকোট বিহার',
    nameEn: 'Sitakot Vihara',
    upazilaId: 'nawabganj',
    upazilaBn: 'নবাবগঞ্জ',
    upazilaEn: 'Nawabganj',
    category: 'Historical',
    categoryBn: 'প্রাচীন বৌদ্ধ বিহার',
    categoryEn: 'Ancient Buddhist Monastery',
    lat: 25.414424379871463,
    lng: 89.05180961535459,
    descriptionBn:
      'খ্রিস্টীয় ষষ্ঠ-সপ্তম শতাব্দীর প্রাচীনতম বৌদ্ধ বিহারগুলোর একটি। প্রত্নতাত্ত্বিক ইতিহাস ও প্রাচীন স্থাপত্যের অমূল্য নিদর্শন।',
    descriptionEn:
      'One of Bengal’s oldest Buddhist monastic complexes dating back to the 6th–7th century CE in Nawabganj.',
  },
  {
    id: 'nawabganj-national-park',
    nameBn: 'নবাবগঞ্জ জাতীয় উদ্যান ও আশুরার বিল',
    nameEn: 'Nawabganj National Park & Ashurar Beel',
    upazilaId: 'nawabganj',
    upazilaBn: 'নবাবগঞ্জ',
    upazilaEn: 'Nawabganj',
    category: 'Nature',
    categoryBn: 'জাতীয় উদ্যান ও জলাভূমি',
    categoryEn: 'National Park & Wetland',
    lat: 25.437779858455695,
    lng: 89.05746086468163,
    descriptionBn:
      'বিশাল শালবন ও ঐতিহ্যবাহী আশুরার বিলের সমন্বয়ে গড়ে ওঠা জাতীয় উদ্যান। কাঠের আঁকাবাঁকা সেতু ও শাপলা ফোটা বিল এর প্রধান আকর্ষণ।',
    descriptionEn:
      'Expansive Sal forest and wetland sanctuary famous for its wooden boardwalk bridge, water lilies, and migratory birds.',
  },
  // Ghoraghat
  {
    id: 'sura-mosque',
    nameBn: 'সুরা মসজিদ',
    nameEn: 'Sura Mosque',
    upazilaId: 'ghoraghat',
    upazilaBn: 'ঘোড়াঘাট',
    upazilaEn: 'Ghoraghat',
    category: 'Religious',
    categoryBn: 'সুলতানি আমলের মসজিদ',
    categoryEn: 'Sultanate Era Mosque',
    lat: 25.25206304029241,
    lng: 89.21251758920313,
    descriptionBn:
      'ষোড়শ শতাব্দীর হোসেন শাহী আমলের পোড়ামাটির কারুকার্যমণ্ডিত ঐতিহাসিক এক গম্বুজ মসজিদ।',
    descriptionEn:
      '16th-century Husain Shahi period mosque in Ghoraghat featuring stone carvings and glazed terracotta masonry.',
  },
  {
    id: 'ghoraghat-ancient-fort',
    nameBn: 'ঘোড়াঘাট প্রাচীন দুর্গ',
    nameEn: 'Ghoraghat Ancient Fort',
    upazilaId: 'ghoraghat',
    upazilaBn: 'ঘোড়াঘাট',
    upazilaEn: 'Ghoraghat',
    category: 'Historical',
    categoryBn: 'ঐতিহাসিক দুর্গ',
    categoryEn: 'Historic Fort Ruins',
    lat: 25.230397618988253,
    lng: 89.29509544311667,
    descriptionBn:
      'করতোয়া নদীর তীরে অবস্থিত মধ্যযুগীয় সামরিক দুর্গ ও ঐতিহাসিক প্রত্নস্থল।',
    descriptionEn:
      'Medieval mud-and-brick military fortress ruins situated along the banks of the Karatoya River.',
  },
  // Hakimpur
  {
    id: 'hili-land-port',
    nameBn: 'হিলি স্থলবন্দর ও জিরো পয়েন্ট',
    nameEn: 'Hili Land Port & Zero Point',
    upazilaId: 'hakimpur',
    upazilaBn: 'হাকিমপুর',
    upazilaEn: 'Hakimpur',
    category: 'Industry',
    categoryBn: 'স্থলবন্দর ও সীমান্ত',
    categoryEn: 'International Land Port',
    lat: 25.27984507539551,
    lng: 89.00816752973608,
    descriptionBn:
      'দেশের দ্বিতীয় বৃহত্তম স্থলবন্দর এবং বাংলাদেশ-ভারত সীমান্ত জিরো পয়েন্ট ও ঐতিহাসিক রেলগেট।',
    descriptionEn:
      'Bangladesh’s second-largest land port in Hakimpur where the railway track runs right beside the border zero point.',
  },
  // Parbatipur
  {
    id: 'barapukuria-coal-mine',
    nameBn: 'বড়পুকুরিয়া কয়লা খনি ও তাপবিদ্যুৎ কেন্দ্র',
    nameEn: 'Barapukuria Coal Mine & Power Plant',
    upazilaId: 'parbatipur',
    upazilaBn: 'পার্বতীপুর',
    upazilaEn: 'Parbatipur',
    category: 'Industry',
    categoryBn: 'খনি ও শিল্প ল্যান্ডমার্ক',
    categoryEn: 'Mining & Industrial Landmark',
    lat: 25.554439044329765,
    lng: 88.95040456010784,
    descriptionBn:
      'বাংলাদেশের একমাত্র সচল ভূগর্ভস্থ কয়লা খনি এবং কয়লাভিত্তিক তাপবিদ্যুৎ কেন্দ্র।',
    descriptionEn:
      'Bangladesh’s premier underground coal mine and thermal power generation complex in Parbatipur.',
  },
  {
    id: 'maddhapara-granite',
    nameBn: 'মধ্যপাড়া কঠিন শিলা খনি',
    nameEn: 'Maddhapara Granite Mining Project',
    upazilaId: 'parbatipur',
    upazilaBn: 'পার্বতীপুর',
    upazilaEn: 'Parbatipur',
    category: 'Industry',
    categoryBn: 'খনি ও শিল্প ল্যান্ডমার্ক',
    categoryEn: 'Hard Rock Mine',
    lat: 25.56675910273662,
    lng: 89.06014625593035,
    descriptionBn:
      'দেশের একমাত্র ভূগর্ভস্থ কঠিন শিলা (গ্রানাইট) খনি প্রকল্প।',
    descriptionEn:
      'The only underground hard rock and granite mining project in Bangladesh, located in Parbatipur.',
  },
  // Birganj
  {
    id: 'singra-sal-forest',
    nameBn: 'সিংড়া জাতীয় উদ্যান ও শালবন',
    nameEn: 'Singra National Park & Sal Forest',
    upazilaId: 'birganj',
    upazilaBn: 'বীরগঞ্জ',
    upazilaEn: 'Birganj',
    category: 'Nature',
    categoryBn: 'জাতীয় উদ্যান ও শালবন',
    categoryEn: 'National Park & Forest',
    lat: 25.885931945072546,
    lng: 88.5580464942477,
    descriptionBn:
      'বীরগঞ্জে নর্ত নদীর কোলজুড়ে বিস্তৃত বিশাল প্রাকৃতিক শালবন ও জাতীয় উদ্যান। শীতকালে পিকনিক ও প্রকৃতি ভ্রমণের আদর্শ স্থান।',
    descriptionEn:
      'Vast protected Sal forest national park in Birganj bisected by the scenic Narta River.',
  },
  // Birampur
  {
    id: 'aqua-theme-park',
    nameBn: 'অ্যাকোয়া থিম পার্ক',
    nameEn: 'Aqua Theme Park',
    upazilaId: 'birampur',
    upazilaBn: 'বিরামপুর',
    upazilaEn: 'Birampur',
    category: 'Resort/Park',
    categoryBn: 'ওয়াটার ও থিম পার্ক',
    categoryEn: 'Water & Theme Park',
    lat: 25.37117696960725,
    lng: 89.00074294590944,
    descriptionBn:
      'বিরামপুরে অবস্থিত আধুনিক ওয়াটার রাইড ও পারিবারিক বিনোদন পার্ক।',
    descriptionEn:
      'Family water and amusement park in Birampur featuring pools, slides, and garden seating.',
  },
  {
    id: 'birampur-shalbagan',
    nameBn: 'বিরামপুর শালবাগান (চরকাই)',
    nameEn: 'Charkai Shalbagan',
    upazilaId: 'birampur',
    upazilaBn: 'বিরামপুর',
    upazilaEn: 'Birampur',
    category: 'Nature',
    categoryBn: 'প্রাকৃতিক শালবন',
    categoryEn: 'Sal Forest Reserve',
    lat: 25.420175591512308,
    lng: 88.97784231887726,
    descriptionBn:
      'বিরামপুরের চরকাইয়ে অবস্থিত ছায়াঘেরা সবুজ শালবাগান ও প্রাকৃতিক বনভূমি।',
    descriptionEn:
      'Serene Sal forest reserve in Charkai, Birampur offering quiet nature walks.',
  },
  // Fulbari
  {
    id: 'fulbari-barapukuria-eco',
    nameBn: 'ফুলবাড়ী ছোট যমুনা নদী ও ঘাটপাড়',
    nameEn: 'Fulbari Choto Jamuna Riverfront',
    upazilaId: 'fulbari',
    upazilaBn: 'ফুলবাড়ী',
    upazilaEn: 'Fulbari',
    category: 'Nature',
    categoryBn: 'নদী ও প্রাকৃতিক সৌন্দর্য',
    categoryEn: 'Riverfront & Nature',
    lat: 25.4982,
    lng: 88.9485,
    descriptionBn:
      'দিনাজপুর সদর থেকে ৪০.৮ কি.মি. দূরে ফুলবাড়ী শহরের বুক চিরে বয়ে যাওয়া ছোট যমুনা নদীর তীর ও ঐতিহাসিক ব্রিটিশ আমলের রেলস্টেশন।',
    descriptionEn:
      'Located 40.8 km from Dinajpur Sadar, the scenic Choto Jamuna Riverfront and historic railway station in Fulbari.',
  },
  // Chirirbandar
  {
    id: 'chirirbandar-ghuguratoli',
    nameBn: 'চিরিরবন্দর কাঁকড়া নদী ও রাবার ড্যাম',
    nameEn: 'Chirirbandar Kakra River & Rubber Dam',
    upazilaId: 'chirirbandar',
    upazilaBn: 'চিরিরবন্দর',
    upazilaEn: 'Chirirbandar',
    category: 'Nature',
    categoryBn: 'নদী ও ড্যাম ভিউ',
    categoryEn: 'River & Dam View',
    lat: 25.6632,
    lng: 88.7812,
    descriptionBn:
      'সুগন্ধি কাটারিভোগ ধানের জনপদ চিরিরবন্দরের কাঁকড়া নদীর মনোরম দৃশ্য ও গ্রামীণ প্রকৃতি।',
    descriptionEn:
      'Scenic Kakra River banks in Chirirbandar, the heartland of Dinajpur’s GI-famous aromatic Kataribhog rice.',
  },
  // Khansama
  {
    id: 'aokra-mosque-khansama',
    nameBn: 'ঐতিহাসিক আওকরা মসজিদ ও জয়গঞ্জ জমিদার বাড়ি',
    nameEn: 'Historic Aokra Mosque & Joyganj Zamindar Bari',
    upazilaId: 'khansama',
    upazilaBn: 'খানসামা',
    upazilaEn: 'Khansama',
    category: 'Historical',
    categoryBn: 'প্রাচীন স্থাপত্য (১৭৬৬)',
    categoryEn: 'Historic Architecture (1766)',
    lat: 25.9212,
    lng: 88.7425,
    descriptionBn:
      '১৭৬৬ খ্রিস্টাব্দে নির্মিত ২৫০ বছরের প্রাচীন আওকরা মসজিদ ও জয়গঞ্জ জমিদার বাড়ির ধ্বংসাবশেষ।',
    descriptionEn:
      '250-year-old Mughal-era Aokra Mosque (built 1766 CE) and the historic Joyganj Zamindar Bari in Khansama.',
  },
  // Bochaganj
  {
    id: 'setabganj-sugar-mill-heritage',
    nameBn: 'সেতাবগঞ্জ ঐতিহাসিক চিনিকল ও পীর সুলতান মাজার',
    nameEn: 'Setabganj Historic Sugar Mill & Shrine',
    upazilaId: 'bochaganj',
    upazilaBn: 'বোচাগঞ্জ',
    upazilaEn: 'Bochaganj',
    category: 'Industry',
    categoryBn: 'ঐতিহাসিক শিল্প ও ঐতিহ্য',
    categoryEn: 'Industrial & Cultural Heritage',
    lat: 25.8012,
    lng: 88.4615,
    descriptionBn:
      'বোচাগঞ্জ উপজেলার সেতাবগঞ্জে অবস্থিত ১৯৩৩ সালের ঐতিহাসিক চিনিকল ক্যাম্পাস ও প্রাচীন ধর্মীয় নিদর্শন।',
    descriptionEn:
      'Historic 1933 Setabganj Sugar Mill estate and heritage landmarks in Bochaganj Upazila.',
  },
  // Nawabganj Swapnapuri
  {
    id: 'swapnapuri-artificial-amusement-park',
    nameBn: 'স্বপ্নপুরী পিকনিক স্পট ও রিসোর্ট',
    nameEn: 'Swapnapuri Amusement Park & Resort',
    upazilaId: 'nawabganj',
    upazilaBn: 'নবাবগঞ্জ',
    upazilaEn: 'Nawabganj',
    category: 'Resort/Park',
    categoryBn: 'থিম পার্ক ও রিসোর্ট',
    categoryEn: 'Theme Park & Resort',
    lat: 25.4685,
    lng: 89.0352,
    descriptionBn:
      'উত্তরবঙ্গের সবচেয়ে জনপ্রিয় ও বিশাল পারিবারিক বিনোদন কেন্দ্র, কেবল কার, কৃত্রিম লেক, চিড়িয়াখানা এবং ভিআইপি রেস্ট হাউস।',
    descriptionEn:
      'Northern Bangladesh’s largest family theme park and resort in Nawabganj featuring lakes, gardens, rides, and cottages.',
  },
];

export const HERO_SLIDES = [
  {
    id: 'kantaji',
    image: KANTAJI_IMAGE,
    badgeBn: 'ঐতিহাসিক স্থাপত্য · কাহারোল, দিনাজপুর',
    badgeEn: 'Heritage Architecture · Kaharole, Dinajpur',
    titleBn: 'কান্তজিউ মন্দিরের অপরূপ টেরাকোটা শিল্প',
    titleEn: 'Exquisite Terracotta Art of Kantaji Temple',
    subtitleBn: '১৭০৪ সালের রাজকীয় স্থাপত্য ও পোড়ামাটির অলংকরণে গড়া দিনাজপুরের মুকুটমণি',
    subtitleEn: 'The 1704 royal architectural masterpiece adorned with thousands of terracotta plaques',
  },
  {
    id: 'ramsagar',
    image: RAMSAGAR_IMAGE,
    badgeBn: 'জাতীয় উদ্যান · দিনাজপুর সদর',
    badgeEn: 'National Park · Dinajpur Sadar',
    titleBn: 'রামসাগর ও সুখ সাগরের শান্ত নীল জলরাশি',
    titleEn: 'Tranquil Waters of Ramsagar & Sukh Sagar',
    subtitleBn: 'সবুজ শালবন ও পাখির কলকাকলিতে ঘেরা ঐতিহাসিক দিঘির পাড়ে হারিয়ে যান',
    subtitleEn: 'Immerse yourself in historic royal lakes surrounded by lush Sal forests',
  },
  {
    id: 'rajbari',
    image: RAJBARI_IMAGE,
    badgeBn: 'রাজকীয় ঐতিহ্য · দিনাজপুর সদর',
    badgeEn: 'Royal Heritage · Dinajpur Sadar',
    titleBn: 'দিনাজপুর রাজবাড়ি ও ১৩ উপজেলার ভ্রমণ ট্র্যাকার',
    titleEn: 'Dinajpur Rajbari & 13-Upazila Travel Tracker',
    subtitleBn: 'আপনার ঘুরে দেখা উপজেলাগুলো চিহ্নিত করুন এবং ডাউনলোড করুন ভ্রমণ সার্টিফিকেট',
    subtitleEn: 'Mark the upazilas you have visited and download your personalized travel certificate',
  },
];

export const COMING_SOON_FEATURES = [
  {
    id: 'trip-planner',
    tagBn: 'শীঘ্রই আসছে',
    tagEn: 'Coming Soon',
    titleBn: 'স্মার্ট ট্রিপ প্ল্যানার ও রুট গাইড',
    titleEn: 'Smart Trip Planner & Route Builder',
    descBn:
      'আপনার হাতে থাকা সময় (১ দিন বা ২ দিন) এবং পছন্দের ক্যাটাগরি অনুযায়ী দিনাজপুরের সেরা ভ্রমণ রুট ও অটোমেটিক ট্যুর প্ল্যান তৈরি করার সুবিধা শীঘ্রই যুক্ত হচ্ছে।',
    descEn:
      'Create customized 1-day or weekend itineraries across Dinajpur with optimized travel routes, transport estimates, and time schedules.',
    etaBn: 'পরবর্তী আপডেট',
    etaEn: 'Next Update',
  },
  {
    id: 'quiz-game',
    tagBn: 'শীঘ্রই আসছে',
    tagEn: 'Coming Soon',
    titleBn: 'দিনাজপুর কুইজ ও ট্রাভেল গেম',
    titleEn: 'Dinajpur Heritage Quiz & Map Game',
    descBn:
      'দিনাজপুরের ইতিহাস, ঐতিহ্য এবং ১৩টি উপজেলার দর্শনীয় স্থান নিয়ে মজার ম্যাপ কুইজ খেলা ও ট্রাভেলার লিডারবোর্ড শীঘ্রই আসছে।',
    descEn:
      'Test your knowledge of Dinajpur’s landmarks, history, and geography with interactive map challenges and a live traveler leaderboard.',
    etaBn: 'ডেভেলপমেন্ট চলছে',
    etaEn: 'In Development',
  },
  {
    id: 'hidden-gems',
    tagBn: 'শীঘ্রই আসছে',
    tagEn: 'Coming Soon',
    titleBn: 'লুকানো রত্ন ও ঐতিহ্যবাহী খাবার গাইড',
    titleEn: 'Hidden Gems & Culinary Trail',
    descBn:
      'দিনাজপুরের বিখ্যাত লিচু বাগান, কাটারিভোগ চাল, পাপড় এবং পর্যটকদের ভিড়ের বাইরের অচেনা গ্রামীণ সৌন্দর্যের বিশেষ গাইড যুক্ত করা হচ্ছে।',
    descEn:
      'Discover famous litchi orchards, Kataribhog rice heritage, authentic local cuisine spots, and off-the-beaten-path rural trails.',
    etaBn: 'তথ্য সংকলন চলছে',
    etaEn: 'Curating Spots',
  },
  {
    id: 'more-spots',
    tagBn: 'শীঘ্রই আসছে',
    tagEn: 'Coming Soon',
    titleBn: 'বোচাগঞ্জ, খানসামা, চিরিরবন্দর ও ফুলবাড়ীর নতুন স্পট',
    titleEn: 'More Spots Across All 13 Upazilas',
    descBn:
      'দিনাজপুরের প্রতিটি উপজেলার আরও নতুন ঐতিহাসিক স্থান, রিসোর্ট, হোটেল ডিরেক্টরি এবং ৩৬০° ভিউ খুব শীঘ্রই যুক্ত করা হবে।',
    descEn:
      'We are actively verifying and adding more historical sites, eco-resorts, stay directories, and community travel stories across every upazila.',
    etaBn: 'নিয়মিত আপডেট',
    etaEn: 'Continuous Expansion',
  },
];

const BANGLA_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function formatNumber(num: number, lang: Language): string {
  const formatted = num.toLocaleString('en-IN');
  if (lang === 'en') return formatted;
  return formatted.replace(/\d/g, (d) => BANGLA_DIGITS[Number(d)] || d);
}
