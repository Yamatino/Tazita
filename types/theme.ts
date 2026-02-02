export type Theme = 'pompompurin' | 'cinnamoroll' | 'hellokitty' | 'kuromi' | 'keroppi';

export interface ThemeConfig {
  id: Theme;
  name: string;
  emoji: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'pompompurin',
    name: 'Pompompurin',
    emoji: '🍮',
    colors: {
      primary: '#FFE4A1',
      secondary: '#FFD1DC',
      background: '#FFF8E7',
      text: '#5C4A3A',
      accent: '#D4A574'
    }
  },
  {
    id: 'cinnamoroll',
    name: 'Cinnamoroll',
    emoji: '☁️',
    colors: {
      primary: '#A8D8EA',
      secondary: '#FFE4E1',
      background: '#F0F8FF',
      text: '#4A5568',
      accent: '#7FB3D5'
    }
  },
  {
    id: 'hellokitty',
    name: 'Hello Kitty',
    emoji: '🎀',
    colors: {
      primary: '#FF6B6B',
      secondary: '#FFB6C1',
      background: '#FFF0F5',
      text: '#8B0000',
      accent: '#FF8E8E'
    }
  },
  {
    id: 'kuromi',
    name: 'Kuromi',
    emoji: '😈',
    colors: {
      primary: '#9B59B6',
      secondary: '#FF69B4',
      background: '#F8F0FF',
      text: '#2D1B4E',
      accent: '#BB8FCE'
    }
  },
  {
    id: 'keroppi',
    name: 'Keroppi',
    emoji: '🐸',
    colors: {
      primary: '#2ECC71',
      secondary: '#95E1D3',
      background: '#F0FFF4',
      text: '#1E5128',
      accent: '#58D68D'
    }
  }
];

export function getThemeConfig(theme: Theme): ThemeConfig {
  return THEMES.find(t => t.id === theme) || THEMES[0];
}
