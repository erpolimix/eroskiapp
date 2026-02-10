
import React, { useState } from 'react';
import { Screen, Verb } from '../types';

interface VerbotecaProps {
  navigate: (screen: Screen) => void;
}

const VERBS: Verb[] = [
  {
    basque: 'Izan', english: 'Ser / Estar', category: 'NOR', mastery: 85,
    forms: { ni: 'naiz', hura: 'da', gu: 'gara' }
  },
  {
    basque: 'Ukan', english: 'Haber / Tener', category: 'NOR-NORK', mastery: 45,
    forms: { ni: 'dut', hura: 'du', gu: 'dugu' }
  },
  {
    basque: 'Egon', english: 'Estar (estado)', category: 'NOR', mastery: 10,
    forms: { ni: 'nago', hura: 'dago', gu: 'gaude' }
  }
];

const Verboteca: React.FC<VerbotecaProps> = ({ navigate }) => {
  const [activeFilter, setActiveFilter] = useState('Todos los niveles');

  return (
    <div className="flex-1 flex flex-col bg-background-dark overflow-hidden">
      <header className="flex-none bg-background-dark sticky top-0 z-20 pb-2 pt-12 px-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate('home')} className="text-white hover:bg-white/10 rounded-full p-2">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-white text-xl font-bold tracking-tight flex-1 text-center pr-2">Verboteca</h1>
          <div className="flex items-center bg-surface-dark rounded-full px-3 py-1 border border-white/5">
            <span className="material-symbols-outlined text-primary text-xl mr-1">bolt</span>
            <span className="text-white text-sm font-bold">1250 XP</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 hide-scrollbar">
        {/* Banner Método Visual */}
        <div className="px-4 py-4">
          <button 
            onClick={() => navigate('grammar')}
            className="w-full bg-gradient-to-r from-primary/20 to-accent-blue/20 p-5 rounded-3xl border border-primary/30 flex items-center justify-between group active:scale-[0.98] transition-all"
          >
            <div className="flex flex-col items-start gap-1">
              <span className="px-2 py-0.5 rounded-full bg-primary text-background-dark text-[8px] font-black uppercase tracking-wider">Novedad</span>
              <h3 className="text-white font-bold text-lg">Método Visual Interactivo</h3>
              <p className="text-gray-400 text-xs text-left">Aprende los verbos NOR-NORK de forma intuitiva.</p>
            </div>
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-primary text-background-dark flex items-center justify-center shadow-[0_0_15px_rgba(19,236,164,0.4)] group-hover:rotate-12 transition-transform">
                <span className="material-symbols-outlined text-3xl">hub</span>
              </div>
            </div>
          </button>
        </div>

        <div className="flex gap-3 px-4 py-2 overflow-x-auto hide-scrollbar pt-2 pb-4">
          {['Todos los niveles', 'Básico', 'Intermedio', 'Nor-Nork'].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeFilter === f ? 'bg-primary text-background-dark' : 'bg-surface-dark text-gray-400 border border-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <section className="px-4 space-y-4 pt-2">
          <h3 className="text-white text-lg font-bold mb-2 px-1">Biblioteca</h3>
          {VERBS.map(verb => (
            <div 
              key={verb.basque} 
              onClick={() => navigate('grammar')}
              className="bg-surface-dark rounded-2xl p-5 border border-white/5 active:scale-[0.98] transition-transform cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-2xl font-bold text-white">{verb.basque}</h4>
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase">{verb.category}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{verb.english}</p>
                </div>
                <div className="text-primary group-hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined text-3xl">arrow_right_alt</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 mt-4">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  {verb.mastery}% Dominado
                </span>
                <span className="font-bold text-primary uppercase text-[10px]">Ver Método Visual</span>
              </div>
            </div>
          ))}
        </section>
      </main>

      <button className="fixed bottom-24 right-4 w-14 h-14 bg-primary text-background-dark rounded-full shadow-lg shadow-primary/40 flex items-center justify-center z-20 hover:scale-105 active:scale-95 transition-transform">
        <span className="material-symbols-outlined text-3xl">play_arrow</span>
      </button>
    </div>
  );
};

export default Verboteca;
