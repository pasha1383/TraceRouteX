export interface User {
  id: string;
  email: string;
  role: 'VIEWER' | 'ENGINEER' | 'ADMIN';
}

const isBrowser = typeof window !== 'undefined';

export const setAuth = (token: string, user: User) => {
  if (!isBrowser) return;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getAuth = (): { token: string | null; user: User | null } => {
  if (!isBrowser) return { token: null, user: null };
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  return { token, user };
};

export const clearAuth = () => {
  if (!isBrowser) return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  if (!isBrowser) return false;
  return !!localStorage.getItem('token');
};

export const hasRole = (requiredRoles: string[]): boolean => {
  const { user } = getAuth();
  return user ? requiredRoles.includes(user.role) : false;
};
