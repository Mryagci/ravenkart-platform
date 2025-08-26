/**
 * Custom hook for superadmin functionality
 * Provides client-side superadmin status and utilities
 */

import { useState, useEffect, useCallback } from 'react';
import { isSuperadmin, getCurrentUser, getSuperadminPermissions } from '../lib/auth/superadmin';

interface SuperadminState {
  isLoading: boolean;
  isSuperadmin: boolean;
  user: any | null;
  permissions: any | null;
  error: string | null;
}

export function useSuperadmin() {
  const [state, setState] = useState<SuperadminState>({
    isLoading: true,
    isSuperadmin: false,
    user: null,
    permissions: null,
    error: null,
  });

  const checkSuperadminStatus = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Get current user
      const user = await getCurrentUser();
      
      if (!user) {
        setState({
          isLoading: false,
          isSuperadmin: false,
          user: null,
          permissions: null,
          error: null,
        });
        return;
      }
      
      // Check if user is superadmin
      const isAdmin = await isSuperadmin(user.email);
      
      let permissions = null;
      if (isAdmin) {
        permissions = await getSuperadminPermissions(user.email);
      }
      
      setState({
        isLoading: false,
        isSuperadmin: isAdmin,
        user,
        permissions,
        error: null,
      });
    } catch (error) {
      console.error('Error checking superadmin status:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }));
    }
  }, []);

  useEffect(() => {
    checkSuperadminStatus();
  }, [checkSuperadminStatus]);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!state.permissions) return false;
    return state.permissions.all === true || state.permissions[permission] === true;
  }, [state.permissions]);

  const refetch = useCallback(() => {
    checkSuperadminStatus();
  }, [checkSuperadminStatus]);

  return {
    ...state,
    hasPermission,
    refetch,
  };
}

/**
 * Hook to require superadmin access
 * Redirects to home if not authorized
 */
export function useRequireSuperadmin() {
  const { isLoading, isSuperadmin, error } = useSuperadmin();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isLoading && !isSuperadmin && !error) {
      setShouldRedirect(true);
      // Redirect to home page
      window.location.href = '/';
    }
  }, [isLoading, isSuperadmin, error]);

  return {
    isLoading,
    isSuperadmin,
    shouldRedirect,
    error,
  };
}

/**
 * Hook for admin API calls
 * Provides authenticated fetch function
 */
export function useAdminApi() {
  const { user, isSuperadmin } = useSuperadmin();
  
  const adminFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    if (!isSuperadmin || !user) {
      throw new Error('Superadmin access required');
    }

    try {
      // Get fresh auth token
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }

      // Make authenticated request
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      console.error('Admin API request failed:', error);
      throw error;
    }
  }, [isSuperadmin, user]);

  return {
    adminFetch,
    isReady: isSuperadmin && !!user,
  };
}

/**
 * Hook for admin audit logging
 */
export function useAdminLogger() {
  const { user, isSuperadmin } = useSuperadmin();
  const { adminFetch } = useAdminApi();

  const logAction = useCallback(async (
    action: string,
    resourceType?: string,
    resourceId?: string,
    oldData?: any,
    newData?: any
  ) => {
    if (!isSuperadmin || !user) {
      console.warn('Cannot log action: Superadmin access required');
      return;
    }

    try {
      await adminFetch('/api/admin/audit-log', {
        method: 'POST',
        body: JSON.stringify({
          action,
          resourceType,
          resourceId,
          oldData,
          newData,
        }),
      });
    } catch (error) {
      console.error('Failed to log admin action:', error);
      // Don't throw - logging failures shouldn't break the main flow
    }
  }, [isSuperadmin, user, adminFetch]);

  return {
    logAction,
    canLog: isSuperadmin && !!user,
  };
}