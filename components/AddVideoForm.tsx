"use client";

import { FormEvent, useState } from "react";

interface AddVideoFormProps {
  onAdd: (url: string) => Promise<void>;
}

export function AddVideoForm({ onAdd }: AddVideoFormProps) {
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!url.trim()) {
      setError("Please enter a Google Drive URL.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onAdd(url);
      setMessage("Video added to playlist.");
      setUrl("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not add this video.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-4" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium text-slate-200" htmlFor="video-url">
        Add Google Drive video URL
      </label>
      <div className="flex gap-2">
        <input
          id="video-url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://drive.google.com/file/d/.../view"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
          aria-label="Google Drive URL"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Adding..." : "Add"}
        </button>
      </div>
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
    </form>
  );
}
