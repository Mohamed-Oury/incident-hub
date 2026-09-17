import { NextResponse } from "next/server";
import { clearSession } from "@/modules/auth/auth-service";

export async function POST() {
  await clearSession();
  return NextResponse.json({ success: true });
}
