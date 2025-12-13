import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? null,
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? null,
  });
}