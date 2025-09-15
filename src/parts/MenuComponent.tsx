type MenuComponentProps = {
  id?: number;
  title: string;
  description?: string;
  imageUrl?: string;
  price: number | string;
  vegetarian?: boolean;
  vegan?: boolean;
};

export default function MenuComponent({
  id,
  title,
  description,
  imageUrl,
  price,
  vegetarian,
  vegan,
}: MenuComponentProps) {
  const priceNumber =
    typeof price === "number" ? price : Number(price ?? 0);

  return (
    <div className="menu-component" data-id={id}>
      {imageUrl && <img src={imageUrl} alt={title} />}
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      <p>Price: ${priceNumber.toFixed(2)}</p>
      <div>
        {vegetarian && <span className="badge">Vegetarian</span>}
        {vegan && <span className="badge">Vegan</span>}
      </div>
    </div>
  );
}
