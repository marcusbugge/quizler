import { NextResponse } from "next/server";

export async function GET() {
  // Sjekk om miljøvariabler er satt (skjuler faktiske verdier for sikkerhet)
  const environmentInfo = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? "✅ Satt"
      : "❌ Ikke satt",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
      ? "✅ Satt"
      : "❌ Ikke satt",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? "✅ Satt"
      : "❌ Ikke satt",
  };

  return NextResponse.json({
    message: "Miljøvariabel-status",
    environment: environmentInfo,
  });
}
