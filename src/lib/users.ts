export interface User {
  id: string;
  email: string;
  password: string; // In a real app, this would be a hashed password
}

export const users: User[] = [];

export function findUserByEmail(email: string): User | undefined {
  return users.find(user => user.email === email);
}

export function createUser(user: Omit<User, 'id'>): User {
  if (findUserByEmail(user.email)) {
    throw new Error("User already exists");
  }

  const newUser: User = {
    id: Date.now().toString(), // Simple unique ID generation
    ...user,
  };

  users.push(newUser);
  return newUser;
}
