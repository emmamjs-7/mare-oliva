import toast from "react-hot-toast";
import { redirect, type ActionFunctionArgs } from "react-router-dom";

export async function menuItemAction({ params, request }: ActionFunctionArgs) {
  const method = request.method.toUpperCase();

  if (method === "POST") {
    const fd = await request.formData();
    const body = {
      name: String(fd.get("name") ?? ""),
      description: (fd.get("description") as string) || null,
      category: (fd.get("category") as string) || null,
      price_euro: Number(fd.get("price_euro")),
    };

    const res = await fetch("/api/menu_items", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Response("Create failed", { status: res.status });
    toast.success("Dish created successfully");
    return redirect("/menu");
  }

  const id = params.id;
  if (!id) throw new Response("Menu item ID is required", { status: 400 });

  if (method === "PUT" || method === "PATCH") {
    const fd = await request.formData();
    const body = {
      name: String(fd.get("name") ?? ""),
      description: (fd.get("description") as string) || null,
      category: (fd.get("category") as string) || null,
      price_euro: Number(fd.get("price_euro")),
    };

    const res = await fetch(`/api/menu_items/${id}`, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Response("Update failed", { status: res.status });
    toast.success("Dish updated successfully");
    return redirect("/menu");
  }

  if (method === "DELETE") {
    const res = await fetch(`/api/menu_items/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Response("Delete failed", { status: res.status });
    toast.success("Dish deleted successfully");
    return redirect("/menu");
  }

  throw new Response("Method Not Allowed", { status: 405 });
}
