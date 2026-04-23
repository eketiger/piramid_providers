/**
 * TODO(Phase 3 CI): generate this file automatically by running
 *   pnpm --filter @piramid/api swagger:export
 * and piping the resulting openapi.json through `openapi-typescript`.
 *
 * Hand-authored minimal subset for now so the web app can compile and we can
 * exercise openapi-fetch against the real NestJS endpoints.
 */

import type {
  AuthResponse,
  LoginBody,
  RegisterBody,
  Bid,
  BidSummary,
  BidQuoteBody,
  ErrorBody,
  Provider,
  ProviderUpdateBody,
} from "@piramid/types";

type Paginated<T> = { items: T[]; nextCursor: string | null };

type BidListQuery = {
  status?: string;
  vertical?: string;
  q?: string;
  cursor?: string;
  limit?: number;
};

export interface paths {
  "/auth/register": {
    post: {
      requestBody: { content: { "application/json": RegisterBody } };
      responses: {
        201: { content: { "application/json": AuthResponse } };
        400: { content: { "application/json": ErrorBody } };
        409: { content: { "application/json": ErrorBody } };
      };
    };
  };
  "/auth/login": {
    post: {
      requestBody: { content: { "application/json": LoginBody } };
      responses: {
        200: { content: { "application/json": AuthResponse } };
        401: { content: { "application/json": ErrorBody } };
      };
    };
  };
  "/auth/me": {
    get: {
      responses: {
        200: { content: { "application/json": { user: AuthResponse["user"] } } };
        401: { content: { "application/json": ErrorBody } };
      };
    };
  };
  "/providers/me": {
    get: {
      responses: {
        200: { content: { "application/json": Provider } };
        404: { content: { "application/json": ErrorBody } };
      };
    };
    patch: {
      requestBody: { content: { "application/json": ProviderUpdateBody } };
      responses: {
        200: { content: { "application/json": Provider } };
      };
    };
  };
  "/bids": {
    get: {
      parameters: { query?: BidListQuery };
      responses: {
        200: { content: { "application/json": Paginated<BidSummary> } };
      };
    };
  };
  "/bids/{id}": {
    get: {
      parameters: { path: { id: string } };
      responses: {
        200: { content: { "application/json": Bid } };
        404: { content: { "application/json": ErrorBody } };
      };
    };
  };
  "/bids/{id}/quote": {
    post: {
      parameters: { path: { id: string } };
      requestBody: { content: { "application/json": BidQuoteBody } };
      responses: {
        200: { content: { "application/json": Bid } };
        409: { content: { "application/json": ErrorBody } };
      };
    };
  };
}
