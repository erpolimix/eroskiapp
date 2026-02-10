
import React from 'react';
import { Screen, User } from '../types';

interface ProgressProps {
  user: User;
  navigate: (screen: Screen) => void;
}

const LEADERBOARD = [
  { name: 'Amaia', xp: 5000, rank: 1, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop' },
  { name: 'Iker', xp: 4800, rank: 2, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop' },
  { name: 'Jon (Tú)', xp: 1450, rank: 3, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABffzN2cfufCqqoz3IdtcdJWOJ4-iyeC-yooIcumU9Iu-KMU3JO101HF2OuQBfBPvUY634njLvUzIIlsatiauLDwu4CmBcPHAGmHqWi2yqHq7Q79KKqH-uaHF4F3pPe6xZFPYvLEoMtzMJGwJAd1B7OFE4ZHsAm015y3J8RyueSAd8y1FDJr113wzV9aRLu9-liOUj3mtedjcfgkmg6sHL7S8jGZMFVd-1A3fAxW6b2KNvzRJ5JfLN8OzTmEtMrTfG3yHhUd-Krvo', isUser: true },
  { name: 'Mikel', xp: 1200, rank: 4, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop' },
];

const ACHIEVEMENTS = [
  { id: 'streak', icon: 'local_fire_department', title: 'Racha de 7 días', status: 'Completado', color: 'from-orange-400 to-red-500' },
  { id: 'chat', icon: 'chat', title: 'Primer Chat', status: 'Completado', color: 'from-blue-400 to-indigo-500' },
  { id: 'scholar', icon: 'school', title: 'Erudito', status: 'Completado', color: 'from-primary to-green-600' },
  { id: 'locked1', icon: 'lock', title: 'Explorador', status: 'Bloqueado', color: 'bg-gray-700', locked: true },
  { id: 'locked2', icon: 'lock', title: 'Maestro Vocab', status: 'Bloqueado', color: 'bg-gray-700', locked: true },
  { id: 'locked3', icon: 'lock', title: 'Social', status: 'Bloqueado', color: 'bg-gray-700', locked: true },
];

const Progress: React.FC<ProgressProps> = ({ user, navigate }) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background-dark h-full">
      <header className="flex items-center justify-between p-6 pb-2 shrink-0">
        <button onClick={() => navigate('home')} className="flex size-10 items-center justify-center rounded-full bg-surface-dark/50 hover:bg-surface-dark transition-colors">
          <span className="material-symbols-outlined text-white">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight text-white">Mi Progreso</h1>
        <button className="flex size-10 items-center justify-center rounded-full bg-surface-dark/50 hover:bg-surface-dark transition-colors">
          <span className="material-symbols-outlined text-white">settings</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 hide-scrollbar">
        <div className="px-6 pt-4 pb-8 flex flex-col items-center">
          <div className="relative group cursor-pointer mb-4">
            <div className="absolute inset-0 rounded-full bg-primary blur-md opacity-40"></div>
            <div className="relative h-28 w-28 rounded-full border-4 border-background-dark p-1 bg-surface-dark">
              <img alt="Avatar" className="h-full w-full rounded-full object-cover" src={user.avatar} />
              <div className="absolute -bottom-2 -right-2 flex size-10 items-center justify-center rounded-full bg-primary text-background-dark font-black border-4 border-background-dark shadow-sm">
                12
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-1">Euskaldun Berria</h2>
          <p className="text-gray-400 font-medium text-sm mb-6">Principiante Avanzado</p>
          
          <div className="w-full max-w-sm space-y-2">
            <div className="flex justify-between text-xs font-black uppercase tracking-widest text-primary">
              <span>XP Actual</span>
              <span className="text-gray-500">1450 / 2000</span>
            </div>
            <div className="h-3 w-full rounded-full bg-surface-dark overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all duration-1000 ease-out" style={{ width: '72.5%' }}></div>
            </div>
            <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-wider">¡Solo 550 XP para el Nivel 13!</p>
          </div>
        </div>

        <section className="px-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">emoji_events</span>
              Sala de Trofeos
            </h3>
            <button className="text-xs font-semibold text-primary">Ver todos</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {ACHIEVEMENTS.map(ach => (
              <div key={ach.id} className={`flex flex-col items-center gap-2 rounded-xl bg-surface-dark p-3 border border-transparent transition-all ${ach.locked ? 'opacity-50 grayscale border-dashed border-gray-600' : 'hover:border-primary/30'}`}>
                <div className={`relative flex size-14 items-center justify-center rounded-full text-white shadow-lg ${ach.locked ? 'bg-gray-700' : `bg-gradient-to-br ${ach.color}`}`}>
                  <span className="material-symbols-outlined !text-[32px]">{ach.icon}</span>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-white leading-tight">{ach.title}</p>
                  <p className={`text-[9px] mt-0.5 font-bold ${ach.locked ? 'text-gray-500' : 'text-primary'}`}>{ach.status}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 mb-8">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-yellow-500">leaderboard</span>
            Clasificación Semanal
          </h3>
          <div className="space-y-3">
            {LEADERBOARD.map(rank => (
              <div 
                key={rank.name}
                className={`flex items-center gap-4 rounded-xl p-3 shadow-sm border-l-4 ${
                  rank.isUser 
                    ? 'bg-primary/5 border-primary ring-1 ring-primary/20 relative overflow-hidden' 
                    : `bg-surface-dark ${rank.rank === 1 ? 'border-yellow-400' : rank.rank === 2 ? 'border-gray-400' : 'border-transparent'}`
                }`}
              >
                {rank.isUser && (
                  <div className="absolute right-0 top-0 bg-primary text-background-dark text-[10px] font-black px-2 py-0.5 rounded-bl-lg">TÚ</div>
                )}
                <div className={`flex w-6 justify-center font-black ${rank.rank === 1 ? 'text-yellow-500' : rank.isUser ? 'text-primary' : 'text-gray-500'}`}>{rank.rank}</div>
                <div className={`size-10 rounded-full overflow-hidden ${rank.isUser ? 'ring-2 ring-primary' : ''}`}>
                  <img alt={rank.name} className="h-full w-full object-cover" src={rank.avatar} />
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${rank.isUser ? 'text-primary' : 'text-white'}`}>{rank.name}</p>
                  <p className="text-xs text-gray-500 font-medium">{rank.xp} XP</p>
                </div>
                {rank.rank === 1 && <span className="material-symbols-outlined text-yellow-500">military_tech</span>}
                {rank.isUser && <span className="material-symbols-outlined text-primary animate-pulse">trending_up</span>}
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="absolute bottom-24 left-0 right-0 px-6 flex justify-center z-20">
        <button className="shadow-lg shadow-primary/30 flex w-full max-w-sm items-center justify-center gap-2 rounded-full bg-primary py-4 px-8 text-background-dark font-black text-base transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <span className="material-symbols-outlined">stars</span>
          Recoger Recompensas
        </button>
      </div>
    </div>
  );
};

export default Progress;
