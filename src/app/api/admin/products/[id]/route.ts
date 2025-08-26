/**
 * Admin Individual Product API Route
 * CRUD operations for single product management
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateSuperadminAccess, logAdminAction } from '../../../../../lib/auth/superadmin';
import { getAdminClient } from '../../../../../server/supabaseAdmin';

export const runtime = 'nodejs';

/**
 * GET /api/admin/products/[id]
 * Fetch a single product by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate superadmin access
    const authResult = await validateSuperadminAccess(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getAdminClient();
    
    const { data: product, error } = await supabaseAdmin
      .from('site_products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching product:', error);
      return NextResponse.json(
        { error: 'Failed to fetch product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error in GET /api/admin/products/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/products/[id]
 * Update a single product by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate superadmin access
    const authResult = await validateSuperadminAccess(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, features, image_url, order_index, is_active } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getAdminClient();

    // Fetch current product for logging
    const { data: currentProduct } = await supabaseAdmin
      .from('site_products')
      .select('*')
      .eq('id', id)
      .single();

    // Update product
    const { data: product, error } = await supabaseAdmin
      .from('site_products')
      .update({
        title,
        description,
        features: features || [],
        image_url,
        order_index: order_index || 0,
        is_active: is_active !== undefined ? is_active : true
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      console.error('Error updating product:', error);
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      );
    }

    // Log admin action
    await logAdminAction(
      authResult.user.email, 
      'update', 
      'product', 
      id, 
      currentProduct, 
      product, 
      request
    );

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error in PUT /api/admin/products/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/products/[id]
 * Delete a single product by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate superadmin access
    const authResult = await validateSuperadminAccess(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getAdminClient();

    // Fetch current product for logging
    const { data: currentProduct } = await supabaseAdmin
      .from('site_products')
      .select('*')
      .eq('id', id)
      .single();

    if (!currentProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete product
    const { error } = await supabaseAdmin
      .from('site_products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      );
    }

    // Log admin action
    await logAdminAction(
      authResult.user.email, 
      'delete', 
      'product', 
      id, 
      currentProduct, 
      undefined, 
      request
    );

    return NextResponse.json({ 
      message: 'Product deleted successfully',
      id
    });
  } catch (error) {
    console.error('Error in DELETE /api/admin/products/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}