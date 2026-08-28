import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getFinancialSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleError) throw new Error(roleError.message);
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: payments } = await supabaseAdmin.from("payments").select("amount, payment_status");

    const sumBy = (status: string) =>
      (payments ?? [])
        .filter((p) => p.payment_status === status)
        .reduce((acc, p) => acc + Number(p.amount ?? 0), 0);

    const countBy = (status: string) => (payments ?? []).filter((p) => p.payment_status === status).length;

    const confirmedRevenue = sumBy("approved");
    const pendingAmount = sumBy("pending");
    const awaitingConfirmationAmount = sumBy("awaiting_confirmation");
    const rejectedAmount = sumBy("rejected");

    const { data: paidExpenses } = await supabaseAdmin
      .from("expenses")
      .select("amount")
      .eq("expense_status", "paid");

    const totalExpenses = (paidExpenses ?? []).reduce((acc, e) => acc + Number(e.amount ?? 0), 0);

    const { count: totalReg } = await supabaseAdmin
      .from("registrations")
      .select("*", { count: "exact", head: true });

    const { count: confirmedReg } = await supabaseAdmin
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("status", "confirmed");

    const { count: checkins } = await supabaseAdmin
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("status", "checked_in");

    return {
      confirmedRevenue,
      pendingAmount,
      awaitingConfirmationAmount,
      rejectedAmount,
      totalExpenses,
      balance: confirmedRevenue - totalExpenses,
      counts: {
        pending: countBy("pending"),
        awaitingConfirmation: countBy("awaiting_confirmation"),
        rejected: countBy("rejected"),
        approved: countBy("approved"),
      },
      registrations: {
        total: totalReg ?? 0,
        confirmed: confirmedReg ?? 0,
        checkins: checkins ?? 0,
      },
    };
  });
