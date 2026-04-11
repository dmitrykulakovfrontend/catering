import { MenuData, MenuStats, MenuItem } from '@/types';

function sumItems(items: MenuItem[]) {
  let cost = 0;
  let foodWeight = 0;
  let drinkVolume = 0;

  for (const item of items) {
    cost += item.pricePerUnit * item.quantity;
    if (item.weightUnit === 'г') {
      foodWeight += item.weight * item.quantity;
    } else {
      drinkVolume += item.weight * item.quantity;
    }
  }

  return { cost, foodWeight, drinkVolume };
}

export function calculateStats(data: MenuData): MenuStats {
  let menuCost = 0;
  let totalFoodWeight = 0;
  let totalDrinkVolume = 0;

  for (const category of data.banquet) {
    const result = sumItems(category.items);
    menuCost += result.cost;
    totalFoodWeight += result.foodWeight;
    totalDrinkVolume += result.drinkVolume;
  }

  const welcomeResult = sumItems(data.welcome);
  menuCost += welcomeResult.cost;
  totalFoodWeight += welcomeResult.foodWeight;
  totalDrinkVolume += welcomeResult.drinkVolume;

  let servicesCost = 0;
  for (const service of data.services) {
    servicesCost += service.isPerPerson
      ? service.price * data.persons
      : service.price * service.quantity;
  }

  return {
    menuCost,
    costPerPerson: Math.round(menuCost / data.persons),
    foodPerPerson: Math.round(totalFoodWeight / data.persons),
    drinksPerPerson: Math.round(totalDrinkVolume / data.persons),
    totalFoodWeight,
    totalDrinkVolume,
    servicesCost,
    grandTotal: menuCost + servicesCost,
  };
}

export function formatPrice(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0') + '\u00A0₽';
}

export function formatWeight(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0') + '\u00A0г';
}

export function formatVolume(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0') + '\u00A0мл';
}
