"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { Shield, Calendar, LogOut } from "lucide-react";

const ADMIN_EMAILS = ["lpmragi@gmail.com"];

export function UserMenu() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!session) {
    return (
      <button
        onClick={() => signIn("google")}
        className="px-5 py-2.5 bg-gold-500 text-neutral-900 font-semibold hover:bg-gold-400 transition-all rounded-md text-sm shadow-md hover:shadow-lg"
      >
        Login
      </button>
    );
  }

  const userIsAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email);
  const userInitials = session.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <div className="relative w-full md:w-auto" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-800 transition-colors w-full md:w-auto"
      >
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="w-10 h-10 md:w-8 md:h-8 rounded-full bg-gold-500 flex items-center justify-center text-neutral-900 font-bold text-sm flex-shrink-0">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-10 h-10 md:w-8 md:h-8 rounded-full object-cover"
              />
            ) : (
              userInitials
            )}
          </div>
          <div className="text-left flex-1">
            <p className="text-sm md:text-sm font-semibold text-white">
              {session.user?.name?.toUpperCase() || "USUÁRIO"}
            </p>
            <p className="text-xs text-neutral-400">Minha Conta</p>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 md:right-0 md:left-auto mt-2 w-full md:w-56 bg-neutral-800 rounded-lg shadow-xl border border-neutral-700 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-neutral-700 md:hidden">
            <p className="text-sm font-semibold text-white">{session.user?.name}</p>
            <p className="text-xs text-neutral-400">{session.user?.email}</p>
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
