export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

function getCandidateBaseUrls(): string[] {
  const envUrl = process.env.AGENTIC_API_URL?.trim();
  const candidates: string[] = [];
  if (envUrl) candidates.push(envUrl);
  if (!candidates.includes("http://localhost:8080")) candidates.push("http://localhost:8080");
  if (!candidates.includes("http://127.0.0.1:8080")) candidates.push("http://127.0.0.1:8080");
  if (!candidates.includes("http://localhost:8000")) candidates.push("http://localhost:8000");
  if (!candidates.includes("http://127.0.0.1:8000")) candidates.push("http://127.0.0.1:8000");
  return candidates;
}

function buildTargetUrl(baseUrl: string, slug: string[]): string {
  const path = slug.join("/");
  if (path === "health") {
    return `${baseUrl}/health`;
  }
  return `${baseUrl}/api/v1/${path}`;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await context.params;
  const baseUrls = getCandidateBaseUrls();
  let lastError: any = null;

  for (const baseUrl of baseUrls) {
    try {
      const targetUrl = buildTargetUrl(baseUrl, slug);
      const res = await fetch(targetUrl, {
        method: "GET",
        headers: {
          accept: "*/*",
        },
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);
      return NextResponse.json(data, { status: res.status });
    } catch (err: any) {
      lastError = err;
      continue;
    }
  }

  return NextResponse.json(
    {
      error: "Agent Docker injoignable",
      detail: lastError?.message || `Impossible de contacter l'agent sur ${baseUrls.join(" ou ")}`,
    },
    { status: 503 }
  );
}

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await context.params;
  const baseUrls = getCandidateBaseUrls();

  let bodyData: any = null;
  try {
    const text = await request.text();
    if (text && text.trim().length > 0) {
      bodyData = text;
    }
  } catch (_) {}

  const headers: Record<string, string> = {
    accept: "*/*",
  };
  if (bodyData) {
    headers["Content-Type"] = "application/json";
  }

  let lastError: any = null;

  for (const baseUrl of baseUrls) {
    try {
      const targetUrl = buildTargetUrl(baseUrl, slug);
      const res = await fetch(targetUrl, {
        method: "POST",
        headers,
        body: bodyData,
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);
      return NextResponse.json(data, { status: res.status });
    } catch (err: any) {
      lastError = err;
      continue;
    }
  }

  return NextResponse.json(
    {
      error: "Agent Docker injoignable",
      detail: lastError?.message || `Impossible de contacter l'agent sur ${baseUrls.join(" ou ")}`,
    },
    { status: 503 }
  );
}
