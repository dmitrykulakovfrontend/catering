export interface MenuItem {
  id: string;
  name: string;
  description: string;
  weight: number;
  weightUnit: 'г' | 'мл';
  quantity: number;
  pricePerUnit: number;
  image: string;
}

export interface MenuCategory {
  id: string;
  title: string;
  items: MenuItem[];
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isPerPerson: boolean;
}

export interface ClientInfo {
  name: string;
  phone: string;
  createdAt: string;
}

export interface MenuData {
  eventTitle: string;
  eventTime: string;
  persons: number;
  client: ClientInfo;
  banquet: MenuCategory[];
  welcome: MenuItem[];
  services: ServiceItem[];
}

export interface MenuStats {
  menuCost: number;
  costPerPerson: number;
  foodPerPerson: number;
  drinksPerPerson: number;
  totalFoodWeight: number;
  totalDrinkVolume: number;
  servicesCost: number;
  grandTotal: number;
}
