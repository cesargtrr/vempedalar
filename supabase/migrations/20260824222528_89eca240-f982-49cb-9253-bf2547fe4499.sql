REVOKE ALL ON FUNCTION public.next_registration_number() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.next_registration_number() FROM anon;
REVOKE ALL ON FUNCTION public.next_registration_number() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.next_registration_number() TO service_role;