'use client';

import { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react';
import { useAuthOptional } from '../lib/auth/AuthProvider';

export type Theme = 'light' | 'dark';

export interface User {
  email: string;
  name: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  reviewReminders: boolean;
}

interface DashboardContextValue {
  user: User;
  theme: Theme;
  setTheme: (t: Theme) => void;
  profileOpen: boolean;
  setProfileOpen: (v: boolean) => void;
  settingsOpen: boolean;
  setSettingsOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (v: boolean) => void;
  notificationSettings: NotificationSettings;
  setNotificationSettings: (s: NotificationSettings) => void;
}

const defaultUser: User = { email: 'dr.researcher@university.edu', name: 'Dr. Researcher' };
const defaultNotificationSettings: NotificationSettings = {
  email: true,
  push: false,
  reviewReminders: true,
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

const THEME_KEY = 'academialink-theme';

export function DashboardProvider({ children }: { children: ReactNode }) {
  const auth = useAuthOptional();
  const user: User = useMemo(() => {
    if (auth?.user) {
      const name = (auth.user.user_metadata?.full_name as string) || auth.user.email || 'User';
      return { email: auth.user.email ?? '', name };
    }
    return defaultUser;
  }, [auth?.user]);

  const [theme, setThemeState] = useState<Theme>('light');
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(defaultNotificationSettings);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(THEME_KEY) : null;
    if (stored === 'dark' || stored === 'light') setThemeState(stored);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_KEY, t);
      document.documentElement.setAttribute('data-theme', t);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const value: DashboardContextValue = {
    user,
    theme,
    setTheme,
    profileOpen,
    setProfileOpen,
    settingsOpen,
    setSettingsOpen,
    searchOpen,
    setSearchOpen,
    notificationsOpen,
    setNotificationsOpen,
    notificationSettings,
    setNotificationSettings,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
