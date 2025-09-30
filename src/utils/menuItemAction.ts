import toast from "react-hot-toast";
import { redirect, type ActionFunctionArgs } from "react-router-dom";

export async function menuItemAction({ params, request }: ActionFunctionArgs) {
  const method = request.method.toUpperCase();

  if (method === "POST" || method === "PUT" || method === "PATCH") {
    const fd = await request.formData();

    const price = Number(String(fd.get("price_euro") ?? "").replace(",", "."));
    if (!Number.isFinite(price) || price < 1) {
      toast.error("Minimum price is 1.00 €");
      return Response.json({ formError: "Price must be at least 1.00 €" }, { status: 400 });
    }

    const body = {
      name: String(fd.get("name") ?? "").trim(),
      description: (fd.get("description") as string) || null,
      category: (fd.get("category") as string) || null,
      price_euro: price,
    };

    const url = method === "POST" ? "/api/menu_items" : `/api/menu_items/${params.id}`;

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      toast.error(method === "POST" ? "Create failed" : "Update failed");
      return Response.json(
        { formError: method === "POST" ? "Create failed" : "Update failed" },
        { status: res.status }
      );
    }

    toast.success(method === "POST" ? "Dish created" : "Dish updated");
    return redirect("/menu");
  }

  if (method === "DELETE") {
    const res = await fetch(`/api/menu_items/${params.id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      toast.error("Delete failed");
      return Response.json({ formError: "Delete failed" }, { status: res.status });
    }

    toast.success("Dish deleted");
    return redirect("/menu");
  }

  return Response.json({ formError: "Method Not Allowed" }, { status: 405 });
}
