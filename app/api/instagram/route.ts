import { NextResponse } from "next/server";

const IG_FIELDS = [
  "id",
  "caption",
  "media_type",
  "media_url",
  "thumbnail_url",
  "permalink",
  "timestamp",
  "username",
  "like_count",
  "comments_count",
].join(",");

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limitParam = url.searchParams.get("limit");
    const force = url.searchParams.get("force") === "true";
    const limit = Number(limitParam) > 0 ? Number(limitParam) : 12;

    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    const igUserId = process.env.INSTAGRAM_IG_USER_ID;

    if (!token || !igUserId) {
      return NextResponse.json(
        { error: "Missing Instagram configuration" },
        { status: 500 }
      );
    }

    const apiUrl = `https://graph.instagram.com/${igUserId}/media?fields=${IG_FIELDS}&access_token=${token}&limit=${limit}`;
    const res = await fetch(apiUrl, {
      method: "GET",
      cache: force ? "no-store" : "force-cache",
      next: force ? { revalidate: 0 } : { revalidate: 300 },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Instagram API error", details: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    const items = Array.isArray(data?.data) ? data.data : [];
    return new NextResponse(JSON.stringify({ data: items }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": force
          ? "no-store"
          : "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Unexpected error", details: String(e) },
      { status: 500 }
    );
  }
}

