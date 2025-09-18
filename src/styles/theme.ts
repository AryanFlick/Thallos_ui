// Theme Configuration for Thallos UI
// This file centralizes all color definitions for easy theme management

export const theme = {
  // Primary Brand Colors
  primary: {
    50: '#f0fdf4',   // Very light green
    100: '#dcfce7',  // Light green
    200: '#bbf7d0',  // Lighter green
    300: '#86efac',  // Light green
    400: '#4ade80',  // Medium light green
    500: '#22c55e',  // Base green
    600: '#16a34a',  // Medium dark green
    700: '#15803d',  // Dark green
    800: '#166534',  // Darker green
    900: '#14532d',  // Very dark green
    950: '#052e16',  // Deepest green
  },

  // Background Colors
  background: {
    primary: '#000000',      // Pure black
    secondary: '#0a0a0a',    // Very dark gray
    tertiary: '#1a1a1a',    // Dark gray
    card: '#111111',        // Card background
    overlay: '#000000cc',    // Black with opacity
  },

  // Text Colors
  text: {
    primary: '#ffffff',      // White
    secondary: '#e5e5e5',    // Light gray
    tertiary: '#a3a3a3',    // Medium gray
    muted: '#737373',       // Darker gray
    accent: '#86efac',      // Light green accent
  },

  // Border Colors
  border: {
    primary: '#262626',      // Dark border
    secondary: '#404040',    // Medium border
    accent: '#16a34a40',    // Green border with opacity
    glass: '#ffffff20',     // Glassmorphic border
  },

  // Component-specific Colors
  hero: {
    // Main heading gradient
    headingFrom: '#ffffff80',  // White with 80% opacity
    headingTo: '#ffffff20',    // White with 20% opacity
    
    // Accent text
    accent: '#86efac',         // Light green
    
    // Subheading
    subheading: '#d1d5db',     // Light gray
    
    // Primary CTA Button
    ctaPrimary: {
      from: '#166534cc',       // Dark green with opacity
      to: '#15803dcc',         // Darker green with opacity
      border: '#16a34a33',     // Green border
      shadow: '#052e1680',     // Very dark green shadow
      hoverFrom: '#15803de6',  // Hover state
      hoverTo: '#16a34ae6',    // Hover state
    },
    
    // Secondary CTA Button
    ctaSecondary: {
      bg: '#052e164d',         // Very dark green background
      border: '#14532d80',     // Dark green border
      text: '#86efac',         // Light green text
      hoverBg: '#052e1680',    // Hover background
      hoverBorder: '#166534b3', // Hover border
      hoverText: '#bbf7d0',    // Hover text
    },
  },

  // Navbar Colors
  navbar: {
    // Background
    bg: '#ffffff10',           // White with low opacity
    backdrop: 'backdrop-blur-2xl',
    border: '#ffffff20',       // White border with opacity
    
    // Logo
    logo: {
      from: '#22c55e',         // Base green
      via: '#4ade80',          // Medium light green
      to: '#22c55e',           // Base green
      hoverFrom: '#4ade80',    // Hover state
      hoverVia: '#86efac',     // Hover state
      hoverTo: '#4ade80',      // Hover state
      glow: '#15803d33',       // Glow effect
    },
    
    // Navigation links
    nav: {
      text: '#ffffff',         // White text
      hover: '#ffffff',        // Hover text
      underline: '#16a34a',    // Underline color
      underlineTo: '#22c55e',  // Underline gradient end
      bg: '#ffffff08',         // Background on hover
    },
    
    // Request Access Button
    cta: {
      from: '#166534cc',       // Dark green
      to: '#15803dcc',         // Darker green
      border: '#16a34a33',     // Border
      shadow: '#052e164d',     // Shadow
      hoverFrom: '#15803de6',  // Hover from
      hoverTo: '#16a34ae6',    // Hover to
      glow: '#15803d33',       // Glow effect
    },
    
    // Mobile menu
    mobile: {
      hover: '#22c55e',        // Mobile button hover
    },
    
    // Floating indicator
    indicator: {
      from: '#15803d',         // Gradient start
      via: '#22c55e',          // Gradient middle
      to: '#15803d',           // Gradient end
      dot: '#22c55e',          // Center dot
    },
  },

  // Ripple Effect Colors
  ripple: {
    border: '#4b5563',         // Gray border for grid
    fill: '#000000',           // Black fill for cells
    shadow: '#22c55e',         // Bright green for ripple effect
  },

  // Chat Interface Colors
  chat: {
    background: '#000000',     // Pure black
    message: {
      user: '#1f2937',         // Dark gray for user messages
      assistant: '#111827',    // Darker gray for assistant
      border: '#374151',       // Border color
    },
    input: {
      bg: '#1f2937',          // Input background
      border: '#374151',       // Input border
      focus: '#22c55e',        // Focus color
    },
  },

  // Animation and Effects
  effects: {
    blur: 'backdrop-blur-xl',
    shadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      green: '0 10px 15px -3px rgb(5 46 22 / 0.3)',
    },
    transition: {
      fast: 'transition-all duration-150',
      normal: 'transition-all duration-300',
      slow: 'transition-all duration-500',
    },
  },
} as const;

// Helper function to get theme colors with TypeScript support
export const getThemeColor = (path: string): unknown => {
  return path.split('.').reduce((obj: Record<string, unknown>, key) => obj?.[key] as Record<string, unknown>, theme as Record<string, unknown>);
};

// CSS Custom Properties for dynamic theming
export const cssVariables = {
  '--color-primary': theme.primary[500],
  '--color-primary-dark': theme.primary[700],
  '--color-background': theme.background.primary,
  '--color-text': theme.text.primary,
  '--color-border': theme.border.primary,
  '--ripple-shadow': theme.ripple.shadow,
} as const;

export type Theme = typeof theme;
