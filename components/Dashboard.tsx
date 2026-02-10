
import React from 'react';
import { User, Screen } from '../types';

interface DashboardProps {
  user: User;
  navigate: (screen: Screen) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, navigate }) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="flex items-center justify-between px-6 pt-6 pb-2 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => navigate('progress')}>
            <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-primary ring-offset-2 ring-offset-background-dark bg-gray-700 flex items-center justify-center">
              {user.avatar ? (
                <img alt="Perfil" className="h-full w-full object-cover" src={user.avatar} referrerPolicy="no-referrer" />
              ) : (
                <span className="text-white font-bold text-lg">{user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-primary border-2 border-background-dark"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-400">Bienvenido de nuevo</span>
            <h2 className="text-lg font-bold leading-tight">Kaixo, {user.name.split(' ')[0]}! 👋</h2>
          </div>
        </div>
        <button
          onClick={() => navigate('map')}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-dark text-gray-300 hover:bg-surface-dark-hover hover:text-primary transition-colors border border-white/5 active:scale-95"
        >
          <span className="material-symbols-outlined text-[24px]">map</span>
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-dark text-gray-300 ml-2">
          <span className="material-symbols-outlined text-[24px]">notifications</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto hide-scrollbar pb-32 pt-4">
        <div className="px-6 mb-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-dark to-[#1e3a30] p-6 shadow-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white font-black text-xl">Objetivo Diario</h3>
                <p className="text-primary text-xs font-bold uppercase tracking-widest">
                  {user.daily_xp && user.daily_goal && user.daily_xp >= user.daily_goal ? '¡Completado!' : 'Sigue así'}
                </p>
              </div>
              <div className="bg-primary/20 p-2 rounded-xl">
                <span className="material-symbols-outlined text-primary">emoji_events</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-3 bg-background-dark rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, ((user.daily_xp || 0) / (user.daily_goal || 50)) * 100)}%` }}
                ></div>
              </div>
              <span className="text-white font-bold text-sm">{user.daily_xp || 0}/{user.daily_goal || 50} XP</span>
            </div>
            <button
              onClick={() => navigate('map')}
              className="w-full py-3 bg-primary text-background-dark rounded-xl font-black text-sm uppercase hover:brightness-110 active:scale-95 transition-all"
            >
              Continuar Aprendiendo
            </button>
          </div>
        </div>

        <div className="px-6 mb-4 flex items-center justify-between">
          <h3 className="text-white font-bold text-lg">Práctica rápida</h3>
        </div>

        <div className="px-6 grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('exercise_match')}
            className="bg-surface-dark p-4 rounded-2xl border border-white/5 flex flex-col gap-2 group hover:border-primary/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">view_module</span>
            </div>
            <span className="text-white font-bold text-sm">Vocabulario</span>
          </button>
          <button
            onClick={() => navigate('exercise_order')}
            className="bg-surface-dark p-4 rounded-2xl border border-white/5 flex flex-col gap-2 group hover:border-primary/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-accent-purple/10 text-accent-purple flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">format_list_numbered</span>
            </div>
            <span className="text-white font-bold text-sm">Construir Frases</span>
          </button>
        </div>

        <div className="px-6 mt-6">
          <button
            onClick={() => navigate('builder')}
            className="w-full bg-gradient-to-r from-accent-purple to-primary/80 p-5 rounded-3xl border border-white/10 flex items-center justify-between group active:scale-[0.98] transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rotate-45 translate-x-16 translate-y--16 blur-2xl"></div>
            <div className="flex flex-col items-start gap-1 z-10 text-left">
              <span className="px-2 py-0.5 rounded-full bg-white text-accent-purple text-[8px] font-black uppercase tracking-wider">Nuevo Juego</span>
              <h3 className="text-white font-black text-xl italic uppercase tracking-tighter">Aditz-Eraikitzailea</h3>
              <p className="text-white/70 text-xs">Domina los verbos construyéndolos pieza a pieza.</p>
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-white text-accent-purple flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <span className="material-symbols-outlined text-3xl font-black">architecture</span>
              </div>
            </div>
          </button>
        </div>

        <div className="px-6 mt-8">
          <div className="bg-surface-dark rounded-2xl p-4 border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl fill">local_fire_department</span>
            </div>
            <div>
              <p className="text-white font-bold">{user.streak} días de racha</p>
              <p className="text-xs text-gray-500">¡Mañana desbloqueas un nuevo cofre!</p>
            </div>
          </div>
        </div>

        <div className="px-6 mt-6">
          <h3 className="text-white font-bold text-lg mb-4">Ruta de Aprendizaje</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-surface-dark rounded-2xl border border-white/5">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                <span className="material-symbols-outlined">waving_hand</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">Básicos: Saludos</p>
                <div className="mt-1 h-1 w-full bg-background-dark rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '100%' }}></div>
                </div>
              </div>
              <span className="material-symbols-outlined text-emerald-500">check_circle</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
