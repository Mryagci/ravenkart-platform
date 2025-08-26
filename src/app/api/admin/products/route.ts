/**
 * Admin Products API Route
 * CRUD operations for site products management
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateSuperadminAccess, logAdminAction } from '../../../../lib/auth/superadmin';
import { getAdminClient } from '../../../../server/supabaseAdmin';

export const runtime = 'nodejs';

/**
 * GET /api/admin/products
 * Fetch all products for admin management
 */
export async function GET(request: NextRequest) {
  try {
    // Validate superadmin access
    const authResult = await validateSuperadminAccess(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const supabaseAdmin = getAdminClient();
    
    // Fetch all products (including inactive ones for admin)
    const { data: products, error } = await supabaseAdmin
      .from('site_products')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    // Log admin action
    await logAdminAction(authResult.user.email, 'view', 'product', undefined, undefined, undefined, request);

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error in GET /api/admin/products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/products
 * Create a new product
 */
export async function POST(request: NextRequest) {
  try {
    // Validate superadmin access
    const authResult = await validateSuperadminAccess(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
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

    // Create new product
    const { data: product, error } = await supabaseAdmin
      .from('site_products')
      .insert({
        title,
        description,
        features: features || [],
        image_url,
        order_index: order_index || 0,
        is_active: is_active !== undefined ? is_active : true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }

    // Log admin action
    await logAdminAction(
      authResult.user.email, 
      'create', 
      'product', 
      product.id, 
      undefined, 
      product, 
      request
    );

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/products
 * Update multiple products (bulk operations, reordering)
 */
export async function PUT(request: NextRequest) {
  try {
    // Validate superadmin access
    const authResult = await validateSuperadminAccess(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const body = await request.json();
    const { products } = body;

    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Products array is required' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getAdminClient();

    // Update products in batch
    const updates = products.map(async (product) => {
      const { data, error } = await supabaseAdmin
        .from('site_products')
        .update({
          title: product.title,
          description: product.description,
          features: product.features,
          image_url: product.image_url,
          order_index: product.order_index,
          is_active: product.is_active
        })
        .eq('id', product.id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating product ${product.id}:`, error);
        return null;
      }

      return data;
    });

    const results = await Promise.all(updates);
    const successfulUpdates = results.filter(Boolean);

    // Log admin action
    await logAdminAction(
      authResult.user.email, 
      'bulk_update', 
      'product', 
      undefined, 
      undefined, 
      { updated_count: successfulUpdates.length }, 
      request
    );

    return NextResponse.json({ 
      message: `${successfulUpdates.length} products updated successfully`,
      products: successfulUpdates
    });
  } catch (error) {
    console.error('Error in PUT /api/admin/products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}