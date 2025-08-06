// app/tabs/_layout.js
import { Tabs } from 'expo-router';
import { useThemeContext } from '../context/ThemeContext';
import getTheme from '../../constants/theme';

export default function TabsLayout() {
  const { isDarkMode, colorTheme } = useThemeContext();
  const theme = getTheme(colorTheme, isDarkMode);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: { fontSize: 14 },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="routines" options={{ title: 'Routines' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
      <Tabs.Screen name="predefined" options={{ title: 'Exercises' }} />
    </Tabs>
  );
}
