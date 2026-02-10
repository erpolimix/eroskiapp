
import React, { useState } from 'react';
import { Screen, Scenario } from '../types';

interface ScenariosListProps {
  navigate: (screen: Screen, scenario?: Scenario) => void;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'bakery',
    title: 'Okindegian',
    subtitle: 'En la Panadería',
    difficulty: 'Easy',
    difficultyLabel: 'Fácil',
    xp: 50,
    time: '3 min',
    category: 'Vida Diaria',
    context: 'Estás pidiendo pan y algunos pasteles para el desayuno.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'bilbao',
    title: 'Bilbon Galduta',
    subtitle: 'Perdido en Bilbao',
    difficulty: 'Medium',
    difficultyLabel: 'Intermedio',
    xp: 75,
    time: '5 min',
    category: 'Viajes',
    context: 'Necesitas encontrar el museo Guggenheim pero te has desorientado en el Casco Viejo.',
    image: 'https://images.unsplash.com/photo-1549480111-9759d54e15ba?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'tickets',
    title: 'Sarrerak Erosten',
    subtitle: 'Comprando Entradas',
    difficulty: 'Hard',
    difficultyLabel: 'Difícil',
    xp: 100,
    time: '7 min',
    category: 'Social',
    context: 'Estás intentando comprar entradas para un partido del Athletic Club en San Mamés.',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop'
  }
];

const ScenariosList: React.FC<ScenariosListProps> = ({ navigate }) => {
  const [activeFilter, setActiveFilter] = useState('Todos');

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-white/5 pt-4">
        <div className="px-4 pb-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('home')}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors text-white"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <div className="flex items-center gap-2 bg-surface-dark px-3 py-1.5 rounded-full border border-white/5 shadow-sm">
              <span className="material-symbols-outlined text-primary text-[20px] fill-1">bolt</span>
              <span className="text-white text-sm font-bold tracking-wide">1/3 Diario</span>
            </div>
          </div>
          <div>
            <h1 className="text-white text-3xl font-extrabold tracking-tight">Escenarios IA</h1>
            <p className="text-gray-400 text-sm mt-1">Practica situaciones reales en euskera</p>
          </div>
        </div>
        
        <div className="w-full overflow-x-auto hide-scrollbar pb-4 pt-2 px-4">
          <div className="flex gap-3">
            {['Todos', 'Principiante', 'Viajes', 'Social'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 h-9 px-5 rounded-full text-sm font-bold transition-all active:scale-95 ${
                  activeFilter === filter 
                    ? 'bg-primary text-background-dark shadow-[0_0_10px_rgba(19,236,164,0.3)]' 
                    : 'bg-surface-dark border border-white/5 text-gray-400 font-medium'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 flex flex-col gap-6 overflow-y-auto hide-scrollbar pb-24">
        {SCENARIOS.map((scenario) => (
          <article 
            key={scenario.id}
            onClick={() => navigate('chat', scenario)}
            className="group relative w-full h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-[0.99] cursor-pointer"
          >
            <div className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${scenario.image}')` }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            
            <div className="relative z-10 flex flex-col justify-end h-full p-5">
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-1">
                <span className="text-primary text-xs font-bold">+{scenario.xp} XP</span>
              </div>
              
              <h2 className="text-white text-2xl font-bold leading-tight mb-1">{scenario.title}</h2>
              <p className="text-gray-300 text-sm mb-4 font-medium">{scenario.subtitle}</p>
              
              <div className="flex items-end justify-between">
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-medium border border-white/5 ${
                    scenario.difficulty === 'Easy' ? 'text-emerald-200' : scenario.difficulty === 'Medium' ? 'text-yellow-200' : 'text-red-300'
                  }`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {scenario.difficulty === 'Easy' ? 'clover_spark' : scenario.difficulty === 'Medium' ? 'hiking' : 'local_fire_department'}
                    </span>
                    {scenario.difficultyLabel}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-medium text-white border border-white/5">
                    <span className="material-symbols-outlined text-[14px]">timer</span>
                    {scenario.time}
                  </span>
                </div>
                <button className="bg-primary hover:bg-primary-dark text-background-dark w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-[0_0_15px_rgba(19,236,164,0.4)]">
                  <span className="material-symbols-outlined text-[24px]">play_arrow</span>
                </button>
              </div>
            </div>
          </article>
        ))}
        
        <article className="opacity-50 group relative w-full rounded-2xl overflow-hidden bg-surface-dark border-2 border-dashed border-gray-600 h-32 flex flex-col items-center justify-center gap-2 cursor-not-allowed">
          <span className="material-symbols-outlined text-gray-500 text-4xl">lock</span>
          <p className="text-gray-500 font-medium text-sm">Próximos escenarios desbloqueándose...</p>
        </article>
      </main>
    </div>
  );
};

export default ScenariosList;
