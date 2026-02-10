
import React, { useState } from 'react';
import { Screen } from '../types';

const EXERCISE = {
  target: 'Quiero un café con leche, por favor.',
  solution: ['Esnearekin', 'kafe', 'bat', 'nahi', 'dut,', 'mesedez'],
  options: ['Esnearekin', 'dut,', 'kafe', 'nahi', 'mesedez', 'bat', 'hura', 'naiz']
};

const ExerciseOrder: React.FC<{ navigate: (s: Screen) => void }> = ({ navigate }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const toggleWord = (word: string) => {
    if (selected.includes(word)) {
      setSelected(selected.filter(w => w !== word));
    } else {
      setSelected([...selected, word]);
    }
    setIsCorrect(null);
  };

  const check = () => {
    const isOk = selected.join(' ') === EXERCISE.solution.join(' ');
    setIsCorrect(isOk);
  };

  return (
    <div className="flex-1 flex flex-col bg-background-dark text-white">
      <header className="p-4 flex items-center gap-4">
        <button onClick={() => navigate('home')} className="text-gray-400"><span className="material-symbols-outlined">close</span></button>
        <div className="flex-1 h-2 bg-surface-dark rounded-full overflow-hidden">
          <div className="h-full bg-primary w-2/3"></div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <h2 className="text-xl font-bold mb-2">Ordena la frase</h2>
        <div className="bg-surface-dark/50 p-4 rounded-2xl mb-8 border border-white/5 italic text-gray-400">
          "{EXERCISE.target}"
        </div>

        <div className="min-h-[120px] flex flex-wrap gap-2 p-4 border-2 border-dashed border-gray-700 rounded-3xl mb-8">
          {selected.map((w, i) => (
            <button key={i} onClick={() => toggleWord(w)} className="bg-primary text-background-dark px-4 py-2 rounded-xl font-bold animate-in zoom-in-50">
              {w}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {EXERCISE.options.map((w, i) => (
            <button 
              key={i} 
              disabled={selected.includes(w)}
              onClick={() => toggleWord(w)} 
              className={`px-4 py-2 rounded-xl font-bold border-b-4 transition-all ${
                selected.includes(w) ? 'bg-gray-800 border-transparent text-gray-600' : 'bg-surface-dark border-black/30 text-white active:translate-y-1 active:border-b-0'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </main>

      <footer className={`p-6 pb-12 transition-colors ${isCorrect === true ? 'bg-green-500/20' : isCorrect === false ? 'bg-red-500/20' : 'bg-transparent'}`}>
        {isCorrect !== null && (
          <div className="flex items-center gap-3 mb-4 animate-in slide-in-from-bottom-4">
            <span className={`material-symbols-outlined text-3xl ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
              {isCorrect ? 'check_circle' : 'error'}
            </span>
            <span className={`font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
              {isCorrect ? '¡Excelente trabajo!' : 'Inténtalo de nuevo'}
            </span>
          </div>
        )}
        <button 
          onClick={isCorrect ? () => navigate('home') : check}
          className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest ${
            selected.length === 0 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-primary text-background-dark'
          }`}
        >
          {isCorrect ? 'Continuar' : 'Comprobar'}
        </button>
      </footer>
    </div>
  );
};

export default ExerciseOrder;
