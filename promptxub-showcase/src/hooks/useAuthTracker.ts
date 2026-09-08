'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'promptxub_user_activity';
const SOFT_GATE_INITIAL_THRESHOLD = 5;
const RE_TRIGGER_INTERVAL = 8;

interface UserActivity {
  totalInteractions: number;
  copyCount: number;
  lastDismissedAt: number;
  isAuthenticated: boolean;
}

export function useAuthTracker() {
  const [activity, setActivity] = useState<UserActivity>({
    totalInteractions: 0,
    copyCount: 0,
    lastDismissedAt: 0,
    isAuthenticated: false,
  });

  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load activity from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('promptxub_user') || localStorage.getItem('promptxub_active_user_session');
      const stored = localStorage.getItem(STORAGE_KEY);
      let parsed: Partial<UserActivity> = {};
      if (stored) {
        parsed = JSON.parse(stored);
      }
      setActivity({
        totalInteractions: parsed.totalInteractions || 0,
        copyCount: parsed.copyCount || 0,
        lastDismissedAt: parsed.lastDismissedAt || 0,
        isAuthenticated: !!storedUser || !!parsed.isAuthenticated,
      });
    } catch (e) {
      console.error('Failed to load user activity from storage', e);
    }
  }, []);

  // Check if soft-gate modal should trigger
  const checkThresholds = useCallback((current: UserActivity) => {
    if (current.isAuthenticated) return false;

    const { totalInteractions, copyCount, lastDismissedAt } = current;

    // First trigger at 5 interactions or 3 copies
    if (lastDismissedAt === 0) {
      return totalInteractions >= SOFT_GATE_INITIAL_THRESHOLD || copyCount >= 3;
    }

    // Subsequent re-triggers every RE_TRIGGER_INTERVAL (8) interactions after dismissal
    return totalInteractions - lastDismissedAt >= RE_TRIGGER_INTERVAL;
  }, []);

  // Trigger an interaction (viewing card, clicking details, copying prompt)
  const triggerInteraction = useCallback((isCopy: boolean = false) => {
    setActivity((prev) => {
      if (prev.isAuthenticated) return prev;

      const nextInteractions = prev.totalInteractions + 1;
      const nextCopies = isCopy ? prev.copyCount + 1 : prev.copyCount;

      const updated: UserActivity = {
        ...prev,
        totalInteractions: nextInteractions,
        copyCount: nextCopies,
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }

      if (checkThresholds(updated)) {
        setShowAuthModal(true);
      }

      return updated;
    });
  }, [checkThresholds]);

  // Dismiss modal manually via X button or cancel
  const dismissAuthModal = useCallback(() => {
    setShowAuthModal(false);
    setActivity((prev) => {
      const updated: UserActivity = {
        ...prev,
        lastDismissedAt: prev.totalInteractions,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, []);

  const setAuthenticated = useCallback((authStatus: boolean) => {
    setActivity((prev) => {
      const updated = { ...prev, isAuthenticated: authStatus };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    if (authStatus) setShowAuthModal(false);
  }, []);

  return {
    showAuthModal,
    triggerInteraction,
    dismissAuthModal,
    isAuthenticated: activity.isAuthenticated,
    setAuthenticated,
    totalInteractions: activity.totalInteractions,
  };
}
