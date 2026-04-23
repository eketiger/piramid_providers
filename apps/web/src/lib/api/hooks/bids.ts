"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Bid, BidQuoteBody, BidSummary } from "@piramid/types";
import { api } from "../client";

const BIDS_KEY = ["bids"] as const;

type ListFilters = {
  status?: string;
  vertical?: string;
  q?: string;
};

export function useBidsQuery(filters: ListFilters = {}) {
  return useQuery({
    queryKey: [...BIDS_KEY, filters],
    queryFn: async (): Promise<{ items: BidSummary[]; nextCursor: string | null }> => {
      const { data, error } = await api.GET("/bids", { params: { query: filters } });
      if (error) throw new Error("No pudimos cargar las licitaciones");
      return data;
    },
  });
}

export function useBidQuery(id: string | null) {
  return useQuery({
    queryKey: [...BIDS_KEY, id],
    enabled: Boolean(id),
    queryFn: async (): Promise<Bid> => {
      const { data, error } = await api.GET("/bids/{id}", {
        params: { path: { id: id! } },
      });
      if (error) throw new Error("No encontramos la licitación");
      return data;
    },
  });
}

export function useQuoteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: BidQuoteBody }) => {
      const { data, error } = await api.POST("/bids/{id}/quote", {
        params: { path: { id } },
        body,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: BIDS_KEY });
      qc.invalidateQueries({ queryKey: [...BIDS_KEY, vars.id] });
    },
  });
}
