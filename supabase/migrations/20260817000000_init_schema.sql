-- Create custom types
CREATE TYPE public.registration_status AS ENUM ('registered', 'confirmed', 'checked_in', 'cancelled');

-- Create event settings table
CREATE TABLE public.event_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL DEFAULT 'VEM PEDALAR',
    event_date TEXT,
    event_time TEXT,
    event_location TEXT,
    event_distance TEXT,
    event_description TEXT,
    emergency_fields_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    terms_text TEXT NOT NULL DEFAULT 'Declaro que as informações fornecidas são verdadeiras.;Estou ciente das regras do evento.;Declaro estar ciente dos riscos envolvidos na participação do evento.;Comprometo-me a respeitar as orientações da organização.;Li e aceito os termos de participação.;Autorizo o uso da minha imagem para divulgação do evento.',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create registrations table
CREATE TABLE public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_number TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    birth_date DATE NOT NULL,
    city_neighborhood TEXT NOT NULL,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relation TEXT,
    terms_accepted BOOLEAN NOT NULL DEFAULT TRUE,
    status public.registration_status NOT NULL DEFAULT 'registered',
    check_in_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Grants
GRANT SELECT, INSERT ON public.registrations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registrations TO authenticated;
GRANT ALL ON public.registrations TO service_role;

GRANT SELECT ON public.event_settings TO anon;
GRANT SELECT, UPDATE ON public.event_settings TO authenticated;
GRANT ALL ON public.event_settings TO service_role;

-- RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;

-- Policies for registrations
CREATE POLICY "Public can create registrations" ON public.registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view their own registration via number" ON public.registrations FOR SELECT USING (true);
CREATE POLICY "Admins can manage registrations" ON public.registrations USING (true);

-- Policies for event_settings
CREATE POLICY "Public can view event settings" ON public.event_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update event settings" ON public.event_settings FOR UPDATE USING (true);

-- Seed default settings
INSERT INTO public.event_settings (event_name) VALUES ('VEM PEDALAR');

-- User roles setup
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
