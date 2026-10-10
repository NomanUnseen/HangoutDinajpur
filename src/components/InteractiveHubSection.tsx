import React, { useState, useEffect, useMemo } from 'react';
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import {
  Trophy,
  Compass,
  Utensils,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  MapPin,
  Clock,
  Wallet,
  Navigation,
  Users,
  Eye,
  X,
  Download,
  Award,
  Flame,
  ChevronRight,
  Plus,
  Trash2,
  Route,
  BedDouble,
  Camera,
  User,
  Image as ImageIcon,
  ExternalLink,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { db } from '../firebase';
import {
  Language,
  formatNumber,
  UPAZILAS,
  SPOTS,
  Upazila,
  TouristSpot,
  KANTAJI_IMAGE,
  RAMSAGAR_IMAGE,
  RAJBARI_IMAGE,
} from '../data/dinajpurData';

// ============================================================================
// UPAZILA GEOGRAPHIC COORDINATES & STAY INFO FOR SHORTEST-ROUTE TRIP PLANNER
// ============================================================================
interface UpazilaMeta {
  lat: number;
  lng: number;
  neighbors: string[];
  stayBn: string;
  stayEn: string;
  foodTipBn: string;
  foodTipEn: string;
  baseDailyCostBdt: number;
}

const UPAZILA_PLANNER_META: Record<string, UpazilaMeta> = {
  sadar: {
    lat: 25.6279,
    lng: 88.6332,
    neighbors: ['biral', 'kaharole', 'chirirbandar', 'fulbari'],
    stayBn: 'দিনাজপুর সদর (পর্যটন মোটেল / হোটেল ডায়মন্ড / মৃগয়া)',
    stayEn: 'Dinajpur Sadar (Parjatan Motel / Hotel Diamond / Mrigaya)',
    foodTipBn: 'কালীতলার বুটের হালুয়া, মালদহপট্টির মিষ্টি ও বাহাদুর বাজারের কাটারিভোগ চিড়া',
    foodTipEn: 'Kalitala Chickpea Halwa, Maldahpatti Sweets & Bahadur Bazar Kataribhog Chira',
    baseDailyCostBdt: 1450,
  },
  kaharole: {
    lat: 25.7925,
    lng: 88.6755,
    neighbors: ['sadar', 'birganj', 'bochaganj', 'khansama'],
    stayBn: 'দিনাজপুর সদর বা কান্তনগর রেস্ট হাউস (২১.৫ কিমি)',
    stayEn: 'Dinajpur Sadar or Kantanagar Rest House (21.5 km)',
    foodTipBn: 'কান্তনগর মেলা প্রাঙ্গণের গ্রামীণ মিষ্টান্ন ও ক্ষীরসা',
    foodTipEn: 'Traditional village sweets and khirsha near Kantanagar temple',
    baseDailyCostBdt: 1150,
  },
  birganj: {
    lat: 25.8872,
    lng: 88.6553,
    neighbors: ['kaharole', 'khansama', 'bochaganj', 'sadar'],
    stayBn: 'বীরগঞ্জ ডাকবাংলো বা দিনাজপুর সদর (২৮.৫ কিমি)',
    stayEn: 'Birganj Dakbungalow or Dinajpur Sadar (28.5 km)',
    foodTipBn: 'সিংড়া শালবনের পাশে স্থানীয় দেশি মুরগির ঝোল ও কাটারিভোগ ভাত',
    foodTipEn: 'Local country chicken curry & aromatic Kataribhog rice near Singra Forest',
    baseDailyCostBdt: 1200,
  },
  khansama: {
    lat: 25.9212,
    lng: 88.7425,
    neighbors: ['birganj', 'kaharole', 'chirirbandar', 'parbatipur'],
    stayBn: 'খানসামা উপজেলা গেস্ট হাউস বা দিনাজপুর সদর (৩৬.৪ কিমি)',
    stayEn: 'Khansama Upazila Guest House or Dinajpur Sadar (36.4 km)',
    foodTipBn: 'পাকেরহাটের তাজা ছানার মিষ্টি ও গ্রামীণ পিঠা',
    foodTipEn: 'Fresh chhana sweets and rural cakes at Pakerhat',
    baseDailyCostBdt: 1100,
  },
  bochaganj: {
    lat: 25.8012,
    lng: 88.4615,
    neighbors: ['biral', 'kaharole', 'birganj', 'sadar'],
    stayBn: 'সেতাবগঞ্জ গেস্ট হাউস বা দিনাজপুর সদর (২৯.৬ কিমি)',
    stayEn: 'Setabganj Guest House or Dinajpur Sadar (29.6 km)',
    foodTipBn: 'সেতাবগঞ্জের ঐতিহ্যবাহী গুড়ের মিষ্টান্ন ও দই',
    foodTipEn: 'Setabganj traditional molasses sweets and yogurt',
    baseDailyCostBdt: 1100,
  },
  biral: {
    lat: 25.6195,
    lng: 88.5452,
    neighbors: ['sadar', 'bochaganj', 'kaharole'],
    stayBn: 'দিনাজপুর সদর (বিরল থেকে ১২.৫ কিমি)',
    stayEn: 'Dinajpur Sadar (12.5 km from Biral)',
    foodTipBn: 'মাশিমপুরের বিশ্বখ্যাত বেদানা ও চায়না-৩ লিচু (মৌসুমে)',
    foodTipEn: 'Mashimpur’s world-famous Bedana & China-3 Lychees (in season)',
    baseDailyCostBdt: 1100,
  },
  chirirbandar: {
    lat: 25.6632,
    lng: 88.7812,
    neighbors: ['sadar', 'parbatipur', 'khansama', 'fulbari'],
    stayBn: 'দিনাজপুর সদর বা পার্বতীপুর (১৯.২ কিমি)',
    stayEn: 'Dinajpur Sadar or Parbatipur (19.2 km)',
    foodTipBn: 'চিরিরবন্দরের আসল সুগন্ধি কাটারিভোগ চাল ও দই-চিড়া',
    foodTipEn: 'Authentic Chirirbandar Kataribhog rice and yogurt-chira',
    baseDailyCostBdt: 1100,
  },
  parbatipur: {
    lat: 25.6632,
    lng: 88.9185,
    neighbors: ['chirirbandar', 'fulbari', 'khansama', 'sadar'],
    stayBn: 'পার্বতীপুর রেলওয়ে জংশন রেস্ট হাউস / হোটেল (৩১.৫ কিমি)',
    stayEn: 'Parbatipur Railway Junction Rest House / Local Hotel (31.5 km)',
    foodTipBn: 'পার্বতীপুর স্টেশনের ঐতিহ্যবাহী স্পঞ্জ মিষ্টি ও মালাই চা',
    foodTipEn: 'Famous sponge rasgolla and malai tea at Parbatipur Junction',
    baseDailyCostBdt: 1250,
  },
  fulbari: {
    lat: 25.4982,
    lng: 88.9485,
    neighbors: ['parbatipur', 'chirirbandar', 'birampur', 'nawabganj', 'sadar'],
    stayBn: 'ফুলবাড়ী আবাসিক হোটেল বা স্বপ্নপুরী রিসোর্ট (দিনাজপুর থেকে ৪০.৮ কিমি)',
    stayEn: 'Fulbari Hotel or Swapnapuri Resort (40.8 km from Dinajpur)',
    foodTipBn: 'ফুলবাড়ী বাজারের গরম সিঙ্গারা ও ছানার জিলাপি',
    foodTipEn: 'Hot samosas and chhana jalebi at Fulbari Bazaar',
    baseDailyCostBdt: 1200,
  },
  birampur: {
    lat: 25.3925,
    lng: 88.9852,
    neighbors: ['fulbari', 'nawabganj', 'hakimpur'],
    stayBn: 'বিরামপুর গেস্ট হাউস বা স্বপ্নপুরী কটেজ (দিনাজপুর থেকে ৫৪.৫ কিমি)',
    stayEn: 'Birampur Guest House or Swapnapuri Cottage (54.5 km from Dinajpur)',
    foodTipBn: 'বিরামপুরের স্থানীয় নদীর তাজা মাছ ও দই',
    foodTipEn: 'Fresh local river fish curry and sweet curd in Birampur',
    baseDailyCostBdt: 1200,
  },
  nawabganj: {
    lat: 25.4325,
    lng: 89.0628,
    neighbors: ['birampur', 'fulbari', 'ghoraghat', 'hakimpur'],
    stayBn: 'স্বপ্নপুরী ভিআইপি রেস্ট হাউস ও কটেজ, নবাবগঞ্জ (৬৫.২ কিমি)',
    stayEn: 'Swapnapuri VIP Rest House & Resort Cottages, Nawabganj (65.2 km)',
    foodTipBn: 'আশুরার বিলের দেশি মাছ ও স্বপ্নপুরীর পিকনিক স্পেশাল খাবার',
    foodTipEn: 'Freshwater fish from Ashurar Beel & local delicacies',
    baseDailyCostBdt: 1400,
  },
  hakimpur: {
    lat: 25.2795,
    lng: 89.0172,
    neighbors: ['birampur', 'nawabganj', 'ghoraghat'],
    stayBn: 'হিলি স্থলবন্দর আবাসিক হোটেল বা বিরামপুর (৬৮.৪ কিমি)',
    stayEn: 'Hili Land Port Residential Hotel or Birampur (68.4 km)',
    foodTipBn: 'হিলি সীমান্তের স্পেশাল মশলা চা, পান ও ভারতীয় স্ন্যাকস',
    foodTipEn: 'Hili border special masala tea and snacks',
    baseDailyCostBdt: 1250,
  },
  ghoraghat: {
    lat: 25.2485,
    lng: 89.2165,
    neighbors: ['nawabganj', 'hakimpur', 'birampur'],
    stayBn: 'ঘোড়াঘাট ডাকবাংলো বা নবাবগঞ্জ স্বপ্নপুরী কটেজ (৮৪.৫ কিমি)',
    stayEn: 'Ghoraghat Dakbungalow or Nawabganj Swapnapuri Cottage (84.5 km)',
    foodTipBn: 'করতোয়া নদীর তাজা মাছ ও ঘোড়াঘাটের ক্ষীরসা',
    foodTipEn: 'Karatoya river fish and traditional Ghoraghat khirsha',
    baseDailyCostBdt: 1200,
  },
};

// Verified Google Maps / RHD Highway Road Distances (in km) between all 13 Upazilas of Dinajpur
const EXACT_UPAZILA_ROAD_KM: Record<string, Record<string, number>> = {
  sadar: {
    sadar: 0,
    biral: 12.5,
    chirirbandar: 19.2,
    kaharole: 21.5,
    birganj: 28.5,
    bochaganj: 29.6,
    parbatipur: 31.5,
    khansama: 36.4,
    fulbari: 40.8,
    birampur: 54.5,
    nawabganj: 65.2,
    hakimpur: 68.4,
    ghoraghat: 84.5,
  },
  biral: {
    biral: 0,
    sadar: 12.5,
    bochaganj: 18.2,
    kaharole: 26.4,
    chirirbandar: 31.5,
    birganj: 35.0,
    parbatipur: 44.0,
    khansama: 46.8,
    fulbari: 53.3,
    birampur: 67.0,
    nawabganj: 77.7,
    hakimpur: 80.9,
    ghoraghat: 97.0,
  },
  bochaganj: {
    bochaganj: 0,
    kaharole: 17.5,
    biral: 18.2,
    birganj: 22.4,
    sadar: 29.6,
    khansama: 38.0,
    chirirbandar: 44.5,
    parbatipur: 56.8,
    fulbari: 66.5,
    birampur: 80.2,
    nawabganj: 90.8,
    hakimpur: 94.0,
    ghoraghat: 110.2,
  },
  kaharole: {
    kaharole: 0,
    birganj: 13.8,
    bochaganj: 17.5,
    sadar: 21.5,
    khansama: 22.6,
    biral: 26.4,
    chirirbandar: 29.8,
    parbatipur: 42.0,
    fulbari: 56.5,
    birampur: 70.2,
    nawabganj: 80.8,
    hakimpur: 84.0,
    ghoraghat: 100.2,
  },
  birganj: {
    birganj: 0,
    kaharole: 13.8,
    khansama: 16.5,
    bochaganj: 22.4,
    sadar: 28.5,
    chirirbandar: 34.2,
    biral: 35.0,
    parbatipur: 45.6,
    fulbari: 63.8,
    birampur: 77.5,
    nawabganj: 88.2,
    hakimpur: 91.4,
    ghoraghat: 107.5,
  },
  khansama: {
    khansama: 0,
    birganj: 16.5,
    kaharole: 22.6,
    chirirbandar: 24.5,
    parbatipur: 31.2,
    sadar: 36.4,
    bochaganj: 38.0,
    biral: 46.8,
    fulbari: 51.4,
    birampur: 65.1,
    nawabganj: 75.8,
    hakimpur: 79.0,
    ghoraghat: 95.1,
  },
  chirirbandar: {
    chirirbandar: 0,
    parbatipur: 14.5,
    sadar: 19.2,
    khansama: 24.5,
    fulbari: 27.6,
    kaharole: 29.8,
    biral: 31.5,
    birganj: 34.2,
    birampur: 41.3,
    bochaganj: 44.5,
    nawabganj: 52.0,
    hakimpur: 55.2,
    ghoraghat: 71.3,
  },
  parbatipur: {
    parbatipur: 0,
    chirirbandar: 14.5,
    fulbari: 20.4,
    khansama: 31.2,
    sadar: 31.5,
    birampur: 34.1,
    kaharole: 42.0,
    biral: 44.0,
    nawabganj: 44.8,
    birganj: 45.6,
    hakimpur: 48.0,
    bochaganj: 56.8,
    ghoraghat: 64.1,
  },
  fulbari: {
    fulbari: 0,
    birampur: 13.7,
    parbatipur: 20.4,
    nawabganj: 24.5,
    chirirbandar: 27.6,
    hakimpur: 27.8,
    sadar: 40.8,
    ghoraghat: 43.8,
    khansama: 51.4,
    biral: 53.3,
    kaharole: 56.5,
    birganj: 63.8,
    bochaganj: 66.5,
  },
  birampur: {
    birampur: 0,
    fulbari: 13.7,
    nawabganj: 14.2,
    hakimpur: 14.5,
    ghoraghat: 30.2,
    parbatipur: 34.1,
    chirirbandar: 41.3,
    sadar: 54.5,
    khansama: 65.1,
    biral: 67.0,
    kaharole: 70.2,
    birganj: 77.5,
    bochaganj: 80.2,
  },
  nawabganj: {
    nawabganj: 0,
    birampur: 14.2,
    ghoraghat: 19.5,
    hakimpur: 22.4,
    fulbari: 24.5,
    parbatipur: 44.8,
    chirirbandar: 52.0,
    sadar: 65.2,
    khansama: 75.8,
    biral: 77.7,
    kaharole: 80.8,
    birganj: 88.2,
    bochaganj: 90.8,
  },
  hakimpur: {
    hakimpur: 0,
    birampur: 14.5,
    nawabganj: 22.4,
    ghoraghat: 26.8,
    fulbari: 27.8,
    parbatipur: 48.0,
    chirirbandar: 55.2,
    sadar: 68.4,
    khansama: 79.0,
    biral: 80.9,
    kaharole: 84.0,
    birganj: 91.4,
    bochaganj: 94.0,
  },
  ghoraghat: {
    ghoraghat: 0,
    nawabganj: 19.5,
    hakimpur: 26.8,
    birampur: 30.2,
    fulbari: 43.8,
    parbatipur: 64.1,
    chirirbandar: 71.3,
    sadar: 84.5,
    khansama: 95.1,
    biral: 97.0,
    kaharole: 100.2,
    birganj: 107.5,
    bochaganj: 110.2,
  },
};

// Verified road distances (in km) from the respective Upazila center & Dinajpur Sadar to each tourist spot
const EXACT_SPOT_ROAD_KM: Record<
  string,
  { fromUpazilaKm: number; fromSadarKm: number }
> = {
  'kantaji-temple': { fromUpazilaKm: 6.5, fromSadarKm: 20.4 },
  'nayabad-masjid': { fromUpazilaKm: 5.2, fromSadarKm: 19.5 },
  'sukh-sagar': { fromUpazilaKm: 3.5, fromSadarKm: 3.5 },
  'dinajpur-rajbari': { fromUpazilaKm: 4.2, fromSadarKm: 4.2 },
  ramsagar: { fromUpazilaKm: 8.5, fromSadarKm: 8.5 },
  'gor-e-shahid': { fromUpazilaKm: 1.0, fromSadarKm: 1.0 },
  'mohonpur-rubber-dam': { fromUpazilaKm: 17.5, fromSadarKm: 17.5 },
  'grand-dadu-bari': { fromUpazilaKm: 11.2, fromSadarKm: 11.2 },
  'gouripur-sluice-gate': { fromUpazilaKm: 10.8, fromSadarKm: 10.8 },
  'tikrir-math': { fromUpazilaKm: 6.4, fromSadarKm: 6.4 },
  'chehel-gazi-mazar': { fromUpazilaKm: 6.0, fromSadarKm: 6.0 },
  matasagar: { fromUpazilaKm: 3.8, fromSadarKm: 3.8 },
  'dinajpur-shishu-park': { fromUpazilaKm: 1.5, fromSadarKm: 1.5 },
  'jibon-mohol': { fromUpazilaKm: 12.0, fromSadarKm: 12.0 },
  'kanchan-bridge': { fromUpazilaKm: 3.2, fromSadarKm: 3.2 },
  promodtori: { fromUpazilaKm: 4.0, fromSadarKm: 4.0 },
  'chachal-resort': { fromUpazilaKm: 3.5, fromSadarKm: 14.5 },
  'dhormopur-salbon': { fromUpazilaKm: 9.8, fromSadarKm: 18.2 },
  'birol-land-port': { fromUpazilaKm: 8.5, fromSadarKm: 21.0 },
  'sitakot-vihara': { fromUpazilaKm: 3.2, fromSadarKm: 62.5 },
  'nawabganj-national-park': { fromUpazilaKm: 2.5, fromSadarKm: 64.0 },
  'swapnapuri-artificial-amusement-park': { fromUpazilaKm: 12.0, fromSadarKm: 52.5 },
  'sura-mosque': { fromUpazilaKm: 4.5, fromSadarKm: 80.5 },
  'ghoraghat-ancient-fort': { fromUpazilaKm: 6.0, fromSadarKm: 86.2 },
  'hili-land-port': { fromUpazilaKm: 1.5, fromSadarKm: 68.4 },
  'barapukuria-coal-mine': { fromUpazilaKm: 11.5, fromSadarKm: 38.5 },
  'maddhapara-granite': { fromUpazilaKm: 15.2, fromSadarKm: 44.2 },
  'singra-sal-forest': { fromUpazilaKm: 10.5, fromSadarKm: 39.0 },
  'aqua-theme-park': { fromUpazilaKm: 3.0, fromSadarKm: 56.5 },
  'birampur-shalbagan': { fromUpazilaKm: 4.2, fromSadarKm: 51.8 },
  'fulbari-barapukuria-eco': { fromUpazilaKm: 1.5, fromSadarKm: 40.8 },
  'chirirbandar-ghuguratoli': { fromUpazilaKm: 2.5, fromSadarKm: 19.2 },
  'aokra-mosque-khansama': { fromUpazilaKm: 6.5, fromSadarKm: 41.5 },
  'setabganj-sugar-mill-heritage': { fromUpazilaKm: 1.5, fromSadarKm: 29.6 },
};

function calcDistanceKm(idA: string, idB: string): number {
  const normA = idA === 'phulbari' ? 'fulbari' : idA;
  const normB = idB === 'phulbari' ? 'fulbari' : idB;
  if (normA === normB) return 0;

  const exact =
    EXACT_UPAZILA_ROAD_KM[normA]?.[normB] ??
    EXACT_UPAZILA_ROAD_KM[normB]?.[normA];
  if (typeof exact === 'number') {
    return exact;
  }

  const a = UPAZILA_PLANNER_META[normA] || UPAZILA_PLANNER_META.sadar;
  const b = UPAZILA_PLANNER_META[normB] || UPAZILA_PLANNER_META.sadar;
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const c =
    sinLat * sinLat +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      sinLng *
      sinLng;
  const dist = 2 * R * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));
  return Number(Math.max(8, dist * 1.28).toFixed(1));
}

// Nearest-neighbor shortest route ordering starting from startId
function sortShortestRoute(startId: string, destinationIds: string[]): string[] {
  const remaining = [...destinationIds];
  const ordered: string[] = [];
  let current = startId;

  while (remaining.length > 0) {
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const d = calcDistanceKm(current, remaining[i]);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    const nextId = remaining.splice(bestIdx, 1)[0];
    ordered.push(nextId);
    current = nextId;
  }
  return ordered;
}

// ============================================================================
// QUIZ QUESTIONS & HIDDEN GEMS DATA
// ============================================================================
interface QuizQuestion {
  id: string;
  questionBn: string;
  questionEn: string;
  optionsBn: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationBn: string;
  explanationEn: string;
}

const DINAJPUR_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    questionBn: 'ঐতিহাসিক কান্তজিউ মন্দিরের নির্মাণ কাজ কে শুরু করেছিলেন?',
    questionEn: 'Who commissioned the construction of the historic Kantaji Temple?',
    optionsBn: [
      'মহারাজা প্রাণনাথ (১৭০৪ সালে)',
      'মহারাজা রামনাথ (১৭৫২ সালে)',
      'মহারাজা গিরিজানাথ',
      'রাজা গণেশ',
    ],
    optionsEn: [
      'Maharaja Pran Nath (in 1704)',
      'Maharaja Ram Nath (in 1752)',
      'Maharaja Girijanath',
      'Raja Ganesh',
    ],
    correctIndex: 0,
    explanationBn:
      'মহারাজা প্রাণনাথ ১৭০৪ সালে কান্তজিউ মন্দিরের নির্মাণ কাজ শুরু করেন এবং তাঁর পুত্র মহারাজা রামনাথ ১৭৫২ সালে তা সম্পন্ন করেন।',
    explanationEn:
      'Maharaja Pran Nath began construction in 1704, and his adopted son Maharaja Ram Nath completed it in 1752.',
  },
  {
    id: 'q2',
    questionBn: 'বাংলাদেশের বৃহত্তম মানবসৃষ্ট দিঘী "রামসাগর" কোন উপজেলায় অবস্থিত?',
    questionEn:
      'In which upazila is Ramsagar, the largest man-made tank in Bangladesh, located?',
    optionsBn: [
      'কাহারোল উপজেলা',
      'দিনাজপুর সদর (তাজপুর গ্রাম)',
      'বিরল উপজেলা',
      'নবাবগঞ্জ উপজেলা',
    ],
    optionsEn: [
      'Kaharole Upazila',
      'Dinajpur Sadar (Tajpur Village)',
      'Biral Upazila',
      'Nawabganj Upazila',
    ],
    correctIndex: 1,
    explanationBn:
      'রামসাগর দিঘী ও জাতীয় উদ্যান দিনাজপুর সদর উপজেলার তাজপুর গ্রামে অবস্থিত। রাজা রামনাথ ১৭৫০-১৭৫৫ সালে এটি খনন করান।',
    explanationEn:
      'Ramsagar National Park is located in Tajpur village of Dinajpur Sadar Upazila, excavated by Raja Ram Nath between 1750 and 1755.',
  },
  {
    id: 'q3',
    questionBn: 'দিনাজপুর জেলায় মোট কয়টি উপজেলা রয়েছে?',
    questionEn: 'How many upazilas are there in Dinajpur district in total?',
    optionsBn: ['১১টি উপজেলা', '১২টি উপজেলা', '১৩টি উপজেলা', '১৫টি উপজেলা'],
    optionsEn: ['11 Upazilas', '12 Upazilas', '13 Upazilas', '15 Upazilas'],
    correctIndex: 2,
    explanationBn:
      'দিনাজপুর জেলায় মোট ১৩টি উপজেলা রয়েছে (সদর, কাহারোল, বিরল, বীরগঞ্জ, বোচাগঞ্জ, চিরিরবন্দর, ফুলবাড়ী, ঘোড়াঘাট, হাকিমপুর, খানসামা, নবাবগঞ্জ, পার্বতীপুর ও বিরামপুর)।',
    explanationEn:
      'Dinajpur consists of 13 upazilas spanning from Birganj in the north to Hakimpur and Ghoraghat in the south.',
  },
  {
    id: 'q4',
    questionBn: 'কোন মসজিদটি কান্তজিউ মন্দিরের কারিগররাই টেরাকোটা শৈলীতে নির্মাণ করেছিলেন?',
    questionEn:
      'Which historic mosque was built using terracotta plaques by the artisans of Kantaji Temple?',
    optionsBn: [
      'সুরা মসজিদ (ঘোড়াঘাট)',
      'নয়াবাদ মসজিদ (কাহারোল)',
      'চেহেল গাজী মাজার মসজিদ',
      'আওকরা মসজিদ',
    ],
    optionsEn: [
      'Sura Mosque (Ghoraghat)',
      'Nayabad Mosque (Kaharole)',
      'Chehel Gazi Mosque',
      'Aokra Mosque',
    ],
    correctIndex: 1,
    explanationBn:
      '১৭৯৩ খ্রিস্টাব্দে ঢেপা নদীর তীরে কাহারোলের নয়াবাদ গ্রামে কান্তজিউ মন্দিরের নির্মাতা কারিগররাই নিজেদের নামাজের জন্য তিন গম্বুজবিশিষ্ট নয়াবাদ মসজিদ নির্মাণ করেন।',
    explanationEn:
      'Built in 1793 CE in Kaharole along the Dhepa River, Nayabad Mosque was constructed by the artisans brought to build Kantaji Temple.',
  },
  {
    id: 'q5',
    questionBn: 'বাংলাদেশের একমাত্র ভূগর্ভস্থ কয়লা খনি ও কঠিন শিলা খনি দিনাজপুরের কোন উপজেলায়?',
    questionEn:
      'Which upazila in Dinajpur hosts Bangladesh’s underground coal mine and hard rock mine?',
    optionsBn: [
      'পার্বতীপুর (বড়পুকুরিয়া ও মধ্যপাড়া)',
      'হাকিমপুর (হিলি)',
      'খানসামা',
      'বোচাগঞ্জ',
    ],
    optionsEn: [
      'Parbatipur (Barapukuria & Maddhapara)',
      'Hakimpur (Hili)',
      'Khansama',
      'Bochaganj',
    ],
    correctIndex: 0,
    explanationBn:
      'পার্বতীপুর উপজেলায় বড়পুকুরিয়া কয়লা খনি এবং মধ্যপাড়া কঠিন শিলা খনি অবস্থিত, এছাড়াও এখানে দেশের অন্যতম বৃহৎ ৪-লাইনের রেলওয়ে জংশন রয়েছে।',
    explanationEn:
      'Parbatipur Upazila is home to both the Barapukuria Coal Mine and Maddhapara Granite Mine, as well as the historic broad/meter gauge railway junction.',
  },
  {
    id: 'q6',
    questionBn: 'দিনাজপুরের কোন জাতের চাল ও লিচু সারা বাংলাদেশে ভৌগোলিক নির্দেশক (GI) ও ঐতিহ্যের জন্য বিখ্যাত?',
    questionEn:
      'Which varieties of rice and lychee from Dinajpur are celebrated across Bangladesh?',
    optionsBn: [
      'কাটারিভোগ চাল ও বেদানা লিচু',
      'কালিজিরা চাল ও বোম্বাই লিচু',
      'নাজিরশাইল চাল ও চায়না-২ লিচু',
      'পোলাও চাল ও দেশি লিচু',
    ],
    optionsEn: [
      'Kataribhog Rice & Bedana Lychee',
      'Kalijira Rice & Bombai Lychee',
      'Najirshail Rice & China-2 Lychee',
      'Polao Rice & Local Lychee',
    ],
    correctIndex: 0,
    explanationBn:
      'দিনাজপুরের সুগন্ধি কাটারিভোগ চাল, চিড়া এবং বিরল-মাশিমপুরের রসালো বেদানা লিচু জিআই (GI) স্বীকৃত ও বিশ্বজুড়ে সমাদৃত।',
    explanationEn:
      'Dinajpur’s aromatic Kataribhog rice/chira and Mashimpur’s sweet Bedana lychee are GI-recognized culinary treasures.',
  },
];

interface CustomInfoField {
  id: string;
  label: string;
  value: string;
}

interface HiddenGemItem {
  id: string;
  type: 'gem' | 'food';
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  upazilaBn: string;
  upazilaEn: string;
  categoryLabelBn: string;
  categoryLabelEn: string;
  descBn: string;
  descEn: string;
  bestTimeBn: string;
  bestTimeEn: string;
  lat: number;
  lng: number;
  coverImage: string;
  photos?: string[];
  photoCount: number;
  contributorName: string;
  contributorAvatar?: string;
  foodNearbyBn?: string;
  facilitiesBn?: string;
  mapLink?: string;
  createdAtMs?: number;
}

const STORAGE_CUSTOM_GEMS_KEY = 'hd_custom_hidden_gems_v2';

interface PosterLogRecord {
  id: string;
  travelerName: string;
  format: string;
  visitedUpazilas: string[];
  visitedCount: number;
  progressPercent: number;
  themeId: string;
  posterPreview?: string;
  createdAtMs: number;
}

interface InteractiveHubSectionProps {
  lang: Language;
  travelerName: string;
  onShowToast: (msg: string) => void;
  onOpenSpotDrawer?: (spot: TouristSpot) => void;
}

export const InteractiveHubSection: React.FC<InteractiveHubSectionProps> = ({
  lang,
  travelerName,
  onShowToast,
  onOpenSpotDrawer,
}) => {
  const [activeTab, setActiveTab] = useState<
    'planner' | 'quiz' | 'gems' | 'posters'
  >('planner');

  // ==================== 1. REFERENCE-STYLE TRIP PLANNER STATE ====================
  const [startUpazilaId, setStartUpazilaId] = useState<string>('sadar');
  const [selectedDestIds, setSelectedDestIds] = useState<string[]>([]);
  const [optimizeShortestRoute, setOptimizeShortestRoute] =
    useState<boolean>(true);
  const [excludedSpotIds, setExcludedSpotIds] = useState<string[]>([]);

  // ==================== 2. QUIZ GAME STATE ====================
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [playerName, setPlayerName] = useState(travelerName || 'Traveler');

  // ==================== 3. HIDDEN GEMS & COMMUNITY SUBMISSION STATE (NO DUMMY ITEMS) ====================
  const [gemFilter, setGemFilter] = useState<'all' | 'gem' | 'food'>('all');
  const [gemFormMode, setGemFormMode] = useState<'none' | 'gem' | 'food'>('none');
  const [customGems, setCustomGems] = useState<HiddenGemItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_CUSTOM_GEMS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });
  const [cloudGems, setCloudGems] = useState<HiddenGemItem[]>([]);

  // Form fields for adding a Hidden Gem or Famous Food
  const [formTitle, setFormTitle] = useState('');
  const [formDistrict, setFormDistrict] = useState('দিনাজপুর');
  const [formUpazila, setFormUpazila] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formMapUrl, setFormMapUrl] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formFoodNearby, setFormFoodNearby] = useState('');
  const [formFacilities, setFormFacilities] = useState('');
  const [formContributorName, setFormContributorName] = useState(
    travelerName || ''
  );
  const [formContributorDistrict, setFormContributorDistrict] =
    useState('দিনাজপুর');
  const [formContact, setFormContact] = useState('');
  const [formAvatarPreview, setFormAvatarPreview] = useState<string>('');
  const [formExtraFields, setFormExtraFields] = useState<CustomInfoField[]>([]);
  const [formPhotos, setFormPhotos] = useState<string[]>([]);
  const [formConsent, setFormConsent] = useState(false);
  const [selectedGemModal, setSelectedGemModal] =
    useState<HiddenGemItem | null>(null);

  // ==================== 4. LIVE GENERATED POSTERS GALLERY ====================
  const [posterLogs, setPosterLogs] = useState<PosterLogRecord[]>([]);
  const [previewModalPoster, setPreviewModalPoster] =
    useState<PosterLogRecord | null>(null);

  // Sync playerName when travelerName updates
  useEffect(() => {
    if (travelerName.trim()) {
      setPlayerName(travelerName.trim());
    }
  }, [travelerName]);

  // Listen for hash navigation (#trip-planner-section, #quiz-game-section, #hidden-gems-section)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#trip-planner-section') setActiveTab('planner');
      else if (hash === '#quiz-game-section') setActiveTab('quiz');
      else if (hash === '#hidden-gems-section') setActiveTab('gems');
      else if (hash === '#community-posters-section') setActiveTab('posters');
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Real-time Firestore listener for user-submitted Hidden Gems & Famous Foods (stored in /spotPhotos with spotId 'gem_submission_gem' or 'gem_submission_food')
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'spotPhotos'),
      (snap) => {
        const list: HiddenGemItem[] = [];
        snap.forEach((docSnap) => {
          const d = docSnap.data();
          if (
            typeof d.spotId === 'string' &&
            (d.spotId === 'gem_submission_gem' ||
              d.spotId === 'gem_submission_food') &&
            typeof d.photoData === 'string' &&
            d.photoData.startsWith('data:image/')
          ) {
            const isFood = d.spotId === 'gem_submission_food';
            const ts =
              d.createdAt && typeof d.createdAt.toMillis === 'function'
                ? d.createdAt.toMillis()
                : Date.now();

            // Parse metadata packed into caption: Title || Upazila || Category || Desc || FoodNearby || Facilities || PhotoCount
            const rawCaption = typeof d.caption === 'string' ? d.caption : '';
            const parts = rawCaption.split('||').map((s: string) => s.trim());
            const title = parts[0] || 'লুকানো রত্ন';
            const upazila = parts[1] || 'দিনাজপুর';
            const category =
              parts[2] || (isFood ? 'বিখ্যাত খাবার' : 'দর্শনীয় স্থান');
            const desc = parts[3] || `${upazila}-এর দর্শনীয় স্থান/খাবার।`;
            const foodNearby = parts[4] || '';
            const facilities = parts[5] || '';
            const pCount = Math.max(1, parseInt(parts[6] || '1', 10) || 1);

            list.push({
              id: docSnap.id,
              type: isFood ? 'food' : 'gem',
              badgeBn: isFood
                ? `স্থানীয় খাবার ও পণ্য · ${upazila}`
                : `লুকানো রত্ন · ${upazila}`,
              badgeEn: isFood
                ? `Local Delicacy · ${upazila}`
                : `Hidden Gem · ${upazila}`,
              titleBn: title,
              titleEn: title,
              upazilaBn: upazila,
              upazilaEn: upazila,
              categoryLabelBn: category,
              categoryLabelEn: category,
              descBn: desc,
              descEn: desc,
              bestTimeBn: 'সারা বছর',
              bestTimeEn: 'Year-round',
              lat: 25.6279,
              lng: 88.6332,
              coverImage: d.photoData,
              photos: [d.photoData],
              photoCount: pCount,
              contributorName: d.uploaderName || 'Traveler',
              foodNearbyBn: foodNearby || undefined,
              facilitiesBn: facilities || undefined,
              createdAtMs: ts,
            });
          }
        });
        list.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
        setCloudGems(list);
      },
      () => {
        // ignore offline errors
      }
    );
    return () => unsub();
  }, []);

  // Real-time Firestore listener for /generatedPosters
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'generatedPosters'),
      (snap) => {
        const list: PosterLogRecord[] = [];
        snap.forEach((docSnap) => {
          const d = docSnap.data();
          const ts =
            d.createdAt && typeof d.createdAt.toMillis === 'function'
              ? d.createdAt.toMillis()
              : Date.now();
          list.push({
            id: docSnap.id,
            travelerName: d.travelerName || 'Traveler',
            format: (d.format || 'png').toUpperCase(),
            visitedUpazilas: Array.isArray(d.visitedUpazilas)
              ? d.visitedUpazilas
              : [],
            visitedCount:
              typeof d.visitedCount === 'number' ? d.visitedCount : 0,
            progressPercent:
              typeof d.progressPercent === 'number' ? d.progressPercent : 0,
            themeId: d.themeId || 'emerald',
            posterPreview: d.posterPreview || undefined,
            createdAtMs: ts,
          });
        });
        list.sort((a, b) => b.createdAtMs - a.createdAtMs);
        setPosterLogs(list.slice(0, 24));
      },
      (err) => {
        console.warn('generatedPosters listener notice:', err);
      }
    );
    return () => unsub();
  }, []);

  // ==================== TRIP PLANNER HELPERS ====================
  const getUpazilaById = (id: string): Upazila =>
    UPAZILAS.find((u) => u.id === id) || UPAZILAS[0];

  const handleAddDestUpazila = (upazilaId: string) => {
    if (!upazilaId) return;
    setSelectedDestIds((prev) =>
      prev.includes(upazilaId) ? prev : [...prev, upazilaId]
    );
  };

  const handleRemoveDestUpazila = (upazilaId: string) => {
    setSelectedDestIds((prev) => prev.filter((id) => id !== upazilaId));
  };

  const handleToggleDestUpazila = (upazilaId: string) => {
    setSelectedDestIds((prev) =>
      prev.includes(upazilaId)
        ? prev.filter((id) => id !== upazilaId)
        : [...prev, upazilaId]
    );
  };

  const handleLoadExampleRoute = () => {
    setStartUpazilaId('sadar');
    setSelectedDestIds(['kaharole', 'birganj', 'nawabganj', 'ghoraghat']);
    setOptimizeShortestRoute(true);
    setExcludedSpotIds([]);
  };

  // Nearby suggested upazilas based on current startUpazilaId
  const nearbyUpazilaIds = useMemo(() => {
    const startMeta =
      UPAZILA_PLANNER_META[startUpazilaId] || UPAZILA_PLANNER_META.sadar;
    const rawNeighbors = startMeta.neighbors.filter((id) =>
      UPAZILAS.some((u) => u.id === id)
    );
    const othersSorted = UPAZILAS.map((u) => u.id)
      .filter((id) => id !== startUpazilaId && !rawNeighbors.includes(id))
      .sort(
        (a, b) =>
          calcDistanceKm(startUpazilaId, a) - calcDistanceKm(startUpazilaId, b)
      );
    return [...rawNeighbors, ...othersSorted].slice(0, 6);
  }, [startUpazilaId]);

  // Final ordered destination upazilas (either shortest route or user selection order)
  const orderedPlanUpazilaIds = useMemo(() => {
    if (selectedDestIds.length === 0) return [];
    if (optimizeShortestRoute) {
      return sortShortestRoute(startUpazilaId, selectedDestIds);
    }
    return selectedDestIds;
  }, [startUpazilaId, selectedDestIds, optimizeShortestRoute]);

  // Calculate total route distance, Auto Rickshaw fare (15 BDT/km), Bus fare (2 BDT/km), & itemized budget breakdown
  const AUTO_RICKSHAW_FARE_PER_KM = 15;
  const BUS_FARE_PER_KM = 2;

  const calcBusFare = (km: number): number => Math.max(10, Math.round(km * BUS_FARE_PER_KM));

  const formatDurationEst = (km: number, currentLang: Language): string => {
    const mins = Math.max(20, Math.round(km * 2));
    if (mins < 60) {
      return currentLang === 'bn'
        ? `${formatNumber(mins, 'bn')} মিনিট`
        : `${mins} mins`;
    }
    const hrs = (mins / 60).toFixed(1).replace('.0', '');
    const hrsFormatted =
      currentLang === 'bn'
        ? hrs
            .split('')
            .map((ch) => (ch >= '0' && ch <= '9' ? formatNumber(Number(ch), 'bn') : ch))
            .join('')
        : hrs;
    return currentLang === 'bn' ? `${hrsFormatted} ঘণ্টা` : `${hrsFormatted} hrs`;
  };

  const getSpotVisitInfo = (spot: TouristSpot, currentLang: Language) => {
    if (spot.category === 'Resort/Park') {
      return {
        duration: currentLang === 'bn' ? '২–৩ ঘণ্টা' : '2–3 hrs',
        entryText:
          currentLang === 'bn'
            ? 'প্রবেশ ও রাইড টিকিট ৫০–২০০৳'
            : 'Entry & rides ৳50–200',
        entryCostBdt: 100,
      };
    }
    if (spot.id === 'ramsagar-national-park' || spot.id === 'kantaji-temple' || spot.id === 'dinajpur-museum') {
      return {
        duration: currentLang === 'bn' ? '১.৫–২ ঘণ্টা' : '1.5–2 hrs',
        entryText:
          currentLang === 'bn'
            ? 'প্রবেশ ফি ২০–৫০৳'
            : 'Entry fee ৳20–50',
        entryCostBdt: 30,
      };
    }
    return {
      duration: currentLang === 'bn' ? '১–১.৫ ঘণ্টা' : '1–1.5 hrs',
      entryText: currentLang === 'bn' ? 'বিনামূল্যে' : 'Free entry',
      entryCostBdt: 0,
    };
  };

  const plannerSummary = useMemo(() => {
    const daysCount = orderedPlanUpazilaIds.length;
    const nightsCount = Math.max(0, daysCount - 1);
    let totalKm = 0;
    let totalAutoFare = 0;
    let totalBusFare = 0;
    let prevId = startUpazilaId;

    orderedPlanUpazilaIds.forEach((uid) => {
      const legKm = uid === prevId ? 10 : calcDistanceKm(prevId, uid);
      const legAutoFare = Math.round(legKm * AUTO_RICKSHAW_FARE_PER_KM);
      const legBusFare = calcBusFare(legKm);
      totalKm = Number((totalKm + legKm).toFixed(1));
      totalAutoFare += legAutoFare;
      totalBusFare += legBusFare;
      prevId = uid;
    });

    // Return leg back to startUpazilaId on the final day
    const lastId =
      orderedPlanUpazilaIds[orderedPlanUpazilaIds.length - 1] || startUpazilaId;
    const returnKm =
      lastId === startUpazilaId ? 10 : calcDistanceKm(lastId, startUpazilaId);
    const returnBusFare = calcBusFare(returnKm);
    const returnAutoFare = Math.round(returnKm * AUTO_RICKSHAW_FARE_PER_KM);

    const grandTotalKm = Number(
      (totalKm + (daysCount > 0 ? returnKm : 0)).toFixed(1)
    );
    const grandTotalBusFare = totalBusFare + (daysCount > 0 ? returnBusFare : 0);
    const grandTotalAutoFare =
      totalAutoFare + (daysCount > 0 ? returnAutoFare : 0);

    // Itemized breakdown matching reference image 2
    const stayRatePerNight = 1500;
    const stayCost = nightsCount * stayRatePerNight;

    const foodRatePerDay = 600;
    const foodCost = daysCount * foodRatePerDay;

    // Local transport inside upazila (Auto Rickshaw 15 BDT/km, Rickshaw, Van across spots)
    const localTransportPerDay = 300;
    const localTransportCost = daysCount * localTransportPerDay;

    const subtotal =
      grandTotalBusFare + stayCost + foodCost + localTransportCost;
    const entryAndMiscCost = Math.round((subtotal * 0.1) / 10) * 10;
    const grandTotalModerate = subtotal + entryAndMiscCost;
    const minRange = Math.round((grandTotalModerate * 0.85) / 50) * 50;
    const maxRange =
      Math.round(
        ((grandTotalModerate + (grandTotalAutoFare - grandTotalBusFare)) *
          1.05) /
          50
      ) * 50;

    return {
      daysCount,
      nightsCount,
      stayRatePerNight,
      stayCost,
      foodRatePerDay,
      foodCost,
      localTransportCost,
      entryAndMiscCost,
      returnKm,
      returnBusFare,
      returnAutoFare,
      totalKm: grandTotalKm,
      totalAutoFare: grandTotalAutoFare,
      totalBusFare: grandTotalBusFare,
      grandTotalModerate,
      minRange,
      maxRange,
    };
  }, [startUpazilaId, orderedPlanUpazilaIds]);

  const toggleSpotSelection = (spotId: string) => {
    setExcludedSpotIds((prev) =>
      prev.includes(spotId)
        ? prev.filter((id) => id !== spotId)
        : [...prev, spotId]
    );
  };

  // ==================== QUIZ HANDLERS ====================
  const currentQuestion = DINAJPUR_QUIZ_QUESTIONS[currentQIdx];

  const handleSelectQuizOption = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = async () => {
    if (currentQIdx + 1 < DINAJPUR_QUIZ_QUESTIONS.length) {
      setCurrentQIdx((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizCompleted(true);
      onShowToast(
        lang === 'bn'
          ? `অভিনন্দন! আপনি ৬টির মধ্যে ${formatNumber(score, 'bn')}টি সঠিক উত্তর দিয়েছেন!`
          : `Congratulations! You scored ${score} out of ${DINAJPUR_QUIZ_QUESTIONS.length}!`
      );
      try {
        const cleanPlayer = (playerName || 'Traveler').trim().slice(0, 80);
        const docId = `quiz_${Date.now()}`;
        await setDoc(doc(db, 'generatedPosters', docId), {
          travelerName: `${cleanPlayer} (Quiz: ${score}/${DINAJPUR_QUIZ_QUESTIONS.length})`,
          format: 'png',
          visitedUpazilas: [],
          visitedCount: score,
          progressPercent: Math.round(
            (score / DINAJPUR_QUIZ_QUESTIONS.length) * 100
          ),
          themeId: 'emerald',
          createdAt: serverTimestamp(),
        });
      } catch {
        // ignore
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQIdx(0);
    setSelectedOption(null);
    setScore(0);
    setQuizCompleted(false);
  };

  // ==================== HIDDEN GEMS SUBMISSION HELPERS ====================
  const compressUploadedImage = (
    file: File,
    maxWidth = 800,
    quality = 0.72
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxWidth / img.width);
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(reader.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressUploadedImage(file, 260, 0.75);
      setFormAvatarPreview(dataUrl);
    } catch {
      // ignore
    }
    e.target.value = '';
  };

  const handleGemPhotosUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const remainingSlots = Math.max(0, 5 - formPhotos.length);
    const toProcess = files.slice(0, remainingSlots);
    const compressedList: string[] = [];
    for (const f of toProcess) {
      try {
        const dataUrl = await compressUploadedImage(f, 820, 0.7);
        compressedList.push(dataUrl);
      } catch {
        // ignore
      }
    }
    setFormPhotos((prev) => [...prev, ...compressedList].slice(0, 5));
    e.target.value = '';
  };

  const handleAddExtraField = () => {
    setFormExtraFields((prev) => [
      ...prev,
      { id: `extra_${Date.now()}`, label: '', value: '' },
    ]);
  };

  const handleUpdateExtraField = (
    id: string,
    key: 'label' | 'value',
    val: string
  ) => {
    setFormExtraFields((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: val } : item))
    );
  };

  const handleRemoveExtraField = (id: string) => {
    setFormExtraFields((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmitGemOrFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formUpazila.trim() || !formCategory.trim()) {
      onShowToast(
        lang === 'bn'
          ? 'অনুগ্রহ করে নাম, উপজেলা এবং ক্যাটাগরি পূরণ করুন।'
          : 'Please fill in the name, upazila, and category.'
      );
      return;
    }
    if (!formContributorName.trim() || !formContact.trim()) {
      onShowToast(
        lang === 'bn'
          ? 'অনুগ্রহ করে আপনার নাম এবং ফোন বা ইমেইল দিন।'
          : 'Please enter your name and phone or email.'
      );
      return;
    }
    if (formPhotos.length === 0) {
      onShowToast(
        lang === 'bn'
          ? 'অনুগ্রহ করে জায়গাটির বা খাবারের অন্তত ১টি আসল ছবি যোগ করুন (কোনো ডামি ছবি ব্যবহার করা হয় না)।'
          : 'Please upload at least 1 real photo of the place or food.'
      );
      return;
    }
    if (!formConsent) {
      onShowToast(
        lang === 'bn'
          ? 'প্রকাশের অনুমতির টিক চিহ্নটি (Checkbox) দিন।'
          : 'Please check the permission box to submit.'
      );
      return;
    }

    const isFood = gemFormMode === 'food';
    const extraSummary = formExtraFields
      .filter((f) => f.label.trim() || f.value.trim())
      .map((f) => `${f.label.trim()}: ${f.value.trim()}`)
      .join(' · ');

    const combinedDesc = [
      formDesc.trim() ||
        (isFood
          ? `${formUpazila}, ${formDistrict}-এর ঐতিহ্যবাহী ও জনপ্রিয় খাবার/পণ্য।`
          : `${formUpazila}, ${formDistrict}-এর একটি অনন্য ও সুন্দর দর্শনীয় স্থান।`),
      extraSummary,
    ]
      .filter(Boolean)
      .join(' — ');

    const docId = `gem_${Date.now()}`;
    const newGem: HiddenGemItem = {
      id: docId,
      type: isFood ? 'food' : 'gem',
      badgeBn: isFood
        ? `স্থানীয় খাবার ও পণ্য · ${formUpazila.trim()}`
        : `লুকানো রত্ন · ${formUpazila.trim()}`,
      badgeEn: isFood
        ? `Local Delicacy · ${formUpazila.trim()}`
        : `Hidden Gem · ${formUpazila.trim()}`,
      titleBn: formTitle.trim(),
      titleEn: formTitle.trim(),
      upazilaBn: `${formUpazila.trim()}, ${formDistrict}`,
      upazilaEn: `${formUpazila.trim()}, ${formDistrict}`,
      categoryLabelBn: formCategory.trim(),
      categoryLabelEn: formCategory.trim(),
      descBn: combinedDesc,
      descEn: combinedDesc,
      bestTimeBn: 'সারা বছর',
      bestTimeEn: 'Year-round',
      lat: 25.6279,
      lng: 88.6332,
      coverImage: formPhotos[0],
      photos: formPhotos,
      photoCount: formPhotos.length,
      contributorName: formContributorName.trim(),
      contributorAvatar: formAvatarPreview || undefined,
      foodNearbyBn: formFoodNearby.trim() || 'স্থানীয় বাজারে খাবার পাওয়া যায়',
      facilitiesBn: formFacilities.trim() || 'অটো ও ভ্যান যোগে যাতায়াত সুবিধা',
      mapLink: formMapUrl.trim() || undefined,
      createdAtMs: Date.now(),
    };

    const updatedCustom = [newGem, ...customGems];
    setCustomGems(updatedCustom);
    try {
      localStorage.setItem(
        STORAGE_CUSTOM_GEMS_KEY,
        JSON.stringify(updatedCustom)
      );
    } catch {
      // ignore storage quota errors
    }

    // Sync community contribution to Firestore /spotPhotos so everyone sees it live
    try {
      const packedCaption = [
        formTitle.trim(),
        `${formUpazila.trim()}, ${formDistrict}`,
        formCategory.trim(),
        combinedDesc.replace(/\|\|/g, ' '),
        (formFoodNearby.trim() || 'স্থানীয় বাজারে খাবার পাওয়া যায়').replace(
          /\|\|/g,
          ' '
        ),
        (formFacilities.trim() || 'অটো ও ভ্যান যোগে যাতায়াত সুবিধা').replace(
          /\|\|/g,
          ' '
        ),
        String(formPhotos.length),
      ]
        .join('||')
        .slice(0, 195);

      await setDoc(doc(db, 'spotPhotos', docId), {
        spotId: isFood ? 'gem_submission_food' : 'gem_submission_gem',
        photoData: formPhotos[0],
        uploaderName: formContributorName.trim().slice(0, 90),
        uploaderUid: `gem_contributor_${Date.now()}`,
        caption: packedCaption,
        createdAt: serverTimestamp(),
      });
    } catch {
      // ignore cloud error if offline
    }

    // Reset form & close
    setFormTitle('');
    setFormUpazila('');
    setFormCategory('');
    setFormMapUrl('');
    setFormDesc('');
    setFormFoodNearby('');
    setFormFacilities('');
    setFormExtraFields([]);
    setFormPhotos([]);
    setFormConsent(false);
    setGemFormMode('none');
    setGemFilter('all');

    onShowToast(
      lang === 'bn'
        ? 'ধন্যবাদ! আপনার পাঠানো লুকানো রত্নটি তালিকায় যুক্ত হয়েছে।'
        : 'Thank you! Your submitted gem has been added to the showcase.'
    );
  };

  // Merge local & cloud user-submitted gems without any dummy preset items
  const allGemsList = useMemo(() => {
    const map = new Map<string, HiddenGemItem>();
    customGems.forEach((g) => map.set(g.id, g));
    cloudGems.forEach((g) => {
      if (!map.has(g.id)) {
        map.set(g.id, g);
      }
    });
    return Array.from(map.values()).sort(
      (a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0)
    );
  }, [customGems, cloudGems]);

  const filteredGems = allGemsList.filter((item) => {
    if (gemFilter === 'all') return true;
    return item.type === gemFilter;
  });

  return (
    <section id="coming-soon-section" className="space-y-8">
      {/* Anchor targets for top navbar links */}
      <div id="trip-planner-section" className="sr-only" />
      <div id="quiz-game-section" className="sr-only" />
      <div id="hidden-gems-section" className="sr-only" />
      <div id="community-posters-section" className="sr-only" />

      {/* Top Feature Switcher Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-white p-2 rounded-full border border-slate-200/90 shadow-2xs max-w-fit mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('planner')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'planner'
              ? 'bg-[#046a4e] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{lang === 'bn' ? 'ট্রিপ প্ল্যানার' : 'Trip Planner'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-[#046a4e] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>{lang === 'bn' ? 'কুইজ খেলা' : 'Quiz Game'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gems')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'gems'
              ? 'bg-[#046a4e] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>
            {lang === 'bn' ? 'লুকানো রত্ন ও খাবার' : 'Hidden Gems & Food'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('posters')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'posters'
              ? 'bg-[#046a4e] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>
            {lang === 'bn'
              ? `জেনারেটেড ম্যাপ (${formatNumber(posterLogs.length, 'bn')})`
              : `Live Maps (${posterLogs.length})`}
          </span>
        </button>
      </div>

      {/* ================================================================== */}
      {/* TAB 1: EXACT REFERENCE IMAGE TRIP PLANNER                          */}
      {/* ================================================================== */}
      {activeTab === 'planner' && (
        <div className="bg-[#FAF8F5] rounded-[32px] border border-slate-200/80 p-5 sm:p-8 lg:p-10 shadow-2xs space-y-8">
          {/* Centered Header Matching Uploaded Reference Image */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            {/* Soft Mint Pill */}
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#e3f2ed] text-[#0b5c43] text-xs sm:text-sm font-bold">
              {lang === 'bn'
                ? 'আপনার মতো করে সাজানো ভ্রমণ'
                : 'Your Personalized Travel Itinerary'}
            </div>

            {/* Dual-Tone Display Title: ট্রিপ প্ল্যানার */}
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {lang === 'bn' ? (
                <>
                  <span className="text-[#1a1a1a]">ট্রিপ </span>
                  <span className="bg-gradient-to-r from-[#046a4e] via-[#1b8a6b] to-[#e13b45] bg-clip-text text-transparent">
                    প্ল্যানার
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[#1a1a1a]">Trip </span>
                  <span className="bg-gradient-to-r from-[#046a4e] via-[#1b8a6b] to-[#e13b45] bg-clip-text text-transparent">
                    Planner
                  </span>
                </>
              )}
            </h2>

            {/* Subtitle matching reference image */}
            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-medium">
              {lang === 'bn'
                ? 'কোথা থেকে শুরু করবেন আর কোন কোন উপজেলায় যাবেন বেছে নিন — সাজিয়ে দেওয়া হবে কোথায় আগে যাবেন, প্রতিদিন কী দেখবেন, কোথায় থাকবেন আর মোট কত খরচ হতে পারে।'
                : 'Pick where you will start and which upazilas you want to visit — we will automatically arrange the best route, daily sightseeing spots, where to stay, and total estimated cost.'}
            </p>

            {/* White Banner Card with Bird/Travel Icon matching reference image */}
            <div className="pt-2 flex justify-center">
              <a
                href="#spot-map-section"
                className="w-full max-w-md bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl px-5 py-3.5 shadow-xs flex items-center justify-between gap-4 transition-all text-left group"
              >
                <div>
                  <div className="text-[11px] font-semibold text-slate-500">
                    {lang === 'bn'
                      ? 'মানচিত্র পূরণ করতে'
                      : 'To complete your travel map'}
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-[#162b5b] group-hover:text-emerald-800 transition-colors">
                    {lang === 'bn'
                      ? 'ঘুরতে থাকুন হ্যাংআউট দিনাজপুরের সাথে'
                      : 'Keep exploring with Hangout Dinajpur'}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#163269] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Navigation className="w-5 h-5" />
                </div>
              </a>
            </div>
          </div>

          {/* 2-Column Layout Matching Reference Image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ============================================================ */}
            {/* LEFT PANEL (Steps 1, 2, 3 + Interactive Mini Map)            */}
            {/* ============================================================ */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-6 max-h-[680px] overflow-y-auto custom-scrollbar">
              {/* STEP 1: কোথা থেকে শুরু করবেন? */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#046a4e] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                    {lang === 'bn' ? '১' : '1'}
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    {lang === 'bn'
                      ? 'কোথা থেকে শুরু করবেন?'
                      : 'Where will you start from?'}
                  </h3>
                </div>

                <select
                  value={startUpazilaId}
                  onChange={(e) => setStartUpazilaId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F6F2] border border-slate-200/90 text-sm font-bold text-slate-800 focus:bg-white focus:border-[#046a4e] focus:outline-none cursor-pointer"
                >
                  {UPAZILAS.map((u) => (
                    <option key={u.id} value={u.id}>
                      {lang === 'bn' ? u.nameBn : u.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <hr className="border-slate-200/80" />

              {/* STEP 2: কোন কোন উপজেলায় যাবেন? */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#046a4e] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                      {lang === 'bn' ? '২' : '2'}
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      {lang === 'bn'
                        ? 'কোন কোন উপজেলায় যাবেন?'
                        : 'Which upazilas will you visit?'}
                    </h3>
                  </div>
                  {selectedDestIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedDestIds([])}
                      className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      {lang === 'bn' ? 'সব মুছুন' : 'Clear'}
                    </button>
                  )}
                </div>

                {/* Dropdown: + উপজেলা যোগ করুন (with exact road km from starting upazila) */}
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddDestUpazila(e.target.value);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F6F2] border border-slate-200/90 text-sm font-bold text-slate-700 focus:bg-white focus:border-[#046a4e] focus:outline-none cursor-pointer"
                >
                  <option value="">
                    {lang === 'bn'
                      ? '+ উপজেলা যোগ করুন'
                      : '+ Add Upazila to Trip'}
                  </option>
                  {UPAZILAS.map((u) => {
                    const alreadyAdded = selectedDestIds.includes(u.id);
                    const distFromStart = calcDistanceKm(startUpazilaId, u.id);
                    const distLabel =
                      u.id === startUpazilaId
                        ? ''
                        : lang === 'bn'
                        ? ` (${formatNumber(distFromStart, 'bn')} কিমি)`
                        : ` (${distFromStart} km)`;
                    return (
                      <option
                        key={u.id}
                        value={u.id}
                        disabled={alreadyAdded}
                      >
                        {alreadyAdded ? '✓ ' : '+ '}
                        {lang === 'bn' ? u.nameBn : u.nameEn}
                        {distLabel}
                      </option>
                    );
                  })}
                </select>

                {/* Selected Upazila Chips */}
                {selectedDestIds.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {selectedDestIds.map((id) => {
                      const u = getUpazilaById(id);
                      const distFromStart = calcDistanceKm(startUpazilaId, id);
                      return (
                        <span
                          key={id}
                          className="px-3 py-1 rounded-full bg-[#e6f4ea] text-[#046a4e] border border-emerald-300 text-xs font-extrabold flex items-center gap-1.5"
                        >
                          <span>
                            {lang === 'bn' ? u.nameBn : u.nameEn}
                            {id !== startUpazilaId && (
                              <span className="opacity-80 font-bold ml-1">
                                ({formatNumber(distFromStart, lang)}{' '}
                                {lang === 'bn' ? 'কিমি' : 'km'})
                              </span>
                            )}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDestUpazila(id)}
                            className="hover:text-rose-600 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* কাছাকাছি উপজেলা Quick-Add Chips (Exact Match to Reference Image) */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs text-slate-500 font-semibold mr-1">
                    {lang === 'bn' ? 'কাছাকাছি উপজেলা:' : 'Nearby Upazilas:'}
                  </span>
                  {nearbyUpazilaIds.map((nid) => {
                    const u = getUpazilaById(nid);
                    const isAdded = selectedDestIds.includes(nid);
                    const distFromStart = calcDistanceKm(startUpazilaId, nid);
                    return (
                      <button
                        key={nid}
                        type="button"
                        onClick={() => handleToggleDestUpazila(nid)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-[#046a4e] text-white'
                            : 'bg-[#EFECE6] hover:bg-[#e3dfd6] text-slate-700'
                        }`}
                      >
                        {isAdded ? '✓ ' : '+ '}
                        {lang === 'bn' ? u.nameBn : u.nameEn}{' '}
                        <span className="opacity-75">
                          ({formatNumber(distFromStart, lang)}{' '}
                          {lang === 'bn' ? 'কিমি' : 'km'})
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Helper Text + Interactive Mini Upazila Map */}
                <p className="text-xs text-slate-500 leading-relaxed">
                  {lang === 'bn'
                    ? 'নিচের ম্যাপে উপজেলায় ক্লিক করেও যোগ বা বাদ দিতে পারেন। প্রতিটি উপজেলায় কোন কোন জায়গা দেখবেন তাও বেছে নিন।'
                    : 'You can also click any upazila on the mini-map below to add or remove it, and customize which spots to visit.'}
                </p>

                {/* Interactive Mini Map Selector */}
                <div className="bg-[#FAF8F5] rounded-2xl border border-slate-200/80 p-3 flex flex-col items-center">
                  <div className="w-full max-w-[230px] aspect-[4/5]">
                    <svg viewBox="0 0 500 620" className="w-full h-full select-none">
                      {UPAZILAS.map((u) => {
                        const isStart = u.id === startUpazilaId;
                        const isDest = selectedDestIds.includes(u.id);
                        const fill = isDest
                          ? '#046a4e'
                          : isStart
                          ? '#f59e0b'
                          : '#e5e0d5';
                        const textFill =
                          isDest || isStart ? '#ffffff' : '#334155';

                        return (
                          <g
                            key={u.id}
                            onClick={() => handleToggleDestUpazila(u.id)}
                            className="cursor-pointer hover:opacity-90 transition-opacity"
                          >
                            <polygon
                              points={u.points}
                              fill={fill}
                              stroke="#ffffff"
                              strokeWidth="2.5"
                              strokeLinejoin="round"
                            />
                            <text
                              x={u.textX}
                              y={u.textY}
                              textAnchor="middle"
                              fontSize="13"
                              fontWeight="700"
                              fill={textFill}
                              className="pointer-events-none"
                            >
                              {lang === 'bn' ? u.nameBn : u.nameEn}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-bold text-slate-600 mt-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                      {lang === 'bn' ? 'শুরুর স্থান' : 'Start Point'}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#046a4e] inline-block" />
                      {lang === 'bn' ? 'ভ্রমণ গন্তব্য' : 'Selected Destinations'}
                    </span>
                  </div>
                </div>
              </div>

              <hr className="border-slate-200/80" />

              {/* STEP 3: কোন ক্রমে ঘুরবেন? */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#046a4e] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                    {lang === 'bn' ? '৩' : '3'}
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    {lang === 'bn'
                      ? 'কোন ক্রমে ঘুরবেন?'
                      : 'In what order will you travel?'}
                  </h3>
                </div>

                <label className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={optimizeShortestRoute}
                    onChange={(e) => setOptimizeShortestRoute(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#046a4e] cursor-pointer"
                  />
                  <span>
                    {lang === 'bn'
                      ? 'সবচেয়ে কম দূরত্বের রুটে সাজিয়ে দিন'
                      : 'Arrange by shortest distance route'}
                  </span>
                </label>

                <div className="p-3 rounded-xl bg-[#e6f4ea]/70 border border-emerald-200/90 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold text-[#046a4e] flex items-center gap-1.5">
                      <span>🚌</span>
                      <span>
                        {lang === 'bn'
                          ? 'বাস ভাড়া (Bus Fare)'
                          : 'Bus Fare'}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#046a4e] text-white font-extrabold">
                      {lang === 'bn' ? 'প্রতি কি.মি. ২ টাকা' : '৳2 / km'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-emerald-200/70">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span>🛺</span>
                      <span>
                        {lang === 'bn'
                          ? 'অটো রিকশা ভাড়া (Auto)'
                          : 'Auto Rickshaw Fare'}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-700 text-white font-extrabold">
                      {lang === 'bn' ? 'প্রতি কি.মি. ১৫ টাকা' : '৳15 / km'}
                    </span>
                  </div>
                </div>

                {orderedPlanUpazilaIds.length > 0 && (
                  <div className="p-3 rounded-xl bg-[#F7F6F2] border border-slate-200/80 text-xs font-bold text-slate-700 flex flex-wrap items-center gap-1.5">
                    <span className="text-amber-700">
                      {lang === 'bn'
                        ? getUpazilaById(startUpazilaId).nameBn
                        : getUpazilaById(startUpazilaId).nameEn}
                    </span>
                    {orderedPlanUpazilaIds.map((uid) => {
                      const u = getUpazilaById(uid);
                      return (
                        <React.Fragment key={uid}>
                          <span className="text-slate-400">→</span>
                          <span className="text-[#046a4e]">
                            {lang === 'bn' ? u.nameBn : u.nameEn}
                          </span>
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ============================================================ */}
            {/* RIGHT PANEL (Empty State OR Reference Timeline + Cost Card)  */}
            {/* ============================================================ */}
            <div className="lg:col-span-7">
              {orderedPlanUpazilaIds.length === 0 ? (
                /* Exact Empty State Card Matching Reference Image */
                <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-2xs text-center flex flex-col items-center justify-center min-h-[300px] space-y-4">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {lang === 'bn'
                      ? 'কোথায় কোথায় যাবেন?'
                      : 'Where would you like to go?'}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed font-medium">
                    {lang === 'bn'
                      ? 'বাম দিক থেকে শুরুর উপজেলা আর যে উপজেলাগুলোতে যেতে চান সেগুলো বেছে নিন। আপনার ভ্রমণ পরিকল্পনা এখানে দিনে দিনে সাজানো হবে।'
                      : 'Select your starting upazila and the upazilas you want to visit from the left panel. Your day-by-day travel plan will be arranged here.'}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#e6f4ea] text-[#046a4e] text-xs font-extrabold">
                      <span>🚌</span>
                      <span>
                        {lang === 'bn'
                          ? 'বাস ভাড়া: ২ টাকা/কি.মি.'
                          : 'Bus Fare: ৳2/km'}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-extrabold">
                      <span>🛺</span>
                      <span>
                        {lang === 'bn'
                          ? 'অটো রিকশা: ১৫ টাকা/কি.মি.'
                          : 'Auto Rickshaw: ৳15/km'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleLoadExampleRoute}
                      className="px-6 py-3.5 rounded-full bg-[#121917] hover:bg-slate-800 text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all cursor-pointer"
                    >
                      {lang === 'bn'
                        ? 'উদাহরণ দেখুন: দিনাজপুর সদর থেকে কাহারোল, বীরগঞ্জ, নবাবগঞ্জ, ঘোড়াঘাট'
                        : 'See Example: Dinajpur Sadar to Kaharole, Birganj, Nawabganj, Ghoraghat'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Exact Timeline Day-by-Day Cards + Itemized Cost Card Matching Uploaded Images */
                <div className="space-y-5">
                  {orderedPlanUpazilaIds.map((uid, idx) => {
                    const upazila = getUpazilaById(uid);
                    const prevId =
                      idx === 0
                        ? startUpazilaId
                        : orderedPlanUpazilaIds[idx - 1];
                    const prevUpazila = getUpazilaById(prevId);
                    const isLastDay = idx === orderedPlanUpazilaIds.length - 1;
                    const startUpazila = getUpazilaById(startUpazilaId);

                    const legKm =
                      uid === prevId ? 10 : calcDistanceKm(prevId, uid);
                    const legBusFare = calcBusFare(legKm);
                    const legAutoFare = Math.round(
                      legKm * AUTO_RICKSHAW_FARE_PER_KM
                    );
                    const legDuration = formatDurationEst(legKm, lang);

                    const meta =
                      UPAZILA_PLANNER_META[uid] || UPAZILA_PLANNER_META.sadar;
                    const upazilaSpots = SPOTS.filter(
                      (s) => s.upazilaId === uid
                    );

                    return (
                      <div
                        key={uid}
                        className="bg-white rounded-2xl border border-[#e6e2d8] overflow-hidden shadow-2xs"
                      >
                        {/* Day Card Header matching Reference Image 1 */}
                        <div className="px-5 py-4 border-b border-[#ece8df] flex flex-wrap items-center gap-3 bg-[#fdfcfa]">
                          <span className="px-3.5 py-1 rounded-full bg-[#1b6b50] text-white text-xs sm:text-sm font-extrabold">
                            {lang === 'bn'
                              ? `দিন ${formatNumber(idx + 1, 'bn')}`
                              : `Day ${idx + 1}`}
                          </span>
                          <h4 className="text-base sm:text-lg font-extrabold text-slate-900 flex flex-wrap items-center gap-1.5">
                            <span>
                              {lang === 'bn'
                                ? prevUpazila.nameBn
                                : prevUpazila.nameEn}
                            </span>
                            <span className="text-slate-400 font-normal">→</span>
                            <span>
                              {lang === 'bn' ? upazila.nameBn : upazila.nameEn}
                            </span>
                            {isLastDay && uid !== startUpazilaId && (
                              <>
                                <span className="text-slate-400 font-normal">
                                  →
                                </span>
                                <span>
                                  {lang === 'bn'
                                    ? startUpazila.nameBn
                                    : startUpazila.nameEn}
                                </span>
                              </>
                            )}
                          </h4>
                        </div>

                        {/* Timeline Rows Inside Day Card */}
                        <div className="px-5 divide-y divide-[#efece4]">
                          {/* 1. Transport Row (Upazila to Upazila) */}
                          <div className="py-4 flex items-start gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-[#f3f0e8] flex items-center justify-center text-lg shrink-0">
                              🚌
                            </div>
                            <div className="space-y-0.5 min-w-0 flex-1">
                              <div className="text-sm sm:text-base font-extrabold text-slate-900">
                                {lang === 'bn'
                                  ? `${prevUpazila.nameBn} থেকে ${upazila.nameBn}`
                                  : `${prevUpazila.nameEn} to ${upazila.nameEn}`}
                              </div>
                              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                {lang === 'bn'
                                  ? `লোকাল বাস বা অটো রিকশাতে · দূরত্ব ${formatNumber(
                                      legKm,
                                      'bn'
                                    )} কিমি · ${legDuration} · বাস ভাড়া জনপ্রতি ~৳${formatNumber(
                                      legBusFare,
                                      'bn'
                                    )} (২৳/কিমি) | অটো রিকশা ~৳${formatNumber(
                                      legAutoFare,
                                      'bn'
                                    )} (১৫৳/কিমি)`
                                  : `Local Bus or Auto Rickshaw · ${legKm} km · ${legDuration} · Bus ~৳${legBusFare} (৳2/km) | Auto ~৳${legAutoFare} (৳15/km)`}
                              </div>
                            </div>
                          </div>

                          {/* 2. Local Famous Food Row (স্থানীয় বিখ্যাত খাবার) */}
                          <div className="py-4 flex items-start gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-[#f3f0e8] flex items-center justify-center text-lg shrink-0">
                              🍽️
                            </div>
                            <div className="space-y-0.5 min-w-0 flex-1">
                              <div className="text-sm sm:text-base font-extrabold text-slate-900">
                                {lang === 'bn'
                                  ? 'স্থানীয় বিখ্যাত খাবার'
                                  : 'Famous Local Food'}
                              </div>
                              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                {lang === 'bn'
                                  ? meta.foodTipBn
                                  : meta.foodTipEn}
                              </div>
                            </div>
                          </div>

                          {/* 3. Sightseeing Spot Rows (📍 with clickable underline title, 🕒 duration, 💰 entry fee, exact road km) */}
                          {upazilaSpots.map((spot) => {
                            const visitInfo = getSpotVisitInfo(spot, lang);
                            const spotDistMeta = EXACT_SPOT_ROAD_KM[spot.id] || {
                              fromUpazilaKm: 4.5,
                              fromSadarKm: calcDistanceKm('sadar', spot.upazilaId),
                            };
                            const localSpotKm = spotDistMeta.fromUpazilaKm;
                            const fromSadarKm = spotDistMeta.fromSadarKm;
                            const localSpotAutoFare = Math.round(
                              localSpotKm * AUTO_RICKSHAW_FARE_PER_KM
                            );

                            return (
                              <div
                                key={spot.id}
                                className="py-4 flex items-start gap-3.5"
                              >
                                {spot.defaultImage ? (
                                  <img
                                    src={spot.defaultImage}
                                    alt={
                                      lang === 'bn' ? spot.nameBn : spot.nameEn
                                    }
                                    onClick={() =>
                                      onOpenSpotDrawer && onOpenSpotDrawer(spot)
                                    }
                                    className="w-16 h-12 sm:w-20 sm:h-14 rounded-xl object-cover shrink-0 border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-xl bg-[#f3f0e8] flex items-center justify-center text-lg shrink-0">
                                    📍
                                  </div>
                                )}

                                <div className="space-y-1 min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        onOpenSpotDrawer &&
                                        onOpenSpotDrawer(spot)
                                      }
                                      className="text-sm sm:text-base font-extrabold text-slate-900 underline decoration-slate-400 underline-offset-4 hover:text-[#046a4e] hover:decoration-[#046a4e] text-left cursor-pointer transition-colors"
                                    >
                                      {lang === 'bn'
                                        ? spot.nameBn
                                        : spot.nameEn}
                                    </button>
                                    <span className="px-2.5 py-0.5 rounded-full bg-[#faefd4] text-[#8c5811] text-[11px] font-bold">
                                      {lang === 'bn'
                                        ? spot.categoryBn
                                        : spot.categoryEn}
                                    </span>
                                  </div>

                                  <div className="text-xs sm:text-sm text-slate-600 flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <span>🕒 {visitInfo.duration}</span>
                                    <span>·</span>
                                    <span>💰 {visitInfo.entryText}</span>
                                    <span>·</span>
                                    <span>
                                      {lang === 'bn'
                                        ? `উপজেলা সদর থেকে ${formatNumber(
                                            localSpotKm,
                                            'bn'
                                          )} কিমি (অটো ~৳${formatNumber(
                                            localSpotAutoFare,
                                            'bn'
                                          )})`
                                        : `${localSpotKm} km from Upazila center (Auto ~৳${localSpotAutoFare})`}
                                    </span>
                                    {spot.upazilaId !== 'sadar' && (
                                      <>
                                        <span>·</span>
                                        <span className="text-emerald-800 font-semibold">
                                          {lang === 'bn'
                                            ? `দিনাজপুর সদর থেকে ${formatNumber(
                                                fromSadarKm,
                                                'bn'
                                              )} কিমি`
                                            : `${fromSadarKm} km from Dinajpur Sadar`}
                                        </span>
                                      </>
                                    )}
                                  </div>

                                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                    {lang === 'bn'
                                      ? spot.descriptionBn
                                      : spot.descriptionEn}
                                  </p>
                                </div>
                              </div>
                            );
                          })}

                          {/* 4. Final Day Return Trip Row (Matching Reference Image 2) */}
                          {isLastDay && uid !== startUpazilaId && (
                            <div className="py-4 flex items-start gap-3.5">
                              <div className="w-10 h-10 rounded-xl bg-[#f3f0e8] flex items-center justify-center text-lg shrink-0">
                                🚌
                              </div>
                              <div className="space-y-0.5 min-w-0 flex-1">
                                <div className="text-sm sm:text-base font-extrabold text-slate-900">
                                  {lang === 'bn'
                                    ? `${upazila.nameBn} থেকে ${startUpazila.nameBn}`
                                    : `${upazila.nameEn} to ${startUpazila.nameEn}`}
                                </div>
                                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                  {lang === 'bn'
                                    ? `আন্তঃউপজেলা বাসে বা অটোতে · প্রায় ${formatNumber(
                                        plannerSummary.returnKm,
                                        'bn'
                                      )} কিমি · ${formatDurationEst(
                                        plannerSummary.returnKm,
                                        lang
                                      )} · বাস জনপ্রতি ~৳${formatNumber(
                                        plannerSummary.returnBusFare,
                                        'bn'
                                      )} (অটো ~৳${formatNumber(
                                        plannerSummary.returnAutoFare,
                                        'bn'
                                      )})`
                                    : `Inter-upazila Bus or Auto · ~${
                                        plannerSummary.returnKm
                                      } km · ${formatDurationEst(
                                        plannerSummary.returnKm,
                                        lang
                                      )} · Bus ~৳${
                                        plannerSummary.returnBusFare
                                      } (Auto ~৳${
                                        plannerSummary.returnAutoFare
                                      })`}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Day Card Footer Banner: 🌙 রাতে থাকুন OR ✓ ভ্রমণ শেষ · ফিরে এলেন */}
                        {!isLastDay ? (
                          <div className="bg-[#f0f5fc] border-t border-[#dce6f5] px-5 py-3 text-center text-xs sm:text-sm text-[#1e3a5f] font-medium">
                            <span>🌙 </span>
                            <span>
                              {lang === 'bn' ? 'রাতে থাকুন: ' : 'Overnight Stay: '}
                            </span>
                            <strong className="font-extrabold">
                              {lang === 'bn' ? upazila.nameBn : upazila.nameEn}
                            </strong>
                            <span>
                              {' — '}
                              {lang === 'bn' ? meta.stayBn : meta.stayEn}
                            </span>
                          </div>
                        ) : (
                          <div className="bg-[#e5f3ec] border-t border-[#cbe6d8] px-5 py-3 text-center text-xs sm:text-sm font-extrabold text-[#146348]">
                            ✓{' '}
                            {lang === 'bn'
                              ? `ভ্রমণ শেষ · ফিরে এলেন ${startUpazila.nameBn}`
                              : `Trip Complete · Returned to ${startUpazila.nameEn}`}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* ======================================================== */}
                  {/* ITEMIZED COST CARD (আনুমানিক খরচ · মাঝারি - Image 2)      */}
                  {/* ======================================================== */}
                  <div className="bg-white rounded-2xl border border-[#e6e2d8] p-5 sm:p-7 shadow-2xs space-y-4">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900">
                      {lang === 'bn'
                        ? 'আনুমানিক খরচ · মাঝারি'
                        : 'Estimated Cost · Moderate'}
                    </h3>

                    <div className="divide-y divide-[#efece4] text-xs sm:text-sm">
                      {/* Row 1: যাতায়াত (উপজেলা থেকে উপজেলা) */}
                      <div className="py-3.5 flex items-start justify-between gap-4">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900">
                            {lang === 'bn'
                              ? 'যাতায়াত (উপজেলা থেকে উপজেলা)'
                              : 'Inter-Upazila Transport'}
                          </div>
                          <div className="text-xs text-slate-500">
                            {lang === 'bn'
                              ? `১ জনের বাস ভাড়া (~${formatNumber(
                                  plannerSummary.totalKm,
                                  'bn'
                                )} কিমি × ২৳/কিমি) · পুরো রুটে রিজার্ভ/অটো নিলে ~৳${formatNumber(
                                  plannerSummary.totalAutoFare,
                                  'bn'
                                )} (১৫৳/কিমি)`
                              : `1 person bus fare (~${plannerSummary.totalKm} km × ৳2/km) · Full route by Auto ~৳${plannerSummary.totalAutoFare} (৳15/km)`}
                          </div>
                        </div>
                        <div className="font-extrabold text-slate-900 tabular-nums shrink-0">
                          ৳{formatNumber(plannerSummary.totalBusFare, lang)}
                        </div>
                      </div>

                      {/* Row 2: থাকা */}
                      <div className="py-3.5 flex items-start justify-between gap-4">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900">
                            {lang === 'bn' ? 'থাকা' : 'Accommodation'}
                          </div>
                          <div className="text-xs text-slate-500">
                            {plannerSummary.nightsCount > 0
                              ? lang === 'bn'
                                ? `${formatNumber(
                                    plannerSummary.nightsCount,
                                    'bn'
                                  )} রাত × ১টি রুম × ৳${formatNumber(
                                    plannerSummary.stayRatePerNight,
                                    'bn'
                                  )}`
                                : `${plannerSummary.nightsCount} nights × 1 room × ৳${plannerSummary.stayRatePerNight}`
                              : lang === 'bn'
                              ? 'ডে-ট্রিপ (রাত্রিযাপন নেই)'
                              : 'Day trip (No overnight stay)'}
                          </div>
                        </div>
                        <div className="font-extrabold text-slate-900 tabular-nums shrink-0">
                          ৳{formatNumber(plannerSummary.stayCost, lang)}
                        </div>
                      </div>

                      {/* Row 3: খাবার */}
                      <div className="py-3.5 flex items-start justify-between gap-4">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900">
                            {lang === 'bn' ? 'খাবার' : 'Food & Meals'}
                          </div>
                          <div className="text-xs text-slate-500">
                            {lang === 'bn'
                              ? `${formatNumber(
                                  plannerSummary.daysCount,
                                  'bn'
                                )} দিন × ১ জন × ৳${formatNumber(
                                  plannerSummary.foodRatePerDay,
                                  'bn'
                                )}`
                              : `${plannerSummary.daysCount} days × 1 person × ৳${plannerSummary.foodRatePerDay}`}
                          </div>
                        </div>
                        <div className="font-extrabold text-slate-900 tabular-nums shrink-0">
                          ৳{formatNumber(plannerSummary.foodCost, lang)}
                        </div>
                      </div>

                      {/* Row 4: স্থানীয় যাতায়াত */}
                      <div className="py-3.5 flex items-start justify-between gap-4">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900">
                            {lang === 'bn'
                              ? 'স্থানীয় যাতায়াত'
                              : 'Local Transport (Spots)'}
                          </div>
                          <div className="text-xs text-slate-500">
                            {lang === 'bn'
                              ? `অটো রিকশা (১৫৳/কিমি), ইজিবাইক, ভ্যান — ${formatNumber(
                                  plannerSummary.daysCount,
                                  'bn'
                                )} দিন`
                              : `Auto Rickshaw (৳15/km), Easybike, Van — ${plannerSummary.daysCount} days`}
                          </div>
                        </div>
                        <div className="font-extrabold text-slate-900 tabular-nums shrink-0">
                          ৳
                          {formatNumber(
                            plannerSummary.localTransportCost,
                            lang
                          )}
                        </div>
                      </div>

                      {/* Row 5: প্রবেশ ফি ও অন্যান্য */}
                      <div className="py-3.5 flex items-start justify-between gap-4">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900">
                            {lang === 'bn'
                              ? 'প্রবেশ ফি ও অন্যান্য'
                              : 'Entry Fees & Miscellaneous'}
                          </div>
                          <div className="text-xs text-slate-500">
                            {lang === 'bn' ? 'প্রায় ১০%' : 'Approx. 10%'}
                          </div>
                        </div>
                        <div className="font-extrabold text-slate-900 tabular-nums shrink-0">
                          ৳
                          {formatNumber(plannerSummary.entryAndMiscCost, lang)}
                        </div>
                      </div>

                      {/* Row 6: মোট */}
                      <div className="pt-4 pb-2 flex items-center justify-between gap-4">
                        <div className="text-base sm:text-lg font-black text-slate-900">
                          {lang === 'bn' ? 'মোট' : 'Total'}
                        </div>
                        <div className="text-lg sm:text-xl font-black text-slate-900 tabular-nums">
                          ৳
                          {formatNumber(
                            plannerSummary.grandTotalModerate,
                            lang
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Per Person Range Box matching Reference Image 2 */}
                    <div className="p-3.5 rounded-xl bg-[#faf8f4] border border-[#e6e2d8] text-xs sm:text-sm text-slate-700 font-medium">
                      {lang === 'bn' ? (
                        <>
                          জনপ্রতি প্রায়{' '}
                          <strong className="font-black text-slate-900">
                            ৳
                            {formatNumber(
                              plannerSummary.grandTotalModerate,
                              'bn'
                            )}
                          </strong>{' '}
                          · বাস্তবে ৳{formatNumber(plannerSummary.minRange, 'bn')}{' '}
                          – ৳{formatNumber(plannerSummary.maxRange, 'bn')} এর মধ্যে
                          হতে পারে (অটো রিকশা ১৫৳/কিমি বা বাস ২৳/কিমি ভেদে)
                        </>
                      ) : (
                        <>
                          Approx.{' '}
                          <strong className="font-black text-slate-900">
                            ৳
                            {formatNumber(
                              plannerSummary.grandTotalModerate,
                              'en'
                            )}
                          </strong>{' '}
                          per person · In reality it may range between ৳
                          {formatNumber(plannerSummary.minRange, 'en')} – ৳
                          {formatNumber(plannerSummary.maxRange, 'en')}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Yellow Warning Disclaimer Box Matching Bottom of Reference Image 2 */}
                  <div className="p-4 rounded-2xl bg-[#fefaf0] border border-[#f3dfb8] text-xs sm:text-sm text-[#784912] leading-relaxed font-medium">
                    ⚠️{' '}
                    {lang === 'bn'
                      ? 'দূরত্ব, সময়, ভাড়া ও হোটেলের খরচ আনুমানিক (ভাড়া একুরেট না, একটি গড় অনুমান করে রাখা হয়েছে) — রাস্তা, মৌসুম ও দরদাম অনুযায়ী বদলায়। যাওয়ার আগে সর্বশেষ তথ্য যাচাই করে নিন। কোনো জায়গার নামে ক্লিক করলে বিস্তারিত দেখতে পাবেন।'
                      : 'Distance, time, fares (Bus ৳2/km, Auto ৳15/km), and hotel costs are approximate estimates — they vary by season and bargaining. Click on any spot name to view full details.'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB 2: DINAJPUR HERITAGE & TRAVEL QUIZ GAME                        */}
      {/* ================================================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl border border-slate-200/85 p-5 sm:p-8 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Active Question or Final Score Card */}
            <div className="lg:col-span-8 bg-[#F9F8F5] rounded-2xl border border-slate-200/90 p-5 sm:p-6">
              {!quizCompleted ? (
                <div className="space-y-5">
                  {/* Progress Header */}
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>
                      {lang === 'bn'
                        ? `প্রশ্ন ${formatNumber(currentQIdx + 1, 'bn')} / ${formatNumber(
                            DINAJPUR_QUIZ_QUESTIONS.length,
                            'bn'
                          )}`
                        : `Question ${currentQIdx + 1} of ${
                            DINAJPUR_QUIZ_QUESTIONS.length
                          }`}
                    </span>
                    <span className="text-emerald-700">
                      {lang === 'bn'
                        ? `বর্তমান স্কোর: ${formatNumber(score, 'bn')}`
                        : `Current Score: ${score}`}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-300"
                      style={{
                        width: `${Math.round(
                          ((currentQIdx + 1) / DINAJPUR_QUIZ_QUESTIONS.length) *
                            100
                        )}%`,
                      }}
                    />
                  </div>

                  {/* Question Text */}
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                    {lang === 'bn'
                      ? currentQuestion.questionBn
                      : currentQuestion.questionEn}
                  </h3>

                  {/* 4 Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(lang === 'bn'
                      ? currentQuestion.optionsBn
                      : currentQuestion.optionsEn
                    ).map((opt, idx) => {
                      const isPicked = selectedOption === idx;
                      const isCorrect = idx === currentQuestion.correctIndex;
                      let btnStyle =
                        'bg-white border-slate-200/90 text-slate-800 hover:border-emerald-500 hover:bg-emerald-50/30';

                      if (selectedOption !== null) {
                        if (isCorrect) {
                          btnStyle =
                            'bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-500';
                        } else if (isPicked && !isCorrect) {
                          btnStyle =
                            'bg-rose-50 border-rose-500 text-rose-950';
                        } else {
                          btnStyle =
                            'bg-white/60 border-slate-200 text-slate-400 opacity-75';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectQuizOption(idx)}
                          disabled={selectedOption !== null}
                          className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-bold transition-all flex items-center justify-between gap-2 cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {selectedOption !== null && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {selectedOption !== null &&
                            isPicked &&
                            !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation & Next Button */}
                  {selectedOption !== null && (
                    <div className="p-4 rounded-xl bg-white border border-slate-200/90 space-y-3">
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        <strong className="text-emerald-700">
                          {lang === 'bn' ? 'ব্যাখ্যা: ' : 'Fact: '}
                        </strong>
                        {lang === 'bn'
                          ? currentQuestion.explanationBn
                          : currentQuestion.explanationEn}
                      </p>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleNextQuestion}
                          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <span>
                            {currentQIdx + 1 < DINAJPUR_QUIZ_QUESTIONS.length
                              ? lang === 'bn'
                                ? 'পরবর্তী প্রশ্ন →'
                                : 'Next Question →'
                              : lang === 'bn'
                              ? 'ফলাফল দেখুন 🏆'
                              : 'See Final Score 🏆'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">
                    {lang === 'bn'
                      ? `অভিনন্দন, ${playerName}!`
                      : `Congratulations, ${playerName}!`}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 font-medium">
                    {lang === 'bn'
                      ? `আপনি ${formatNumber(
                          DINAJPUR_QUIZ_QUESTIONS.length,
                          'bn'
                        )}টি প্রশ্নের মধ্যে ${formatNumber(
                          score,
                          'bn'
                        )}টির সঠিক উত্তর দিয়েছেন!`
                      : `You answered ${score} out of ${DINAJPUR_QUIZ_QUESTIONS.length} questions correctly!`}
                  </p>
                  <div className="text-3xl font-black text-emerald-700">
                    {formatNumber(
                      Math.round(
                        (score / DINAJPUR_QUIZ_QUESTIONS.length) * 100
                      ),
                      lang
                    )}
                    %
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleRestartQuiz}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>
                        {lang === 'bn' ? 'আবার খেলুন' : 'Play Quiz Again'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Quiz Info & Badges */}
            <div className="lg:col-span-4 bg-gradient-to-br from-[#162a3a] via-[#1c3b4d] to-[#0f1e29] text-white rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <Award className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold">
                    {lang === 'bn'
                      ? 'দিনাজপুর জ্ঞান চ্যালেঞ্জ'
                      : 'Dinajpur Trivia Challenge'}
                  </h4>
                  <p className="text-xs text-white/70">
                    {lang === 'bn'
                      ? 'আপনি দিনাজপুরকে কতটুকু চেনেন?'
                      : 'Test your knowledge of Dinajpur'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-white/80 leading-relaxed">
                {lang === 'bn'
                  ? 'কান্তজিউ মন্দির, রামসাগর, নয়াবাদ মসজিদ, পার্বতীপুর খনি এবং দিনাজপুরের বিখ্যাত লিচু ও কাটারিভোগ চাল নিয়ে ৬টি বাছাইকৃত প্রশ্ন।'
                  : 'Answer 6 curated questions covering Kantaji Temple, Ramsagar, Nayabad Mosque, Parbatipur mines, and GI-certified local delicacies.'}
              </p>

              <div className="bg-white/10 rounded-xl p-3.5 border border-white/15 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/70">
                    {lang === 'bn' ? '৫–৬ স্কোর:' : '5–6 Correct:'}
                  </span>
                  <span className="font-bold text-emerald-300">
                    {lang === 'bn'
                      ? 'দিনাজপুর বিশেষজ্ঞ 🏆'
                      : 'Dinajpur Master 🏆'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">
                    {lang === 'bn' ? '৩–৪ স্কোর:' : '3–4 Correct:'}
                  </span>
                  <span className="font-bold text-sky-300">
                    {lang === 'bn' ? 'হেরিটেজ অভিযাত্রী' : 'Heritage Explorer'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">
                    {lang === 'bn' ? '০–২ স্কোর:' : '0–2 Correct:'}
                  </span>
                  <span className="font-bold text-amber-300">
                    {lang === 'bn' ? 'নবীন পর্যটক' : 'New Traveler'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB 3: HIDDEN GEMS & FAMOUS FOOD SHOWCASE + SUBMISSION STUDIO      */}
      {/* ================================================================== */}
      {activeTab === 'gems' && (
        <div className="bg-[#FAF8F5] rounded-[32px] border border-[#e6e2d8] p-5 sm:p-8 lg:p-10 shadow-2xs space-y-8">
          {/* 1. Centered Editorial Header (Distinct Hangout Dinajpur Wording & Style) */}
          <div className="text-center max-w-2xl mx-auto space-y-3.5">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#e3f2ed] text-[#0b5c43] text-xs sm:text-sm font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {lang === 'bn'
                  ? 'হ্যাংআউট দিনাজপুর · ভ্রমণকারীদের উন্মুক্ত সংগ্রহশালা'
                  : 'Hangout Dinajpur · Traveler Community Archive'}
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {lang === 'bn' ? (
                <>
                  <span className="text-[#1a1a1a]">লুকানো রত্ন </span>
                  <span className="bg-gradient-to-r from-[#046a4e] via-[#1b8a6b] to-[#e13b45] bg-clip-text text-transparent">
                    ও ঐতিহ্য
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[#1a1a1a]">Hidden Gems </span>
                  <span className="bg-gradient-to-r from-[#046a4e] via-[#1b8a6b] to-[#e13b45] bg-clip-text text-transparent">
                    & Flavors
                  </span>
                </>
              )}
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-medium">
              {lang === 'bn'
                ? 'দিনাজপুর কিংবা আপনার এলাকার কম পরিচিত কোনো দর্শনীয় স্থান, গ্রামীণ সৌন্দর্য অথবা বিখ্যাত স্থানীয় খাবারের ছবি ও তথ্য এখানে শেয়ার করুন। আপনার যোগ করা স্থানটি সাথে সাথে আপনার নামসহ লুকানো রত্ন গ্যালারিতে যুক্ত হয়ে যাবে।'
                : 'Share lesser-known scenic spots, heritage corners, or famous local delicacies from Dinajpur and beyond. Your contribution will be added directly to the Hidden Gems gallery with your name.'}
            </p>

            {/* Dual Action Trigger Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setGemFormMode((prev) => (prev === 'gem' ? 'none' : 'gem'))
                }
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold border transition-all flex items-center gap-2 cursor-pointer ${
                  gemFormMode === 'gem'
                    ? 'bg-[#046a4e] text-white border-[#046a4e] shadow-sm'
                    : 'bg-white hover:bg-emerald-50/60 text-slate-900 border-slate-800 shadow-2xs'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>
                  {lang === 'bn'
                    ? 'নতুন দর্শনীয় স্থান যুক্ত করুন'
                    : 'Add a Hidden Spot'}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setGemFormMode((prev) => (prev === 'food' ? 'none' : 'food'))
                }
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold border transition-all flex items-center gap-2 cursor-pointer ${
                  gemFormMode === 'food'
                    ? 'bg-amber-700 text-white border-amber-700 shadow-sm'
                    : 'bg-white hover:bg-amber-50/60 text-slate-900 border-slate-800 shadow-2xs'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>
                  {lang === 'bn'
                    ? 'ঐতিহ্যবাহী খাবার বা পণ্য যুক্ত করুন'
                    : 'Add Local Food or Specialty'}
                </span>
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 2. EXPANDABLE SUBMISSION STUDIO CARD (Distinct Warm-Editorial) */}
          {/* ============================================================== */}
          {gemFormMode !== 'none' && (
            <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-[#dfd9ce] shadow-md overflow-hidden">
              {/* Top Accent Header Banner */}
              <div
                className={`px-6 py-4 flex items-center justify-between gap-3 border-b ${
                  gemFormMode === 'food'
                    ? 'bg-gradient-to-r from-amber-50 via-[#fdfaf3] to-white border-amber-200/70'
                    : 'bg-gradient-to-r from-[#e6f4ea] via-[#f5fbf7] to-white border-emerald-200/70'
                }`}
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    {gemFormMode === 'food'
                      ? lang === 'bn'
                        ? 'জনপ্রিয় খাবার বা স্থানীয় পণ্য তালিকাভুক্ত করুন'
                        : 'Add a Famous Local Food or Product'
                      : lang === 'bn'
                      ? 'নতুন লুকানো রত্ন গ্যালারিতে যুক্ত করুন'
                      : 'Add a New Hidden Gem to the Gallery'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === 'bn'
                      ? '* চিহ্নিত ঘরগুলো পূরণ করে ছবি দিলেই আপনার নামসহ সরাসরি নিচে গ্যালারিতে প্রদর্শিত হবে।'
                      : 'Fill out the required (*) fields and add photos to display it immediately in the gallery below.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setGemFormMode('none')}
                  className="p-2 rounded-full bg-white/80 hover:bg-slate-100 text-slate-500 border border-slate-200 cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={handleSubmitGemOrFood}
                className="p-6 sm:p-8 space-y-7"
              >
                {/* SECTION A: স্থান বা খাবারের বিবরণ */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#046a4e] border-b border-slate-100 pb-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {gemFormMode === 'food'
                        ? lang === 'bn'
                          ? 'খাবার বা পণ্যের পরিচিতি'
                          : 'Food or Product Details'
                        : lang === 'bn'
                        ? 'স্থানের পরিচিতি'
                        : 'Spot Details'}
                    </span>
                  </div>

                  {/* জায়গার নাম / খাবারের নাম */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                      {gemFormMode === 'food'
                        ? lang === 'bn'
                          ? 'খাবার বা পণ্যের নাম *'
                          : 'Product or Food Name *'
                        : lang === 'bn'
                        ? 'দর্শনীয় স্থানের নাম *'
                        : 'Place Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder={
                        gemFormMode === 'food'
                          ? lang === 'bn'
                            ? 'যেমন: কালীতলার বুটের হালুয়া বা মাশিমপুরের বেদানা লিচু'
                            : 'e.g., Kalitala Halwa or Mashimpur Lychee'
                          : lang === 'bn'
                          ? 'যেমন: আশুরার বিলের কাঠের সেতু বা আওকরা মসজিদ'
                          : 'e.g., Ashurar Beel Wooden Bridge'
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-slate-300/90 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#046a4e] focus:outline-none"
                    />
                  </div>

                  {/* জেলা (শুধু দিনাজপুর) & উপজেলা / এলাকা */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                        {lang === 'bn' ? 'জেলা *' : 'District *'}
                      </label>
                      <select
                        value={formDistrict}
                        onChange={(e) => setFormDistrict(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-slate-300/90 text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:border-[#046a4e] focus:outline-none cursor-pointer"
                      >
                        <option value="দিনাজপুর">
                          {lang === 'bn' ? 'দিনাজপুর (Dinajpur)' : 'Dinajpur'}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                        {lang === 'bn'
                          ? 'উপজেলা বা এলাকার নাম *'
                          : 'Upazila / Area *'}
                      </label>
                      <input
                        type="text"
                        required
                        list="dinajpur-upazila-suggestions"
                        value={formUpazila}
                        onChange={(e) => setFormUpazila(e.target.value)}
                        placeholder={
                          lang === 'bn'
                            ? 'যেমন: নবাবগঞ্জ, কাহারোল বা বাহাদুর বাজার'
                            : 'e.g., Nawabganj, Kaharole, Fulbari'
                        }
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-slate-300/90 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#046a4e] focus:outline-none"
                      />
                      <datalist id="dinajpur-upazila-suggestions">
                        {UPAZILAS.map((u) => (
                          <option
                            key={u.id}
                            value={lang === 'bn' ? u.nameBn : u.nameEn}
                          />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  {/* ক্যাটাগরি & গুগল ম্যাপ লিংক */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                        {gemFormMode === 'food'
                          ? lang === 'bn'
                            ? 'খাবার বা পণ্যের ধরন *'
                            : 'Food or Product Category *'
                          : lang === 'bn'
                          ? 'স্থানের ধরন / ক্যাটাগরি *'
                          : 'Place Category *'}
                      </label>
                      <select
                        required
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-slate-300/90 text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:border-[#046a4e] focus:outline-none cursor-pointer"
                      >
                        <option value="">
                          {lang === 'bn' ? 'ক্যাটাগরি নির্বাচন করুন' : 'Select Category'}
                        </option>
                        {gemFormMode === 'food' ? (
                          <>
                            <option value="ঐতিহ্যবাহী মিষ্টান্ন ও হালুয়া">
                              {lang === 'bn'
                                ? 'ঐতিহ্যবাহী মিষ্টান্ন ও হালুয়া'
                                : 'Traditional Sweets & Halwa'}
                            </option>
                            <option value="জিআই পণ্য ও সুগন্ধি চাল/চিড়া">
                              {lang === 'bn'
                                ? 'জিআই পণ্য ও সুগন্ধি চাল/চিড়া'
                                : 'GI Product & Kataribhog Rice'}
                            </option>
                            <option value="মৌসুমি ফল ও বাগান (লিচু/আম)">
                              {lang === 'bn'
                                ? 'মৌসুমি ফল ও বাগান (লিচু/আম)'
                                : 'Seasonal Fruit & Orchards'}
                            </option>
                            <option value="জনপ্রিয় স্ট্রিট ফুড ও নাস্তা">
                              {lang === 'bn'
                                ? 'জনপ্রিয় স্ট্রিট ফুড ও নাস্তা'
                                : 'Popular Street Food & Snacks'}
                            </option>
                            <option value="গ্রামীণ হস্তশিল্প ও ঐতিহ্য">
                              {lang === 'bn'
                                ? 'গ্রামীণ হস্তশিল্প ও ঐতিহ্য'
                                : 'Local Craft & Specialty'}
                            </option>
                          </>
                        ) : (
                          <>
                            <option value="নদী, বিল ও প্রাকৃতিক সৌন্দর্য">
                              {lang === 'bn'
                                ? 'নদী, বিল ও প্রাকৃতিক সৌন্দর্য'
                                : 'River, Beel & Nature'}
                            </option>
                            <option value="প্রাচীন মন্দির, মসজিদ ও জমিদার বাড়ি">
                              {lang === 'bn'
                                ? 'প্রাচীন মন্দির, মসজিদ ও জমিদার বাড়ি'
                                : 'Historic Mosque, Temple & Palace'}
                            </option>
                            <option value="শালবন ও গ্রামীণ মেঠোপথ">
                              {lang === 'bn'
                                ? 'শালবন ও গ্রামীণ মেঠোপথ'
                                : 'Sal Forest & Rural Trail'}
                            </option>
                            <option value="পিকনিক স্পট ও ইকো রিসোর্ট">
                              {lang === 'bn'
                                ? 'পিকনিক স্পট ও ইকো রিসোর্ট'
                                : 'Picnic Spot & Eco Resort'}
                            </option>
                            <option value="প্রত্নতাত্ত্বিক ও ঐতিহাসিক স্থান">
                              {lang === 'bn'
                                ? 'প্রত্নতাত্ত্বিক ও ঐতিহাসিক স্থান'
                                : 'Archaeological Site'}
                            </option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                        {lang === 'bn'
                          ? 'গুগল ম্যাপ লোকেশন লিংক (ঐচ্ছিক)'
                          : 'Google Maps Link (Optional)'}
                      </label>
                      <input
                        type="url"
                        value={formMapUrl}
                        onChange={(e) => setFormMapUrl(e.target.value)}
                        placeholder="https://maps.google.com/..."
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-slate-300/90 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:border-[#046a4e] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* সংক্ষিপ্ত বিবরণ */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                      {lang === 'bn'
                        ? 'সংক্ষিপ্ত বিবরণ ও বিশেষত্ব'
                        : 'Short Description & Highlights'}
                    </label>
                    <textarea
                      rows={2}
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder={
                        lang === 'bn'
                          ? 'কীভাবে যাওয়া যায়, দেখার সেরা সময় বা খাবারের বিশেষত্ব সম্পর্কে ২–৩ লাইনে লিখুন...'
                          : 'Describe how to reach, best time to visit, or why locals love it...'
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-slate-300/90 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:border-[#046a4e] focus:outline-none"
                    />
                  </div>

                  {/* আশেপাশে খাবারের ব্যবস্থা & যাতায়াত/সুবিধা */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                        {lang === 'bn'
                          ? 'আশেপাশে খাবারের ব্যবস্থা *'
                          : 'Nearby Food Options *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formFoodNearby}
                        onChange={(e) => setFormFoodNearby(e.target.value)}
                        placeholder={
                          lang === 'bn'
                            ? 'যেমন: স্থানীয় বাজারে চা-নাস্তা ও হোটেল আছে'
                            : 'e.g., Local tea stalls and restaurants nearby'
                        }
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-slate-300/90 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:border-[#046a4e] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                        {lang === 'bn'
                          ? 'যাতায়াত ও অন্যান্য সুবিধা (ঐচ্ছিক)'
                          : 'Transport & Facilities (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={formFacilities}
                        onChange={(e) => setFormFacilities(e.target.value)}
                        placeholder={
                          lang === 'bn'
                            ? 'যেমন: অটো/ভ্যান পাওয়া যায়, পার্কিং সুবিধা'
                            : 'e.g., Auto/Van available, Parking space'
                        }
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-slate-300/90 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:border-[#046a4e] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION B: সন্ধানদাতার পরিচয় */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#046a4e] border-b border-slate-100 pb-2">
                    <User className="w-4 h-4" />
                    <span>
                      {lang === 'bn'
                        ? 'সন্ধানদাতার পরিচয়'
                        : 'Contributor Info'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                        {lang === 'bn' ? 'আপনার নাম *' : 'Your Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formContributorName}
                        onChange={(e) => setFormContributorName(e.target.value)}
                        placeholder={
                          lang === 'bn'
                            ? 'কার্ডে যে নাম দেখাতে চান'
                            : 'Name to display on card'
                        }
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-slate-300/90 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#046a4e] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                        {lang === 'bn' ? 'আপনার জেলা *' : 'Your District *'}
                      </label>
                      <select
                        value={formContributorDistrict}
                        onChange={(e) =>
                          setFormContributorDistrict(e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-slate-300/90 text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:border-[#046a4e] focus:outline-none cursor-pointer"
                      >
                        <option value="দিনাজপুর">
                          {lang === 'bn' ? 'দিনাজপুর (Dinajpur)' : 'Dinajpur'}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                      {lang === 'bn'
                        ? 'মোবাইল নম্বর বা ইমেইল * (গোপন থাকবে, কার্ডে দেখানো হবে না)'
                        : 'Mobile or Email * (Kept private, never shown publicly)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formContact}
                      onChange={(e) => setFormContact(e.target.value)}
                      placeholder={
                        lang === 'bn'
                          ? '০১৭XXXXXXXX অথবা আপনার ইমেইল'
                          : '017XXXXXXXX or your email address'
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-slate-300/90 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:border-[#046a4e] focus:outline-none"
                    />
                  </div>

                  {/* প্রোফাইল ছবি (ঐচ্ছিক) */}
                  <div className="flex items-center gap-4 pt-1">
                    <div className="w-14 h-14 rounded-full bg-[#EFECE6] border border-slate-300 overflow-hidden flex items-center justify-center shrink-0">
                      {formAvatarPreview ? (
                        <img
                          src={formAvatarPreview}
                          alt="Contributor Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-slate-500" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-extrabold text-slate-900">
                        {lang === 'bn'
                          ? 'আপনার প্রোফাইল ছবি (ঐচ্ছিক)'
                          : 'Your Profile Photo (Optional)'}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {lang === 'bn'
                          ? 'লুকানো রত্ন কার্ডে আপনার নামের পাশে ছোট গোল ব্যাজ হিসেবে দেখাবে।'
                          : 'Displayed beside your name on the gem card.'}
                      </p>
                      <label className="inline-block px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 cursor-pointer transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                        {lang === 'bn' ? 'ছবি নির্বাচন করুন' : 'Select Photo'}
                      </label>
                    </div>
                  </div>
                </div>

                {/* SECTION C: অতিরিক্ত তথ্য (ঐচ্ছিক) */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs sm:text-sm font-extrabold text-[#046a4e]">
                    {lang === 'bn'
                      ? 'অতিরিক্ত তথ্য বা টিপস (ঐচ্ছিক)'
                      : 'Extra Travel Tips (Optional)'}
                  </div>
                  <p className="text-xs text-slate-500">
                    {lang === 'bn'
                      ? 'পর্যটকদের সুবিধার জন্য যেকোনো বাড়তি পয়েন্ট যুক্ত করতে পারেন (যেমন: সেরা মৌসুম, আনুমানিক খরচ বা স্থানীয় ঐতিহ্য)।'
                      : 'Add custom fields such as best season, estimated cost, or local tips.'}
                  </p>

                  {formExtraFields.map((ef) => (
                    <div
                      key={ef.id}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center bg-[#FAF8F5] p-3 rounded-xl border border-slate-200"
                    >
                      <input
                        type="text"
                        value={ef.label}
                        onChange={(e) =>
                          handleUpdateExtraField(ef.id, 'label', e.target.value)
                        }
                        placeholder={
                          lang === 'bn'
                            ? 'পয়েন্টের নাম (যেমন: সেরা সময়)'
                            : 'Label (e.g. Best Time)'
                        }
                        className="sm:col-span-4 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-800"
                      />
                      <input
                        type="text"
                        value={ef.value}
                        onChange={(e) =>
                          handleUpdateExtraField(ef.id, 'value', e.target.value)
                        }
                        placeholder={
                          lang === 'bn' ? 'তথ্য লিখুন...' : 'Details...'
                        }
                        className="sm:col-span-7 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExtraField(ef.id)}
                        className="sm:col-span-1 p-2 text-rose-500 hover:bg-rose-50 rounded-lg flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddExtraField}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-extrabold text-slate-800 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>
                      {lang === 'bn'
                        ? 'নতুন পয়েন্ট যোগ করুন'
                        : 'Add Info Point'}
                    </span>
                  </button>
                </div>

                {/* SECTION D: ছবি (১ থেকে ৫টি) */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs sm:text-sm font-extrabold text-[#046a4e]">
                    {lang === 'bn'
                      ? 'স্থানের বা খাবারের ছবি * (সর্বোচ্চ ৫টি)'
                      : 'Photos * (Maximum 5 photos)'}
                  </div>
                  <p className="text-xs text-slate-500">
                    {lang === 'bn'
                      ? 'আপনার তোলা আসল ছবি আপলোড করুন (সর্বোচ্চ ৫টি)। দ্রুত আপলোডের জন্য ছবিগুলো স্বয়ংক্রিয়ভাবে অপ্টিমাইজ হবে।'
                      : 'Upload up to 5 real photos. Images are automatically optimized before saving.'}
                  </p>

                  <label className="block w-full p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#046a4e] bg-[#FAF8F5] hover:bg-emerald-50/30 transition-colors cursor-pointer text-left">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGemPhotosUpload}
                      className="hidden"
                    />
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center gap-2">
                        <Camera className="w-4 h-4 text-[#046a4e]" />
                        <span>
                          {lang === 'bn' ? '+ ছবি নির্বাচন করুন' : '+ Choose Photos'}
                        </span>
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {lang === 'bn'
                          ? `${formatNumber(formPhotos.length, 'bn')}/৫টি ছবি`
                          : `${formPhotos.length}/5 photos`}
                      </span>
                    </div>
                  </label>

                  {formPhotos.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 pt-1">
                      {formPhotos.map((src, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 group"
                        >
                          <img
                            src={src}
                            alt={`Upload ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormPhotos((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                            className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Permission Checkbox & Submit Button (No 'যাচাইয়ের জন্য পাঠান') */}
                <div className="space-y-4 pt-2">
                  <label className="flex items-start gap-3 p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200/90 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formConsent}
                      onChange={(e) => setFormConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded accent-[#046a4e] cursor-pointer shrink-0"
                    />
                    <span className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                      {lang === 'bn'
                        ? 'এই ছবি ও তথ্যগুলো হ্যাংআউট দিনাজপুরের লুকানো রত্ন গ্যালারিতে আমার নামসহ প্রদর্শনের সম্মতি দিচ্ছি।'
                        : 'I agree to display these photos and details with my name in the Hangout Dinajpur Hidden Gems gallery.'}
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-2xl bg-[#046a4e] hover:bg-emerald-800 text-white text-sm sm:text-base font-extrabold shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {lang === 'bn'
                        ? 'লুকানো রত্নে যুক্ত করুন'
                        : 'Add to Hidden Gems'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* 3. CATEGORY FILTER PILLS (Matching Bottom-Left of Image 3)     */}
          {/* ============================================================== */}
          {allGemsList.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    {
                      id: 'all',
                      bn: `সবগুলো (${formatNumber(allGemsList.length, 'bn')})`,
                      en: `All (${allGemsList.length})`,
                    },
                    {
                      id: 'gem',
                      bn: 'প্রাকৃতিক সৌন্দর্য ও ঐতিহাসিক রত্ন',
                      en: 'Nature & Heritage Gems',
                    },
                    {
                      id: 'food',
                      bn: 'বিখ্যাত পণ্য ও খাবার',
                      en: 'Famous Products & Food',
                    },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setGemFilter(f.id)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold border transition-all cursor-pointer ${
                      gemFilter === f.id
                        ? 'bg-[#141a17] text-white border-[#141a17] shadow-2xs'
                        : 'bg-white text-slate-800 border-slate-200/90 hover:bg-slate-100'
                    }`}
                  >
                    {lang === 'bn' ? f.bn : f.en}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 4. PHOTO SHOWCASE CARDS (ONLY USER-ADDED ITEMS, NO DUMMY PICS) */}
          {/* ============================================================== */}
          {filteredGems.length === 0 ? (
            <div className="max-w-xl mx-auto text-center py-12 px-6 rounded-3xl bg-white border border-dashed border-[#d6d0c4] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#e3f2ed] text-[#046a4e] flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {lang === 'bn'
                  ? 'এখনো কোনো লুকানো রত্ন বা খাবার যোগ করা হয়নি'
                  : 'No Hidden Gems or Foods Added Yet'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {lang === 'bn'
                  ? 'এখানে কোনো ডামি ছবি রাখা হয়নি। উপরে "+ নতুন দর্শনীয় স্থান যুক্ত করুন" বা "+ ঐতিহ্যবাহী খাবার বা পণ্য যুক্ত করুন" বাটনে ক্লিক করে আপনিই প্রথম আপনার এলাকার লুকানো রত্ন বা বিখ্যাত খাবার যুক্ত করুন!'
                  : 'No dummy photos are shown here. Click "+ Add a Hidden Spot" or "+ Add Local Food or Specialty" above to add the first entry!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredGems.map((item) => {
                const initial = (item.contributorName || 'T')
                  .trim()
                  .charAt(0)
                  .toUpperCase();

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedGemModal(item)}
                    className="group bg-white rounded-3xl border border-[#e5e0d5] overflow-hidden shadow-2xs hover:shadow-md hover:border-[#046a4e]/50 transition-all flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Cover Photo with Dark Pill Photo Count Badge */}
                      <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                        <img
                          src={item.coverImage}
                          alt={lang === 'bn' ? item.titleBn : item.titleEn}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15" />

                        {/* Top-Left Type Pill */}
                        <span
                          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-extrabold backdrop-blur-md ${
                            item.type === 'food'
                              ? 'bg-amber-950/80 text-amber-200 border border-amber-400/30'
                              : 'bg-emerald-950/80 text-emerald-200 border border-emerald-400/30'
                          }`}
                        >
                          {lang === 'bn' ? item.badgeBn : item.badgeEn}
                        </span>

                        {/* Bottom-Right Photo Count Badge */}
                        <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-xs text-white text-xs font-extrabold flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-emerald-300" />
                          <span>{formatNumber(item.photoCount, lang)}</span>
                        </span>
                      </div>

                      {/* Card Body: Title + Contributor Avatar on Right + Location/Category */}
                      <div className="p-5 space-y-2.5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug group-hover:text-[#046a4e] transition-colors">
                            {lang === 'bn' ? item.titleBn : item.titleEn}
                          </h3>

                          {/* Contributor Avatar / Initial Circle */}
                          {item.contributorAvatar ? (
                            <img
                              src={item.contributorAvatar}
                              alt={item.contributorName}
                              title={item.contributorName}
                              className="w-10 h-10 rounded-full object-cover border-2 border-[#e3f2ed] shrink-0"
                            />
                          ) : (
                            <div
                              title={item.contributorName}
                              className="w-10 h-10 rounded-full bg-[#e3f2ed] text-[#046a4e] font-black text-sm flex items-center justify-center shrink-0 border border-emerald-200"
                            >
                              {initial}
                            </div>
                          )}
                        </div>

                        <div className="text-xs font-bold text-slate-500 flex flex-wrap items-center gap-1.5">
                          <span>
                            {lang === 'bn' ? item.upazilaBn : item.upazilaEn}
                          </span>
                          <span>·</span>
                          <span className="text-[#046a4e]">
                            {lang === 'bn'
                              ? item.categoryLabelBn
                              : item.categoryLabelEn}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {lang === 'bn' ? item.descBn : item.descEn}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer: Contributor Name & Directions */}
                    <div className="px-5 py-3.5 bg-[#FAF8F5] border-t border-[#ece8df] flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-semibold truncate">
                        {lang === 'bn' ? 'সন্ধানদাতা: ' : 'By: '}
                        <strong className="text-slate-800">
                          {item.contributorName}
                        </strong>
                      </span>

                      <span className="font-extrabold text-[#046a4e] inline-flex items-center gap-1 shrink-0">
                        <span>
                          {lang === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================================================================== */}
      {/* HIDDEN GEM / FOOD FULL DETAIL MODAL                                */}
      {/* ================================================================== */}
      {selectedGemModal && (
        <div className="fixed inset-0 z-[2200] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 relative">
            <div className="relative h-56 bg-slate-900">
              <img
                src={selectedGemModal.coverImage}
                alt={
                  lang === 'bn'
                    ? selectedGemModal.titleBn
                    : selectedGemModal.titleEn
                }
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedGemModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold">
                  {lang === 'bn'
                    ? selectedGemModal.badgeBn
                    : selectedGemModal.badgeEn}
                </span>
                <h3 className="text-lg sm:text-xl font-black mt-1.5">
                  {lang === 'bn'
                    ? selectedGemModal.titleBn
                    : selectedGemModal.titleEn}
                </h3>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
              <p className="text-slate-700 leading-relaxed">
                {lang === 'bn'
                  ? selectedGemModal.descBn
                  : selectedGemModal.descEn}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAF8F5] p-3.5 rounded-2xl border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block">
                    {lang === 'bn' ? 'এলাকা / উপজেলা' : 'Location'}
                  </span>
                  <span className="font-extrabold text-slate-900">
                    {lang === 'bn'
                      ? selectedGemModal.upazilaBn
                      : selectedGemModal.upazilaEn}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">
                    {lang === 'bn' ? 'সেরা সময়' : 'Best Time'}
                  </span>
                  <span className="font-extrabold text-slate-900">
                    {lang === 'bn'
                      ? selectedGemModal.bestTimeBn
                      : selectedGemModal.bestTimeEn}
                  </span>
                </div>
                {selectedGemModal.foodNearbyBn && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 font-bold block">
                      {lang === 'bn' ? 'কাছে খাবারের ব্যবস্থা' : 'Nearby Food'}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {selectedGemModal.foodNearbyBn}
                    </span>
                  </div>
                )}
                {selectedGemModal.facilitiesBn && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 font-bold block">
                      {lang === 'bn' ? 'সুবিধাসমূহ' : 'Facilities'}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {selectedGemModal.facilitiesBn}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-500">
                  {lang === 'bn' ? 'তথ্য ও ছবি: ' : 'Contributed by: '}
                  <strong className="text-slate-900">
                    {selectedGemModal.contributorName}
                  </strong>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={
                      selectedGemModal.mapLink ||
                      `https://www.google.com/maps/dir/?api=1&destination=${selectedGemModal.lat},${selectedGemModal.lng}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#046a4e] hover:bg-emerald-800 text-white text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>
                      {lang === 'bn' ? 'গুগল ম্যাপে দেখুন' : 'Open in Maps'}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB 4: LIVE COMMUNITY GENERATED POSTERS GALLERY (/generatedPosters)*/}
      {/* ================================================================== */}
      {activeTab === 'posters' && (
        <div className="bg-white rounded-3xl border border-slate-200/85 p-5 sm:p-8 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#F9F8F5] p-4 rounded-2xl border border-slate-200/80">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                {lang === 'bn'
                  ? 'পর্যটকদের জেনারেট করা দিনাজপুর ভ্রমণ ম্যাপ (লাইভ ক্লাউড লগ)'
                  : 'Traveler Generated Dinajpur Maps (Live Cloud Feed)'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'bn'
                  ? 'যখনই কেউ PNG, JPG বা PDF ম্যাপ ডাউনলোড করেন, তার প্রিভিউ ও তথ্য এখানে এবং আপনার ফায়ারবেস ডাটাবেসে সেভ হয়।'
                  : 'Every time someone downloads a PNG, JPG, or PDF travel map, it is saved to your Firebase Firestore and displayed here.'}
              </p>
            </div>
            <a
              href="#upazila-tracker-section"
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold whitespace-nowrap self-start sm:self-auto"
            >
              {lang === 'bn'
                ? 'আপনার ম্যাপ তৈরি করুন ↑'
                : 'Generate Your Map ↑'}
            </a>
          </div>

          {posterLogs.length === 0 ? (
            <div className="text-center py-10 bg-[#F9F8F5] rounded-2xl border border-dashed border-slate-300 space-y-2">
              <Users className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700">
                {lang === 'bn'
                  ? 'এখনো কোনো ম্যাপ পোস্টার ক্লাউডে জমা পড়েনি বা ফায়ারস্টোর ডাটাবেস কানেক্ট হচ্ছে।'
                  : 'No generated posters recorded yet. Download a PNG, JPG, or PDF map above to see it here!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {posterLogs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-2xl border border-slate-200/90 bg-[#F9F8F5] overflow-hidden flex flex-col justify-between hover:border-emerald-500/60 transition-all"
                >
                  {log.posterPreview ? (
                    <div
                      onClick={() => setPreviewModalPoster(log)}
                      className="relative aspect-[4/5] bg-slate-900 overflow-hidden cursor-pointer group"
                    >
                      <img
                        src={log.posterPreview}
                        alt={log.travelerName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold flex items-center gap-1 shadow-md transition-opacity">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'বড় করে দেখুন' : 'View'}</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[4/5] bg-emerald-950/90 text-white p-4 flex flex-col items-center justify-center text-center">
                      <Award className="w-8 h-8 text-emerald-400 mb-2" />
                      <div className="text-sm font-bold">{log.travelerName}</div>
                      <div className="text-xs text-emerald-300 mt-1">
                        {formatNumber(log.progressPercent, lang)}%
                      </div>
                    </div>
                  )}

                  <div className="p-3.5 space-y-1.5 bg-white border-t border-slate-200/80">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                        {log.travelerName}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-extrabold">
                        {log.format}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>
                        {formatNumber(log.visitedCount, lang)} /{' '}
                        {formatNumber(UPAZILAS.length, lang)}{' '}
                        {lang === 'bn' ? 'উপজেলা' : 'Upazilas'}
                      </span>
                      <span className="font-bold text-emerald-700">
                        {formatNumber(log.progressPercent, lang)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Poster Full Preview Modal */}
      {previewModalPoster && (
        <div className="fixed inset-0 z-[2200] bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 relative">
            <button
              type="button"
              onClick={() => setPreviewModalPoster(null)}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {previewModalPoster.travelerName}
              </h3>
              <p className="text-xs text-slate-500">
                {formatNumber(previewModalPoster.visitedCount, lang)} /{' '}
                {formatNumber(UPAZILAS.length, lang)}{' '}
                {lang === 'bn' ? 'উপজেলা ভ্রমণ' : 'Upazilas Visited'} (
                {formatNumber(previewModalPoster.progressPercent, lang)}%) ·{' '}
                {previewModalPoster.format}
              </p>
            </div>

            {previewModalPoster.posterPreview && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
                <img
                  src={previewModalPoster.posterPreview}
                  alt={previewModalPoster.travelerName}
                  className="w-full h-auto object-contain max-h-[65vh]"
                />
              </div>
            )}

            {previewModalPoster.posterPreview && (
              <div className="flex justify-end">
                <a
                  href={previewModalPoster.posterPreview}
                  download={`Hangout-Dinajpur-${previewModalPoster.travelerName}.jpg`}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'bn' ? 'ছবিটি সেভ করুন' : 'Download Image'}
                  </span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
