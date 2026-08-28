import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="text-2xl font-black tracking-tighter uppercase italic">
          VEM <span className="text-primary">PEDALAR</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#sobre" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Sobre</a>
          <a href="#experiencia" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Experiência</a>
          <a href="#evento" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Informações</a>
          <Link
            to="/inscricao"
            className="rounded-full bg-primary px-8 py-3 text-sm font-black text-primary-foreground transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
          >
            INSCREVA-SE
          </Link>
        </div>
        <button className="md:hidden p-2">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </nav>
  );
}
