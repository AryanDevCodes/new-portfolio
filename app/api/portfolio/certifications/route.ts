import { NextResponse } from "next/server";
import { getAdminData } from "@/lib/admin-storage";
import { certifications as staticCerts } from "@/data/skills";

export async function GET() {
  try {
    // Try to get from Redis first
    const redisCerts = await getAdminData("certifications");
    if (redisCerts) {
      return NextResponse.json(redisCerts);
    }

    // Fallback to static data
    const adminCerts = staticCerts.map((cert) => ({
      title: cert.title,
      issuer: cert.issuer,
      url: cert.url,
      id: cert.id,
      date: cert.date,
    }));
    return NextResponse.json(adminCerts);
  } catch (error) {
    console.error("Error fetching certifications:", error);
    // Fallback to static data on error
    const adminCerts = staticCerts.map((cert) => ({
      title: cert.title,
      issuer: cert.issuer,
      url: cert.url,
      id: cert.id,
      date: cert.date,
    }));
    return NextResponse.json(adminCerts);
  }
}
