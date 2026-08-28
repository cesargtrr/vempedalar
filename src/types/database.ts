import type { Tables } from "@/integrations/supabase/types";

export type Registration = Tables<"registrations">;
export type EventSettings = Tables<"event_settings">;
export type RegistrationStatus = Registration["status"];
