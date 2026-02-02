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

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
