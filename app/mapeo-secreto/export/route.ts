import { getWooApi } from "@/lib/woocommerce";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const perPageParam = parseInt(searchParams.get("per_page") ?? "100");
    const per_page = Math.min(Math.max(perPageParam || 100, 1), 100);
    const type = searchParams.get("type") ?? undefined;
    const slug = searchParams.get("slug") ?? undefined;
    const search = searchParams.get("search") ?? undefined;

    const baseParams: any = {
      per_page,
      page: 1,
      orderby: "date",
      order: "desc",
    };
    if (type && type !== "all") baseParams.type = type;
    if (slug) baseParams.slug = slug;
    if (search) baseParams.search = search;

    // Primera llamada para obtener total de páginas
    const first = await getWooApi().get("products", baseParams);
    const totalPages = parseInt(first.headers?.["x-wp-totalpages"] ?? "1");
    const allProducts: any[] = Array.isArray(first.data) ? [...first.data] : [];

    // Traer el resto de páginas (si las hay)
    for (let page = 2; page <= totalPages; page++) {
      const resp = await getWooApi().get("products", { ...baseParams, page });
      if (Array.isArray(resp.data)) {
        allProducts.push(...resp.data);
      }
    }

    return new Response(JSON.stringify(allProducts, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="mapeo-completo.json"',
      },
    });
  } catch (e: any) {
    const message = e?.response?.data || e?.message || "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
