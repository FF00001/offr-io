import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getTemplatesByUserId, createTemplate, updateTemplate, deleteTemplate } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// GET - List all templates for current user
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const templates = getTemplatesByUserId(session.id);
    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Get templates error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create/upload a new template
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, content } = await request.json();

    if (!name || !content) {
      return NextResponse.json(
        { error: 'Template name and content are required' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const template = {
      id: uuidv4(),
      userId: session.id,
      name,
      content,
      createdAt: now,
      updatedAt: now,
    };

    createTemplate(template);

    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error('Create template error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update/rename a template
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, name, content } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    const updates: { name?: string; content?: any } = {};
    if (name !== undefined) updates.name = name;
    if (content !== undefined) updates.content = content;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No updates provided' },
        { status: 400 }
      );
    }

    updateTemplate(id, updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update template error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a template
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    deleteTemplate(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete template error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
