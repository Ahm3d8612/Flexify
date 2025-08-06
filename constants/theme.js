const baseColors = {
  blue: {
    primary: '#007AFF',
    secondary: '#005BBB',
  },
  green: {
    primary: '#34C759',
    secondary: '#248A3D',
  },
  purple: {
    primary: '#AF52DE',
    secondary: '#8E44AD',
  },
  orange: {
    primary: '#FF9500',
    secondary: '#CC7A00',
  },
};

const getTheme = (colorTheme = 'blue', isDarkMode = false) => {
  const selected = baseColors[colorTheme] || baseColors.blue;

  return {
    colors: {
      primary: selected.primary,
      secondary: selected.secondary,
      background: isDarkMode ? '#121212' : '#FFFFFF',
      card: isDarkMode ? '#1F1F1F' : '#FFFFFF',
      text: isDarkMode ? '#FFFFFF' : '#000000',
      border: isDarkMode ? '#272727' : '#DDDDDD',
      error: '#FF3B30',
    },
    fonts: {
      title: 24,
      subtitle: 18,
      text: 16,
    },
  };
};

export default getTheme;
