'use client';

import { useState, useEffect, useRef } from 'react';
import { Camera, Upload, Loader2, Sparkles, Copy, ExternalLink, RefreshCw, AlertCircle, Star, ChevronRight, X, Unlock } from 'lucide-react';
import { VintGenLogo, VintGenIcon } from '../components/VintGenLogo';
import { analyzeImage, VintedResult } from './actions/analyzeImage';
import { SignInButton, UserButton, useUser, useAuth } from "@clerk/nextjs";
import { useMutation } from "convex/react";
// (Convex API generation missing, using literal string mutation instead)

type AppState = 'IDLE' | 'LOADING' | 'RESULTS';

const LOADING_STEPS = [
  "Analyse du vêtement...",
  "Identification de la marque...",
  "Estimation du prix de revente...",
  "Rédaction de la description optimisée...",
  "Recherche des meilleurs hashtags..."
];

export default function Home() {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [loadingStepRef, setLoadingStepRef] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<VintedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const spendCredit = useMutation("users:spendCredit" as any);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to visually cycle the loading texts
  useEffect(() => {
    if (appState === 'LOADING') {
      const interval = setInterval(() => {
        setLoadingStepRef((prev) => (prev >= LOADING_STEPS.length - 1 ? prev : prev + 1));
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [appState]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // split "data:image/jpeg;base64,..." to only get the payload
          resolve(reader.result.split(',')[1]);
        } else {
          reject(new Error("Failed to convert image to base64"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isSignedIn) return;

      try {
        const creditRes = await spendCredit();
        if (!creditRes?.success && creditRes?.error === "LIMIT_REACHED") {
          setShowPaywall(true);
          return;
        }
      } catch (err) {
        console.error("Convex spendCredit error:", err);
        // Fallback: If convex fails or is not setup yet, we let the user pass (or we could block them).
      }

      setError(null);
      setResult(null);
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setAppState('LOADING');
      setLoadingStepRef(0);

      try {
        const base64 = await fileToBase64(file);
        const res = await analyzeImage(base64, file.type);

        if (res.success) {
          setResult(res.data);
          setAppState('RESULTS');
        } else {
          throw new Error(res.error);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Une erreur est survenue lors de l'analyse.");
        } else {
          setError("Une erreur est survenue lors de l'analyse.");
        }
        setAppState('IDLE');
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // V1: just rely on native feeling, maybe add a tiny toast later
  };

  const resetFlow = () => {
    setAppState('IDLE');
    setSelectedImage(null);
    setLoadingStepRef(0);
  };

  const closeModalAndReset = () => {
    setShowPaywall(false);
    resetFlow();
  };

  return (
    <main className="min-h-screen pb-24 flex flex-col items-center bg-background-soft dark:bg-gray-950 font-sans w-full max-w-md mx-auto relative shadow-sm transition-colors duration-300">

      {/* Header */}
      <header className="w-full p-6 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-10 shadow-sm rounded-b-[2rem] transition-colors duration-300">
        <VintGenLogo />
        {isSignedIn && (
          <UserButton />
        )}
      </header>

      <div className="flex-1 w-full px-4 py-6 flex flex-col relative">
        {!isSignedIn && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-10 animate-in fade-in zoom-in duration-500 mt-8">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-vinted/10 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-105">
              <VintGenIcon className="w-12 h-12 sm:w-14 sm:h-14 text-vinted drop-shadow-md" />
            </div>

            <div className="text-center space-y-4 px-2">
              <h2 className="text-3xl font-extrabold dark:text-white leading-tight">Augmente tes ventes <span className="text-vinted">10x plus vite</span>.</h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg">L&apos;IA génère tes titres, descriptions et prix depuis une simple photo.</p>
            </div>

            <div className="w-full space-y-4 mt-8">
              <SignInButton mode="modal">
                <button className="w-full bg-vinted hover:bg-vinted-hover text-white rounded-2xl p-4 flex items-center justify-center gap-3 font-semibold text-lg shadow-xl shadow-vinted/20 active:scale-95 transition-all">
                  Créer un compte gratuit
                  <ChevronRight className="w-5 h-5" />
                </button>
              </SignInButton>
              <p className="text-center text-sm text-gray-400 dark:text-gray-500 font-medium">Obtenez 2 analyses gratuites par jour</p>
            </div>
          </div>
        )}

        {isSignedIn && (
          <>
            {/* --- STATE: IDLE --- */}
            {appState === 'IDLE' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-300">
                <div className="text-center space-y-2 px-4">
                  <h2 className="text-2xl font-bold dark:text-white">Vends plus vite.</h2>
                  <p className="text-gray-500 dark:text-gray-400">Prends une photo de ton vêtement, l&apos;IA s&apos;occupe du reste en quelques secondes.</p>
                </div>

                {error && (
                  <div className="w-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-2xl flex items-start gap-3 border border-red-100 dark:border-red-900/50">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                />

                <div className="w-full space-y-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-vinted hover:bg-vinted-hover text-white rounded-2xl p-4 flex items-center justify-center gap-3 font-semibold text-lg shadow-lg shadow-vinted/20 active:scale-95 transition-all"
                  >
                    <Camera className="w-6 h-6" />
                    Prendre une photo
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-2xl p-4 flex items-center justify-center gap-3 font-semibold text-lg shadow-sm border border-gray-100 dark:border-gray-700 active:scale-95 transition-all"
                  >
                    <Upload className="w-6 h-6 text-gray-400 dark:text-gray-400" />
                    Choisir dans la galerie
                  </button>
                </div>
              </div>
            )}


            {/* --- STATE: LOADING --- */}
            {appState === 'LOADING' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-300">
                {selectedImage && (
                  <div className="w-48 h-48 rounded-3xl overflow-hidden shadow-md relative opacity-60">
                    <img src={selectedImage} alt="Selected" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-vinted/10 animate-pulse" />
                  </div>
                )}

                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="w-10 h-10 text-vinted animate-spin" />
                  <p className="text-lg font-medium text-center dark:text-white animate-pulse">
                    {LOADING_STEPS[loadingStepRef]}
                  </p>
                </div>
              </div>
            )}


            {/* --- STATE: RESULTS --- */}
            {appState === 'RESULTS' && (
              <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

                {selectedImage && (
                  <div className="w-full h-48 rounded-3xl overflow-hidden shadow-sm relative">
                    <img src={selectedImage} alt="Selected" className="w-full h-full object-cover" />
                    <button
                      onClick={resetFlow}
                      className="absolute top-3 right-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur p-2 rounded-full shadow-sm text-gray-700 dark:text-gray-200 active:scale-90 transition-all"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Results Cards */}
                <div className="space-y-4">

                  {/* Title & Price */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-gray-900 transition-colors duration-300 p-4 rounded-3xl shadow-sm border border-gray-50 dark:border-gray-800 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Titre généré</span>
                        <p className="font-medium text-gray-900 dark:text-gray-100 mt-1 line-clamp-2">{result?.titre}</p>
                      </div>
                      <button onClick={() => result?.titre && copyToClipboard(result.titre)} className="mt-3 text-vinted flex items-center gap-1.5 text-sm font-semibold hover:opacity-80">
                        <Copy className="w-4 h-4" /> Copier
                      </button>
                    </div>

                    <div className="bg-vinted/10 dark:bg-vinted/20 transition-colors duration-300 p-4 rounded-3xl flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-semibold text-vinted uppercase tracking-wider">Prix conseillé</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="font-bold text-vinted text-xl">{result?.prix}</span>
                        </div>
                      </div>
                      <p className="text-xs text-vinted/80 mt-2">Basé sur les prix du marché</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-white dark:bg-gray-900 transition-colors duration-300 p-5 rounded-3xl shadow-sm border border-gray-50 dark:border-gray-800 relative">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description optimisée</span>
                      <button
                        onClick={() => result?.description && copyToClipboard(result.description)}
                        className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-all"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                      {result?.description}
                    </p>
                  </div>

                  {/* Hashtags */}
                  <div className="bg-white dark:bg-gray-900 transition-colors duration-300 p-5 rounded-3xl shadow-sm border border-gray-50 dark:border-gray-800">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Hashtags</span>
                      <button
                        onClick={() => result?.hashtags && copyToClipboard(result.hashtags.join(' '))}
                        className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-all"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result?.hashtags?.map((tag, i) => (
                        <span key={`${tag}-${i}`} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Action Button for Results */}
      {appState === 'RESULTS' && isSignedIn && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-soft via-background-soft dark:from-gray-950 dark:via-gray-950 to-transparent flex justify-center pb-6 transition-colors duration-300">
          <a className="w-full max-w-sm" href="https://vinted.fr" target="_blank" rel="noreferrer">
            <button className="w-full bg-vinted hover:bg-vinted-hover text-white rounded-2xl p-4 flex items-center justify-center gap-3 font-semibold text-lg shadow-xl shadow-vinted/25 active:scale-95 transition-transform">
              <ExternalLink className="w-6 h-6" />
              Ouvrir Vinted
            </button>
          </a>
        </div>
      )}

      {/* --- PAYWALL MODAL --- */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
            {/* Decorative gradient blob */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-vinted/20 rounded-full blur-2xl"></div>

            <button onClick={closeModalAndReset} className="absolute top-4 right-4 p-2 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full transition-colors z-10">
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center mt-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
                Limite quotidienne atteinte
              </h3>

              <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
                Tu as utilisé tes 2 générations gratuites du jour. Passe en Premium pour booster tes ventes en illimitées et retirer la friction.
              </p>

              <div className="w-full space-y-3">
                <a href="#" className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl p-4 flex items-center justify-center gap-2 font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                  <Unlock className="w-5 h-5" /> S&apos;abonner - 2,99€/mois
                </a>

                <button onClick={closeModalAndReset} className="w-full py-3 text-sm font-semibold text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  Attendre demain pour 2 crédits
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
