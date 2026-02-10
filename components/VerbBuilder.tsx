
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';
import { Screen } from '../types';
import { MORPHEMES, Morpheme, assembleVerb } from '../logic/verbEngine';

interface VerbBuilderProps {
    navigate: (screen: Screen) => void;
}

const VerbBuilder: React.FC<VerbBuilderProps> = ({ navigate }) => {
    const [selectedMorphemes, setSelectedMorphemes] = useState<Morpheme[]>([]);
    const [assembledVerb, setAssembledVerb] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);

    // Available morphemes for the level (A1 simple transitives)
    const availableMorphemes = [
        MORPHEMES['hark_prefix'],
        MORPHEMES['plural_obj'],
        MORPHEMES['root_ukan'],
        MORPHEMES['nik_suffix'],
        MORPHEMES['guk_suffix'],
        MORPHEMES['zuk_suffix'],
    ];

    const [playPop] = useSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', { volume: 0.5 });
    const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', { volume: 0.5 });
    const [playError] = useSound('https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', { volume: 0.5 });

    useEffect(() => {
        if (selectedMorphemes.length > 0) {
            setAssembledVerb(assembleVerb(selectedMorphemes));
        } else {
            setAssembledVerb('');
        }
    }, [selectedMorphemes]);

    const addMorpheme = (m: Morpheme) => {
        playPop();
        setSelectedMorphemes([...selectedMorphemes, m]);
    };

    const removeMorpheme = (index: number) => {
        playPop();
        const newArr = [...selectedMorphemes];
        newArr.splice(index, 1);
        setSelectedMorphemes(newArr);
    };

    const clear = () => {
        playError();
        setSelectedMorphemes([]);
        setFeedback(null);
    };

    const validate = () => {
        if (assembledVerb) {
            playSuccess();
            // TODO: Add real validation logic against a dictionary
        } else {
            playError();
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-background-dark overflow-hidden font-display">
            <header className="flex-none p-6 pt-12 flex items-center justify-between z-20">
                <button onClick={() => navigate('home')} className="p-2 bg-surface-dark rounded-full text-white">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-xl font-black text-white tracking-tight italic">Aditz-Eraikitzailea</h1>
                <div className="w-10"></div>
            </header>

            <main className="flex-1 overflow-y-auto px-6 pb-24 flex flex-col">
                {/* Character / Mnemonic Area */}
                <div className="h-48 flex items-center justify-center relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl"></div>

                    <AnimatePresence mode="wait">
                        {selectedMorphemes.some(m => m.id === 'nik_suffix' || m.id === 'nik_prefix') ? (
                            <motion.div
                                initial={{ scale: 0, opacity: 0, rotate: -20 }}
                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="flex flex-col items-center gap-2"
                            >
                                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary shadow-[0_0_30px_rgba(19,236,164,0.3)]">
                                    <span className="material-symbols-outlined text-5xl text-primary font-black">construction</span>
                                </div>
                                <span className="text-primary font-black text-sm uppercase tracking-widest">NORK el Constructor</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-gray-500 text-sm font-medium italic text-center max-w-[200px]"
                            >
                                Selecciona piezas para empezar a construir...
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Assembly Slot */}
                <div className="bg-surface-dark/50 border-2 border-dashed border-white/10 rounded-3xl p-6 mb-8 flex flex-col items-center gap-4 min-h-[120px]">
                    <div className="flex flex-wrap justify-center gap-2">
                        <AnimatePresence>
                            {selectedMorphemes.map((m, idx) => (
                                <motion.button
                                    key={`${m.id}-${idx}`}
                                    layout
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    onClick={() => removeMorpheme(idx)}
                                    className="h-14 px-4 bg-primary text-background-dark rounded-xl font-black text-2xl flex items-center justify-center shadow-lg shadow-primary/20 border-b-4 border-primary-dark active:border-b-0 active:translate-y-1 transition-all"
                                >
                                    {m.text}
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>

                    {assembledVerb && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-center"
                        >
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Verbo Resultante</span>
                            <h2 className="text-4xl font-black text-white tracking-widest">{assembledVerb}</h2>
                        </motion.div>
                    )}
                </div>

                {/* Available Pieces */}
                <div className="grid grid-cols-2 gap-3">
                    {availableMorphemes.map(m => (
                        <button
                            key={m.id}
                            onClick={() => addMorpheme(m)}
                            className="bg-surface-dark border border-white/5 p-4 rounded-2xl flex flex-col items-start gap-1 group hover:border-primary/50 hover:bg-surface-dark-hover transition-all text-left"
                        >
                            <div className="flex items-center justify-between w-full">
                                <span className="text-2xl font-black text-white">{m.text}</span>
                                <span className="material-symbols-outlined text-gray-600 group-hover:text-primary transition-colors">add_circle</span>
                            </div>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{m.label}</span>
                        </button>
                    ))}
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-dark via-background-dark to-transparent z-30">
                <div className="max-w-md mx-auto flex gap-3">
                    <button
                        onClick={clear}
                        className="flex-none w-14 h-14 bg-surface-dark text-gray-400 rounded-2xl flex items-center justify-center active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                    <button
                        onClick={validate}
                        className="flex-1 bg-primary text-background-dark font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                    >
                        Validar Construcción
                        <span className="material-symbols-outlined">check_circle</span>
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default VerbBuilder;
