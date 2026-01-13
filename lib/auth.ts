// Sistema de autenticação que funciona com localStorage por enquanto
// Mas está preparado para migrar para Supabase facilmente

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  isAdmin?: boolean;
}

const ADMIN_EMAILS = ['admin@magbarber.com', 'dono@magbarber.com']; // Emails que são admin

export function isAdmin(user: User | null): boolean {
  if (!user) return false;
  return user.isAdmin || ADMIN_EMAILS.includes(user.email.toLowerCase());
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('magbarber_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    // Verificar se é admin baseado no email
    const isUserAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());
    const userWithAdmin = { ...user, isAdmin: isUserAdmin };
    localStorage.setItem('magbarber_user', JSON.stringify(userWithAdmin));
    
    // Disparar evento customizado para atualizar componentes
    window.dispatchEvent(new Event('userUpdated'));
  } else {
    localStorage.removeItem('magbarber_user');
    window.dispatchEvent(new Event('userUpdated'));
  }
}

export function signOut(): void {
  setUser(null);
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}
