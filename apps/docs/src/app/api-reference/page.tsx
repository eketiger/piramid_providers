"use client";

// The API reference is rendered by Scalar and served from the API itself at
// /api/v1/reference. Here we simply iframe it so /api-reference on the docs
// site is a valid link — in production it typically points directly to the
// API host, but iframing means we can change the embed later without
// breaking bookmarks.
export default function ApiReferencePage() {
  const src = process.env.NEXT_PUBLIC_API_REFERENCE_URL ?? "http://localhost:4000/api/v1/reference";
  return (
    <main className="h-screen">
      <iframe
        src={src}
        title="Piramid Providers API Reference (Scalar)"
        className="h-full w-full border-0"
      />
    </main>
  );
}
