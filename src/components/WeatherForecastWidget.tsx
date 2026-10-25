import React, { useState, useEffect, useCallback } from 'react';
import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudLightning,
  CloudDrizzle,
  Wind,
  Droplets,
  Calendar,
  RefreshCw,
  Key,
  Check,
  Compass,
  Umbrella,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Language, formatNumber } from '../data/dinajpurData';

export interface WeatherForecastWidgetProps {
  lang: Language;
  selectedUpazilaId?: string;
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number; // km/h
  condition: string;
  conditionBn: string;
  conditionEn: string;
  iconCode: string;
  rainChance: number;
  locationBn: string;
  locationEn: string;
  updatedAt: Date;
  source: 'openweathermap' | 'live-fallback';
}

export interface DayForecast {
  date: string;
  dayLabelBn: string;
  dayLabelEn: string;
  formattedDateBn: string;
  formattedDateEn: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  conditionBn: string;
  conditionEn: string;
  iconCode: string;
  rainChance: number;
  humidity: number;
  windSpeed: number;
  travelAdviceBn: string;
  travelAdviceEn: string;
  suitability: 'excellent' | 'good' | 'caution';
}

// 13 Upazila Centroids for Dinajpur
export const UPAZILA_LOCATIONS: Record<
  string,
  { lat: number; lng: number; nameBn: string; nameEn: string }
> = {
  all: {
    lat: 25.6279,
    lng: 88.6332,
    nameBn: 'দিনাজপুর জেলা',
    nameEn: 'Dinajpur District',
  },
  sadar: {
    lat: 25.6279,
    lng: 88.6332,
    nameBn: 'দিনাজপুর সদর',
    nameEn: 'Dinajpur Sadar',
  },
  kaharole: {
    lat: 25.7925,
    lng: 88.6543,
    nameBn: 'কাহারোল (কান্তজিউ)',
    nameEn: 'Kaharole (Kantaji)',
  },
  birganj: {
    lat: 25.8561,
    lng: 88.6657,
    nameBn: 'বীরগঞ্জ',
    nameEn: 'Birganj',
  },
  bochaganj: {
    lat: 25.8016,
    lng: 88.4619,
    nameBn: 'বোচাগঞ্জ',
    nameEn: 'Bochaganj',
  },
  biral: {
    lat: 25.6322,
    lng: 88.5492,
    nameBn: 'বিরল',
    nameEn: 'Biral',
  },
  khansama: {
    lat: 25.9261,
    lng: 88.7297,
    nameBn: 'খানসামা',
    nameEn: 'Khansama',
  },
  chirirbandar: {
    lat: 25.6631,
    lng: 88.7845,
    nameBn: 'চিরিরবন্দর',
    nameEn: 'Chirirbandar',
  },
  parbatipur: {
    lat: 25.6553,
    lng: 88.9189,
    nameBn: 'পার্বতীপুর',
    nameEn: 'Parbatipur',
  },
  phulbari: {
    lat: 25.495,
    lng: 88.8878,
    nameBn: 'ফুলবাড়ী',
    nameEn: 'Phulbari',
  },
  birampur: {
    lat: 25.3944,
    lng: 88.9056,
    nameBn: 'বিরামপুর',
    nameEn: 'Birampur',
  },
  nawabganj: {
    lat: 25.4194,
    lng: 89.0889,
    nameBn: 'নবাবগঞ্জ',
    nameEn: 'Nawabganj',
  },
  ghoraghat: {
    lat: 25.2472,
    lng: 89.2153,
    nameBn: 'ঘোড়াঘাট',
    nameEn: 'Ghoraghat',
  },
  hakimpur: {
    lat: 25.2833,
    lng: 89.0167,
    nameBn: 'হাকিমপুর (হিলি)',
    nameEn: 'Hakimpur (Hili)',
  },
};

// Condition translators
function translateWeatherCondition(
  mainDesc: string,
  id?: number
): { bn: string; en: string; icon: string } {
  const lower = (mainDesc || '').toLowerCase();
  if (lower.includes('thunder') || (id && id >= 200 && id < 300)) {
    return { bn: 'বজ্রসহ বৃষ্টি', en: 'Thunderstorm', icon: '11d' };
  }
  if (lower.includes('drizzle') || (id && id >= 300 && id < 400)) {
    return { bn: 'হালকা গুঁড়ি বৃষ্টি', en: 'Light Drizzle', icon: '09d' };
  }
  if (lower.includes('rain') || (id && id >= 500 && id < 600)) {
    return { bn: 'বৃষ্টিপাত', en: 'Rainy', icon: '10d' };
  }
  if (lower.includes('snow') || (id && id >= 600 && id < 700)) {
    return { bn: 'শীতল তুষারপাত', en: 'Snow', icon: '13d' };
  }
  if (
    lower.includes('mist') ||
    lower.includes('fog') ||
    lower.includes('haze') ||
    (id && id >= 700 && id < 800)
  ) {
    return { bn: 'হালকা কুয়াশা', en: 'Haze / Mist', icon: '50d' };
  }
  if (lower.includes('clear') || (id && id === 800)) {
    return { bn: 'রৌদ্রোজ্জ্বল পরিষ্কার আকাশ', en: 'Clear & Sunny', icon: '01d' };
  }
  if (lower.includes('few') || lower.includes('scattered') || id === 801 || id === 802) {
    return { bn: 'আংশিক মেঘলা', en: 'Partly Cloudy', icon: '02d' };
  }
  return { bn: 'মেঘাচ্ছন্ন আকাশ', en: 'Overcast Clouds', icon: '04d' };
}

// Convert Open-Meteo WMO code to OpenWeather standard
function mapWmoToCondition(wmoCode: number): {
  bn: string;
  en: string;
  icon: string;
  condition: string;
} {
  switch (wmoCode) {
    case 0:
      return {
        condition: 'Clear',
        bn: 'রৌদ্রোজ্জ্বল আকাশ',
        en: 'Clear & Sunny',
        icon: '01d',
      };
    case 1:
    case 2:
      return {
        condition: 'Partly Cloudy',
        bn: 'আংশিক মেঘলা ও রোদ',
        en: 'Partly Cloudy',
        icon: '02d',
      };
    case 3:
      return {
        condition: 'Overcast',
        bn: 'মেঘাচ্ছন্ন আবহাওয়া',
        en: 'Overcast',
        icon: '04d',
      };
    case 45:
    case 48:
      return {
        condition: 'Fog',
        bn: 'শীতল কুয়াশা',
        en: 'Fog / Mist',
        icon: '50d',
      };
    case 51:
    case 53:
    case 55:
      return {
        condition: 'Drizzle',
        bn: 'হালকা গুঁড়ি বৃষ্টি',
        en: 'Light Drizzle',
        icon: '09d',
      };
    case 61:
    case 63:
    case 65:
      return {
        condition: 'Rain',
        bn: 'বৃষ্টিপাত',
        en: 'Rain',
        icon: '10d',
      };
    case 80:
    case 81:
    case 82:
      return {
        condition: 'Showers',
        bn: 'বিক্ষিপ্ত বৃষ্টি',
        en: 'Rain Showers',
        icon: '09d',
      };
    case 95:
    case 96:
    case 99:
      return {
        condition: 'Thunderstorm',
        bn: 'বজ্রবৃষ্টির সম্ভাবনা',
        en: 'Thunderstorm',
        icon: '11d',
      };
    default:
      return {
        condition: 'Clouds',
        bn: 'মনোরম আবহাওয়া',
        en: 'Pleasant Clouds',
        icon: '03d',
      };
  }
}

function getTravelAdvice(
  rainChance: number,
  tempMax: number,
  condition: string
): {
  adviceBn: string;
  adviceEn: string;
  suitability: 'excellent' | 'good' | 'caution';
} {
  const condLower = condition.toLowerCase();
  if (rainChance > 50 || condLower.includes('thunder') || condLower.includes('rain')) {
    return {
      adviceBn: 'বৃষ্টির সম্ভাবনা রয়েছে, ছাতা ও রেইনকোট সাথে রাখুন।',
      adviceEn: 'Rain expected, keep an umbrella handy for sightseeing.',
      suitability: 'caution',
    };
  }
  if (tempMax > 34) {
    return {
      adviceBn: 'উষ্ণ দিন, পর্যাপ্ত পানি পান করুন ও রোদচশমা পরুন।',
      adviceEn: 'Warm sunny day, stay hydrated & wear sunscreen.',
      suitability: 'good',
    };
  }
  if (rainChance <= 20) {
    return {
      adviceBn: 'ঘোরাঘুরির জন্য চমৎকার আবহাওয়া! কান্তজিউ বা রামসাগরে যাওয়ার সেরা সময়।',
      adviceEn: 'Excellent sightseeing conditions! Ideal for Kantaji or Ramsagar.',
      suitability: 'excellent',
    };
  }
  return {
    adviceBn: 'মনোরম দিন, স্বাচ্ছন্দ্যে দিনাজপুরের দর্শনীয় স্থান পরিদর্শন করুন।',
    adviceEn: 'Pleasant weather, comfortable for daylong tours.',
    suitability: 'good',
  };
}

// Bengali Weekday & Month Name helpers
const BN_WEEKDAYS = [
  'রবিবার',
  'সোমবার',
  'মঙ্গলবার',
  'বুধবার',
  'বৃহস্পতিবার',
  'শুক্রবার',
  'শনিবার',
];
const EN_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const BN_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];
const EN_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const WeatherForecastWidget: React.FC<WeatherForecastWidgetProps> = ({
  lang,
  selectedUpazilaId = 'all',
}) => {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null
  );
  const [forecast3Day, setForecast3Day] = useState<DayForecast[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showKeyConfig, setShowKeyConfig] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>(() => {
    return (
      localStorage.getItem('openweather_api_key') ||
      (import.meta.env.VITE_OPENWEATHER_API_KEY as string) ||
      (import.meta.env.VITE_OPENWEATHERMAP_API_KEY as string) ||
      ''
    );
  });
  const [activeApiKey, setActiveApiKey] = useState<string>(() => {
    return (
      localStorage.getItem('openweather_api_key') ||
      (import.meta.env.VITE_OPENWEATHER_API_KEY as string) ||
      (import.meta.env.VITE_OPENWEATHERMAP_API_KEY as string) ||
      ''
    );
  });

  const locationData =
    UPAZILA_LOCATIONS[selectedUpazilaId] || UPAZILA_LOCATIONS.all;

  // Main fetch function combining OpenWeatherMap API with seamless Live Meteorological Fallback
  const fetchWeather = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    const { lat, lng, nameBn, nameEn } = locationData;
    const apiKey = activeApiKey.trim();

    // Strategy 1: If OpenWeatherMap API key is configured, use official OpenWeatherMap endpoints
    if (apiKey) {
      try {
        const [resCurrent, resForecast] = await Promise.all([
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`
          ),
          fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`
          ),
        ]);

        if (!resCurrent.ok || !resForecast.ok) {
          throw new Error(
            `OpenWeatherMap API responded with status ${resCurrent.status}/${resForecast.status}`
          );
        }

        const dataCurrent = await resCurrent.json();
        const dataForecast = await resForecast.json();

        // Process Current Weather
        const weatherObj = dataCurrent.weather?.[0] || {};
        const cond = translateWeatherCondition(
          weatherObj.main,
          weatherObj.id
        );

        const current: CurrentWeather = {
          temp: Math.round(dataCurrent.main?.temp ?? 27),
          feelsLike: Math.round(dataCurrent.main?.feels_like ?? 28),
          tempMin: Math.round(dataCurrent.main?.temp_min ?? 23),
          tempMax: Math.round(dataCurrent.main?.temp_max ?? 30),
          humidity: dataCurrent.main?.humidity ?? 65,
          windSpeed: Math.round((dataCurrent.wind?.speed ?? 2) * 3.6), // convert m/s to km/h
          condition: weatherObj.main || 'Clear',
          conditionBn: cond.bn,
          conditionEn: cond.en,
          iconCode: weatherObj.icon || cond.icon,
          rainChance: Math.round((dataForecast.list?.[0]?.pop ?? 0.1) * 100),
          locationBn: nameBn,
          locationEn: nameEn,
          updatedAt: new Date(),
          source: 'openweathermap',
        };
        setCurrentWeather(current);

        // Group 5-day / 3-hour list by local date to extract 3-day forecast summary
        const todayStr = new Date().toISOString().split('T')[0];
        const daysMap: Record<
          string,
          {
            temps: number[];
            humidities: number[];
            winds: number[];
            pops: number[];
            weatherItems: Array<{ main: string; id: number; icon: string }>;
            dateObj: Date;
          }
        > = {};

        // Process forecast list
        for (const item of dataForecast.list || []) {
          const itemDate = (item.dt_txt || '').split(' ')[0];
          // Skip today if there are already multiple future days
          if (!itemDate || itemDate === todayStr) continue;

          if (!daysMap[itemDate]) {
            daysMap[itemDate] = {
              temps: [],
              humidities: [],
              winds: [],
              pops: [],
              weatherItems: [],
              dateObj: new Date((item.dt || 0) * 1000),
            };
          }
          daysMap[itemDate].temps.push(item.main?.temp ?? 25);
          daysMap[itemDate].humidities.push(item.main?.humidity ?? 60);
          daysMap[itemDate].winds.push((item.wind?.speed ?? 2) * 3.6);
          daysMap[itemDate].pops.push(item.pop ?? 0);
          if (item.weather?.[0]) {
            daysMap[itemDate].weatherItems.push(item.weather[0]);
          }
        }

        const sortedDates = Object.keys(daysMap).sort().slice(0, 3);
        const forecastDays: DayForecast[] = sortedDates.map(
          (dateStr, idx) => {
            const dayData = daysMap[dateStr];
            const maxT = Math.round(Math.max(...dayData.temps));
            const minT = Math.round(Math.min(...dayData.temps));
            const avgHum = Math.round(
              dayData.humidities.reduce((a, b) => a + b, 0) /
                (dayData.humidities.length || 1)
            );
            const avgWind = Math.round(
              dayData.winds.reduce((a, b) => a + b, 0) /
                (dayData.winds.length || 1)
            );
            const maxPop = Math.round(Math.max(...dayData.pops) * 100);

            // Dominant weather
            const midItem =
              dayData.weatherItems[
                Math.floor(dayData.weatherItems.length / 2)
              ] || dayData.weatherItems[0] || {};
            const translated = translateWeatherCondition(
              midItem.main,
              midItem.id
            );

            const d = dayData.dateObj;
            const weekdayBn = BN_WEEKDAYS[d.getDay()];
            const weekdayEn = EN_WEEKDAYS[d.getDay()];
            const dayNum = d.getDate();
            const monthBn = BN_MONTHS[d.getMonth()];
            const monthEn = EN_MONTHS[d.getMonth()];

            const labelBn =
              idx === 0
                ? `আগামীকাল (${weekdayBn})`
                : idx === 1
                ? `পরশু (${weekdayBn})`
                : `${weekdayBn}`;
            const labelEn =
              idx === 0
                ? `Tomorrow (${weekdayEn})`
                : idx === 1
                ? `Day After (${weekdayEn})`
                : `${weekdayEn}`;

            const advice = getTravelAdvice(
              maxPop,
              maxT,
              midItem.main || ''
            );

            return {
              date: dateStr,
              dayLabelBn: labelBn,
              dayLabelEn: labelEn,
              formattedDateBn: `${formatNumber(dayNum, 'bn')} ${monthBn}`,
              formattedDateEn: `${dayNum} ${monthEn}`,
              tempMax: maxT,
              tempMin: minT,
              condition: midItem.main || 'Clear',
              conditionBn: translated.bn,
              conditionEn: translated.en,
              iconCode: midItem.icon || translated.icon,
              rainChance: maxPop,
              humidity: avgHum,
              windSpeed: avgWind,
              travelAdviceBn: advice.adviceBn,
              travelAdviceEn: advice.adviceEn,
              suitability: advice.suitability,
            };
          }
        );

        setForecast3Day(forecastDays);
        setIsLoading(false);
        return;
      } catch (err) {
        console.warn(
          'OpenWeatherMap API direct fetch failed, falling back to real-time Dinajpur weather API:',
          err
        );
      }
    }

    // Strategy 2: High-accuracy live meteorological fallback for Dinajpur coordinates
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=Asia%2FDhaka&forecast_days=4`
      );

      if (!res.ok) {
        throw new Error('Failed to load Dinajpur weather data');
      }

      const data = await res.json();
      const currentRaw = data.current;
      const dailyRaw = data.daily;

      const currentWmo = mapWmoToCondition(currentRaw?.weather_code ?? 0);

      const current: CurrentWeather = {
        temp: Math.round(currentRaw?.temperature_2m ?? 28),
        feelsLike: Math.round(
          currentRaw?.apparent_temperature ?? currentRaw?.temperature_2m ?? 29
        ),
        tempMin: Math.round(dailyRaw?.temperature_2m_min?.[0] ?? 22),
        tempMax: Math.round(dailyRaw?.temperature_2m_max?.[0] ?? 31),
        humidity: Math.round(currentRaw?.relative_humidity_2m ?? 65),
        windSpeed: Math.round(currentRaw?.wind_speed_10m ?? 8),
        condition: currentWmo.condition,
        conditionBn: currentWmo.bn,
        conditionEn: currentWmo.en,
        iconCode: currentWmo.icon,
        rainChance: Math.round(
          dailyRaw?.precipitation_probability_max?.[0] ?? 10
        ),
        locationBn: nameBn,
        locationEn: nameEn,
        updatedAt: new Date(),
        source: 'live-fallback',
      };
      setCurrentWeather(current);

      // Extract 3 upcoming forecast days (indexes 1, 2, 3)
      const forecastDays: DayForecast[] = [];
      const dates = dailyRaw?.time || [];

      for (let i = 1; i <= 3 && i < dates.length; i++) {
        const dateStr = dates[i];
        const d = new Date(dateStr);
        const wmoCode = dailyRaw?.weather_code?.[i] ?? 0;
        const wmoInfo = mapWmoToCondition(wmoCode);
        const maxT = Math.round(dailyRaw?.temperature_2m_max?.[i] ?? 30);
        const minT = Math.round(dailyRaw?.temperature_2m_min?.[i] ?? 21);
        const pop = Math.round(
          dailyRaw?.precipitation_probability_max?.[i] ?? 15
        );
        const wind = Math.round(dailyRaw?.wind_speed_10m_max?.[i] ?? 10);

        const weekdayBn = BN_WEEKDAYS[d.getDay()];
        const weekdayEn = EN_WEEKDAYS[d.getDay()];
        const dayNum = d.getDate();
        const monthBn = BN_MONTHS[d.getMonth()];
        const monthEn = EN_MONTHS[d.getMonth()];

        const labelBn =
          i === 1
            ? `আগামীকাল (${weekdayBn})`
            : i === 2
            ? `পরশু (${weekdayBn})`
            : `${weekdayBn}`;
        const labelEn =
          i === 1
            ? `Tomorrow (${weekdayEn})`
            : i === 2
            ? `Day After (${weekdayEn})`
            : `${weekdayEn}`;

        const advice = getTravelAdvice(pop, maxT, wmoInfo.condition);

        forecastDays.push({
          date: dateStr,
          dayLabelBn: labelBn,
          dayLabelEn: labelEn,
          formattedDateBn: `${formatNumber(dayNum, 'bn')} ${monthBn}`,
          formattedDateEn: `${dayNum} ${monthEn}`,
          tempMax: maxT,
          tempMin: minT,
          condition: wmoInfo.condition,
          conditionBn: wmoInfo.bn,
          conditionEn: wmoInfo.en,
          iconCode: wmoInfo.icon,
          rainChance: pop,
          humidity: Math.round(
            (current.humidity + (i === 1 ? -3 : i === 2 ? 2 : 0))
          ),
          windSpeed: wind,
          travelAdviceBn: advice.adviceBn,
          travelAdviceEn: advice.adviceEn,
          suitability: advice.suitability,
        });
      }

      setForecast3Day(forecastDays);
      setIsLoading(false);
    } catch (err) {
      console.error('Weather load error:', err);
      setErrorMsg(
        lang === 'bn'
          ? 'আবহাওয়া তথ্য লোড করা যায়নি। অনুগ্রহ করে রিফ্রেশ করুন।'
          : 'Failed to load weather data. Please refresh.'
      );
      setIsLoading(false);
    }
  }, [locationData, activeApiKey, lang]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const handleSaveApiKey = () => {
    const trimmed = apiKeyInput.trim();
    if (trimmed) {
      localStorage.setItem('openweather_api_key', trimmed);
      setActiveApiKey(trimmed);
    } else {
      localStorage.removeItem('openweather_api_key');
      setActiveApiKey('');
    }
    setShowKeyConfig(false);
  };

  const renderWeatherIcon = (
    iconCode: string,
    sizeClass = 'w-7 h-7 sm:w-8 sm:h-8'
  ) => {
    if (iconCode.startsWith('01')) {
      return (
        <Sun className={`${sizeClass} text-amber-500 fill-amber-400 shrink-0`} />
      );
    }
    if (iconCode.startsWith('02') || iconCode.startsWith('03')) {
      return (
        <CloudSun
          className={`${sizeClass} text-amber-500 fill-amber-200 shrink-0`}
        />
      );
    }
    if (iconCode.startsWith('04')) {
      return (
        <Cloud className={`${sizeClass} text-slate-400 fill-slate-200 shrink-0`} />
      );
    }
    if (iconCode.startsWith('09')) {
      return (
        <CloudDrizzle
          className={`${sizeClass} text-sky-500 fill-sky-200 shrink-0`}
        />
      );
    }
    if (iconCode.startsWith('10')) {
      return (
        <CloudRain
          className={`${sizeClass} text-blue-600 fill-blue-300 shrink-0`}
        />
      );
    }
    if (iconCode.startsWith('11')) {
      return (
        <CloudLightning
          className={`${sizeClass} text-purple-600 fill-purple-300 shrink-0`}
        />
      );
    }
    return (
      <Sun className={`${sizeClass} text-amber-500 fill-amber-400 shrink-0`} />
    );
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-800/60 overflow-hidden relative transition-all">
      {/* Decorative ambient gradient backdrop */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar: Title, Location Badge, API Status & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="p-2 rounded-xl bg-white/10 border border-white/15 text-amber-300 shrink-0">
            <Sun className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                {lang === 'bn'
                  ? 'দিনাজপুর ভ্রমণ আবহাওয়া ও ৩ দিনের পূর্বাভাস'
                  : 'Dinajpur Weather & 3-Day Forecast'}
              </h3>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
                {currentWeather?.source === 'openweathermap'
                  ? 'OpenWeatherMap API'
                  : 'Live Forecast Feed'}
              </span>
            </div>
            <p className="text-xs text-white/70 flex items-center gap-1.5 mt-0.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {lang === 'bn'
                  ? `নির্বাচিত এলাকা: ${locationData.nameBn}`
                  : `Selected Area: ${locationData.nameEn}`}
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls: Refresh, API Key Config, Expand/Collapse */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {/* OpenWeatherMap API Key Settings Toggle */}
          <button
            type="button"
            onClick={() => setShowKeyConfig((prev) => !prev)}
            title={
              lang === 'bn'
                ? 'OpenWeatherMap API Key কনফিগারেশন'
                : 'Configure OpenWeatherMap API Key'
            }
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 text-xs font-semibold border border-white/15 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">
              {activeApiKey ? 'API Key Active' : 'API Key'}
            </span>
          </button>

          {/* Refresh Live Weather */}
          <button
            type="button"
            onClick={fetchWeather}
            disabled={isLoading}
            title={lang === 'bn' ? 'আবহাওয়া রিফ্রেশ করুন' : 'Refresh Weather'}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 text-xs font-semibold border border-white/15 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`}
            />
            <span className="hidden md:inline">
              {lang === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
            </span>
          </button>

          {/* Expand/Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 border border-white/15 transition-colors cursor-pointer"
            title={
              isExpanded
                ? lang === 'bn'
                  ? 'সংক্ষিপ্ত করুন'
                  : 'Collapse'
                : lang === 'bn'
                ? '৩ দিনের পূর্বাভাস দেখুন'
                : 'Show 3-Day Forecast'
            }
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* OpenWeatherMap API Key Configuration Drawer / Panel */}
      {showKeyConfig && (
        <div className="mt-3 p-3.5 rounded-xl bg-black/40 border border-emerald-500/30 text-xs space-y-2 relative z-20 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {lang === 'bn'
                  ? 'OpenWeatherMap API Key কনফিগার করুন'
                  : 'Configure OpenWeatherMap API Key'}
              </span>
            </span>
            <a
              href="https://openweathermap.org/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>{lang === 'bn' ? 'ফ্রি কী নিন' : 'Get Free Key'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-[11px] text-white/75">
            {lang === 'bn'
              ? 'আপনার OpenWeatherMap API Key প্রদান করলে সরাসরি অফিসিয়াল 2.5/3.0 এন্ডপয়েন্ট থেকে লাইভ রিয়েল-টাইম তথ্য ও ৫ দিনের ৩-ঘণ্টা ভিত্তিক পূর্বাভাস প্রসেস করা হবে।'
              : 'Enter your OpenWeatherMap API Key to fetch directly from the official weather & 5-day forecast endpoints.'}
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="e.g. 1a2b3c4d5e6f7g8h9i0..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400 placeholder:text-white/40"
            />
            <button
              type="button"
              onClick={handleSaveApiKey}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'সংরক্ষণ' : 'Save'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Loading & Error Indicators */}
      {isLoading && !currentWeather && (
        <div className="py-8 flex flex-col items-center justify-center gap-2 text-white/80">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
          <span className="text-xs font-medium">
            {lang === 'bn'
              ? 'দিনাজপুরের রিয়েল-টাইম আবহাওয়া লোড হচ্ছে...'
              : 'Fetching real-time Dinajpur weather & forecast...'}
          </span>
        </div>
      )}

      {errorMsg && (
        <div className="mt-3 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Content Area: Real-Time Current Weather + 3-Day Forecast Cards */}
      {currentWeather && (
        <div className="mt-3 space-y-3.5 relative z-10">
          {/* Top Row: Current Real-time Weather Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
            {/* Left Box: Big Temperature & Condition */}
            <div className="md:col-span-5 bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10">
                  {renderWeatherIcon(currentWeather.iconCode)}
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      {formatNumber(currentWeather.temp, lang)}
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-amber-300">
                      °C
                    </span>
                  </div>
                  <div className="text-xs font-bold text-emerald-300">
                    {lang === 'bn'
                      ? currentWeather.conditionBn
                      : currentWeather.conditionEn}
                  </div>
                  <div className="text-[11px] text-white/70">
                    {lang === 'bn' ? 'অনুভূত:' : 'Feels like:'}{' '}
                    <strong className="text-white">
                      {formatNumber(currentWeather.feelsLike, lang)}°C
                    </strong>
                  </div>
                </div>
              </div>

              {/* Today's Range */}
              <div className="text-right text-[11px] text-white/80 space-y-0.5 border-l border-white/15 pl-3">
                <div>
                  <span className="text-white/60">
                    {lang === 'bn' ? 'সর্বোচ্চ:' : 'High:'}
                  </span>{' '}
                  <strong className="text-amber-300">
                    {formatNumber(currentWeather.tempMax, lang)}°C
                  </strong>
                </div>
                <div>
                  <span className="text-white/60">
                    {lang === 'bn' ? 'সর্বনিম্ন:' : 'Low:'}
                  </span>{' '}
                  <strong className="text-sky-300">
                    {formatNumber(currentWeather.tempMin, lang)}°C
                  </strong>
                </div>
              </div>
            </div>

            {/* Right Box: Key Metrics (Humidity, Wind, Rain Chance) & Travel Tip */}
            <div className="md:col-span-7 bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 flex flex-col justify-between gap-2">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-black/20 border border-white/5">
                  <div className="flex items-center justify-center gap-1 text-sky-300 text-[11px] font-semibold">
                    <Droplets className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'আর্দ্রতা' : 'Humidity'}</span>
                  </div>
                  <div className="font-bold text-white mt-0.5">
                    {formatNumber(currentWeather.humidity, lang)}%
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-black/20 border border-white/5">
                  <div className="flex items-center justify-center gap-1 text-teal-300 text-[11px] font-semibold">
                    <Wind className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'বাতাস' : 'Wind'}</span>
                  </div>
                  <div className="font-bold text-white mt-0.5">
                    {formatNumber(currentWeather.windSpeed, lang)}{' '}
                    <span className="text-[10px] text-white/70">
                      {lang === 'bn' ? 'কিমি/ঘ' : 'km/h'}
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-black/20 border border-white/5">
                  <div className="flex items-center justify-center gap-1 text-amber-300 text-[11px] font-semibold">
                    <Umbrella className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'বৃষ্টি সম্ভাবনা' : 'Rain Pop'}</span>
                  </div>
                  <div className="font-bold text-white mt-0.5">
                    {formatNumber(currentWeather.rainChance, lang)}%
                  </div>
                </div>
              </div>

              {/* Dynamic Tourist Recommendation pill */}
              <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-[11px] text-emerald-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="font-medium">
                  {lang === 'bn'
                    ? currentWeather.rainChance > 40
                      ? 'আজ হালকা বৃষ্টির আভাস রয়েছে, কান্তজিউ বা রাজবাড়ি যাওয়ার সময় ছাতা সাথে রাখা শ্রেয়।'
                      : 'আজকের আবহাওয়া অত্যন্ত মনোরম ও ঘোরাঘুরির উপযোগী! কান্তজিউ মন্দির, রামসাগর বা সুখ সাগর ঘুরে আসার দারুণ দিন।'
                    : currentWeather.rainChance > 40
                    ? 'Scattered showers expected. Carrying an umbrella is recommended for outdoor visits.'
                    : 'Weather is pleasant for outdoor touring! Excellent day to explore Kantaji Temple, Ramsagar, or Sukh Sagar.'}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Section: 3-Day Forecast Summary Cards alongside Current Weather */}
          {isExpanded && (
            <div className="space-y-2 pt-1 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-white/80 px-0.5">
                <span className="font-bold flex items-center gap-1.5 text-emerald-300">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'bn'
                      ? 'পরবর্তী ৩ দিনের পর্যটন আবহাওয়া পূর্বাভাস (3-Day Forecast Summary)'
                      : 'Next 3-Day Sightseeing Forecast Summary'}
                  </span>
                </span>
                <span className="text-[10px] text-white/60">
                  {lang === 'bn' ? 'প্রতিদিন রিয়েল-টাইম আপডেট' : 'Daily Real-Time Outlook'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {forecast3Day.map((day) => {
                  return (
                    <div
                      key={day.date}
                      className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/15 flex flex-col justify-between gap-2.5 transition-all shadow-xs"
                    >
                      {/* Day Header */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <div>
                          <div className="font-bold text-xs text-white">
                            {lang === 'bn' ? day.dayLabelBn : day.dayLabelEn}
                          </div>
                          <div className="text-[10px] text-white/60">
                            {lang === 'bn'
                              ? day.formattedDateBn
                              : day.formattedDateEn}
                          </div>
                        </div>
                        <div className="p-1.5 rounded-lg bg-white/10">
                          {renderWeatherIcon(day.iconCode, 'w-6 h-6')}
                        </div>
                      </div>

                      {/* Forecast Conditions & Temperatures */}
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-emerald-200 truncate">
                          {lang === 'bn' ? day.conditionBn : day.conditionEn}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-amber-300 font-extrabold text-sm">
                            {formatNumber(day.tempMax, lang)}°C
                          </span>
                          <span className="text-white/40">/</span>
                          <span className="text-sky-300 font-semibold text-xs">
                            {formatNumber(day.tempMin, lang)}°C
                          </span>
                        </div>
                      </div>

                      {/* Rain Probability & Humidity */}
                      <div className="flex items-center justify-between text-[11px] text-white/70 bg-black/20 px-2 py-1 rounded-lg">
                        <span className="flex items-center gap-1 text-sky-300">
                          <Umbrella className="w-3 h-3" />
                          <span>{formatNumber(day.rainChance, lang)}%</span>
                        </span>
                        <span className="flex items-center gap-1 text-teal-300">
                          <Wind className="w-3 h-3" />
                          <span>
                            {formatNumber(day.windSpeed, lang)}{' '}
                            {lang === 'bn' ? 'কিমি' : 'km/h'}
                          </span>
                        </span>
                      </div>

                      {/* Travel Suitability Tag */}
                      <div
                        className={`text-[10px] font-medium px-2 py-1 rounded-md text-center border ${
                          day.suitability === 'excellent'
                            ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-200'
                            : day.suitability === 'caution'
                            ? 'bg-rose-500/20 border-rose-400/30 text-rose-200'
                            : 'bg-amber-500/20 border-amber-400/30 text-amber-200'
                        }`}
                      >
                        {lang === 'bn' ? day.travelAdviceBn : day.travelAdviceEn}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
