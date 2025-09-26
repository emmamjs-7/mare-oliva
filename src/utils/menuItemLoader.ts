import { redirect, type LoaderFunctionArgs } from "react-router-dom";

export async function menuItemLoader({ params }: LoaderFunctionArgs) {
  const res = await fetch(`/api/menu_items/${params.id}`, { credentials: "include" });
  if (res.status === 404) return redirect("/menu");
  if (!res.ok) throw new Response("Not found", { status: res.status });
  return res.json();
}