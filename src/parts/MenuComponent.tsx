type MenuComponentProps = {
  id?: number;
  name: string;
  description?: string;
  imageUrl?: string;
  price_euro: number | string;
  vegetarian?: boolean;
  vegan?: boolean;
};

export default function MenuComponent({
  id,
  name,
  description,
  imageUrl,
  price_euro,
  vegetarian,
  vegan,
}: MenuComponentProps) {
  const priceNumber =
    typeof price_euro === "number" ? price_euro : Number(price_euro ?? 0);

  return (
    <div className="menu-component" data-id={id}>
      {imageUrl && <img src={imageUrl} alt={name} />}
      <h3>{name}</h3>
      {description && <p>{description}</p>}
      <p>Price: ${priceNumber.toFixed(2)}</p>
      <div>
        {vegetarian && <span className="badge">Vegetarian</span>}
        {vegan && <span className="badge">Vegan</span>}
      </div>
    </div>
  );
}
