"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Resource = "products" | "orders" | "customers";
type FieldPath = string; // e.g. "name", "billing.address_1", "line_items[].product_id"

type MappingItem = {
  id: string;
  source: FieldPath | null;
  label: string; // target field name
  type: "string" | "number" | "boolean" | "date" | "array" | "object" | "any";
  defaultValue?: string;
  computed?: string; // JS expression referencing labels or source paths
  errors?: string[];
};

type SchemaResponse = {
  resource: Resource;
  fields: FieldPath[];
  sample: any;
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function inferTypeFromSample(sample: any, path: FieldPath): MappingItem["type"] {
  // Very simple path resolver supporting dot and [] arrays
  const parts = path.split(".");
  let curr: any = sample;
  for (const part of parts) {
    if (!curr) break;
    if (part.endsWith("[]")) {
      const key = part.replace("[]", "");
      curr = Array.isArray(curr[key]) ? curr[key][0] : undefined;
    } else {
      curr = curr[part];
    }
  }

  const t = typeof curr;
  if (Array.isArray(curr)) return "array";
  if (curr === null || curr === undefined) return "any";
  if (t === "string") return "string";
  if (t === "number") return "number";
  if (t === "boolean") return "boolean";
  if (t === "object") return "object";
  return "any";
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

export default function ManualMapper() {
  const [resource, setResource] = useState<Resource>("products");
  const [schema, setSchema] = useState<SchemaResponse | null>(null);
  const [availableFields, setAvailableFields] = useState<FieldPath[]>([]);
  const [mappings, setMappings] = useState<MappingItem[]>([]);
  const [templateName, setTemplateName] = useState("");
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/woo-schema?resource=${resource}`);
      const data: SchemaResponse = await res.json();
      setSchema(data);
      setAvailableFields(data.fields);
    })();
  }, [resource]);

  const palette = useMemo(() => availableFields, [availableFields]);

  // Drag-and-drop: minimal native implementation
  function onDragStart(e: React.DragEvent<HTMLButtonElement>, field: FieldPath) {
    e.dataTransfer.setData("text/plain", field);
  }
  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const field = e.dataTransfer.getData("text/plain");
    if (!field) return;
    const type = schema ? inferTypeFromSample(schema.sample, field) : "any";
    setMappings((prev) => [
      ...prev,
      {
        id: uid(),
        source: field,
        label: field.split(".").pop() || field,
        type,
      },
    ]);
  }
  function allowDrop(e: React.DragEvent<HTMLDivElement>) { e.preventDefault(); }

  function updateMapping(id: string, patch: Partial<MappingItem>) {
    setMappings((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }
  function removeMapping(id: string) {
    setMappings((prev) => prev.filter((m) => m.id !== id));
  }
  function moveUp(index: number) {
    if (index <= 0) return;
    setMappings((prev) => {
      const copy = [...prev];
      [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
      return copy;
    });
  }
  function moveDown(index: number) {
    setMappings((prev) => {
      if (index >= prev.length - 1) return prev;
      const copy = [...prev];
      [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]];
      return copy;
    });
  }

  // Validation
  const validation = useMemo(() => {
    const errors: Record<string, string[]> = {};
    const labels = new Set<string>();
    mappings.forEach((m) => {
      const errs: string[] = [];
      if (!m.label || m.label.trim() === "") errs.push("Label requerido");
      if (labels.has(m.label)) errs.push("Label duplicado");
      labels.add(m.label);
      if (m.source === null && !m.computed) errs.push("Debe tener source o computed");
      if (!m.type) errs.push("Tipo requerido");
      // default value type check (basic)
      if (m.defaultValue) {
        const dv = m.defaultValue;
        try {
          if (m.type === "number" && isNaN(Number(dv))) errs.push("Default no es número");
          if (m.type === "boolean" && !["true", "false"].includes(dv.toLowerCase())) errs.push("Default no es boolean");
        } catch {}
      }
      // computed validation
      if (m.computed) {
        const ctx: Record<string, any> = {};
        mappings.forEach((mm) => {
          // expose by label and source
          ctx[mm.label] = "";
          if (mm.source) ctx[mm.source] = "";
        });
        const res = safeEval(m.computed, ctx);
        if (!res.ok) errs.push(`Computed inválido: ${res.error}`);
      }
      errors[m.id] = errs;
    });
    return errors;
  }, [mappings]);

  // Templates in localStorage
  function saveTemplate() {
    if (!templateName) return;
    if (typeof window === "undefined" || !("localStorage" in window)) return;
    const key = `saprix-mapping-${templateName}`;
    const payload = { resource, mappings };
    window.localStorage.setItem(key, JSON.stringify(payload));
  }
  function loadTemplate(name: string) {
    try {
      if (typeof window === "undefined" || !("localStorage" in window)) return;
      const raw = window.localStorage.getItem(`saprix-mapping-${name}`);
      if (!raw) return;
      const payload = JSON.parse(raw);
      if (payload.resource) setResource(payload.resource);
      if (Array.isArray(payload.mappings)) setMappings(payload.mappings);
    } catch {}
  }
  function listTemplates(): string[] {
    if (typeof window === "undefined" || !("localStorage" in window)) return [];
    const keys = Object.keys(window.localStorage);
    return keys.filter((k) => k.startsWith("saprix-mapping-")).map((k) => k.replace("saprix-mapping-", ""));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Palette */}
      <div className="md:col-span-1 bg-dark-performance-800 rounded-lg border border-saprix-indigo p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-saprix-white font-semibold">Campos disponibles</h2>
          <select
            value={resource}
            onChange={(e) => setResource(e.target.value as Resource)}
            className="bg-dark-performance-700 text-saprix-white border border-saprix-indigo rounded px-2 py-1"
          >
            <option value="products">Productos</option>
            <option value="orders">Pedidos</option>
            <option value="customers">Clientes</option>
          </select>
        </div>
        <div className="space-y-2 max-h-[50vh] overflow-auto">
          {palette.map((field) => (
            <button
              key={field}
              draggable
              onDragStart={(e) => onDragStart(e, field)}
              className="w-full text-left text-sm px-3 py-2 rounded bg-dark-performance-700 hover:bg-dark-performance-600 border border-saprix-indigo text-saprix-white"
            >
              {field}
            </button>
          ))}
        </div>
        {schema?.sample && (
          <div className="mt-4">
            <h3 className="text-saprix-indigo text-sm font-semibold mb-2">Muestra ({resource})</h3>
            <pre className="text-xs bg-dark-performance-900 p-2 rounded max-h-48 overflow-auto text-gray-300">
              {JSON.stringify(schema.sample, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Canvas */}
      <div className="md:col-span-2">
        <div
          ref={dropRef}
          onDrop={onDrop}
          onDragOver={allowDrop}
          className="min-h-[20vh] rounded-lg border-2 border-dashed border-saprix-indigo p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-saprix-white font-semibold">Esquema destino (arrastre campos aquí)</h2>
            <div className="flex items-center gap-2">
              <input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Nombre de plantilla"
                className="bg-dark-performance-700 text-saprix-white border border-saprix-indigo rounded px-2 py-1"
              />
              <button onClick={saveTemplate} className="px-3 py-1 rounded bg-saprix-electric-blue text-dark-performance-900 font-semibold">Guardar</button>
              <details className="relative">
                <summary className="cursor-pointer px-3 py-1 rounded bg-dark-performance-700 text-saprix-white border border-saprix-indigo">Cargar</summary>
                <div className="absolute right-0 mt-2 bg-dark-performance-800 border border-saprix-indigo rounded p-2 z-10">
                  {listTemplates().length === 0 && <div className="text-xs text-gray-400">No hay plantillas</div>}
                  {listTemplates().map((name) => (
                    <button key={name} onClick={() => loadTemplate(name)} className="block w-full text-left text-xs px-2 py-1 rounded hover:bg-dark-performance-700 text-saprix-white">
                      {name}
                    </button>
                  ))}
                </div>
              </details>
            </div>
          </div>

          {mappings.length === 0 && (
            <div className="text-sm text-gray-400">Sin campos. Arrastre desde la lista de la izquierda.</div>
          )}

          <div className="space-y-3">
            {mappings.map((m, idx) => (
              <div key={m.id} className="bg-dark-performance-800 border border-saprix-indigo rounded p-3">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  {m.source ? <span>Source: {m.source}</span> : <span>Source: (computed)</span>}
                  <span>•</span>
                  <span>Tipo: {m.type}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Label destino</label>
                    <input
                      value={m.label}
                      onChange={(e) => updateMapping(m.id, { label: e.target.value })}
                      className="w-full bg-dark-performance-700 text-saprix-white border border-saprix-indigo rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Tipo</label>
                    <select
                      value={m.type}
                      onChange={(e) => updateMapping(m.id, { type: e.target.value as MappingItem["type"] })}
                      className="w-full bg-dark-performance-700 text-saprix-white border border-saprix-indigo rounded px-2 py-1"
                    >
                      {(["string","number","boolean","date","array","object","any"] as const).map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Valor por defecto</label>
                    <input
                      value={m.defaultValue ?? ""}
                      onChange={(e) => updateMapping(m.id, { defaultValue: e.target.value })}
                      placeholder="Opcional"
                      className="w-full bg-dark-performance-700 text-saprix-white border border-saprix-indigo rounded px-2 py-1"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs text-gray-300 mb-1">Campo calculado (expresión JS)</label>
                  <input
                    value={m.computed ?? ""}
                    onChange={(e) => updateMapping(m.id, { computed: e.target.value })}
                    placeholder="Ej: price * quantity"
                    className="w-full bg-dark-performance-700 text-saprix-white border border-saprix-indigo rounded px-2 py-1"
                  />
                  <div className="text-xs text-gray-500 mt-1">Puedes referenciar por label o por path del source.</div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => moveUp(idx)} className="px-3 py-1 rounded bg-dark-performance-700 border border-saprix-indigo text-saprix-white">↑</button>
                  <button onClick={() => moveDown(idx)} className="px-3 py-1 rounded bg-dark-performance-700 border border-saprix-indigo text-saprix-white">↓</button>
                  <button onClick={() => removeMapping(m.id)} className="px-3 py-1 rounded bg-red-600 text-white">Eliminar</button>
                </div>

                {validation[m.id]?.length ? (
                  <ul className="mt-2 text-xs text-red-400 list-disc pl-5">
                    {validation[m.id].map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-2 text-xs text-green-400">OK</div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              onClick={() => setMappings((prev) => [...prev, { id: uid(), source: null, label: "computed_field", type: "any", computed: "", defaultValue: "" }])}
              className="px-4 py-2 rounded bg-saprix-electric-blue text-dark-performance-900 font-bold"
            >
              Crear campo calculado
            </button>
          </div>
        </div>

        {/* Preview mapping output against sample */}
        <div className="mt-6 bg-dark-performance-800 rounded-lg border border-saprix-indigo p-4">
          <h3 className="text-saprix-white font-semibold mb-2">Preview contra muestra</h3>
          <pre className="text-xs bg-dark-performance-900 p-2 rounded max-h-64 overflow-auto text-gray-300">
            {(() => {
              if (!schema?.sample) return "{}";
              const out: Record<string, any> = {};
              const ctx: Record<string, any> = {};
              mappings.forEach((m) => {
                // resolve source
                let val: any = undefined;
                if (m.source) {
                  const parts = m.source.split(".");
                  let curr: any = schema.sample;
                  for (const part of parts) {
                    if (!curr) break;
                    if (part.endsWith("[]")) {
                      const key = part.replace("[]", "");
                      curr = Array.isArray(curr[key]) ? curr[key][0] : undefined;
                    } else {
                      curr = curr[part];
                    }
                  }
                  val = curr;
                }
                if (val === undefined || val === null) {
                  val = m.defaultValue ?? val;
                }
                out[m.label] = val;
                ctx[m.label] = val;
                if (m.source) ctx[m.source] = val;
              });
              // computed resolve
              mappings.forEach((m) => {
                if (m.computed) {
                  const res = safeEval(m.computed, ctx);
                  out[m.label] = res.ok ? res.value : `(error: ${res.error})`;
                }
              });
              return JSON.stringify(out, null, 2);
            })()}
          </pre>
        </div>
      </div>
    </div>
  );
}