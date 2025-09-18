import { theme, type Theme } from '@/styles/theme';

// Hook to access theme values in React components
export const useTheme = () => {
  return {
    theme,
    colors: theme,
    
    // Helper functions for common color operations
    getColor: (path: string) => {
      return path.split('.').reduce((obj: any, key) => obj?.[key], theme);
    },
    
    // Generate Tailwind classes from theme values
    getTailwindClass: (colorPath: string, property: 'bg' | 'text' | 'border' | 'shadow' = 'bg') => {
      const color = colorPath.split('.').reduce((obj: any, key) => obj?.[key], theme);
      if (typeof color === 'string' && color.startsWith('#')) {
        return `${property}-[${color}]`;
      }
      return '';
    },
    
    // Get CSS variable
    getCSSVar: (varName: string) => `var(--${varName})`,
  };
};

// Helper function to convert hex to RGB for Tailwind arbitrary values
export const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `${r} ${g} ${b}`;
};

export default useTheme;
