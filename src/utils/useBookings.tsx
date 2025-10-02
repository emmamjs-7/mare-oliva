import { useCallback, useEffect, useRef, useState } from "react";
import type { Booking } from "../types/bookings";
import toast from "react-hot-toast";

type Options = { date?: string; userId?: number | string | null; mine?: boolean; };

export function useBookings({ date, userId, mine = false }: Options = {}) {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const dateParam = (date ?? "").slice(0, 10);

  const refresh = useCallback(async () => {
    if (mine && (userId === null || userId === "")) {
      setItems([]);
      setLoading(false);
      setError(null);
      return;
    }

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setLoading(true);
    setError(null);

    try {
      const base = mine ? "/api/user_bookings" : "/api/bookings";
      const params = new URLSearchParams();

      if (dateParam) params.set("date", dateParam);
      if (mine && userId != null) params.set("user_id", String(userId));
      params.set("$order", "date,time");
      params.set("$limit", "1000");

      const url = `${base}?${params.toString()}`;
      const res = await fetch(url, { credentials: "include", signal: ac.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const rows = Array.isArray(data) ? (data as Booking[]) : [];

      const normalized = rows.map((b: any) => ({
        ...b,
        date: (b.date ?? "").slice(0, 10),
        time: (b.time ?? "").slice(0, 5),
      }));

      const getRowUserId = (r: any) =>
        r.user_id ?? r.userId ?? r.userid ?? r["user_id"] ?? r.user?.id ?? r.owner_id ?? r.ownerId;

      const ownerFiltered = mine && userId != null
        ? normalized.filter(b => String(getRowUserId(b)) === String(userId))
        : normalized;

      const dateFiltered = dateParam
        ? ownerFiltered.filter(b => b.date === dateParam)
        : ownerFiltered;

      dateFiltered.sort((a: any, b: any) =>
        a.date === b.date ? String(a.time).localeCompare(String(b.time))
          : String(a.date).localeCompare(String(b.date))
      );

      setItems(dateFiltered);
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        setItems([]);
        setError(e?.message ?? "Failed to load bookings");
      }
    } finally {
      if (abortRef.current === ac) setLoading(false);
    }
  }, [dateParam, mine, userId]);

  useEffect(() => {
    refresh();
    return () => abortRef.current?.abort();
  }, [refresh]);

  const remove = useCallback(async (id: number) => {
    setDeletingId(id);
    const prev = items;
    setItems(prev.filter(b => b.id !== id));
    try {
      const r = await fetch(`/api/bookings/${id}`, { method: "DELETE", credentials: "include" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
    } catch (e) {
      await refresh();
      throw e;
    } finally {
      setDeletingId(null);
      toast.success("Deleted");
    }
  }, [items, refresh]);

  const update = useCallback(async (
    id: number,
    patch: Partial<Pick<Booking, "name" | "date" | "time">>
  ) => {
    const normalize = (b: Booking): Booking => ({
      ...b,
      date: (b.date ?? "").slice(0, 10),
      time: (b.time ?? "").slice(0, 5),
    });

    const prev = items;
    const next = prev.map(b => (b.id === id ? normalize({ ...b, ...patch }) : b));
    setItems(next);

    try {
      const r = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      await refresh();
    } catch (e) {
      setItems(prev);
      throw e;
    }
  }, [items, refresh]);

  return { items, loading, error, refresh, remove, update, deletingId };
}
