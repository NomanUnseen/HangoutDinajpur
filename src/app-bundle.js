/**
 * Hangout Dinajpur - Travel Guide & District Tracker
 * Verified 28 Spots Database, Direct Gallery Upload & Storage Engine
 */

// 1. All 13 Upazilas of Dinajpur District
const UPAZILAS = [
  { id: 'sadar', nameBn: 'দিনাজপুর সদর', nameEn: 'Dinajpur Sadar' },
  { id: 'kaharole', nameBn: 'কাহারোল', nameEn: 'Kaharole' },
  { id: 'biral', nameBn: 'বিরল', nameEn: 'Biral' },
  { id: 'nawabganj', nameBn: 'নবাবগঞ্জ', nameEn: 'Nawabganj' },
  { id: 'ghoraghat', nameBn: 'ঘোড়াঘাট', nameEn: 'Ghoraghat' },
  { id: 'hakimpur', nameBn: 'হাকিমপুর', nameEn: 'Hakimpur' },
  { id: 'parbatipur', nameBn: 'পার্বতীপুর', nameEn: 'Parbatipur' },
  { id: 'birganj', nameBn: 'বীরগঞ্জ', nameEn: 'Birganj' },
  { id: 'birampur', nameBn: 'বিরামপুর', nameEn: 'Birampur' },
  { id: 'bochaganj', nameBn: 'বোচাগঞ্জ', nameEn: 'Bochaganj' },
  { id: 'khansama', nameBn: 'খানসামা', nameEn: 'Khansama' },
  { id: 'chirirbandar', nameBn: 'চিরিরবন্দর', nameEn: 'Chirirbandar' },
  { id: 'fulbari', nameBn: 'ফুলবাড়ী', nameEn: 'Fulbari' }
];

// 2. Verified Spots Database with Exact Coordinates & Categories
const SPOTS = [
  // Dinajpur Sadar (13 spots)
  {
    id: 'sukh-sagar',
    nameBn: 'সুখ সাগর',
    nameEn: 'Sukh Sagar',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    category: 'Nature',
    categoryBn: 'প্রকৃতি ও জলাশয়',
    lat: 25.647922869743553,
    lng: 88.63715677504543,
    description: 'দিনাজপুর শহরের সন্নিকটে অবস্থিত এক নয়নাভিরাম ঐতিহাসিক জলাশয় ও দিঘি। শান্ত স্নিগ্ধ পরিবেশ এবং সকাল-বিকালে ভ্রমণপিপাসুদের পদচারণায় এটি মুখরিত থাকে।'
  },
  {
    id: 'dinajpur-rajbari',
    nameBn: 'দিনাজপুর রাজবাড়ি',
    nameEn: 'Dinajpur Rajbari',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    category: 'Historical',
    categoryBn: 'ঐতিহাসিক প্রাসাদ',
    lat: 25.64893759138725,
    lng: 88.66382978701144,
    description: 'উত্তরবঙ্গের রাজকীয় ইতিহাসের জীবন্ত সাক্ষী। কুমার মহল, আয়না মহল ও প্রাচীন কারুকার্যময় সিংহদুয়ার নিয়ে অবস্থিত ঐতিহাসিক দিনাজপুরের রাজাদের এই প্রাচীন সুরম্য বাসস্থান।'
  },
  {
    id: 'mohonpur-rubber-dam',
    nameBn: 'মোহনপুর রাবার ড্যাম',
    nameEn: 'Mohonpur Rubber Dam',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    category: 'Nature',
    categoryBn: 'প্রকৃতি ও নদী ড্যাম',
    lat: 25.546055468139315,
    lng: 88.78341226441913,
    description: 'আত্রাই নদীর বুকে নির্মিত দেশের অন্যতম বৃহত্তম রাবার ড্যাম প্রকল্প। নদী তীরবর্তী মনোরম সবুজ পরিবেশ এবং বিশাল জলরাশি দর্শনার্থীদের বিমোহিত করে।'
  },
  {
    id: 'grand-dadu-bari',
    nameBn: 'দ্য গ্র্যান্ড দাদু বাড়ি পার্ক অ্যান্ড রিসোর্ট',
    nameEn: 'The Grand Dadu Bari Park & Resort',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    category: 'Resort/Park',
    categoryBn: 'রিসোর্ট ও বিনোদন পার্ক',
    lat: 25.717177298711857,
    lng: 88.66611953784997,
    description: 'পরিবার-পরিজন নিয়ে অবকাশ যাপনের আধুনিক ইকো পার্ক ও রিসোর্ট। সুন্দর সাজানো কটেজ, খেলার মাঠ ও নান্দনিক গার্ডেন সম্বলিত প্রিমিয়াম স্পট।'
  },
  {
    id: 'gouripur-sluice-gate',
    nameBn: 'গৌরীপুর স্লুইস গেট',
    nameEn: 'Gouripur Sluice Gate',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    category: 'Nature',
    categoryBn: 'প্রকৃতি ও জলাশয়',
    lat: 25.543867345763637,
    lng: 88.5905340612469,
    description: 'নদীর শান্ত স্রোত ও বিস্তীর্ণ পল্লি প্রকৃতির সান্নিধ্য পেতে তরুণদের অন্যতম পছন্দের সান্ধ্যকালীন আড্ডা ও ফটোশুটের স্থান।'
  },
  {
    id: 'tikrir-math',
    nameBn: 'টিকরির মাঠ / টিকলির মাঠ',
    nameEn: 'Tikrir Math / Tiklir Math',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    category: 'Nature',
    categoryBn: 'উন্মুক্ত মাঠ ও ল্যান্ডমার্ক',
    lat: 25.582035585799108,
    lng: 88.6081698062472,
    description: 'দিনাজপুরের জনপ্রিয় উন্মুক্ত সবুজ মাঠ। দূর-দূরান্তের মুক্ত হাওয়া এবং প্রকৃতির খোলা আকাশের নিচে সময় কাটানোর দারুণ লোকেশন।'
  },
  {
    id: 'chehel-gazi-mazar',
    nameBn: 'চেহেল গাজী মাজার ও মসজিদ',
    nameEn: 'Chehel Gazi Mazar & Masjid',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    category: 'Religious',
    categoryBn: 'ধর্মীয় ও ঐতিহাসিক স্থান',
    lat: 25.670865904290107,
    lng: 88.66115215410035,
    description: 'সুলতানি আমলের প্রাচীন ঐতিহ্যবাহী মাজার ও মসজিদ প্রাঙ্গণ। ৪০ জন ইসলাম প্রচারক শহীদের পবিত্র সমাধিস্থল যা ভক্ত ও পর্যটকদের শ্রদ্ধার স্থান।'
  },
  {
    id: 'ramsagar',
    nameBn: 'রামসাগর জাতীয় উদ্যান',
    nameEn: 'Ramsagar National Park',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    category: 'Nature',
    categoryBn: 'জাতীয় উদ্যান ও ঐতিহাসিক দিঘি',
    lat: 25.55331525144556,
    lng: 88.62367616634857,
    description: 'বাংলাদেশের বৃহত্তম মানবনির্মিত ঐতিহাসিক দিঘি ও অন্যতম প্রধান জাতীয় উদ্যান। অষ্টাদশ শতকে রাজা রামনাথ কর্তৃক খননকৃত এই সুবিশাল দিঘি, চারপাশের ঘন বনভূমি ও শান্ত স্নিগ্ধ পরিবেশ পর্যটকদের প্রধানতম আকর্ষণ।'
  },
  {
    id: 'matasagar',
    nameBn: 'মাতাসাগর',
    nameEn: 'Matasagar',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    category: 'Nature',
    categoryBn: 'ঐতিহাসিক দিঘি',
    lat: 25.602114,
    lng: 88.630121,
    description: 'রামসাগরের সমসাময়িক আরেকটি প্রাচীন ঐতিহাসিক দিঘি। এর চারপাশের প্রাকৃতিক শ্যামলিমা ও শান্ত পরিবেশ চিত্তবিনোদনের আদর্শ ক্ষেত্র।'
  },
  {
    id: 'dinajpur-shishu-park',
    nameBn: 'দিনাজপুর শিশু পার্ক',
    nameEn: 'Dinajpur Shishu Park',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    category: 'Resort/Park',
    categoryBn: 'পারিবারিক বিনোদন পার্ক',
    lat: 25.625102,
    lng: 88.638012,
    description: 'দিনাজপুর শহরের প্রাণকেন্দ্রে অবস্থিত শিশুদের আনন্দদায়ক বিনোদন উদ্যান ও পারিবারিক ওয়াকওয়ে।'
  },
  {
    id: 'jibon-mohol',
    nameBn: 'জীবন মহল পার্ক',
    nameEn: 'Jibon Mohol Park',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    category: 'Resort/Park',
    categoryBn: 'থিম পার্ক ও বিনোদন কেন্দ্র',
    lat: 25.631021,
    lng: 88.629102,
    description: 'দিনাজপুর সদর সংলগ্ন জনপ্রিয় নান্দনিক পার্ক, রাইডস ও পারিবারিক অবসর কাটানোর দর্শনীয় স্থান।'
  },
  {
    id: 'kanchan-bridge',
    nameBn: 'কাঞ্চন ব্রিজ ও পুনর্ভবা নদী',
    nameEn: 'Kanchan Bridge & Punarbhaba River',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    category: 'Nature',
    categoryBn: 'নদী ও ব্রিজ ভিউ',
    lat: 25.6449011,
    lng: 88.6627166,
    description: 'পুনর্ভবা নদীর ওপর নির্মিত ঐতিহাসিক কাঞ্চন সেতু। সূর্যাস্তের সময় নদীর বিস্তীর্ণ চর ও পানির অপরূপ মায়াবী রূপ দেখার সেরা স্থান।'
  },
  {
    id: 'promodtori',
    nameBn: 'প্রমোদতরী',
    nameEn: 'Promodtori',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    category: 'Resort/Park',
    categoryBn: 'নদীর তীরবর্তী ক্যাফে ও পার্ক',
    lat: 25.606394690894213,
    lng: 88.62352303816546,
    description: 'নদীর মনোরম পরিবেশে তরুণদের সান্ধ্যকালীন আড্ডা, রিভারসাইড ভিউ এবং রিফ্রেশমেন্টের জনপ্রিয় স্পট।'
  },
  {
    id: 'gor-e-shahid',
    nameBn: 'গোর-এ-শহীদ বড় ময়দান',
    nameEn: 'Gor-e-Shahid Boro Maidan',
    upazilaId: 'sadar',
    upazilaBn: 'দিনাজপুর সদর',
    category: 'Religious',
    categoryBn: 'ঐতিহাসিক ঈদগাহ মিনার',
    lat: 25.621954185076603,
    lng: 88.63336019817271,
    description: 'উপমহাদেশের অন্যতম বৃহত্তম ঐতিহাসিক ঈদগাহ ময়দান ও সুবিশাল দৃষ্টিনন্দন ৫২ গম্বুজ মিনার স্থাপত্য।'
  },

  // Kaharole (2 spots)
  {
    id: 'kantaji-temple',
    nameBn: 'কান্তজিউ মন্দির (নবরত্ন)',
    nameEn: 'Kantaji Temple',
    upazilaId: 'kaharole',
    upazilaBn: 'কাহারোল',
    category: 'Historical',
    categoryBn: 'টেরাকোটা স্থাপত্য ঐতিহ্য',
    lat: 25.79055139404537,
    lng: 88.66712010147214,
    description: 'বাংলাদেশের পোড়ামাটির অলংকরণ ও টেরাকোটা স্থাপত্যের শ্রেষ্ঠ অনুপম নিদর্শন। অষ্টাদশ শতকে নির্মিত অনুপম ঐতিহাসিক মন্দির।'
  },
  {
    id: 'nayabad-masjid',
    nameBn: 'নয়াবাদ মসজিদ',
    nameEn: 'Nayabad Masjid',
    upazilaId: 'kaharole',
    upazilaBn: 'কাহারোল',
    category: 'Religious',
    categoryBn: 'মুঘল ঐতিহাসিক মসজিদ',
    lat: 25.78210905918981,
    lng: 88.65895447303386,
    description: 'কান্তজিউ মন্দির নির্মাণকারী মুসলিম কারিগরদের নির্মিত ১৭৯৩ সালের ঐতিহাসিক তিন গম্বুজ বিশিষ্ট নয়নাভিরাম মসজিদ।'
  },

  // Biral (3 spots)
  {
    id: 'chachal-resort',
    nameBn: 'চঞ্চল রিসোর্ট',
    nameEn: 'Chachal Resort',
    upazilaId: 'biral',
    upazilaBn: 'বিরল',
    category: 'Resort/Park',
    categoryBn: 'ইকো পার্ক ও রিসোর্ট',
    lat: 25.64458003371477,
    lng: 88.54991360371184,
    description: 'বিরল উপজেলার মনোরম নিরিবিলি পরিবেশে গড়ে ওঠা জনপ্রিয় পর্যটন কেন্দ্র ও গ্রিন রিসোর্ট।'
  },
  {
    id: 'dhormopur-salbon',
    nameBn: 'ধর্মপুর শালবন',
    nameEn: 'Dhormopur Salbon',
    upazilaId: 'biral',
    upazilaBn: 'বিরল',
    category: 'Nature',
    categoryBn: 'প্রাকৃতিক শালবন',
    lat: 25.53595735151229,
    lng: 88.54282989317129,
    description: 'সবুজে ঘেরা আদিম শালবনের মনোরম দৃশ্যপট। জীববৈচিত্র্য ও পাখির কলকাকলিতে ভরপুর প্রকৃতিপ্রেমীদের প্রিয় গন্তব্য।'
  },
  {
    id: 'birol-land-port',
    nameBn: 'বিরল স্থলবন্দর',
    nameEn: 'Birol Land Port',
    upazilaId: 'biral',
    upazilaBn: 'বিরল',
    category: 'Industry',
    categoryBn: 'আন্তর্জাতিক স্থল ও রেল বন্দর',
    lat: 25.645882971169073,
    lng: 88.46335796687369,
    description: 'ভারত-বাংলাদেশ আন্তর্জাতিক রেল ও স্থল বাণিজ্য পয়েন্ট। সীমান্তবর্তী এলাকার উন্মুক্ত দিগন্ত দেখার দারুণ স্থান।'
  },

  // Nawabganj (2 spots)
  {
    id: 'sitakot-vihara',
    nameBn: 'সীতাকোট বিহার',
    nameEn: 'Sitakot Vihara',
    upazilaId: 'nawabganj',
    upazilaBn: 'নবাবগঞ্জ',
    category: 'Historical',
    categoryBn: 'প্রাচীন বৌদ্ধ প্রত্নতত্ত্ব',
    lat: 25.414424379871463,
    lng: 89.05180961535459,
    description: 'প্রাচীন বৌদ্ধ বিহারের ঐতিহাসিক ধ্বংসাবশেষ। উত্তরবঙ্গের প্রাচীন প্রত্নতাত্ত্বিক ঐতিহ্যের অমূল্য নিদর্শন।'
  },
  {
    id: 'nawabganj-national-park',
    nameBn: 'নবাবগঞ্জ জাতীয় উদ্যান ও আশুড়ার বিল',
    nameEn: 'Nawabganj National Park & Ashurar Beel',
    upazilaId: 'nawabganj',
    upazilaBn: 'নবাবগঞ্জ',
    category: 'Nature',
    categoryBn: 'শালবন ও কাঠের সেতু',
    lat: 25.437779858455695,
    lng: 89.05746086468163,
    description: 'ঐতিহাসিক আশুড়ার বিল ও শালবন বেষ্টিত জাতীয় উদ্যান। বিলের ওপর নির্মিত আকর্ষক কাঠের আঁকাবাঁকা সেতু পর্যটকদের প্রধান আকর্ষণ।'
  },

  // Ghoraghat (2 spots)
  {
    id: 'sura-mosque',
    nameBn: 'সুরা মসজিদ',
    nameEn: 'Sura Mosque',
    upazilaId: 'ghoraghat',
    upazilaBn: 'ঘোড়াঘাট',
    category: 'Religious',
    categoryBn: 'সুলতানি স্থাপত্য নিদর্শন',
    lat: 25.25206304029241,
    lng: 89.21251758920313,
    description: 'ষোড়শ শতকের সুলতানি নির্মাণশৈলীর অনন্য প্রাচীন পাথরের চারকোনা মসজিদ। সূক্ষ্ম অলংকরণ ও ঐতিহ্যবাহী কারুকাজ।'
  },
  {
    id: 'ghoraghat-ancient-fort',
    nameBn: 'ঘোড়াঘাট প্রাচীন দুর্গ',
    nameEn: 'Ghoraghat Ancient Fort',
    upazilaId: 'ghoraghat',
    upazilaBn: 'ঘোড়াঘাট',
    category: 'Historical',
    categoryBn: 'ঐতিহাসিক প্রাচীন দুর্গ',
    lat: 25.230397618988253,
    lng: 89.29509544311667,
    description: 'মুঘল ও সুলতানি আমলে করতোয়া নদীর তীরে গড়ে ওঠা উত্তরবঙ্গের সামরিক প্রতিরক্ষার ঐতিহাসিক দুর্গ।'
  },

  // Hakimpur (1 spot)
  {
    id: 'hili-land-port',
    nameBn: 'হিলি স্থলবন্দর ও জিরো পয়েন্ট',
    nameEn: 'Hili Land Port & Zero Point',
    upazilaId: 'hakimpur',
    upazilaBn: 'হাকিমপুর',
    category: 'Industry',
    categoryBn: 'আন্তর্জাতিক স্থলবন্দর',
    lat: 25.27984507539551,
    lng: 89.00816752973608,
    description: 'দেশের দ্বিতীয় বৃহত্তম আন্তর্জাতিক স্থলবন্দর। সীমান্ত এলাকার ব্যস্ত বাণিজ্যিক কার্যক্রম ও দুই দেশের সংযোগস্থল।'
  },

  // Parbatipur (2 spots)
  {
    id: 'barapukuria-coal-mine',
    nameBn: 'বড়পুকুরিয়া কয়লা খনি ও বিদ্যুৎ কেন্দ্র',
    nameEn: 'Barapukuria Coal Mine & Thermal Power Plant',
    upazilaId: 'parbatipur',
    upazilaBn: 'পার্বতীপুর',
    category: 'Industry',
    categoryBn: 'জাতীয় শিল্প ল্যান্ডমার্ক',
    lat: 25.554439044329765,
    lng: 88.95040456010784,
    description: 'বাংলাদেশের একমাত্র কার্যকর ভূগর্ভস্থ কয়লা খনি এবং বিশাল কয়লাভিত্তিক জাতীয় তাপবিদ্যুৎ কেন্দ্র।'
  },
  {
    id: 'maddhapara-granite',
    nameBn: 'মধ্যপাড়া কঠিন শিলা খনি প্রকল্প',
    nameEn: 'Maddhapara Granite Mining Project',
    upazilaId: 'parbatipur',
    upazilaBn: 'পার্বতীপুর',
    category: 'Industry',
    categoryBn: 'গ্রানাইট ও কঠিন শিলা খনি',
    lat: 25.56675910273662,
    lng: 89.06014625593035,
    description: 'দেশের একমাত্র ভূগর্ভস্থ গ্রানাইট পাথর উত্তোলন প্রকল্প যা জাতীয় অবকাঠামো নির্মাণে অসামান্য ভূমিকা রাখছে।'
  },

  // Birganj (1 spot)
  {
    id: 'singra-sal-forest',
    nameBn: 'সিংড়া জাতীয় উদ্যান ও শালবন',
    nameEn: 'Singra National Park & Sal Forest',
    upazilaId: 'birganj',
    upazilaBn: 'বীরগঞ্জ',
    category: 'Nature',
    categoryBn: 'জাতীয় উদ্যান ও প্রাকৃতিক বন',
    lat: 25.885931945072546,
    lng: 88.5580464942477,
    description: 'বীরগঞ্জের ঘন শালবন বেষ্টিত জাতীয় উদ্যান। বনভূমির বুক চিরে বয়ে চলা প্রাকৃতিক লেক একে অন্যতম মনোরম রূপ দিয়েছে।'
  },

  // Birampur (2 spots)
  {
    id: 'aqua-theme-park',
    nameBn: 'অ্যাকোয়া থিম পার্ক',
    nameEn: 'Aqua Theme Park',
    upazilaId: 'birampur',
    upazilaBn: 'বিরামপুর',
    category: 'Resort/Park',
    categoryBn: 'ওয়াটার পার্ক ও বিনোদন',
    lat: 25.37117696960725,
    lng: 89.00074294590944,
    description: 'বিরামপুরের জনপ্রিয় ওয়াটার পার্ক ও আধুনিক বিনোদন কেন্দ্র, যেখানে পরিবারসহ ভ্রমণ উপভোগ্য।'
  },
  {
    id: 'birampur-shalbagan',
    nameBn: 'শালবাগান',
    nameEn: 'Shalbagan',
    upazilaId: 'birampur',
    upazilaBn: 'বিরামপুর',
    category: 'Nature',
    categoryBn: 'প্রাকৃতিক শালবন',
    lat: 25.420175591512308,
    lng: 88.97784231887726,
    description: 'বিরামপুরের সুশীতল ও মনোমুগ্ধকর প্রাকৃতিক শালবন ও গ্রামীণ সবুজ পরিবেশ।'
  }
];

// App State
let map = null;
let currentLayer = null;
let mapMarkers = [];
let selectedUpazilaFilter = 'all';
let selectedCategoryFilter = 'all';
let currentSearchQuery = '';

// Persistent LocalStorage Keys
const STORAGE_VISITED_KEY = 'hangout_dinajpur_visited_upazilas';
const STORAGE_SPOT_PHOTOS_KEY = 'hangout_dinajpur_custom_spot_photos';

// Visited Upazilas State
let visitedUpazilas = new Set();
try {
  const savedVisited = localStorage.getItem(STORAGE_VISITED_KEY);
  if (savedVisited) {
    visitedUpazilas = new Set(JSON.parse(savedVisited));
  }
} catch (e) {
  console.warn('Visited storage error', e);
}

// Custom Uploaded Spot Photos State
let customSpotPhotos = {};
try {
  const savedPhotos = localStorage.getItem(STORAGE_SPOT_PHOTOS_KEY);
  if (savedPhotos) {
    customSpotPhotos = JSON.parse(savedPhotos);
  }
} catch (e) {
  console.warn('Photos storage error', e);
}

// Category visual icon & color config
const CATEGORY_META = {
  Historical: { emoji: '🏛️', color: '#b45309', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', gradient: 'from-amber-600 to-amber-800' },
  Nature: { emoji: '🌲', color: '#15803d', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', gradient: 'from-emerald-600 to-teal-800' },
  Religious: { emoji: '🕌', color: '#0284c7', bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200', gradient: 'from-blue-600 to-sky-800' },
  'Resort/Park': { emoji: '🎡', color: '#7c3aed', bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200', gradient: 'from-purple-600 to-indigo-800' },
  Industry: { emoji: '⛏️', color: '#475569', bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300', gradient: 'from-slate-700 to-slate-900' }
};

// Map Tile Layers Configuration
const TILE_LAYERS = {
  google: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
  satellite: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
  osm: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
};

// Helper: Compress an image file to Base64 using Canvas
function compressImageFile(file, maxWidth = 640, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Save spot photo to localStorage
function saveSpotPhoto(spotId, base64Data) {
  try {
    customSpotPhotos[spotId] = base64Data;
    localStorage.setItem(STORAGE_SPOT_PHOTOS_KEY, JSON.stringify(customSpotPhotos));
  } catch (err) {
    console.error('LocalStorage quota exceeded', err);
    alert('মেমোরি সীমা পূর্ণ হয়েছে। আগের কিছু ছবি ডিলিট করে চেষ্টা করুন।');
  }
}

// Remove spot photo
function removeSpotPhoto(spotId) {
  if (customSpotPhotos[spotId]) {
    delete customSpotPhotos[spotId];
    try {
      localStorage.setItem(STORAGE_SPOT_PHOTOS_KEY, JSON.stringify(customSpotPhotos));
    } catch (e) {
      console.warn(e);
    }
  }
}

// Generate thumbnail HTML for cards & drawers
function getSpotThumbnailHtml(spot, isDrawer = false) {
  const photo = customSpotPhotos[spot.id];
  const meta = CATEGORY_META[spot.category] || CATEGORY_META.Historical;

  if (photo) {
    if (isDrawer) {
      return `
        <div class="relative w-full h-56 rounded-2xl overflow-hidden shadow-sm bg-slate-900 group">
          <img src="${photo}" alt="${spot.nameBn}" class="w-full h-full object-cover" />
          <div class="absolute bottom-2.5 right-2.5">
            <span class="px-2 py-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold rounded-lg flex items-center gap-1">
              ✓ গ্যালারি ছবি
            </span>
          </div>
        </div>
      `;
    }
    return `
      <div class="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden shrink-0 bg-slate-100 shadow-2xs">
        <img src="${photo}" alt="${spot.nameBn}" class="w-full h-full object-cover" />
        <span class="absolute top-1 left-1 px-1 py-0.5 rounded bg-blue-600/80 text-white text-[9px] font-bold">✓</span>
      </div>
    `;
  }

  // Placeholder gradient card header with vector aesthetic
  if (isDrawer) {
    return `
      <div onclick="document.getElementById('drawerPhotoInput').click()" class="cursor-pointer relative w-full h-52 rounded-2xl overflow-hidden shadow-sm bg-gradient-to-tr ${meta.gradient} p-6 flex flex-col items-center justify-center text-center text-white hover:opacity-95 transition-opacity">
        <div class="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-3xl mb-2.5 border border-white/20">
          ${meta.emoji}
        </div>
        <p class="text-xs font-semibold text-white/90">এখনো কোনো ছবি যোগ করা হয়নি</p>
        <p class="text-[11px] text-white/70 mt-0.5">এখানে ক্লিক করে বা নিচের বাটন থেকে ছবি আপলোড করুন</p>
      </div>
    `;
  }

  return `
    <div class="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl shrink-0 bg-gradient-to-tr ${meta.gradient} flex flex-col items-center justify-center text-white p-1 text-center shadow-2xs border border-slate-200">
      <span class="text-xl mb-0.5">${meta.emoji}</span>
      <span class="text-[9px] font-bold tracking-tight text-white/90 leading-tight">+ ছবি দিন</span>
    </div>
  `;
}

// Map Marker Icons
function createMarkerIcon(category, isHighlighted = false) {
  const meta = CATEGORY_META[category] || CATEGORY_META.Historical;
  const size = isHighlighted ? 42 : 34;
  const border = isHighlighted ? '3px solid #facc15' : '2px solid #ffffff';

  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `
      <div style="background-color:${meta.color}; width:${size}px; height:${size}px; border-radius:50%; border:${border}; box-shadow:0 3px 8px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; color:#fff; font-size:${size * 0.45}px; transition:all 0.2s ease;">
        ${meta.emoji}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
}

// Initialize Leaflet Map
function initMap() {
  const dinajpurCenter = [25.6279, 88.6332];
  
  map = L.map('map', {
    center: dinajpurCenter,
    zoom: 11,
    zoomControl: false
  });

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  setMapLayer('google');
  renderMapMarkers();
}

// Switch Map Tiles
window.setMapLayer = function(type) {
  if (currentLayer) {
    map.removeLayer(currentLayer);
  }

  const btnGoogle = document.getElementById('layerGoogleBtn');
  const btnSat = document.getElementById('layerSatBtn');
  const btnOsm = document.getElementById('layerOsmBtn');

  [btnGoogle, btnSat, btnOsm].forEach(btn => {
    if (btn) {
      btn.className = 'px-2 py-0.5 rounded-lg text-slate-700 hover:bg-slate-100';
    }
  });

  if (type === 'satellite') {
    currentLayer = L.tileLayer(TILE_LAYERS.satellite, {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20,
      attribution: '© Google Maps Satellite'
    }).addTo(map);
    if (btnSat) btnSat.className = 'px-2 py-0.5 rounded-lg bg-blue-600 text-white font-bold shadow-2xs';
  } else if (type === 'osm') {
    currentLayer = L.tileLayer(TILE_LAYERS.osm, {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    if (btnOsm) btnOsm.className = 'px-2 py-0.5 rounded-lg bg-blue-600 text-white font-bold shadow-2xs';
  } else {
    currentLayer = L.tileLayer(TILE_LAYERS.google, {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20,
      attribution: '© Google Maps'
    }).addTo(map);
    if (btnGoogle) btnGoogle.className = 'px-2 py-0.5 rounded-lg bg-blue-600 text-white font-bold shadow-2xs';
  }
};

// Fit Bounds to all filtered spots
window.fitAllMapBounds = function() {
  const filtered = getFilteredSpots();
  if (filtered.length === 0) return;
  const bounds = L.latLngBounds(filtered.map(s => [s.lat, s.lng]));
  map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
};

// Render Markers on Map
function renderMapMarkers() {
  mapMarkers.forEach(m => map.removeLayer(m));
  mapMarkers = [];

  const filtered = getFilteredSpots();

  filtered.forEach(spot => {
    const marker = L.marker([spot.lat, spot.lng], {
      icon: createMarkerIcon(spot.category)
    });

    const photo = customSpotPhotos[spot.id];
    const meta = CATEGORY_META[spot.category] || CATEGORY_META.Historical;

    const popupHtml = `
      <div class="w-60 overflow-hidden font-sans">
        ${photo ? `
          <div class="h-28 relative overflow-hidden bg-slate-900">
            <img src="${photo}" alt="${spot.nameBn}" class="w-full h-full object-cover" />
            <span class="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white">${spot.categoryBn}</span>
          </div>
        ` : `
          <div class="h-20 bg-gradient-to-tr ${meta.gradient} p-3 flex items-center justify-center text-white text-center">
            <span class="text-2xl mr-2">${meta.emoji}</span>
            <div class="text-left">
              <span class="text-[11px] font-bold block">${spot.nameBn}</span>
              <span class="text-[10px] text-white/80">${spot.categoryBn}</span>
            </div>
          </div>
        `}
        <div class="p-3">
          <h4 class="font-bold text-sm text-slate-900 leading-snug">${spot.nameBn}</h4>
          <p class="text-xs text-slate-500 mt-0.5">${spot.upazilaBn}</p>
          <div class="mt-2.5 flex items-center justify-between gap-2">
            <button onclick="openSpotDrawer('${spot.id}')" class="flex-1 py-1 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold text-center transition-colors">
              বিস্তারিত ও ছবি
            </button>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}" target="_blank" rel="noopener noreferrer" class="py-1 px-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold">
              ডিরেকশন
            </a>
          </div>
        </div>
      </div>
    `;

    marker.bindPopup(popupHtml);
    marker.on('click', () => {
      openSpotDrawer(spot.id);
    });

    marker.addTo(map);
    marker.spotId = spot.id;
    mapMarkers.push(marker);
  });
}

// Get Currently Filtered Spots
function getFilteredSpots() {
  return SPOTS.filter(spot => {
    const matchesUpazila = selectedUpazilaFilter === 'all' || spot.upazilaId === selectedUpazilaFilter;
    const matchesCategory = selectedCategoryFilter === 'all' || spot.category === selectedCategoryFilter;
    
    let matchesSearch = true;
    if (currentSearchQuery) {
      const q = currentSearchQuery.toLowerCase();
      matchesSearch = 
        spot.nameBn.toLowerCase().includes(q) ||
        spot.nameEn.toLowerCase().includes(q) ||
        spot.upazilaBn.toLowerCase().includes(q) ||
        spot.description.toLowerCase().includes(q);
    }

    return matchesUpazila && matchesCategory && matchesSearch;
  });
}

// Render Category Filter Chips with Dynamic Counts (All, Historical, Nature, Religious, Resort/Park, Industry)
function renderCategoryCounts() {
  const counts = {
    all: SPOTS.length,
    Historical: SPOTS.filter(s => s.category === 'Historical').length,
    Nature: SPOTS.filter(s => s.category === 'Nature').length,
    Religious: SPOTS.filter(s => s.category === 'Religious').length,
    'Resort/Park': SPOTS.filter(s => s.category === 'Resort/Park').length,
    Industry: SPOTS.filter(s => s.category === 'Industry').length
  };

  const setBadge = (id, count) => {
    const el = document.getElementById(id);
    if (el) el.textContent = count;
  };

  setBadge('countCatAll', counts.all);
  setBadge('countCatHist', counts.Historical);
  setBadge('countCatNature', counts.Nature);
  setBadge('countCatRel', counts.Religious);
  setBadge('countCatPark', counts['Resort/Park']);
  setBadge('countCatInd', counts.Industry);
}

// Render Upazila Pills
function renderUpazilaPills() {
  const container = document.getElementById('upazilaPillsContainer');
  if (!container) return;

  let html = `
    <button onclick="setUpazilaFilter('all')" data-upazila="all" class="upazila-pill active shrink-0 px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-2xs">
      সব (${SPOTS.length})
    </button>
  `;

  UPAZILAS.forEach(u => {
    const count = SPOTS.filter(s => s.upazilaId === u.id).length;
    html += `
      <button onclick="setUpazilaFilter('${u.id}')" data-upazila="${u.id}" class="upazila-pill shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs">
        ${u.nameBn} (${count})
      </button>
    `;
  });

  container.innerHTML = html;
}

// Render Spot Cards List
function renderSpotCards() {
  const container = document.getElementById('spotsCardContainer');
  const countBadge = document.getElementById('spotCountBadge');
  const mobileCountBadge = document.getElementById('mobileSpotCountLabel');
  if (!container) return;

  const filtered = getFilteredSpots();
  if (countBadge) countBadge.textContent = `${filtered.length} টি স্থান`;
  if (mobileCountBadge) mobileCountBadge.textContent = `${filtered.length}`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p class="text-3xl mb-2">🔍</p>
        <h4 class="font-bold text-slate-800">কোনো স্থান খুঁজে পাওয়া যায়নি</h4>
        <p class="text-xs text-slate-500 mt-1">অনুগ্রহ করে ফিল্টার পরিবর্তন বা সার্চ কিওয়ার্ড রিসেট করুন।</p>
        <button onclick="resetFiltersAndMap()" class="mt-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100">
          সব ফিল্টার রিসেট করুন
        </button>
      </div>
    `;
    return;
  }

  let html = '';
  filtered.forEach(spot => {
    const meta = CATEGORY_META[spot.category] || CATEGORY_META.Historical;
    const hasCustomPhoto = !!customSpotPhotos[spot.id];

    html += `
      <div class="group bg-white hover:bg-slate-50/90 rounded-2xl p-3 border border-slate-200/90 hover:border-blue-400 shadow-2xs hover:shadow-xs transition-all duration-300 flex gap-3 items-center">
        
        <!-- Thumbnail / Placeholder with Upload Trigger -->
        <div onclick="selectSpotFromCard('${spot.id}')" class="cursor-pointer">
          ${getSpotThumbnailHtml(spot, false)}
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
          <div onclick="selectSpotFromCard('${spot.id}')" class="cursor-pointer">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="px-2 py-0.5 text-[10px] font-bold rounded-md border ${meta.bg} ${meta.text} ${meta.border}">${spot.categoryBn}</span>
              <span class="text-[11px] font-semibold text-slate-500">• ${spot.upazilaBn}</span>
            </div>
            <h3 class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-1 truncate">
              ${spot.nameBn}
            </h3>
            <p class="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-normal">
              ${spot.description}
            </p>
          </div>

          <div class="flex items-center justify-between mt-1.5 pt-1 border-t border-slate-100">
            <!-- Direct Gallery Upload button on Card -->
            <label class="text-[11px] font-bold ${hasCustomPhoto ? 'text-emerald-700' : 'text-blue-600'} hover:underline flex items-center gap-1 cursor-pointer">
              <input type="file" accept="image/*" class="hidden" onchange="handleSpotPhotoCardUpload('${spot.id}', event)" />
              <span>📷 ${hasCustomPhoto ? 'ছবি পরিবর্তন' : 'ছবি আপলোড'}</span>
            </label>
            
            <button onclick="selectSpotFromCard('${spot.id}')" class="text-[11px] font-bold text-slate-500 hover:text-blue-600 flex items-center gap-0.5">
              ম্যাপে <span>→</span>
            </button>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Handler: Card-level photo upload
window.handleSpotPhotoCardUpload = async function(spotId, event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  try {
    const compressedBase64 = await compressImageFile(file, 640, 0.72);
    saveSpotPhoto(spotId, compressedBase64);
    renderSpotCards();
    renderMapMarkers();
  } catch (err) {
    console.error('Photo upload error', err);
    alert('ছবি প্রসেসিংয়ে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
  }
};

// Mobile Guide View Switcher (Map vs List)
window.setMobileGuideView = function(view) {
  const mapCol = document.getElementById('spotsMapColumn');
  const listCol = document.getElementById('spotsListColumn');
  const btnMap = document.getElementById('mobileViewToggleMap');
  const btnList = document.getElementById('mobileViewToggleList');

  if (view === 'map') {
    if (mapCol) {
      mapCol.classList.remove('hidden');
      mapCol.classList.add('flex');
    }
    if (listCol) {
      listCol.classList.remove('flex');
      listCol.classList.add('hidden');
    }
    if (btnMap) btnMap.className = 'flex-1 py-1.5 text-xs font-bold rounded-lg bg-white text-blue-700 shadow-2xs flex items-center justify-center gap-1';
    if (btnList) btnList.className = 'flex-1 py-1.5 text-xs font-bold rounded-lg text-slate-600 flex items-center justify-center gap-1';
    setTimeout(() => {
      if (map) map.invalidateSize();
    }, 120);
  } else {
    if (mapCol) {
      mapCol.classList.remove('flex');
      mapCol.classList.add('hidden');
    }
    if (listCol) {
      listCol.classList.remove('hidden');
      listCol.classList.add('flex');
    }
    if (btnMap) btnMap.className = 'flex-1 py-1.5 text-xs font-bold rounded-lg text-slate-600 flex items-center justify-center gap-1';
    if (btnList) btnList.className = 'flex-1 py-1.5 text-xs font-bold rounded-lg bg-white text-blue-700 shadow-2xs flex items-center justify-center gap-1';
  }
};

// Select Spot from Card: Fly to pin, highlight, open drawer
window.selectSpotFromCard = function(spotId) {
  const spot = SPOTS.find(s => s.id === spotId);
  if (!spot) return;

  if (window.innerWidth < 1024) {
    const mapCol = document.getElementById('spotsMapColumn');
    const listCol = document.getElementById('spotsListColumn');
    const btnMap = document.getElementById('mobileViewToggleMap');
    const btnList = document.getElementById('mobileViewToggleList');
    if (mapCol && listCol) {
      mapCol.classList.remove('hidden');
      mapCol.classList.add('flex');
      listCol.classList.remove('flex');
      listCol.classList.add('hidden');
      if (btnMap) btnMap.className = 'flex-1 py-1.5 text-xs font-bold rounded-lg bg-white text-blue-700 shadow-2xs flex items-center justify-center gap-1';
      if (btnList) btnList.className = 'flex-1 py-1.5 text-xs font-bold rounded-lg text-slate-600 flex items-center justify-center gap-1';
    }
  }

  if (map) {
    map.invalidateSize();
    map.flyTo([spot.lat, spot.lng], 14, {
      duration: 1.2,
      easeLinearity: 0.25
    });

    const targetMarker = mapMarkers.find(m => m.spotId === spotId);
    if (targetMarker) {
      setTimeout(() => {
        targetMarker.openPopup();
      }, 700);
    }
  }

  openSpotDrawer(spotId);
};

// Currently opened spot ID in drawer
let currentDrawerSpotId = null;

// Slide-Over Detail Drawer
window.openSpotDrawer = function(spotId) {
  const spot = SPOTS.find(s => s.id === spotId);
  if (!spot) return;

  currentDrawerSpotId = spotId;

  const catBadge = document.getElementById('drawerCategoryBadge');
  if (catBadge) catBadge.textContent = spot.categoryBn;
  const upazilaBadge = document.getElementById('drawerUpazilaBadge');
  if (upazilaBadge) upazilaBadge.textContent = spot.upazilaBn;
  const nameBnEl = document.getElementById('drawerSpotNameBn');
  if (nameBnEl) nameBnEl.textContent = spot.nameBn;
  const nameEnEl = document.getElementById('drawerSpotNameEn');
  if (nameEnEl) nameEnEl.textContent = spot.nameEn;
  const metaUpazila = document.getElementById('drawerMetaUpazila');
  if (metaUpazila) metaUpazila.textContent = spot.upazilaBn;
  const metaCoords = document.getElementById('drawerMetaCoords');
  if (metaCoords) metaCoords.textContent = `${spot.lat.toFixed(5)}, ${spot.lng.toFixed(5)}`;
  const spotDesc = document.getElementById('drawerSpotDesc');
  if (spotDesc) spotDesc.textContent = spot.description;
  const gmapsBtn = document.getElementById('drawerGmapsBtn');
  if (gmapsBtn) gmapsBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`;

  // Render hero image or gradient placeholder
  const heroContainer = document.getElementById('drawerHeroContainer');
  if (heroContainer) {
    heroContainer.innerHTML = getSpotThumbnailHtml(spot, true);
  }

  // Toggle remove photo button visibility
  const btnRemove = document.getElementById('drawerBtnRemovePhoto');
  if (btnRemove) {
    if (customSpotPhotos[spotId]) {
      btnRemove.classList.remove('hidden');
    } else {
      btnRemove.classList.add('hidden');
    }
  }

  // Close map popup if open
  if (map) {
    map.closePopup();
  }

  const backdrop = document.getElementById('spotDetailBackdrop');
  const drawer = document.getElementById('spotDetailDrawer');

  if (backdrop) {
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    backdrop.classList.add('opacity-100');
  }

  if (drawer) {
    drawer.classList.remove('translate-x-full');
    drawer.classList.add('translate-x-0');
    const scrollBody = drawer.querySelector('.custom-scrollbar');
    if (scrollBody) scrollBody.scrollTop = 0;
  }
};

window.closeSpotDrawer = function() {
  const backdrop = document.getElementById('spotDetailBackdrop');
  const drawer = document.getElementById('spotDetailDrawer');

  backdrop.classList.remove('opacity-100');
  backdrop.classList.add('opacity-0', 'pointer-events-none');

  drawer.classList.remove('translate-x-0');
  drawer.classList.add('translate-x-full');
  currentDrawerSpotId = null;
};

// Drawer Gallery Upload Handler
window.handleDrawerPhotoUpload = async function(event) {
  if (!currentDrawerSpotId) return;
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  try {
    const compressedBase64 = await compressImageFile(file, 640, 0.72);
    saveSpotPhoto(currentDrawerSpotId, compressedBase64);
    openSpotDrawer(currentDrawerSpotId); // re-render drawer
    renderSpotCards();
    renderMapMarkers();
  } catch (err) {
    console.error('Drawer upload error', err);
    alert('ছবি প্রসেসিংয়ে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
  }
};

window.handleDrawerPhotoRemove = function() {
  if (!currentDrawerSpotId) return;
  if (confirm('এই স্থানের আপলোডকৃত ছবিটি ডিলিট করতে চান?')) {
    removeSpotPhoto(currentDrawerSpotId);
    openSpotDrawer(currentDrawerSpotId); // re-render drawer
    renderSpotCards();
    renderMapMarkers();
  }
};

// Filters Handlers
window.setUpazilaFilter = function(upazilaId) {
  selectedUpazilaFilter = upazilaId;
  document.querySelectorAll('.upazila-pill').forEach(btn => {
    if (btn.getAttribute('data-upazila') === upazilaId) {
      btn.className = 'upazila-pill active shrink-0 px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-2xs';
    } else {
      btn.className = 'upazila-pill shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs';
    }
  });

  renderSpotCards();
  renderMapMarkers();
  fitAllMapBounds();
};

window.setCategoryFilter = function(cat) {
  selectedCategoryFilter = cat;
  document.querySelectorAll('.cat-pill').forEach(btn => {
    if (btn.getAttribute('data-cat') === cat) {
      btn.className = 'cat-pill active shrink-0 px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-2xs flex items-center gap-1';
    } else {
      btn.className = 'cat-pill shrink-0 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-xs flex items-center gap-1';
    }
  });

  renderSpotCards();
  renderMapMarkers();
  fitAllMapBounds();
};

window.applyFilters = function() {
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  currentSearchQuery = input.value.trim();

  if (currentSearchQuery.length > 0) {
    clearBtn.classList.remove('hidden');
  } else {
    clearBtn.classList.add('hidden');
  }

  renderSpotCards();
  renderMapMarkers();
};

window.clearSearch = function() {
  const input = document.getElementById('searchInput');
  input.value = '';
  applyFilters();
};

window.resetFiltersAndMap = function() {
  selectedUpazilaFilter = 'all';
  selectedCategoryFilter = 'all';
  currentSearchQuery = '';
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  const clearBtn = document.getElementById('clearSearchBtn');
  if (clearBtn) clearBtn.classList.add('hidden');

  setUpazilaFilter('all');
  setCategoryFilter('all');
  setMapLayer('google');
  if (map) {
    map.setView([25.6279, 88.6332], 11);
  }
};

// ==========================================
// TAB 2: DISTRICT TRACKER POSTER LOGIC
// ==========================================

function saveVisitedState() {
  try {
    localStorage.setItem(STORAGE_VISITED_KEY, JSON.stringify(Array.from(visitedUpazilas)));
  } catch (e) {
    console.warn(e);
  }
}

window.toggleUpazila = function(upazilaId) {
  if (visitedUpazilas.has(upazilaId)) {
    visitedUpazilas.delete(upazilaId);
  } else {
    visitedUpazilas.add(upazilaId);
  }
  saveVisitedState();
  syncTrackerUI();
};

window.selectAllUpazilas = function() {
  UPAZILAS.forEach(u => visitedUpazilas.add(u.id));
  saveVisitedState();
  syncTrackerUI();
};

window.clearAllUpazilas = function() {
  visitedUpazilas.clear();
  saveVisitedState();
  syncTrackerUI();
};

function syncTrackerUI() {
  const total = UPAZILAS.length;
  const count = visitedUpazilas.size;
  const percent = Math.round((count / total) * 100);

  // Update counters & progress
  const ratioEl = document.getElementById('trackerVisitedRatio');
  if (ratioEl) ratioEl.textContent = `${count}/${total}`;

  const percentLabel = document.getElementById('trackerPercentLabel');
  if (percentLabel) percentLabel.textContent = `${percent}%`;

  const bar = document.getElementById('trackerProgressBar');
  if (bar) bar.style.width = `${percent}%`;

  const visitedCountBadge = document.getElementById('visitedBadgeCount');
  if (visitedCountBadge) visitedCountBadge.textContent = `${count}টি সম্পন্ন`;

  const progressText = document.getElementById('trackerProgressText');
  if (progressText) {
    progressText.textContent = `১৩টি উপজেলার মধ্যে ${count}টি পরিদর্শন করেছেন (${percent}%)`;
  }

  // Traveler Rank Badge
  const badgeLevel = document.getElementById('trackerBadgeLevel');
  if (badgeLevel) {
    if (count === 0) {
      badgeLevel.textContent = 'নবাগত পর্যটক';
      badgeLevel.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200';
    } else if (count <= 4) {
      badgeLevel.textContent = 'ভ্রমণপিয়াসী';
      badgeLevel.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200';
    } else if (count <= 9) {
      badgeLevel.textContent = 'অভিজ্ঞ পরিব্রাজক';
      badgeLevel.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200';
    } else if (count < 13) {
      badgeLevel.textContent = 'দিনাজপুর এক্সপ্লোরার';
      badgeLevel.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200';
    } else {
      badgeLevel.textContent = 'দিনাজপুর মাস্টার চ্যাম্পিয়ন! 🏆';
      badgeLevel.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse';
    }
  }

  // Sync SVG Vector Map Elements
  UPAZILAS.forEach(u => {
    const groupEl = document.getElementById(`svg_${u.id}`);
    const markEl = document.getElementById(`mark_${u.id}`);
    if (groupEl) {
      const polygon = groupEl.querySelector('polygon');
      if (polygon) {
        if (visitedUpazilas.has(u.id)) {
          polygon.setAttribute('fill', 'url(#visitedGrad)');
          polygon.setAttribute('stroke', '#1d4ed8');
          polygon.setAttribute('stroke-width', '2.5');
        } else {
          polygon.setAttribute('fill', '#e2e8f0');
          polygon.setAttribute('stroke', '#94a3b8');
          polygon.setAttribute('stroke-width', '2');
        }
      }
    }
    if (markEl) {
      if (visitedUpazilas.has(u.id)) {
        markEl.classList.remove('hidden');
      } else {
        markEl.classList.add('hidden');
      }
    }
  });

  // Render Checklist
  renderTrackerChecklist();
}

function renderTrackerChecklist() {
  const container = document.getElementById('trackerChecklistContainer');
  if (!container) return;

  let html = '';
  UPAZILAS.forEach(u => {
    const isVisited = visitedUpazilas.has(u.id);
    const count = SPOTS.filter(s => s.upazilaId === u.id).length;
    html += `
      <div onclick="toggleUpazila('${u.id}')" class="p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${isVisited ? 'bg-blue-50/70 border-blue-300 text-blue-900 shadow-2xs' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}">
        <div class="flex items-center gap-2.5">
          <div class="w-4 h-4 rounded-md border flex items-center justify-center text-[10px] font-black ${isVisited ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'}">
            ${isVisited ? '✓' : ''}
          </div>
          <div>
            <h4 class="text-xs font-bold leading-tight">${u.nameBn}</h4>
            <span class="text-[10px] text-slate-400 font-normal">${u.nameEn} • ${count} টি স্পট</span>
          </div>
        </div>
        <span class="text-[10px] font-bold ${isVisited ? 'text-blue-700' : 'text-slate-400'}">
          ${isVisited ? 'দেখা হয়েছে' : 'বাকি আছে'}
        </span>
      </div>
    `;
  });

  container.innerHTML = html;
}

window.updateTravelerName = function(name) {
  try {
    localStorage.setItem('hangout_dinajpur_traveler_name', name);
  } catch (e) {
    console.warn(e);
  }
};

// Poster User Travel Profile Photo Upload
window.handleUserPhotoUpload = async function(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  try {
    const compressed = await compressImageFile(file, 300, 0.8);
    const imgEl = document.getElementById('userAvatarImg');
    const placeholderEl = document.getElementById('userAvatarPlaceholder');
    if (imgEl) {
      imgEl.src = compressed;
      imgEl.classList.remove('hidden');
    }
    if (placeholderEl) {
      placeholderEl.classList.add('hidden');
    }
    localStorage.setItem('hangout_dinajpur_user_avatar', compressed);
  } catch (err) {
    console.error('Avatar upload error', err);
  }
};

// Export Handlers: PDF & PNG/JPG
window.triggerPrintPoster = function() {
  window.print();
};

window.triggerDownloadImagePoster = function() {
  const posterEl = document.getElementById('printablePoster');
  if (!posterEl) return;

  const btn = document.getElementById('btnDownloadImage');
  const originalHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.innerHTML = '<span>⏳</span> তৈরি হচ্ছে...';
    btn.disabled = true;
  }

  // Use html2canvas to capture poster with high DPI
  if (typeof html2canvas !== 'undefined') {
    html2canvas(posterEl, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      const link = document.createElement('a');
      const travelerName = (document.getElementById('travelerNameInput')?.value || 'Traveler').trim().replace(/\s+/g, '-');
      link.download = `Hangout-Dinajpur-${travelerName}-Poster.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      if (btn) {
        btn.innerHTML = originalHtml;
        btn.disabled = false;
      }
    }).catch(err => {
      console.error('html2canvas error', err);
      alert('ইমেজ ডাউনলোড তৈরিতে সমস্যা হয়েছে। অনুগ্রহ করে PDF ডাউনলোড ব্যবহার করুন।');
      if (btn) {
        btn.innerHTML = originalHtml;
        btn.disabled = false;
      }
    });
  } else {
    window.print();
  }
};

// ==========================================
// TABS SWITCHER
// ==========================================
window.switchTab = function(tabName) {
  const viewMap = document.getElementById('viewMapGuide');
  const viewTracker = document.getElementById('viewTracker');

  const btnMapDesktop = document.getElementById('tabMapBtn');
  const btnTrackerDesktop = document.getElementById('tabTrackerBtn');
  const btnMapMobile = document.getElementById('tabMapBtnMobile');
  const btnTrackerMobile = document.getElementById('tabTrackerBtnMobile');

  if (tabName === 'map') {
    viewMap.classList.remove('hidden');
    viewTracker.classList.add('hidden');

    if (btnMapDesktop) {
      btnMapDesktop.className = 'px-4 py-1.5 rounded-lg text-xs font-bold transition-all bg-white text-blue-700 shadow-xs flex items-center gap-1.5';
      btnTrackerDesktop.className = 'px-4 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-600 hover:text-slate-900 flex items-center gap-1.5';
    }
    if (btnMapMobile) {
      btnMapMobile.className = 'py-1.5 text-center text-xs font-bold rounded-lg bg-white text-blue-700 shadow-xs flex items-center justify-center gap-1.5 transition-all';
      btnTrackerMobile.className = 'py-1.5 text-center text-xs font-bold rounded-lg text-slate-600 flex items-center justify-center gap-1.5 transition-all';
    }

    // Leaflet invalidateSize after tab shown
    setTimeout(() => {
      if (map) {
        map.invalidateSize();
      }
    }, 150);
  } else {
    viewMap.classList.add('hidden');
    viewTracker.classList.remove('hidden');

    if (btnMapDesktop) {
      btnMapDesktop.className = 'px-4 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-600 hover:text-slate-900 flex items-center gap-1.5';
      btnTrackerDesktop.className = 'px-4 py-1.5 rounded-lg text-xs font-bold transition-all bg-white text-blue-700 shadow-xs flex items-center gap-1.5';
    }
    if (btnMapMobile) {
      btnMapMobile.className = 'py-1.5 text-center text-xs font-bold rounded-lg text-slate-600 flex items-center justify-center gap-1.5 transition-all';
      btnTrackerMobile.className = 'py-1.5 text-center text-xs font-bold rounded-lg bg-white text-blue-700 shadow-xs flex items-center justify-center gap-1.5 transition-all';
    }

    syncTrackerUI();
  }
};

// ==========================================
// CREATOR PROJECT DESCRIPTION MODAL
// ==========================================
window.openHobbyModal = function() {
  const modal = document.getElementById('hobbyModal');
  const card = document.getElementById('hobbyModalCard');
  if (!modal) return;
  modal.classList.remove('opacity-0', 'pointer-events-none');
  modal.classList.add('opacity-100');
  if (card) {
    card.classList.remove('scale-95');
    card.classList.add('scale-100');
  }
};

window.closeHobbyModal = function() {
  const modal = document.getElementById('hobbyModal');
  const card = document.getElementById('hobbyModalCard');
  if (!modal) return;
  modal.classList.remove('opacity-100');
  modal.classList.add('opacity-0', 'pointer-events-none');
  if (card) {
    card.classList.remove('scale-100');
    card.classList.add('scale-95');
  }
};

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Set current date in poster
  const posterDateSpan = document.getElementById('posterDateSpan');
  if (posterDateSpan) {
    const today = new Date();
    posterDateSpan.textContent = today.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Restore saved traveler name
  try {
    const savedName = localStorage.getItem('hangout_dinajpur_traveler_name');
    if (savedName) {
      const nameInput = document.getElementById('travelerNameInput');
      if (nameInput) nameInput.value = savedName;
    }
  } catch (e) {
    console.warn(e);
  }

  // Restore saved traveler avatar
  try {
    const savedAvatar = localStorage.getItem('hangout_dinajpur_user_avatar');
    if (savedAvatar) {
      const avatarImg = document.getElementById('userAvatarImg');
      const placeholderEl = document.getElementById('userAvatarPlaceholder');
      if (avatarImg) {
        avatarImg.src = savedAvatar;
        avatarImg.classList.remove('hidden');
      }
      if (placeholderEl) {
        placeholderEl.classList.add('hidden');
      }
    }
  } catch (e) {
    console.warn(e);
  }

  renderCategoryCounts();
  renderUpazilaPills();
  renderSpotCards();
  initMap();
  syncTrackerUI();
});
