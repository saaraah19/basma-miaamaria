import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// Called by the admin panel after a successful content/project/service
// mutation. Guarded by a shared secret so this can't be triggered publicly —
// hitting it for free would let anyone force-bust your ISR cache.
export async function POST(request) {
  const { tag, secret } = await request.json().catch(() => ({}));

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  if (!tag) {
    return NextResponse.json({ error: "Tag manquant." }, { status: 400 });
  }

  revalidateTag(tag);
  return NextResponse.json({ revalidated: true, tag });
}