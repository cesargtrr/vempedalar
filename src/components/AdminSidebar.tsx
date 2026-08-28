import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Users, Settings, LogOut } from "lucide-react";

const items = [
  { to: "/admin", label: "Painel", icon: BarChart3 },
  { to: "/admin/participants", label: "Participantes", icon: Users },
  { to: "/admin/settings", label: "Configurações", icon: Settings },
] as const;

export function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#12160c] border-r border-[#c6ff1e]/10 hidden lg:block z-50 overflow-y-auto">
      <div className="p-8 space-y-2">
        <div className="text-3xl font-anton uppercase tracking-tighter italic text-[#f2efe2]">
          ADM <span className="text-[#c6ff1e]">PEDALAR</span>
        </div>
        <div className="h-1 w-12 bg-[#c6ff1e]" />
      </div>

      <nav className="mt-8 px-4 space-y-3">
        {items.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/admin" }}
            className="flex items-center gap-4 p-5 text-[#c9c6b7] hover:text-[#c6ff1e] font-anton text-xl uppercase italic transition-colors"
            activeProps={{
              className:
                "flex items-center gap-4 p-5 bg-[#c6ff1e] text-[#0c0f08] font-anton text-xl uppercase italic shadow-xl shadow-[#c6ff1e]/10",
              style: { clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0 100%)" },
            }}
          >
            <Icon className="w-6 h-6" /> {label}
          </Link>
        ))}
        <div className="pt-10 border-t border-[#c6ff1e]/5 mt-10">
          <button
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-4 p-5 text-[#e0693a] font-anton text-xl uppercase italic transition-colors hover:bg-[#e0693a]/5 w-full text-left"
          >
            <LogOut className="w-6 h-6" /> Sair
          </button>
        </div>
      </nav>
    </aside>
  );
}

export function AdminMobileNav() {
  return (
    <div className="lg:hidden flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
      {items.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          activeOptions={{ exact: to === "/admin" }}
          className="shrink-0 px-5 py-3 bg-[#12160c] border border-[#c6ff1e]/10 text-[#c9c6b7] font-anton uppercase italic text-sm"
          activeProps={{
            className: "shrink-0 px-5 py-3 bg-[#c6ff1e] text-[#0c0f08] font-anton uppercase italic text-sm",
          }}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
