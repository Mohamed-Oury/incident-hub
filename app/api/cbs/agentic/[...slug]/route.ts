export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

const DOCKER_AGENT_BASE_URL = process.env.AGENTIC_API_URL || "http://localhost:8080";

function getTargetUrl(slug: string[]): string {
  const path = slug.join("/");
  if (path === "health") {
    return `${DOCKER_AGENT_BASE_URL}/health`;
  }
  return `${DOCKER_AGENT_BASE_URL}/api/v1/${path}`;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await context.params;
    const targetUrl = getTargetUrl(slug);

    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        accept: "*/*",
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Agent Docker injoignable",
        detail: error?.message || "Impossible de contacter l'agent sur http://localhost:8080",
      },
      { status: 503 }
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await context.params;
    const targetUrl = getTargetUrl(slug);

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

    const res = await fetch(targetUrl, {
      method: "POST",
      headers,
      body: bodyData,
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Agent Docker injoignable",
        detail: error?.message || "Impossible de contacter l'agent sur http://localhost:8080",
      },
      { status: 503 }
    );
  }
}
