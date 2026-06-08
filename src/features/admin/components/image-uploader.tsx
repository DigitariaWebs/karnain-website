"use client";

import { useState } from "react";
import Image from "next/image";
import { TrashIcon } from "@/components/ui/icons";
import { createSupabaseBrowserClient } from "@/core/supabase/client";

const BUCKET = "product-images";

type ImageUploaderProps = {
  /** Hidden field name; submits the comma-joined URLs (the action parses `images`). */
  name: string;
  initial: readonly string[];
  slug?: string;
};

/** Uploads product photos to Supabase Storage and tracks their public URLs. The first image
 * is the primary (card/gallery hero). Removing an image only drops it from the list. */
export function ImageUploader({ name, initial, slug }: ImageUploaderProps) {
  const [urls, setUrls] = useState<string[]>([...initial]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
        const path = `${slug || "fragrance"}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { contentType: file.type });
        if (uploadError) {
          setError(uploadError.message);
          continue;
        }
        uploaded.push(supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
      }
      if (uploaded.length) setUrls((prev) => [...prev, ...uploaded]);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={urls.join(", ")} readOnly />

      {urls.length > 0 ? (
        <ul className="flex flex-wrap gap-3">
          {urls.map((url, index) => (
            <li key={url} className="relative">
              <div className="relative size-24 overflow-hidden rounded-md border">
                <Image src={url} alt="" fill sizes="96px" className="object-cover" />
              </div>
              {index === 0 ? (
                <span className="bg-background/90 text-foreground absolute bottom-1 left-1 rounded px-1.5 py-0.5 text-[9px] tracking-wide uppercase">
                  Principale
                </span>
              ) : null}
              <button
                type="button"
                aria-label="Retirer l’image"
                onClick={() => setUrls((prev) => prev.filter((item) => item !== url))}
                className="bg-background text-muted-foreground hover:text-destructive focus-visible:ring-ring absolute -top-2 -right-2 inline-flex size-6 items-center justify-center rounded-full border outline-none focus-visible:ring-2"
              >
                <TrashIcon className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <input
        type="file"
        accept="image/*"
        multiple
        disabled={uploading}
        onChange={(event) => onFiles(event.target.files)}
        className="text-muted-foreground file:bg-secondary file:text-foreground hover:file:bg-accent block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-2 file:text-sm"
      />
      {uploading ? <p className="text-muted-foreground text-sm">Téléversement…</p> : null}
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
    </div>
  );
}
