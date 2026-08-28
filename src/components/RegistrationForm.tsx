import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, Loader2, Phone, User, Calendar, MapPin, CircleAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

const formSchema = z.object({
  full_name: z.string().min(3, "Nome muito curto"),
  whatsapp: z.string().min(10, "WhatsApp inválido"),
  birth_date: z.string().min(1, "Data de nascimento obrigatória"),
  city_neighborhood: z.string().min(2, "Cidade/Bairro obrigatório"),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  emergency_contact_relation: z.string().optional(),
  terms: z.array(z.boolean()).refine(vals => vals.every(v => v === true), "Você precisa aceitar todos os termos"),
});

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { data: settings } = useQuery({
    queryKey: ["event_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("event_settings").select("*").single();
      if (error) throw error;
      return data;
    },
  });

  const termsList = settings?.terms_text?.split(";") || [
    "Declaro que as informações fornecidas são verdadeiras.",
    "Estou ciente das regras do evento.",
    "Declaro estar ciente dos riscos envolvidos na participação do evento.",
    "Comprometo-me a respeitar as orientações da organização.",
    "Li e aceito os termos de participação.",
    "Autorizo o uso da minha imagem para divulgação do evento."
  ];

  const { register, handleSubmit, formState: { errors, isValid }, setValue } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      terms: new Array(6).fill(false)
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Inserção direta na tabela 'registrations' do Supabase
      const { data: registration, error } = await supabase
        .from("registrations")
        .insert([
          {
            full_name: data.full_name,
            whatsapp: data.whatsapp,
            birth_date: data.birth_date,
            city_neighborhood: data.city_neighborhood,
            emergency_contact_name: data.emergency_contact_name || null,
            emergency_contact_phone: data.emergency_contact_phone || null,
            emergency_contact_relation: data.emergency_contact_relation || null,
            terms_accepted: true,
            status: "pending_payment"
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Redireciona para a tela de pagamento com o ID inserido
      navigate({ to: "/pagamento/$id", params: { id: registration.id } });
    } catch (error: any) {
      console.error("Erro ao salvar inscrição:", error);
      alert(error?.message || "Erro ao realizar inscrição. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  const handlePhoneMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 10) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }

    e.target.value = value;
    setValue(e.target.name as any, value, { shouldValidate: true });
  };

  return (
    <div id="registration-form" className="bg-[#12160c] p-6 md:p-12 border-t-8 border-[#c6ff1e] space-y-10 shadow-2xl">
      <div className="space-y-3">
        <h2 className="text-5xl font-anton text-[#c6ff1e] uppercase italic tracking-tight leading-none">Garanta sua vaga</h2>
        <p className="text-[#c9c6b7] font-inter font-medium text-lg italic">Mais que um percurso, uma experiência que fica.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 font-inter">
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Nome */}
            <div className="space-y-2 md:col-span-1">
              <label className="flex items-center gap-2 text-xs font-oswald font-bold uppercase tracking-[0.2em] text-[#c6ff1e]/60 select-none">
                <User className="w-4 h-4 shrink-0" /> Nome completo
              </label>
              <input
                {...register("full_name")}
                placeholder="Digite seu nome completo"
                className={`w-full p-4 md:p-5 bg-[#0c0f08] border-2 ${errors.full_name ? 'border-[#e0693a]' : 'border-transparent'} focus:border-[#c6ff1e]/50 focus:outline-none transition-all text-base md:text-lg font-inter text-[#f2efe2] placeholder:text-[#c9c6b7]/30 rounded-none`}
              />
              {errors.full_name && (
                <p className="text-[#e0693a] text-sm font-bold flex items-center gap-1 mt-1">
                  <CircleAlert className="w-4 h-4 shrink-0" /> {errors.full_name.message as string}
                </p>
              )}
            </div>

            {/* Nascimento */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-oswald font-bold uppercase tracking-[0.2em] text-[#c6ff1e]/60">
                <Calendar className="w-4 h-4" /> Data de nascimento
              </label>
              <input
                type="date"
                {...register("birth_date")}
                className={`w-full p-4 md:p-5 bg-[#0c0f08] border-2 ${errors.birth_date ? 'border-[#e0693a]' : 'border-transparent'} focus:border-[#c6ff1e]/50 focus:outline-none transition-all text-base md:text-lg font-inter text-[#f2efe2] [color-scheme:dark]`}
              />
              {errors.birth_date && <p className="text-[#e0693a] text-sm font-bold flex items-center gap-1"><CircleAlert className="w-4 h-4" /> {errors.birth_date.message as string}</p>}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* WhatsApp */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-oswald font-bold uppercase tracking-[0.2em] text-[#c6ff1e]/60">
                <Phone className="w-4 h-4" /> WhatsApp / Telefone
              </label>
              <input
                {...register("whatsapp")}
                placeholder="(00) 00000-0000"
                onChange={handlePhoneMask}
                className={`w-full p-4 md:p-5 bg-[#0c0f08] border-2 ${errors.whatsapp ? 'border-[#e0693a]' : 'border-transparent'} focus:border-[#c6ff1e]/50 focus:outline-none transition-all text-base md:text-lg font-inter text-[#f2efe2] placeholder:text-[#c9c6b7]/30`}
              />
              {errors.whatsapp && <p className="text-[#e0693a] text-sm font-bold flex items-center gap-1"><CircleAlert className="w-4 h-4" /> {errors.whatsapp.message as string}</p>}
            </div>

            {/* Cidade/Bairro */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-oswald font-bold uppercase tracking-[0.2em] text-[#c6ff1e]/60">
                <MapPin className="w-4 h-4" /> Cidade / Bairro
              </label>
              <input
                {...register("city_neighborhood")}
                placeholder="Ex: Curitiba / Centro"
                className={`w-full p-4 md:p-5 bg-[#0c0f08] border-2 ${errors.city_neighborhood ? 'border-[#e0693a]' : 'border-transparent'} focus:border-[#c6ff1e]/50 focus:outline-none transition-all text-base md:text-lg font-inter text-[#f2efe2] placeholder:text-[#c9c6b7]/30`}
              />
              {errors.city_neighborhood && <p className="text-[#e0693a] text-sm font-bold flex items-center gap-1"><CircleAlert className="w-4 h-4" /> {errors.city_neighborhood.message as string}</p>}
            </div>
          </div>
        </div>

        {/* Emergência (Condicional) */}
        {settings?.emergency_fields_enabled && (
          <div className="space-y-6 animate-in slide-in-from-top-4 duration-500 pt-6 border-t border-[#c6ff1e]/10">
            <div className="space-y-1">
              <h3 className="text-xl font-anton text-[#c6ff1e] uppercase italic tracking-tight">Contato de Emergência</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-oswald font-bold uppercase tracking-[0.2em] text-[#c6ff1e]/40">Nome do Contato</label>
                <input
                  {...register("emergency_contact_name")}
                  className="w-full p-5 bg-[#0c0f08] border-2 border-transparent focus:border-[#c6ff1e]/50 focus:outline-none transition-all text-lg font-inter text-[#f2efe2]"
                />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-oswald font-bold uppercase tracking-[0.2em] text-[#c6ff1e]/40">Telefone</label>
                  <input
                    {...register("emergency_contact_phone")}
                    onChange={handlePhoneMask}
                    className="w-full p-5 bg-[#0c0f08] border-2 border-transparent focus:border-[#c6ff1e]/50 focus:outline-none transition-all text-lg font-inter text-[#f2efe2]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-oswald font-bold uppercase tracking-[0.2em] text-[#c6ff1e]/40">Parentesco / Relação</label>
                  <input
                    {...register("emergency_contact_relation")}
                    className="w-full p-5 bg-[#0c0f08] border-2 border-transparent focus:border-[#c6ff1e]/50 focus:outline-none transition-all text-lg font-inter text-[#f2efe2]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Termos */}
        <div className="space-y-6 pt-6 border-t border-[#c6ff1e]/10">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-anton text-[#c6ff1e] uppercase italic tracking-tight">Termos de participação</h3>
            <div className="flex-1 h-px bg-[#c6ff1e]/20" />
          </div>
          <div className="space-y-3">
            {termsList.map((term, i) => (
              <label key={i} className="flex items-start gap-4 p-4 hover:bg-[#0c0f08] transition-all cursor-pointer group border border-transparent hover:border-[#c6ff1e]/10 select-none">
                <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    {...register(`terms.${i}` as any)}
                    className={`peer appearance-none w-6 h-6 border-2 ${errors.terms ? 'border-[#e0693a]' : 'border-[#c6ff1e]/30'} bg-transparent checked:bg-[#c6ff1e] checked:border-[#c6ff1e] transition-all cursor-pointer rounded-none`}
                  />
                  <Check className="absolute w-4 h-4 text-[#0c0f08] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none stroke-[4px]" />
                </div>
                <span className="text-sm md:text-base font-inter font-medium leading-relaxed text-[#c9c6b7] group-hover:text-[#f2efe2] transition-colors pt-px">
                  {term}
                </span>
              </label>
            ))}
          </div>
          {errors.terms && <p className="text-[#e0693a] text-sm font-bold flex items-center gap-1"><CircleAlert className="w-4 h-4" /> {errors.terms.message as string}</p>}
        </div>

        <div className="flex justify-center pt-4">
          <button
            disabled={!isValid || isSubmitting}
            className="group relative w-full md:w-auto md:min-w-[300px] overflow-hidden bg-[#c6ff1e] py-6 px-12 text-2xl font-anton text-[#0c0f08] uppercase italic transition-all hover:scale-[1.02] hover:bg-[#c6ff1e]/90 active:scale-95 disabled:opacity-50 disabled:grayscale shadow-xl shadow-[#c6ff1e]/10 flex items-center justify-center gap-4 focus:ring-4 focus:ring-[#c6ff1e]/20 outline-none"
            style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)' }}
          >
            {isSubmitting ? <Loader2 className="animate-spin w-8 h-8" /> : "FINALIZAR INSCRIÇÃO"}
          </button>
        </div>
      </form>
    </div>
  );
}