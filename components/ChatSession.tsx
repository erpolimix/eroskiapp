
import { supabase } from '../lib/supabase';
import { saveScenarioProgress, addXp } from '../logic/userService';
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Scenario, Screen, Message } from '../types';

// Ayuda para la decodificación de audio
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, sampleRate);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}

interface ChatSessionProps {
  scenario: Scenario;
  navigate: (screen: Screen) => void;
  onXpGain: (amt: number) => void;
}

const ChatSession: React.FC<ChatSessionProps> = ({ scenario, navigate, onXpGain }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: `Kaixo! Ongi etorri ${scenario.title} eszenatokira. Zer moduz zaude gaur?`,
      translation: `¡Hola! Bienvenido al escenario ${scenario.subtitle}. ¿Cómo estás hoy?`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const speak = async (text: string, msgId: string) => {
    if (isPlaying) return;
    setIsPlaying(msgId);
    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say this naturally in Basque: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), audioCtx, 24000);
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        source.onended = () => setIsPlaying(null);
        source.start();
      } else {
        setIsPlaying(null);
      }
    } catch (e) {
      console.error("Error TTS", e);
      setIsPlaying(null);
    }
  };

  const [evaluation, setEvaluation] = useState<{ score: number; feedback: string; xpEarned: number } | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);

  const handleFinish = async () => {
    if (messages.length < 3) {
      alert("Habla un poco más antes de terminar.");
      return;
    }

    setIsTyping(true);
    try {
      const history = messages.map(m => `${m.role}: ${m.text}`).join('\n');
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        Act as a strict Basque language teacher. Evaluate this conversation between a user and an AI tutor.
        Context: ${scenario.title} (${scenario.context}).
        
        Conversation:
        ${history}

        Analyze the User's performance based on:
        1. Grammar correctness (especially verbs and cases).
        2. Vocabulary appropriateness.
        3. Fluency.

        Output ONLY valid JSON:
        {
          "score": (integer 1-5),
          "feedback": "Two sentences of constructive feedback in Spanish.",
          "xp": (integer between 10 and 50 based on performance)
        }
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonStr = text.replace(/```json|```/g, '').trim();
      const evalData = JSON.parse(jsonStr);

      setEvaluation({
        score: evalData.score,
        feedback: evalData.feedback,
        xpEarned: evalData.xp
      });
      setIsEvaluated(true);

      // Save to DB
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await saveScenarioProgress(session.user.id, scenario.id, evalData.score);
        await addXp(session.user.id, evalData.xp);
        onXpGain(evalData.xp);
      }

    } catch (error) {
      console.error("Error evaluating:", error);
      alert("Error al evaluar. Inténtalo de nuevo.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    // ... (rest of function remains same, just ensuring context)
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-1.5-flash',
        config: {
          systemInstruction: `Eres Aitor, un amable tutor de euskera especializado en "Euskera de andar por casa" (festivals, potes, trabajo, ligar). 
          Escenario actual: ${scenario.title}. Contexto: ${scenario.context}. 
          Tu objetivo es ayudar al usuario a practicar frases reales y cotidianas. 
          
          REGLAS CRÍTICAS:
          1. Responde siempre en Euskera Batua pero con tono coloquial (slang vasco permitido como "kaixo aurre", "poteoa", etc).
          2. Al final de tu respuesta, añade SIEMPRE:
             - "Traducción: [TRADUCE EXACTAMENTE LO QUE HAS DICHO EN EUSKERA, NI MÁS NI MENOS]"
             - "Feedback: [Si el usuario cometió un error, corrígelo. Fíjate especialmente en el ERGATIVO (NORK) y el plural del objeto]."
          3. Si el usuario escribe algo creativo pero incorrecto, no lo bloquees, corrígelo amablemente.
          4. Fomenta el uso del sistema modular de verbos (morfemas).
          5. IMPORTANTE: La traducción debe coincidir FRASE A FRASE con el texto en euskera.`
        }
      });

      const response = await chat.sendMessage({ message: inputText });
      const aiText = response.text || "";
      const lines = aiText.split('\n');
      const main = lines[0];
      const trans = lines.find(l => l.toLowerCase().includes('traducción') || l.toLowerCase().includes('translation'))?.replace(/traducción:?|translation:?/i, '').trim() || "";

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: main,
        translation: trans
      }]);
    } catch (error) {
      console.error("Error Gemini", error);
      setIsTyping(false);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background-dark text-white overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 bg-surface-dark/90 backdrop-blur-md border-b border-white/5 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('scenarios')} className="text-gray-400 hover:text-primary">
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">face</span>
          </div>
          <div>
            <h1 className="text-sm font-bold">Aitor (IA)</h1>
            <span className="text-[10px] text-primary animate-pulse">En línea</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleFinish}
            disabled={isTyping || messages.length < 3}
            className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/50 rounded-full text-xs font-bold hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
          >
            TERMINAR
          </button>
          <div className="bg-white/5 px-2 py-1 rounded-full border border-white/5 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-yellow-500 fill">star</span>
            <span className="text-xs font-bold text-gray-300">Nivel 12</span>
          </div>
        </div>
      </header>

      {isEvaluated && evaluation && (
        <div className="absolute inset-0 z-50 bg-background-dark/95 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
          <div className="w-full max-w-sm bg-surface-dark border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4 text-4xl animate-bounce">
              🎉
            </div>
            <h2 className="text-2xl font-black text-white mb-2">¡Escenario Completado!</h2>
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`material-symbols-outlined text-2xl ${i < evaluation.score ? 'text-yellow-500 fill' : 'text-gray-600'}`}>star</span>
              ))}
            </div>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">"{evaluation.feedback}"</p>
            <div className="bg-white/5 rounded-xl px-4 py-2 mb-6 border border-white/5">
              <span className="text-primary font-black text-xl">+{evaluation.xpEarned} XP</span>
            </div>
            <button
              onClick={() => navigate('scenarios')}
              className="w-full py-3 bg-primary text-background-dark rounded-xl font-bold uppercase hover:brightness-110 active:scale-95 transition-all"
            >
              Volver al Mapa
            </button>
          </div>
        </div>
      )}

      <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`flex gap-2 items-end max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-background-dark font-semibold' : 'bg-surface-dark border border-white/5'
                }`}>
                <p className="text-[15px]">{msg.text}</p>
              </div>
              {msg.role === 'model' && (
                <button
                  onClick={() => speak(msg.text, msg.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isPlaying === msg.id ? 'bg-primary text-background-dark' : 'bg-surface-dark text-primary hover:bg-surface-dark-hover border border-white/5'
                    }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isPlaying === msg.id ? 'graphic_eq' : 'volume_up'}
                  </span>
                </button>
              )}
            </div>
            {msg.translation && (
              <p className="mt-1 text-[11px] text-gray-500 italic px-1">{msg.translation}</p>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2 items-center p-2 opacity-50">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </main>

      <footer className="p-4 bg-surface-dark/50 backdrop-blur-xl border-t border-white/5 pb-8">
        <div className="flex gap-2">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe en euskera..."
            className="flex-1 bg-background-dark border-none rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSendMessage}
            className="w-12 h-12 rounded-2xl bg-primary text-background-dark flex items-center justify-center shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatSession;
