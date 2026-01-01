import { NextResponse } from "next/server";
import { deleteAdminData } from "@/lib/admin-storage";

const ALL_KEYS = [
  "personalInfo",
  "mediumSettings",
  "featuredPosts",
  "certifications",
  "skills",
  "heroData",
  "socialLinks",
  "experience",
  "education",
  "projects",
  "additionalProjects",
  "additionalData",
] as const;

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { success: false, error: "Missing 'key' parameter" },
        { status: 400 }
      );
    }

    // Validate key
    if (!ALL_KEYS.includes(key as any)) {
      return NextResponse.json(
        { success: false, error: `Invalid key: ${key}. Valid keys: ${ALL_KEYS.join(", ")}` },
        { status: 400 }
      );
    }

    // Delete single key
    await deleteAdminData(key as any);

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${key} from Redis`,
      details: {
        deleted: key,
      },
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete data",
      },
      { status: 500 }
    );
  }
}
