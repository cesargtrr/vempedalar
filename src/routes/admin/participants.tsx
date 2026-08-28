import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Download } from "lucide-react";
import { useState } from "react";
import type { Registration } from "@/types/database";
import { AdminSidebar, AdminMobileNav } from "@/components/AdminSidebar";

export const Route = createFileRoute("/admin/participants")({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: "/admin/login" });
    }
  },
  head: () => ({
    meta: [
      { title: "Participantes — ADM Vem Pedalar" },
      { name: "description", content: "Gestão dos participantes inscritos no Vem Pedalar." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminParticipants,
});

const STATUS_LABEL: Record<string, string> = {
  registered: "Inscrito",
  pending_payment: "Aguardando pagamento",
  awaiting_confirmation: "Aguardando confirmação",
  confirmed: "Confirmado",
  checked_in: "Check-in realizado",
  cancelled: "Cancelado",
};

const PAYMENT_LABEL: Record<string, string> = {
  pending: "Aguardando pagamento",
  awaiting_confirmation: "Enviado para análise",
  approved: "Pagamento confirmado",
  rejected: "Recusado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
  expired: "Expirado",
};

function AdminParticipants() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: registrations } = useQuery({
    queryKey: ["registrations-with-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registrations")
        .select("*, payments(payment_status, created_at)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as (Registration & { payments: { payment_status: string | null; created_at: string | null }[] })[];
    },
  });

  const filtered = (registrations ?? []).filter((reg) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      reg.full_name.toLowerCase().includes(term) ||
      (reg.registration_number ?? "").toLowerCase().includes(term) ||
      reg.whatsapp.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || reg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const latestPayment = (reg: { payments: { payment_status: string | null; created_at: string | null }[] }) => {
    const list = [...(reg.payments ?? [])].sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));
    return list[0]?.payment_status ?? null;
  };

  const handleCheckIn = async (id: string) => {
    const { error } = await supabase
      .from("registrations")
      .update({ status: "confirmed", check_in_at: new Date().toISOString() })
      .eq("id", id);
      
    if (error) {
      alert("Erro ao confirmar participante");
    } else {
      queryClient.invalidateQueries({ queryKey: ["registrations-with-payments"] });
    }
  };

  const exportCSV = () => {
    if (filtered.length === 0) return;
    const headers = ["Nº Inscrição", "Nome", "WhatsApp", "Nascimento", "Cidade/Bairro", "Status", "Pagamento", "Check-in", "Data Inscrição"];
    const rows = filtered.map((r) => [
      r.registration_number ?? "—",
      r.full_name,
      r.whatsapp,
      r.birth_date,
      r.city_neighborhood,
      STATUS_LABEL[r.status] ?? r.status,
      PAYMENT_LABEL[latestPayment(r) ?? ""] ?? "—",
      r.check_in_at ? new Date(r.check_in_at).toLocaleString("pt-BR") : "—",
      new Date(r.created_at).toLocaleDateString("pt-BR"),
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers, ...rows].map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "participantes_vem_pedalar.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0c0f08] text-[#f2efe2] font-inter">
      <AdminSidebar />
      <main className="lg:ml-72 p-6 md:p-12">
        <div className="max-w-7xl mx-auto space-y-10">
          <AdminMobileNav />
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-anton text-[#f2efe2] uppercase italic tracking-tighter">
                Participantes
              </h1>
              <div className="h-px w-24 bg-[#c6ff1e]/30" />
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center gap-3 bg-[#c6ff1e] text-[#0c0f08] px-8 py-4 font-anton text-2xl uppercase italic shadow-xl shadow-[#c6ff1e]/5"
              style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0 100%)" }}
            >
              <Download className="w-6 h-6" /> EXPORTAR CSV
            </button>
          </header>

          <div className="bg-[#12160c] border border-[#c6ff1e]/10 shadow-2xl">
            <div className="p-6 md:p-8 border-b border-[#c6ff1e]/5">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#c6ff1e]/40 w-6 h-6" />
                  <input
                    type="text"
                    placeholder="Pesquisar por nome, WhatsApp ou nº..."
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
                  <option value="pending_payment">AGUARDANDO PAGAMENTO</option>
                  <option value="awaiting_confirmation">AGUARDANDO CONFIRMAÇÃO</option>
                  <option value="registered">INSCRITO</option>
                  <option value="confirmed">CONFIRMADO</option>
                  <option value="checked_in">CHECK-IN</option>
                  <option value="cancelled">CANCELADO</option>
                </select>
              </div>
            </div>

            {/* Desktop */}
            <div className="overflow-x-auto hidden md:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#0c0f08]/50 text-xs font-oswald font-bold uppercase tracking-[0.2em] text-[#c6ff1e]/40">
                    <th className="px-6 py-6">Número</th>
                    <th className="px-6 py-6">Nome</th>
                    <th className="px-6 py-6">WhatsApp</th>
                    <th className="px-6 py-6">Nascimento</th>
                    <th className="px-6 py-6">Cidade/Bairro</th>
                    <th className="px-6 py-6">Status</th>
                    <th className="px-6 py-6">Pagamento</th>
                    <th className="px-6 py-6">Check-in</th>
                    <th className="px-6 py-6">Inscrição</th>
                    <th className="px-6 py-6 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c6ff1e]/5">
                  {filtered.map((reg) => (
                    <tr key={reg.id} className="hover:bg-[#c6ff1e]/5 transition-colors">
                      <td className="px-6 py-6 font-anton text-xl uppercase italic text-[#c6ff1e] tracking-wider">
                        {reg.registration_number ?? "—"}
                      </td>
                      <td className="px-6 py-6 font-anton text-lg uppercase italic text-[#f2efe2]">{reg.full_name}</td>
                      <td className="px-6 py-6 text-sm text-[#c9c6b7]">{reg.whatsapp}</td>
                      <td className="px-6 py-6 text-sm text-[#c9c6b7]">
                        {reg.birth_date ? new Date(reg.birth_date + "T12:00:00").toLocaleDateString("pt-BR") : "—"}
                      </td>
                      <td className="px-6 py-6 text-sm text-[#c9c6b7]">{reg.city_neighborhood}</td>
                      <td className="px-6 py-6">
                        <span
                          className={`px-3 py-2 font-anton text-xs uppercase italic tracking-widest inline-block ${
                            reg.status === "confirmed" || reg.status === "checked_in"
                              ? "bg-[#c6ff1e] text-[#0c0f08]"
                              : "bg-[#0c0f08] text-[#c9c6b7] border border-[#c6ff1e]/10"
                          }`}
                        >
                          {STATUS_LABEL[reg.status] ?? reg.status}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-sm font-oswald uppercase tracking-widest text-[#c9c6b7]">
                        {PAYMENT_LABEL[latestPayment(reg) ?? ""] ?? "—"}
                      </td>
                      <td className="px-6 py-6 text-sm text-[#c9c6b7]">
                        {reg.check_in_at ? new Date(reg.check_in_at).toLocaleString("pt-BR") : "—"}
                      </td>
                      <td className="px-6 py-6 text-sm text-[#c9c6b7]">
                        {new Date(reg.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-6 text-right">
                        {reg.status !== "confirmed" && reg.status !== "checked_in" && (
                          <button
                            onClick={() => handleCheckIn(reg.id)}
                            className="bg-[#c6ff1e] text-[#0c0f08] px-5 py-3 font-anton text-base uppercase italic shadow-lg shadow-[#c6ff1e]/10 cursor-pointer hover:bg-[#b0e619] transition-all"
                            style={{ clipPath: "polygon(15% 0, 100% 0, 85% 100%, 0 100%)" }}
                          >
                            CHECK-IN
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={10}
                        className="px-8 py-20 text-center text-[#c9c6b7]/20 font-anton text-3xl uppercase italic tracking-widest"
                      >
                        Nenhum registro encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-[#c6ff1e]/5">
              {filtered.map((reg) => (
                <div key={reg.id} className="p-6 space-y-3">
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-anton text-xl uppercase italic text-[#c6ff1e]">
                      {reg.registration_number ?? "—"}
                    </span>
                    <span className="text-xs font-oswald uppercase tracking-widest text-[#c9c6b7]">
                      {STATUS_LABEL[reg.status] ?? reg.status}
                    </span>
                  </div>
                  <div className="font-anton text-lg uppercase italic text-[#f2efe2]">{reg.full_name}</div>
                  <div className="text-sm text-[#c9c6b7]">
                    {reg.whatsapp} • {reg.city_neighborhood}
                  </div>
                  <div className="text-xs font-oswald uppercase tracking-widest text-[#c9c6b7]/60">
                    Pagamento: {PAYMENT_LABEL[latestPayment(reg) ?? ""] ?? "—"}
                  </div>
                  {reg.status !== "confirmed" && reg.status !== "checked_in" && (
                    <button
                      onClick={() => handleCheckIn(reg.id)}
                      className="bg-[#c6ff1e] text-[#0c0f08] px-5 py-3 font-anton text-base uppercase italic w-full mt-2"
                    >
                      CHECK-IN
                    </button>
                  )}
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="px-6 py-16 text-center text-[#c9c6b7]/20 font-anton text-2xl uppercase italic">
                  Nenhum registro encontrado
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}