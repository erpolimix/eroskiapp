
import React from 'react';
import { signInWithGoogle } from '../lib/supabase';

interface LoginProps {
    onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const handleGoogleLogin = async () => {
        const { error } = await signInWithGoogle();
        if (error) {
            console.error('Error logging in:', error.message);
            // For demo purposes, we might want to skip if it fails due to no URL/Keys
            onLoginSuccess();
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-background-dark p-8 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-glow"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-accent-blue/10 rounded-full blur-[100px] animate-glow" style={{ animationDelay: '1.5s' }}></div>

            <div className="z-10 flex flex-col items-center w-full max-w-xs text-center">
                <div className="w-24 h-24 mb-8 relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-3xl rotate-12 blur-sm"></div>
                    <div className="absolute inset-0 bg-surface-dark border-2 border-primary/50 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/20">
                        <span className="material-symbols-outlined text-5xl text-primary font-black">architecture</span>
                    </div>
                </div>

                <h1 className="text-4xl font-black text-white mb-2 tracking-tighter italic">Aditz-<span className="text-primary">Eraikitzailea</span></h1>
                <p className="text-gray-400 text-sm mb-12 font-medium">Aprende el sistema verbal del euskera como nunca antes.</p>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-gray-100 transition-all active:scale-95 shadow-xl shadow-white/5 mb-4"
                >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                    Continuar con Google
                </button>

                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest leading-relaxed">
                    Al continuar, aceptas nuestras políticas de privacidad y seguridad.
                </p>
            </div>

            <div className="absolute bottom-8 text-primary/30 font-black text-[100px] whitespace-nowrap pointer-events-none select-none italic tracking-tighter opacity-20">
                EUSKARA BATUA 2026
            </div>
        </div>
    );
};

export default Login;
