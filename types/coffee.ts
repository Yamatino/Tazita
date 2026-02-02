export type CoffeeType = 
  | 'instantaneo' 
  | 'capsula' 
  | 'expresso' 
  | 'especialidad' 
  | 'cafe_frio' 
  | 'starbucks'
  | 'filtrado';

export interface CoffeeEntry {
  id: string;
  type: CoffeeType;
  timestamp: string;
  notes?: string;
  date: string; // YYYY-MM-DD format for the coffee date
}

export interface CoffeeData {
  entries: CoffeeEntry[];
  username: string;
  createdAt: string;
}

export interface CoffeeTypeInfo {
  id: CoffeeType;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

export type Theme = 'pompompurin' | 'cinnamoroll' | 'hello_kitty' | 'kuromi' | 'keroppi';

export interface ThemeConfig {
  id: Theme;
  name: string;
  emoji: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
  border: string;
  muted: string;
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'pompompurin',
    name: 'Pompompurin',
    emoji: '🍮',
    primary: '#FFE4A1',
    secondary: '#FFD1DC',
    background: '#FFF8E7',
    text: '#5C4A3A',
    accent: '#D4A574',
    border: '#E8DCC8',
    muted: '#F5EDE0'
  },
  {
    id: 'cinnamoroll',
    name: 'Cinnamoroll',
    emoji: '☁️',
    primary: '#A8D8EA',
    secondary: '#FFE4E1',
    background: '#F0F8FF',
    text: '#4A5568',
    accent: '#7FB3D5',
    border: '#D4E6F1',
    muted: '#E8F4F8'
  },
  {
    id: 'hello_kitty',
    name: 'Hello Kitty',
    emoji: '🎀',
    primary: '#FF6B6B',
    secondary: '#FFB6C1',
    background: '#FFF0F5',
    text: '#8B0000',
    accent: '#FF4757',
    border: '#FFD1DC',
    muted: '#FFE4E1'
  },
  {
    id: 'kuromi',
    name: 'Kuromi',
    emoji: '🖤',
    primary: '#9B59B6',
    secondary: '#FF69B4',
    background: '#F8F0FF',
    text: '#2D1B4E',
    accent: '#8E44AD',
    border: '#E8DAEF',
    muted: '#F0E6F5'
  },
  {
    id: 'keroppi',
    name: 'Keroppi',
    emoji: '🐸',
    primary: '#2ECC71',
    secondary: '#95E1D3',
    background: '#F0FFF4',
    text: '#1E5128',
    accent: '#27AE60',
    border: '#D5F5E3',
    muted: '#E8F8F5'
  }
];

export const COFFEE_TYPES: CoffeeTypeInfo[] = [
  {
    id: 'instantaneo',
    name: 'Instantáneo',
    emoji: '☕',
    color: '#D4A574',
    description: 'Café soluble rápido'
  },
  {
    id: 'capsula',
    name: 'Cápsula',
    emoji: '💊',
    color: '#8B6F47',
    description: 'Nespresso, Dolce Gusto, etc.'
  },
  {
    id: 'expresso',
    name: 'Expresso',
    emoji: '☕',
    color: '#5C4A3A',
    description: 'Café expresso tradicional'
  },
  {
    id: 'especialidad',
    name: 'Especialidad',
    emoji: '✨',
    color: '#FFD1DC',
    description: 'Café de especialidad, V60, Chemex'
  },
  {
    id: 'cafe_frio',
    name: 'Café Frío',
    emoji: '🧊',
    color: '#A8D8EA',
    description: 'Cold brew, iced coffee'
  },
  {
    id: 'starbucks',
    name: 'Starbucks',
    emoji: '🥤',
    color: '#00704A',
    description: 'Cualquier bebida de Starbucks'
  },
  {
    id: 'filtrado',
    name: 'Café Filtrado',
    emoji: '🫗',
    color: '#C4A77D',
    description: 'V60, Chemex, Kalita, etc.'
  }
];

export function getCoffeeTypeInfo(type: CoffeeType): CoffeeTypeInfo {
  return COFFEE_TYPES.find(ct => ct.id === type) || COFFEE_TYPES[0];
}

export function getThemeConfig(theme: Theme): ThemeConfig {
  return THEMES.find(t => t.id === theme) || THEMES[0];
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
