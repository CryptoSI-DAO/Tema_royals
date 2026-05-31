import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const supabaseResponse = await updateSession(request);

  if (supabaseResponse.headers.get("location")) {
    return supabaseResponse;
  }

  const pathname = request.nextUrl.pathname;
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/docs")
  ) {
    return supabaseResponse;
  }

  const i18nResponse = handleI18nRouting(request);
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    i18nResponse.cookies.set(cookie);
  });

  return i18nResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
