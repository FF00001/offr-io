import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getUserByEmail, createUser } from './db';
import { User, AccountType } from '@/types/user';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function registerUser(
  email: string,
  password: string,
  accountType: AccountType,
  name: string,
  enterpriseId?: string
): Promise<{ success: boolean; error?: string; user?: User }> {
  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { success: false, error: 'Email already registered' };
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user: User = {
    id: uuidv4(),
    email: email.toLowerCase(),
    passwordHash,
    accountType,
    name,
    createdAt: new Date().toISOString(),
    ...(enterpriseId && { enterpriseId }),
  };

  await createUser(user);

  return { success: true, user };
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: User }> {
  const user = await getUserByEmail(email);
  
  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  
  if (!isValid) {
    return { success: false, error: 'Invalid email or password' };
  }

  return { success: true, user };
}

export function generateInvitationToken(): string {
  return uuidv4();
}
