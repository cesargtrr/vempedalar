import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Lock } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/admin" });
    } catch (error: any) {
      alert(error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0f08] p-8">
      <div className="w-full max-w-md space-y-8 bg-[#12160c] p-12 shadow-2xl border-t-8 border-[#c6ff1e]">
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-[#c6ff1e] text-[#0c0f08] flex items-center justify-center mb-6"
               style={{ clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0 100%)' }}>
            <Lock className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-anton text-[#c6ff1e] uppercase italic tracking-tight">Admin Login</h1>
          <p className="text-[#c9c6b7] font-inter italic font-medium">Área restrita para organizadores.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 font-inter">
          <div className="space-y-2">
            <label className="text-xs font-oswald font-bold uppercase tracking-[0.2em] text-[#c6ff1e]/60">E-mail</label>
            <input 
              type="email" 
              required
              placeholder="admin@exemplo.com"
              className="w-full p-5 bg-[#0c0f08] border-2 border-transparent focus:border-[#c6ff1e]/50 focus:outline-none transition-all text-lg text-[#f2efe2] placeholder:text-[#c9c6b7]/20" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-oswald font-bold uppercase tracking-[0.2em] text-[#c6ff1e]/60">Senha</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full p-5 bg-[#0c0f08] border-2 border-transparent focus:border-[#c6ff1e]/50 focus:outline-none transition-all text-lg text-[#f2efe2] placeholder:text-[#c9c6b7]/20" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            disabled={loading}
            className="group relative w-full overflow-hidden bg-[#c6ff1e] py-6 text-2xl font-anton text-[#0c0f08] uppercase italic transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-[#c6ff1e]/10"
            style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)' }}
          >
            {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "ENTRAR"}
          </button>
        </form>
        
        <div className="pt-4 text-center">
          <a href="/" className="text-[#c9c6b7]/40 text-xs font-oswald uppercase tracking-widest hover:text-[#c6ff1e] transition-colors italic">
            « Voltar para o site
          </a>
        </div>
      </div>
    </div>
  );
}