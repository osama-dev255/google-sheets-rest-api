import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to synchronize authentication state with Google Sheets data
 * This ensures that any changes to user accounts in Sheet1 are reflected in the app
 */
export function useAuthSync() {
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    let syncInterval: NodeJS.Timeout;

    if (user) {
      // Function to check if user still exists in Sheet1 with same credentials
      const syncWithSheet = async () => {
        try {
          await refreshUser();
        } catch (error) {
          console.warn('Failed to sync with authentication sheet:', error);
          // Don't log out on sync failure, might be network issue
        }
      };

      // Check authentication status every 5 minutes
      syncInterval = setInterval(syncWithSheet, 5 * 60 * 1000);
      
      // Initial sync
      syncWithSheet();
    }

    return () => {
      if (syncInterval) {
        clearInterval(syncInterval);
      }
    };
  }, [user, refreshUser]);
}