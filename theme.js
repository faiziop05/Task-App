
export const theme = {
  colors: {
    // Primary Brand Colors
    primary: '#6C63FF',       // Vibrant Violet - Primary Action
    primaryDark: '#5A52D5',   // Darker shade for active states
    primaryLight: '#8A84FF',  // Lighter shade for accents
    primarySoft: '#EEF2FF',   // Very soft background for primary elements

    // Base Colors
    background: '#F9FAFB',    // Cool Gray - Main background
    surface: '#FFFFFF',       // Card/Surface background
    white: '#FFFFFF',
    black: '#000000',

    // Text Colors
    textPrimary: '#1E293B',   // Dark Slate - Main text
    textSecondary: '#64748B', // Cool Gray - Secondary text
    textTertiary: '#94A3B8',  // Light Gray - Hints/Disabled
    textInverse: '#FFFFFF',   // White text on dark backgrounds

    // Semantic Colors
    success: '#10B981',       // Emerald Green
    warning: '#F59E0B',       // Amber
    error: '#EF4444',         // Red
    info: '#3B82F6',          // Blue

    // Priority Colors
    high: '#EF4444',
    medium: '#F59E0B',
    low: '#10B981',

    // Neutrals
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',

    // Borders & Dividers
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    hairline: 0.5, // Crisp 0.5px border

    // Overlays
    overlay: 'rgba(0, 0, 0, 0.5)',
  },


  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeights: {
      xs: 16,
      sm: 20,
      base: 24,
      lg: 28,
      xl: 28,
      '2xl': 32,
      '3xl': 36,
      '4xl': 40,
    }
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 48,
  },

  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 24,
    xl: 32,
    full: 9999,
  },

  shadows: {
    // Ultra-subtle shadows for depth without bulk
    sm: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03, // Reduced opacity
      shadowRadius: 2,
      elevation: 1, // Reduced elevation
    },
    base: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05, // Reduced
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export const getCategoryColor = (category) => {
  // You can expand this map if you have specific categories
  return theme.colors.primary;
};

export const getPriorityColor = (priority) => {
  const map = {
    'high': theme.colors.high,
    'medium': theme.colors.medium,
    'low': theme.colors.low,
  };
  return map[priority?.toLowerCase()] || theme.colors.gray400;
};

export const getPriorityLabel = (priority) => {
  const map = {
    'high': 'High Priority',
    'medium': 'Medium Priority',
    'low': 'Low Priority',
  };
  return map[priority?.toLowerCase()] || 'Normal';
};

export const getTaskStatus = (task) => {
  if (task.completed) return 'Completed';

  const dateObject = new Date(task.date);
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const day = String(dateObject.getDate()).padStart(2, '0');
  const datePart = `${year}-${month}-${day}`;

  // Basic date comparison logic - can be refined
  const time = new Date(`${datePart}T${task.time.split(' ')[0]}`);
  const now = new Date();

  if (time < now) return 'Overdue';
  return 'Pending';
};

export default theme;
