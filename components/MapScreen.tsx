
import React from 'react';
import { Screen, User } from '../types';

interface MapScreenProps {
    navigate: (screen: Screen) => void;
    user: User;
}

const REGIONS = [
    { id: 'bizkaia', name: 'Bizkaia', level: 1, unlocked: true, path: "M100,100 L150,80 L200,100 L220,150 L180,180 L120,160 Z", cx: 160, cy: 130 },
    { id: 'gipuzkoa', name: 'Gipuzkoa', level: 5, unlocked: false, path: "M200,100 L280,90 L320,130 L280,180 L220,150 Z", cx: 260, cy: 130 },
    { id: 'araba', name: 'Araba', level: 10, unlocked: false, path: "M120,160 L180,180 L280,180 L260,250 L160,260 Z", cx: 200, cy: 210 },
    { id: 'lapurdi', name: 'Lapurdi', level: 15, unlocked: false, path: "M280,90 L340,60 L380,80 L320,130 Z", cx: 330, cy: 90 },
    { id: 'nafarroa', name: 'Nafarroa', level: 20, unlocked: false, path: "M280,180 L320,130 L380,80 L420,120 L400,220 L320,240 L260,250 Z", cx: 340, cy: 180 },
];

const MapScreen: React.FC<MapScreenProps> = ({ navigate, user }) => {
    return (
        <div className="flex-1 flex flex-col bg-background-dark overflow-hidden font-display relative">
            <header className="absolute top-0 left-0 right-0 p-6 pt-12 flex items-center justify-between z-20 pointer-events-none">
                <button onClick={() => navigate('home')} className="p-2 bg-surface-dark/80 backdrop-blur rounded-full text-white pointer-events-auto">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="bg-surface-dark/80 backdrop-blur px-4 py-2 rounded-full border border-white/10 pointer-events-auto flex items-center gap-2">
                    <span className="material-symbols-outlined text-yellow-500 fill text-sm">star</span>
                    <span className="text-xs font-bold text-white">Nivel {user.level}</span>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center relative overflow-hidden">
                {/* Background visual */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#10221c] to-[#0a1612]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative w-full max-w-md aspect-square p-4">
                    <svg viewBox="0 0 500 400" className="w-full h-full drop-shadow-2xl">
                        <defs>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="5" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />

                        {REGIONS.map((region) => {
                            const isUnlocked = user.level >= region.level;
                            return (
                                <g key={region.id} className="group cursor-pointer transition-all duration-300"
                                    onClick={() => isUnlocked && navigate('scenarios')}
                                >
                                    <path
                                        d={region.path}
                                        fill={isUnlocked ? (region.id === 'bizkaia' ? '#13eca4' : '#19332b') : '#0f1a16'}
                                        stroke={isUnlocked ? '#13eca4' : '#334155'}
                                        strokeWidth={isUnlocked ? 2 : 1}
                                        className={`transition-all duration-300 ${isUnlocked ? 'hover:fill-primary/80 hover:filter' : 'opacity-50'}`}
                                        style={{ filter: isUnlocked ? 'drop-shadow(0 0 10px rgba(19, 236, 164, 0.2))' : 'none' }}
                                    />

                                    {/* Label / Marker */}
                                    <foreignObject x={region.cx - 40} y={region.cy - 20} width="80" height="40">
                                        <div className={`flex flex-col items-center justify-center text-center transition-all ${isUnlocked ? 'opacity-100' : 'opacity-40'}`}>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>{region.name}</span>
                                            {!isUnlocked && (
                                                <div className="flex items-center gap-1 text-[8px] text-gray-500 bg-black/40 px-1.5 py-0.5 rounded mt-1">
                                                    <span className="material-symbols-outlined text-[8px]">lock</span>
                                                    Lvl {region.level}
                                                </div>
                                            )}
                                        </div>
                                    </foreignObject>
                                </g>
                            );
                        })}
                    </svg>

                    <div className="absolute bottom-8 left-0 right-0 text-center">
                        <h2 className="text-2xl font-black text-white italic tracking-tighter">EUSKAL HERRIA</h2>
                        <p className="text-xs text-gray-400 font-medium tracking-widest uppercase mt-1">Conquista el territorio</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MapScreen;
