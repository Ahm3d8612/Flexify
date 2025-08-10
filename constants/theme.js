// constants/theme.js
export default function getTheme(accent = 'blue', dark = false) {
  const accents = {
    blue:   '#007AFF',
    green:  '#2ecc71',
    purple: '#8e44ad',
    orange: '#f39c12',
  };
  const primary = accents[accent] || accents.blue;

  return dark
    ? {
        colors: {
          primary,
          background: '#0b1015',
          card: '#111827',
          text: '#e5e7eb',
          border: '#1f2937',
        },
      }
    : {
        colors: {
          primary,
          background: '#f9fafb',
          card: '#ffffff',
          text: '#111827',
          border: '#e5e7eb',
        },
      };
}
