import { useEffect, useState } from "react";
import MenuComponent from "../parts/MenuComponent";


MenuPage.route = {
  path: '/menu',
  menuLabel: 'Menu',
  index: 3
};

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/menu_items")
      .then(async (res) => {
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
