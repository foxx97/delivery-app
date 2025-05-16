import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Calendar, BarChart2, Settings } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = useThemeColor();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
        },
        headerStyle: {
          backgroundColor: colors.headerBackground,
        },
        headerTintColor: colors.text,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ημερήσια Παρακολούθηση',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
          headerTitle: 'Ημερήσια Παρακολούθηση Παραδόσεων',
        }}
      />
      <Tabs.Screen
        name="monthly"
        options={{
          title: 'Μηνιαία',
          tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} />,
          headerTitle: 'Μηνιαία Σύνοψη',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ρυθμίσεις',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          headerTitle: 'Ρυθμίσεις',
        }}
      />
    </Tabs>
  );
}