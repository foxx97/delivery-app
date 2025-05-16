import { useColorScheme } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

export type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  headerBackground: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  tabIconDefault: string;
  tabBar: string;
  buttonText: string;
  inputBackground: string;
  shadow: string;
  cashTip: string;
  prepaidTip: string;
};

const LightTheme: ThemeColors = {
  primary: '#3366FF', // Blue
  secondary: '#0F9D58', // Green
  accent: '#FF5252', // Red-accent
  success: '#4CAF50', // Green
  warning: '#FFC107', // Amber
  error: '#F44336', // Red
  background: '#F5F7FA',
  headerBackground: '#3366FF',
  card: '#FFFFFF',
  text: '#333333',
  textSecondary: '#757575',
  border: '#E0E0E0',
  tabIconDefault: '#888888',
  tabBar: '#FFFFFF',
  buttonText: '#FFFFFF',
  inputBackground: '#F0F0F0',
  shadow: 'rgba(0, 0, 0, 0.1)',
  cashTip: '#8BC34A', // Light green
  prepaidTip: '#03A9F4', // Light blue
};

const DarkTheme: ThemeColors = {
  primary: '#5C7CFA', // Lighter blue
  secondary: '#26A69A', // Teal
  accent: '#FF7B7B', // Lighter red-accent
  success: '#66BB6A', // Green
  warning: '#FFCA28', // Amber
  error: '#EF5350', // Red
  background: '#121212',
  headerBackground: '#1E1E1E',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#333333',
  tabIconDefault: '#888888',
  tabBar: '#1E1E1E',
  buttonText: '#FFFFFF',
  inputBackground: '#2C2C2C',
  shadow: 'rgba(0, 0, 0, 0.5)',
  cashTip: '#689F38', // Darker green
  prepaidTip: '#0288D1', // Darker blue
};

export function useThemeColor(): ThemeColors {
  const systemColorScheme = useColorScheme();
  const { theme } = useContext(ThemeContext);
  
  // Use user's preference first, fall back to system
  const colorScheme = theme === 'system' ? systemColorScheme || 'light' : theme;
  
  return colorScheme === 'dark' ? DarkTheme : LightTheme;
}