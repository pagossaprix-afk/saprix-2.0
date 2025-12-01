"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type MediaItem = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp?: string;
  username?: string;
  like_count?: number;
  comments_count?: number;
};

export default function InstagramFeed({ username, initialLimit = 12 }: { username: string; initialLimit?: number }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(Math.min(6, initialLimit));
  const [selected, setSelected] = useState<number | null>(null);
  const online = useMemo(() => (typeof navigator !== "undefined" ? navigator.onLine : true), []);

  async function load(force = false) {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/instagram?limit=${initialLimit}${force ? "&force=true" : ""}`);
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t);
      }
      const data = await res.json();
      const list: MediaItem[] = Array.isArray(data?.data) ? data.data : [];
      setItems(list);
    } catch (e) {
      setError("No se pudo cargar el feed de Instagram");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(false);
  }, []);

  function showMore() {
    setVisible((v) => Math.min(v + 6, items.length || initialLimit));
  }

  function showLess() {
    setVisible((v) => Math.max(6, v - 6));
  }

  function prev() {
    if (selected === null) return;
    setSelected((i) => (i === null ? null : (i + items.length - 1) % items.length));
  }

  function next() {
    if (selected === null) return;
    setSelected((i) => (i === null ? null : (i + 1) % items.length));
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            @{username}
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={() => load(true)} className="px-3 py-2 bg-saprix-electric-blue text-white text-sm font-semibold rounded-md hover:bg-saprix-electric-blue-dark">
              Actualizar
            </button>
            <a href={`https://www.instagram.com/${username}/`} target="_blank" rel="noopener noreferrer" className="px-3 py-2 border border-gray-300 dark:border-gray-700 text-sm rounded-md">
              Ver perfil
            </a>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 p-4 text-red-700 dark:text-red-200 mb-6">
            {online ? "Error de API" : "Sin conexión a internet"}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && items.length === 0 && !error && (
          <div className="text-center text-gray-600 dark:text-gray-400">No hay publicaciones</div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.slice(0, visible).map((m, idx) => (
            <button key={m.id} onClick={() => setSelected(idx)} className="relative aspect-square group overflow-hidden bg-gray-100 dark:bg-gray-800">
              {m.media_type === "VIDEO" ? (
                <>
                  <Image src={m.thumbnail_url || m.media_url} alt={m.caption || "Video"} fill className="object-cover" />
                  <span className="absolute bottom-2 left-2 text-xs px-2 py-1 bg-black/60 text-white rounded">Video</span>
                </>
              ) : (
                <Image src={m.media_url} alt={m.caption || "Imagen"} fill className="object-cover" />
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 right-2 flex items-center gap-2 text-white text-xs">
                <span>❤ {m.like_count ?? 0}</span>
                <span>💬 {m.comments_count ?? 0}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          {visible < items.length && (
            <button onClick={showMore} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm">
              Mostrar más
            </button>
          )}
          {visible > 6 && (
            <button onClick={showLess} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm">
              Mostrar menos
            </button>
          )}
        </div>

        {selected !== null && items[selected] && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-square md:h-full bg-black">
                  {items[selected].media_type === "VIDEO" ? (
                    <video src={items[selected].media_url} controls preload="metadata" className="w-full h-full" />
                  ) : (
                    <Image src={items[selected].media_url} alt={items[selected].caption || "Post"} fill className="object-contain" />
                  )}
                </div>
                <div className="p-4 flex flex-col gap-3">
                  <a href={items[selected].permalink} target="_blank" rel="noopener noreferrer" className="text-saprix-electric-blue text-sm">Ver en Instagram</a>
                  <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {items[selected].caption || ""}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">❤ {items[selected].like_count ?? 0} · 💬 {items[selected].comments_count ?? 0}</div>
                  <div className="mt-auto flex items-center justify-between">
                    <button onClick={prev} className="px-3 py-2 rounded-md border">Anterior</button>
                    <button onClick={() => setSelected(null)} className="px-3 py-2 rounded-md border">Cerrar</button>
                    <button onClick={next} className="px-3 py-2 rounded-md border">Siguiente</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

