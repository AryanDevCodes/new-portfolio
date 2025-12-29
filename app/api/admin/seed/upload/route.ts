import { NextResponse } from "next/server";
import { setAdminData } from "@/lib/admin-storage";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate that the uploaded data has the expected structure
    const validKeys = ["skills", "certifications", "heroData", "socialLinks", "experience", "education", "mediumSettings", "featuredPosts"];
    const uploadedKeys = Object.keys(data);
    
    if (uploadedKeys.length === 0) {
      return NextResponse.json(
        { success: false, error: "No data provided in JSON file" },
        { status: 400 }
      );
    }

    // Filter only valid keys
    const keysToUpload = uploadedKeys.filter(key => validKeys.includes(key));
    
    if (keysToUpload.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid data keys found. Expected: " + validKeys.join(", ") },
        { status: 400 }
      );
    }

    // Upload each data section to Redis
    const results = await Promise.allSettled(
      keysToUpload.map(async (key) => {
        await setAdminData(key as any, data[key]);
        return { key, success: true };
      })
    );

    const successful = results.filter(r => r.status === "fulfilled").length;
    const failed = results.filter(r => r.status === "rejected").length;

    console.log(`✓ Uploaded ${successful} data keys from JSON file`);

    // Build details object
    const details: Record<string, string> = {};
    keysToUpload.forEach(key => {
      const value = data[key];
      if (Array.isArray(value)) {
        details[key] = `${value.length} items`;
      } else if (typeof value === "object") {
        details[key] = "✓";
      } else {
        details[key] = String(value);
      }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${successful} data sections from JSON file`,
      details,
      uploaded: keysToUpload,
      skipped: uploadedKeys.filter(k => !validKeys.includes(k)),
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload JSON data",
      },
      { status: 500 }
    );
  }
}
