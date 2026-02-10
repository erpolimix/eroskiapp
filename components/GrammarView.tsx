
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { GoogleGenAI, Modality } from "@google/genai";

interface GrammarViewProps {
  navigate: (screen: Screen) => void;
}

const NORK_OPTIONS = [
  { id: 'nik', label: 'Nik', color: 'primary' },
  { id: 'hark', label: 'Hark', color: 'primary' },
  { id: 'guk', label: 'Guk', color: 'primary' },
  { id: 'zuk', label: 'Zuk', color: 'primary' },
];

const NOR_OPTIONS = [
  { id: 'hura', label: 'Hura (Sing.)', color: 'accent-blue' },
  { id: 'hauek', label: 'Hauek (Plur.)', color: 'accent-blue' },
];

const VERB_MAP: Record<string, Record<string, string>> = {
  nik: { hura: 'DUT', hauek: 'DITUT' },
  hark: { hura: 'DU', hauek: 'DITU' },
  guk: { hura: 'DUGU', hauek: 'DITUGU' },
  zuk: { hura: 'DUZU', hauek: 'DITUZU' },
};

const GrammarView: React.FC<GrammarViewProps> = ({ navigate }) => {
  const [selectedNork, setSelectedNork] = useState<string | null>('nik');
  const [selectedNor, setSelectedNor] = useState<string | null>('hura');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const result = selectedNork && selectedNor ? VERB_MAP[selectedNork][selectedNor] : '...';

  const speakResult = async () => {
    if (isSpeaking || result === '...') return;
    setIsSpeaking(true);
    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Pronounce clearly: ${result}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        },
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        const dataInt16 = new Int16Array(bytes.buffer);
        const buffer = audioCtx.createBuffer(1, dataInt16.length, 24000);
        buffer.getChannelData(0).set(Array.from(dataInt16).map(v => v / 32768));
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      } else setIsSpeaking(false);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background-dark overflow-hidden font-display">
      <header className="flex items-center p-4 justify-between z-30 shrink-0">
        <button onClick={() => navigate('verboteca')} className="text-white size-10 flex items-center justify-center rounded-full bg-surface-dark/50">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="text-white text-lg font-bold">Método Visual: UKAN</h2>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 relative flex flex-col items-center justify-center p-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"></div>
        </div>

        {/* Nork Row */}
        <div className="flex gap-4 mb-12 z-20">
          {NORK_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setSelectedNork(opt.id)}
              className={`w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-300 border-2 ${selectedNork === opt.id
                  ? 'bg-primary text-background-dark border-primary shadow-[0_0_20px_rgba(19,236,164,0.5)] scale-110'
                  : 'bg-surface-dark text-gray-400 border-white/10 hover:border-primary/50'
                }`}
            >
              <span className="text-sm font-black">{opt.label}</span>
              <span className="text-[8px] uppercase font-bold opacity-60">Sujeto</span>
            </button>
          ))}
        </div>

        {/* Central Result Visualizer */}
        <div className="relative w-64 h-64 flex items-center justify-center z-10 mb-12">
          {/* Decorative SVG Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#13eca4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#4aa9ff" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <circle cx="128" cy="128" r="80" fill="none" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4" className="animate-spin [animation-duration:10s]" />
            <circle cx="128" cy="128" r="100" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
          </svg>

          <button
            onClick={speakResult}
            className={`w-40 h-40 rounded-full bg-surface-dark border-4 flex flex-col items-center justify-center transition-all duration-500 group relative ${selectedNork && selectedNor ? 'border-primary shadow-[0_0_40px_rgba(19,236,164,0.2)]' : 'border-white/5'
              }`}
          >
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Resultado</span>
            <span className={`text-5xl font-black tracking-tighter transition-all duration-300 ${isSpeaking ? 'scale-110 text-primary' : 'text-white'}`}>
              {result}
            </span>
            <div className={`mt-2 flex items-center gap-1 text-primary ${isSpeaking ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
              <span className="material-symbols-outlined text-sm animate-pulse">graphic_eq</span>
            </div>
            <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase">
              <span className="material-symbols-outlined text-xs">volume_up</span>
              Escuchar
            </div>
          </button>
        </div>

        {/* Nor Row */}
        <div className="flex gap-8 z-20">
          {NOR_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setSelectedNor(opt.id)}
              className={`px-6 py-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border-2 ${selectedNor === opt.id
                  ? 'bg-accent-blue text-white border-accent-blue shadow-[0_0_20px_rgba(74,169,255,0.4)] scale-105'
                  : 'bg-surface-dark text-gray-400 border-white/10 hover:border-accent-blue/50'
                }`}
            >
              <span className="text-sm font-black">{opt.label}</span>
              <span className="text-[8px] uppercase font-bold opacity-60">Objeto</span>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center max-w-[280px]">
          <p className="text-gray-400 text-sm leading-relaxed">
            Toca los elementos exteriores para construir la forma del verbo <span className="text-primary font-bold">UKAN</span> (Tener).
          </p>
        </div>
      </main>

      <footer className="p-6 bg-background-dark border-t border-white/5 z-30">
        <button
          onClick={() => navigate('exercise_order')}
          className="w-full bg-primary py-4 rounded-2xl text-background-dark font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all"
        >
          Practicar con Frases
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </footer>
    </div>
  );
};

export default GrammarView;
