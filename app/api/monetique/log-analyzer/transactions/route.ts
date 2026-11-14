export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getFileTransactionsSummary, listLogFiles } from "@/modules/log-analyzer/store";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    let fileId = url.searchParams.get("fileId");

    if (!fileId) {
      const files = listLogFiles();
      if (files.length > 0) fileId = files[0].id;
    }

    if (!fileId) {
      return NextResponse.json({ transactions: [] });
    }

    const transactions = getFileTransactionsSummary(fileId, 50);
    return NextResponse.json({ transactions });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Impossible de lister les transactions", detail: err?.message },
      { status: 500 }
    );
  }
}
