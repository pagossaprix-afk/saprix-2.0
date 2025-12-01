import { MappingItem } from "@/types/mapping";

function resolvePath(sample: any, path: string): any {
  const parts = path.split(".");
  let curr: any = sample;
  for (const part of parts) {
    if (curr === undefined || curr === null) return undefined;
    if (part.endsWith("[]")) {
      const key = part.slice(0, -2);
      const arr = curr?.[key];
      if (!Array.isArray(arr)) return undefined;
      curr = arr[0]; // Limitation: tomamos el primer elemento para preview/mapeo básico
    } else {
      curr = curr?.[part];
    }
  }
  return curr;
}

function safeEval(expression: string, context: Record<string, any>) {
  try {
    const keys = Object.keys(context);
    const values = Object.values(context);
    // eslint-disable-next-line no-new-func
    const fn = new Function(...keys, `return (${expression});`);
    return { ok: true, value: fn(...values) };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Expression error" };
  }
}

export function applyMapping(sample: any, mappings: MappingItem[]): Record<string, any> {
  const out: Record<string, any> = {};
  const ctx: Record<string, any> = {};
  for (const m of mappings) {
    let val: any = undefined;
    if (m.source) {
      val = resolvePath(sample, m.source);
    }
    if (val === undefined || val === null) {
      val = m.defaultValue ?? val;
    }
    out[m.label] = val;
    ctx[m.label] = val;
    if (m.source) ctx[m.source] = val;
  }
  for (const m of mappings) {
    if (m.computed) {
      const res = safeEval(m.computed, ctx);
      out[m.label] = res.ok ? res.value : null;
    }
  }
  return out;
}