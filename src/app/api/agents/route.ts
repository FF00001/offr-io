import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getUsers, getInvitations, getUserById } from '@/lib/db';

// GET - List all agents for current enterprise
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only enterprises can list agents
    if (session.accountType !== 'enterprise') {
      return NextResponse.json(
        { error: 'Only enterprises can list agents' },
        { status: 403 }
      );
    }

    const users = getUsers();
    const invitations = getInvitations();

    // Get agents that belong to this enterprise
    const enterpriseAgents = users.filter(
      (user) => user.accountType === 'agent' && user.enterpriseId === session.id
    );

    // Get pending invitations for this enterprise
    const pendingInvitations = invitations.filter(
      (inv) => inv.enterpriseId === session.id && !inv.used
    );

    // Combine agents and invitations
    const agentsList = [
      // Created agents (invitation used)
      ...enterpriseAgents.map((agent) => ({
        id: agent.id,
        email: agent.email,
        name: agent.name,
        status: 'created' as const,
        createdAt: agent.createdAt,
      })),
      // Pending invitations (not yet used)
      ...pendingInvitations.map((inv) => ({
        id: inv.id,
        email: inv.email,
        name: null,
        status: 'pending' as const,
        createdAt: inv.createdAt,
      })),
    ];

    // Sort by creation date (newest first)
    agentsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ agents: agentsList });
  } catch (error) {
    console.error('Get agents error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an agent or invitation
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only enterprises can delete agents
    if (session.accountType !== 'enterprise') {
      return NextResponse.json(
        { error: 'Only enterprises can delete agents' },
        { status: 403 }
      );
    }

    const { id, type } = await request.json();

    if (!id || !type) {
      return NextResponse.json(
        { error: 'Missing id or type' },
        { status: 400 }
      );
    }

    if (type === 'created') {
      // Delete an agent user
      const user = getUserById(id);
      if (!user) {
        return NextResponse.json(
          { error: 'Agent not found' },
          { status: 404 }
        );
      }

      // Verify the agent belongs to this enterprise
      if (user.enterpriseId !== session.id) {
        return NextResponse.json(
          { error: 'Unauthorized to delete this agent' },
          { status: 403 }
        );
      }

      // Delete the user
      const { deleteUser } = await import('@/lib/db');
      deleteUser(id);
    } else if (type === 'pending') {
      // Delete a pending invitation
      const { deleteInvitation } = await import('@/lib/db');
      deleteInvitation(id);
    } else {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete agent error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
