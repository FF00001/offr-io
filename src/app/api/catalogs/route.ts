import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getCatalogsByUserId, createCatalog, updateCatalog } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import Papa from 'papaparse';

// GET - List all catalogs for current user
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const catalogs = getCatalogsByUserId(session.id);
    return NextResponse.json({ catalogs });
  } catch (error) {
    console.error('Get catalogs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Upload a new catalog (CSV)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const text = await file.text();
    
    // Parse CSV
    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length > 0) {
      return NextResponse.json(
        { error: 'Invalid CSV format' },
        { status: 400 }
      );
    }

    // Expected columns: description, unit, unitPrice
    const catalogItems = parsed.data.map((row: any) => ({
      description: row.description || '',
      unit: row.unit || 'unit',
      unitPrice: parseFloat(row.unitPrice || '0'),
    }));

    const catalog = {
      id: uuidv4(),
      userId: session.id,
      name: name || file.name,
      data: catalogItems,
      uploadedAt: new Date().toISOString(),
    };

    createCatalog(catalog);

    return NextResponse.json({ success: true, catalog });
  } catch (error) {
    console.error('Upload catalog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing catalog
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const catalogId = formData.get('catalogId') as string;

    if (!file || !catalogId) {
      return NextResponse.json(
        { error: 'Missing file or catalog ID' },
        { status: 400 }
      );
    }

    const text = await file.text();
    
    // Parse CSV
    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length > 0) {
      return NextResponse.json(
        { error: 'Invalid CSV format' },
        { status: 400 }
      );
    }

    const catalogItems = parsed.data.map((row: any) => ({
      description: row.description || '',
      unit: row.unit || 'unit',
      unitPrice: parseFloat(row.unitPrice || '0'),
    }));

    updateCatalog(catalogId, {
      data: catalogItems,
      uploadedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update catalog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
