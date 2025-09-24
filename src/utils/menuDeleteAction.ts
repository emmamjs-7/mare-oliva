import { type ActionFunctionArgs } from "react-router-dom";

export async function menuDeleteAction({ params }: ActionFunctionArgs) {
  const { id } = params;
  if (!id) throw new Error("Menu item ID is required");

  const res = await fetch(`/api/menu_items/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    });
  if (!res.ok) throw new Response("Failed to delete menu item", { status: res.status });

  return null;
}
