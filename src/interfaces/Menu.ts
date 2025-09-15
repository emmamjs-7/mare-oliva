export interface MenuItem {
  price: number;
  sort_order?: number;
  id: number;
  name: string;
  description?: string;
  price_euro: number;
  priceLabel: string;
  vegetarian: boolean;
  vegan: boolean;
  allergens: string[];
  image_url?: string;
}

export interface CategoryGroup {
  id: number;
  name: string;
  items: MenuItem[];
}