
import React from 'react';
import { Screen } from '../types';

interface NavbarProps {
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentScreen, navigate }) => {
  const navItems = [
    { id: 'home', label: 'Inicio', icon: 'dashboard' },
    { id: 'verboteca', label: 'Aprender', icon: 'school' },
    { id: 'scenarios', label: 'Escenarios', icon: 'chat_bubble' },
    { id: 'progress', label: 'Perfil', icon: 'person' },
  ];

  return (
    <nav className="absolute bottom-0 w-full bg-[#152a23]/95 backdrop-blur-md border-t border-white/5 pb-6 pt-3 z-30">
      <div className="flex items-center justify-around px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.id as Screen)}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${
              currentScreen === item.id || (item.id === 'scenarios' && currentScreen === 'scenarios') 
                ? 'text-primary' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span 
              className="material-symbols-outlined text-[24px]"
              style={currentScreen === item.id ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-medium">{item.label}</span>
            {currentScreen === item.id && (
              <div className="absolute top-0 w-8 h-[2px] bg-primary rounded-b-full shadow-[0_0_10px_rgba(19,236,164,0.8)]"></div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
