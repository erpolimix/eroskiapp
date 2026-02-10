
import React, { useState } from 'react';
import { Screen, User, Scenario } from './types';
import Dashboard from './components/Dashboard';
import ScenariosList from './components/ScenariosList';
import ChatSession from './components/ChatSession';
import Progress from './components/Progress';
import Verboteca from './components/Verboteca';
import GrammarView from './components/GrammarView';
import ExerciseMatch from './components/ExerciseMatch';
import ExerciseOrder from './components/ExerciseOrder';
import Navbar from './components/Navbar';
import VerbBuilder from './components/VerbBuilder';
import Login from './components/Login';
import MapScreen from './components/MapScreen';
import { supabase } from './lib/supabase';
import { getUserProfile } from './logic/userService';
import { useEffect } from 'react';

const INITIAL_USER: User = {
  name: 'Invitado',
  xp: 0,
  streak: 0,
  level: 1,
  avatar: ''
};

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        getUserProfile(session.user.id).then((profile) => {
          if (profile) setUser(profile);
        });
        setCurrentScreen('home');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        getUserProfile(session.user.id).then((profile) => {
          if (profile) setUser(profile);
        });
        setCurrentScreen('home');
      } else {
        setCurrentScreen('login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const navigate = (screen: Screen, scenario?: Scenario) => {
    if (scenario) setActiveScenario(scenario);
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Dashboard user={user} navigate={navigate} />;
      case 'scenarios':
        return <ScenariosList navigate={navigate} />;
      case 'chat':
        return activeScenario ? (
          <ChatSession scenario={activeScenario} navigate={navigate} onXpGain={(amt) => setUser(prev => ({ ...prev, xp: prev.xp + amt }))} />
        ) : <ScenariosList navigate={navigate} />;
      case 'progress':
        return <Progress user={user} navigate={navigate} />;
      case 'verboteca':
        return <Verboteca navigate={navigate} />;
      case 'grammar':
        return <GrammarView navigate={navigate} />;
      case 'exercise_match':
        return <ExerciseMatch navigate={navigate} />;
      case 'exercise_order':
        return <ExerciseOrder navigate={navigate} />;
      case 'builder':
        return <VerbBuilder navigate={navigate} />;
      case 'login':
        return <Login onLoginSuccess={() => navigate('home')} />;
      case 'map':
        return <MapScreen user={user} navigate={navigate} />;
      default:
        return <Dashboard user={user} navigate={navigate} />;
    }
  };

  return (
    <div className="mx-auto flex h-screen w-full max-w-md flex-col overflow-hidden bg-background-dark shadow-2xl relative border-x border-white/5 font-display">
      {renderScreen()}
      {!['chat', 'exercise_match', 'exercise_order', 'grammar', 'builder', 'login'].includes(currentScreen) && (
        <Navbar currentScreen={currentScreen} navigate={navigate} />
      )}
    </div>
  );
};

export default App;
