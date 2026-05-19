"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ImageUploadFieldProps = {
  /** Existing image URL to show as preview (from DB record) */
  currentUrl: string | null;
  /** Called when the user selects a new file (or clears it) */
  onFileSelected: (file: File | null) => void;
  /** Optional label text */
  label?: string;
};

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp";

export function ImageUploadField({
  currentUrl,
  onFileSelected,
  label = "Image",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;

      if (file) {
        setFileName(file.name);
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        onFileSelected(file);
      } else {
        setFileName(null);
        setPreview(null);
        onFileSelected(null);
      }
    },
    [onFileSelected]
  );

  const handleClear = useCallback(() => {
    setPreview(null);
    setFileName(null);
    onFileSelected(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [onFileSelected]);

  const displayUrl = preview || currentUrl;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {/* Preview */}
      {displayUrl && (
        <div className="relative w-24 h-24 rounded-lg overflow-hidden border bg-muted">
          <Image
            src={displayUrl}
            alt="Preview"
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      )}

      {/* File info + actions */}
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          onChange={handleFileChange}
          className="flex-1 text-sm"
        />
        {(preview || fileName) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
          >
            Clear
          </Button>
        )}
      </div>

      {fileName && (
        <p className="text-xs text-muted-foreground">
          Selected: {fileName}
        </p>
      )}
    </div>
  );
}
