import MenuComponent from "../parts/MenuComponent";
import { useLoaderData } from "react-router-dom";
import type { MenuItem } from "../interfaces/Menu";
import DeleteButton from "../parts/DeleteButton";
import { useAuth } from "../auth/AuthContext";

MenuPage.route = {
  path: '/menu',
  menuLabel: 'Menu',
  index: 3,
  loader: async () => await (await fetch("/api/menu_items")).json()
};

export default function MenuPage() {
  const items = useLoaderData() as MenuItem[];
  const groups = Object.groupBy(items, item => item.category ?? "Uncategorized");
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

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
            <div key={item.id} className="mb-3">
              <MenuComponent key={item.id} item={item} />
              {isAdmin && (
                <div className="text-center mb-3">
                  <DeleteButton id={item.id} name={item.name} />
                </div>
              )}

            </div>
          ))}

        </section>
      ))}
    </div>
  );
}
