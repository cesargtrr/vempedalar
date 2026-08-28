import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const paymentSettingsSchema = z.object({
  receiver_name: z.string().trim().max(160),
  receiver_document: z.string().trim().max(60),
  payment_type: z.string().trim().max(60),
  pix_key: z.string().trim().max(255),
  instructions: z.string().trim().max(2000),
  registration_fee: z.number().nonnegative().max(100000),
  payment_qr_code_url: z.string().trim().max(1000).nullable().optional(),
  is_pix_active: z.boolean(),
});

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

/** Lista pagamentos com dados do participante. */
export const listPayments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data, error } = await supabaseAdmin
      .from("payments")
      .select(
        "id, amount, payment_status, rejection_reason, paid_at, confirmed_at, created_at, registration_id, registrations(id, full_name, whatsapp, city_neighborhood, registration_number, status)",
      )
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  });

/** Confirma o pagamento manualmente e gera o número oficial da inscrição. */
export const confirmPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ paymentId: z.string().uuid(), notes: z.string().max(500).optional() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: payment, error: payErr } = await supabaseAdmin
      .from("payments")
      .select("id, registration_id, payment_status")
      .eq("id", data.paymentId)
      .maybeSingle();

    if (payErr) throw new Error(payErr.message);
    if (!payment || !payment.registration_id) throw new Error("Pagamento não encontrado");

    const { data: registration, error: regErr } = await supabaseAdmin
      .from("registrations")
      .select("id, registration_number, status")
      .eq("id", payment.registration_id)
      .single();

    if (regErr) throw new Error(regErr.message);

    let registrationNumber = registration.registration_number;
    if (!registrationNumber) {
      const { data: generated, error: seqErr } = await supabaseAdmin.rpc("next_registration_number");
      if (seqErr) throw new Error(seqErr.message);
      registrationNumber = generated as string;
    }

    const now = new Date().toISOString();

    const { error: updPayErr } = await supabaseAdmin
      .from("payments")
      .update({
        payment_status: "approved",
        paid_at: now,
        confirmed_at: now,
        confirmed_by: context.userId,
        rejection_reason: null,
      })
      .eq("id", payment.id);
    if (updPayErr) throw new Error(updPayErr.message);

    const { error: updRegErr } = await supabaseAdmin
      .from("registrations")
      .update({ status: "confirmed", registration_number: registrationNumber })
      .eq("id", registration.id);
    if (updRegErr) throw new Error(updRegErr.message);

    await supabaseAdmin.from("audit_logs").insert({
      user_id: context.userId,
      action: "payment_confirmed",
      entity_type: "payment",
      entity_id: payment.id,
      details: {
        admin_id: context.userId,
        payment_id: payment.id,
        registration_id: registration.id,
        registration_number: registrationNumber,
        notes: data.notes ?? null,
      },
    });

    return { success: true, registrationNumber };
  });

/** Recusa o pagamento, salvando o motivo. Não gera número de inscrição. */
export const rejectPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({ paymentId: z.string().uuid(), reason: z.string().trim().min(3).max(500) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: payment, error: payErr } = await supabaseAdmin
      .from("payments")
      .select("id, registration_id")
      .eq("id", data.paymentId)
      .maybeSingle();
    if (payErr) throw new Error(payErr.message);
    if (!payment) throw new Error("Pagamento não encontrado");

    const { error: updErr } = await supabaseAdmin
      .from("payments")
      .update({
        payment_status: "rejected",
        rejection_reason: data.reason,
        confirmed_at: new Date().toISOString(),
        confirmed_by: context.userId,
        paid_at: null,
      })
      .eq("id", payment.id);
    if (updErr) throw new Error(updErr.message);

    await supabaseAdmin.from("audit_logs").insert({
      user_id: context.userId,
      action: "payment_rejected",
      entity_type: "payment",
      entity_id: payment.id,
      details: {
        admin_id: context.userId,
        payment_id: payment.id,
        registration_id: payment.registration_id,
        reason: data.reason,
      },
    });

    return { success: true };
  });

/** Atualiza as configurações de pagamento (somente admin). */
export const savePaymentSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => paymentSettingsSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existing } = await supabaseAdmin
      .from("payment_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    const payload = {
      ...data,
      payment_qr_code_url: data.payment_qr_code_url || null,
    };

    if (existing) {
      const { error } = await supabaseAdmin.from("payment_settings").update(payload).eq("id", existing.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("payment_settings").insert(payload);
      if (error) throw new Error(error.message);
    }

    await supabaseAdmin.from("audit_logs").insert({
      user_id: context.userId,
      action: "payment_settings_updated",
      entity_type: "payment_settings",
      details: { admin_id: context.userId },
    });

    return { success: true };
  });
