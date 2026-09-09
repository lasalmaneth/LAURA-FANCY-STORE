import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isUserAdmin } from '@/lib/admin';

export async function updateSession(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  // For public storefront pages, do not block or query Supabase auth
  if (!isAdminRoute) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://klnotkmdtmfvfvblouug.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsbm90a21kdG1mdmZ2YmxvdXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MjI3OTksImV4cCI6MjEwMzI5ODc5OX0.HhSUl_ilxLCSu_y48CyX7_nFSC8Q0N2EjCZLTgtm5DU";

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userIsAdmin = isUserAdmin(user);

    // If attempting to access /admin routes without admin authorization
    if (isAdminRoute && !isLoginPage) {
      if (!user || !userIsAdmin) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }
    }

    // If visiting /admin/login while already authenticated as an admin
    if (isLoginPage && user && userIsAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
  } catch (err) {
    // If Supabase is unreachable, fail gracefully for admin pages
    if (isAdminRoute && !isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
