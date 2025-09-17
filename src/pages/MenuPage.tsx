import MenuComponent from "../parts/MenuComponent";
import { useLoaderData } from "react-router-dom";
import type { MenuItem } from "../interfaces/Menu";

MenuPage.route = {
  path: '/menu',
  menuLabel: 'Menu',
  index: 3,
  loader: async () => await (await fetch("/api/menu_items")).json()
};

export default function MenuPage() {
  const items = useLoaderData() as MenuItem[];
  const groups = Object.groupBy(items, item => item.category ?? "Uncategorized");


  const desiredOrder = ["Antipasti", "Pasta", "Pizza", "Dolce"];
  const orderedCats = [
    ...desiredOrder.filter((c) => groups[c])
  ];

  return (
    <div>
      {orderedCats.map((cat) => (
        <section key={cat} className="mb-5">
          <h2 className="text-center mb-3">{cat}</h2>
          {(groups[cat] ?? []).map((item) => (
            <MenuComponent key={item.id} item={item} />
          ))}
        </section>
      ))}
    </div>
  );
}
