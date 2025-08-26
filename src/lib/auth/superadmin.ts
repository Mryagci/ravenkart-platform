/**
 * Superadmin Authentication Utilities
 * Handles superadmin verification and session management
 */

import { getAdminClient } from '../../server/supabaseAdmin';

// Hardcoded superadmin email for initial implementation
const SUPERADMIN_EMAIL = '1erkinyagci@gmail.com';

/**
 * Check if an email belongs to a superadmin
 */
export async function isSuperadmin(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;
  
  // First check hardcoded superadmin
  if (email === SUPERADMIN_EMAIL) return true;
  
  try {
    // Check database for additional superadmins
    const supabaseAdmin = getAdminClient();
    const { data, error } = await supabaseAdmin
      .from('superadmins')
      .select('id')
      .eq('email', email)
      .single();
    
    if (error) {
      console.error('Error checking superadmin status:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in isSuperadmin check:', error);
    return false;
  }
}

/**
 * Get current user from Supabase auth
 */
export async function getCurrentUser() {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}

/**
 * Require superadmin access - throws error if not authorized
 */
export async function requireSuperadmin(): Promise<any> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  const isAdmin = await isSuperadmin(user.email);
  
  if (!isAdmin) {
    throw new Error('Superadmin access required');
  }
  
  return user;
}

/**
 * Middleware helper for API routes
 */
export async function validateSuperadminAccess(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return { error: 'Missing or invalid authorization header', status: 401 };
    }
    
    const token = authHeader.slice(7);
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return { error: 'Invalid authentication token', status: 401 };
    }
    
    const isAdmin = await isSuperadmin(user.email);
    
    if (!isAdmin) {
      return { error: 'Superadmin access required', status: 403 };
    }
    
    return { user, error: null, status: 200 };
  } catch (error) {
    console.error('Error validating superadmin access:', error);
    return { error: 'Internal server error', status: 500 };
  }
}

/**
 * Log admin action to audit trail
 */
export async function logAdminAction(
  adminEmail: string,
  action: string,
  resourceType?: string,
  resourceId?: string,
  oldData?: any,
  newData?: any,
  request?: Request
) {
  try {
    const supabaseAdmin = getAdminClient();
    
    // Extract IP and user agent from request if provided
    let ipAddress = null;
    let userAgent = null;
    
    if (request) {
      ipAddress = request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'unknown';
      userAgent = request.headers.get('user-agent') || 'unknown';
    }
    
    const { error } = await supabaseAdmin.rpc('log_admin_action', {
      admin_email: adminEmail,
      action,
      resource_type: resourceType || null,
      resource_id: resourceId || null,
      old_data: oldData ? JSON.stringify(oldData) : null,
      new_data: newData ? JSON.stringify(newData) : null,
      ip_address: ipAddress,
      user_agent: userAgent
    });
    
    if (error) {
      console.error('Error logging admin action:', error);
    }
  } catch (error) {
    console.error('Error in logAdminAction:', error);
  }
}

/**
 * Get superadmin permissions
 */
export async function getSuperadminPermissions(email: string): Promise<any> {
  try {
    const supabaseAdmin = getAdminClient();
    const { data, error } = await supabaseAdmin
      .from('superadmins')
      .select('permissions')
      .eq('email', email)
      .single();
    
    if (error || !data) {
      // Default permissions for hardcoded superadmin
      if (email === SUPERADMIN_EMAIL) {
        return {
          all: true,
          products: true,
          pricing: true,
          policies: true,
          contact: true,
          users: true,
          payments: true
        };
      }
      return null;
    }
    
    return data.permissions;
  } catch (error) {
    console.error('Error getting superadmin permissions:', error);
    return null;
  }
}

/**
 * Check specific permission for superadmin
 */
export async function hasPermission(email: string, permission: string): Promise<boolean> {
  const permissions = await getSuperadminPermissions(email);
  
  if (!permissions) return false;
  
  // Check for 'all' permission or specific permission
  return permissions.all === true || permissions[permission] === true;
}