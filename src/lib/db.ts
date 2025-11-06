import fs from 'fs';
import path from 'path';
import { User, SavedQuote, Catalog, AgentInvitation } from '@/types/user';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_FILES = {
  users: path.join(DATA_DIR, 'users.json'),
  quotes: path.join(DATA_DIR, 'quotes.json'),
  catalogs: path.join(DATA_DIR, 'catalogs.json'),
  invitations: path.join(DATA_DIR, 'invitations.json'),
};

// Initialize files if they don't exist
Object.values(DB_FILES).forEach(file => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([]), 'utf-8');
  }
});

// Generic read/write functions
function readData<T>(filePath: string): T[] {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T[];
  } catch (error) {
    return [];
  }
}

function writeData<T>(filePath: string, data: T[]): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Users
export function getUsers(): User[] {
  return readData<User>(DB_FILES.users);
}

export function getUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): User | undefined {
  const users = getUsers();
  return users.find(u => u.id === id);
}

export function createUser(user: User): void {
  const users = getUsers();
  users.push(user);
  writeData(DB_FILES.users, users);
}

export function updateUser(id: string, updates: Partial<User>): void {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    writeData(DB_FILES.users, users);
  }
}

// Quotes
export function getQuotesByUserId(userId: string): SavedQuote[] {
  const quotes = readData<SavedQuote>(DB_FILES.quotes);
  return quotes.filter(q => q.userId === userId);
}

export function getQuoteById(id: string): SavedQuote | undefined {
  const quotes = readData<SavedQuote>(DB_FILES.quotes);
  return quotes.find(q => q.id === id);
}

export function createQuote(quote: SavedQuote): void {
  const quotes = readData<SavedQuote>(DB_FILES.quotes);
  quotes.push(quote);
  writeData(DB_FILES.quotes, quotes);
}

export function deleteQuote(id: string): void {
  const quotes = readData<SavedQuote>(DB_FILES.quotes);
  const filtered = quotes.filter(q => q.id !== id);
  writeData(DB_FILES.quotes, filtered);
}

// Catalogs
export function getCatalogsByUserId(userId: string): Catalog[] {
  const catalogs = readData<Catalog>(DB_FILES.catalogs);
  return catalogs.filter(c => c.userId === userId);
}

export function getCatalogById(id: string): Catalog | undefined {
  const catalogs = readData<Catalog>(DB_FILES.catalogs);
  return catalogs.find(c => c.id === id);
}

export function createCatalog(catalog: Catalog): void {
  const catalogs = readData<Catalog>(DB_FILES.catalogs);
  catalogs.push(catalog);
  writeData(DB_FILES.catalogs, catalogs);
}

export function updateCatalog(id: string, updates: Partial<Catalog>): void {
  const catalogs = readData<Catalog>(DB_FILES.catalogs);
  const index = catalogs.findIndex(c => c.id === id);
  if (index !== -1) {
    catalogs[index] = { ...catalogs[index], ...updates };
    writeData(DB_FILES.catalogs, catalogs);
  }
}

export function deleteCatalog(id: string): void {
  const catalogs = readData<Catalog>(DB_FILES.catalogs);
  const filtered = catalogs.filter(c => c.id !== id);
  writeData(DB_FILES.catalogs, filtered);
}

// Invitations
export function getInvitations(): AgentInvitation[] {
  return readData<AgentInvitation>(DB_FILES.invitations);
}

export function getInvitationByToken(token: string): AgentInvitation | undefined {
  const invitations = getInvitations();
  return invitations.find(i => i.token === token);
}

export function createInvitation(invitation: AgentInvitation): void {
  const invitations = getInvitations();
  invitations.push(invitation);
  writeData(DB_FILES.invitations, invitations);
}

export function markInvitationAsUsed(token: string): void {
  const invitations = getInvitations();
  const index = invitations.findIndex(i => i.token === token);
  if (index !== -1) {
    invitations[index].used = true;
    writeData(DB_FILES.invitations, invitations);
  }
}
