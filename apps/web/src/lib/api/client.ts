"use client";

import createClient from "openapi-fetch";
import type { Middleware } from "openapi-fetch";
import type { paths } from "./types";

let authToken: string | null = null;

const authMiddleware: Middleware = {
  onRequest({ request }) {
    if (authToken) {
      request.headers.set("Authorization", `Bearer ${authToken}`);
    }
    return request;
  },
};

/**
 * Singleton API client. Base URL comes from NEXT_PUBLIC_API_BASE; falls back to
 * the local Nest dev server when unset.
 */
export const api = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api/v1",
  credentials: "include",
});
api.use(authMiddleware);

export function setAuthToken(token: string | null) {
  authToken = token;
}
