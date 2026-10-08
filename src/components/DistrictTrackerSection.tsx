import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import {
  Search,
  User,
  Download,
  Printer,
  Check,
  Sparkles,
  Award,
  MapPin,
} from 'lucide-react';
import {
  Language,
  UPAZILAS,
  SPOTS,
  MAP_THEMES,
  MapTheme,
  formatNumber,
} from '../data/dinajpurData';

interface DistrictTrackerSectionProps {
  lang: Language;
  visitedUpazilas: string[];
  onToggleUpazila: (upazilaId: string) => void;
  onSelectAllUpazilas: () => void;
  onClearAllUpazilas: () => void;
  travelerName: string;
  onChangeTravelerName: (name: string) => void;
  travelerAvatar: string | null;
  onUploadTravelerAvatar: (file: File) => void;
  selectedThemeId: string;
  onSelectTheme: (themeId: string) => void;
  onShowToast: (msg: string) => void;
}

export const DistrictTrackerSection: React.FC<DistrictTrackerSectionProps> = ({
  lang,
  visitedUpazilas,
  onToggleUpazila,
  onSelectAllUpazilas,
  onClearAllUpazilas,
  travelerName,
  onChangeTravelerName,
  travelerAvatar,
  onUploadTravelerAvatar,
  selectedThemeId,
  onSelectTheme,
  onShowToast,
}) => {
  const [upazilaSearch, setUpazilaSearch] = useState('');
  const [showUpazilaNames, setShowUpazilaNames] = useState(true);
  const [exportingFormat, setExportingFormat] = useState<'png' | 'jpg' | null>(
    null
  );

  const currentTheme: MapTheme =
    MAP_THEMES.find((t) => t.id === selectedThemeId) || MAP_THEMES[0];

  const totalUpazilas = UPAZILAS.length;
  const visitedCount = visitedUpazilas.length;
  const progressPercent = Math.round((visitedCount / totalUpazilas) * 100);

  const filteredUpazilas = UPAZILAS.filter((u) => {
    if (!upazilaSearch.trim()) return true;
    const q = upazilaSearch.toLowerCase();
    return (
      u.nameBn.toLowerCase().includes(q) || u.nameEn.toLowerCase().includes(q)
    );
  });

  const getRankLabel = () => {
    if (visitedCount === 0) {
      return lang === 'bn' ? 'ভ্রমণ শুরু করুন' : 'Start Exploring';
    }
    if (visitedCount <= 4) {
      return lang === 'bn' ? 'নবীন পর্যটক' : 'Novice Explorer';
    }
    if (visitedCount <= 9) {
      return lang === 'bn' ? 'দিনাজপুর অভিযাত্রী' : 'Dinajpur Adventurer';
    }
    if (visitedCount < 13) {
      return lang === 'bn' ? 'অভিজ্ঞ ট্রাভেলার' : 'Master Traveler';
    }
    return lang === 'bn' ? 'দিনাজপুর জয়ী ১০০% 🏆' : 'Dinajpur Conqueror 100% 🏆';
  };

  const todayFormatted = new Date().toLocaleDateString(
    lang === 'bn' ? 'bn-BD' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  const handlePrintPoster = () => {
    const cleanName = (travelerName || 'Traveler').trim();
    const originalTitle = document.title;
    document.title = `Hangout-Dinajpur-${cleanName.replace(/\s+/g, '-')}-Map`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const handleDownloadPoster = async (format: 'png' | 'jpg') => {
    const posterEl = document.getElementById('printablePoster');
    if (!posterEl) return;

    setExportingFormat(format);
    try {
      const canvas = await html2canvas(posterEl, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: currentTheme.isDark ? '#0f172a' : '#ffffff',
      });
      const link = document.createElement('a');
      const cleanName = (travelerName || 'Traveler')
        .trim()
        .replace(/[\s/\\?%*:|"<>]+/g, '-');
      link.download = `Hangout-Dinajpur-${cleanName}.${format}`;
      link.href = canvas.toDataURL(
        format === 'jpg' ? 'image/jpeg' : 'image/png',
        format === 'jpg' ? 0.95 : 1.0
      );
      link.click();
      onShowToast(
        lang === 'bn'
          ? `আপনার ভ্রমণ ম্যাপ (${format.toUpperCase()}) ডাউনলোড হয়েছে!`
          : `Your travel map (${format.toUpperCase()}) has been downloaded!`
      );
    } catch (err) {
      console.error('Export error:', err);
      handlePrintPoster();
    } finally {
      setExportingFormat(null);
    }
  };

  return (
    <section id="upazila-tracker-section" className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ============================================================ */}
        {/* LEFT COLUMN: VISITED UPAZILAS SELECTOR (Matches Ref Image 1) */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs flex flex-col gap-4">
          {/* Header with Count Pill */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900">
              {lang === 'bn' ? 'যেসব উপজেলায় গিয়েছি' : 'Upazilas I Have Visited'}
            </h3>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#e6f4ea] text-[#137333] tabular-nums">
              {formatNumber(visitedCount, lang)} /{' '}
              {formatNumber(totalUpazilas, lang)}
            </span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={upazilaSearch}
              onChange={(e) => setUpazilaSearch(e.target.value)}
              placeholder={
                lang === 'bn' ? 'উপজেলা খুঁজুন...' : 'Search upazila...'
              }
              className="w-full pl-10 pr-4 py-2.5 bg-[#F7F6F2] border border-slate-200/90 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 transition-colors placeholder:text-slate-400"
            />
          </div>

          {/* Select All / Clear All Underlined Links (Exact match to Image 1) */}
          <div className="flex items-center gap-4 text-xs font-bold text-slate-600 px-0.5">
            <button
              type="button"
              onClick={onSelectAllUpazilas}
              className="underline underline-offset-4 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              {lang === 'bn' ? 'সব বাছাই করুন' : 'Select All'}
            </button>
            <button
              type="button"
              onClick={onClearAllUpazilas}
              className="underline underline-offset-4 hover:text-rose-600 transition-colors cursor-pointer"
            >
              {lang === 'bn' ? 'সব মুছুন' : 'Clear All'}
            </button>
          </div>

          {/* 13 Upazilas Interactive Checklist */}
          <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredUpazilas.map((u) => {
              const isVisited = visitedUpazilas.includes(u.id);
              const spotCount = SPOTS.filter((s) => s.upazilaId === u.id).length;

              return (
                <div
                  key={u.id}
                  onClick={() => onToggleUpazila(u.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isVisited
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                      : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isVisited
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isVisited && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold leading-snug truncate">
                        {lang === 'bn' ? u.nameBn : u.nameEn}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {lang === 'bn' ? u.nameEn : u.nameBn} ·{' '}
                        {formatNumber(spotCount, lang)}{' '}
                        {lang === 'bn' ? 'টি স্পট' : 'spots'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-bold shrink-0 ${
                      isVisited ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {isVisited
                      ? lang === 'bn'
                        ? 'ঘুরেছি'
                        : 'Visited'
                      : lang === 'bn'
                      ? 'বাকি'
                      : 'Unvisited'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Glassmorphic 100% Progress Card (Inspired by Reference Image 2) */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#162a3a] via-[#1c3b4d] to-[#0f1e29] p-4 text-white shadow-sm border border-white/15">
            <div className="border border-white/25 rounded-xl p-3.5 bg-white/5 backdrop-blur-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-sky-200/90 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{getRankLabel()}</span>
                </span>
                <span className="text-[11px] text-white/70 tabular-nums">
                  {formatNumber(visitedCount, lang)}/
                  {formatNumber(totalUpazilas, lang)}{' '}
                  {lang === 'bn' ? 'উপজেলা' : 'Upazilas'}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white/95 tabular-nums">
                  {formatNumber(progressPercent, lang)}%
                </span>
                <span className="text-xs text-emerald-300 font-semibold">
                  {progressPercent === 100
                    ? lang === 'bn'
                      ? 'সম্পূর্ণ দিনাজপুর ভ্রমণ সম্পন্ন!'
                      : '100% Dinajpur Explored!'
                    : lang === 'bn'
                    ? 'ভ্রমণ অগ্রগতি'
                    : 'Exploration Progress'}
                </span>
              </div>

              <div className="w-full bg-white/15 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: THEME BAR + MAP POSTER (Matches Ref Image 1)   */}
        {/* ============================================================ */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col gap-5">
          {/* Top Customization Controls Bar (Exact Match to Image 1) */}
          <div className="flex flex-col gap-4 pb-4 border-b border-slate-200/80">
            {/* Row 1: Theme Swatches + Export Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* 5 Split-Circle Theme Swatches */}
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm font-bold text-slate-600">
                  {lang === 'bn' ? 'থিম' : 'Theme'}
                </span>
                <div className="flex items-center gap-2.5">
                  {MAP_THEMES.map((theme) => {
                    const isSelected = theme.id === selectedThemeId;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => onSelectTheme(theme.id)}
                        title={lang === 'bn' ? theme.nameBn : theme.nameEn}
                        className={`w-8 h-8 rounded-full p-0.5 transition-transform cursor-pointer ${
                          isSelected
                            ? 'ring-2 ring-slate-900 scale-110'
                            : 'hover:scale-105 opacity-85 hover:opacity-100'
                        }`}
                      >
                        <span
                          className="block w-full h-full rounded-full border border-black/10"
                          style={{
                            background: `linear-gradient(135deg, ${theme.topHalfColor} 50%, ${theme.bottomHalfColor} 50%)`,
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Export Actions (PNG, JPG, PDF) */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintPoster}
                  className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
                <button
                  type="button"
                  disabled={exportingFormat !== null}
                  onClick={() => handleDownloadPoster('jpg')}
                  className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>
                    {exportingFormat === 'jpg'
                      ? lang === 'bn'
                        ? 'তৈরি হচ্ছে...'
                        : 'Saving...'
                      : 'JPG'}
                  </span>
                </button>
                <button
                  type="button"
                  disabled={exportingFormat !== null}
                  onClick={() => handleDownloadPoster('png')}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>
                    {exportingFormat === 'png'
                      ? lang === 'bn'
                        ? 'তৈরি হচ্ছে...'
                        : 'Saving...'
                      : lang === 'bn'
                      ? 'PNG ডাউনলোড'
                      : 'Download PNG'}
                  </span>
                </button>
              </div>
            </div>

            {/* Row 2: Add Photo + Traveler Name Input + Show Upazila Names Checkbox */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Add Your Photo Dashed Button (Matches Image 1) */}
              <label className="px-3.5 py-2 rounded-xl border border-dashed border-slate-300 hover:border-emerald-600 bg-[#F9F8F6] hover:bg-emerald-50/40 text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onUploadTravelerAvatar(file);
                      e.target.value = '';
                    }
                  }}
                />
                {travelerAvatar ? (
                  <img
                    src={travelerAvatar}
                    alt="Avatar"
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-slate-500" />
                )}
                <span>
                  {travelerAvatar
                    ? lang === 'bn'
                      ? 'ছবি পরিবর্তন করুন'
                      : 'Change Photo'
                    : lang === 'bn'
                    ? 'আপনার ছবি যোগ করুন'
                    : 'Add Your Photo'}
                </span>
              </label>

              {/* Traveler Name Input (Matches Image 1) */}
              <input
                type="text"
                value={travelerName}
                onChange={(e) => onChangeTravelerName(e.target.value)}
                placeholder={
                  lang === 'bn'
                    ? 'আপনার নাম (ঐচ্ছিক)'
                    : 'Your Name (Optional)'
                }
                className="px-3.5 py-2 rounded-xl bg-[#F9F8F6] border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-600 transition-colors min-w-[180px] flex-1 sm:flex-initial"
              />

              {/* Show Upazila Names Checkbox (Matches Image 1) */}
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 cursor-pointer select-none ml-auto sm:ml-2">
                <input
                  type="checkbox"
                  checked={showUpazilaNames}
                  onChange={(e) => setShowUpazilaNames(e.target.checked)}
                  className="w-4 h-4 rounded accent-emerald-700 cursor-pointer"
                />
                <span>
                  {lang === 'bn' ? 'উপজেলার নাম' : 'Upazila Names'}
                </span>
              </label>
            </div>
          </div>

          {/* ========================================================== */}
          {/* PRINTABLE / DOWNLOADABLE POSTER CANVAS                     */}
          {/* ========================================================== */}
          <div
            id="printablePoster"
            style={{
              backgroundColor: currentTheme.canvasBg,
              color: currentTheme.textColor,
            }}
            className={`rounded-2xl border p-4 sm:p-6 flex flex-col gap-5 transition-colors duration-300 ${
              currentTheme.isDark ? 'border-slate-800' : 'border-slate-200/80'
            }`}
          >
            {/* Poster Header */}
            <div
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b gap-3 ${
                currentTheme.isDark ? 'border-slate-800' : 'border-slate-200/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: currentTheme.accentColor }}
                  className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-black text-lg shadow-xs shrink-0"
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black tracking-tight">
                    {lang === 'bn'
                      ? 'আমার দেখা দিনাজপুর'
                      : 'My Dinajpur Travel Map'}
                  </h3>
                  <p
                    style={{ color: currentTheme.subTextColor }}
                    className="text-xs font-medium"
                  >
                    {lang === 'bn'
                      ? '১৩টি উপজেলার ভ্রমণ ট্র্যাকার ও সার্টিফিকেট'
                      : '13 Upazilas Exploration Tracker & Certificate'}
                  </p>
                </div>
              </div>

              {/* Traveler Badge on Poster */}
              <div
                className={`flex items-center gap-3 px-3.5 py-2 rounded-xl border ${
                  currentTheme.isDark
                    ? 'bg-slate-900/90 border-slate-800'
                    : 'bg-white border-slate-200/90'
                }`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500 flex items-center justify-center bg-emerald-50 text-emerald-700 shrink-0">
                  {travelerAvatar ? (
                    <img
                      src={travelerAvatar}
                      alt={travelerName || 'Traveler'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold leading-tight">
                    {travelerName.trim() ||
                      (lang === 'bn' ? 'ভ্রমণকারী' : 'Dinajpur Explorer')}
                  </div>
                  <div
                    style={{ color: currentTheme.subTextColor }}
                    className="text-[11px] mt-0.5"
                  >
                    {getRankLabel()} · {todayFormatted}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive 13-Upazila SVG Map of Dinajpur */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-2 text-xs font-semibold">
                <div className="flex items-center gap-2 text-[11px]">
                  <span
                    style={{ backgroundColor: currentTheme.visitedFillStart }}
                    className="w-3 h-3 rounded-full inline-block"
                  />
                  <span>
                    {lang === 'bn' ? 'ভ্রমণ সম্পন্ন' : 'Visited'} (
                    {formatNumber(visitedCount, lang)})
                  </span>
                  <span
                    style={{ backgroundColor: currentTheme.unvisitedFill }}
                    className="w-3 h-3 rounded-full inline-block ml-2 border border-slate-400"
                  />
                  <span>
                    {lang === 'bn' ? 'ভ্রমণ বাকি' : 'Unvisited'} (
                    {formatNumber(totalUpazilas - visitedCount, lang)})
                  </span>
                </div>
                <span
                  style={{ color: currentTheme.accentColor }}
                  className="font-extrabold text-xs tabular-nums"
                >
                  {formatNumber(progressPercent, lang)}%{' '}
                  {lang === 'bn' ? 'সম্পন্ন' : 'Completed'}
                </span>
              </div>

              <div className="w-full max-w-[460px] aspect-[4/5] relative flex items-center justify-center">
                <svg
                  viewBox="0 0 500 620"
                  className="w-full h-full select-none"
                >
                  <defs>
                    <linearGradient
                      id={`visitedGrad_${currentTheme.id}`}
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor={currentTheme.visitedFillStart}
                      />
                      <stop
                        offset="100%"
                        stopColor={currentTheme.visitedFillEnd}
                      />
                    </linearGradient>
                  </defs>

                  {UPAZILAS.map((u) => {
                    const isVisited = visitedUpazilas.includes(u.id);
                    const primaryTextColor = isVisited
                      ? '#ffffff'
                      : currentTheme.isDark
                      ? '#e2e8f0'
                      : '#1e293b';
                    const secondaryTextColor = isVisited
                      ? 'rgba(255,255,255,0.85)'
                      : currentTheme.isDark
                      ? '#94a3b8'
                      : '#64748b';

                    return (
                      <g
                        key={u.id}
                        onClick={() => onToggleUpazila(u.id)}
                        className="upazila-path group"
                      >
                        <polygon
                          points={u.points}
                          fill={
                            isVisited
                              ? `url(#visitedGrad_${currentTheme.id})`
                              : currentTheme.unvisitedFill
                          }
                          stroke={
                            isVisited
                              ? currentTheme.visitedStroke
                              : currentTheme.unvisitedStroke
                          }
                          strokeWidth={isVisited ? '2.5' : '2'}
                          strokeLinejoin="round"
                        />
                        {showUpazilaNames && (
                          <>
                            <text
                              x={u.textX}
                              y={u.textY}
                              textAnchor="middle"
                              fontSize="12"
                              fontWeight="700"
                              fill={primaryTextColor}
                              className="pointer-events-none"
                            >
                              {lang === 'bn' ? u.nameBn : u.nameEn}
                            </text>
                            <text
                              x={u.textX}
                              y={u.subY}
                              textAnchor="middle"
                              fontSize="9"
                              fill={secondaryTextColor}
                              className="pointer-events-none"
                            >
                              {lang === 'bn' ? u.nameEn : u.nameBn}
                            </text>
                          </>
                        )}
                        {isVisited && (
                          <text
                            x={u.textX}
                            y={u.markY}
                            textAnchor="middle"
                            fontSize="13"
                            fontWeight="bold"
                            fill="#ffffff"
                            className="pointer-events-none"
                          >
                            ✓
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
              <p
                style={{ color: currentTheme.subTextColor }}
                className="text-[11px] mt-1 text-center no-export"
              >
                {lang === 'bn'
                  ? 'টিপস: ম্যাপের যেকোনো উপজেলার ওপর ক্লিক করে ভ্রমণ চিহ্নিত করতে পারেন'
                  : 'Tip: Click directly on any upazila on the map to mark it as visited'}
              </p>
            </div>

            {/* Poster Footer */}
            <div
              style={{ color: currentTheme.subTextColor }}
              className={`pt-3.5 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs ${
                currentTheme.isDark ? 'border-slate-800' : 'border-slate-200/80'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  style={{ color: currentTheme.textColor }}
                  className="font-bold"
                >
                  Hangout Dinajpur
                </span>
                <span>·</span>
                <span>
                  {lang === 'bn'
                    ? 'দিনাজপুর ভ্রমণ গাইড ও ট্র্যাকার'
                    : 'Dinajpur Travel Guide & District Tracker'}
                </span>
              </div>
              <div className="text-[11px] font-medium">
                {formatNumber(visitedCount, lang)} /{' '}
                {formatNumber(totalUpazilas, lang)}{' '}
                {lang === 'bn' ? 'উপজেলা ভ্রমণ সম্পন্ন' : 'Upazilas Visited'} (
                {formatNumber(progressPercent, lang)}%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
