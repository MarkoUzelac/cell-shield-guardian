import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Home, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background bg-grid px-6 py-16">
      <div className="w-full max-w-md rounded-xl border border-border bg-card/60 p-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15">
          <ShieldAlert className="h-7 w-7 text-primary" aria-hidden="true" />
        </div>
        <h1 className="mb-3 text-2xl font-semibold text-foreground sm:text-3xl">
          {t("pages.notFound.title")}
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">{t("pages.notFound.message")}</p>
        <Button asChild className="min-h-[44px] w-full sm:w-auto">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" aria-hidden="true" />
            {t("pages.notFound.backHome")}
          </Link>
        </Button>
        <p className="mt-6 break-all font-mono text-[11px] text-muted-foreground/70">
          {location.pathname}
        </p>
      </div>
    </main>
  );
};

export default NotFound;
