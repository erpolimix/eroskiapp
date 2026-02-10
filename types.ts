
export type Screen = 'home' | 'scenarios' | 'chat' | 'progress' | 'verboteca' | 'grammar' | 'exercise_match' | 'exercise_order' | 'exercise_find' | 'builder' | 'login' | 'map';

export interface User {
  name: string;
  xp: number;
  streak: number;
  level: number;
  avatar: string;
  daily_xp?: number;
  daily_goal?: number;
}

export interface Scenario {
  id: string;
  image: string;
  category: string;
}

export interface VocabularyItem {
  id: string;
  basque: string;
  spanish: string;
  image: string;
  category: string;
}
subtitle: string;
difficulty: 'Easy' | 'Medium' | 'Hard';
difficultyLabel: string;
xp: number;
time: string;
image: string;
category: string;
context: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isCorrect?: boolean;
  feedback?: string;
  translation?: string;
}

export interface Verb {
  basque: string;
  english: string;
  category: 'NOR' | 'NOR-NORK' | 'NOR-NORI';
  mastery: number;
  forms: {
    ni: string;
    hura: string;
    gu: string;
    zuk?: string;
  };
}
