-- Fix function search_path for handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, subscription_plan)
  VALUES (new.id, new.email, 'free');
  RETURN new;
END;
$$;

-- Fix function search_path for handle_new_user_prefs
CREATE OR REPLACE FUNCTION public.handle_new_user_prefs()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.email_preferences (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$;

-- Fix function search_path for cleanup_old_data
CREATE OR REPLACE FUNCTION public.cleanup_old_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.tracking_events 
  WHERE timestamp < NOW() - INTERVAL '90 days';
END;
$$;

-- Move uuid-ossp extension to extensions schema if it exists in public
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp' 
    AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    ALTER EXTENSION "uuid-ossp" SET SCHEMA extensions;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL; -- Ignore errors if extension doesn't exist or can't be moved
END;
$$;