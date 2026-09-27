import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as { role?: string })?.role || "";

  const isGateKeeperRoute = nextUrl.pathname.startsWith("/scan");
  const isOrganizerRoute =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/events/new") ||
    nextUrl.pathname.startsWith("/tickets/issue");

  if (!isLoggedIn && (isGateKeeperRoute || isOrganizerRoute)) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn) {
    if (isGateKeeperRoute && !["GATEKEEPER", "ORGANIZER", "ADMIN"].includes(userRole)) {
      return NextResponse.redirect(new URL("/events", nextUrl));
    }

    if (isOrganizerRoute && !["ORGANIZER", "ADMIN"].includes(userRole)) {
      return NextResponse.redirect(new URL("/my-tickets", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/scan/:path*", "/dashboard/:path*", "/events/new", "/tickets/issue"],
};