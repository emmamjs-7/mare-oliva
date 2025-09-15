// MenuPage.tsx
import { useEffect, useState } from "react";
import MenuComponent from "../parts/menuComponent"; // OBS: rätt casing

console.log("[MenuPage] modul laddad"); // 1: körs när filen importeras

MenuPage.route = {
  path: '/menu',
  menuLabel: 'Menu',
  index: 1
};

export default function MenuPage() {
  console.log("[MenuPage] render");      // 2: körs vid varje render

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[MenuPage] useEffect start"); // 3: körs efter mount
    fetch("/api/menu_items")
      .then(async (res) => {
        console.log("[MenuPage] fetch status", res.status, res.url);
        const text = await res.text();
        if (!res.ok) throw new Error(`${res.status} ${res.statusText} ${text}`);
        setMenuItems(JSON.parse(text));
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <div>{menuItems.map((x: any) => <MenuComponent key={x.id} {...x} />)}</div>;
}
