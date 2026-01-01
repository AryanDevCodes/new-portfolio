import { NextResponse } from "next/server";
import { getAdminData } from "@/lib/admin-storage";

export async function GET() {
  try {
    // Get certifications from Redis
    const redisCerts = await getAdminData("certifications");
    if (redisCerts) {
      return NextResponse.json(redisCerts);
    }

    // Return empty array if not found in Redis
    return NextResponse.json([]);
  } catch (error) {
    console.error("Error fetching certifications from Redis:", error);
    return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 });
  }
}

