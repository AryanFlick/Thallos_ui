# 🎨 Thallos Theme System

## Overview
The Thallos UI now uses a centralized theme system that makes it incredibly easy to change colors throughout the entire application. All colors are defined in one place and can be modified instantly.

## 📁 File Structure
```
src/
├── styles/
│   └── theme.ts          # Main theme configuration
├── hooks/
│   └── useTheme.ts       # React hook for theme access
└── components/
    └── Home/
        └── Hero.tsx      # Example of theme usage
```

## 🚀 Quick Start

### Changing Colors
To change the entire color scheme, simply edit `/src/styles/theme.ts`:

```typescript
// Change primary green to blue
primary: {
  500: '#3b82f6',  // Blue instead of green
  600: '#2563eb',
  700: '#1d4ed8',
  // ... etc
}

// Change hero accent color
hero: {
  accent: '#60a5fa',  // Light blue
  // ... etc
}
```

### Using Theme in Components
```tsx
import { theme } from '@/styles/theme';

export default function MyComponent() {
  // Method 1: Direct theme access
  const colors = {
    primary: theme.primary[500],
    accent: theme.hero.accent,
  };

  return (
    <div style={{ backgroundColor: colors.primary }}>
      <span style={{ color: colors.accent }}>Themed text</span>
    </div>
  );
}
```

## 🎯 Theme Structure

### Primary Colors
```typescript
primary: {
  50: '#f0fdf4',   // Lightest
  500: '#22c55e',  // Base color
  950: '#052e16',  // Darkest
}
```

### Hero Section Colors
```typescript
hero: {
  // Main heading gradient
  headingFrom: '#ffffff80',
  headingTo: '#ffffff20',
  
  // Accent text
  accent: '#86efac',
  
  // CTA buttons
  ctaPrimary: { /* ... */ },
  ctaSecondary: { /* ... */ },
}
```

### Navbar Colors
```typescript
navbar: {
  // Logo gradient
  logo: {
    from: '#22c55e',
    via: '#4ade80',
    to: '#22c55e',
  },
  
  // CTA button
  cta: { /* ... */ },
}
```

### Ripple Effect Colors
```typescript
ripple: {
  border: '#4b5563',    // Grid lines
  fill: '#000000',      // Cell background
  shadow: '#22c55e',    // Ripple color
}
```

## 🛠️ Advanced Usage

### Using the Theme Hook
```tsx
import { useTheme } from '@/hooks/useTheme';

export default function MyComponent() {
  const { theme, getColor } = useTheme();
  
  const primaryColor = getColor('primary.500');
  const heroAccent = getColor('hero.accent');
  
  return <div>...</div>;
}
```

### CSS Variables
The theme also exports CSS variables for use in stylesheets:
```css
.my-element {
  background-color: var(--color-primary);
  color: var(--color-text);
}
```

## 🎨 Color Customization Examples

### Change to Purple Theme
```typescript
// In theme.ts
primary: {
  500: '#8b5cf6',  // Purple
  600: '#7c3aed',
  700: '#6d28d9',
}

hero: {
  accent: '#c4b5fd',  // Light purple
}
```

### Change to Orange Theme
```typescript
// In theme.ts
primary: {
  500: '#f97316',  // Orange
  600: '#ea580c',
  700: '#c2410c',
}

hero: {
  accent: '#fdba74',  // Light orange
}
```

## 🔧 Modifying Specific Elements

### Hero Section
Edit `theme.hero` in `/src/styles/theme.ts`:
- `headingFrom/headingTo`: Main heading gradient
- `accent`: Accent text color
- `ctaPrimary`: Primary button colors
- `ctaSecondary`: Secondary button colors

### Navbar
Edit `theme.navbar` in `/src/styles/theme.ts`:
- `logo`: Logo gradient colors
- `nav`: Navigation link colors
- `cta`: Request Access button colors

### Ripple Background
Edit `theme.ripple` in `/src/styles/theme.ts`:
- `border`: Grid line color
- `fill`: Cell background
- `shadow`: Ripple effect color

## ✅ Benefits

1. **🔄 Instant Theme Changes**: Modify colors in one file, see changes everywhere
2. **🎯 Type Safety**: Full TypeScript support with autocomplete
3. **📱 Consistent Design**: All components use the same color system
4. **🚀 Easy Maintenance**: No more hunting through files to change colors
5. **🎨 Multiple Themes**: Easy to create and switch between themes

## 🚨 Important Notes

- Always use theme variables instead of hardcoded colors
- Test color changes across all components
- Ensure sufficient contrast for accessibility
- The ripple effect uses CSS variables for optimal performance

## 📝 Current Implementation

The Hero section (`/src/components/Home/Hero.tsx`) is fully integrated with the theme system and serves as a reference implementation. All colors are extracted from the theme and applied using inline styles for maximum flexibility.

To change the entire color scheme, simply edit the values in `/src/styles/theme.ts` and all components will automatically update! 🎉
