import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof lightColors;
};

export const lightColors = {
  background: '#F0F4F8',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: '#E2E8F0',
  text: '#1A202C',
  textSecondary: '#718096',
  textMuted: '#A0AEC0',
  accent: '#2563EB',
  accentLight: '#EFF6FF',
  accentDark: '#1D4ED8',
  header: '#1E3A5F',
  headerText: '#FFFFFF',
  success: '#16A34A',
  successLight: '#F0FDF4',
  warning: '#D97706',
  totalBg: '#1E3A5F',
  totalText: '#FFFFFF',
  coinBadgeBg: '#EFF6FF',
  coinBadgeText: '#1E40AF',
  cardShadow: 'rgba(0,0,0,0.06)',
  inputBg: '#F7FAFC',
  modalOverlay: 'rgba(0,0,0,0.5)',
  destructive: '#DC2626',
  destructiveLight: '#FEF2F2',
};

export const darkColors: typeof lightColors = {
  background: '#0F172A',
  surface: '#1E293B',
  surfaceElevated: '#263348',
  border: '#334155',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  accent: '#3B82F6',
  accentLight: '#1E3A5F',
  accentDark: '#2563EB',
  header: '#0F172A',
  headerText: '#F1F5F9',
  success: '#22C55E',
  successLight: '#052E16',
  warning: '#F59E0B',
  totalBg: '#1E3A5F',
  totalText: '#FFFFFF',
  coinBadgeBg: '#1E3A5F',
  coinBadgeText: '#93C5FD',
  cardShadow: 'rgba(0,0,0,0.3)',
  inputBg: '#0F172A',
  modalOverlay: 'rgba(0,0,0,0.7)',
  destructive: '#EF4444',
  destructiveLight: '#450A0A',
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  colors: lightColors,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState<Theme>(systemScheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }: { colorScheme: ColorSchemeName }) => {
      setTheme(colorScheme === 'dark' ? 'dark' : 'light');
    });
    return () => sub.remove();
  }, []);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
