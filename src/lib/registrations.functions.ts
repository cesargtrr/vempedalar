import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const registrationSchema = z.object({
  fullName: z.string().trim().min(3).max(120),
  whatsapp: z.string().trim().min(10).max(30),
  birthDate: z.string().min(1),
  cityNeighborhood: z.string().trim().min(2).max(120),
  emergencyContactName: z.string().trim().max(120).optional(),
  emergencyContactPhone: z.string().trim().max(30).optional(),
  emergencyContactRelation: z.string().trim().max(60).optional(),
  termsAccepted: z.boolean().refine((val) => val === true, "Você deve aceitar os termos"),
});

/**
 * Cria a inscrição com status 'pending_payment' e o pagamento 'pending'.
 * O número oficial (VEM-XXXX) NÃO é gerado aqui — apenas na confirmação manual pelo admin.
 */
export const submitRegistration = createServerFn({ method: "POST" })
  .inputValidator((data) => registrationSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: settings } = await supabaseAdmin
      .from("payment_settings")
      .select("registration_fee")
      .limit(1)
      .maybeSingle();

    const { data: eventSettings } = await supabaseAdmin
      .from("event_settings")
      .select("terms_version")
      .limit(1)
      .maybeSingle();

    const price = Number(settings?.registration_fee ?? 60);

    const { data: registration, error: regError } = await supabaseAdmin
      .from("registrations")
      .insert({
        registration_number: null,
        full_name: data.fullName,
        whatsapp: data.whatsapp,
        birth_date: data.birthDate,
        city_neighborhood: data.cityNeighborhood,
        emergency_contact_name: data.emergencyContactName ?? null,
        emergency_contact_phone: data.emergencyContactPhone ?? null,
        emergency_contact_relation: data.emergencyContactRelation ?? null,
        terms_accepted: data.termsAccepted,
        terms_accepted_at: new Date().toISOString(),
        terms_version: eventSettings?.terms_version ?? "1.0",
        status: "pending_payment",
      })
      .select("id")
      .single();

    if (regError) throw new Error(regError.message);

    const { error: payError } = await supabaseAdmin.from("payments").insert({
      registration_id: registration.id,
      amount: price,
      payment_method: "pix",
      payment_status: "pending",
      provider: "manual",
    });

    if (payError) throw new Error(payError.message);

    return { success: true, registrationId: registration.id };
  });

/** Dados públicos da tela de pagamento. */
export const getPaymentScreenData = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ registrationId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: registration, error } = await supabaseAdmin
      .from("registrations")
      .select("id, full_name, status, registration_number")
      .eq("id", data.registrationId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!registration) throw new Error("Inscrição não encontrada");

    const { data: payment } = await supabaseAdmin
      .from("payments")
      .select("id, amount, payment_status, rejection_reason")
      .eq("registration_id", registration.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: settings } = await supabaseAdmin
      .from("payment_settings")
      .select(
        "receiver_name, receiver_document, payment_type, pix_key, instructions, registration_fee, payment_qr_code_url, is_pix_active",
      )
      .limit(1)
      .maybeSingle();

    return {
      registration: {
        id: registration.id,
        fullName: registration.full_name,
        status: registration.status,
        registrationNumber: registration.status === "confirmed" ? registration.registration_number : null,
      },
      payment: payment
        ? {
            id: payment.id,
            amount: Number(payment.amount),
            status: payment.payment_status,
            rejectionReason: payment.rejection_reason,
          }
        : null,
      settings,
    };
  });

/** Participante declara que já efetuou o pagamento. */
export const declarePaymentSent = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ registrationId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: registration, error } = await supabaseAdmin
      .from("registrations")
      .select("id, status")
      .eq("id", data.registrationId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!registration) throw new Error("Inscrição não encontrada");
    if (registration.status === "confirmed" || registration.status === "checked_in") {
      return { success: true, status: registration.status };
    }

    await supabaseAdmin
      .from("payments")
      .update({ payment_status: "awaiting_confirmation", rejection_reason: null })
      .eq("registration_id", registration.id)
      .in("payment_status", ["pending", "rejected", "awaiting_confirmation"]);

    await supabaseAdmin
      .from("registrations")
      .update({ status: "awaiting_confirmation" })
      .eq("id", registration.id);

    return { success: true, status: "awaiting_confirmation" as const };
  });
