
import React, { useState } from 'react';
import { Screen } from '../types';

interface ExerciseMatchProps {
  navigate: (screen: Screen) => void;
}

const ITEMS = [
  { id: '1', basque: 'Etxea', spanish: 'Casa', image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=400&auto=format&fit=crop' },
  { id: '2', basque: 'Txakurra', spanish: 'Perro', image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop' },
  { id: '3', basque: 'Sagarra', spanish: 'Manzana', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=400&auto=format&fit=crop' },
  { id: '4', basque: 'Eguzkia', spanish: 'Sol', image: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?q=80&w=400&auto=format&fit=crop' },
];

const ExerciseMatch: React.FC<ExerciseMatchProps> = ({ navigate }) => {
  const [selections, setSelections] = useState<Record<string, string>>({ '2': 'Txakurra' });
  const [completed, setCompleted] = useState(false);

  const handleMatch = (itemId: string, word: string) => {
    setSelections(prev => ({ ...prev, [itemId]: word }));
  };

  const isMatched = (word: string) => Object.values(selections).includes(word);

  return (
    <div className="flex-1 flex flex-col bg-background-dark overflow-hidden relative">
      <header className="flex items-center gap-4 px-4 py-6 w-full shrink-0">
        <button onClick={() => navigate('home')} className="text-gray-400 hover:text-white transition-colors">
          <span className="material-symbols-outlined text-3xl font-bold">close</span>
        </button>
        <div className="flex-1 h-3 bg-surface-dark rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-700" style={{ width: completed ? '100%' : '40%' }}></div>
        </div>
        <div className="flex items-center gap-1 text-red-500">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
          <span className="font-bold text-lg">5</span>
        </div>
      </header>

      <main className="flex-1 px-4 pb-24 flex flex-col justify-center max-w-md mx-auto w-full">
        <h1 className="text-2xl font-bold text-white mb-6 leading-tight">
          Relaciona las palabras con las imágenes
        </h1>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {ITEMS.map((item) => (
            <button 
              key={item.id}
              onClick={() => !selections[item.id] && handleMatch(item.id, '...')}
              className={`group relative aspect-square w-full rounded-2xl overflow-hidden shadow-sm transition-all active:scale-95 border-2 ${
                selections[item.id] ? 'border-primary' : 'border-transparent hover:border-primary/50'
              }`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity" 
                style={{ backgroundImage: `url('${item.image}')` }}
              ></div>
              <div className="absolute inset-x-2 bottom-2 h-10 bg-black/60 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
                <span className={`text-sm font-bold ${selections[item.id] ? 'text-primary' : 'text-white/40'}`}>
                  {selections[item.id] || '?'}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {ITEMS.map(item => (
            <button
              key={item.basque}
              disabled={isMatched(item.basque)}
              onClick={() => handleMatch(item.id === '1' ? '1' : item.id === '3' ? '3' : '4', item.basque)}
              className={`h-12 px-6 rounded-xl font-bold text-lg transition-all ${
                isMatched(item.basque)
                  ? 'bg-surface-dark text-gray-600 cursor-not-allowed opacity-30 border-b-4 border-transparent'
                  : 'bg-surface-dark text-gray-200 border-b-4 border-black/30 hover:bg-surface-dark-hover active:border-b-0 active:translate-y-1'
              }`}
            >
              {item.basque}
            </button>
          ))}
        </div>
      </main>

      <footer className="fixed bottom-0 w-full max-w-md mx-auto bg-background-dark/95 border-t border-white/5 p-4 z-50">
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => navigate('home')} className="px-6 py-3 rounded-xl text-gray-500 font-bold uppercase tracking-wide text-sm hover:bg-white/5 transition-colors">
            Saltar
          </button>
          <button 
            onClick={() => setCompleted(true)}
            className="flex-1 px-6 py-4 rounded-xl bg-primary text-background-dark font-black uppercase tracking-wide text-base shadow-lg shadow-primary/25 active:scale-95 transition-all hover:brightness-110"
          >
            Comprobar
          </button>
        </div>
      </footer>

      {completed && (
        <div className="absolute inset-0 z-[60] p-4 bg-background-dark/80 backdrop-blur-sm flex flex-col justify-end">
          <div className="w-full max-w-md mx-auto bg-[#d7ffb8] rounded-3xl p-6 flex flex-col gap-4 shadow-2xl border border-green-200 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full p-2 text-green-600">
                <span className="material-symbols-outlined text-3xl font-bold">check_circle</span>
              </div>
              <div>
                <h3 className="text-green-800 text-xl font-extrabold">¡Correcto!</h3>
                <p className="text-green-700 text-sm font-medium">Has emparejado todas las palabras.</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('home')}
              className="w-full py-4 rounded-2xl bg-green-600 text-white font-bold uppercase tracking-wide shadow-lg hover:bg-green-700 transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseMatch;
