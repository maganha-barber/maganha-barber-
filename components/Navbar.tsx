"use client";

import { useState, useEffect } from "react";
import { Menu, X, Calendar, User, Scissors, Phone, MapPin } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { UserMenu } from "./UserMenu";

export function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-50 w-screen transition-all duration-300 ${
        scrolled
          ? "bg-neutral-900/95 backdrop-blur-md shadow-lg border-b border-gold-500/20"
          : "bg-neutral-900/80 backdrop-blur-sm"
      }`}
      style={{ margin: 0, padding: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Scissors className="h-8 w-8 md:h-10 md:w-10 text-gold-400 group-hover:text-gold-300 transition-colors" />
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold text-white leading-tight">
                MAGANHA
              </span>
              <span className="text-[10px] text-gold-400/80 font-medium tracking-wider uppercase">
                BARBEARIA
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              href="/"
              className="text-neutral-300 hover:text-gold-400 font-medium text-sm transition-colors px-3 py-2"
            >
              Início
            </Link>
            <Link
              href="/#servicos"
              className="text-neutral-300 hover:text-gold-400 font-medium text-sm transition-colors px-3 py-2"
            >
              Serviços
            </Link>
            <Link
              href="/#sobre"
              className="text-neutral-300 hover:text-gold-400 font-medium text-sm transition-colors px-3 py-2"
            >
              Sobre
            </Link>
            <Link
              href="/agendar"
              className="text-neutral-300 hover:text-gold-400 font-medium text-sm transition-colors px-3 py-2 flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Agendar
            </Link>
            <div className="h-6 w-px bg-neutral-700 mx-2" />
            <a
              href="tel:+5535998361668"
              className="text-gold-400 hover:text-gold-300 font-semibold text-sm transition-colors px-3 py-2 flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              35 99836-1668
            </a>
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-gold-400" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="lg:hidden fixed top-20 left-0 right-0 h-[50vh] bg-neutral-900 border-t border-gold-500/20 z-40 overflow-y-auto shadow-xl">
          <div className="flex flex-col px-6 py-8 space-y-4">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-neutral-300 hover:text-gold-400 font-semibold text-base py-2 transition-colors"
            >
              Início
            </Link>
            <Link
              href="/#servicos"
              onClick={() => setIsOpen(false)}
              className="text-neutral-300 hover:text-gold-400 font-semibold text-base py-2 transition-colors flex items-center gap-2"
            >
              <Scissors className="h-5 w-5" />
              Serviços
            </Link>
            <Link
              href="/#sobre"
              onClick={() => setIsOpen(false)}
              className="text-neutral-300 hover:text-gold-400 font-semibold text-base py-2 transition-colors"
            >
              Sobre
            </Link>
            <Link
              href="/agendar"
              onClick={() => setIsOpen(false)}
              className="text-neutral-300 hover:text-gold-400 font-semibold text-base py-2 transition-colors flex items-center gap-2"
            >
              <Calendar className="h-5 w-5" />
              Agendar Horário
            </Link>
            <div className="border-t border-neutral-700 my-4" />
            <a
              href="tel:+5535998361668"
              onClick={() => setIsOpen(false)}
              className="text-gold-400 font-bold text-base py-2 flex items-center gap-2"
            >
              <Phone className="h-5 w-5" />
              35 99836-1668
            </a>
            <a
              href="#"
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 text-sm py-2 flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Rua Marquês de Abrantes, Barbearia, Jardim Bom Astor, MG
            </a>
            {session ? (
              <div className="mt-4">
                <UserMenu />
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  signIn("google");
                }}
                className="mt-4 w-full bg-gold-500 text-neutral-900 font-bold text-base py-3 rounded-md text-center hover:bg-gold-400 transition-colors shadow-md"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
