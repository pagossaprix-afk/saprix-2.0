import { NextResponse } from "next/server";
import { getWooApi } from "@/lib/woocommerce-edge";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type Resource = "products" | "orders" | "customers";

function flattenFields(obj: any, prefix = "", acc: Set<string> = new Set()): Set<string> {
  if (obj && typeof obj === "object") {
    if (Array.isArray(obj)) {
      // For arrays, inspect first item
      if (obj.length > 0) {
        flattenFields(obj[0], `${prefix}[]`, acc);
      } else {
        acc.add(`${prefix}[]`);
      }
      return acc;
    }
    for (const key of Object.keys(obj)) {
      const path = prefix ? `${prefix}.${key}` : key;
      const val = obj[key];
      if (val !== null && typeof val === "object") {
        flattenFields(val, path, acc);
      } else {
        acc.add(path);
      }
    }
  }
  return acc;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const resource = (searchParams.get("resource") as Resource) || "products";
    const perPage = Number(searchParams.get("per_page") || "1");

    const valid: Resource[] = ["products", "orders", "customers"];
    if (!valid.includes(resource)) {
      return NextResponse.json({ error: "Invalid resource" }, { status: 400 });
    }

    const response = await getWooApi().get(resource, { per_page: perPage });
    const data = response.data || [];
    const sample = Array.isArray(data) ? data[0] : data;
    if (!sample) {
      return NextResponse.json({ fields: [], sample: null });
    }

    const fields = Array.from(flattenFields(sample)).sort();

    return NextResponse.json({ resource, fields, sample });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch Woo schema", message: error?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
