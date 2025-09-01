import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';

type Theme = {
    name: string;
    colors: {
        '--color-project': string;
        '--color-project-focus': string;
        '--color-appointment': string;
        '--color-task': string;
        '--color-meeting': string;
        '--color-event': string;
        '--color-sidebar-bg': string;
        '--color-main-bg': string;
        '--color-card-bg': string;
        '--color-text-primary': string;
        '--color-text-secondary': string;
        '--color-border-color': string;
        '--color-status-green-bg': string;
        '--color-status-green-text': string;
        '--color-status-yellow-bg': string;
        '--color-status-yellow-text': string;
        '--color-status-blue-bg': string;
        '--color-status-blue-text': string;
        '--color-status-red-bg': string;
        '--color-status-red-text': string;
        '--color-status-purple-bg': string;
        '--color-status-purple-text': string;
    };
};

export const themes: { [key: string]: Theme } = {
    light: {
        name: 'Aydınlık',
        colors: {
            '--color-project': '#7C3AED',
            '--color-project-focus': '#6D28D9',
            '--color-appointment': '#3B82F6',
            '--color-task': '#22C55E',
            '--color-meeting': '#A855F7',
            '--color-event': '#F59E0B',
            '--color-sidebar-bg': '#1F2937',
            '--color-main-bg': '#F9FAFB',
            '--color-card-bg': '#FFFFFF',
            '--color-text-primary': '#111827',
            '--color-text-secondary': '#6B7280',
            '--color-border-color': '#E5E7EB',
            '--color-status-green-bg': '#ECFDF5',
            '--color-status-green-text': '#065F46',
            '--color-status-yellow-bg': '#FFFBEB',
            '--color-status-yellow-text': '#B45309',
            '--color-status-blue-bg': '#EFF6FF',
            '--color-status-blue-text': '#1E40AF',
            '--color-status-red-bg': '#FEF2F2',
            '--color-status-red-text': '#991B1B',
            '--color-status-purple-bg': '#F5F3FF',
            '--color-status-purple-text': '#5B21B6',
        },
    },
    dark: {
        name: 'Karanlık',
        colors: {
            '--color-project': '#8B5CF6',
            '--color-project-focus': '#7C3AED',
            '--color-appointment': '#60A5FA',
            '--color-task': '#4ADE80',
            '--color-meeting': '#C084FC',
            '--color-event': '#FBBF24',
            '--color-sidebar-bg': '#111827',
            '--color-main-bg': '#1F2937',
            '--color-card-bg': '#374151',
            '--color-text-primary': '#F9FAFB',
            '--color-text-secondary': '#9CA3AF',
            '--color-border-color': '#4B5563',
            '--color-status-green-bg': '#064E3B',
            '--color-status-green-text': '#6EE7B7',
            '--color-status-yellow-bg': '#92400E',
            '--color-status-yellow-text': '#FCD34D',
            '--color-status-blue-bg': '#1E40AF',
            '--color-status-blue-text': '#93C5FD',
            '--color-status-red-bg': '#991B1B',
            '--color-status-red-text': '#FCA5A5',
            '--color-status-purple-bg': '#5B21B6',
            '--color-status-purple-text': '#DDD6FE',
        },
    },
    ocean: {
        name: 'Okyanus',
        colors: {
            '--color-project': '#06B6D4',
            '--color-project-focus': '#0891B2',
            '--color-appointment': '#0EA5E9',
            '--color-task': '#10B981',
            '--color-meeting': '#6366F1',
            '--color-event': '#F59E0B',
            '--color-sidebar-bg': '#0F172A',
            '--color-main-bg': '#F0F9FF',
            '--color-card-bg': '#FFFFFF',
            '--color-text-primary': '#0C4A6E',
            '--color-text-secondary': '#38BDF8',
            '--color-border-color': '#E0F2FE',
            '--color-status-green-bg': '#D1FAE5',
            '--color-status-green-text': '#047857',
            '--color-status-yellow-bg': '#FEF3C7',
            '--color-status-yellow-text': '#D97706',
            '--color-status-blue-bg': '#DBEAFE',
            '--color-status-blue-text': '#1D4ED8',
            '--color-status-red-bg': '#FEE2E2',
            '--color-status-red-text': '#B91C1C',
            '--color-status-purple-bg': '#E0E7FF',
            '--color-status-purple-text': '#4338CA',
        },
    },
    sunset: {
        name: 'Gün Batımı',
        colors: {
            '--color-project': '#F97316',
            '--color-project-focus': '#EA580C',
            '--color-appointment': '#EF4444',
            '--color-task': '#EAB308',
            '--color-meeting': '#D946EF',
            '--color-event': '#EC4899',
            '--color-sidebar-bg': '#292524',
            '--color-main-bg': '#FFF7ED',
            '--color-card-bg': '#FFFFFF',
            '--color-text-primary': '#44403C',
            '--color-text-secondary': '#78716C',
            '--color-border-color': '#FDE68A',
            '--color-status-green-bg': '#FEF2F2',
            '--color-status-green-text': '#B91C1C',
            '--color-status-yellow-bg': '#FFFBEB',
            '--color-status-yellow-text': '#B45309',
            '--color-status-blue-bg': '#FEF2F2',
            '--color-status-blue-text': '#991B1B',
            '--color-status-red-bg': '#FEE2E2',
            '--color-status-red-text': '#B91C1C',
            '--color-status-purple-bg': '#FAE8FF',
            '--color-status-purple-text': '#A21CAF',
        },
    },
};

interface ThemeContextType {
    theme: string;
    setTheme: (name: string) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && themes[savedTheme]) {
            setTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        const activeTheme = themes[theme] || themes.light;
        Object.entries(activeTheme.colors).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    const contextValue = useMemo(() => ({ theme, setTheme }), [theme]);

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
