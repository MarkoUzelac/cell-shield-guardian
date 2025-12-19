-- Fix SUPA_security_definer_view: Recreate user_usage_stats as SECURITY INVOKER
DROP VIEW IF EXISTS public.user_usage_stats;

CREATE VIEW public.user_usage_stats
WITH (security_invoker = true)
AS
SELECT u.id AS user_id,
    u.subscription_plan,
    count(tl.id) AS links_created,
    CASE
        WHEN (u.subscription_plan = 'pro'::text) THEN 1000
        WHEN (u.subscription_plan = 'enterprise'::text) THEN 999999
        ELSE 5
    END AS links_limit,
    COALESCE(sum(tl.visit_count), (0)::bigint) AS total_visits
FROM public.users u
LEFT JOIN public.tracking_links tl ON (u.id = tl.user_id)
GROUP BY u.id;

-- Fix SUPA_rls_disabled_in_public and SUPA_policy_exists_rls_disabled
-- Enable RLS on visitor_alert_limits (policy already exists)
ALTER TABLE public.visitor_alert_limits ENABLE ROW LEVEL SECURITY;