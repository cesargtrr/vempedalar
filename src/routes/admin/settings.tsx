import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Save, Loader2, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/settings")({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminSettings,
});

function AdminSettings() {
  const [formData, setFormData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["event_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("event_settings").select("*").single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (settings) setFormData(settings);
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from("event_settings")
        .update(formData)
        .eq("id", settings!.id);
      if (error) throw error;
      alert("Configurações salvas com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar configurações.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !formData) return (
    <div className="min-h-screen bg-[#0c0f08] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#c6ff1e] w-12 h-12" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0c0f08] p-6 md:p-12 text-[#f2efe2] font-inter">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex items-center gap-6">
          <Link to="/admin" className="p-4 bg-[#12160c] border border-[#c6ff1e]/20 hover:bg-[#c6ff1e] hover:text-[#0c0f08] transition-all"
                style={{ clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0 100%)' }}>
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-anton text-[#f2efe2] uppercase italic tracking-tighter">Configurações</h1>
            <div className="h-px w-24 bg-[#c6ff1e]/30" />
          </div>
        </header>

        <form onSubmit={handleSave} className="bg-[#12160c] p-8 md:p-12 border-t-8 border-[#c6ff1e] shadow-2xl space-y-12">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-anton text-[#c6ff1e] uppercase italic tracking-tight">Evento</h3>
                <div className="flex-1 h-px bg-[#c6ff1e]/10" />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-oswald font-bold uppercase tracking-[0.2em] text-[#c6ff1e]/40">Nome do Evento</label>
                <input 
                  className="w-full p-5 bg-[#0c0f08] border-2 border-transparent focus:border-[#c6ff1e]/50 focus:outline-none transition-all text-lg text-[#f2efe2]" 
                  value={formData.event_name}
                  onChange={(e) => setFormData({...formData, event_name: e.target.value})}
                />
              </div>
              
              <div className="grid gap-6 grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-oswald font-bold uppercase tracking-[0.2em] text-[#c6ff1e]/40">Data</label>
                  <input 
                    className="w-full p-5 bg-[#0c0f08] border-2 border-transparent focus:border-[#c6ff1e]/50 focus:outline-none transition-all text-lg text-[#f2efe2]" 
                    value={formData.event_date || ""}
                    onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-oswald font-bold uppercase tracking-[0.2em] text-[#c6ff1e]/40">Horário</label>
                  <input 
                    className="w-full p-5 bg-[#0c0f08] border-2 border-transparent focus:border-[#c6ff1e]/50 focus:outline-none transition-all text-lg text-[#f2efe2]" 
                    value={formData.event_time || ""}
                    onChange={(e) => setFormData({...formData, event_time: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-oswald font-bold uppercase tracking-[0.2em] text-[#c6ff1e]/40">Local</label>
                <input 
                  className="w-full p-5 bg-[#0c0f08] border-2 border-transparent focus:border-[#c6ff1e]/50 focus:outline-none transition-all text-lg text-[#f2efe2]" 
                  value={formData.event_location || ""}
                  onChange={(e) => setFormData({...formData, event_location: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-anton text-[#c6ff1e] uppercase italic tracking-tight">Formulário</h3>
                <div className="flex-1 h-px bg-[#c6ff1e]/10" />
              </div>
              
              <label className="flex items-center justify-between p-6 bg-[#0c0f08] cursor-pointer group border-2 border-transparent hover:border-[#c6ff1e]/20 transition-all">
                <span className="font-oswald font-bold uppercase tracking-widest text-sm text-[#c9c6b7] group-hover:text-[#c6ff1e]">Campos Emergência</span>
                <input 
                  type="checkbox" 
                  className="peer appearance-none w-7 h-7 border-2 border-[#c6ff1e]/30 bg-transparent checked:bg-[#c6ff1e] checked:border-[#c6ff1e] transition-all cursor-pointer"
                  checked={formData.emergency_fields_enabled}
                  onChange={(e) => setFormData({...formData, emergency_fields_enabled: e.target.checked})}
                />
              </label>

              <div className="space-y-2">
                <label className="text-xs font-oswald font-bold uppercase tracking-[0.2em] text-[#c6ff1e]/40">Termos (Ponto e vírgula separa cada item)</label>
                <textarea 
                  rows={6}
                  className="w-full p-5 bg-[#0c0f08] border-2 border-transparent focus:border-[#c6ff1e]/50 focus:outline-none transition-all text-[#c9c6b7] font-inter text-sm" 
                  value={formData.terms_text}
                  onChange={(e) => setFormData({...formData, terms_text: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            disabled={saving}
            className="group relative w-full overflow-hidden bg-[#c6ff1e] py-7 text-3xl font-anton text-[#0c0f08] uppercase italic transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 shadow-2xl shadow-[#c6ff1e]/20"
            style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)' }}
          >
            {saving ? <Loader2 className="animate-spin w-8 h-8" /> : <><Save className="w-8 h-8" /> SALVAR ALTERAÇÕES</>}
          </button>
        </form>
      </div>
    </div>
  );
}