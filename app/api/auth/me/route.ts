import { NextResponse } from "next/server";
import { getSession } from "@/modules/auth/auth-service";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user });
}
