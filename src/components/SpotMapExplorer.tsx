import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import {
  Search,
  X,
  Maximize2,
  Camera,
  Navigation,
  MapPin,
  RotateCcw,
  Cloud,
  HardDrive,
  Sparkles,
  Crosshair,
  Compass,
  PhoneCall,
  ShieldAlert,
  Loader2,
  Route,
  ExternalLink,
} from 'lucide-react';
import {
  Language,
  TouristSpot,
  SPOTS,
  UPAZILAS,
  formatNumber,
} from '../data/dinajpurData';
import { WeatherForecastWidget } from './WeatherForecastWidget';

export interface SpotPhotoRecord {
  id?: string;
  spotId: string;
  photoData: string;
  uploaderName: string;
  uploaderUid?: string;
  isCloud?: boolean;
}

interface SpotMapExplorerProps {
  lang: Language;
  cloudPhotos: Record<string, SpotPhotoRecord>;
  localPhotos: Record<string, SpotPhotoRecord>;
  onOpenSpotDrawer: (spot: TouristSpot) => void;
  onQuickUploadPhoto: (spotId: string, file: File) => void;
}

const CATEGORY_CONFIG: Record<
  TouristSpot['category'],
  {
    color: string;
    bg: string;
    text: string;
    gradient: string;
    labelBn: string;
    labelEn: string;
    shortIcon: string;
  }
> = {
  Historical: {
    color: '#b45309',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    gradient: 'from-amber-700 to-orange-900',
    labelBn: 'ঐতিহাসিক',
    labelEn: 'Historical',
    shortIcon: '🏛️',
  },
  Nature: {
    color: '#047857',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    gradient: 'from-emerald-700 to-teal-900',
    labelBn: 'প্রকৃতি',
    labelEn: 'Nature',
    shortIcon: '🌲',
  },
  Religious: {
    color: '#0369a1',
    bg: 'bg-sky-50',
    text: 'text-sky-800',
    gradient: 'from-sky-700 to-blue-900',
    labelBn: 'ধর্মীয়',
    labelEn: 'Religious',
    shortIcon: '🕌',
  },
  'Resort/Park': {
    color: '#6d28d9',
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    gradient: 'from-purple-700 to-indigo-900',
    labelBn: 'রিসোর্ট ও পার্ক',
    labelEn: 'Resort & Park',
    shortIcon: '🎡',
  },
  Industry: {
    color: '#334155',
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    gradient: 'from-slate-700 to-slate-900',
    labelBn: 'শিল্প ও ল্যান্ডমার্ক',
    labelEn: 'Industry & Port',
    shortIcon: '⚓',
  },
};

const TILE_LAYERS = {
  // Official Google Maps Roadmap (Roads, highways, towns, labels - Zero Watermark)
  google: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
  // Google Hybrid (High-res Satellite with roads and landmark labels)
  google_hybrid: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
  // OpenStreetMap standard (Detailed road maps, rivers, local landmarks)
  osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  // Esri World Imagery (High-res Global Satellite)
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
};

// Haversine distance in kilometers
function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export const SpotMapExplorer: React.FC<SpotMapExplorerProps> = ({
  lang,
  cloudPhotos,
  localPhotos,
  onOpenSpotDrawer,
  onQuickUploadPhoto,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('all');
  const [mapLayer, setMapLayer] = useState<'google' | 'google_hybrid' | 'osm' | 'satellite'>('google');
  const [mobileView, setMobileView] = useState<'split' | 'map' | 'list'>('split');
  const [activeSpotId, setActiveSpotId] = useState<string | null>(null);

  // Live Location & Uber GPS Navigation state
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [sortByNearest, setSortByNearest] = useState(false);
  const [activeRouteSpot, setActiveRouteSpot] = useState<TouristSpot | null>(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userAccuracyCircleRef = useRef<L.Circle | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);

  // Filter and optionally sort spots by nearest to user GPS
  const filteredSpots = useMemo(() => {
    const list = SPOTS.filter((spot) => {
      const matchesCat = selectedCategory === 'all' || spot.category === selectedCategory;
      const matchesUpazila = selectedUpazila === 'all' || spot.upazilaId === selectedUpazila;
      if (!matchesCat || !matchesUpazila) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        spot.nameBn.toLowerCase().includes(q) ||
        spot.nameEn.toLowerCase().includes(q) ||
        spot.upazilaBn.toLowerCase().includes(q) ||
        spot.upazilaEn.toLowerCase().includes(q) ||
        spot.descriptionBn.toLowerCase().includes(q) ||
        spot.descriptionEn.toLowerCase().includes(q)
      );
    });

    if (sortByNearest && userLocation) {
      return [...list].sort((a, b) => {
        const distA = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const distB = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, b.lat, b.lng);
        return distA - distB;
      });
    }
    return list;
  }, [selectedCategory, selectedUpazila, searchQuery, sortByNearest, userLocation]);

  // Expose custom event listener for popup detail button clicks
  useEffect(() => {
    const handlePopupDetailEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const spotId = customEvent.detail;
      const found = SPOTS.find((s) => s.id === spotId);
      if (found) {
        if (mapRef.current) {
          mapRef.current.closePopup();
        }
        onOpenSpotDrawer(found);
      }
    };
    window.addEventListener('open-dinajpur-spot-drawer', handlePopupDetailEvent);
    return () => {
      window.removeEventListener('open-dinajpur-spot-drawer', handlePopupDetailEvent);
    };
  }, [onOpenSpotDrawer]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const dinajpurCenter: L.LatLngExpression = [25.6279, 88.6332];
    const instance = L.map(mapContainerRef.current, {
      center: dinajpurCenter,
      zoom: 10,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(instance);
    mapRef.current = instance;

    // Immediately schedule size recalculation to prevent gray tiles
    const timer1 = setTimeout(() => instance.invalidateSize(), 150);
    const timer2 = setTimeout(() => instance.invalidateSize(), 500);

    const handleWindowResize = () => {
      instance.invalidateSize();
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', handleWindowResize);
      instance.remove();
      mapRef.current = null;
    };
  }, []);

  // Invalidate size whenever mobile tab changes (e.g. split -> map)
  useEffect(() => {
    if (!mapRef.current) return;
    const t = setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 120);
    return () => clearTimeout(t);
  }, [mobileView]);

  // Update Tile Layer (100% Free, Zero API Key Required)
  useEffect(() => {
    if (!mapRef.current) return;
    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }

    if (mapLayer === 'google') {
      tileLayerRef.current = L.tileLayer(TILE_LAYERS.google, {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        attribution: '&copy; Google Maps',
      }).addTo(mapRef.current);
    } else if (mapLayer === 'google_hybrid') {
      tileLayerRef.current = L.tileLayer(TILE_LAYERS.google_hybrid, {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        attribution: '&copy; Google Satellite &copy; Google Maps',
      }).addTo(mapRef.current);
    } else if (mapLayer === 'satellite') {
      // Esri World Imagery - High Resolution Free Satellite (No API key required)
      tileLayerRef.current = L.tileLayer(TILE_LAYERS.satellite, {
        maxZoom: 19,
        attribution: 'Esri World Imagery &copy; Esri & Earthstar Geographics',
      }).addTo(mapRef.current);
    } else {
      // OpenStreetMap standard (100% Free & Open)
      tileLayerRef.current = L.tileLayer(TILE_LAYERS.osm, {
        subdomains: ['a', 'b', 'c'],
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }

    const t = setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 80);
    return () => clearTimeout(t);
  }, [mapLayer]);

  // Handle User Live GPS Location (Uber style pulsing blue dot)
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      setLocationError(
        lang === 'bn'
          ? 'আপনার ব্রাউজারে GPS লোকেশন সাপোর্ট করে না।'
          : 'Geolocation is not supported by your browser.'
      );
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const newCoords = { lat: latitude, lng: longitude, accuracy };
        setUserLocation(newCoords);
        setIsLocating(false);

        if (mapRef.current) {
          // Remove previous user marker and circle
          if (userMarkerRef.current) mapRef.current.removeLayer(userMarkerRef.current);
          if (userAccuracyCircleRef.current) mapRef.current.removeLayer(userAccuracyCircleRef.current);

          // Add Pulsing Blue Dot Marker
          const userGpsIcon = L.divIcon({
            className: 'user-gps-div-icon',
            html: `
              <div class="user-gps-pulse-marker">
                <div class="user-gps-ring"></div>
                <div class="user-gps-core"></div>
              </div>
            `,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          });

          const uMarker = L.marker([latitude, longitude], { icon: userGpsIcon, zIndexOffset: 1000 });
          uMarker.bindPopup(`
            <div style="padding: 10px; font-family: sans-serif; text-align: center;">
              <strong style="color: #2563eb; font-size: 13px;">📍 ${
                lang === 'bn' ? 'আপনার বর্তমান অবস্থান' : 'Your Live Location'
              }</strong>
              <div style="font-size: 11px; color: #64748b; margin-top: 3px;">
                ${lang === 'bn' ? 'জিপিএস একুরেসি:' : 'GPS Accuracy:'} ±${Math.round(accuracy)}m
              </div>
            </div>
          `);
          uMarker.addTo(mapRef.current);
          userMarkerRef.current = uMarker;

          // Add subtle accuracy circle
          const accCircle = L.circle([latitude, longitude], {
            radius: Math.min(accuracy, 1500),
            color: '#3b82f6',
            fillColor: '#60a5fa',
            fillOpacity: 0.12,
            weight: 1.5,
          }).addTo(mapRef.current);
          userAccuracyCircleRef.current = accCircle;

          // Smoothly fly to user location
          mapRef.current.flyTo([latitude, longitude], 13, { duration: 1.2 });
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        setLocationError(
          lang === 'bn'
            ? 'লোকেশন চালু করতে ব্রাউজারের Location Permission অনুমতি দিন।'
            : 'Please allow Location permission in your browser.'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 10000,
      }
    );
  };

  // Draw or clear Uber navigation route polyline from user to spot
  const handleToggleRouteToSpot = (spot: TouristSpot) => {
    if (!mapRef.current) return;

    if (activeRouteSpot?.id === spot.id) {
      if (routeLineRef.current) {
        mapRef.current.removeLayer(routeLineRef.current);
        routeLineRef.current = null;
      }
      setActiveRouteSpot(null);
      return;
    }

    if (!userLocation) {
      handleLocateUser();
    }

    const startLat = userLocation ? userLocation.lat : 25.6279;
    const startLng = userLocation ? userLocation.lng : 88.6332;

    if (routeLineRef.current) {
      mapRef.current.removeLayer(routeLineRef.current);
    }

    // Uber-style bold dynamic gradient polyline
    const line = L.polyline(
      [
        [startLat, startLng],
        [spot.lat, spot.lng],
      ],
      {
        color: '#2563eb',
        weight: 5,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round',
      }
    ).addTo(mapRef.current);

    routeLineRef.current = line;
    setActiveRouteSpot(spot);

    const bounds = L.latLngBounds([
      [startLat, startLng],
      [spot.lat, spot.lng],
    ]);
    mapRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
  };

  // Render Map Markers & Popups cleanly in active language
  useEffect(() => {
    if (!mapRef.current) return;

    Object.values(markersRef.current).forEach((m) => {
      mapRef.current?.removeLayer(m);
    });
    markersRef.current = {};

    filteredSpots.forEach((spot) => {
      const cfg = CATEGORY_CONFIG[spot.category] || CATEGORY_CONFIG.Historical;
      const isHighlighted = activeSpotId === spot.id;
      const size = isHighlighted ? 40 : 34;
      const border = isHighlighted ? '3px solid #10b981' : '2.5px solid #ffffff';

      const icon = L.divIcon({
        className: 'custom-dinajpur-marker',
        html: `
          <div style="
            background-color: ${cfg.color};
            width: ${size}px;
            height: ${size}px;
            border-radius: 9999px;
            border: ${border};
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.32);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: ${Math.round(size * 0.46)}px;
            transition: transform 0.2s ease;
          ">
            ${cfg.shortIcon}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2 - 2],
      });

      const marker = L.marker([spot.lat, spot.lng], { icon });

      const photoRecord = cloudPhotos[spot.id] || localPhotos[spot.id];
      const displayPhoto = photoRecord?.photoData || spot.defaultImage || null;
      const uploaderBadge = photoRecord?.uploaderName
        ? `${photoRecord.isCloud ? '☁️' : '📷'} ${photoRecord.uploaderName}`
        : lang === 'bn'
        ? 'ভেরিফাইড স্পট'
        : 'Verified Spot';

      // Live distance from user GPS if available
      const distanceKm = userLocation
        ? getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, spot.lat, spot.lng)
        : null;

      const titleText = lang === 'bn' ? spot.nameBn : spot.nameEn;
      const subTitleText = lang === 'bn' ? spot.nameEn : spot.nameBn;
      const upazilaText = lang === 'bn' ? spot.upazilaBn : spot.upazilaEn;
      const categoryText = lang === 'bn' ? spot.categoryBn : spot.categoryEn;
      const descText = lang === 'bn' ? spot.descriptionBn : spot.descriptionEn;
      const detailBtnLabel = lang === 'bn' ? 'বিস্তারিত ও ছবি' : 'Details & Photos';
      const dirBtnLabel = lang === 'bn' ? 'ডিরেকশন' : 'Directions';
      const distanceLabel = distanceKm !== null
        ? lang === 'bn'
          ? `📍 আপনার থেকে ${formatNumber(distanceKm, 'bn')} কি.মি.`
          : `📍 ${distanceKm} km from you`
        : null;

      const popupHtml = `
        <div style="width: 280px; overflow: hidden; background: #ffffff; color: #0f172a;">
          ${
            displayPhoto
              ? `
            <div style="height: 132px; position: relative; overflow: hidden; background: #0f172a;">
              <img src="${displayPhoto}" alt="${titleText}" referrerpolicy="no-referrer" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
              <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,23,42,0.75), transparent 60%);"></div>
              <span style="position: absolute; bottom: 8px; left: 10px; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; background: rgba(15, 23, 42, 0.8); color: #ffffff;">
                ${uploaderBadge}
              </span>
            </div>
          `
              : `
            <div style="height: 92px; background: linear-gradient(135deg, ${cfg.color}, #0f172a); padding: 14px; display: flex; align-items: center; gap: 12px; color: #ffffff;">
              <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.16); display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0;">
                ${cfg.shortIcon}
              </div>
              <div style="min-width: 0; flex: 1;">
                <div style="font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${titleText}</div>
                <div style="font-size: 11px; color: rgba(255,255,255,0.82); margin-top: 2px;">${categoryText} · ${upazilaText}</div>
              </div>
            </div>
          `
          }
          <div style="padding: 14px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 3px;">
              <div style="font-size: 11px; font-weight: 600; color: #059669;">
                ${upazilaText} · ${categoryText}
              </div>
              ${
                distanceLabel
                  ? `<div style="font-size: 10px; font-weight: 700; color: #2563eb; background: #eff6ff; padding: 1px 6px; border-radius: 4px;">${distanceLabel}</div>`
                  : ''
              }
            </div>
            <h4 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0; line-height: 1.3;">
              ${titleText}
            </h4>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
              ${subTitleText}
            </div>
            <p style="font-size: 12px; color: #475569; margin: 8px 0 12px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.45;">
              ${descText}
            </p>
            <div style="display: flex; align-items: center; gap: 8px;">
              <button
                type="button"
                onclick="window.dispatchEvent(new CustomEvent('open-dinajpur-spot-drawer', { detail: '${spot.id}' }))"
                style="flex: 1; padding: 8px 10px; background: #059669; color: #ffffff; border: none; border-radius: 10px; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; text-align: center;"
              >
                ${detailBtnLabel}
              </button>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}"
                target="_blank"
                rel="noopener noreferrer"
                style="padding: 8px 12px; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 10px; font-size: 12px; font-weight: 700; text-decoration: none; white-space: nowrap; display: inline-flex; align-items: center; gap: 4px;"
              >
                <span>📍 Google Maps</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 280,
        minWidth: 280,
        closeButton: true,
        autoPanPadding: [24, 24],
      });

      marker.on('click', () => {
        setActiveSpotId(spot.id);
      });

      marker.addTo(mapRef.current!);
      markersRef.current[spot.id] = marker;
    });
  }, [filteredSpots, lang, cloudPhotos, localPhotos, activeSpotId, userLocation]);

  const handleFitBounds = () => {
    if (!mapRef.current || filteredSpots.length === 0) return;
    const bounds = L.latLngBounds(filteredSpots.map((s) => [s.lat, s.lng]));
    mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedUpazila('all');
    setActiveSpotId(null);
    setSortByNearest(false);
    if (routeLineRef.current && mapRef.current) {
      mapRef.current.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }
    setActiveRouteSpot(null);
    if (mapRef.current) {
      mapRef.current.closePopup();
      mapRef.current.setView([25.6279, 88.6332], 10);
    }
  };

  const handleSelectSpotOnMap = (spot: TouristSpot) => {
    setActiveSpotId(spot.id);
    if (window.innerWidth < 1024 && mobileView === 'list') {
      setMobileView('map');
    }
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
        mapRef.current.flyTo([spot.lat, spot.lng], 14, {
          duration: 1.0,
        });
        const marker = markersRef.current[spot.id];
        if (marker) {
          setTimeout(() => {
            marker.openPopup();
          }, 550);
        }
      }
    }, 80);
  };

  const categoryCounts = {
    all: SPOTS.length,
    Historical: SPOTS.filter((s) => s.category === 'Historical').length,
    Nature: SPOTS.filter((s) => s.category === 'Nature').length,
    Religious: SPOTS.filter((s) => s.category === 'Religious').length,
    'Resort/Park': SPOTS.filter((s) => s.category === 'Resort/Park').length,
    Industry: SPOTS.filter((s) => s.category === 'Industry').length,
  };

  return (
    <section id="spot-map-section" className="w-full space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-emerald-700 tracking-wide">
            {lang === 'bn'
              ? 'ইন্টারেক্টিভ জিপিএস ম্যাপ ও গাইড · ১৩টি উপজেলা'
              : 'Interactive GPS Map & Guide · 13 Upazilas'}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {lang === 'bn'
              ? 'দিনাজপুরে কোথায় ঘুরবেন?'
              : 'Where to Explore in Dinajpur'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent('open-dinajpur-emergency-modal')
              )
            }
            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200/90 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors whitespace-nowrap cursor-pointer"
            title={
              lang === 'bn'
                ? 'দিনাজপুর জরুরি হেল্পলাইন ও সাপোর্ট'
                : 'Dinajpur Emergency Helpline'
            }
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>{lang === 'bn' ? 'জরুরি সেবা' : 'Emergency'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetFilters}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>{lang === 'bn' ? 'রিসেট ম্যাপ' : 'Reset Map'}</span>
          </button>
        </div>
      </div>

      {/* Dinajpur Real-Time Weather & 3-Day Forecast Widget (OpenWeatherMap API) */}
      <WeatherForecastWidget
        lang={lang}
        selectedUpazilaId={selectedUpazila}
      />

      {/* Search & Filters Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === 'bn'
                ? 'স্থান বা উপজেলার নাম দিয়ে খুঁজুন (যেমন: কান্তজিউ, সুখ সাগর, রাজবাড়ি, রামসাগর...)'
                : 'Search by spot or upazila name (e.g. Kantaji, Sukh Sagar, Rajbari, Ramsagar...)'
            }
            className="w-full pl-10 pr-9 py-2.5 bg-[#F9F8F6] border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setTimeout(handleFitBounds, 50);
            }}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {lang === 'bn' ? 'সব ধরণ' : 'All Spots'} (
            {formatNumber(categoryCounts.all, lang)})
          </button>

          {(Object.keys(CATEGORY_CONFIG) as Array<TouristSpot['category']>).map(
            (cat) => {
              const cfg = CATEGORY_CONFIG[cat];
              const active = selectedCategory === cat;
              const count = categoryCounts[cat];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setTimeout(handleFitBounds, 50);
                  }}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{cfg.shortIcon}</span>
                  <span>{lang === 'bn' ? cfg.labelBn : cfg.labelEn}</span>
                  <span className="opacity-75">
                    ({formatNumber(count, lang)})
                  </span>
                </button>
              );
            }
          )}
        </div>

        {/* 13 Upazila Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
          <span className="text-slate-400 font-bold shrink-0 text-[11px] pr-1">
            {lang === 'bn' ? 'উপজেলা:' : 'Upazila:'}
          </span>
          <button
            type="button"
            onClick={() => {
              setSelectedUpazila('all');
              setTimeout(handleFitBounds, 50);
            }}
            className={`shrink-0 px-2.5 py-1 rounded-lg font-bold transition-colors whitespace-nowrap cursor-pointer ${
              selectedUpazila === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {lang === 'bn' ? 'সব' : 'All'} ({formatNumber(SPOTS.length, lang)})
          </button>
          {UPAZILAS.map((u) => {
            const count = SPOTS.filter((s) => s.upazilaId === u.id).length;
            const active = selectedUpazila === u.id;
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  setSelectedUpazila(u.id);
                  setTimeout(handleFitBounds, 50);
                }}
                className={`shrink-0 px-2.5 py-1 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lang === 'bn' ? u.nameBn : u.nameEn} ({formatNumber(count, lang)})
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile View Switcher */}
      <div className="flex lg:hidden items-center bg-slate-200/80 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => {
            setMobileView('split');
            setTimeout(() => mapRef.current?.invalidateSize(), 100);
          }}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            mobileView === 'split'
              ? 'bg-white text-emerald-800 shadow-2xs'
              : 'text-slate-600'
          }`}
        >
          {lang === 'bn' ? 'ম্যাপ ও তালিকা' : 'Both'}
        </button>
        <button
          type="button"
          onClick={() => {
            setMobileView('map');
            setTimeout(() => mapRef.current?.invalidateSize(), 100);
          }}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            mobileView === 'map'
              ? 'bg-white text-emerald-800 shadow-2xs'
              : 'text-slate-600'
          }`}
        >
          {lang === 'bn' ? 'শুধু ম্যাপ' : 'Map View'}
        </button>
        <button
          type="button"
          onClick={() => setMobileView('list')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            mobileView === 'list'
              ? 'bg-white text-emerald-800 shadow-2xs'
              : 'text-slate-600'
          }`}
        >
          {lang === 'bn' ? 'স্থানের তালিকা' : 'Spot List'} (
          {formatNumber(filteredSpots.length, lang)})
        </button>
      </div>

      {/* Main Split Grid: Left Spot Cards + Right Interactive Leaflet Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Spots List */}
        <div
          className={`${
            mobileView === 'map' ? 'hidden lg:flex' : 'flex'
          } lg:col-span-5 flex-col gap-2.5 lg:h-[640px]`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              {lang === 'bn' ? 'ভেরিফাইড স্থান:' : 'Verified Spots:'}{' '}
              <strong className="text-emerald-700 font-bold tabular-nums">
                {formatNumber(filteredSpots.length, lang)}
                {lang === 'bn' ? ' টি স্থান' : ' spots'}
              </strong>
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'bn'
                ? 'ক্লিক করে ম্যাপে জুম ও ছবি দেখুন'
                : 'Click to zoom on map or view details'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar max-h-[480px] lg:max-h-full">
            {filteredSpots.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800 text-sm">
                  {lang === 'bn'
                    ? 'কোনো দর্শনীয় স্থান পাওয়া যায়নি'
                    : 'No matching tourist spots found'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === 'bn'
                    ? 'অন্য কোনো নাম বা উপজেলা নির্বাচন করে দেখুন।'
                    : 'Try searching with a different keyword or upazila filter.'}
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-100 cursor-pointer"
                >
                  {lang === 'bn' ? 'সব ফিল্টার রিসেট করুন' : 'Reset All Filters'}
                </button>
              </div>
            ) : (
              filteredSpots.map((spot) => {
                const cfg =
                  CATEGORY_CONFIG[spot.category] || CATEGORY_CONFIG.Historical;
                const cloudItem = cloudPhotos[spot.id];
                const localItem = localPhotos[spot.id];
                const photoSrc =
                  cloudItem?.photoData ||
                  localItem?.photoData ||
                  spot.defaultImage ||
                  null;
                const uploaderName =
                  cloudItem?.uploaderName || localItem?.uploaderName || null;
                const isSelected = activeSpotId === spot.id;

                return (
                  <div
                    key={spot.id}
                    className={`group bg-white rounded-2xl p-3 border transition-all duration-200 flex gap-3 items-center ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-500/15 bg-emerald-50/20'
                        : 'border-slate-200/90 hover:border-emerald-500/60 shadow-2xs'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div
                      onClick={() => handleSelectSpotOnMap(spot)}
                      className="cursor-pointer shrink-0"
                    >
                      {photoSrc ? (
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                          <img
                            src={photoSrc}
                            alt={lang === 'bn' ? spot.nameBn : spot.nameEn}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {uploaderName && (
                            <span className="absolute bottom-1 left-1 right-1 px-1.5 py-0.5 rounded bg-slate-900/80 text-white text-[9px] font-semibold truncate flex items-center gap-1">
                              {cloudItem ? (
                                <Cloud className="w-2.5 h-2.5 text-sky-400 shrink-0" />
                              ) : (
                                <HardDrive className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                              )}
                              <span className="truncate">{uploaderName}</span>
                            </span>
                          )}
                        </div>
                      ) : (
                        <div
                          className={`w-20 h-20 rounded-xl bg-gradient-to-tr ${cfg.gradient} flex flex-col items-center justify-center text-white p-1.5 text-center`}
                        >
                          <span className="text-xl mb-0.5">{cfg.shortIcon}</span>
                          <span className="text-[9px] font-bold text-white/90 leading-tight">
                            {lang === 'bn' ? '+ ছবি দিন' : '+ Add Photo'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                      <div
                        onClick={() => handleSelectSpotOnMap(spot)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                          <span className={`font-semibold ${cfg.text}`}>
                            {lang === 'bn' ? spot.categoryBn : spot.categoryEn}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {lang === 'bn' ? spot.upazilaBn : spot.upazilaEn}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mt-0.5 truncate">
                          {lang === 'bn' ? spot.nameBn : spot.nameEn}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {lang === 'bn'
                            ? spot.descriptionBn
                            : spot.descriptionEn}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 gap-2">
                        <label className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                onQuickUploadPhoto(spot.id, file);
                                e.target.value = '';
                              }
                            }}
                          />
                          <Camera className="w-3 h-3" />
                          <span>
                            {cloudItem || localItem
                              ? lang === 'bn'
                                ? 'ছবি পরিবর্তন'
                                : 'Change Photo'
                              : lang === 'bn'
                              ? 'ছবি আপলোড'
                              : 'Upload Photo'}
                          </span>
                        </label>

                        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                          {/* Uber Navigation Line preview button */}
                          <button
                            type="button"
                            onClick={() => handleToggleRouteToSpot(spot)}
                            title={lang === 'bn' ? 'উবার স্টাইল রুট লাইন' : 'Uber Style Route'}
                            className={`p-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                              activeRouteSpot?.id === spot.id
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                            }`}
                          >
                            <Route className="w-3 h-3" />
                            <span className="hidden sm:inline">
                              {activeRouteSpot?.id === spot.id
                                ? lang === 'bn' ? 'রুট অন' : 'Route On'
                                : lang === 'bn' ? 'রুট' : 'Route'}
                            </span>
                          </button>

                          {/* Direct Google Maps Direction */}
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={lang === 'bn' ? 'গুগল ম্যাপে ডিরেকশন দেখুন' : 'Open in Google Maps'}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer whitespace-nowrap"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span className="hidden sm:inline">Google Maps</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleSelectSpotOnMap(spot)}
                            className="text-[11px] font-bold text-slate-600 hover:text-emerald-700 cursor-pointer whitespace-nowrap"
                          >
                            {lang === 'bn' ? 'ম্যাপে পিন →' : 'Show on Map →'}
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenSpotDrawer(spot)}
                            className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap"
                          >
                            {lang === 'bn' ? 'বিস্তারিত' : 'Details'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Interactive Leaflet Map */}
        <div
          className={`${
            mobileView === 'list' ? 'hidden lg:flex' : 'flex'
          } lg:col-span-7 relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs h-[460px] lg:h-[640px] bg-slate-200 flex-col z-10`}
        >
          {/* Map Layer Switcher (Exact Google Maps, Google Hybrid, OpenStreetMap, Satellite HD - Zero Watermark) */}
          <div className="absolute top-3 left-3 z-[400] flex items-center bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200/90 text-xs font-bold gap-1 overflow-x-auto max-w-[calc(100%-110px)] no-scrollbar">
            <button
              type="button"
              onClick={() => setMapLayer('google')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap text-[11px] sm:text-xs font-bold flex items-center gap-1 ${
                mapLayer === 'google'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>🗺️</span>
              <span>{lang === 'bn' ? 'গুগল রোড' : 'Google Roads'}</span>
            </button>
            <button
              type="button"
              onClick={() => setMapLayer('google_hybrid')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap text-[11px] sm:text-xs font-bold flex items-center gap-1 ${
                mapLayer === 'google_hybrid'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>🛰️</span>
              <span>{lang === 'bn' ? 'গুগল হাইব্রিড' : 'Google Hybrid'}</span>
            </button>
            <button
              type="button"
              onClick={() => setMapLayer('osm')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap text-[11px] sm:text-xs font-bold flex items-center gap-1 ${
                mapLayer === 'osm'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>🧭</span>
              <span>{lang === 'bn' ? 'ওপেনস্ট্রিট' : 'OpenStreet'}</span>
            </button>
            <button
              type="button"
              onClick={() => setMapLayer('satellite')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap text-[11px] sm:text-xs font-bold flex items-center gap-1 ${
                mapLayer === 'satellite'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>🌍</span>
              <span>{lang === 'bn' ? 'স্যাটেলাইট' : 'Satellite'}</span>
            </button>
          </div>

          {/* Top-Right Control Buttons: Fit All + Emergency Helpline */}
          <div className="absolute top-3 right-3 z-[400] flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowEmergencyModal(true)}
              title={lang === 'bn' ? 'জরুরি সেবা ও পুলিশ' : 'Emergency & Police Help'}
              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl shadow-sm border border-rose-200 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleFitBounds}
              title={lang === 'bn' ? 'পুরো ম্যাপ দেখুন' : 'Fit All'}
              className="px-2.5 py-1.5 bg-white/95 backdrop-blur-md rounded-xl shadow-sm border border-slate-200 text-slate-700 hover:text-emerald-700 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'ফুল ভিউ' : 'Fit'}</span>
            </button>
          </div>

          {/* Floating Uber-style GPS Locate Me Button & Nearest Sort Pill */}
          <div className="absolute bottom-4 right-4 z-[400] flex flex-col items-end gap-2">
            {locationError && (
              <div className="bg-rose-900/90 text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-md max-w-[210px] leading-tight">
                {locationError}
              </div>
            )}

            {/* Sort by Nearest Spots toggle pill */}
            {userLocation && (
              <button
                type="button"
                onClick={() => setSortByNearest((prev) => !prev)}
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold shadow-md backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer ${
                  sortByNearest
                    ? 'bg-emerald-600 text-white border border-emerald-400'
                    : 'bg-white/95 text-slate-800 border border-slate-200 hover:bg-emerald-50'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>
                  {sortByNearest
                    ? lang === 'bn' ? 'সবচেয়ে কাছের স্পট আগে' : 'Nearest First (Active)'
                    : lang === 'bn' ? 'কাছের স্পট দেখুন' : 'Sort by Nearest'}
                </span>
              </button>
            )}

            {/* Live GPS Target Button (Uber Style Pulse) */}
            <button
              type="button"
              onClick={handleLocateUser}
              disabled={isLocating}
              title={lang === 'bn' ? 'আমার বর্তমান লাইভ লোকেশন অন করুন' : 'Find My Live GPS Location'}
              className="w-12 h-12 rounded-full bg-white hover:bg-blue-50 text-blue-600 border border-slate-300 shadow-xl flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-75"
            >
              {isLocating ? (
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              ) : (
                <Crosshair
                  className={`w-5 h-5 ${
                    userLocation ? 'text-blue-600 fill-blue-500/20' : 'text-slate-700'
                  }`}
                />
              )}
            </button>
          </div>

          {/* Map Container */}
          <div ref={mapContainerRef} className="w-full h-full flex-1" />
        </div>
      </div>

      {/* Emergency Helpline Modal for Dinajpur Tourists */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-[2200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative space-y-4">
            <button
              type="button"
              onClick={() => setShowEmergencyModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {lang === 'bn' ? 'দিনাজপুর জরুরি হেল্পলাইন' : 'Dinajpur Emergency Helplines'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'bn'
                    ? 'ভ্রমণকালে যেকোনো জরুরি প্রয়োজনে সরাসরি কল করুন'
                    : 'Direct hotlines for travelers in Dinajpur'}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1 text-xs">
              <a
                href="tel:999"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-900">
                    {lang === 'bn' ? 'জাতীয় জরুরি সেবা (পুলিশ, ফায়ার, অ্যাম্বুলেন্স)' : 'National Emergency (Police, Fire, Ambulance)'}
                  </div>
                  <div className="text-slate-500">Hotline 999 (24/7 Free)</div>
                </div>
                <PhoneCall className="w-4 h-4 text-rose-600" />
              </a>

              <a
                href="tel:01320136698"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-900">
                    {lang === 'bn' ? 'দিনাজপুর জেলা পুলিশ কন্ট্রোল রুম' : 'Dinajpur District Police Control'}
                  </div>
                  <div className="text-slate-500">01320-136698 / 0531-64199</div>
                </div>
                <PhoneCall className="w-4 h-4 text-emerald-600" />
              </a>

              <a
                href="tel:01716388909"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-900">
                    {lang === 'bn' ? 'দিনাজপুর মেডিকেল কলেজ হাসপাতাল' : 'Dinajpur Medical College Hospital'}
                  </div>
                  <div className="text-slate-500">দিনাজপুর সদর জরুরি বিভাগ</div>
                </div>
                <PhoneCall className="w-4 h-4 text-emerald-600" />
              </a>

              <a
                href="tel:16122"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-900">
                    {lang === 'bn' ? 'বাংলাদেশ রেলওয়ে হেল্পলাইন' : 'Bangladesh Railway Helpline'}
                  </div>
                  <div className="text-slate-500">ট্রেনের টিকিট ও শিডিউল তথ্য (16122)</div>
                </div>
                <PhoneCall className="w-4 h-4 text-sky-600" />
              </a>
            </div>

            <button
              type="button"
              onClick={() => setShowEmergencyModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {lang === 'bn' ? 'ঠিক আছে' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Coming Soon Banner inside Map Section for Upcoming Spots */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <span>{lang === 'bn' ? 'শীঘ্রই আসছে' : 'Coming Soon'}</span>
              <span>·</span>
              <span>
                {lang === 'bn'
                  ? 'নতুন দর্শনীয় স্থান সংযোজন'
                  : 'New Landmarks Expansion'}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
              {lang === 'bn'
                ? 'বোচাগঞ্জ, খানসামা, চিরিরবন্দর ও ফুলবাড়ী উপজেলার আরও ঐতিহাসিক স্থান ও গ্রামীণ স্পট শীঘ্রই ম্যাপে যুক্ত হচ্ছে!'
                : 'More verified tourist spots across Bochaganj, Khansama, Chirirbandar & Fulbari are coming soon to the map!'}
            </h4>
          </div>
        </div>
        <a
          href="#coming-soon-section"
          className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-colors whitespace-nowrap shrink-0"
        >
          {lang === 'bn' ? 'আসন্ন ফিচার দেখুন ↓' : 'See Upcoming Features ↓'}
        </a>
      </div>
    </section>
  );
};
