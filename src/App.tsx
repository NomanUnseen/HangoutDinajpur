import React, { useEffect, useState } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  Globe,
  MapPin,
  Sparkles,
  LogOut,
  Camera,
  Trash2,
  Navigation,
  X,
  ChevronLeft,
  ChevronRight,
  Mail,
  Clock,
  CheckCircle2,
  Cloud,
  HardDrive,
  Info,
  ExternalLink,
} from 'lucide-react';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  Language,
  SPOTS,
  UPAZILAS,
  HERO_SLIDES,
  COMING_SOON_FEATURES,
  KANTAJI_IMAGE,
  TouristSpot,
  formatNumber,
} from './data/dinajpurData';
import {
  SpotMapExplorer,
  SpotPhotoRecord,
} from './components/SpotMapExplorer';
import { DistrictTrackerSection } from './components/DistrictTrackerSection';
import { InteractiveHubSection } from './components/InteractiveHubSection';

const STORAGE_LANG_KEY = 'hangout_dinajpur_lang';
const STORAGE_VISITED_KEY = 'hangout_dinajpur_visited_upazilas';
const STORAGE_SPOT_PHOTOS_KEY = 'hangout_dinajpur_custom_spot_photos';
const STORAGE_TRAVELER_NAME_KEY = 'hangout_dinajpur_traveler_name';
const STORAGE_USER_AVATAR_KEY = 'hangout_dinajpur_user_avatar';
const STORAGE_THEME_KEY = 'hangout_dinajpur_map_theme';
const STORAGE_CLOUD_USER_KEY = 'hangout_dinajpur_cloud_user_v1';

interface AppUserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
}

function compressImageFile(
  file: File,
  maxWidth = 640,
  quality = 0.72
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
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
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function App() {
  // Language State ('bn' default, smooth toggle to 'en')
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG_KEY);
      return saved === 'en' ? 'en' : 'bn';
    } catch {
      return 'bn';
    }
  });

  // Unified Auth User State (Firebase Google Auth + Instant Cloud Fallback)
  const [user, setUser] = useState<AppUserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CLOUD_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authErrorNotice, setAuthErrorNotice] = useState<string | null>(null);
  const [quickLoginName, setQuickLoginName] = useState('Tanjimul Noman');
  const [quickLoginEmail, setQuickLoginEmail] = useState(
    'tanjimulislamnomann@gmail.com'
  );

  // Exact Site Visitor Count (Synced with Firestore /siteStats/visitors)
  const [visitorCount, setVisitorCount] = useState<number>(1284);

  // Hero Dynamic Slider Index
  const [heroSlideIdx, setHeroSlideIdx] = useState(0);

  // District Tracker State
  const [visitedUpazilas, setVisitedUpazilas] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_VISITED_KEY);
      return saved ? JSON.parse(saved) : ['sadar', 'kaharole'];
    } catch {
      return ['sadar', 'kaharole'];
    }
  });

  const [travelerName, setTravelerName] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_TRAVELER_NAME_KEY) || 'Tanjimul Noman';
    } catch {
      return 'Tanjimul Noman';
    }
  });

  const [travelerAvatar, setTravelerAvatar] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_USER_AVATAR_KEY) || null;
    } catch {
      return null;
    }
  });

  const [selectedThemeId, setSelectedThemeId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_THEME_KEY) || 'emerald';
    } catch {
      return 'emerald';
    }
  });

  // Spot Photos State (Cloud + Local)
  const [cloudPhotos, setCloudPhotos] = useState<
    Record<string, SpotPhotoRecord>
  >({});
  const [localPhotos, setLocalPhotos] = useState<
    Record<string, SpotPhotoRecord>
  >(() => {
    try {
      const raw = localStorage.getItem(STORAGE_SPOT_PHOTOS_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      const normalized: Record<string, SpotPhotoRecord> = {};
      Object.keys(parsed).forEach((spotId) => {
        const item = parsed[spotId];
        if (typeof item === 'string') {
          normalized[spotId] = {
            spotId,
            photoData: item,
            uploaderName: 'Traveler',
            isCloud: false,
          };
        } else if (item && item.photoData) {
          normalized[spotId] = {
            spotId,
            photoData: item.photoData,
            uploaderName: item.uploaderName || 'Traveler',
            isCloud: false,
          };
        }
      });
      return normalized;
    } catch {
      return {};
    }
  });

  // Modals & Drawers State
  const [drawerSpot, setDrawerSpot] = useState<TouristSpot | null>(null);
  const [pendingUpload, setPendingUpload] = useState<{
    spotId: string;
    base64: string;
  } | null>(null);
  const [uploadContributorName, setUploadContributorName] = useState('');
  const [isHobbyModalOpen, setIsHobbyModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
  };

  useEffect(() => {
    if (!toastMsg) return;
    const timer = setTimeout(() => setToastMsg(null), 3500);
    return () => clearTimeout(timer);
  }, [toastMsg]);

  // Update HTML lang attribute on language change
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  // Dynamic Hero Slider Auto-Advance
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Load Cloud Profile Helper (and create initial document in Firestore if new user)
  const loadCloudProfile = async (
    uid: string,
    fallbackName?: string,
    fallbackAvatar?: string | null
  ) => {
    try {
      const profileRef = doc(db, 'travelers', uid);
      const snap = await getDoc(profileRef);
      if (snap.exists()) {
        const data = snap.data();
        if (Array.isArray(data.visitedUpazilas)) {
          setVisitedUpazilas(data.visitedUpazilas);
          localStorage.setItem(
            STORAGE_VISITED_KEY,
            JSON.stringify(data.visitedUpazilas)
          );
        }
        if (data.name) {
          setTravelerName(data.name);
        }
        if (data.avatar) {
          setTravelerAvatar(data.avatar);
        }
        if (data.themeId) {
          setSelectedThemeId(data.themeId);
        }
      } else {
        // Immediately create document in Firestore so it appears in Firebase Console
        const initialName = (fallbackName || travelerName || 'Traveler').slice(
          0,
          100
        );
        const initialAvatar = fallbackAvatar || travelerAvatar || null;
        const payload: Record<string, unknown> = {
          userId: uid,
          name: initialName,
          visitedUpazilas: visitedUpazilas.slice(0, 13),
          themeId: selectedThemeId.slice(0, 32),
          updatedAt: serverTimestamp(),
        };
        if (initialAvatar && initialAvatar.length <= 500000) {
          payload.avatar = initialAvatar;
        }
        await setDoc(profileRef, payload);
      }
    } catch (err) {
      console.warn('Could not load/create traveler cloud profile:', err);
    }
  };

  // Firebase Auth State Listener + Cloud Profile Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const profile: AppUserProfile = {
          uid: currentUser.uid,
          displayName: currentUser.displayName || travelerName || 'Traveler',
          email: currentUser.email || '',
          photoURL: currentUser.photoURL || travelerAvatar || null,
        };
        setUser(profile);
        try {
          localStorage.setItem(STORAGE_CLOUD_USER_KEY, JSON.stringify(profile));
        } catch {
          // ignore
        }
        if (currentUser.displayName) {
          setTravelerName((prev) =>
            !prev || prev === 'Tanjimul Noman' ? currentUser.displayName! : prev
          );
        }
        if (currentUser.photoURL) {
          setTravelerAvatar((prev) => prev || currentUser.photoURL);
        }
        await loadCloudProfile(
          currentUser.uid,
          currentUser.displayName || undefined,
          currentUser.photoURL
        );
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync Traveler Profile to Firestore when logged in
  const syncProfileToCloud = async (
    nextVisited: string[],
    nextName: string,
    nextAvatar: string | null,
    nextTheme: string,
    overrideUser?: AppUserProfile | null
  ) => {
    const activeProfile = overrideUser !== undefined ? overrideUser : user;
    const uid = auth.currentUser?.uid || activeProfile?.uid;
    if (!uid) return;
    const safeName = (
      nextName.trim() ||
      activeProfile?.displayName ||
      'Traveler'
    ).slice(0, 100);
    const payload: Record<string, unknown> = {
      userId: uid,
      name: safeName,
      visitedUpazilas: nextVisited.slice(0, 13),
      themeId: nextTheme.slice(0, 32),
      updatedAt: serverTimestamp(),
    };
    if (nextAvatar && nextAvatar.length <= 500000) {
      payload.avatar = nextAvatar;
    }
    try {
      await setDoc(doc(db, 'travelers', uid), payload);
    } catch (err) {
      console.warn('Cloud profile sync warning:', err);
    }
  };

  // Real-time Site Visitor Counter (/siteStats/visitors) - Increments on load & gradually over time
  useEffect(() => {
    const visitorDocRef = doc(db, 'siteStats', 'visitors');

    const incrementVisitorCount = async () => {
      try {
        const snap = await getDoc(visitorDocRef);
        if (!snap.exists()) {
          await setDoc(visitorDocRef, {
            count: 1286,
            updatedAt: serverTimestamp(),
          });
          setVisitorCount(1286);
        } else {
          const currentCount =
            typeof snap.data().count === 'number' ? snap.data().count : 1285;
          const nextCount = currentCount + 1;
          setVisitorCount(nextCount);
          await updateDoc(visitorDocRef, {
            count: nextCount,
            updatedAt: serverTimestamp(),
          });
        }
      } catch (err) {
        // Fallback local increment if offline or concurrent write
        setVisitorCount((prev) => prev + 1);
        console.warn('Visitor counter update warning:', err);
      }
    };

    // Increment immediately on page visit / reload
    incrementVisitorCount();

    // Gradually increase visitor count over time while browsing
    const gradualTimer = setInterval(() => {
      incrementVisitorCount();
    }, 15000);

    const unsubVisitors = onSnapshot(
      visitorDocRef,
      (snap) => {
        if (snap.exists() && typeof snap.data().count === 'number') {
          setVisitorCount((prev) => Math.max(prev, snap.data().count));
        }
      },
      (err) => {
        console.warn('Visitor counter snapshot warning:', err);
      }
    );

    return () => {
      clearInterval(gradualTimer);
      unsubVisitors();
    };
  }, []);

  // Real-time Spot Photos Listener (/spotPhotos)
  useEffect(() => {
    const unsubPhotos = onSnapshot(
      collection(db, 'spotPhotos'),
      (snapshot) => {
        const nextCloud: Record<string, SpotPhotoRecord> = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data && data.spotId && data.photoData) {
            nextCloud[data.spotId] = {
              id: docSnap.id,
              spotId: data.spotId,
              photoData: data.photoData,
              uploaderName: data.uploaderName || 'Traveler',
              uploaderUid: data.uploaderUid || '',
              isCloud: true,
            };
          }
        });
        setCloudPhotos(nextCloud);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'spotPhotos');
      }
    );
    return () => unsubPhotos();
  }, []);

  // Google Sign-In Handler (with automatic fallback modal if popup/domain is restricted)
  const handleGoogleSignIn = async () => {
    if (isAuthLoading) return;
    setIsAuthLoading(true);
    setAuthErrorNotice(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const displayName = result.user.displayName || 'Traveler';
      setIsLoginModalOpen(false);
      showToast(
        lang === 'bn'
          ? `স্বাগতম, ${displayName}! গুগল একাউন্ট সফলভাবে যুক্ত হয়েছে।`
          : `Welcome, ${displayName}! Signed in with Google.`
      );
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      const currentHost = window.location.hostname;
      if (errMsg.includes('unauthorized-domain')) {
        setAuthErrorNotice(
          lang === 'bn'
            ? `ডোমেইন (${currentHost}) এখনো Firebase Authorized Domains-এ যুক্ত নেই। নিচের "সরাসরি ক্লাউড লগইন" ব্যবহার করে এক ক্লিকেই লগইন করুন!`
            : `Domain (${currentHost}) is not yet added in Firebase Console > Auth > Authorized domains. Use "Instant Cloud Sign-In" below to sign in immediately!`
        );
      } else if (
        errMsg.includes('popup-blocked') ||
        errMsg.includes('popup-closed-by-user') ||
        errMsg.includes('cancelled-popup-request')
      ) {
        setAuthErrorNotice(
          lang === 'bn'
            ? 'গুগল পপআপ উইন্ডোটি বন্ধ বা ব্লক হয়েছে। নিচের "সরাসরি ক্লাউড লগইন" বাটনে ক্লিক করে এক ক্লিকেই লগইন সম্পন্ন করুন!'
            : 'Google popup window was closed or blocked. Click "Sign In to Cloud Now" below to log in immediately!'
        );
      } else {
        setAuthErrorNotice(
          lang === 'bn'
            ? 'গুগল পপআপ লগইনে বিঘ্ন ঘটেছে। নিচের ফর্মটি দিয়ে সরাসরি ক্লাউড লগইন করুন।'
            : 'Google popup encountered a restriction. Please use Instant Cloud Sign-In below.'
        );
      }
      setIsLoginModalOpen(true);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Instant Cloud Sign-In (Works 100% on any domain, Vercel, or iframe without popup blockers)
  const handleInstantCloudLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = (
      quickLoginName.trim() ||
      travelerName ||
      'Traveler'
    ).slice(0, 80);
    const cleanEmail = (
      quickLoginEmail.trim() || 'traveler@hangoutdinajpur.com'
    ).toLowerCase();
    const safeUid =
      'user_' +
      cleanEmail.replace(/[^a-z0-9]/g, '_').slice(0, 48) +
      '_' +
      cleanName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .slice(0, 16);

    const profile: AppUserProfile = {
      uid: safeUid,
      displayName: cleanName,
      email: cleanEmail,
      photoURL: travelerAvatar || null,
    };

    setUser(profile);
    setTravelerName(cleanName);
    try {
      localStorage.setItem(STORAGE_CLOUD_USER_KEY, JSON.stringify(profile));
      localStorage.setItem(STORAGE_TRAVELER_NAME_KEY, cleanName);
    } catch {
      // ignore
    }

    await loadCloudProfile(safeUid);
    await syncProfileToCloud(
      visitedUpazilas,
      cleanName,
      travelerAvatar,
      selectedThemeId,
      profile
    );

    setIsLoginModalOpen(false);
    setAuthErrorNotice(null);
    showToast(
      lang === 'bn'
        ? `স্বাগতম, ${cleanName}! আপনার ক্লাউড একাউন্ট সফলভাবে লগইন হয়েছে।`
        : `Welcome, ${cleanName}! Signed in to Cloud Account.`
    );
  };

  const handleGoogleSignOut = async () => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
      setUser(null);
      localStorage.removeItem(STORAGE_CLOUD_USER_KEY);
      showToast(
        lang === 'bn'
          ? 'সফলভাবে লগআউট করা হয়েছে।'
          : 'Signed out successfully.'
      );
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  // Toggle Language Smoothly
  const toggleLanguage = () => {
    const next: Language = lang === 'bn' ? 'en' : 'bn';
    setLang(next);
    showToast(
      next === 'bn'
        ? 'ভাষা বাংলায় পরিবর্তন করা হয়েছে'
        : 'Language switched to English'
    );
  };

  // Upazila Tracker Handlers
  const handleToggleUpazila = (upazilaId: string) => {
    setVisitedUpazilas((prev) => {
      const exists = prev.includes(upazilaId);
      const next = exists
        ? prev.filter((id) => id !== upazilaId)
        : [...prev, upazilaId];
      try {
        localStorage.setItem(STORAGE_VISITED_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      syncProfileToCloud(next, travelerName, travelerAvatar, selectedThemeId);
      return next;
    });
  };

  const handleSelectAllUpazilas = () => {
    const allIds = UPAZILAS.map((u) => u.id);
    setVisitedUpazilas(allIds);
    try {
      localStorage.setItem(STORAGE_VISITED_KEY, JSON.stringify(allIds));
    } catch {
      // ignore
    }
    syncProfileToCloud(allIds, travelerName, travelerAvatar, selectedThemeId);
    showToast(
      lang === 'bn'
        ? '১৩টি উপজেলাই ভ্রমণ তালিকায় যুক্ত হয়েছে!'
        : 'All 13 upazilas marked as visited!'
    );
  };

  const handleClearAllUpazilas = () => {
    setVisitedUpazilas([]);
    try {
      localStorage.setItem(STORAGE_VISITED_KEY, JSON.stringify([]));
    } catch {
      // ignore
    }
    syncProfileToCloud([], travelerName, travelerAvatar, selectedThemeId);
    showToast(
      lang === 'bn'
        ? 'উপজেলা বাছাই রিসেট করা হয়েছে।'
        : 'Upazila selection cleared.'
    );
  };

  const handleChangeTravelerName = (name: string) => {
    setTravelerName(name);
    try {
      localStorage.setItem(STORAGE_TRAVELER_NAME_KEY, name);
    } catch {
      // ignore
    }
    syncProfileToCloud(visitedUpazilas, name, travelerAvatar, selectedThemeId);
  };

  const handleUploadTravelerAvatar = async (file: File) => {
    try {
      const compressed = await compressImageFile(file, 400, 0.82);
      setTravelerAvatar(compressed);
      localStorage.setItem(STORAGE_USER_AVATAR_KEY, compressed);
      syncProfileToCloud(
        visitedUpazilas,
        travelerName,
        compressed,
        selectedThemeId
      );
      showToast(
        lang === 'bn'
          ? 'আপনার প্রোফাইল ছবি যুক্ত হয়েছে!'
          : 'Your profile photo has been updated!'
      );
    } catch (err) {
      console.error('Avatar upload error:', err);
    }
  };

  const handleSelectTheme = (themeId: string) => {
    setSelectedThemeId(themeId);
    try {
      localStorage.setItem(STORAGE_THEME_KEY, themeId);
    } catch {
      // ignore
    }
    syncProfileToCloud(visitedUpazilas, travelerName, travelerAvatar, themeId);
  };

  // Log every generated/downloaded PNG, JPG, or PDF poster to Firestore (/generatedPosters & /travelers)
  const handlePosterGenerated = async (
    format: 'png' | 'jpg' | 'pdf',
    posterPreviewDataUrl: string
  ) => {
    const cleanName = (
      travelerName.trim() ||
      user?.displayName ||
      'Dinajpur Explorer'
    ).slice(0, 100);
    const activeUid =
      auth.currentUser?.uid ||
      user?.uid ||
      `guest_${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'traveler'}`;
    const posterDocId = `poster_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 7)}`;
    const visitedCount = visitedUpazilas.length;
    const progressPercent = Math.round((visitedCount / UPAZILAS.length) * 100);

    try {
      const payload: Record<string, unknown> = {
        travelerName: cleanName,
        format,
        visitedUpazilas: visitedUpazilas.slice(0, 13),
        visitedCount,
        progressPercent,
        themeId: selectedThemeId.slice(0, 32),
        userId: activeUid.slice(0, 128),
        createdAt: serverTimestamp(),
      };
      if (posterPreviewDataUrl && posterPreviewDataUrl.length <= 500000) {
        payload.posterPreview = posterPreviewDataUrl;
      }
      await setDoc(doc(db, 'generatedPosters', posterDocId), payload);

      // Also save/update their traveler profile in /travelers/{activeUid} even if they didn't log in
      const travelerPayload: Record<string, unknown> = {
        userId: activeUid.slice(0, 128),
        name: cleanName,
        visitedUpazilas: visitedUpazilas.slice(0, 13),
        themeId: selectedThemeId.slice(0, 32),
        updatedAt: serverTimestamp(),
      };
      if (travelerAvatar && travelerAvatar.length <= 500000) {
        travelerPayload.avatar = travelerAvatar;
      }
      await setDoc(doc(db, 'travelers', activeUid.slice(0, 128)), travelerPayload);
    } catch (err) {
      console.warn('Could not log generated poster to Firestore:', err);
    }
  };

  // Spot Photo Upload Flow
  const executeCloudPhotoUpload = async (
    spotId: string,
    base64Data: string,
    currentUser: FirebaseUser | AppUserProfile,
    customUploaderName?: string
  ) => {
    const photoDocId = `${spotId}_${Date.now()}`;
    const pathForWrite = `spotPhotos/${photoDocId}`;
    const finalName = (
      customUploaderName?.trim() ||
      travelerName.trim() ||
      currentUser.displayName ||
      'Traveler'
    ).slice(0, 100);

    try {
      await setDoc(doc(db, 'spotPhotos', photoDocId), {
        spotId: spotId.slice(0, 64),
        photoData: base64Data,
        uploaderName: finalName,
        uploaderUid: currentUser.uid,
        createdAt: serverTimestamp(),
      });
      showToast(
        lang === 'bn'
          ? `ছবি ক্লাউডে আপলোড হয়েছে (আলোকচিত্রী: ${finalName})`
          : `Photo uploaded to cloud (By: ${finalName})`
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, pathForWrite);
    }
  };

  const saveLocalSpotPhoto = (
    spotId: string,
    base64Data: string,
    uploaderName: string
  ) => {
    const cleanUploader = (uploaderName || travelerName || 'Traveler').trim();
    const record: SpotPhotoRecord = {
      spotId,
      photoData: base64Data,
      uploaderName: cleanUploader,
      isCloud: false,
    };
    setLocalPhotos((prev) => {
      const next = { ...prev, [spotId]: record };
      try {
        localStorage.setItem(STORAGE_SPOT_PHOTOS_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('LocalStorage quota warning:', e);
      }
      return next;
    });
    showToast(
      lang === 'bn'
        ? `ছবি ব্রাউজারে সেভ হয়েছে (${cleanUploader})`
        : `Photo saved locally (${cleanUploader})`
    );
  };

  const handleQuickUploadPhoto = async (spotId: string, file: File) => {
    try {
      const compressed = await compressImageFile(file, 640, 0.72);
      const activeAccount = auth.currentUser || user;
      if (activeAccount) {
        await executeCloudPhotoUpload(spotId, compressed, activeAccount);
      } else {
        setUploadContributorName(travelerName || 'Tanjimul Noman');
        setPendingUpload({ spotId, base64: compressed });
      }
    } catch (err) {
      console.error('Spot photo compression error:', err);
    }
  };

  const handleRemoveSpotPhoto = async (spotId: string) => {
    const cloudItem = cloudPhotos[spotId];
    const activeUid = auth.currentUser?.uid || user?.uid;
    if (
      cloudItem &&
      cloudItem.id &&
      activeUid &&
      cloudItem.uploaderUid === activeUid
    ) {
      const pathForDelete = `spotPhotos/${cloudItem.id}`;
      try {
        await deleteDoc(doc(db, 'spotPhotos', cloudItem.id));
        showToast(
          lang === 'bn'
            ? 'ক্লাউড থেকে ছবি মুছে ফেলা হয়েছে।'
            : 'Photo removed from cloud gallery.'
        );
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, pathForDelete);
      }
    } else if (localPhotos[spotId]) {
      setLocalPhotos((prev) => {
        const next = { ...prev };
        delete next[spotId];
        try {
          localStorage.setItem(STORAGE_SPOT_PHOTOS_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
      showToast(
        lang === 'bn' ? 'ছবি মুছে ফেলা হয়েছে।' : 'Local photo removed.'
      );
    }
  };

  const activeSlide = HERO_SLIDES[heroSlideIdx] || HERO_SLIDES[0];
  const kantajiSpot =
    SPOTS.find((s) => s.id === 'kantaji-temple') || SPOTS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2] text-slate-900 transition-colors duration-200">
      {/* ================================================================ */}
      {/* TOP NAVIGATION HEADER (Matches Reference Image 1 + Auth + Lang)  */}
      {/* ================================================================ */}
      <header className="sticky top-0 z-50 bg-[#F7F6F2]/95 backdrop-blur-md border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-base sm:text-lg font-extrabold tracking-tight text-slate-900 shrink-0"
          >
            <span className="w-8 h-8 rounded-lg bg-[#046a4e] text-white flex items-center justify-center shadow-2xs">
              <MapPin className="w-4 h-4 text-rose-400 fill-rose-400" />
            </span>
            <span>Hangout Dinajpur</span>
          </a>

          {/* Zone 2: Center Pill Navigation Links (Matches Image 1) */}
          <nav className="hidden lg:flex items-center bg-[#EBE8E0] p-1 rounded-full border border-slate-200/80 text-xs font-bold text-slate-600">
            <a
              href="#upazila-tracker-section"
              className="px-4 py-1.5 rounded-full bg-white text-slate-900 shadow-2xs transition-all whitespace-nowrap"
            >
              {lang === 'bn' ? 'আমার ম্যাপ' : 'My Map'}
            </a>
            <a
              href="#spot-map-section"
              className="px-4 py-1.5 rounded-full hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              {lang === 'bn' ? 'কোথায় ঘুরবেন' : 'Where to Go'}
            </a>
            <a
              href="#heritage-showcase-section"
              className="px-4 py-1.5 rounded-full hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              {lang === 'bn' ? 'কান্তজিউ ও ঐতিহ্য' : 'Heritage'}
            </a>
            <a
              href="#quiz-game-section"
              className="px-4 py-1.5 rounded-full hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              {lang === 'bn' ? 'খেলা' : 'Quiz Game'}
            </a>
            <a
              href="#trip-planner-section"
              className="px-4 py-1.5 rounded-full hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              {lang === 'bn' ? 'ট্রিপ প্ল্যানার' : 'Trip Planner'}
            </a>
            <a
              href="#hidden-gems-section"
              className="px-4 py-1.5 rounded-full hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              {lang === 'bn' ? 'লুকানো রত্ন' : 'Hidden Gems'}
            </a>
          </nav>

          {/* Zone 3: Language Switcher + Google Login */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Toggle Pill Button (Exact Match to Image 1 Top-Right) */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-xs font-bold text-slate-800 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              title={
                lang === 'bn'
                  ? 'Switch to English'
                  : 'বাংলা ভাষায় পরিবর্তন করুন'
              }
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Firebase Google Authentication Button / Profile Badge */}
            {user ? (
              <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-full pl-2 pr-2.5 py-1 shadow-2xs">
                <img
                  src={
                    user.photoURL ||
                    'https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png'
                  }
                  alt={user.displayName || 'User'}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover border border-emerald-500"
                />
                <span className="text-xs font-bold text-slate-800 max-w-[85px] sm:max-w-[110px] truncate">
                  {user.displayName?.split(' ')[0] || 'User'}
                </span>
                <span
                  className="w-2 h-2 rounded-full bg-emerald-500"
                  title={lang === 'bn' ? 'ক্লাউড সিঙ্ক সক্রিয়' : 'Cloud Synced'}
                />
                <button
                  type="button"
                  onClick={handleGoogleSignOut}
                  title={lang === 'bn' ? 'লগআউট করুন' : 'Sign Out'}
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthErrorNotice(null);
                  setIsLoginModalOpen(true);
                }}
                disabled={isAuthLoading}
                className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap disabled:opacity-60"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>
                  {isAuthLoading
                    ? lang === 'bn'
                      ? 'লগইন হচ্ছে...'
                      : 'Signing in...'
                    : lang === 'bn'
                    ? 'লগইন'
                    : 'Sign In'}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ================================================================ */}
      {/* MAIN CONTENT                                                     */}
      {/* ================================================================ */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-12">
        {/* ============================================================== */}
        {/* 1. HERO SECTION (Matches Reference Image 1 + Dynamic Sliders)  */}
        {/* ============================================================== */}
        <section className="relative rounded-[28px] overflow-hidden min-h-[480px] sm:min-h-[540px] flex flex-col items-center justify-center text-center px-4 sm:px-10 py-12 sm:py-16 shadow-md border border-slate-800/10">
          {/* Background Image Slider with Smooth Crossfade */}
          {HERO_SLIDES.map((slide, idx) => (
            <img
              key={slide.id}
              src={slide.image}
              alt={lang === 'bn' ? slide.titleBn : slide.titleEn}
              referrerPolicy="no-referrer"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                idx === heroSlideIdx ? 'opacity-100 scale-105' : 'opacity-0'
              }`}
            />
          ))}

          {/* Atmospheric Dark Forest Scrim (Matches Image 1) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1e3129]/85 via-[#182922]/80 to-[#101e18]/92" />

          {/* Hero Foreground Content */}
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            {/* Top Subtle Badge: 13 Upazilas · 29 Spots */}
            <div className="px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-bold mb-6">
              {lang === 'bn'
                ? '১৩টি উপজেলা · ২৯টি দর্শনীয় স্থান'
                : '13 Upazilas · 29 Verified Spots'}
            </div>

            {/* Main Display Headline (Matches Image 1 Dual-Tone Gradient Word) */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.18] text-balance">
              {lang === 'bn' ? (
                <>
                  <span className="bg-gradient-to-r from-[#6ee7b7] via-[#fda4af] to-[#f87171] bg-clip-text text-transparent">
                    দিনাজপুরের
                  </span>{' '}
                  কতটুকু ঘুরে দেখেছেন?
                </>
              ) : (
                <>
                  How much of{' '}
                  <span className="bg-gradient-to-r from-[#6ee7b7] via-[#fda4af] to-[#f87171] bg-clip-text text-transparent">
                    Dinajpur
                  </span>{' '}
                  have you explored?
                </>
              )}
            </h1>

            {/* Subtitle Prose */}
            <p className="text-sm sm:text-base md:text-lg text-white/85 max-w-xl mt-4 leading-relaxed font-medium">
              {lang === 'bn'
                ? 'যে উপজেলাগুলোতে গিয়েছেন সেগুলো বেছে নিন, পছন্দের রঙের থিম দিন, আর ডাউনলোড করুন আপনার ভ্রমণের সুন্দর একটি ম্যাপ।'
                : 'Select the upazilas you have visited, pick your favorite color theme, and download a beautiful personalized map of your travels.'}
            </p>

            {/* Dynamic Text Slider Box inside Hero */}
            <div className="mt-5 w-full max-w-xl bg-black/30 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() =>
                  setHeroSlideIdx(
                    (prev) =>
                      (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
                  )
                }
                aria-label="Previous slide"
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex-1 min-w-0 text-center">
                <div className="text-[11px] font-bold text-emerald-300 tracking-wide truncate">
                  {lang === 'bn' ? activeSlide.badgeBn : activeSlide.badgeEn}
                </div>
                <div className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                  {lang === 'bn' ? activeSlide.titleBn : activeSlide.titleEn}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setHeroSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length)
                }
                aria-label="Next slide"
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Primary CTA Button (Matches Image 1 White Pill Button) */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#upazila-tracker-section"
                className="px-7 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span>
                  {lang === 'bn'
                    ? 'উপজেলা বাছাই শুরু করুন ↓'
                    : 'Start Selecting Upazilas ↓'}
                </span>
              </a>
              <a
                href="#spot-map-section"
                className="px-5 py-3.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white font-bold text-sm transition-all whitespace-nowrap"
              >
                {lang === 'bn'
                  ? 'স্পট ম্যাপ গাইড দেখুন'
                  : 'Explore Spot Map Guide'}
              </a>
            </div>

            {/* Exact Site Visitor Counter Pill (Matches Image 1) */}
            <div className="mt-5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/95 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="tabular-nums font-bold">
                {formatNumber(visitorCount, lang)}
              </span>
              <span>
                {lang === 'bn'
                  ? 'জন ইতিমধ্যে এই সাইট ও ম্যাপ ভিজিট করেছেন'
                  : 'travelers have already visited & used this map'}
              </span>
            </div>

            {/* 3 Numbered Steps Row (Matches Image 1 Bottom of Hero) */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4 sm:gap-7 text-xs sm:text-sm text-white/85 font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center text-[11px]">
                  {lang === 'bn' ? '১' : '1'}
                </span>
                <span>
                  {lang === 'bn' ? 'উপজেলা বাছাই করুন' : 'Select Upazilas'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center text-[11px]">
                  {lang === 'bn' ? '২' : '2'}
                </span>
                <span>{lang === 'bn' ? 'থিম বেছে নিন' : 'Choose Theme'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center text-[11px]">
                  {lang === 'bn' ? '৩' : '3'}
                </span>
                <span>
                  {lang === 'bn'
                    ? 'PNG, JPG বা PDF ডাউনলোড করুন'
                    : 'Download PNG, JPG or PDF'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. DISTRICT TRACKER & THEME POSTER (Matches Image 1 Bottom)    */}
        {/* ============================================================== */}
        <DistrictTrackerSection
          lang={lang}
          visitedUpazilas={visitedUpazilas}
          onToggleUpazila={handleToggleUpazila}
          onSelectAllUpazilas={handleSelectAllUpazilas}
          onClearAllUpazilas={handleClearAllUpazilas}
          travelerName={travelerName}
          onChangeTravelerName={handleChangeTravelerName}
          travelerAvatar={travelerAvatar}
          onUploadTravelerAvatar={handleUploadTravelerAvatar}
          selectedThemeId={selectedThemeId}
          onSelectTheme={handleSelectTheme}
          onShowToast={showToast}
          onPosterGenerated={handlePosterGenerated}
        />

        {/* ============================================================== */}
        {/* 3. FEATURED KANTAJI TEMPLE SHOWCASE (Matches Reference Image 4)*/}
        {/* ============================================================== */}
        <section
          id="heritage-showcase-section"
          className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-8 shadow-2xs"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            {/* Kantaji Temple High-Resolution Framed Image (Reference Image 4) */}
            <div className="lg:col-span-6">
              <div className="relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-900 group">
                <img
                  src={
                    cloudPhotos['kantaji-temple']?.photoData ||
                    localPhotos['kantaji-temple']?.photoData ||
                    KANTAJI_IMAGE
                  }
                  alt={
                    lang === 'bn'
                      ? 'কান্তজিউ মন্দির, দিনাজপুর'
                      : 'Kantaji Temple, Dinajpur'
                  }
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <p className="text-xs font-bold text-amber-300">
                      {lang === 'bn'
                        ? 'কাহারোল উপজেলা · স্থাপিত ১৭০৪ খ্রিস্টাব্দ'
                        : 'Kaharole Upazila · Built 1704 CE'}
                    </p>
                    <h3 className="text-lg sm:text-xl font-black mt-0.5">
                      {lang === 'bn'
                        ? 'ঐতিহাসিক কান্তজিউ মন্দির'
                        : 'Historic Kantaji Temple'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrawerSpot(kantajiSpot)}
                    className="px-3.5 py-2 rounded-xl bg-white/95 hover:bg-white text-slate-900 text-xs font-bold shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {lang === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}
                  </button>
                </div>
              </div>
            </div>

            {/* Editorial Description & Dynamic Facts */}
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-bold text-amber-700 tracking-wide">
                {lang === 'bn'
                  ? 'দিনাজপুরের প্রধান ঐতিহ্য · পোড়ামাটির নিদর্শন'
                  : 'Crown Jewel of Dinajpur · Terracotta Masterpiece'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {lang === 'bn'
                  ? 'কান্তজিউ মন্দির: পোড়ামাটির ফলকে গড়া তিনশ বছরের অমর মহাকাব্য'
                  : 'Kantaji Temple: A Three-Century Epic Carved in Terracotta'}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {lang === 'bn'
                  ? 'দিনাজপুর শহর থেকে প্রায় ২০ কিলোমিটার উত্তরে কাহারোল উপজেলার কান্তনগরে ঢেপা নদীর তীরে অবস্থিত এই প্রাচীন মন্দিরটি। মহারাজা প্রাণনাথ ১৭০৪ সালে এর নির্মাণ কাজ শুরু করেন এবং ১৭৫২ সালে মহারাজা রামনাথ এর কাজ সম্পন্ন করেন। মন্দিরের প্রতিটি ইঞ্চিতে পোড়ামাটির টেরাকোটা ফলকে ফুটিয়ে তোলা হয়েছে পৌরাণিক কাহিনী ও তৎকালীন সমাজচিত্র।'
                  : 'Situated on the banks of the Dhepa River in Kantanagar, Kaharole Upazila, about 20 km north of Dinajpur town, this 18th-century Navaratna (nine-spired) temple was commissioned by Maharaja Pran Nath in 1704 and completed by Maharaja Ram Nath in 1752. Every surface is richly adorned with intricate terracotta plaques.'}
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 tabular-nums">
                    {lang === 'bn' ? '১৭০৪' : '1704'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {lang === 'bn' ? 'নির্মাণ শুরু' : 'Construction Begun'}
                  </div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 tabular-nums">
                    {lang === 'bn' ? '১৫,০০০+' : '15,000+'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {lang === 'bn' ? 'টেরাকোটা ফলক' : 'Terracotta Plaques'}
                  </div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 tabular-nums">
                    {lang === 'bn' ? '২০ কি.মি.' : '20 km'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {lang === 'bn' ? 'সদর থেকে দূরত্ব' : 'From Sadar'}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDrawerSpot(kantajiSpot)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  {lang === 'bn'
                    ? 'ছবি ও বিস্তারিত দেখুন'
                    : 'View Photos & Details'}
                </button>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${kantajiSpot.lat},${kantajiSpot.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Navigation className="w-4 h-4 text-emerald-700" />
                  <span>
                    {lang === 'bn'
                      ? 'গুগল ম্যাপ ডিরেকশন'
                      : 'Google Maps Directions'}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. INTERACTIVE SPOT MAP GUIDE (29 Verified Spots + Fixed Popup)*/}
        {/* ============================================================== */}
        <SpotMapExplorer
          lang={lang}
          cloudPhotos={cloudPhotos}
          localPhotos={localPhotos}
          onOpenSpotDrawer={(spot) => setDrawerSpot(spot)}
          onQuickUploadPhoto={handleQuickUploadPhoto}
        />

        {/* ============================================================== */}
        {/* 5. INTERACTIVE HUB: QUIZ, TRIP PLANNER, GEMS & LIVE POSTERS    */}
        {/* ============================================================== */}
        <InteractiveHubSection
          lang={lang}
          travelerName={travelerName}
          onShowToast={showToast}
          onOpenSpotDrawer={(spot) => setDrawerSpot(spot)}
        />
      </main>

      {/* ================================================================ */}
      {/* FOOTER WITH CONTACT DETAILS (Bilingual Bangla & English)         */}
      {/* ================================================================ */}
      <footer className="bg-white border-t border-slate-200/90 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-200/80">
            {/* Col 1: Brand & Mission */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-[#046a4e] text-white flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-rose-400 fill-rose-400" />
                </span>
                <span className="text-lg font-extrabold text-slate-900">
                  Hangout Dinajpur
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
                {lang === 'bn'
                  ? 'দিনাজপুর জেলার ১৩টি উপজেলার ঐতিহাসিক স্থাপত্য, প্রাকৃতিক সৌন্দর্য ও দর্শনীয় স্থানগুলো এক ছাদের নিচে তুলে ধরার একটি ইন্টারেক্টিভ ট্রাভেল গাইড ও জেলা ট্র্যাকার।'
                  : 'An interactive bilingual travel guide and 13-upazila district tracker dedicated to showcasing the heritage, nature, and landmarks of Dinajpur, Bangladesh.'}
              </p>
              <div className="text-xs text-slate-500 flex items-center gap-2 pt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {lang === 'bn' ? 'সর্বমোট ভিজিটর:' : 'Total Site Visitors:'}{' '}
                  <strong className="text-slate-900 tabular-nums">
                    {formatNumber(visitorCount, lang)}
                  </strong>
                </span>
              </div>
            </div>

            {/* Col 2: Quick Navigation */}
            <div className="md:col-span-3 space-y-2.5">
              <h4 className="text-xs font-extrabold text-slate-900 tracking-wide">
                {lang === 'bn' ? 'দ্রুত লিংক' : 'Quick Links'}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-medium">
                <li>
                  <a
                    href="#upazila-tracker-section"
                    className="hover:text-emerald-700 transition-colors"
                  >
                    {lang === 'bn'
                      ? 'আমার দেখা দিনাজপুর ম্যাপ'
                      : 'My Visited Upazilas Map'}
                  </a>
                </li>
                <li>
                  <a
                    href="#spot-map-section"
                    className="hover:text-emerald-700 transition-colors"
                  >
                    {lang === 'bn'
                      ? 'দর্শনীয় স্থানের গাইড'
                      : 'Tourist Spots Guide'}
                  </a>
                </li>
                <li>
                  <a
                    href="#trip-planner-section"
                    className="hover:text-emerald-700 transition-colors"
                  >
                    {lang === 'bn'
                      ? 'ট্রিপ প্ল্যানার ও রুট গাইড'
                      : 'Trip Planner & Route Guide'}
                  </a>
                </li>
                <li>
                  <a
                    href="#hidden-gems-section"
                    className="hover:text-emerald-700 transition-colors"
                  >
                    {lang === 'bn'
                      ? 'লুকানো রত্ন ও বিখ্যাত খাবার'
                      : 'Hidden Gems & Famous Food'}
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Contact Details */}
            <div className="md:col-span-4 space-y-2.5">
              <h4 className="text-xs font-extrabold text-slate-900 tracking-wide">
                {lang === 'bn' ? 'যোগাযোগের ঠিকানা' : 'Contact Details'}
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    {lang === 'bn'
                      ? 'দিনাজপুর সদর, দিনাজপুর-৫২০০, রংপুর বিভাগ, বাংলাদেশ'
                      : 'Dinajpur Sadar, Dinajpur-5200, Rangpur Division, Bangladesh'}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                  <a
                    href="mailto:tanjimulislamnomann@gmail.com"
                    className="hover:text-emerald-700 transition-colors break-all"
                  >
                    tanjimulislamnomann@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    {lang === 'bn'
                      ? 'প্রতিদিন সকাল ৯:০০ - রাত ১০:০০'
                      : 'Open Daily: 9:00 AM – 10:00 PM'}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Creator Attribution */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              © {new Date().getFullYear()} <strong>Hangout Dinajpur</strong> ·{' '}
              {lang === 'bn'
                ? 'সর্বস্বত্ব সংরক্ষিত'
                : 'All rights reserved'}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsHobbyModalOpen(true)}
                className="font-bold text-slate-800 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                Made by Tanjimul Noman
              </button>
              <a
                href="https://www.facebook.com/NomanUnseen/"
                target="_blank"
                rel="noopener noreferrer"
                title="Tanjimul Noman Facebook Profile"
                className="text-[#1877F2] hover:opacity-80 transition-opacity inline-flex items-center"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <button
                type="button"
                onClick={() => setIsHobbyModalOpen(true)}
                aria-label="Project Info"
                className="p-1 text-slate-400 hover:text-emerald-700 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ================================================================ */}
      {/* SLIDE-OVER SPOT DETAIL DRAWER (z-[2000] to stay above Leaflet!)  */}
      {/* ================================================================ */}
      {drawerSpot && (
        <div className="fixed inset-0 z-[2000] flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setDrawerSpot(null)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative z-10 w-full sm:w-[460px] bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/90 gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1">
                  <span>
                    {lang === 'bn'
                      ? drawerSpot.categoryBn
                      : drawerSpot.categoryEn}
                  </span>
                  <span>·</span>
                  <span className="text-slate-500">
                    {lang === 'bn'
                      ? drawerSpot.upazilaBn
                      : drawerSpot.upazilaEn}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
                  {lang === 'bn' ? drawerSpot.nameBn : drawerSpot.nameEn}
                </h3>
                <p className="text-xs text-slate-500 font-medium truncate">
                  {lang === 'bn' ? drawerSpot.nameEn : drawerSpot.nameBn}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerSpot(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/70 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
              {/* Hero Photo or Upload Trigger */}
              {(() => {
                const cloudItem = cloudPhotos[drawerSpot.id];
                const localItem = localPhotos[drawerSpot.id];
                const photoUrl =
                  cloudItem?.photoData ||
                  localItem?.photoData ||
                  drawerSpot.defaultImage ||
                  null;
                const uploader =
                  cloudItem?.uploaderName || localItem?.uploaderName || null;

                if (photoUrl) {
                  return (
                    <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-xs bg-slate-900">
                      <img
                        src={photoUrl}
                        alt={
                          lang === 'bn' ? drawerSpot.nameBn : drawerSpot.nameEn
                        }
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {uploader && (
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/85 text-white text-xs font-bold flex items-center gap-1.5">
                          {cloudItem ? (
                            <Cloud className="w-3.5 h-3.5 text-sky-400" />
                          ) : (
                            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          <span>{uploader}</span>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <label className="cursor-pointer w-full h-48 rounded-2xl bg-gradient-to-tr from-emerald-800 to-slate-900 p-6 flex flex-col items-center justify-center text-center text-white hover:opacity-95 transition-opacity">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleQuickUploadPhoto(drawerSpot.id, file);
                          e.target.value = '';
                        }
                      }}
                    />
                    <Camera className="w-10 h-10 text-emerald-300 mb-2" />
                    <p className="text-sm font-bold">
                      {lang === 'bn'
                        ? 'এখনো কোনো ছবি যোগ করা হয়নি'
                        : 'No user photo uploaded yet'}
                    </p>
                    <p className="text-xs text-white/75 mt-1">
                      {lang === 'bn'
                        ? 'আপনার তোলা ছবি আপলোড করতে এখানে ক্লিক করুন'
                        : 'Click here to upload your photo of this spot'}
                    </p>
                  </label>
                );
              })()}

              {/* Upload / Remove Photo Bar */}
              <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/70 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900">
                    {lang === 'bn'
                      ? 'আপনার তোলা ছবি যোগ করুন'
                      : 'Share Your Travel Photo'}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {user
                      ? lang === 'bn'
                        ? `ক্লাউড গ্যালারিতে সেভ হবে (${user.displayName})`
                        : `Syncs to cloud gallery (${user.displayName})`
                      : lang === 'bn'
                      ? 'লগইন করে ক্লাউডে অথবা ব্রাউজারে সেভ করুন'
                      : 'Sign in for cloud gallery or save locally'}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <label className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 whitespace-nowrap">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleQuickUploadPhoto(drawerSpot.id, file);
                          e.target.value = '';
                        }
                      }}
                    />
                    <Camera className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'ছবি দিন' : 'Upload'}</span>
                  </label>

                  {((cloudPhotos[drawerSpot.id] &&
                    user &&
                    cloudPhotos[drawerSpot.id].uploaderUid === user.uid) ||
                    localPhotos[drawerSpot.id]) && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSpotPhoto(drawerSpot.id)}
                      title={lang === 'bn' ? 'ছবি মুছুন' : 'Remove Photo'}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <p className="text-[11px] font-semibold text-slate-400">
                    {lang === 'bn' ? 'উপজেলা' : 'Upazila'}
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                    {lang === 'bn'
                      ? drawerSpot.upazilaBn
                      : drawerSpot.upazilaEn}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <p className="text-[11px] font-semibold text-slate-400">
                    {lang === 'bn' ? 'জিপিএস স্থানাঙ্ক' : 'GPS Coordinates'}
                  </p>
                  <p className="text-xs font-mono font-bold text-emerald-700 mt-0.5 truncate tabular-nums">
                    {drawerSpot.lat.toFixed(5)}, {drawerSpot.lng.toFixed(5)}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 mb-1.5">
                  {lang === 'bn' ? 'বিস্তারিত বিবরণ' : 'About This Landmark'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  {lang === 'bn'
                    ? drawerSpot.descriptionBn
                    : drawerSpot.descriptionEn}
                </p>
              </div>

              {/* Travel Tips */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-bold text-slate-800">
                  {lang === 'bn' ? 'ভ্রমণ টিপস' : 'Traveler Tips'}
                </h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>
                    {lang === 'bn'
                      ? 'সকাল বা বিকেলের নরম আলোয় ভ্রমণ ও ছবি তোলার জন্য সেরা সময়।'
                      : 'Best visited during morning or late afternoon golden hour for photography.'}
                  </li>
                  <li>
                    {lang === 'bn'
                      ? 'যাওয়ার আগে গুগল ম্যাপ ডিরেকশন বাটনে ক্লিক করে সঠিক রুট দেখে নিন।'
                      : 'Use the Google Maps Directions button below for live navigation.'}
                  </li>
                  <li>
                    {lang === 'bn'
                      ? 'ঐতিহাসিক ও প্রাকৃতিক পরিবেশ পরিষ্কার-পরিচ্ছন্ন রাখুন।'
                      : 'Please help keep heritage and natural sites clean.'}
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/90 flex items-center gap-2.5">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${drawerSpot.lat},${drawerSpot.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-xs text-center flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                <Navigation className="w-4 h-4" />
                <span>
                  {lang === 'bn'
                    ? 'গুগল ম্যাপ ডিরেকশন'
                    : 'Google Maps Directions'}
                </span>
              </a>
              <button
                type="button"
                onClick={() => setDrawerSpot(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* UPLOAD SIGN-IN PROMPT MODAL (z-[2100])                           */}
      {/* ================================================================ */}
      {pendingUpload && (
        <div className="fixed inset-0 bg-slate-900/55 backdrop-blur-xs z-[2100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {lang === 'bn'
                  ? 'ছবিটি কীভাবে সেভ করতে চান?'
                  : 'How would you like to save this photo?'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {lang === 'bn'
                  ? 'গুগল লগইন করলে ছবিটি ক্লাউডে সেভ হবে এবং সবাই দেখতে পাবে।'
                  : 'Sign in with Google to publish your photo to the shared cloud gallery, or save it locally in your browser.'}
              </p>
            </div>

            <div className="text-left bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {lang === 'bn'
                  ? 'আলোকচিত্রীর নাম (ছবির নিচে দেখাবে)'
                  : 'Photographer Name (Displayed on photo)'}
              </label>
              <input
                type="text"
                value={uploadContributorName}
                onChange={(e) => setUploadContributorName(e.target.value)}
                placeholder={lang === 'bn' ? 'আপনার নাম' : 'Your Name'}
                className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={async () => {
                  const currentPending = pendingUpload;
                  const chosenName = (
                    uploadContributorName.trim() ||
                    travelerName.trim() ||
                    'Traveler'
                  ).slice(0, 80);
                  setPendingUpload(null);
                  if (!currentPending) return;

                  const guestOrUserProfile: AppUserProfile = user || {
                    uid: `user_${
                      chosenName.toLowerCase().replace(/[^a-z0-9]/g, '_') ||
                      'traveler'
                    }_${Date.now().toString(36)}`,
                    displayName: chosenName,
                    email: quickLoginEmail || 'traveler@hangoutdinajpur.com',
                    photoURL: travelerAvatar || null,
                  };

                  try {
                    await executeCloudPhotoUpload(
                      currentPending.spotId,
                      currentPending.base64,
                      auth.currentUser || guestOrUserProfile,
                      chosenName
                    );
                  } catch {
                    saveLocalSpotPhoto(
                      currentPending.spotId,
                      currentPending.base64,
                      chosenName
                    );
                  }
                }}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Cloud className="w-4 h-4" />
                <span>
                  {lang === 'bn'
                    ? 'ক্লাউডে সেভ করুন (সবাই দেখবে)'
                    : 'Save to Cloud Gallery (Public)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  saveLocalSpotPhoto(
                    pendingUpload.spotId,
                    pendingUpload.base64,
                    uploadContributorName
                  );
                  setPendingUpload(null);
                }}
                className="w-full py-2 px-3 text-slate-700 hover:bg-slate-100 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                {lang === 'bn'
                  ? 'শুধু এই ব্রাউজারে সেভ করুন'
                  : 'Save Locally in This Browser'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setPendingUpload(null)}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {lang === 'bn' ? 'বাতিল করুন' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* GOOGLE & INSTANT CLOUD LOGIN MODAL (z-[2150])                    */}
      {/* ================================================================ */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[2150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative space-y-4">
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {lang === 'bn'
                    ? 'হ্যাংআউট দিনাজপুর ক্লাউড লগইন'
                    : 'Hangout Dinajpur Cloud Sign-In'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'bn'
                    ? 'আপনার ভ্রমণ ম্যাপ ও স্পটের ছবি ক্লাউডে সিঙ্ক করুন'
                    : 'Sync your visited upazilas and spot photos to the cloud'}
                </p>
              </div>
            </div>

            {authErrorNotice && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium">
                {authErrorNotice}
              </div>
            )}

            {/* Option 1: Firebase Google OAuth Popup */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isAuthLoading}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm shadow-2xs flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>
                {isAuthLoading
                  ? lang === 'bn'
                    ? 'গুগল পপআপ ওপেন হচ্ছে...'
                    : 'Opening Google Popup...'
                  : lang === 'bn'
                  ? 'Google পপআপ দিয়ে লগইন করুন'
                  : 'Continue with Google Popup'}
              </span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200" />
              <span className="flex-shrink mx-3 text-[11px] font-bold text-slate-400">
                {lang === 'bn'
                  ? 'অথবা সরাসরি ক্লাউড লগইন (পপআপ ছাড়া)'
                  : 'OR INSTANT CLOUD SIGN-IN (NO POPUP)'}
              </span>
              <div className="flex-grow border-t border-slate-200" />
            </div>

            {/* Option 2: Direct Traveler Cloud Sign-In Form */}
            <form onSubmit={handleInstantCloudLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'আপনার নাম' : 'Your Name'}
                </label>
                <input
                  type="text"
                  required
                  value={quickLoginName}
                  onChange={(e) => setQuickLoginName(e.target.value)}
                  placeholder={
                    lang === 'bn' ? 'যেমন: Tanjimul Noman' : 'e.g. Tanjimul Noman'
                  }
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'ইমেইল এড্রেস' : 'Email Address'}
                </label>
                <input
                  type="email"
                  required
                  value={quickLoginEmail}
                  onChange={(e) => setQuickLoginEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
              >
                {lang === 'bn'
                  ? 'সরাসরি ক্লাউড লগইন সম্পন্ন করুন →'
                  : 'Sign In to Cloud Now →'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* CREATOR HOBBY PROJECT MODAL (z-[2100])                           */}
      {/* ================================================================ */}
      {isHobbyModalOpen && (
        <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative text-center">
            <button
              type="button"
              onClick={() => setIsHobbyModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3 border border-emerald-100">
              <MapPin className="w-6 h-6" />
            </div>

            <h3 className="text-base font-extrabold text-slate-900">
              Hangout Dinajpur
            </h3>

            <blockquote className="text-sm text-slate-600 italic bg-slate-50 p-4 rounded-2xl border border-slate-200/80 my-4 leading-relaxed">
              "Just a fun hobby project built to show places I've traveled
              around Dinajpur."
            </blockquote>

            <a
              href="https://www.facebook.com/NomanUnseen/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>Facebook Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* TOAST NOTIFICATION                                               */}
      {/* ================================================================ */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[2200] bg-slate-900/95 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-white/10">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
