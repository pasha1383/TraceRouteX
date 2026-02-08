export interface User {
  id: string;
  email: string;
  role: 'VIEWER' | 'ENGINEER' | 'ADMIN';
}

export const setAuth = (token: string, user: User) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getAuth = (): { token: string | null; user: User | null } => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  return { token, user };
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const hasRole = (requiredRoles: string[]): boolean => {
  const { user } = getAuth();
  return user ? requiredRoles.includes(user.role) : false;
};
