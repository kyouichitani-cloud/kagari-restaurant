import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { MICROCMS_CACHE_TAG } from "@/content/microcms";

export async function POST(request: NextRequest) {
  const secret = process.env.MICROCMS_WEBHOOK_SECRET?.trim();
  if (!secret) return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });

  const body = await request.text();
  const signature = request.headers.get("x-microcms-signature");
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const signatureBuffer = Buffer.from(signature ?? "", "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  revalidateTag(MICROCMS_CACHE_TAG);
  revalidatePath("/");
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
