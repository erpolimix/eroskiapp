import React, { useState, useEffect } from 'react';
import { Screen, VocabularyItem } from '../types';
import { supabase } from '../lib/supabase';
import { addXp } from '../logic/userService';
import { motion, AnimatePresence } from 'framer-motion';

interface ExerciseMatchProps {
  navigate: (screen: Screen) => void;
}

const ExerciseMatch: React.FC<ExerciseMatchProps> = ({ navigate }) => {
  const [items, setItems] = useState<VocabularyItem[]>([]);
  const [shuffledSpanish, setShuffledSpanish] = useState<VocabularyItem[]>([]);
  const [selectedBasque, setSelectedBasque] = useState<string | null>(null);
  const [selectedSpanish, setSelectedSpanish] = useState<string | null>(null);
  const [matches, setMatches] = useState<string[]>([]); // stores IDs of matched items
  const [wrongMatch, setWrongMatch] = useState<boolean>(false);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVocabulary();
  }, []);

  const fetchVocabulary = async () => {
    setLoading(true);
    setMatches([]);
    setSelectedBasque(null);
    setSelectedSpanish(null);
    setCompleted(false);
    setWrongMatch(false);

    // Fetch 5 random words
    const { data } = await supabase.from('vocabulary').select('*');

    if (data && data.length > 0) {
      const selected = data.sort(() => 0.5 - Math.random()).slice(0, 5);
      setItems(selected);
      // Shuffle the second column independently
      setShuffledSpanish([...selected].sort(() => 0.5 - Math.random()));
    }
    setLoading(false);
  };

  const handleBasqueSelect = (basque: string) => {
    if (matches.includes(items.find(i => i.basque === basque)?.id || '')) return;
    setSelectedBasque(basque);
    if (selectedSpanish) {
      checkMatch(basque, selectedSpanish);
    }
  };

  const handleSpanishSelect = (spanish: string) => {
    const itemId = shuffledSpanish.find(i => i.spanish === spanish)?.id || '';
    if (matches.includes(itemId)) return;
    setSelectedSpanish(spanish);
    if (selectedBasque) {
      checkMatch(selectedBasque, spanish);
    }
  };

  const checkMatch = (basque: string, spanish: string) => {
    const itemB = items.find(i => i.basque === basque);
    const itemS = items.find(i => i.spanish === spanish);

    if (itemB && itemS && itemB.id === itemS.id) {
      // Correct Match
      setMatches(prev => [...prev, itemB.id]);
      setSelectedBasque(null);
      setSelectedSpanish(null);

      if (matches.length + 1 === items.length) {
        setCompleted(true);
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) addXp(session.user.id, 20);
        });
      }
    } else {
      // Wrong Match
      setWrongMatch(true);
      setTimeout(() => {
        setWrongMatch(false);
        setSelectedBasque(null);
        setSelectedSpanish(null);
      }, 500);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background-dark text-white">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold animate-pulse uppercase tracking-widest text-xs">Kargatzen...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background-dark overflow-hidden relative">
      <header className="flex items-center gap-4 px-4 py-6 w-full shrink-0">
        <button onClick={() => navigate('home')} className="text-gray-400 hover:text-white transition-colors">
          <span className="material-symbols-outlined text-3xl font-bold">close</span>
        </button>
        <div className="flex-1 h-3 bg-surface-dark rounded-full overflow-hidden relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-700"
            initial={{ width: 0 }}
            animate={{ width: completed ? '100%' : `${(matches.length / items.length) * 100}%` }}
          ></motion.div>
        </div>
      </header>

      <main className="flex-1 px-4 flex flex-col items-center justify-start pt-4 max-w-md mx-auto w-full">
        <h1 className="text-2xl font-black text-white mb-2 leading-tight text-center uppercase tracking-tight">
          Vocabulario
        </h1>
        <p className="text-gray-400 text-sm mb-8 text-center">Empareja las palabras en euskera con su traducción.</p>

        <div className="flex w-full gap-4">
          {/* Basque Column */}
          <div className="flex-1 flex flex-col gap-3">
            {items.map((item) => (
              <button
                key={item.id + '_basque'}
                onClick={() => handleBasqueSelect(item.basque)}
                disabled={matches.includes(item.id)}
                className={`h-14 rounded-2xl font-bold text-sm transition-all border-b-4 flex items-center justify-center px-2 text-center leading-tight ${matches.includes(item.id)
                    ? 'bg-green-500/10 text-green-500 border-green-500/50 opacity-40 grayscale pointer-events-none'
                    : selectedBasque === item.basque
                      ? wrongMatch ? 'bg-red-500/20 text-red-500 border-red-500/50 animate-shake' : 'bg-primary text-background-dark border-primary-dark translate-y-1'
                      : 'bg-surface-dark text-gray-200 border-black/30 hover:brightness-110 active:translate-y-1 active:border-b-0'
                  }`}
              >
                {item.basque}
              </button>
            ))}
          </div>

          {/* Spanish Column */}
          <div className="flex-1 flex flex-col gap-3">
            {shuffledSpanish.map((item) => (
              <button
                key={item.id + '_spanish'}
                onClick={() => handleSpanishSelect(item.spanish)}
                disabled={matches.includes(item.id)}
                className={`h-14 rounded-2xl font-bold text-sm transition-all border-b-4 flex items-center justify-center px-2 text-center leading-tight ${matches.includes(item.id)
                    ? 'bg-green-500/10 text-green-500 border-green-500/50 opacity-40 grayscale pointer-events-none'
                    : selectedSpanish === item.spanish
                      ? wrongMatch ? 'bg-red-500/20 text-red-500 border-red-500/50 animate-shake' : 'bg-primary text-background-dark border-primary-dark translate-y-1'
                      : 'bg-surface-dark text-gray-200 border-black/30 hover:brightness-110 active:translate-y-1 active:border-b-0'
                  }`}
              >
                {item.spanish}
              </button>
            ))}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute inset-0 z-[60] p-4 bg-background-dark/80 backdrop-blur-md flex flex-col justify-end"
          >
            <div className="w-full max-w-md mx-auto bg-[#d7ffb8] rounded-3xl p-8 flex flex-col gap-6 shadow-2xl border border-green-200">
              <div className="flex items-center gap-5">
                <div className="bg-white rounded-full p-3 text-green-600 shadow-sm">
                  <span className="material-symbols-outlined text-4xl font-bold">check_circle</span>
                </div>
                <div>
                  <h3 className="text-green-800 text-2xl font-black uppercase tracking-tight">¡Ondo eginda!</h3>
                  <p className="text-green-700 text-base font-bold">+20 XP earned</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={fetchVocabulary}
                  className="w-full py-4 rounded-2xl bg-green-600 text-white font-black uppercase tracking-widest shadow-lg hover:bg-green-700 active:scale-95 transition-all"
                >
                  Siguiente Ronda
                </button>
                <button
                  onClick={() => navigate('home')}
                  className="w-full py-3 rounded-xl text-green-700 font-bold uppercase tracking-wide hover:bg-green-200 transition-colors"
                >
                  Volver al Inicio
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}} />
    </div>
  );
};

export default ExerciseMatch;
