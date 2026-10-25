import React, { useState, useMemo } from 'react';
import {
  X,
  Phone,
  PhoneCall,
  ShieldAlert,
  Search,
  Copy,
  Check,
  Flame,
  HeartPulse,
  Landmark,
  Shield,
  HelpCircle,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { Language } from '../data/dinajpurData';

export interface EmergencyContact {
  id: string;
  category: 'national' | 'police' | 'medical' | 'fire' | 'admin';
  categoryLabelBn: string;
  categoryLabelEn: string;
  titleBn: string;
  titleEn: string;
  upazilaBn: string;
  upazilaEn: string;
  phone: string;
  altPhone?: string;
  descriptionBn: string;
  descriptionEn: string;
  is24Hours?: boolean;
  isTollFree?: boolean;
  priority?: boolean;
}

export const DINAJPUR_EMERGENCY_CONTACTS: EmergencyContact[] = [
  // National Lifelines (Priority)
  {
    id: 'nat-999',
    category: 'national',
    categoryLabelBn: 'জাতীয় জরুরি সেবা',
    categoryLabelEn: 'National Emergency',
    titleBn: 'জাতীয় জরুরি সেবা (৯৯৯)',
    titleEn: 'National Emergency Service (999)',
    upazilaBn: 'সারাদেশ ও দিনাজপুর',
    upazilaEn: 'Nationwide & Dinajpur',
    phone: '999',
    descriptionBn:
      'পুলিশ, অ্যাম্বুলেন্স ও ফায়ার সার্ভিসের জন্য তাৎক্ষণিক ২৪/৭ টোল-ফ্রি জরুরি কল।',
    descriptionEn:
      'Instant 24/7 toll-free emergency call for Police, Ambulance, and Fire Service.',
    is24Hours: true,
    isTollFree: true,
    priority: true,
  },
  {
    id: 'tourist-police-zone',
    category: 'police',
    categoryLabelBn: 'ট্যুরিস্ট পুলিশ',
    categoryLabelEn: 'Tourist Police',
    titleBn: 'ট্যুরিস্ট পুলিশ (দিনাজপুর ও রংপুর জোন)',
    titleEn: 'Tourist Police (Dinajpur & Rangpur Region)',
    upazilaBn: 'সকল দর্শনীয় স্থান (কান্তজিউ, রামসাগর, স্বপ্নপুরী)',
    upazilaEn: 'All Tourist Spots (Kantaji, Ramsagar, Swapnapuri)',
    phone: '01320-222222',
    altPhone: '01769-690740',
    descriptionBn:
      'পর্যটকদের নিরাপত্তা, প্রতারণা প্রতিরোধ, হারিয়ে যাওয়া সাহায্য ও সার্বক্ষণিক ট্যুরিস্ট পেট্রোল।',
    descriptionEn:
      'Tourist security, scam prevention, lost item assistance, and 24/7 tourist patrol.',
    is24Hours: true,
    priority: true,
  },
  {
    id: 'medical-college-emergency',
    category: 'medical',
    categoryLabelBn: 'হাসপাতাল জরুরি বিভাগ',
    categoryLabelEn: 'Hospital Emergency',
    titleBn: 'দিনাজপুর মেডিকেল কলেজ হাসপাতাল',
    titleEn: 'Dinajpur Medical College Hospital Emergency',
    upazilaBn: 'দিনাজপুর সদর',
    upazilaEn: 'Dinajpur Sadar',
    phone: '0531-65160',
    altPhone: '01712-421734',
    descriptionBn:
      'দিনাজপুরের প্রধান বিশেষায়িত সরকারি মেডিকেল কলেজ হাসপাতাল ও ২৪ ঘণ্টা জরুরি বিভাগ ও ট্রমা সেন্টার।',
    descriptionEn:
      'Premier tertiary government medical college hospital in Dinajpur with 24/7 Emergency & Trauma Center.',
    is24Hours: true,
    priority: true,
  },
  {
    id: 'fire-service-dinajpur-hq',
    category: 'fire',
    categoryLabelBn: 'ফায়ার সার্ভিস কন্ট্রোল',
    categoryLabelEn: 'Fire Service Control',
    titleBn: 'দিনাজপুর ফায়ার সার্ভিস ও সিভিল ডিফেন্স স্টেশন',
    titleEn: 'Dinajpur Fire Service & Civil Defence Station',
    upazilaBn: 'দিনাজপুর সদর ও জেলা',
    upazilaEn: 'Dinajpur Sadar & District',
    phone: '0531-63333',
    altPhone: '01730-002447',
    descriptionBn:
      'অগ্নিদুর্ঘটনা, সড়ক দুর্ঘটনা ও যে কোনো উদ্ধারকাজে তাৎক্ষণিক সাহায্য ও রেসকিউ টিম।',
    descriptionEn:
      'Instant fire accident, highway road rescue, and civil defence emergency dispatch.',
    is24Hours: true,
    priority: true,
  },

  // Police & Law Enforcement
  {
    id: 'police-control-room',
    category: 'police',
    categoryLabelBn: 'পুলিশ কন্ট্রোল রুম',
    categoryLabelEn: 'Police Control Room',
    titleBn: 'দিনাজপুর জেলা পুলিশ কন্ট্রোল রুম',
    titleEn: 'Dinajpur District Police Control Room',
    upazilaBn: 'দিনাজপুর জেলা',
    upazilaEn: 'Dinajpur District',
    phone: '01320-135998',
    altPhone: '0531-63022',
    descriptionBn:
      'দিনাজপুর জেলার কেন্দ্রীয় পুলিশ কন্ট্রোল রুম ও তাৎক্ষণিক পুলিশ ফোর্স সহায়তা।',
    descriptionEn:
      'Central Dinajpur District Police Control Room for immediate emergency deployment.',
    is24Hours: true,
  },
  {
    id: 'sp-office-dinajpur',
    category: 'police',
    categoryLabelBn: 'পুলিশ সুপার অফিস',
    categoryLabelEn: 'SP Office',
    titleBn: 'পুলিশ সুপার (SP) দিনাজপুর কার্যালয়',
    titleEn: 'Superintendent of Police (SP) Dinajpur Office',
    upazilaBn: 'দিনাজপুর জেলা',
    upazilaEn: 'Dinajpur District',
    phone: '01320-135900',
    altPhone: '0531-63001',
    descriptionBn:
      'দিনাজপুর জেলা পুলিশ সুপারের অফিশিয়াল যোগাযোগ ও ঊর্ধ্বতন নিরাপত্তা সেল।',
    descriptionEn:
      'Official contact for the Superintendent of Police Dinajpur and high-level security cell.',
    is24Hours: false,
  },
  {
    id: 'kotwali-thana',
    category: 'police',
    categoryLabelBn: 'থানা পুলিশ',
    categoryLabelEn: 'Thana Police',
    titleBn: 'কোতোয়ালী থানা (দিনাজপুর সদর)',
    titleEn: 'Kotwali Police Station (Dinajpur Sadar)',
    upazilaBn: 'দিনাজপুর সদর',
    upazilaEn: 'Dinajpur Sadar',
    phone: '01320-136100',
    altPhone: '0531-65123',
    descriptionBn:
      'দিনাজপুর সদর শহর, রামসাগর, রাজবাড়ি ও শহর সংলগ্ন এলাকার মূল থানা ও ডিউটি অফিসার।',
    descriptionEn:
      'Main police station for Dinajpur Sadar, Ramsagar, Rajbari, and municipal jurisdiction.',
    is24Hours: true,
  },
  {
    id: 'kaharole-thana',
    category: 'police',
    categoryLabelBn: 'থানা পুলিশ',
    categoryLabelEn: 'Thana Police',
    titleBn: 'কাহারোল থানা (কান্তজিউ ও নয়াবাদ মসজিদ এলাকা)',
    titleEn: 'Kaharole Police Station (Kantaji Temple Area)',
    upazilaBn: 'কাহারোল',
    upazilaEn: 'Kaharole',
    phone: '01320-136152',
    descriptionBn:
      'ঐতিহাসিক কান্তজিউ মন্দির, কান্তনগর মেলা ও নয়াবাদ মসজিদ এলাকার নিরাপত্তা থানা।',
    descriptionEn:
      'Police station covering historic Kantaji Temple and Nayabad Mosque area.',
    is24Hours: true,
  },
  {
    id: 'nawabganj-thana',
    category: 'police',
    categoryLabelBn: 'থানা পুলিশ',
    categoryLabelEn: 'Thana Police',
    titleBn: 'নবাবগঞ্জ থানা (স্বপ্নপুরী ও আশুরার বিল এলাকা)',
    titleEn: 'Nawabganj Police Station (Swapnapuri Area)',
    upazilaBn: 'নবাবগঞ্জ',
    upazilaEn: 'Nawabganj',
    phone: '01320-136282',
    descriptionBn:
      'স্বপ্নপুরী বিনোদন পার্ক, আশুরার বিল ও শালবন অঞ্চলের আইনশৃঙ্খলা ও পর্যটক নিরাপত্তা।',
    descriptionEn:
      'Police station for Swapnapuri Amusement Park, Ashurar Beel, and rural forest zone.',
    is24Hours: true,
  },
  {
    id: 'birganj-thana',
    category: 'police',
    categoryLabelBn: 'থানা পুলিশ',
    categoryLabelEn: 'Thana Police',
    titleBn: 'বীরগঞ্জ থানা (সিংড়া জাতীয় উদ্যান এলাকা)',
    titleEn: 'Birganj Police Station (Singra Forest Area)',
    upazilaBn: 'বীরগঞ্জ',
    upazilaEn: 'Birganj',
    phone: '01320-136178',
    descriptionBn:
      'সিংড়া শালবন ও বীরগঞ্জ উপজেলার আইনশৃঙ্খলা রক্ষা ও সাহায্য কেন্দ্র।',
    descriptionEn:
      'Police station for Singra National Forest and Birganj Upazila.',
    is24Hours: true,
  },
  {
    id: 'parbatipur-grp-thana',
    category: 'police',
    categoryLabelBn: 'রেলওয়ে পুলিশ (জিআরপি)',
    categoryLabelEn: 'Railway Police (GRP)',
    titleBn: 'পার্বতীপুর রেলওয়ে জংশন জিআরপি থানা',
    titleEn: 'Parbatipur Railway Junction GRP Police Station',
    upazilaBn: 'পার্বতীপুর',
    upazilaEn: 'Parbatipur',
    phone: '01320-136230',
    descriptionBn:
      'পার্বতীপুর বৃহত্তম রেলওয়ে জংশন ও ট্রেনের যাত্রী নিরাপত্তা ও সহায়তা ডেস্ক।',
    descriptionEn:
      'Railway police station at Parbatipur Railway Junction for train traveler security.',
    is24Hours: true,
  },
  {
    id: 'fulbari-thana',
    category: 'police',
    categoryLabelBn: 'থানা পুলিশ',
    categoryLabelEn: 'Thana Police',
    titleBn: 'ফুলবাড়ী থানা',
    titleEn: 'Fulbari Police Station',
    upazilaBn: 'ফুলবাড়ী',
    upazilaEn: 'Fulbari',
    phone: '01320-136256',
    descriptionBn:
      'ফুলবাড়ী শহর, কয়লাখনি এলাকা ও ছোট যমুনা নদীর আশপাশের পুলিশ স্টেশন।',
    descriptionEn:
      'Police station for Fulbari town, coalmine region, and surrounding areas.',
    is24Hours: true,
  },
  {
    id: 'cyber-crime-cell',
    category: 'police',
    categoryLabelBn: 'সাইবার ও প্রতারণা দমন',
    categoryLabelEn: 'Cyber & Scam Cell',
    titleBn: 'দিনাজপুর সাইবার ক্রাইম ও প্রতারণা তদন্ত সেল',
    titleEn: 'Dinajpur Cyber Crime & Fraud Investigation Cell',
    upazilaBn: 'দিনাজপুর জেলা',
    upazilaEn: 'Dinajpur District',
    phone: '01320-000888',
    altPhone: '01769-691522',
    descriptionBn:
      'অনলাইন প্রতারণা, ব্ল্যাকমেইলিং, ফেক প্রোফাইল ও আর্থিক জালিয়াতি রিপোর্ট করার বিশেষ পুলিশ ইউনিট।',
    descriptionEn:
      'Specialized unit for reporting online harassment, financial deceit, fake accounts, and scams.',
    is24Hours: true,
  },

  // Medical & Ambulance
  {
    id: 'general-hospital-250',
    category: 'medical',
    categoryLabelBn: 'জেনারেল হাসপাতাল',
    categoryLabelEn: 'General Hospital',
    titleBn: 'দিনাজপুর ২৫০ শয্যা জেনারেল হাসপাতাল',
    titleEn: 'Dinajpur 250-Bed General Hospital',
    upazilaBn: 'দিনাজপুর সদর',
    upazilaEn: 'Dinajpur Sadar',
    phone: '0531-65080',
    descriptionBn:
      'দিনাজপুর শহরের প্রাণকেন্দ্রে অবস্থিত সরকারি সদর জেনারেল হাসপাতাল।',
    descriptionEn:
      'District central government hospital located in the heart of Dinajpur city.',
    is24Hours: true,
  },
  {
    id: 'civil-surgeon-office',
    category: 'medical',
    categoryLabelBn: 'স্বাস্থ্য প্রশাসন',
    categoryLabelEn: 'Health Administration',
    titleBn: 'সিভিল সার্জন কার্যালয়, দিনাজপুর',
    titleEn: 'Civil Surgeon Office, Dinajpur',
    upazilaBn: 'দিনাজপুর জেলা',
    upazilaEn: 'Dinajpur District',
    phone: '0531-63162',
    descriptionBn:
      'দিনাজপুর জেলার স্বাস্থ্য সেবা সমন্বয় ও মহামারী/জরুরি স্বাস্থ্য নিয়ন্ত্রণ কক্ষ।',
    descriptionEn:
      'District health control center coordinating hospital services across Dinajpur.',
    is24Hours: false,
  },
  {
    id: 'red-crescent-ambulance',
    category: 'medical',
    categoryLabelBn: 'অ্যাম্বুলেন্স সার্ভিস',
    categoryLabelEn: 'Ambulance Service',
    titleBn: 'বাংলাদেশ রেড ক্রিসেন্ট সোসাইটি অ্যাম্বুলেন্স',
    titleEn: 'Bangladesh Red Crescent Society Ambulance',
    upazilaBn: 'দিনাজপুর ও সংলগ্ন এলাকা',
    upazilaEn: 'Dinajpur & Surrounding',
    phone: '01711-382902',
    descriptionBn:
      'জরুরি রোগী পরিবহন ও আইসিইউ/অক্সিজেন সাপোর্টযুক্ত বিশ্বস্ত অ্যাম্বুলেন্স সার্ভিস।',
    descriptionEn:
      'Reliable emergency ambulance transport with oxygen and ICU support.',
    is24Hours: true,
  },
  {
    id: 'alamin-ambulance-247',
    category: 'medical',
    categoryLabelBn: 'প্রাইভেট অ্যাম্বুলেন্স',
    categoryLabelEn: 'Private Ambulance',
    titleBn: 'আল-আমিন এম্বুলেন্স সার্ভিস দিনাজপুর (২৪ ঘণ্টা)',
    titleEn: 'Al-Amin 24/7 Ambulance Service Dinajpur',
    upazilaBn: 'দিনাজপুর ও ঢাকা ট্রিপ',
    upazilaEn: 'Dinajpur & Inter-District',
    phone: '01712-148181',
    altPhone: '01737-123456',
    descriptionBn:
      'দিনাজপুর থেকে ঢাকা বা বিভাগীয় শহরে জরুরি রোগী স্থানান্তরের জন্য ২৪ ঘণ্টা সার্ভিস।',
    descriptionEn:
      '24/7 ambulance service for local and interstate patient transfers to Dhaka or Rangpur.',
    is24Hours: true,
  },

  // Fire & Rescue Stations
  {
    id: 'kaharole-fire-station',
    category: 'fire',
    categoryLabelBn: 'ফায়ার স্টেশন',
    categoryLabelEn: 'Fire Station',
    titleBn: 'কাহারোল ফায়ার সার্ভিস স্টেশন',
    titleEn: 'Kaharole Fire Service Station',
    upazilaBn: 'কাহারোল',
    upazilaEn: 'Kaharole',
    phone: '01730-002448',
    descriptionBn:
      'কান্তজিউ মন্দির এলাকা ও কাহারোল উপজেলার জন্য তাৎক্ষণিক অগ্নিনির্বাপণ ও উদ্ধার।',
    descriptionEn:
      'Fire extinguishing and rescue station serving Kantaji Temple and Kaharole.',
    is24Hours: true,
  },
  {
    id: 'fulbari-fire-station',
    category: 'fire',
    categoryLabelBn: 'ফায়ার স্টেশন',
    categoryLabelEn: 'Fire Station',
    titleBn: 'ফুলবাড়ী ফায়ার স্টেশন',
    titleEn: 'Fulbari Fire Station',
    upazilaBn: 'ফুলবাড়ী',
    upazilaEn: 'Fulbari',
    phone: '01730-002450',
    descriptionBn:
      'ফুলবাড়ী ও মধ্যপাড়া খনি অঞ্চলের উদ্ধারকারী ও ফায়ার সার্ভিস স্টেশন।',
    descriptionEn:
      'Fire and rescue station for Fulbari and Madhyapara mining belt.',
    is24Hours: true,
  },
  {
    id: 'birganj-fire-station',
    category: 'fire',
    categoryLabelBn: 'ফায়ার স্টেশন',
    categoryLabelEn: 'Fire Station',
    titleBn: 'বীরগঞ্জ ফায়ার সার্ভিস স্টেশন',
    titleEn: 'Birganj Fire Service Station',
    upazilaBn: 'বীরগঞ্জ',
    upazilaEn: 'Birganj',
    phone: '01730-002449',
    descriptionBn: 'বীরগঞ্জ মহাসড়ক ও সংলগ্ন উপজেলার জরুরি রেসকিউ স্টেশন।',
    descriptionEn: 'Highway rescue and emergency fire service for Birganj.',
    is24Hours: true,
  },

  // Administration & Public Support
  {
    id: 'dc-office-dinajpur',
    category: 'admin',
    categoryLabelBn: 'জেলা প্রশাসন',
    categoryLabelEn: 'District Administration',
    titleBn: 'জেলা প্রশাসক (DC) দিনাজপুর হেল্পডেস্ক',
    titleEn: 'Deputy Commissioner (DC) Dinajpur Helpdesk',
    upazilaBn: 'দিনাজপুর জেলা',
    upazilaEn: 'Dinajpur District',
    phone: '0531-63330',
    altPhone: '01713-200100',
    descriptionBn:
      'দিনাজপুর জেলা প্রশাসনের কেন্দ্রীয় হেল্পডেস্ক, তথ্য কেন্দ্র ও নাগরিক সহায়তা।',
    descriptionEn:
      'Central administrative helpdesk for citizen inquiries and district governance.',
    is24Hours: false,
  },
  {
    id: 'nat-333',
    category: 'admin',
    categoryLabelBn: 'সরকারি সেবা হেল্পলাইন',
    categoryLabelEn: 'Govt Service Helpline',
    titleBn: 'জাতীয় তথ্য ও সেবা হেল্পলাইন (৩৩৩)',
    titleEn: 'National Citizen Service Helpline (333)',
    upazilaBn: 'সারাদেশ ও দিনাজপুর',
    upazilaEn: 'Nationwide & Dinajpur',
    phone: '333',
    descriptionBn:
      'জেলা প্রশাসন, সামাজিক সমস্যা প্রতিকার, সরকারি কর্মকর্তা ও সেবার তথ্য পাওয়ার কল সেন্টার।',
    descriptionEn:
      'Citizen call center for district government services, grievance redress, and officer contacts.',
    is24Hours: true,
    isTollFree: false,
  },
  {
    id: 'women-child-109',
    category: 'admin',
    categoryLabelBn: 'নারী ও শিশু সুরক্ষা',
    categoryLabelEn: 'Women & Child Helpline',
    titleBn: 'নারী ও শিশু নির্যাতন প্রতিরোধ হেল্পলাইন (১০৯)',
    titleEn: 'National Helpline for Violence Against Women & Children (109)',
    upazilaBn: 'সারাদেশ ও দিনাজপুর',
    upazilaEn: 'Nationwide & Dinajpur',
    phone: '109',
    descriptionBn:
      'যেকোনো হয়রানি, ইভটিজিং, নির্যাতন ও সহিংসতার শিকার নারী ও শিশুদের তাৎক্ষণিক টোল-ফ্রি সুরক্ষা।',
    descriptionEn:
      'Instant toll-free emergency support for women and children facing harassment or violence.',
    is24Hours: true,
    isTollFree: true,
  },
  {
    id: 'dudok-106',
    category: 'admin',
    categoryLabelBn: 'দুর্নীতি ও জালিয়াতি রোধ',
    categoryLabelEn: 'Anti-Corruption & Fraud',
    titleBn: 'দুদক হটলাইন ও জালিয়াতি রিপোর্ট (১০৬)',
    titleEn: 'Anti-Corruption & Fraud Helpline (106)',
    upazilaBn: 'সারাদেশ ও দিনাজপুর',
    upazilaEn: 'Nationwide & Dinajpur',
    phone: '106',
    descriptionBn:
      'ঘুষ, আর্থিক জালিয়াতি, প্রতারণা ও সরকারি দপ্তরের দুর্নীতি রিপোর্ট করার টোল-ফ্রি নম্বর।',
    descriptionEn:
      'Toll-free hotline for reporting financial fraud, bribery, deceit, and corruption.',
    is24Hours: true,
    isTollFree: true,
  },
  {
    id: 'dinajpur-railway-station',
    category: 'admin',
    categoryLabelBn: 'রেলওয়ে ইনকোয়ারি',
    categoryLabelEn: 'Railway Inquiry',
    titleBn: 'দিনাজপুর রেলওয়ে স্টেশন মাস্টার ও তথ্য ডেস্ক',
    titleEn: 'Dinajpur Railway Station Master & Inquiry Desk',
    upazilaBn: 'দিনাজপুর সদর',
    upazilaEn: 'Dinajpur Sadar',
    phone: '0531-63200',
    descriptionBn:
      'একতা, দ্রুতযান ও বাংলাবান্ধা এক্সপ্রেস ট্রেনের সময়সূচী, আসন ও বিলম্ব সম্পর্কিত তথ্য।',
    descriptionEn:
      'Information desk for Dinajpur train schedules (Ekota, Drutojan, Banglabandha Express).',
    is24Hours: true,
  },
  {
    id: 'parjatan-motel-desk',
    category: 'admin',
    categoryLabelBn: 'পর্যটন মোটেল',
    categoryLabelEn: 'Parjatan Motel',
    titleBn: 'বাংলাদেশ পর্যটন মোটেল দিনাজপুর হেল্পডেস্ক',
    titleEn: 'Bangladesh Parjatan Motel Dinajpur Front Desk',
    upazilaBn: 'দিনাজপুর সদর',
    upazilaEn: 'Dinajpur Sadar',
    phone: '0531-64718',
    altPhone: '01991-139027',
    descriptionBn:
      'দিনাজপুর পর্যটন মোটেলের রুম বুকিং, ভ্রমণ গাইড ও নিরাপদ পর্যটক থাকার সুবিধা।',
    descriptionEn:
      'Government tourist motel front desk for verified lodging, guide inquiries, and tourist rest.',
    is24Hours: true,
  },
  {
    id: 'electricity-emergency',
    category: 'admin',
    categoryLabelBn: 'বিদ্যুৎ জরুরি অভিযোগ',
    categoryLabelEn: 'Electricity Emergency',
    titleBn: 'নেসকো ও পল্লী বিদ্যুৎ জরুরি সেল (১৬৯৯৯)',
    titleEn: 'NESCO & Palli Bidyut Emergency Helpline (16999)',
    upazilaBn: 'দিনাজপুর জেলা',
    upazilaEn: 'Dinajpur District',
    phone: '16999',
    descriptionBn:
      'বিদ্যুৎ বিপর্যয়, তার ছিঁড়ে পড়া ও বিদ্যুৎ সংক্রান্ত যে কোনো বিপজ্জনক পরিস্থিতি রিপোর্ট করার কেন্দ্রীয় হটলাইন।',
    descriptionEn:
      'Central power outage, fallen live wires, and electrical hazard emergency hotline.',
    is24Hours: true,
    isTollFree: false,
  },
];

interface EmergencyHelplineModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onShowToast?: (msg: string) => void;
}

export function EmergencyHelplineModal({
  isOpen,
  onClose,
  lang,
  onShowToast,
}: EmergencyHelplineModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'priority' | 'national' | 'police' | 'medical' | 'fire' | 'admin'
  >('all');
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (phone: string, title: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    if (onShowToast) {
      onShowToast(
        lang === 'bn'
          ? `নম্বর কপি হয়েছে: ${phone} (${title})`
          : `Copied number: ${phone} (${title})`
      );
    }
    setTimeout(() => {
      setCopiedPhone(null);
    }, 2500);
  };

  const filteredContacts = DINAJPUR_EMERGENCY_CONTACTS.filter((c) => {
    if (selectedCategory === 'priority') {
      if (!c.priority) return false;
    } else if (selectedCategory !== 'all' && c.category !== selectedCategory) {
      return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.titleBn.toLowerCase().includes(q) ||
      c.titleEn.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      (c.altPhone && c.altPhone.toLowerCase().includes(q)) ||
      c.upazilaBn.toLowerCase().includes(q) ||
      c.upazilaEn.toLowerCase().includes(q) ||
      c.categoryLabelBn.toLowerCase().includes(q) ||
      c.categoryLabelEn.toLowerCase().includes(q) ||
      c.descriptionBn.toLowerCase().includes(q) ||
      c.descriptionEn.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-[2250] flex items-center justify-center p-3 sm:p-5 bg-slate-950/65 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      {/* Modal Container: Matched to Hangout Dinajpur Heritage Theme */}
      <div
        className="bg-[#FBF9F5] rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E5E0D5] overflow-hidden relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="emergency-modal-title"
      >
        {/* Modal Top Header (Signature Bengal Forest Emerald Theme #046a4e) */}
        <div className="bg-[#046a4e] p-4 sm:p-6 text-white shrink-0 relative border-b border-emerald-800/60 shadow-xs">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/25 shrink-0 shadow-xs">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-emerald-100 text-[11px] font-bold tracking-wide mb-1 border border-white/20">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-80" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-400" />
                </span>
                <span>
                  {lang === 'bn'
                    ? '২৪/৭ সার্বক্ষণিক জরুরি সাপোর্ট'
                    : '24/7 Dinajpur Emergency Lifeline'}
                </span>
              </div>
              <h2
                id="emergency-modal-title"
                className="text-lg sm:text-2xl font-black tracking-tight text-white"
              >
                {lang === 'bn'
                  ? 'দিনাজপুর জরুরি হেল্পলাইন ও সাপোর্ট'
                  : 'Dinajpur Emergency Helpline & Support'}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 font-medium mt-0.5 line-clamp-1">
                {lang === 'bn'
                  ? 'পুলিশ, হাসপাতাল, অ্যাম্বুলেন্স, ফায়ার সার্ভিস ও ট্যুরিস্ট হেল্পডেস্ক'
                  : 'Police, Hospitals, Ambulances, Fire Service & Tourist Safety'}
              </p>
            </div>
          </div>

          {/* Quick 1-Tap Dialing Ribbon for Top 4 Lifelines */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3.5 border-t border-white/15">
            <a
              href="tel:999"
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white text-slate-900 shadow-2xs hover:bg-rose-50/70 border border-emerald-900/10 transition-all font-black text-xs hover:scale-[1.02]"
            >
              <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-500 font-bold uppercase leading-none">
                  {lang === 'bn' ? 'জাতীয় জরুরি' : 'National'}
                </div>
                <div className="text-sm font-black text-rose-700">৯৯৯ (999)</div>
              </div>
            </a>

            <a
              href="tel:01320222222"
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white text-slate-900 shadow-2xs hover:bg-emerald-50/70 border border-emerald-900/10 transition-all font-black text-xs hover:scale-[1.02]"
            >
              <div className="w-7 h-7 rounded-lg bg-[#046a4e] text-white flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-500 font-bold uppercase leading-none">
                  {lang === 'bn' ? 'ট্যুরিস্ট পুলিশ' : 'Tourist Police'}
                </div>
                <div className="text-xs font-black text-emerald-900 truncate">
                  01320-222222
                </div>
              </div>
            </a>

            <a
              href="tel:053165160"
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white text-slate-900 shadow-2xs hover:bg-teal-50/70 border border-emerald-900/10 transition-all font-black text-xs hover:scale-[1.02]"
            >
              <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-500 font-bold uppercase leading-none">
                  {lang === 'bn' ? 'মেডিকেল জরুরি' : 'Hospital'}
                </div>
                <div className="text-xs font-black text-teal-900 truncate">
                  0531-65160
                </div>
              </div>
            </a>

            <a
              href="tel:053163333"
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white text-slate-900 shadow-2xs hover:bg-amber-50/70 border border-emerald-900/10 transition-all font-black text-xs hover:scale-[1.02]"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-500 font-bold uppercase leading-none">
                  {lang === 'bn' ? 'ফায়ার সার্ভিস' : 'Fire Service'}
                </div>
                <div className="text-xs font-black text-amber-900 truncate">
                  0531-63333
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Filter and Search Bar: Sand Palette #EBE8E0 matching the site's top pill bar */}
        <div className="p-3.5 sm:p-4 bg-[#EBE8E0]/70 border-b border-slate-200/80 space-y-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'bn'
                  ? 'থানা, হাসপাতাল, ফায়ার স্টেশন বা উপজেলার নাম দিয়ে খুঁজুন...'
                  : 'Search by police, hospital, fire service, or upazila...'
              }
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 bg-white border border-slate-200/90 rounded-xl focus:border-[#046a4e] focus:ring-1 focus:ring-[#046a4e] focus:outline-none shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Chips Styled as Warm Heritage Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#046a4e] text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-[#F3F0E8]'
              }`}
            >
              {lang === 'bn' ? 'সব নম্বর (২১+)' : 'All Numbers (21+)'}
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('priority')}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
                selectedCategory === 'priority'
                  ? 'bg-rose-700 text-white shadow-2xs'
                  : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>{lang === 'bn' ? 'অতি জরুরি' : 'Critical'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('police')}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
                selectedCategory === 'police'
                  ? 'bg-[#046a4e] text-white shadow-2xs'
                  : 'bg-white text-[#046a4e] border border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#046a4e] shrink-0" />
              <span>{lang === 'bn' ? 'পুলিশ ও নিরাপত্তা' : 'Police'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('medical')}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
                selectedCategory === 'medical'
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-white text-teal-800 border border-teal-200 hover:bg-teal-50'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5 text-teal-700 shrink-0" />
              <span>{lang === 'bn' ? 'হাসপাতাল ও এম্বুলেন্স' : 'Medical'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('fire')}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
                selectedCategory === 'fire'
                  ? 'bg-amber-700 text-white shadow-2xs'
                  : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>{lang === 'bn' ? 'ফায়ার সার্ভিস' : 'Fire Rescue'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('admin')}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
                selectedCategory === 'admin'
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span>{lang === 'bn' ? 'প্রশাসন ও তথ্য' : 'Administration'}</span>
            </button>
          </div>
        </div>

        {/* Contact List Body: Warm Ivory Background #FBF9F5 */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#FBF9F5]">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12 space-y-2 bg-white rounded-2xl border border-slate-200 p-6">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">
                {lang === 'bn'
                  ? 'কোনো হেল্পলাইন নম্বর পাওয়া যায়নি।'
                  : 'No matching helpline found.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-xs font-bold text-[#046a4e] hover:underline cursor-pointer"
              >
                {lang === 'bn' ? 'সব নম্বর আবার দেখুন' : 'View all numbers'}
              </button>
            </div>
          ) : (
            filteredContacts.map((contact) => {
              const isCopied = copiedPhone === contact.phone;

              return (
                <div
                  key={contact.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                    contact.priority
                      ? 'bg-white border-2 border-emerald-700/35 hover:border-emerald-700 shadow-xs'
                      : 'bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Info Column */}
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            contact.category === 'national'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : contact.category === 'police'
                              ? 'bg-emerald-100 text-[#046a4e] border border-emerald-200'
                              : contact.category === 'medical'
                              ? 'bg-teal-100 text-teal-800 border border-teal-200'
                              : contact.category === 'fire'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {lang === 'bn'
                            ? contact.categoryLabelBn
                            : contact.categoryLabelEn}
                        </span>

                        <span className="text-[11px] font-bold text-slate-500">
                          📍{' '}
                          {lang === 'bn'
                            ? contact.upazilaBn
                            : contact.upazilaEn}
                        </span>

                        {contact.is24Hours && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            {lang === 'bn' ? '২৪ ঘণ্টা' : '24/7 Active'}
                          </span>
                        )}

                        {contact.isTollFree && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            {lang === 'bn' ? 'টোল-ফ্রি' : 'Toll-Free'}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                        {lang === 'bn' ? contact.titleBn : contact.titleEn}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {lang === 'bn'
                          ? contact.descriptionBn
                          : contact.descriptionEn}
                      </p>
                    </div>

                    {/* Action Column: Call & Copy */}
                    <div className="flex items-center sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <a
                        href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}
                        className={`flex-1 sm:w-full px-4 py-2 rounded-xl text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer whitespace-nowrap ${
                          contact.category === 'national'
                            ? 'bg-rose-600 hover:bg-rose-700'
                            : 'bg-[#046a4e] hover:bg-[#03533d]'
                        }`}
                        title={
                          lang === 'bn'
                            ? `সরাসরি কল করুন ${contact.phone}`
                            : `Call now ${contact.phone}`
                        }
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{contact.phone}</span>
                      </a>

                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            contact.phone,
                            lang === 'bn' ? contact.titleBn : contact.titleEn
                          )
                        }
                        className="px-3 py-2 rounded-xl bg-[#EBE8E0]/70 hover:bg-[#EBE8E0] text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap border border-slate-200/60"
                        title={
                          lang === 'bn' ? 'নম্বর কপি করুন' : 'Copy phone number'
                        }
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#046a4e]" />
                            <span className="text-[#046a4e] text-[11px] font-black">
                              {lang === 'bn' ? 'কপি হয়েছে' : 'Copied'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-[11px]">
                              {lang === 'bn' ? 'কপি' : 'Copy'}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {contact.altPhone && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">
                        {lang === 'bn' ? 'বিকল্প নম্বর:' : 'Alternative:'}{' '}
                        <strong className="text-slate-800">
                          {contact.altPhone}
                        </strong>
                      </span>
                      <a
                        href={`tel:${contact.altPhone.replace(/[^0-9]/g, '')}`}
                        className="text-[#046a4e] hover:underline font-bold inline-flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{lang === 'bn' ? 'কল করুন' : 'Dial'}</span>
                      </a>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Traveler Security & Scam Advisory Notice: Warm Heritage Sand Accent */}
          <div className="mt-4 p-4 rounded-2xl bg-[#EBE8E0]/60 border border-amber-300/60 text-slate-800 text-xs leading-relaxed space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-2 font-black text-amber-950">
              <ShieldAlert className="w-4 h-4 text-[#046a4e]" />
              <span>
                {lang === 'bn'
                  ? 'পর্যটক নিরাপত্তা ও সহায়তা পরামর্শ'
                  : 'Tourist Safety & Assistance Advisory'}
              </span>
            </div>
            <p className="text-slate-700 text-[11px] leading-relaxed">
              {lang === 'bn'
                ? 'দিনাজপুরের যেকোনো স্পটে বাড়তি ভাড়া দাবি, প্রতারণা, হেনস্তা বা হারিয়ে যাওয়া ঘটনায় অবিলম্বে ট্যুরিস্ট পুলিশ (01320-222222) বা জাতীয় হেল্পলাইন ৯৯৯-এ কল করুন। ব্যক্তিগত গোপন তথ্য, পিন ও ওটিপি কারো সাথে শেয়ার করবেন না।'
                : 'In case of harassment, excessive pricing, or deceit at any tourist site, immediately contact the Tourist Police (01320-222222) or National Helpline 999. Never share sensitive OTPs or financial passwords.'}
            </p>
          </div>
        </div>

        {/* Modal Bottom Footer: Clean Ivory / White with Emerald Action Button */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
            {lang === 'bn'
              ? 'দিনাজপুর জেলা প্রশাসন ও বাংলাদেশ পুলিশ কর্তৃক সার্বক্ষণিক সেবাদান নিশ্চিতকৃত।'
              : 'Emergency dispatch supported by Dinajpur District Administration & Police.'}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#046a4e] hover:bg-[#03533d] text-white font-extrabold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer ml-auto"
          >
            {lang === 'bn' ? 'বন্ধ করুন (Close)' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
