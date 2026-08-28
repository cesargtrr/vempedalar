import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, CheckCircle, Clock, XCircle, Search, Download, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { Registration } from "@/types/database";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: registrations } = useQuery({
    queryKey: ["registrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Função para formatar ou gerar visualmente o número da inscrição caso esteja nulo no banco
  const getRegistrationCode = (reg: Registration, index: number) => {
    if (reg.registration_number) return reg.registration_number;
    const formattedIndex = String(index + 1).padStart(4, "0");
    return `VEM-${formattedIndex}`;
  };

  const filtered = (registrations as Registration[])?.filter((reg: Registration, index: number) => {
    const regCode = getRegistrationCode(reg, index);
    const matchesSearch = 
      reg.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      regCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.whatsapp.includes(searchTerm);
    
    let matchesStatus = true;
    if (statusFilter === "confirmed") {
      matchesStatus = reg.status === "confirmed" || reg.status === "checked_in";
    } else if (statusFilter === "pending") {
      matchesStatus = reg.status === "registered" || reg.status === "pending_payment";
    } else if (statusFilter !== "all") {
      matchesStatus = reg.status === statusFilter;
    }

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: registrations?.length || 0,
    confirmed: (registrations as Registration[])?.filter((r: Registration) => r.status === "confirmed" || r.status === "checked_in").length || 0,
    checkedIn: (registrations as Registration[])?.filter((r: Registration) => r.status === "checked_in" || r.status === "confirmed").length || 0,
    pending: (registrations as Registration[])?.filter((r: Registration) => r.status === "registered" || r.status === "pending_payment").length || 0,
  };

  const handleCheckIn = async (id: string) => {
    const { error } = await supabase
      .from("registrations")
      .update({ status: "checked_in", check_in_at: new Date().toISOString() })
      .eq("id", id);
      
    if (error) {
      alert("Erro ao realizar check-in");
    } else {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    }
  };

  const exportCSV = () => {
    if (!filtered || filtered.length === 0) return;
    const headers = ["Nº Inscrição", "Nome", "WhatsApp", "Cidade/Bairro", "Status", "Data Inscrição"];
    const rows = filtered.map((r, i) => [
      getRegistrationCode(r, i),
      r.full_name,
      r.whatsapp,
      r.city_neighborhood,
      r.status,
      new Date(r.created_at).toLocaleDateString()
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + 
      [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "participantes_vem_pedalar.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0c0f08] text-[#f2efe2] font-inter">
      <aside className="fixed left-0 top-0 h-full w-72 bg-[#12160c] border-r border-[#c6ff1e]/10 hidden lg:block z-50">
        <div className="p-8 space-y-2">
          <div className="text-3xl font-anton uppercase tracking-tighter italic text-[#f2efe2]">
            ADM <span className="text-[#c6ff1e]">PEDALAR</span>
          </div>
          <div className="h-1 w-12 bg-[#c6ff1e]" />
        </div>
        
        <nav className="mt-8 px-4 space-y-4">
          <Link to="/admin" className="flex items-center gap-4 p-5 bg-[#c6ff1e] text-[#0c0f08] font-anton text-xl uppercase italic shadow-xl shadow-[#c6ff1e]/10"
                style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)' }}>
            <Users className="w-6 h-6" /> Participantes
          </Link>
          <Link to="/admin/settings" className="flex items-center gap-4 p-5 text-[#c9c6b7] hover:text-[#c6ff1e] font-anton text-xl uppercase italic transition-colors">
            <Settings className="w-6 h-6" /> Configurações
          </Link>
          <div className="pt-10 border-t border-[#c6ff1e]/5 mt-10">
            <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-4 p-5 text-[#e0693a] font-anton text-xl uppercase italic transition-colors hover:bg-[#e0693a]/5 w-full text-left">
              <LogOut className="w-6 h-6" /> Sair
            </button>
          </div>
        </nav>
      </aside>

      <main className="lg:ml-72 p-6 md:p-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-6xl md:text-7xl font-anton text-[#f2efe2] uppercase italic tracking-tighter">Painel</h1>
              <div className="h-px w-24 bg-[#c6ff1e]/30" />
            </div>
            <button 
              onClick={exportCSV}
              className="flex items-center gap-3 bg-[#c6ff1e] text-[#0c0f08] px-8 py-4 font-anton text-2xl uppercase italic shadow-xl shadow-[#c6ff1e]/5 cursor-pointer"
              style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}
            >
              <Download className="w-6 h-6" /> EXPORTAR CSV
            </button>
          </header>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Inscritos" value={stats.total} icon={<Users />} theme="bg-[#2c1c10]" />
            <StatCard label="Confirmados" value={stats.confirmed} icon={<CheckCircle />} theme="bg-[#12160c]" border />
            <StatCard label="Check-ins" value={stats.checkedIn} icon={<Clock />} theme="bg-[#c6ff1e]" light />
            <StatCard label="Pendentes" value={stats.pending} icon={<XCircle />} theme="bg-[#0c0f08]" border />
          </div>

          <div className="bg-[#12160c] border border-[#c6ff1e]/10 shadow-2xl">
            <div className="p-8 border-b border-[#c6ff1e]/5 space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#c6ff1e]/40 w-6 h-6" />
                  <input 
                    type="text" 
                    placeholder="Pesquisar..." 
                    className="w-full pl-14 pr-6 py-5 bg-[#0c0f08] border-none focus:ring-2 ring-[#c6ff1e]/20 text-[#f2efe2] font-inter text-lg placeholder:text-[#c9c6b7]/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  className="px-8 py-5 bg-[#0c0f08] border-none focus:ring-2 ring-[#c6ff1e]/20 text-[#c6ff1e] font-oswald font-bold uppercase tracking-widest text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">TODOS STATUS</option>
                  <option value="pending">PENDENTES</option>
                  <option value="confirmed">CONFIRMADO / CHECK-IN</option>
                  <option value="cancelled">CANCELADO</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#0c0f08]/50 text-xs font-oswald font-bold uppercase tracking-[0.2em] text-[#c6ff1e]/40">
                    <th className="px-8 py-6">Inscrição</th>
                    <th className="px-8 py-6">Participante</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c6ff1e]/5">
                  {filtered?.map((reg: Registration, index: number) => (
                    <tr key={reg.id} className="hover:bg-[#c6ff1e]/5 transition-colors group">
                      <td className="px-8 py-8 font-anton text-2xl uppercase italic text-[#c6ff1e] tracking-wider">
                        {getRegistrationCode(reg, index)}
                      </td>
                      <td className="px-8 py-8">
                        <div className="font-anton text-xl uppercase italic text-[#f2efe2]">{reg.full_name}</div>
                        <div className="text-sm font-oswald uppercase tracking-widest text-[#c9c6b7]/40">{reg.city_neighborhood} • {reg.whatsapp}</div>
                      </td>
                      <td className="px-8 py-8">
                        <span className={`px-4 py-2 font-anton text-sm uppercase italic tracking-widest ${
                          reg.status === 'checked_in' || reg.status === 'confirmed' ? 'bg-[#c6ff1e] text-[#0c0f08]' :
                          'bg-[#0c0f08] text-[#c9c6b7] border border-[#c6ff1e]/10'
                        }`}
                        style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-8 py-8 text-right">
                        {reg.status !== 'checked_in' && reg.status !== 'confirmed' && (
                          <button 
                            onClick={() => handleCheckIn(reg.id)}
                            className="bg-[#c6ff1e] text-[#0c0f08] px-6 py-3 font-anton text-lg uppercase italic hover:scale-110 active:scale-95 transition-all shadow-lg shadow-[#c6ff1e]/10 cursor-pointer"
                            style={{ clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0 100%)' }}
                          >
                            CHECK-IN
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {(!filtered || filtered.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-[#c9c6b7]/20 font-anton text-3xl uppercase italic tracking-widest">
                        Nenhum registro encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, theme, border, light }: any) {
  return (
    <div className={`${theme} p-8 relative overflow-hidden shadow-2xl ${border ? 'border border-[#c6ff1e]/20' : ''}`}>
      <div className={`absolute top-0 right-0 w-24 h-24 transform translate-x-12 -translate-y-12 rotate-45 ${light ? 'bg-[#0c0f08]/10' : 'bg-[#c6ff1e]/5'}`} />
      <div className="relative z-10 flex flex-col gap-4">
        <div className={`w-12 h-12 flex items-center justify-center ${light ? 'text-[#0c0f08]' : 'text-[#c6ff1e]'}`}>
          {icon}
        </div>
        <div>
          <div className={`text-xs font-oswald font-bold uppercase tracking-[0.2em] ${light ? 'text-[#0c0f08]/60' : 'text-[#c6ff1e]/40'}`}>{label}</div>
          <div className={`text-6xl font-anton uppercase italic leading-none ${light ? 'text-[#0c0f08]' : 'text-[#f2efe2]'}`}>{value}</div>
        </div>
      </div>
    </div>
  );
}