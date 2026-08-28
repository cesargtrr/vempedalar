import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Check, Copy, Loader2, Clock, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/pagamento/$id")({
  head: () => ({
    meta: [
      { title: "Pagamento da inscrição | Vem Pedalar" },
      { name: "description", content: "Finalize sua inscrição no Vem Pedalar pagando via Pix e informe o pagamento realizado." },
      { property: "og:title", content: "Pagamento da inscrição | Vem Pedalar" },
      { property: "og:description", content: "Finalize sua inscrição no Vem Pedalar pagando via Pix." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PaymentPage,
});

const money = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function PaymentPage() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);

  // Busca os dados da inscrição e das configurações direto do Supabase
  const { data, isLoading, error } = useQuery({
    queryKey: ["payment-screen", id],
    queryFn: async () => {
      // 1. Busca a inscrição
      const { data: registration, error: regError } = await supabase
        .from("registrations")
        .select("*")
        .eq("id", id)
        .single();

      if (regError || !registration) throw regError || new Error("Inscrição não encontrada");

      // 2. Busca as configurações do evento
      const { data: settings } = await supabase
        .from("event_settings")
        .select("*")
        .single();

      // 3. Busca o pagamento associado (se houver)
      const { data: payment } = await supabase
        .from("payments")
        .select("*")
        .eq("registration_id", id)
        .maybeSingle();

      return { registration, settings, payment };
    },
  });

  // Atualiza o status da inscrição para 'awaiting_confirmation' ao clicar no botão
  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("registrations")
        .update({ status: "awaiting_confirmation" })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payment-screen", id] }),
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#080a05] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#c6ff1e]" />
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-[#080a05] flex items-center justify-center p-6">
        <p className="text-[#f2efe2] font-inter text-lg">Inscrição não encontrada.</p>
      </main>
    );
  }

  const settings = data.settings;
  const amount = data.payment?.amount ?? Number(settings?.registration_fee ?? 60);
  const status = data.registration.status;
  const copyValue = "98 99146-3792";

  const handleCopy = async () => {
    if (!copyValue) return;

    try {
      // 1. Tenta usar a API moderna do Clipboard
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(copyValue);
      } else {
        // 2. Fallback para HTTP / IPs locais / Navegadores sem suporte a clipboard
        const textArea = document.createElement("textarea");
        textArea.value = copyValue;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand("copy");
        textArea.remove();

        if (!successful) {
          throw new Error("Falha ao copiar com execCommand");
        }
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Erro ao copiar chave Pix:", err);
    }
  };

  const awaiting = status === "awaiting_confirmation" || mutation.isSuccess;
  const confirmed = status === "confirmed" || status === "checked_in";
  const rejected = data.payment?.status === "rejected";

  return (
    <main className="min-h-screen bg-[#080a05] py-12 px-4 flex flex-col items-center justify-center font-inter text-[#f2efe2]">
      <div className="w-full max-w-md space-y-8">
        {/* Cabeçalho */}
        <header className="space-y-1 text-center">
          <h1 className="text-5xl md:text-6xl font-anton uppercase italic text-[#c6ff1e] leading-none tracking-wider">
            Vem Pedalar
          </h1>
          <p className="font-oswald uppercase tracking-[0.2em] text-xs md:text-sm text-[#c9c6b7]">
            {confirmed ? "Inscrição confirmada" : awaiting ? "Pagamento em análise" : "Finalize sua inscrição"}
          </p>
        </header>

        {confirmed ? (
          <section className="bg-[#12160c] border-t-4 border-[#c6ff1e] p-8 text-center space-y-5 shadow-2xl">
            <Check className="w-14 h-14 mx-auto text-[#c6ff1e] stroke-[3px]" />
            <h2 className="text-3xl font-anton uppercase italic text-[#f2efe2]">Inscrição confirmada</h2>
            {data.registration.registration_number && (
              <div className="text-5xl font-anton italic text-[#c6ff1e] tracking-tight">
                {data.registration.registration_number}
              </div>
            )}
          </section>
        ) : awaiting ? (
          <section className="bg-[#12160c] border-t-4 border-[#c6ff1e] p-8 text-center space-y-5 shadow-2xl">
            <Clock className="w-14 h-14 mx-auto text-[#c6ff1e]" />
            <h2 className="text-3xl font-anton uppercase italic text-[#f2efe2]">Pagamento em análise</h2>
            <p className="text-[#c9c6b7] text-sm leading-relaxed">
              Recebemos sua solicitação de confirmação. Nossa equipe irá verificar o pagamento realizado.
              Após a confirmação, sua inscrição será liberada.
            </p>
          </section>
        ) : (
          <section className="bg-[#12160c] border-t-4 border-[#c6ff1e] p-6 md:p-8 space-y-6 shadow-2xl">
            {rejected && (
              <div className="border border-[#e0693a]/40 bg-[#e0693a]/10 p-4 space-y-1">
                <p className="flex items-center gap-2 font-anton uppercase italic text-[#e0693a]">
                  <XCircle className="w-5 h-5" /> Pagamento não confirmado
                </p>
                {data.payment?.rejection_reason && (
                  <p className="text-xs text-[#c9c6b7]">{data.payment.rejection_reason}</p>
                )}
              </div>
            )}

            {/* Valor */}
            <div className="text-center space-y-1">
              <p className="text-xs font-oswald font-bold uppercase tracking-[0.2em] text-[#c6ff1e]/70">
                Valor da inscrição
              </p>
              <div className="text-5xl font-anton italic text-[#c6ff1e] leading-none">
                {money(amount)}
              </div>
            </div>

            <div className="h-px bg-[#c6ff1e]/10 w-full" />

            {/* Seção Pix */}
            <div className="space-y-4">
              <h2 className="text-xl font-anton uppercase italic text-[#f2efe2] tracking-wide">
                Pague via Pix
              </h2>

              {settings?.payment_qr_code_url && (
                <img
                  src={settings.payment_qr_code_url}
                  alt="QR Code Pix"
                  loading="lazy"
                  className="w-48 h-48 mx-auto bg-white p-2"
                />
              )}

              {settings?.receiver_name && (
                <p className="text-sm text-[#c9c6b7]">
                  Recebedor: <strong className="text-[#f2efe2]">{settings.receiver_name}</strong>
                </p>
              )}

              <p className="text-xs text-[#c9c6b7]/80 leading-relaxed">
                Realize o Pix no valor da inscrição e clique em "Já realizei o pagamento". A organização confirmará manualmente.
              </p>

              {/* Chave Pix */}
              {copyValue && (
                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] font-oswald uppercase tracking-[0.2em] text-[#c6ff1e]/70 font-bold block">
                    Chave Pix / Copia e Cola
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={copyValue}
                      className="w-full bg-[#0c0f08] border border-[#c6ff1e]/20 p-3 text-xs font-mono text-[#f2efe2] focus:outline-none truncate select-all"
                    />
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="bg-[#c6ff1e] hover:bg-[#b0e619] text-[#0c0f08] font-anton text-sm uppercase px-4 py-3 flex items-center gap-1.5 shrink-0 transition-all active:scale-95 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 stroke-[3]" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-px bg-[#c6ff1e]/10 w-full" />

            {/* Confirmação */}
            <div className="space-y-4">
              <p className="text-xs text-[#c9c6b7]/80 leading-relaxed">
                Após realizar o pagamento de {money(amount)}, clique no botão abaixo para informar que o pagamento foi realizado. Sua inscrição será analisada pela organização.
              </p>

              <button
                disabled={mutation.isPending}
                onClick={() => mutation.mutate()}
                className="w-full bg-[#c6ff1e] hover:bg-[#b0e619] text-[#0c0f08] font-anton text-xl italic uppercase py-4 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#c6ff1e]/10 cursor-pointer"
              >
                {mutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "JÁ REALIZEI O PAGAMENTO"}
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}