-- 1. New enum values
ALTER TYPE public.registration_status ADD VALUE IF NOT EXISTS 'pending_payment';
ALTER TYPE public.registration_status ADD VALUE IF NOT EXISTS 'awaiting_confirmation';
ALTER TYPE public.payment_status ADD VALUE IF NOT EXISTS 'awaiting_confirmation';

-- 2. payments: manual confirmation metadata
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS confirmed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS confirmed_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS rejection_reason text;

-- 3. registration_number only exists after confirmation
ALTER TABLE public.registrations ALTER COLUMN registration_number DROP NOT NULL;

-- 4. Atomic sequential registration number
CREATE SEQUENCE IF NOT EXISTS public.registration_number_seq START WITH 1;

CREATE OR REPLACE FUNCTION public.next_registration_number()
RETURNS text
LANGUAGE sql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'VEM-' || lpad(nextval('public.registration_number_seq')::text, 4, '0');
$$;

-- 5. payment_settings
CREATE TABLE IF NOT EXISTS public.payment_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  receiver_name text NOT NULL DEFAULT '',
  receiver_document text NOT NULL DEFAULT '',
  payment_type text NOT NULL DEFAULT 'pix',
  pix_key text NOT NULL DEFAULT '',
  instructions text NOT NULL DEFAULT '',
  registration_fee numeric NOT NULL DEFAULT 35.00,
  payment_qr_code_url text,
  is_pix_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.payment_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_settings TO authenticated;
GRANT ALL ON public.payment_settings TO service_role;

ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view payment settings"
  ON public.payment_settings FOR SELECT USING (true);

CREATE POLICY "Admins can insert payment settings"
  ON public.payment_settings FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update payment settings"
  ON public.payment_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_payment_settings_updated_at
  BEFORE UPDATE ON public.payment_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.payment_settings (receiver_name, receiver_document, pix_key, instructions, registration_fee)
SELECT 'VEM PEDALAR', '', '', 'Realize o Pix no valor da inscrição e clique em "Já realizei o pagamento". A organização confirmará manualmente.', 35.00
WHERE NOT EXISTS (SELECT 1 FROM public.payment_settings);

-- 6. Audit log writes by admins
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;

CREATE POLICY "Admins can insert logs"
  ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));