import postgres from 'postgres';
import { User, SavedQuote, Catalog, AgentInvitation, Template } from '@/types/user';

// Initialize Postgres client
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: 'require',
  max: 1, // Serverless-friendly: reuse connections
});

// Database row types (snake_case from Postgres)
interface UserRow {
  id: string;
  email: string;
  password: string;
  name: string;
  account_type: string;
  enterprise_id?: string | null;
  created_at?: string;
}

interface QuoteRow {
  id: string;
  user_id: string;
  quote_number: string;
  client_name: string;
  date?: string;
  total: number | string;
  quote_data: any;
  created_at?: string;
}

interface CatalogRow {
  id: string;
  user_id: string;
  name: string;
  data: any;
  uploaded_at?: string;
}

interface InvitationRow {
  id: string;
  enterprise_id: string;
  email: string;
  token: string;
  used: boolean;
  created_at?: string;
}

interface TemplateRow {
  id: string;
  user_id: string;
  name: string;
  file_name: string;
  file_data: string;
  file_size: number;
  created_at?: string;
  updated_at?: string;
}

// Initialize database tables
export async function initDB() {
  try {
    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        account_type TEXT NOT NULL,
        enterprise_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Quotes table
    await sql`
      CREATE TABLE IF NOT EXISTS quotes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        quote_number TEXT NOT NULL,
        client_name TEXT NOT NULL,
        date TIMESTAMP NOT NULL,
        total NUMERIC NOT NULL,
        quote_data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    // Catalogs table
    await sql`
      CREATE TABLE IF NOT EXISTS catalogs (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        data JSONB NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    // Invitations table
    await sql`
      CREATE TABLE IF NOT EXISTS invitations (
        id TEXT PRIMARY KEY,
        enterprise_id TEXT NOT NULL,
        email TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (enterprise_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    // Templates table
    await sql`
      CREATE TABLE IF NOT EXISTS templates (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_data TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Users
export async function getUsers(): Promise<User[]> {
  try {
    const rows = (await sql`SELECT * FROM users`) as UserRow[];
    return rows.map(row => ({
      id: row.id,
      email: row.email,
      passwordHash: row.password,
      name: row.name,
      accountType: row.account_type as 'agent' | 'enterprise',
      enterpriseId: row.enterprise_id || undefined,
      createdAt: row.created_at || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  try {
    const rows = (await sql`
      SELECT * FROM users WHERE LOWER(email) = LOWER(${email}) LIMIT 1
    `) as UserRow[];
    if (rows.length === 0) return undefined;
    
    const row = rows[0];
    return {
      id: row.id,
      email: row.email,
      passwordHash: row.password,
      name: row.name,
      accountType: row.account_type as 'agent' | 'enterprise',
      enterpriseId: row.enterprise_id || undefined,
      createdAt: row.created_at || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting user by email:', error);
    return undefined;
  }
}

export async function getUserById(id: string): Promise<User | undefined> {
  try {
    const rows = (await sql`
      SELECT * FROM users WHERE id = ${id} LIMIT 1
    `) as UserRow[];
    if (rows.length === 0) return undefined;
    
    const row = rows[0];
    return {
      id: row.id,
      email: row.email,
      passwordHash: row.password,
      name: row.name,
      accountType: row.account_type as 'agent' | 'enterprise',
      enterpriseId: row.enterprise_id || undefined,
      createdAt: row.created_at || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return undefined;
  }
}

export async function createUser(user: User): Promise<void> {
  try {
    await sql`
      INSERT INTO users (id, email, password, name, account_type, enterprise_id, created_at)
      VALUES (
        ${user.id},
        ${user.email},
        ${user.passwordHash},
        ${user.name},
        ${user.accountType},
        ${user.enterpriseId || null},
        ${user.createdAt || new Date().toISOString()}
      )
    `;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUser(id: string, updates: Partial<User>): Promise<void> {
  try {
    const setParts: string[] = [];
    
    if (updates.name !== undefined) setParts.push(`name = '${updates.name}'`);
    if (updates.email !== undefined) setParts.push(`email = '${updates.email}'`);
    if (updates.passwordHash !== undefined) setParts.push(`password = '${updates.passwordHash}'`);
    if (updates.accountType !== undefined) setParts.push(`account_type = '${updates.accountType}'`);
    if (updates.enterpriseId !== undefined) setParts.push(`enterprise_id = '${updates.enterpriseId}'`);

    if (setParts.length === 0) return;

    const query = `UPDATE users SET ${setParts.join(', ')} WHERE id = '${id}'`;
    await sql([query] as any);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await sql`DELETE FROM users WHERE id = ${id}`;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// Quotes
export async function getQuotesByUserId(userId: string): Promise<SavedQuote[]> {
  try {
    const rows = (await sql`
      SELECT * FROM quotes WHERE user_id = ${userId} ORDER BY date DESC
    `) as QuoteRow[];
    return rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      quoteNumber: row.quote_number,
      clientName: row.client_name,
      date: row.date || new Date().toISOString(),
      total: Number(row.total),
      quoteData: row.quote_data,
      createdAt: row.created_at || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error getting quotes:', error);
    return [];
  }
}

export async function getQuoteById(id: string): Promise<SavedQuote | undefined> {
  try {
    const rows = (await sql`
      SELECT * FROM quotes WHERE id = ${id} LIMIT 1
    `) as QuoteRow[];
    if (rows.length === 0) return undefined;
    
    const row = rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      quoteNumber: row.quote_number,
      clientName: row.client_name,
      date: row.date || new Date().toISOString(),
      total: Number(row.total),
      quoteData: row.quote_data,
      createdAt: row.created_at || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting quote by ID:', error);
    return undefined;
  }
}

export async function createQuote(quote: SavedQuote): Promise<void> {
  try {
    await sql`
      INSERT INTO quotes (id, user_id, quote_number, client_name, date, total, quote_data, created_at)
      VALUES (
        ${quote.id},
        ${quote.userId},
        ${quote.quoteNumber},
        ${quote.clientName},
        ${quote.date},
        ${quote.total},
        ${JSON.stringify(quote.quoteData)},
        ${quote.createdAt || new Date().toISOString()}
      )
    `;
  } catch (error) {
    console.error('Error creating quote:', error);
    throw error;
  }
}

export async function deleteQuote(id: string): Promise<void> {
  try {
    await sql`DELETE FROM quotes WHERE id = ${id}`;
  } catch (error) {
    console.error('Error deleting quote:', error);
    throw error;
  }
}

// Catalogs
export async function getCatalogsByUserId(userId: string): Promise<Catalog[]> {
  try {
    const rows = (await sql`
      SELECT * FROM catalogs WHERE user_id = ${userId} ORDER BY uploaded_at DESC
    `) as CatalogRow[];
    return rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      data: row.data,
      uploadedAt: row.uploaded_at || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error getting catalogs:', error);
    return [];
  }
}

export async function getCatalogById(id: string): Promise<Catalog | undefined> {
  try {
    const rows = (await sql`
      SELECT * FROM catalogs WHERE id = ${id} LIMIT 1
    `) as CatalogRow[];
    if (rows.length === 0) return undefined;
    
    const row = rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      data: row.data,
      uploadedAt: row.uploaded_at || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting catalog by ID:', error);
    return undefined;
  }
}

export async function createCatalog(catalog: Catalog): Promise<void> {
  try {
    await sql`
      INSERT INTO catalogs (id, user_id, name, data, uploaded_at)
      VALUES (
        ${catalog.id},
        ${catalog.userId},
        ${catalog.name},
        ${JSON.stringify(catalog.data)},
        ${catalog.uploadedAt || new Date().toISOString()}
      )
    `;
  } catch (error) {
    console.error('Error creating catalog:', error);
    throw error;
  }
}

export async function updateCatalog(id: string, updates: Partial<Catalog>): Promise<void> {
  try {
    const setParts: string[] = [];
    
    if (updates.name !== undefined) setParts.push(`name = '${updates.name}'`);
    if (updates.data !== undefined) setParts.push(`data = '${JSON.stringify(updates.data)}'::jsonb`);
    if (updates.uploadedAt !== undefined) setParts.push(`uploaded_at = '${updates.uploadedAt}'`);

    if (setParts.length === 0) return;

    const query = `UPDATE catalogs SET ${setParts.join(', ')} WHERE id = '${id}'`;
    await sql([query] as any);
  } catch (error) {
    console.error('Error updating catalog:', error);
    throw error;
  }
}

export async function deleteCatalog(id: string): Promise<void> {
  try {
    await sql`DELETE FROM catalogs WHERE id = ${id}`;
  } catch (error) {
    console.error('Error deleting catalog:', error);
    throw error;
  }
}

// Invitations
export async function getInvitations(): Promise<AgentInvitation[]> {
  try {
    const rows = (await sql`SELECT * FROM invitations ORDER BY created_at DESC`) as InvitationRow[];
    return rows.map(row => ({
      id: row.id,
      enterpriseId: row.enterprise_id,
      email: row.email,
      token: row.token,
      used: row.used,
      createdAt: row.created_at || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error getting invitations:', error);
    return [];
  }
}

export async function getInvitationByToken(token: string): Promise<AgentInvitation | undefined> {
  try {
    const rows = (await sql`
      SELECT * FROM invitations WHERE token = ${token} LIMIT 1
    `) as InvitationRow[];
    if (rows.length === 0) return undefined;
    
    const row = rows[0];
    return {
      id: row.id,
      enterpriseId: row.enterprise_id,
      email: row.email,
      token: row.token,
      used: row.used,
      createdAt: row.created_at || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting invitation by token:', error);
    return undefined;
  }
}

export async function createInvitation(invitation: AgentInvitation): Promise<void> {
  try {
    await sql`
      INSERT INTO invitations (id, enterprise_id, email, token, used, created_at)
      VALUES (
        ${invitation.id},
        ${invitation.enterpriseId},
        ${invitation.email},
        ${invitation.token},
        ${invitation.used || false},
        ${invitation.createdAt || new Date().toISOString()}
      )
    `;
  } catch (error) {
    console.error('Error creating invitation:', error);
    throw error;
  }
}

export async function markInvitationAsUsed(token: string): Promise<void> {
  try {
    await sql`UPDATE invitations SET used = true WHERE token = ${token}`;
  } catch (error) {
    console.error('Error marking invitation as used:', error);
    throw error;
  }
}

export async function deleteInvitation(id: string): Promise<void> {
  try {
    await sql`DELETE FROM invitations WHERE id = ${id}`;
  } catch (error) {
    console.error('Error deleting invitation:', error);
    throw error;
  }
}

// Templates
export async function getTemplatesByUserId(userId: string): Promise<Template[]> {
  try {
    const rows = (await sql`
      SELECT * FROM templates WHERE user_id = ${userId} ORDER BY updated_at DESC
    `) as TemplateRow[];
    return rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      fileName: row.file_name,
      fileData: row.file_data,
      fileSize: row.file_size,
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error getting templates:', error);
    return [];
  }
}

export async function getTemplateById(id: string): Promise<Template | undefined> {
  try {
    const rows = (await sql`
      SELECT * FROM templates WHERE id = ${id} LIMIT 1
    `) as TemplateRow[];
    if (rows.length === 0) return undefined;
    
    const row = rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      fileName: row.file_name,
      fileData: row.file_data,
      fileSize: row.file_size,
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting template by ID:', error);
    return undefined;
  }
}

export async function createTemplate(template: Template): Promise<void> {
  try {
    await sql`
      INSERT INTO templates (id, user_id, name, file_name, file_data, file_size, created_at, updated_at)
      VALUES (
        ${template.id},
        ${template.userId},
        ${template.name},
        ${template.fileName},
        ${template.fileData},
        ${template.fileSize},
        ${template.createdAt || new Date().toISOString()},
        ${template.updatedAt || new Date().toISOString()}
      )
    `;
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
}

export async function updateTemplate(id: string, updates: Partial<Template>): Promise<void> {
  try {
    const setParts: string[] = [`updated_at = '${new Date().toISOString()}'`];
    
    if (updates.name !== undefined) setParts.push(`name = '${updates.name}'`);
    if (updates.fileName !== undefined) setParts.push(`file_name = '${updates.fileName}'`);
    if (updates.fileData !== undefined) setParts.push(`file_data = '${updates.fileData}'`);
    if (updates.fileSize !== undefined) setParts.push(`file_size = ${updates.fileSize}`);

    const query = `UPDATE templates SET ${setParts.join(', ')} WHERE id = '${id}'`;
    await sql([query] as any);
  } catch (error) {
    console.error('Error updating template:', error);
    throw error;
  }
}

export async function deleteTemplate(id: string): Promise<void> {
  try {
    await sql`DELETE FROM templates WHERE id = ${id}`;
  } catch (error) {
    console.error('Error deleting template:', error);
    throw error;
  }
}
