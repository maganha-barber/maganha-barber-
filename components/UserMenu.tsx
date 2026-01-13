"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Calendar, LogOut, User as UserIcon } from "lucide-react";
import { getUser, isAdmin, signOut } from "@/lib/auth";

export function UserMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(getUser());
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Atualizar usuário quando mudar
    const updateUser = () => {
      setUser(getUser());
    };
    updateUser();
    
    // Listener para mudanças no localStorage e eventos customizados
    window.addEventListener('storage', updateUser);
    window.addEventListener('userUpdated', updateUser);
    
    // Fechar menu ao clicar fora
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('storage', updateUser);
      window.removeEventListener('userUpdated', updateUser);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) {
    return (
      <button
        onClick={() => router.push("/auth")}
        className="px-5 py-2.5 bg-gold-500 text-neutral-900 font-semibold hover:bg-gold-400 transition-all rounded-md text-sm shadow-md hover:shadow-lg"
      >
        Login
      </button>
    );
  }

  const userIsAdmin = isAdmin(user);
  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-neutral-900 font-bold text-sm">
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              userInitials
            )}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-white">{user.name.toUpperCase()}</p>
            <p className="text-xs text-neutral-400">Minha Conta</p>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-neutral-800 rounded-lg shadow-xl border border-neutral-700 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-neutral-700 md:hidden">
            <p className="text-sm font-semibold text-white">{user.name}</p>
            <p className="text-xs text-neutral-400">{user.email}</p>
          </div>
          
          <div className="py-1">
            {userIsAdmin && (
              <button
                onClick={() => {
                  router.push("/admin");
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neutral-700 transition-colors group"
              >
                <Shield className="h-5 w-5 text-gold-400 group-hover:text-gold-300" />
                <span className="text-gold-400 font-semibold group-hover:text-gold-300">
                  Painel Admin
                </span>
              </button>
            )}
            
            <button
              onClick={() => {
                router.push("/meus-agendamentos");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neutral-700 transition-colors"
            >
              <Calendar className="h-5 w-5 text-neutral-300" />
              <span className="text-neutral-300">Meus Agendamentos</span>
            </button>
            
            <div className="border-t border-neutral-700 my-1" />
            
            <button
              onClick={() => {
                signOut();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neutral-700 transition-colors"
            >
              <LogOut className="h-5 w-5 text-red-400" />
              <span className="text-red-400">Sair</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
